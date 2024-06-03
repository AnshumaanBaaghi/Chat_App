const { default: mongoose } = require("mongoose");
const { Chat } = require("../models/chat/chat.model");
const { Message } = require("../models/chat/message.model");
const { emitSocketEvent } = require("../socket");
const { User } = require("../models/user.model");

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
    return res.status(200).json({ message: "Success", data: messages });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const sendMessage = async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;
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
    chat.latestMessage = message._id;
    await chat.save();

    const createdMessage = await Message.aggregate([
      {
        $match: {
          _id: message._id,
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "sender",
          as: "sender",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                username: 1,
                avatar: 1,
                email: 1,
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
    ]);
    if (!createdMessage[0]) {
      return res.status(500).json({ message: "Internal server error" });
    }

    chat.participants.forEach(async (participant) => {
      if (participant.toString() === req.user._id.toString()) return;
      const user = await User.findById(participant);

      if (!user.unreadMessages) {
        user.unreadMessages = {};
      }
      if (user.unreadMessages[chatId]) {
        console.log("phele se h bhai");
        console.log(
          "user.unreadMessages[chatId]:",
          user.unreadMessages[chatId]
        );
        user.unreadMessages[chatId] += 1;
      } else {
        console.log("nhi h bhai");
        user.unreadMessages[chatId] = 1;
      }
      user.markModified("unreadMessages");
      await user.save();
      emitSocketEvent(
        req,
        participant.toString(),
        "messageReceived",
        createdMessage[0]
      );
    });
    return res.status(200).json({
      message: "Message created Successfully",
      data: createdMessage[0],
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

module.exports = { getAllMessages, sendMessage };
