const cookie = require("cookie");
const { TOKEN_NAME } = require("../constants");
const { User } = require("../models/user.model");

const initializeSocketIO = (io) => {
  return io.on("connection", async (socket) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    console.log("cookies:", cookies);
    const token = cookies?.[TOKEN_NAME];
    console.log("token:", token);
    if (!token) return; // Have to Add error here
    const socket_id = socket.id;
    const user = await User.findByIdAndUpdate(token._id, { socket_id });
    // if (!user) return; // Have to Add error here

    socket.on("friend_request", async (data) => {
      console.log("data.to:", data.to);
      // data.to contains userID;

      const to = await User.findById(data.to);
      // TODO create friend-request

      io.to(to.socket_id).emit("new-friend-request", {});
    });
  });
};

module.exports = { initializeSocketIO };
