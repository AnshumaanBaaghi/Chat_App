const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const {
  email_validator,
  username_validator,
  generateOTP,
} = require("../utils/commonFunc");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({
      status: "error",
      message: "email, password and username are required!",
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
        message: "User is not exist with this email or username",
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
      return res.status(200).cookie("AccessToken", token).json({
        status: "success",
        user: loggedInUser,
        message: "login success",
      });
    }

    res.status(200).json({
      status: "success",
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
      res.send({
        status: "error",
        message: "User doesn't exist",
      });
    }
    const otp = generateOTP();
    console.log("otp:", otp);
    let expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 5);
    const encryptedOtp = jwt.sign(otp, "SECRETKEY");

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
    const originalOtp = jwt.verify(user.emailVerificationToken, "SECRETKEY");

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
    res.status(200).send({
      status: "success",
      message: "OTP verified successfully!",
      user: { username: user.username, email: user.email, avatar: user.avatar },
    });
  } catch (error) {
    res.send({ a: "a", error });
  }
};

module.exports = { login, register, sendOtp, verifyOtp };
