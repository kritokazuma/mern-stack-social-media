const Message = require("../../models/Message");

exports.wsMessage = (socket, userLists, user) => {
  socket.on("sendToMessage", async (data) => {
    const checkConservation = await Message.findOne({
      $or: [
        {
          "participants.user1.id": user.id,
          "participants.user2.id": data.friendId,
        },
        {
          "participants.user1.id": data.friendId,
          "participants.user2.id": user.id,
        },
      ],
    });
    const friendList = userLists.find((u) => u.userId === data.friendId);

    const sendMessage = (id) =>
      socket.to(id).emit("received_message", {
        username: user.username,
        id: user.id,
        message: data.message,
      });

    if (checkConservation) {
      checkConservation.messages.push({
        sender: user.username,
        message: data.message,
      });

      await checkConservation.save();

      return sendMessage(friendList.socketId);
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
      return sendMessage(friendList.socketId);
    } catch (error) {
      console.log(error);
    }
  });
};
