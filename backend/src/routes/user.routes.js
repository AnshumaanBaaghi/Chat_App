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
  getSentRequests,
  updateUser,
  deleteUnreadMessages,
  logout,
} = require("../controller/user.controller");
const { User } = require("../models/user.model");
const { verifyJWT } = require("../middlewares/auth.middlewares");
const { FriendRequest } = require("../models/friendRequest.model");
const { Chat } = require("../models/chat/chat.model");
const router = Router();

router.route("/").get((req, res) => {
  res.send(req.body);
});

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);
router.route("/send-otp").post(sendOtp);
router.route("/verify-otp").post(verifyOtp);
router.route("/me").get(verifyJWT, userDetails).post(verifyJWT, updateUser);
router.route("/search-new-friends").get(verifyJWT, searchNewFriends);
router.route("/get-friend-requests").get(verifyJWT, getFriendRequests);
router.route("/get-friends").get(verifyJWT, getFriends);
router.route("/get-sent-requests").get(verifyJWT, getSentRequests);
router.route("/unreadMessages/:chatId").delete(verifyJWT, deleteUnreadMessages);

module.exports = router;
