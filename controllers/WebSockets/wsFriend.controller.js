const User = require("../../models/User");
const { validateToken } = require("../../utils/wsJwtVerify");
const { wsMessage } = require("./wsMessage.controller");

exports.wsController = (io) => {
  let userLists = [];
  io.on("connection", async (socket) => {
    console.log(socket.id);

    //add socket.id to array
    const activeUser = (userId, socketId) => {
      !userLists.some((u) => u.userId === userId) &&
        userLists.push({ userId, socketId });
    };

    //remove socket.id from array
    const removeUser = (socketId) => {
      userLists = userLists.filter((u) => u.socketId !== socketId);
    };

    //req token from query
    const token = socket.handshake.query.token;

    //validate the token from query
    let user;
    try {
      user = await validateToken(token);
      activeUser(user.id, socket.id);
      io.emit("active_user", userLists);
    } catch (error) {
      console.log(error);
    }

    //add friend socket
    socket.on("add_friend", async ({ friendId, username }) => {
      try {
        const checkFriend = await User.findById(friendId);
        const checkUser = await User.findById(user.id);

        if (checkFriend && checkUser) {
          if (
            checkUser.friends.find((u) => u.user == friendId) &&
            checkFriend.friends.find((u) => u.user == user.id)
          ) {
            const filterFriend = (Model, id) => {
              const removeList = Model.friends.filter((f) => f.user != id);
              return removeList;
            };
            //remove friend from user
            checkUser.friends = filterFriend(checkUser, friendId);
            //remove user from friend
            checkFriend.friends = filterFriend(checkFriend, user.id);
          } else {
            const addFriendList = (id, userName, action) => {
              return {
                user: id,
                username: userName,
                status: "pending",
                action: action,
              };
            };

            //add friend to user schema
            checkUser.friends.unshift(
              addFriendList(friendId, username, "requested")
            );
            //add user to friend schema
            checkFriend.friends.unshift(
              addFriendList(user.id, user.username, "received")
            );

            const friendList = userLists.find((u) => u.userId === friendId);

            socket
              .to(friendList.socketId)
              //send user id
              .emit("send_message", { username, userId: user.id });

            const fri = addFriendList(friendId, username, "requested");
            socket
              .to(friendList.socketId)
              //send user id
              .emit("notification", { value: fri });
          }
          await checkUser.save();
          await checkFriend.save();
        } else throw new Error("user not found");
      } catch (error) {
        console.log(error);
      }
    });
    //accept or reject
    socket.on("accept_friend", async (data) => {
      try {
        const friend = await User.findById(data.userId);
        const userFriend = await User.findById(user.id);
        const check =
          friend.friends.find((f) => f.user == user.id) &&
          userFriend.friends.find((f) => f.user == data.userId)
            ? true
            : false;
        if (check) {
          const friendIndex = (Model, id) => {
            return Model.friends.findIndex((f) => f.user == id);
          };

          if (data.status === "accepted") {
            const makeAccept = async (Model, id) => {
              Model.friends[friendIndex(Model, id)].status = "accepted";
              await Model.save();
            };

            makeAccept(friend, user.id);
            makeAccept(userFriend, data.userId);
            socket.emit("friend_request_status", {
              status: "accepted",
              friendId: data.userId,
            });

            const friendList = userLists.find((u) => u.userId === data.userId);
            socket
              .to(friendList.socketId)
              .emit("accept_noti", { username: user.username, id: user.id });
          }

          if (data.status === "rejected") {
            const makeReject = async (Model, id) => {
              Model.friends.splice(friendIndex(Model, id), 1);
              await Model.save();
            };
            makeReject(friend, user.id);
            makeReject(userFriend, data.userId);
            socket.emit("friend_request_status", "rejected");
          }
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      console.log("user disconnect");
      io.emit("active_user", userLists);
    });

    //message controller
    wsMessage(socket, userLists, user);
  });
};
