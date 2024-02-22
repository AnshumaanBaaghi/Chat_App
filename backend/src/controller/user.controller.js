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

    const otp = generateOTP();
    console.log("otp:", otp);
    const token = jwt.sign({ userId: user._id }, "SECRETKEY");
    let expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 5);
    const encryptedOtp = jwt.sign(otp, "SECRETKEY");

    user.emailVerificationToken = encryptedOtp;
    user.emailVerificationExpiry = expiryTime;
    await user.save();
    res.send({
      status: "success",
      message:
        "Users registered successfully and verification code has been sent on your email.",
      token,
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
      message: "email, password and username are required!",
    });
  }
  if (
    !email_validator(emailOrUsername) &&
    !username_validator(emailOrUsername)
  ) {
    return res.status(400).json({
      status: "error",
      message: "Email or Username format is not correct",
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
    if (user.isEmailVerified) {
      // add access token here
      return res.status(200).json({
        status: "success",
        message: "login success",
      });
    }
    const otp = generateOTP();
    console.log("otp:", otp);
    const token = jwt.sign({ userId: user._id }, "SECRETKEY");
    let expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 5);
    const encryptedOtp = jwt.sign(otp, "SECRETKEY");

    user.emailVerificationToken = encryptedOtp;
    user.emailVerificationExpiry = expiryTime;
    await user.save();
    res.send({
      status: "success",
      message: "Verification code has been sent on your email.",
      token,
    });
  } catch (error) {
    res.send(error);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { otpToken, otp } = req.body;
    if (!otpToken || !otp) {
      return res.status(400).json({
        status: "error",
        message: "Token is not provided!",
      });
    }
    const { userId } = jwt.verify(otpToken, "SECRETKEY");

    const user = await User.findById(userId);
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
module.exports = { login, register, verifyOtp };
