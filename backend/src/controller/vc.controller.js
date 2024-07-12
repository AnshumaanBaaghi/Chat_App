const { Chat } = require("../models/chat/chat.model");
const { emitSocketEvent } = require("../socket");

const startOneOnOneVc = async (req, res) => {
  const { chatId } = req.body;

  if (!chatId) {
    return res.status(400).json({ message: "chatId is required for doing VC" });
  }
  try {
    const chat = await Chat.findById(chatId);
    const error = !chat
      ? "Chat doesn't exist"
      : chat.isGroup
      ? "Can't do VC on Group Chat"
      : null;
    if (error) {
      return res.status(400).json({ message: error });
    }
    const receiverId =
      chat.participants[0].toString() === req.user._id.toString()
        ? chat.participants[1]
        : chat.participants[0];
    emitSocketEvent(req, req.user._id.toString(), "initialise-vc", {
      receiverId,
      chatId,
    });
    res.status(200).json({ message: "initialised video call" });
  } catch (error) {
    res.status(400).json({ message: "error ", error });
  }
};

module.exports = { startOneOnOneVc };
