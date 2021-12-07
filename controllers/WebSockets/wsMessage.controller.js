const Message = require("../../models/Message");

exports.wsMessage = (socket, userLists, user) => {
  socket.on("sendToMessage", async (data) => {
    const checkConservation = await Message.findOne({
      $or: [
        {
          "participants.user1.username": user.username,
          "participants.user2.username": data.friendUsername,
        },
        {
          "participants.user1.username": data.friendUsername,
          "participants.user2.username": user.username,
        },
      ],
    });

    if (checkConservation) {
      checkConservation.messages.push({
        sender: user.username,
        message: data.message,
      });

      return await checkConservation.save();
    }

    const message = new Message({
      participants: {
        user1: { id: user.id, username: user.username },
        user2: { id: data.friendId, username: data.friendUsername },
      },
      messages: [
        {
          sender: user.username,
          message: data.message,
        },
      ],
    });

    try {
      await message.save();
    } catch (error) {
      console.log(error);
    }
  });
};
