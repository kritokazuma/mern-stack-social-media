import React, { useContext, useEffect, useState } from "react";
import { WsContext } from "../App";
import { Box, Text, Button, Center } from "@chakra-ui/react";
import axios from "axios";

const Notifications = () => {
  const { socket } = useContext(WsContext);

  const [friends, setFriends] = useState([]);
  const [newFriends, setNewFriends] = useState({});
  const [acceptUser, setAcceptUser] = useState([]);

  useEffect(() => {
    socket.on("notification", (data) => {
      setNewFriends(data.value);
    });
  }, [socket]);

  useEffect(() => {
    if (Object.keys(newFriends).length > 0) {
      const checkDi = friends.find((f) => f.username === newFriends.username);
      if (!checkDi) {
        setFriends((preVal) => [...preVal, newFriends]);
      }
    }
  }, [friends, newFriends]);

  useEffect(async () => {
    try {
      const res = await axios.get("/api/users/notification");
      setFriends(res.data.friends);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const acceptOrNot = (id, status) => {
    socket.emit("accept_friend", {
      userId: id,
      status,
    });
    setAcceptUser((preVal) => [...preVal, { id, status }]);
  };
  const isAccept = (id) => acceptUser.find((u) => u.id === id);

  if (friends.length < 1) {
    return (
      <>
        <Center mt="30vh">There is no notifications</Center>
      </>
    );
  }

  return (
    <Box>
      {friends.map((f) => (
        <Box key={f.user} p={5} borderWidth="1px" borderRadius="lg">
          <Text>Friend requested from {f.username}</Text>
          <Box mt={2}>
            {isAccept(f.user) ? (
              isAccept(f.user).status === "accepted" ? (
                <Text>Friend accepted successfully</Text>
              ) : (
                <Text>Friend rejected successfully</Text>
              )
            ) : (
              <>
                <Button
                  size="sm"
                  mr={4}
                  colorScheme="teal"
                  onClick={() => acceptOrNot(f.user, "accepted")}
                >
                  Accept
                </Button>
                <Button
                  onClick={() => acceptOrNot(f.user, "rejected")}
                  size="sm"
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Notifications;
