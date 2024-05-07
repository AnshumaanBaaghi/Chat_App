const { Router } = require("express");
const { verifyJWT } = require("../middlewares/auth.middlewares");
const { getOrCreateOneOnOneChat } = require("../controller/chat.controller");

const router = Router();
router.use(verifyJWT);
router.route("/access").post(getOrCreateOneOnOneChat);

module.exports = router;
