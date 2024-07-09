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

    // io.emit("userConnected", { _id: loggedInUser._id.toString() });
    connectedUsers[loggedInUser._id.toString()] = true;
    io.emit("userConnected", connectedUsers);

    socket.on("friend_request", async (data) => {
      // data.to contains userID;

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
