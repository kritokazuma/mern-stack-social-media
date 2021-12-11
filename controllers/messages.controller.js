const Message = require("../models/Message");

exports.messageLists = async (req, res) => {
  const user = req.user;
  const friendId = req.params.friend;
  const username = req.query.user;

  // const populateHandler = (user) => {
  //   return {
  //     path: "participants",
  //     populate: {
  //       path: user,
  //       populate: {
  //         path: "id",
  //         select: "profileImage",
  //       },
  //     },
  //   };
  // };
  try {
    // const message = await Message.findOne({
    //   $or: [
    //     {
    //       "participants.user1.id": user.id,
    //       "participants.user2.id": friendId,
    //     },
    //     {
    //       "participants.user1.id": friendId,
    //       "participants.user2.id": user.id,
    //     },
    //   ],
    // })
    //   .populate(populateHandler("user1"))
    //   .populate(populateHandler("user2"));

    const message = await Message.findOne({
      $or: [
        { participants: [friendId, user.id] },
        { participants: [user.id, friendId] },
      ],
    });

    if (message) return res.status(200).json({ message });
    return res.status(200).json({ message: false });
  } catch (error) {
    res.status(501).json(error);
  }
};
