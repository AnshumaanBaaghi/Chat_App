const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const {
  email_validator,
  username_validator,
  generateOTP,
} = require("../utils/commonFunc");
const bcrypt = require("bcrypt");
const { TOKEN_NAME } = require("../constants");
const { sendMail } = require("../utils/mail");
const { FriendRequest } = require("../models/friendRequest.model");

const register = async (req, res) => {
  const { email, password, username, name } = req.body;
  if (!email || !password || !username || !name) {
    return res.status(400).json({
      status: "error",
      message: "name, email, password and username are required!",
    });
  }
  if (!email_validator(email) || !username_validator(username)) {
    return res.status(400).json({
      status: "error",
      message: "Email or Username format is not correct",
    });
  }
  try {
    const checkUserEmail = await User.findOne({ email });
    if (checkUserEmail) {
      return res.status(400).json({
        status: "error",
        message: "Email already exist!",
      });
    }
    const checkUserUsername = await User.findOne({ username });
    if (checkUserUsername) {
      return res.status(400).json({
        status: "error",
        message: "Username already exist!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 9);

    const user = await User.create({
      email,
      name,
      password: hashedPassword,
      username,
    });

    const registeredUser = await User.findById(user._id).select(
      "-password -resetPasswordToken -emailVerificationToken -emailVerificationExpiry"
    );

    res.send({
      status: "success",
      user: registeredUser,
      message: "Users registered successfully",
    });
  } catch (error) {
    res.send(error);
  }
};

const login = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  if (!emailOrUsername || !password) {
    return res.status(400).json({
      status: "error",
      message: "email/username and password are required!",
    });
  }
  try {
    const user = await User.findOne({
      $or: [{ username: emailOrUsername }, { email: emailOrUsername }],
    });
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User doesn't exist with this email or username",
      });
    }
    // check password
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.status(400).json({
        status: "error",
        message: "Invalid Password",
      });
    }

    const loggedInUser = await User.findById(user._id).select(
      "-password -resetPasswordToken -emailVerificationToken -emailVerificationExpiry"
    );

    const token = user.generateAccessToken();
    return res.status(200).cookie(TOKEN_NAME, token).json({
      status: "success",
      user: loggedInUser,
      isEmailVerified: user.isEmailVerified,
      message: "login success",
    });
  } catch (error) {
    res.send(error);
  }
};

const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.send({
      status: "error",
      message: "Email is required!",
    });
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User doesn't exist",
      });
    }
    const otp = generateOTP();
    await sendMail(email, otp);
    let expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 5);
    const encryptedOtp = jwt.sign(otp, process.env.JWT_SECERETKEY);

    user.emailVerificationToken = encryptedOtp;
    user.emailVerificationExpiry = expiryTime;
    await user.save();
    res.send({
      status: "success",
      message: "OTP sent successfully on your Email",
    });
  } catch (error) {
    res.send(error);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        status: "error",
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User Not Found!",
      });
    }
    if (!user.emailVerificationToken) {
      return res.status(400).json({
        status: "error",
        message: "Token Expired!",
      });
    }
    const originalOtp = jwt.verify(
      user.emailVerificationToken,
      process.env.JWT_SECERETKEY
    );

    if (otp !== originalOtp) {
      return res.status(400).json({
        status: "error",
        message: "Invalid OTP",
      });
    }
    if (user.emailVerificationExpiry < new Date()) {
      return res.status(400).json({
        status: "error",
        message: "OTP Expired!",
      });
    }
    user.emailVerificationToken = null;
    user.emailVerificationExpiry = null;
    user.isEmailVerified = true;
    await user.save();
    const token = user.generateAccessToken();
    res
      .status(200)
      .cookie(TOKEN_NAME, token)
      .json({
        status: "success",
        message: "OTP verified successfully!",
        user: {
          userId: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          unreadMessages: user.unreadMessages,
        },
      });
  } catch (error) {
    res.send({ a: "a", error });
  }
};

const userDetails = async (req, res) => {
  return res.status(200).json({ status: "success", user: req.user });
};

const updateUser = async (req, res) => {
  const value = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, value);
    return res.status(200).json({
      status: "success",
      message: "User Details Updated",
      updatedUser,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const getUsers = async (req, res, next) => {
  const all_users = await User.find({ isEmailVerified: true }).select(
    "username email _id"
  );
};

const searchNewFriends = async (req, res) => {
  try {
    const sentRequests = await FriendRequest.find({ sender: req.user._id });
    const friendRequests = await FriendRequest.find({
      recipient: req.user._id,
    });

    const new_friends = await User.aggregate([
      {
        $match: {
          $and: [
            {
              _id: {
                $ne: req.user._id,
              },
            },
            { _id: { $nin: req.user.friends.map((id) => id) } },
            { _id: { $nin: sentRequests.map((obj) => obj.recipient) } },
            { _id: { $nin: friendRequests.map((obj) => obj.sender) } },
            { isEmailVerified: true },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: 1,
          username: 1,
          email: 1,
          avatar: 1,
        },
      },
    ]);

    res.status(200).json({ data: new_friends });
  } catch (error) {
    console.error("Error searching for new friends:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const friendRequests = await FriendRequest.aggregate([
      {
        $match: {
          recipient: req.user._id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $unwind: "$sender",
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              "$sender",
              {
                requestId: "$_id",
                userId: "$sender._id",
              },
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          username: 1,
          avatar: 1,
          requestId: 1,
          userId: 1,
        },
      },
    ]);
    res.status(200).json({ data: friendRequests });
  } catch (error) {
    console.log("error:", error);
    res.status(400).json(error);
  }
};

const getFriends = async (req, res) => {
  try {
    const friends = await User.aggregate([
      {
        $match: {
          _id: req.user._id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "friends",
          foreignField: "_id",
          as: "friendDetails",
        },
      },
      {
        $unwind: "$friendDetails",
      },
      {
        $project: {
          _id: 0,
          userId: "$friendDetails._id",
          name: "$friendDetails.name",
          username: "$friendDetails.username",
          email: "$friendDetails.email",
          avatar: "$friendDetails.avatar",
        },
      },
    ]);

    res.status(200).json({ data: friends });
  } catch (error) {
    console.log("error:", error);
    res.status(400).json(error);
  }
};

const getSentRequests = async (req, res) => {
  try {
    const sentRequests = await FriendRequest.aggregate([
      {
        $match: {
          sender: req.user._id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "recipient",
          foreignField: "_id",
          as: "recipient",
        },
      },
      {
        $unwind: "$recipient",
      },
      {
        $replaceRoot: {
          newRoot: "$recipient",
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: 1,
          username: 1,
          avatar: 1,
        },
      },
    ]);
    res.status(200).json({ data: sentRequests });
  } catch (error) {
    console.log("error:", error);
    res.status(400).json(error);
  }
};

const deleteUnreadMessages = async (req, res) => {
  const { chatId } = req.params;
  if (!chatId) {
    return res.status(400).json({ message: "chatId is required" });
  }
  try {
    const user = await User.findById(req.user._id);
    if (user && user.unreadMessages) {
      const obj = { ...user.unreadMessages };
      delete obj[chatId];
      await User.findByIdAndUpdate(req.user._id, { unreadMessages: obj });

      res.status(200).json({ message: "Message marked as read" });
    } else {
      res
        .status(404)
        .json({ message: "User not found or unreadMessages not found" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = {
  login,
  register,
  sendOtp,
  verifyOtp,
  userDetails,
  updateUser,
  getUsers,
  searchNewFriends,
  getFriendRequests,
  getFriends,
  getSentRequests,
  deleteUnreadMessages,
};
