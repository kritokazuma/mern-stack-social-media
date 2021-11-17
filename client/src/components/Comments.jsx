import React from "react";
import { Box, Wrap, WrapItem, Avatar, Text } from "@chakra-ui/react";
import moment from "moment";
import MenuButton from "./MenuButton";

export default function Comments({ comment }) {
  const { id, username, body, createdAt } = comment;
  return (
    <Box mt={3} display="flex">
      <Box mt={4} ml={5}>
        <Wrap>
          <WrapItem>
            <Avatar size="md" name="profile" src="https://bit.ly/dan-abramov" />
          </WrapItem>
        </Wrap>
      </Box>
      <Box
        ml={3}
        p={5}
        w="100%"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
      >
        <Box display="flex" alignItems="center">
          <Box>
            <Text fontWeight="bold">{username}</Text>
            <Text isTruncated={true} color="gray.500">
              {moment(createdAt).fromNow()}
            </Text>
          </Box>
          <Box placeSelf="flex-start" style={{ marginLeft: "auto" }}>
            <MenuButton type='comment' username={username} />
          </Box>
        </Box>
        <Text mt={5}>{body}</Text>
      </Box>
    </Box>
  );
}
