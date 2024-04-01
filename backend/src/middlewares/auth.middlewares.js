const { TOKEN_NAME } = require("../constants");
const { User } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const verifyJWT = async (req, res, next) => {
  const token = req.cookies;
  try {
    if (!token[TOKEN_NAME]) {
      return res
        .status(200)
        .json({ status: "success", message: "Token doesn't exist" });
    }
    const decodedToken = jwt.verify(
      token[TOKEN_NAME],
      process.env.JWT_SECERETKEY
    );
    const user = await User.findById(decodedToken._id).select(
      "-password -passwordUpdatedAt -resetPasswordToken -resetPasswordExpires"
    );
    req.user = user;
    next();
  } catch (error) {
    console.log("error:", error);
    res.status(400).json({ error });
  }
};
module.exports = { verifyJWT };
