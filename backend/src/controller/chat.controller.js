const mongoose = require("mongoose");
const { Chat } = require("../models/chat/chat.model");

const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.aggregate([
      {
        $match: {
          participants: { $elemMatch: { $eq: req.user._id } },
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "participants",
          pipeline: [
            {
              $project: { _id: 1, name: 1, username: 1, avatar: 1 },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "latestMessage",
          foreignField: "_id",
          as: "latestMessage",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
                pipeline: [
                  {
                    $project: { _id: 1, username: 1, name: 1, avatar: 1 },
                  },
                ],
              },
            },
            {
              $addFields: {
                sender: { $first: "$sender" },
              },
            },
          ],
        },
      },
    ]);
    res.status(200).json({ data: chats });
  } catch (error) {
    res.status(400).json(error);
  }
};

const createOrGetOneOnOneChat = async (req, res) => {
  const { receiverId } = req.body;
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
        isGroup: false,
        participants: {
          $all: [req.user._id, receiverObjectId],
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "participants",
        foreignField: "_id",
        as: "participants",
        pipeline: [
          {
            $project: { _id: 1, name: 1, username: 1, avatar: 1 },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "messages",
        localField: "latestMessage",
        foreignField: "_id",
        as: "latestMessage",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "sender",
              foreignField: "_id",
              as: "sender",
              pipeline: [
                {
                  $project: { _id: 1, username: 1, name: 1, avatar: 1 },
                },
              ],
            },
          },
          {
            $addFields: {
              sender: { $first: "$sender" },
            },
          },
        ],
      },
    },
    // {
    //   $addFields: {
    //     latestMessage: { $arrayElemAt: ["$latestMessage", 0] },
    //   },
    // },
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
    {
      $lookup: {
        from: "users",
        localField: "participants",
        foreignField: "_id",
        as: "participants",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        isGroup: 1,
        participants: { _id: 1, name: 1, username: 1, avatar: 1 },
      },
    },
  ]);
  return res.status(201).json({
    status: "success",
    message: "new chat details",
    data: createChat[0],
  });
};

module.exports = { createOrGetOneOnOneChat, getAllChats };
