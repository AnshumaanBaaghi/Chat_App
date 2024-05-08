const { Router } = require("express");
const { verifyJWT } = require("../middlewares/auth.middlewares");
const {
  createOrGetOneOnOneChat,
  getAllChats,
} = require("../controller/chat.controller");

const router = Router();
router.use(verifyJWT);

router.route("/").get(getAllChats); //For getting all chats of a loggedin user
router.route("/chat").post(createOrGetOneOnOneChat);

module.exports = router;
