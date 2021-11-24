const router = require("express").Router();
const { profileImage } = require("../controllers/image.controller");
const { verify } = require("../utils/jwtVerify");

router.route("/user/images").post(verify, profileImage);

module.exports = router;
