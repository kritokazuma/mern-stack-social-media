import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Image,
  Text,
  Flex,
  Spinner,
  Stack,
  WrapItem,
  Wrap,
  Avatar,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import LikeButton from "../components/LikeButton";
import CommentButton from "../components/CommentButton";
import MenuButton from "../components/MenuButton";
import Comments from "../components/Comments";
import SubmitComment from "../components/SubmitComment";
import { AuthContext } from "../context/AuthContext";

export default function SinglePost() {
  const parmas = useParams();
  const postId = parmas.postId;
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);

  useEffect(async () => {
    const getPost = await axios.get(`/api/posts/${postId}`);
    setPost(getPost.data);
    setComments(getPost.data.comments);
  }, []);

  if (!post) {
    return (
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <>
      <Box
        mt={7}
        p={5}
        w="100%"
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
          <Box ml={4}>
            <Text fontWeight="bold" fontSize="lg">
              {post.username}
            </Text>
            <Text isTruncated={true} color="gray.500">
              {moment(post.createdAt).fromNow()}
            </Text>
          </Box>
          <Box placeSelf="flex-start" style={{ marginLeft: "auto" }}>
            <MenuButton username={post.username} />
          </Box>
        </Box>
        <Box>
          <Text mt={5} fontSize="lg">
            {post.body}
          </Text>
        </Box>
        <Stack mt={3} direction="row" spacing={3}>
          <LikeButton postId={post._id} likes={post.likes} />
          <CommentButton postId={post._id} />
        </Stack>
      </Box>
      {user && <SubmitComment postId={postId} setComments={setComments} />}
      {comments.map((comment) => (
        <Box key={comment._id}>
          <Comments comment={comment} />
        </Box>
      ))}
    </>
  );
}
