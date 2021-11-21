import React from "react";
import { Box, Text, Stack, Wrap, WrapItem, Avatar } from "@chakra-ui/react";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import moment from "moment";
import { Link } from "react-router-dom";
import MenuButton from "./MenuButton";

export default function SinglePost({ post, setPosts, location }) {
  return (
    <Box
      display="block"
      p={5}
      w="100"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
    >
      <Box display="flex" alignItems="center">
        <Box>
          <Wrap>
            <WrapItem>
              <Avatar
                size="md"
                name="profile"
                src="https://bit.ly/dan-abramov"
              />
            </WrapItem>
          </Wrap>
        </Box>
        <Box ml={2}>
          <Box>
            <Text
              as={Link}
              to={`/posts/user/${post.username}`}
              fontWeight="bold"
            >
              {post.username}
            </Text>
          </Box>
          <Text as={Link} to={`/posts/${post._id}`} color="gray.500">
            {moment(post.createdAt).fromNow()}
          </Text>
        </Box>
        <Box placeSelf="flex-start" style={{ marginLeft: "auto" }}>
          <MenuButton
            type="post"
            username={post.username}
            postId={post._id}
            setPosts={setPosts}
            location={location}
          />
        </Box>
      </Box>
      <Box>
        <Text mt={5}>{post.body}</Text>
      </Box>
      <Stack mt={3} direction="row" spacing={4}>
        <LikeButton postId={post._id} likes={post.likes} />
        <CommentButton postId={post._id} />
      </Stack>
    </Box>
  );
}
