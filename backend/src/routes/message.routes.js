const { Router } = require("express");
const {
  getAllMessages,
  sendMessage,
} = require("../controller/message.controller");
const { verifyJWT } = require("../middlewares/auth.middlewares");

const router = Router();
router.use(verifyJWT);

router.route("/:chatId").get(getAllMessages).post(sendMessage);

module.exports = router;
