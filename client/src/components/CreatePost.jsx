import React, { useState, useRef } from "react";
import { Box, Input, Button, Text } from "@chakra-ui/react";
import { HiPencilAlt } from "react-icons/hi";
import axios from "axios";

export default function CreatePost({ refetch, setPosts, posts }) {
  const [post, setPost] = useState("");

  const postRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    const createPost = await axios.post("api/posts/createpost", { body: post });
    await setPosts((preVal) => [createPost.data, ...preVal]);
    setPost("");
    postRef.current.blur();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box p={5} w="100%" borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Text fontSize="md">Create a new post</Text>
        <Input
          placeholder="say something..."
          mt={2}
          type="text"
          variant="outline"
          value={post}
          onChange={(e) => setPost(e.target.value)}
          ref={postRef}
        />
        <Button
          leftIcon={<HiPencilAlt />}
          size="sm"
          type="submit"
          colorScheme="teal"
          mt={4}
        >
          Submit
        </Button>
      </Box>
    </form>
  );
}
