const express = require("express");
const { createServer } = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const userRoute = require("./routes/user.routes");
const chatRouter = require("./routes/chat.routes");
const messsageRouter = require("./routes/message.routes");
const videoCallRouter = require("./routes/videoCall.routes");

const { Server } = require("socket.io");
const { initializeSocketIO } = require("./socket");
const dotenv = require("dotenv");

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });
const app = express();
const httpServer = createServer(app);
const frontend_url = process.env.FRONTEND_URL;
const io = new Server(httpServer, {
  cors: {
    origin: frontend_url, // Have to change it
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Rate Limit Exceed",
});

app.set("io", io);
app.set("trust proxy", false);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use(mongoSanitize());
app.use(
  cors({
    origin: frontend_url,
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Working");
});

app.use("/user", userRoute);
app.use("/chat", chatRouter);
app.use("/message", messsageRouter);
app.use("/one-on-one-vc", videoCallRouter);

initializeSocketIO(io);

module.exports = { httpServer };
