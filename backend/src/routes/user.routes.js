const { Router } = require("express");
const {
  register,
  login,
  verifyOtp,
  sendOtp,
  userDetails,
  searchNewFriends,
  getFriendRequests,
  getFriends,
} = require("../controller/user.controller");
const { User } = require("../models/user.model");
const { verifyJWT } = require("../middlewares/auth.middlewares");
const router = Router();

router.route("/").get((req, res) => {
  res.send(req.body);
});

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/send-otp").post(sendOtp);
router.route("/verify-otp").post(verifyOtp);
router.route("/me").get(userDetails);
router.route("/search-new-friends").get(verifyJWT, searchNewFriends);
router.route("/get-friend-requests").get(verifyJWT, getFriendRequests);
router.route("/get-friends").get(verifyJWT, getFriends);

router.route("/delete").get(async (req, res) => {
  await User.deleteMany({});
  res.send("deleted");
});

module.exports = router;
