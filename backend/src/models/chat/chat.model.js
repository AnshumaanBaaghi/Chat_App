const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isGroup: { type: Boolean, default: false },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    avatar: { type: String },
  },
  {
    timestamps: true,
  }
);

const Chat = new mongoose.model("Chat", chatSchema);

module.exports = { Chat };
