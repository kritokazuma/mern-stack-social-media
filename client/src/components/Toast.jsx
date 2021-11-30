import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Text } from "@chakra-ui/react";

export default function Toast({ socket, value: { username, userId } }) {
  const [credentials, setCredentials] = useState({
    userId,
    status: "pending",
  });

  const [status, setStatus] = useState("");

  const respStatus = useCallback(
    (resp) => {
      setStatus(resp);
    },
    [status]
  );

  const handleAccept = async () => {
    const initialStatus = {
      userId,
      status: "accepted",
    };
    setCredentials(initialStatus);
  };

  const handleReject = () => {
    setCredentials((preVal) => {
      return { ...preVal, status: "rejected" };
    });
    socket.emit("accept_friend", credentials);
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
      {status ? (
        status === "accepted" ? (
          <Text>accepted</Text>
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
