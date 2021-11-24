import React, { useContext } from "react";
import { Box, Wrap, WrapItem, Avatar, Text } from "@chakra-ui/react";
import moment from "moment";
import MenuButton from "./MenuButton";
import { CommentContext } from "../pages/SinglePost";

export default function Comments({ location }) {
  const { comment, postId, setComments } = useContext(CommentContext);
  const { _id, username, body, createdAt, user } = comment;
  const profileImg =
    user.profileImage !== null ? `/api/${user.profileImage}` : " ";

  return (
    <Box mt={3} display="flex">
      <Box mt={4} ml={5}>
        <Wrap>
          <WrapItem>
            <Avatar size="md" name="profile" src={profileImg} />
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
            <MenuButton
              type="comment"
              username={username}
              postId={postId}
              commentId={_id}
              setComments={setComments}
            />
          </Box>
        </Box>
        <Text mt={5}>{body}</Text>
      </Box>
    </Box>
  );
}
