const Message = require("../../models/Message");

exports.wsMessage = (socket, userLists, user) => {
  socket.on("sendToMessage", async (data) => {
    const conservation = await Message.findOne({
      $or: [
        { participants: [data.friendId, user.id] },
        { participants: [user.id, data.friendId] },
      ],
    });
    const friendList = userLists.filter((u) => u.userId === data.friendId);
    const mySocket = userLists.filter((u) => u.userId === user.id);

    const sendMessage = (id) =>
      socket.to(id).emit("received_message", {
        username: user.username,
        id: user.id,
        message: data.message,
      });

    if (conservation) {
      conservation.messages.push({
        sender: user.username,
        message: data.message,
      });

      await conservation.save();

      mySocket.forEach((list) => {
        sendMessage(list.socketId);
      });
      return friendList.forEach((list) => {
        sendMessage(list.socketId);
      });
    }

    const message = new Message({
      participants: [user.id, data.friendId],
      messages: [
        {
          sender: user.username,
          message: data.message,
        },
      ],
    });

    try {
      await message.save();

      mySocket.forEach((list) => {
        sendMessage(list.socketId);
      });
      return friendList.forEach((list) => {
        sendMessage(list.socketId);
      });
    } catch (error) {
      console.log(error);
    }
  });
};
