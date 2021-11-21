import React, { useState, useRef, useContext, useEffect } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import { HomeContext } from "../pages/Home";
import { CommentContext } from "../pages/SinglePost";
import { UserPostsContext } from "../pages/UserPosts";

export default function DrawerAdd({
  isDrawerOpen,
  closeDrawer,
  postId,
  location,
  post,
  setPost,
  type,
  commentId,
}) {
  const [postInp, setPostInp] = useState("");
  const context = useContext(HomeContext);

  const commentContext = useContext(CommentContext);

  const UserContext = useContext(UserPostsContext);

  useEffect(async () => {
    if (location === "home") {
      const findPost = await context.posts.find((p) => p._id === postId);
      setPostInp(findPost.body);
    }
    if (location === "single") {
      setPostInp(post.body);
    }
    if (type === "comment") {
      setPostInp(commentContext.comment.body);
    }

    if (UserContext) {
      setPostInp(UserContext.post.body);
    }
  }, []);

  async function handleEditPost() {
    const post = await axios.put(`/api/posts/${postId}`, { body: postInp });
    if (UserContext) {
      UserContext.setUserPosts((preVal) => {
        const updatePost = preVal.posts.map((p) => {
          if (p._id === postId) {
            return post.data;
          } else {
            return p;
          }
        });
        return { ...preVal, posts: updatePost };
      });
    }

    if (location === "home") {
      const replacePost = () => {
        const findIndex = context.posts.findIndex((p) => p._id === postId);
        const newPosts = context.posts.map((p) => {
          if (p._id === postId) {
            return post.data;
          } else {
            return p;
          }
        });
        return newPosts;
      };

      context.setPosts(replacePost);
    }

    if (location === "single") {
      setPost(post.data);
    }
    closeDrawer();
  }

  async function handleEditComment() {
    const updateComment = await axios.patch(
      `/api/posts/${postId}?commentid=${commentId}`,
      { body: postInp }
    );
    commentContext.setComments(updateComment.data.comments);
    closeDrawer();
  }

  const btnRef = useRef();
  return (
    <Drawer
      isOpen={isDrawerOpen}
      placement="right"
      onClose={closeDrawer}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Edit your content</DrawerHeader>
        <DrawerBody>
          <Textarea
            value={postInp}
            onChange={(e) => setPostInp(e.target.value)}
            placeholder="Edit your content..."
            resize="none"
          />
        </DrawerBody>
        <DrawerFooter>
          <Button onClick={closeDrawer} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={type === "comment" ? handleEditComment : handleEditPost}
            colorScheme="blue"
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
