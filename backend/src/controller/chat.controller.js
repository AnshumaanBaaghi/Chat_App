const mongoose = require("mongoose");
const { Chat } = require("../models/chat/chat.model");

const getOrCreateOneOnOneChat = async (req, res) => {
  const { receiverId } = req.body;
  console.log("receiverId:", typeof receiverId);
  if (!receiverId) {
    return res
      .status(400)
      .json({ status: "error", message: "Receiver's ID is not given" });
  }

  if (receiverId.toString() === req.user._id.toString()) {
    return res
      .status(400)
      .json({ status: "error", message: "Can't chat with yourself" });
  }

  //Check if Chat exist
  const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

  const chat = await Chat.aggregate([
    {
      $match: {
        participants: {
          $all: [req.user._id, receiverObjectId],
        },
      },
    },
  ]);
  if (chat.length) {
    return res
      .status(201)
      .json({ status: "success", message: "chat details", data: chat[0] });
  }
  const newChat = await Chat.create({
    name: "One on one chat",
    participants: [req.user._id, receiverId],
    admin: req.user._id,
  });

  const createChat = await Chat.aggregate([
    {
      $match: { _id: newChat._id },
    },
  ]);
  return res
    .status(201)
    .json({ status: "success", message: "new chat details", data: createChat });
};

module.exports = { getOrCreateOneOnOneChat };
