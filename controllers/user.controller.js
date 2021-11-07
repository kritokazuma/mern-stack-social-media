const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { registerVerify, loginVerify } = require("../utils/verifyInput");

const jwtGenerate = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.SECRET,
    { expiresIn: "5d" }
  );

  return token;
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const { errors, valid } = loginVerify(username, password);

  if (!valid) {
    return res.status(500).json({ errors });
  }

  const user = await User.findOne({ username });

  const validatePassword = !user
    ? false
    : await bcrypt.compare(password, user.password);

  if (!validatePassword) {
    return res.status(501).json({
      errors: "Wrong username or password",
    });
  }
  const token = jwtGenerate(user);
  return res.status(200).json({ token });
};

exports.register = async (req, res) => {
  const { email, username, password, confirmPassword } = req.body;

  const { errors, valid } = registerVerify(
    email,
    username,
    password,
    confirmPassword
  );

  if (!valid) {
    return res.status(502).json({ errors });
  }

  const checkUser = await User.findOne({ username });
  if (checkUser) {
    return res.status(500).json({
      errors: "username already register",
    });
  }

  try {
    const hash = await bcrypt.hash(password, 11);
    const newUser = new User({
      email,
      username,
      password: hash,
    });

    await newUser.save();
    const token = jwtGenerate(newUser);
    return res.status(200).json({ token });
  } catch (error) {
    res.status(502).json({
      errors: error,
    });
  }
};
