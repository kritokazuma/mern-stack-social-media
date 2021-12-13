import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { WsContext } from "../App";
import {
  Box,
  Input,
  Button,
  Center,
  Text,
  Avatar,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars-2";
import Messages from "../components/Messages";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function SingleMessage() {
  const params = useParams();
  const friendId = params.user;

  const scrollBar = useRef();

  const { socket } = useContext(WsContext);

  const { user } = useContext(AuthContext);

  const [searchParams, setSearchParams] = useSearchParams();

  const [message, setMessage] = useState({
    participants: [],
    messages: [],
  });

  const [isActive, setIsActive] = useState(false);

  const [friendDetails, setFriendDetails] = useState({});

  const [chat, setChat] = useState("");

  const borderColor = useColorModeValue("#E2E8F0", "#4A5568");

  useEffect(async () => {
    if (user) {
      const res = await axios.get(
        `/api/conservation/messages/${friendId}?user=${searchParams.get(
          "user"
        )}`
      );

      if (res) {
        setMessage((preVal) => {
          return {
            ...preVal,
            participants: res.data.message.participants,
            messages: res.data.message.messages,
          };
        });
        setFriendDetails(res.data.friendDetails);

        scrollBar.current && scrollBar.current.scrollToBottom();
      }

      //websocket
      socket.emit("is_active", { id: friendId });
    }
  }, []);

  useEffect(() => {
    socket.on("active_status", (data) => setIsActive(data));
  }, [socket]);

  // scrollBar.current.scrollToBottom();
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const profileImage = friendDetails
    ? `/api/${friendDetails.profileImage}`
    : "";

  return (
    <Box>
      <Box borderWidth="1px" borderRadius="lg" mt={2}>
        <Flex py={2} alignItems="center">
          <Avatar
            ml={3}
            size="md"
            name={friendDetails.username}
            src={profileImage}
          />
          <Box ml={3}>
            <Text fontWeight="bold">{friendDetails.username}</Text>
            <Text color="gray.500" isTruncated>
              {isActive && "Active now"}
            </Text>
          </Box>
        </Flex>
      </Box>
      <Scrollbars
        style={{
          width: "100%",
          height: "68vh",
          border: `1px solid ${borderColor}`,
          borderRadius: "10px",
          marginTop: "10px",
        }}
        name="hihi"
        ref={scrollBar}
      >
        {message.messages.map((mes, i) => (
          <Box key={i}>
            <Messages value={{ mes, profileImage, user }} />
          </Box>
        ))}
      </Scrollbars>

      <form onSubmit={handleSubmit}>
        <Center mt={3}>
          <Input
            outline="none"
            placeholder="send a message"
            maxW="90%"
            onFocus={({ target }) => (target.placeholder = "Aa")}
            onBlur={({ target }) => (target.placeholder = "send a message")}
          />
          <Button ml={3} colorScheme="teal" type="submit">
            Send
          </Button>
        </Center>
      </form>
    </Box>
  );
}
