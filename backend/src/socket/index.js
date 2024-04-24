const cookie = require("cookie");
const { TOKEN_NAME } = require("../constants");
const { User } = require("../models/user.model");
const { FriendRequest } = require("../models/friendRequest.model");
const jwt = require("jsonwebtoken");

const initializeSocketIO = (io) => {
  return io.on("connection", async (socket) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    const token = cookies?.[TOKEN_NAME];
    if (!token) return; // Have to Add error here
    const loggedInUser = jwt.verify(token, process.env.JWT_SECERETKEY);
    console.log("loggedInUser:", loggedInUser);
    if (!loggedInUser) return; // Have to Add error here
    const socket_id = socket.id;
    const user = await User.findByIdAndUpdate(loggedInUser._id, { socket_id });
    // if (!user) return; // Have to Add error here

    socket.on("friend_request", async (data) => {
      console.log("data.to:", data.to);
      // data.to contains userID;

      const to = await User.findById(data.to).select("socket_id");
      const from = await User.findById(data.from).select("socket_id");

      await FriendRequest.create({
        sender: data.from,
        recipient: data.to,
      });

      // for checking requests
      io.to(to.socket_id).emit("new-friend-request", {
        message: "New Friend Received",
      });

      // for sending request
      io.to(from.socket_id).emit("request-sent", {
        message: "Request Sent Successfully",
      });
    });

    socket.on("accept-request", async (data) => {
      console.log("data:", data);

      const friend_request = await FriendRequest.findById(data.request_id); // get the document from FriendRequest Collection
      console.log("friend_request:", friend_request);

      const sender = await User.findById(friend_request.sender);
      const receiver = await User.findById(friend_request.recipient);

      sender.friends.push(friend_request.recipient);
      receiver.friends.push(friend_request.sender);

      await sender.save({ new: true, validateModifiedOnly: true });
      await receiver.save({ new: true, validateModifiedOnly: true });

      // deleting friend request
      await FriendRequest.findByIdAndDelete(data.request_id);

      io.to(sender.socket_id).emit("request-accepted", {
        message: "Request Accepted",
      });

      io.to(receiver.socket_id).emit("request-accepted", {
        message: "Request Accepted",
      });
    });

    socket.on("end", () => {
      console.log("diconnecting...");
      socket.disconnect(0);
    });
  });
};

module.exports = { initializeSocketIO };
