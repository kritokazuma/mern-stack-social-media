const Message = require("../models/Message");
const User = require("../models/User");
const { userLists } = require("./WebSockets/wsFriend.controller");

exports.messageLists = async (req, res) => {
  const user = req.user;
  const friendId = req.params.friend;
  const username = req.query.user;
  console.log({ userLists });
  try {
    const message = await Message.findOne({
      $or: [
        { participants: [friendId, user.id] },
        { participants: [user.id, friendId] },
      ],
    });

    const friend = await User.findById(friendId);

    if (message && friend)
      return res.status(200).json({
        friendDetails: {
          profileImage: friend.profileImage,
          username: friend.username,
        },
        message,
      });
    return res.status(200).json({
      message: false,
      friendDetails: {
        profileImage: friend.profileImage,
        username: friend.username,
      },
    });
  } catch (error) {
    res.status(501).json(error);
  }
};

exports.userMessages = async (req, res) => {
  const user = req.user;
  try {
    const messages = await Message.find({
      participants: user.id,
    }).populate({
      path: "participants",
      select: ["username", "profileImage"],
      model: "User",
    });
    if (messages.length > 0) {
      const mes = messages.map((m) => {
        const friendDetails = m.participants.find(
          (friend) => friend.id !== user.id
        );
        return {
          user: friendDetails,
          messages: m.messages[m.messages.length - 1],
        };
      });
      return res.status(200).json(mes);
    }
    return res.status(500).json("no message found");
  } catch (error) {
    console.log(error);
    res.status(501).json(error);
  }
};
