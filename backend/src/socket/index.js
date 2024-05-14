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
    if (!loggedInUser) return; // Have to Add error here
    // if (!user) return; // Have to Add error here
    socket.join(loggedInUser._id);
    console.log("User Connected", loggedInUser._id);

    socket.on("friend_request", async (data) => {
      console.log("data: friend_request:", data);
      // data.to contains userID;

      const request = await FriendRequest.create({
        sender: data.from,
        recipient: data.to,
      });
      console.log("request: created: ", request);

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
      console.log("data:", data);

      const friend_request = await FriendRequest.findById(data.requestId); // get the document from FriendRequest Collection
      console.log("friend_request:", friend_request);
      if (!friend_request) return;
      const sender = await User.findById(friend_request.sender);
      const receiver = await User.findById(friend_request.recipient);

      sender.friends.push(friend_request.recipient);
      receiver.friends.push(friend_request.sender);

      await sender.save({ new: true, validateModifiedOnly: true });
      await receiver.save({ new: true, validateModifiedOnly: true });

      // deleting friend request
      await FriendRequest.findByIdAndDelete(data.requestId);

      console.log("sender._id:", sender._id);
      io.to(sender._id.toString()).emit("request-accepted", {
        message: `Request Accepted By ${receiver.name}`,
        receiverId: receiver._id,
      });

      console.log("receiver._id:", receiver._id);
      io.to(receiver._id.toString()).emit("request-accepted", {
        message: `You have Accepted Friend Request of ${sender.name}`,
        senderId: sender._id,
      });
    });

    socket.on("end", () => {
      console.log("diconnecting...");
      socket.disconnect(0);
    });
  });
};

module.exports = { initializeSocketIO };
