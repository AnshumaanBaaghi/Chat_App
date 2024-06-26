const { Router } = require("express");
const { verifyJWT } = require("../middlewares/auth.middlewares");
const {
  createOrGetOneOnOneChat,
  getAllChats,
  createGroupChat,
  getGroupDetails,
  deleteGroupChat,
  addParticipantInGroup,
  removeParticipantFromGroup,
  updateGroupChat,
} = require("../controller/chat.controller");

const router = Router();
router.use(verifyJWT);

router.route("/").get(getAllChats); //For getting all chats of a loggedin user
router.route("/chat").post(createOrGetOneOnOneChat); // For creating or accessing one-on-one chat
router.route("/group").post(createGroupChat); // for creating Group chat
router
  .route("/group/:chatId")
  .get(getGroupDetails)
  .patch(updateGroupChat)
  .delete(deleteGroupChat);

router
  .route("/group/:chatId/:participantId")
  .post(addParticipantInGroup)
  .delete(removeParticipantFromGroup);

module.exports = router;
