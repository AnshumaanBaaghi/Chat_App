const { Router } = require("express");
const { register, login, verifyOtp } = require("../controller/user.controller");
const router = Router();

router.route("/").get((req, res) => {
  res.send(req.body);
});

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verifyOtp").post(verifyOtp);

module.exports = router;
