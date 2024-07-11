const cookie = require("cookie");
const { TOKEN_NAME } = require("../constants");
const { User } = require("../models/user.model");
const { FriendRequest } = require("../models/friendRequest.model");
const jwt = require("jsonwebtoken");

const connectedUsers = {};

const initializeSocketIO = (io) => {
  return io.on("connection", async (socket) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    const token = cookies?.[TOKEN_NAME];
    if (!token) return; // Have to Add error here
    const loggedInUser = jwt.verify(token, process.env.JWT_SECERETKEY);
    if (!loggedInUser) return; // Have to Add error here
    socket.join(loggedInUser._id.toString());
    console.log("user joined:", loggedInUser._id.toString());
    // io.emit("userConnected", { _id: loggedInUser._id.toString() });
    connectedUsers[loggedInUser._id.toString()] = true;
    io.emit("userConnected", connectedUsers);

    socket.on("friend_request", async (data) => {
      // data.to contains userID;
      console.log("friend request data:", data);

      const request = await FriendRequest.create({
        sender: data.from,
        recipient: data.to,
      });

      // for checking requests
      io.to(data.to).emit("new-friend-request", {
        message: "New Friend Request Received!",
        sentBy: data.from,
        requestId: request._id,
      });

      // for sending request
      io.to(data.from).emit("request-sent", {
        message: "Request Sent Successfully!",
        sentTo: data.to,
      });
    });

    socket.on("accept-request", async (data) => {
      const friend_request = await FriendRequest.findById(data.requestId); // get the document from FriendRequest Collection
      if (!friend_request) return;
      const sender = await User.findById(friend_request.sender);
      const receiver = await User.findById(friend_request.recipient);

      sender.friends.push(friend_request.recipient);
      receiver.friends.push(friend_request.sender);

      await sender.save({ new: true, validateModifiedOnly: true });
      await receiver.save({ new: true, validateModifiedOnly: true });

      // deleting friend request
      await FriendRequest.findByIdAndDelete(data.requestId);

      io.to(sender._id.toString()).emit("request-accepted", {
        message: `Request Accepted By ${receiver.name}`,
        receiverId: receiver._id,
      });

      io.to(receiver._id.toString()).emit("request-accepted", {
        message: `You have Accepted Friend Request of ${sender.name}`,
        senderId: sender._id,
      });
    });

    socket.on("typing", async ({ chat, typer }) => {
      chat.participants?.forEach((participant) => {
        if (participant._id.toString() === typer._id.toString()) return;
        socket
          .to(participant._id.toString())
          .emit("someone typing", { typer, chat });
      });
    });

    socket.on("stop typing", async ({ chat, typer }) => {
      if (!chat || !typer) return;
      chat.participants?.forEach((participant) => {
        if (participant._id.toString() === typer._id.toString()) return;
        socket
          .to(participant._id.toString())
          .emit("someone stop typing", { typer, chat });
      });
    });

    // ------------------------ Video Call Start------------------

    socket.on("join-room", async ({ chatId }) => {
      socket.join(chatId);
      console.log(`You Entered in chat ${chatId}`);
    });
    socket.on("calling-someone", async ({ receiverId, you, chatId }) => {
      io.to(receiverId).emit("receiving-video-call", {
        sender: you,
        chatId,
      });
    });
    socket.on("accept-call", ({ sender, you, chatId }) => {
      socket.to(chatId).emit("call-accepted", { receiver: you });
      socket.join(chatId);
    });

    socket.on("sending-offer", ({ from, to, offer }) => {
      io.to(to).emit("receiving-offer", { from, offer });
    });

    socket.on("sending-answer", ({ from, to, ans }) => {
      io.to(to).emit("receiving-answer", { from, ans });
    });

    socket.on("sending-negotiation-offer", ({ from, to, offer }) => {
      console.log("ye bhi dono me aa rha hoga");
      io.to(to).emit("receiving-negotiation-offer", { from, offer });
    });
    socket.on("sending-negotiation-answer", ({ from, to, ans }) => {
      io.to(to).emit("receiving-negotiation-answer", { from, ans });
    });
    socket.on("accepting-negotiation-answer", ({ from, to }) => {
      console.log("accepting-negotiation-answer:", from, to);
      io.to(to).emit("accepted-negotiation-answer");
    });
    // ------------------------ Video Call End ------------------

    socket.on("end", () => {
      console.log("diconnecting...");
      socket.disconnect(0);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      delete connectedUsers[loggedInUser._id.toString()];
      socket.broadcast.emit("userDisconnected", {
        connectedUsers,
        _id: loggedInUser._id.toString(),
      });
    });
  });
};

// To avoid emitting event from frontend
const emitSocketEvent = (req, roomId, event, payload) => {
  req.app.get("io").to(roomId).emit(event, payload);
};

module.exports = { initializeSocketIO, emitSocketEvent };
