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
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BiUpload } from "react-icons/bi";
import { BsFillPersonPlusFill, BsFillPersonCheckFill } from "react-icons/bs";
import { MdCancelScheduleSend } from "react-icons/md";
import { AiOutlineMessage } from "react-icons/ai";
import Posts from "../components/Posts";
import { AuthContext } from "../context/AuthContext";
import { socket } from "../App";

export const UserPostsContext = React.createContext();

export default function UserPosts({ acceptUser, isAccept }) {
  const token = localStorage.getItem("token");

  const textBg = useColorModeValue("gray.100", "gray.700");

  const { user } = useContext(AuthContext);

  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("Upload a new profile picture");

  const [update, setUpdate] = useState(true);

  const [userPosts, setUserPosts] = useState([]);
  const [userDetails, setUserDetail] = useState({});
  const [isFriend, setIsFriend] = useState({
    isFriend: false,
    status: "",
  });

  const params = useParams();

  const username = params.username;
  const profileImg =
    userDetails.profileImage !== null
      ? `/api/${userDetails.profileImage}`
      : " ";

  const toast = useToast();

  //add friend
  const handleAddFriend = async () => {
    socket.emit("add_friend", {
      friendId: userPosts[0].user._id,
      username: user.username,
    });
    if (!isFriend.status) {
      setIsFriend((preVal) => {
        return {
          ...preVal,
          status: "pending",
        };
      });
    }
    if (isFriend.status === "pending" || isFriend.isFriend) {
      setIsFriend({
        isFriend: false,
        status: "",
      });
      return toast({
        title: `Undo friend request`,
        status: "success",
        isClosable: "true",
      });
    }
    toast({
      title: `Friend requested successfully`,
      description: (
        <Text>
          friend requested to <b>{userPosts[0].username}</b>
        </Text>
      ),
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
      setUserPosts(getPosts.data.posts);
      setUserDetail(getPosts.data.user);
    } catch (error) {
      console.log(error);
    }
  }, [update]);

  useEffect(() => {
    console.log("user post call eff");
    if (Object.keys(userDetails).length > 0) {
      const check = user
        ? userDetails.friends.find((f) => f.user === user.id)
        : false;
      console.log(check);
      setIsFriend({
        isFriend: check && check.status !== "pending" ? true : false,
        status: check && check !== false ? check.status : " ",
      });
    }
    if (Object.keys(acceptUser).length > 0) {
      if (acceptUser.username === userDetails.username) {
        setIsFriend({
          isFriend: true,
          status: "accepted",
        });
      }
    }
  }, [userDetails, acceptUser]);

  console.log({ isFriend });

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
              icon={
                isFriend.status === "pending" ? (
                  <MdCancelScheduleSend size="1.6rem" />
                ) : isFriend.isFriend || isAccept ? (
                  <BsFillPersonCheckFill size="1.6rem" />
                ) : (
                  <BsFillPersonPlusFill size="1.6rem" />
                )
              }
              onClick={handleAddFriend}
            />
          </Box>
        )}
        <Text fontWeight="bold" fontSize="xl" mt={3}>
          {userDetails && userDetails.username}
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
