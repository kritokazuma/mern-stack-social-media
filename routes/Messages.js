const router = require("express").Router();
const { messageLists } = require("../controllers/messages.controller");
const { verify } = require("../utils/jwtVerify");

router.route("/messages/:friend").get(verify, messageLists);

module.exports = router;
