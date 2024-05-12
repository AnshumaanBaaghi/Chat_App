const { default: mongoose } = require("mongoose");
const { Chat } = require("../models/chat/chat.model");
const { Message } = require("../models/chat/message.model");

const getAllMessages = async (req, res) => {
  const { chatId } = req.params;
  console.log("chatId:", chatId);
  if (!chatId) {
    return res.status(400).json({ message: "ChatId is Required" });
  }
  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat doesn't exist" });
    }

    if (!chat.participants.includes(req.user._id)) {
      return res
        .status(501)
        .json({ message: "User is not the part of this chat" });
    }
    const messages = await Message.aggregate([
      {
        $match: {
          chatId: new mongoose.Types.ObjectId(chatId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "sender",
          pipeline: [
            {
              $project: {
                name: 1,
                username: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          sender: { $first: "$sender" },
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
    ]);
    console.log("messages:", messages);
    return res.status(200).json({ message: "Success", data: messages });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const sendMessage = async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;
  console.log("chatId:", chatId);
  if (!chatId || !content.trim()) {
    return res.status(400).json({ message: "ChatId and Content is Required" });
  }
  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat doesn't exist" });
    }

    if (!chat.participants.includes(req.user._id)) {
      return res
        .status(501)
        .json({ message: "User is not the part of this chat" });
    }

    const message = await Message.create({
      sender: req.user._id,
      content: content.trim(),
      chatId: chatId,
    });
    return res.status(200).json({ message: "Message created Successfully" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

module.exports = { getAllMessages, sendMessage };
