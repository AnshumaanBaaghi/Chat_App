const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { username_validator, email_validator } = require("../utils/commonFunc");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: username_validator,
        message:
          "Username should only contains alphabets, underscore or Numbers",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: email_validator,
        message: "Invalid Email Format",
      },
    },
    avatar: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    passwordUpdatedAt: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    unreadMessages: { type: Object, default: {} },
  },
  { timestamps: true }
);

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      avatar: this.avatar,
      name: this.name,
    },
    process.env.JWT_SECERETKEY
  );
};

const User = new mongoose.model("User", userSchema);

module.exports = { User };
