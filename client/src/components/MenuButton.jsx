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
} from "@chakra-ui/react";
import React, { useState, useContext, useRef } from "react";
import { BsPencilSquare, BsTrashFill, BsThreeDots } from "react-icons/bs";
import { ImWarning } from "react-icons/im";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function MenuKey({ username, type, postId, setPosts }) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();

  const { user } = useContext(AuthContext);
  async function handleDelete() {
    if (type === "post") {
      const deletePost = await axios.delete(`/api/posts?postid=${postId}`);
      setPosts((preVal) => {
        return preVal.filter((p) => p._id !== postId);
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
          outline='none'
        />
        <MenuList>
          {user && user.username === username ? (
            <>
              <MenuItem icon={<BsPencilSquare />}>Edit {type}</MenuItem>
              <MenuItem onClick={() => setIsOpen(true)} icon={<BsTrashFill />}>
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
        motionPreset='slideInBottom'
        isCentered
        size='sm'
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Post
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
    </>
  );
}
