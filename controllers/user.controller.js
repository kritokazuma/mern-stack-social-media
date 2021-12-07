const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { registerVerify, loginVerify } = require("../utils/verifyInput");

// Genereate jwt token
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

//login user
exports.login = async (req, res) => {
  //req credentials from body
  const { username, password } = req.body;

  //verify login input
  const { errors, valid } = loginVerify(username, password);

  //check valid or not
  if (!valid) {
    return res.status(500).json({ errors });
  }

  //find is user registered or not
  const user = await User.findOne({ username });

  console.log(user);

  //if register or not, check hash password
  const validatePassword = !user
    ? false
    : await bcrypt.compare(password, user.password);

  if (!validatePassword) {
    return res.status(501).json({
      errors: { error: "Wrong username or password" },
    });
  }
  const token = jwtGenerate(user);
  return res.status(200).json({ token });
};

//register user
exports.register = async (req, res) => {
  //req credentials from body
  const { email, username, password, confirmPassword } = req.body;

  //verify register input
  const { errors, valid } = registerVerify(
    email,
    username,
    password,
    confirmPassword
  );

  if (!valid) {
    return res.status(502).json({ errors });
  }

  //check is user already register or not
  const checkUser = await User.findOne({ username });
  if (checkUser) {
    return res.status(500).json({
      errors: { error: "username already register" },
    });
  }

  //if username is not already register, hash the password and save to database
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
      error,
    });
  }
};

exports.addFriend = async (req, res) => {
  const user = req.user;
  const userId = req.query.user;
  try {
    const checkFriend = await User.findById(userId);

    if (checkFriend) {
      const checkUser = await User.findById(user.id);
      if (checkUser) {
        if (checkUser.friends.includes(userId)) {
          const indexOfFriend = checkUser.friends.indexOf(userId);
          checkUser.friends.splice(0, 1);
          await checkUser.save();
        } else {
          checkUser.friends.unshift(userId);
          await checkUser.save();
        }
        return res.status(200).json("successfull added");
      } else throw new Error("user not found");
    }
    return res.status(500);
  } catch (error) {
    res.status(501).json({ error });
  }
};
