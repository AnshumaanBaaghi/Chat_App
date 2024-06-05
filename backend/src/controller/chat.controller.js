const mongoose = require("mongoose");
const { Chat } = require("../models/chat/chat.model");
const { User } = require("../models/user.model");
const { emitSocketEvent } = require("../socket");

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
                    $project: { _id: 1, name: 1, username: 1, avatar: 1 },
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
      {
        $addFields: {
          latestMessage: { $arrayElemAt: ["$latestMessage", 0] },
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

const createGroupChat = async (req, res) => {
  const { name, participants, avatar } = req.body;

  if (participants?.includes(req.user._id.toString())) {
    return res.status(400).json({
      message: "Participants array should not contain the group creator",
    });
  }

  const members = [...new Set([...participants, req.user._id.toString()])];
  if (members.length < 3) {
    return res
      .status(400)
      .json({ message: "3 or more users required for group chat" });
  }

  const groupChat = await Chat.create({
    name,
    isGroup: true,
    participants: members,
    admin: req.user._id,
    avatar,
  });

  const createdGroup = await Chat.aggregate([
    { $match: { _id: groupChat._id } },
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
  createGroupChat.participants?.forEach((participant) => {
    if (req.user._id.toString() === participant._id.toString()) return;
    console.log("chat created");
    emitSocketEvent(
      req,
      participant._id.toString(),
      "chat created",
      createdGroup
    );
  });
  return res.status(201).json({ message: "Group Created", data: createdGroup });
};

const getGroupDetails = async (req, res) => {
  const { chatId } = req.params;

  const chat = await Chat.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(chatId) } },
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
  console.log("chat[0]:", chat[0]);
  if (!chat[0]) {
    return res.status(400).json({ message: "Group chat does not exist" });
  }
  res.status(200).json({ message: "Details", data: chat[0] });
};

const updateGroupChat = async (req, res) => {
  const { chatId } = req.params;
  const values = req.body;

  const groupChat = await Chat.findOne({
    _id: new mongoose.Types.ObjectId(chatId),
    isGroup: true,
  });

  if (!groupChat) {
    return res.status(400).json({ message: "Group Doesn't exist" });
  }

  if (groupChat.admin?.toString() !== req.user._id?.toString()) {
    return res.status(400).json({ message: "You are not an admin" });
  }

  const updatedGroupChat = await Chat.findByIdAndUpdate(
    chatId,
    { ...values },
    { new: true }
  );
  return res
    .status(200)
    .json({ message: "Group Updated", data: updatedGroupChat });
};

const deleteGroupChat = async (req, res) => {
  const { chatId } = req.params;
  const groupChat = await Chat.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(chatId),
        isGroup: true,
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

  const chat = groupChat[0];

  if (!chat) {
    return res.status(400).json({ message: "Group chat does not exist" });
  }

  // check if the user who is deleting is the group admin
  if (chat.admin?.toString() !== req.user._id?.toString()) {
    return res.status(400).json({ message: "Only admin can delete the group" });
  }

  await Chat.findByIdAndDelete(chatId);
  // TODO: Have to Remove Messages of that group
  return res.status(200).json({ message: "Group Deleted successfully" });
};

const addParticipantInGroup = async (req, res) => {
  const { chatId, participantId } = req.params;
  try {
    if (!chatId || !participantId) {
      return res
        .status(400)
        .json({ message: "ChatId and ParticipantId are Required" });
    }
    const group = await Chat.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(chatId),
          isGroup: true,
        },
      },
    ]);
    if (!group[0]) {
      return res.status(400).json({ message: "Group doesn't exist" });
    }

    if (group[0].admin?.toString() !== req.user._id?.toString()) {
      return res.status(400).json({ message: "You are not an admin" });
    }

    const user = await User.findById(participantId);
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    let isParticipantPresent = false;
    group[0].participants.forEach((participant) => {
      if (participant.toString() === participantId.toString()) {
        isParticipantPresent = true;
      }
    });
    if (isParticipantPresent) {
      return res
        .status(400)
        .json({ message: "User is already present in a group" });
    }

    await Chat.findByIdAndUpdate(chatId, {
      $push: {
        participants: participantId,
      },
    });

    const chat = await Chat.aggregate([
      {
        $match: {
          _id: chatId,
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

    res.status(200).json({ message: "User added to the group", data: chat[0] });
  } catch (error) {
    res.status(400).json({ message: "error ", error });
  }
};

const removeParticipantFromGroup = async (req, res) => {
  const { chatId, participantId } = req.params;
  try {
    if (!chatId || !participantId) {
      return res
        .status(400)
        .json({ message: "ChatId and ParticipantId are Required" });
    }
    const group = await Chat.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(chatId),
          isGroup: true,
        },
      },
    ]);
    if (!group[0]) {
      return res.status(400).json({ message: "Group doesn't exist" });
    }
    const isAdmin = group[0].admin?.toString() === req.user._id?.toString();
    const isSameUser = participantId.toString() === req.user._id?.toString();
    if (!isAdmin && !isSameUser) {
      return res.status(400).json({
        message: !isSameUser
          ? "You don't have an access to remove other participants"
          : "You are not an admin",
      });
    }

    let isParticipantPresent = false;
    group[0].participants.forEach((participant) => {
      if (participant.toString() === participantId.toString()) {
        isParticipantPresent = true;
      }
    });
    if (!isParticipantPresent) {
      return res.status(400).json({ message: "User doesn't exist in a group" });
    }

    await Chat.findByIdAndUpdate(chatId, {
      $pull: {
        participants: participantId,
      },
    });

    const chat = await Chat.aggregate([
      {
        $match: {
          _id: chatId,
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

    res.status(200).json({
      message: "User Removed successfully from the group",
      data: chat[0],
    });
  } catch (error) {
    res.status(400).json({ message: "error ", error });
  }
};

module.exports = {
  createOrGetOneOnOneChat,
  getAllChats,
  createGroupChat,
  getGroupDetails,
  updateGroupChat,
  deleteGroupChat,
  addParticipantInGroup,
  removeParticipantFromGroup,
};
