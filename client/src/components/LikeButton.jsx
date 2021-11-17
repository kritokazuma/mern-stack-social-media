import React, { useState, useContext } from "react";
import { Button } from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LikeButton({ postId, likes }) {
  const [likeCount, setLikeCount] = useState(likes);

  const { user } = useContext(AuthContext);
  const nevigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (user) {
      const post = await axios.post(`/api/posts?postid=${postId}`);
      setLikeCount(post.data.likes);
    } else {
      nevigate("/login");
    }
  }

  const likedOrNot = user ? likeCount.find(
    (like) => like.username === user.username
  ) : false


  return (
    <Button
      onClick={handleSubmit}
      leftIcon={likedOrNot ? <FaHeart /> : <FiHeart />}
      colorScheme="teal"
      size="sm"
      variant={likedOrNot ? "solid" : "outline"}
    >
      {likeCount.length} {likeCount.length < 2 ? "Like" : "Likes"}
    </Button>
  );
}
