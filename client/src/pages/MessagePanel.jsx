import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Box, Avatar, Text, Flex, Center } from "@chakra-ui/react";
import { WsContext } from "../App";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const MessagePanel = React.memo(() => {
  const [messages, setMessages] = useState([]);

  const [newMessages, setNewMessages] = useState({});

  const navigate = useNavigate();

  const { socket } = useContext(WsContext);

  const { user } = useContext(AuthContext);

  useEffect(async () => {
    const res = await axios.get("/api/conservation/messages/user");
    setMessages(res.data);
  }, []);

  useEffect(() => {
    socket.on("received_message", async (data) => {
      setNewMessages(() => {
        return { ...data };
      });
    });
  }, [socket]);

  useEffect(() => {
    const addMessage = messages.map((mes) => {
      if (mes.user._id === newMessages.id) {
        return {
          ...mes,
          messages: {
            sender: newMessages.username,
            message: newMessages.message,
          },
        };
      }
      return mes;
    });
    setMessages(() => addMessage);
  }, [newMessages]);

  if (messages.length < 1) {
    return (
      <>
        <Center mt="30vh">There is no messages</Center>
      </>
    );
  }

  return messages.map((mes) => (
    <Messages key={mes.user._id} value={{ mes, navigate, user }} />
  ));
});

const Messages = ({ value: { mes, navigate, user } }) => {
  return (
    <Box
      p={3}
      borderWidth="1px"
      borderRadius="lg"
      onClick={() => navigate(`/messages/${mes.user._id}`)}
    >
      <Flex alignItems="center">
        <Avatar
          name={mes.user.username}
          src={`/api/${mes.user.profileImage}`}
        />
        <Box ml={2}>
          <Text fontWeight="bold">{mes.user.username}</Text>
          <Text color="gray.500">
            {mes.messages.sender === user.username && "You: "}
            {mes.messages.message}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default MessagePanel;
