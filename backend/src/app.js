const express = require("express");
const { createServer } = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const { User } = require("./models/user.model");
const userRoute = require("./routes/user.routes");

const app = express();
const httpServer = createServer(app);
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 1000,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Rate Limit Exceed",
});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use(mongoSanitize());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Working");
});

app.use("/user", userRoute);

module.exports = { httpServer };
