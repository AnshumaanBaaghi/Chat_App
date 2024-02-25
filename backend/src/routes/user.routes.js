const { Router } = require("express");
const {
  register,
  login,
  verifyOtp,
  sendOtp,
} = require("../controller/user.controller");
const router = Router();

router.route("/").get((req, res) => {
  res.send(req.body);
});

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/send-otp").post(sendOtp);
router.route("/verify-otp").post(verifyOtp);
router.route("/delete").get(async (req, res) => {
  await User.deleteMany({});
  res.send("deleted");
});

module.exports = router;
