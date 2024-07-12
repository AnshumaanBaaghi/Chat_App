const { Router } = require("express");
const { verifyJWT } = require("../middlewares/auth.middlewares");
const { startOneOnOneVc } = require("../controller/vc.controller");

const router = Router();

router.post("/start", verifyJWT, startOneOnOneVc);

module.exports = router;
