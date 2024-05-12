const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    content: { type: String },
    attachents: [{ type: String }],
  },
  { timestamps: true }
);

const Message = new mongoose.model("Message", messageSchema);

module.exports = { Message };
