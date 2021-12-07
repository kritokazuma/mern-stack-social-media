import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Text } from "@chakra-ui/react";

export default function Toast({
  socket,
  value: { username, userId, setIsAccept },
}) {
  const [credentials, setCredentials] = useState({
    userId,
    status: "pending",
  });

  const [status, setStatus] = useState({});

  const respStatus = useCallback(
    (resp) => {
      setStatus(resp);
    },
    [status]
  );

  const initialStatus = (action) => {
    return { userId, status: action };
  };

  const handleAccept = async () => {
    setCredentials(initialStatus("accepted"));
    setIsAccept(true);
  };

  const handleReject = () => {
    setCredentials(initialStatus("rejected"));
    setIsAccept(false);
  };

  useEffect(() => {
    socket.emit("accept_friend", credentials);
  }, [credentials]);
  useEffect(() => {
    socket.on("friend_request_status", (data) => {
      if (data) {
        respStatus(data);
      }
    });
  }, [socket]);

  return (
    <Box w="100%" mt={1}>
      {Object.keys(status).length > 0 ||
      credentials.status !== "pending" ||
      status.friendId === userId ? (
        credentials.status === "accepted" ? (
          <Text>Accepted</Text>
        ) : (
          <Text>Rejected</Text>
        )
      ) : (
        <>
          <Button onClick={handleAccept} size="sm" colorScheme="teal" mr={6}>
            Accept
          </Button>
          <Button
            size="sm"
            onClick={handleReject}
            variant="outline"
            colorScheme="teal"
          >
            Reject
          </Button>
        </>
      )}
    </Box>
  );
}
