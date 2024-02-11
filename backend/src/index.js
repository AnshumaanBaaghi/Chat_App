const { httpServer } = require("./app");
const dotenv = require("dotenv");
const { connectDB } = require("./db");

dotenv.config();
const PORT = process.env.PORT || 8080;

process.on("uncaughtException", (err) => {
  console.log("err:", err);
  process.exit(1);
});

const startServer = () => {
  httpServer.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
};

connectDB();
startServer();

process.on("unhandledRejection", (err) => {
  console.log("err:", err);
  httpServer.close(() => {
    process.exit(1);
  });
});
