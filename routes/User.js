const router = require("express").Router();
const {
  login,
  register,
  addFriend,
} = require("../controllers/user.controller.js");

const { verify } = require("../utils/jwtVerify");

//login
router.route("/login").post(login);

//register
router.route("/register").post(register);

//add friend
router.route("/addfriend").post(verify, addFriend);

module.exports = router;
