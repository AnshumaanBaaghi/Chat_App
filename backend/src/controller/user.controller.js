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
    console.log("user:", user);

    res.send({
      status: "success",
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

    if (user.isEmailVerified) {
      // add access token here
      const token = user.generateAccessToken();
      return res.status(200).cookie(TOKEN_NAME, token).json({
        status: "success",
        user: loggedInUser,
        message: "login success",
      });
    }

    res.status(200).json({
      status: "success",
      email: user.email,
      message: "Email is not verified",
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
    console.log("token:", token);
    res
      .status(200)
      .cookie(TOKEN_NAME, token)
      .json({
        status: "success",
        message: "OTP verified successfully!",
        user: {
          name: user.name,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        },
      });
  } catch (error) {
    res.send({ a: "a", error });
  }
};

const userDetails = async (req, res) => {
  const token = req.cookies;
  try {
    if (!token[TOKEN_NAME]) {
      return res
        .status(200)
        .json({ status: "success", message: "Token doesn't exist" });
    }
    const user = jwt.verify(token[TOKEN_NAME], process.env.JWT_SECERETKEY);
    return res.status(200).json({ status: "success", user });
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
          ],
        },
      },
      {
        $project: {
          name: 1,
          username: 1,
          email: 1,
          avatar: 1,
        },
      },
    ]);

    console.log("new_friends:", new_friends);
    res.status(200).json({ data: new_friends });
  } catch (error) {
    console.error("Error searching for new friends:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    // const requests = await FriendRequest.find({
    //   recipient: req.user._id,
    // }).populate("sender", "_id name username");

    const requests = await FriendRequest.aggregate([
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
        $project: {
          sender: {
            $arrayElemAt: ["$sender", 0],
          },
        },
      },
      {
        $project: {
          "sender._id": 1,
          "sender.name": 1,
          "sender.username": 1,
        },
      },
    ]);
    req.status(200).json({ requests });
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
        $project: {
          friendDetails: {
            $map: {
              input: "$friendDetails",
              as: "friend",
              in: {
                name: "$$friend.name",
                username: "$$friend.username",
                email: "$$friend.email",
                avatar: "$$friend.avatar",
              },
            },
          },
        },
      },
    ]);
    req.status(200).json({ friends });
  } catch (error) {
    console.log("error:", error);
    res.status(400).json(error);
  }
};

module.exports = {
  login,
  register,
  sendOtp,
  verifyOtp,
  userDetails,
  getUsers,
  searchNewFriends,
  getFriendRequests,
  getFriends,
};
