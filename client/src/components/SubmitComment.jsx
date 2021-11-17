import React, { useState, useRef } from "react";
import { Input, Box, IconButton } from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import axios from "axios";

export default function SubmitComment({ postId, setComments }) {
  const [comment, setComment] = useState("");
  const commentRef = useRef()

  async function handleSubmit(e) {
    e.preventDefault();
    const submitComment = await axios.post(`/api/posts/${postId}`, {
      body: comment,
    });
    setComments(submitComment.data.comments);
    setComment("");
    commentRef.current.blur()
  }

  return (
    <Box mt={3} w="100%">
      <form style={{ display: "flex" }} onSubmit={handleSubmit}>
        <Input
          w={["88%", "95%"]}
          placeholder="Write a comment..."
          variant="filled"
          value={comment}
          ref={commentRef}
          focusBorderColor='teal.300'
          onChange={(e) => setComment(e.target.value)}
        />
        <IconButton disabled={comment.trim() === ""} colorScheme='teal' type='submit' ml="auto" icon={<FiSend />} />
      </form>
    </Box>
  );
}
