import React, { useEffect, useState, useContext, useRef } from "react";
import {
  Box,
  Wrap,
  WrapItem,
  Avatar,
  Center,
  Text,
  Grid,
  Input,
  Flex,
  useColorModeValue,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BiUpload } from "react-icons/bi";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { AiOutlineMessage } from "react-icons/ai";
import Posts from "../components/Posts";
import { AuthContext } from "../context/AuthContext";
import { socket } from "../App";

// const socket = useRef();
export const UserPostsContext = React.createContext();

export default function UserPosts() {
  const token = localStorage.getItem("token");

  const textBg = useColorModeValue("gray.100", "gray.700");

  const { user } = useContext(AuthContext);

  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("Upload a new profile picture");

  const [update, setUpdate] = useState(true);

  const [userPosts, setUserPosts] = useState([]);
  const params = useParams();

  const username = params.username;
  const profileImg =
    userPosts.length > 0 ? `/api/${userPosts[0].user.profileImage}` : " ";

  //websocket

  const [userFromFriendReq, setUserFromFriendReq] = useState("");
  const toast = useToast();
  useEffect(() => {
    console.log("test");

    socket.on("send_message", (data) => {
      if (data) {
        setUserFromFriendReq(data);
        console.log(data);
        toast({
          title: `Friend request`,
          position: "top-right",
          description: `${data} requested friend request`,
          isClosable: "true",
          duration: 15000,
        });
      }
    });
  }, [socket]);

  //add friend
  const handleAddFriend = async () => {
    socket.emit("add_friend", {
      friendId: userPosts[0].user._id,
      username: user.username,
    });
    toast({
      title: `Friend request`,
      description: ` requested friend request`,
      status: "success",
      isClosable: "true",
    });
  };

  //upload a photo
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("/api/profile/user/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res.data);
    setUpdate(!update);
  };

  useEffect(async () => {
    console.log("i got called");
    try {
      const getPosts = await axios.get(`/api/posts/user/${username}`);
      setUserPosts(getPosts.data);
    } catch (error) {
      console.log(error);
    }
  }, [update]);

  return (
    <Box>
      <Center mt={20}>
        <Wrap>
          <WrapItem>
            <Avatar size="xl" name="profile" src={profileImg} />
          </WrapItem>
        </Wrap>
      </Center>
      <Flex alignItems="center" justifyContent="center">
        {user && user.username !== username && (
          <Box mr={5} mt={4}>
            <IconButton
              verticalAlign="text-bottom"
              colorScheme="teal"
              variant="ghost"
              icon={<BsFillPersonPlusFill size="1.6rem" />}
              onClick={handleAddFriend}
            />
          </Box>
        )}
        <Text fontWeight="bold" fontSize="xl" mt={3}>
          {userPosts.length > 0 && userPosts[0].username}
        </Text>
        {user && user.username !== username && (
          <Box ml={5} mt={4}>
            <IconButton
              verticalAlign="text-bottom"
              colorScheme="teal"
              variant="ghost"
              icon={<AiOutlineMessage size="1.6rem" />}
            />
          </Box>
        )}
      </Flex>

      {user && user.username === username && (
        <form onSubmit={handleSubmit}>
          <Center mt={3}>
            <Box w="300px" borderRadius="lg" backgroundColor={textBg}>
              <label htmlFor="file-input">
                <Box className="fileBox" p={2} h="40px">
                  <span>
                    {fileName.length > 30
                      ? `${fileName.slice(0, 30)}...`
                      : fileName}
                  </span>
                </Box>
              </label>
              <Input
                display="none"
                id="file-input"
                colorScheme="teal"
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setFileName(e.target.files[0].name);
                }}
              />
            </Box>
            <IconButton
              ml={3}
              type="submit"
              backgroundColor={textBg}
              icon={<BiUpload size="1.3rem" color="teal" />}
            />
          </Center>
        </form>
      )}
      <Grid
        mt={10}
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}
      >
        {userPosts.map((post) => (
          <Box key={post._id}>
            <UserPostsContext.Provider value={{ post, setUserPosts }}>
              <Posts post={post} />
            </UserPostsContext.Provider>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
