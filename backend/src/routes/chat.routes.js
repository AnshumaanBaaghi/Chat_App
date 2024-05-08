const { Router } = require("express");
const { verifyJWT } = require("../middlewares/auth.middlewares");
const {
  createOrGetOneOnOneChat,
  getAllChats,
  createGroupChat,
} = require("../controller/chat.controller");

const router = Router();
router.use(verifyJWT);

router.route("/").get(getAllChats); //For getting all chats of a loggedin user
router.route("/chat").post(createOrGetOneOnOneChat); // For creating or accessing one-on-one chat
router.route("/group/create").post(createGroupChat);

module.exports = router;
