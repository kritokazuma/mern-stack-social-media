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
    return res.status(200).json({ message: false });
  } catch (error) {
    res.status(501).json(error);
  }
};
