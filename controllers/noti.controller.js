const User = require("../models/User");

exports.friendNotification = async (req, res) => {
  const user = req.user;

  try {
    const getUser = await User.findById(user.id);

    const requestedFriends = getUser.friends.filter(
      (f) => f.action === "received" && f.status === "pending"
    );

    return res.status(200).json({
      friends: requestedFriends,
    });
  } catch (error) {
    res.status(501).json({ error });
  }
};
