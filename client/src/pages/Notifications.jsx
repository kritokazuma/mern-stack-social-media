import React, { useContext, useEffect, useState } from "react";
import { WsContext } from "../App";
import { Box, Text, Button } from "@chakra-ui/react";
import axios from "axios";

const Notifications = () => {
  const { socket } = useContext(WsContext);

  const [friends, setFriends] = useState([]);
  const [newFriends, setNewFriends] = useState({});

  console.log(friends);
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
      console.log(res.data);
      setFriends(res.data.friends);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Box>
      {friends.map((f) => (
        <Box key={f.user} p={5} borderWidth="1px" borderRadius="lg">
          <Text>Friend requested from {f.username}</Text>
          <Box mt={2}>
            <Button size="sm" mr={4} colorScheme="teal">
              Accept
            </Button>
            <Button size="sm">Cancel</Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Notifications;
