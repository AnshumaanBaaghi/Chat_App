const mongoose = require("mongoose");
const { DB_NAME } = require("../constants");

const connectDB = async () => {
  try {
    const mongoInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Getting error while connecting with MongoDB:", error);
  }
};

module.exports = { connectDB };
