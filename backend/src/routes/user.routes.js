const { Router } = require("express");
const {
  register,
  login,
  verifyOtp,
  sendOtp,
  userDetails,
} = require("../controller/user.controller");
const { User } = require("../models/user.model");
const router = Router();

router.route("/").get((req, res) => {
  res.send(req.body);
});

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/send-otp").post(sendOtp);
router.route("/verify-otp").post(verifyOtp);
router.route("/me").get(userDetails);

router.route("/delete").get(async (req, res) => {
  await User.deleteMany({});
  res.send("deleted");
});

module.exports = router;
