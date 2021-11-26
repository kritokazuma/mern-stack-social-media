const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { registerVerify, loginVerify } = require("../utils/verifyInput");
const io = require("../index");
const { validateToken } = require("../utils/wsJwtVerify");

let userLists = [];

const activeUser = (userId, socketId) => {
  !userLists.some((u) => u.userId === userId) &&
    userLists.push({ userId, socketId });
};

const removeUser = (socketId) => {
  userLists = userLists.filter((u) => u.socketId !== socketId);
};

io.on("connection", async (socket) => {
  console.log("connected");
  const token = socket.handshake.query.token;
  let user;
  try {
    user = await validateToken(token);
    activeUser(user.id, socket.id);
  } catch (error) {
    console.log(error);
  }

  socket.on("add_friend", async ({ friendId, username }) => {
    const friendList = userLists.find((u) => u.userId === friendId);
    if (friendList) {
      try {
        const checkFriend = await User.findById(friendId);
        const checkUser = await User.findById(user.id);
        // console.log(checkUser);

        if (checkFriend && checkUser) {
          if (checkUser) {
            const testCheck = checkUser.friends.find(
              (u) => u.username == checkFriend.username
            );
            console.log(testCheck);
            if (checkUser.friends.find((u) => u.user == friendId)) {
              console.log("already friend");
              checkUser.friends = checkUser.friends.filter(
                (f) => f.user != friendId
              );
            } else {
              console.log("friend added");
              checkUser.friends.unshift({ user: friendId, status: "pending" });
            }
            await checkUser.save();
          } else throw new Error("user not found");
        }
      } catch (error) {
        console.log(error);
      }
      socket.to(friendList.socketId).emit("send_message", username);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("user disconnect");
  });
});

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

  //if register or not, check hash password
  const validatePassword = !user
    ? false
    : await bcrypt.compare(password, user.password);

  if (!validatePassword) {
    return res.status(501).json({
      error: "Wrong username or password",
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
