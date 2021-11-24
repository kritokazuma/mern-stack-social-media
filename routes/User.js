const router = require("express").Router();
const { login, register } = require("../controllers/user.controller.js");

//login
router.route("/login").post(login);

//register
router.route("/register").post(register);

module.exports = router;
