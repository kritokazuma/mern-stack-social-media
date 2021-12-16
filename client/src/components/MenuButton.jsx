import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialog,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState, useContext, useRef } from "react";
import { BsPencilSquare, BsTrashFill, BsThreeDots } from "react-icons/bs";
import { ImWarning } from "react-icons/im";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import DrawerAdd from "./DrawerAdd";

export default function MenuKey({
  username,
  type,
  location,
  postId,
  commentId,
  setPosts,
  setComments,
  toHome,
  post,
  setPost,
  setUserPosts,
}) {
  //hook to open drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const closeDrawer = () => setIsDrawerOpen(false);

  //ref for alert dialog
  const cancelRef = useRef();

  //to Nevigate
  const nevigate = useNavigate();

  //Hook, for alert
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user } = useContext(AuthContext);

  async function handleDelete() {
    if (type === "post") {
      const deletePost = await axios.delete(`/api/posts?postid=${postId}`);
      setPosts &&
        setPosts((preVal) => {
          return preVal.filter((p) => p._id !== postId);
        });
      setUserPosts &&
        setUserPosts((preVal) => {
          return preVal.filter((p) => p._id !== postId);
        });
      toHome && nevigate("/");
    }
    if (type === "comment") {
      const deleteComment = await axios.delete(
        `/api/posts/${postId}?commentid=${commentId}`
      );
      setComments((preVal) => {
        const deleteComment = preVal.filter((c) => c._id !== commentId);
        return deleteComment;
      });
    }
  }

  return (
    <>
      <Menu>
        <MenuButton
          variant="ghost"
          as={IconButton}
          aria-label="Options"
          icon={<BsThreeDots />}
          outline="none"
        />
        <MenuList>
          {user && user.username === username ? (
            <>
              <MenuItem
                onClick={() => setIsDrawerOpen(true)}
                icon={<BsPencilSquare />}
              >
                Edit {type}
              </MenuItem>
              <MenuItem onClick={onOpen} icon={<BsTrashFill />}>
                Delete {type}
              </MenuItem>
            </>
          ) : (
            <MenuItem icon={<ImWarning />}>Report</MenuItem>
          )}
        </MenuList>
      </Menu>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
        motionPreset="slideInBottom"
        isCentered
        size="sm"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete {_.startCase(_.toLower(type))}
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button colorScheme="red" ml={3} onClick={handleDelete}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <DrawerAdd
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        closeDrawer={closeDrawer}
        postId={postId}
        location={location}
        post={post}
        setPost={setPost}
        type={type}
        commentId={commentId}
      />
    </>
  );
}
