const router = require("express").Router();
const {
  messageLists,
  userMessages,
} = require("../controllers/messages.controller");
const { verify } = require("../utils/jwtVerify");

router.route("/messages/user").get(verify, userMessages);
router.route("/messages/:friend").get(verify, messageLists);

module.exports = router;
