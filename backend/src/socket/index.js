const cookie = require("cookie");

const initializeSocketIO = (io) => {
  return io.on("connection", async (socket) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    console.log("cookies:", cookies);
  });
};

module.exports = { initializeSocketIO };
