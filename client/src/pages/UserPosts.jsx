import React, { useEffect, useState, useContext, useCallback } from "react";
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
import { Link, useParams } from "react-router-dom";
import { BiUpload } from "react-icons/bi";
import { BsFillPersonPlusFill, BsFillPersonCheckFill } from "react-icons/bs";
import { MdCancelScheduleSend, MdOutlineCancel } from "react-icons/md";
import { AiOutlineMessage } from "react-icons/ai";
import { IoCheckmark } from "react-icons/io5";
import Posts from "../components/Posts";
import { AuthContext } from "../context/AuthContext";
import { socket } from "../App";

export const UserPostsContext = React.createContext();

export default function UserPosts({ acceptUser, isAccept }) {
  const token = localStorage.getItem("token");

  const textBg = useColorModeValue("gray.100", "gray.700");

  const { user } = useContext(AuthContext);

  //photo upload hooks
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("Upload a new profile picture");

  //update the component
  const [update, setUpdate] = useState(true);

  /*-----------hooks fetch from user posts-------------*/
  const [userPosts, setUserPosts] = useState([]);
  const [userDetails, setUserDetail] = useState({});
  const [isFriend, setIsFriend] = useState({
    isFriend: false,
    status: "",
    action: "",
  });

  /*-----------hooks fetch from user posts-------------*/

  /*------------username from params-----------------*/
  const params = useParams();
  const username = params.username;

  /*------------End of username from params-----------------*/

  const profileImg =
    userDetails.profileImage !== null
      ? `/api/${userDetails.profileImage}`
      : " ";

  const toast = useToast();

  /*------------add firend---------------- */
  const handleAddFriend = useCallback(async () => {
    await socket.emit("add_friend", {
      friendId: userPosts[0].user._id,
      username: user.username,
    });
    if (!isFriend.status || !isFriend.isFriend) {
      setIsFriend((preVal) => {
        return {
          ...preVal,
          status: "pending",
        };
      });
    }
    if (
      isFriend.status === "pending" ||
      isFriend.status === "accepted" ||
      isFriend.isFriend
    ) {
      setIsFriend((preVal) => {
        return {
          ...preVal,
          isFriend: false,
          status: "",
        };
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
          friend requested to <b>{userDetails && userDetails.username}</b>
        </Text>
      ),
      status: "success",
      isClosable: "true",
    });
  }, [isFriend]);
  /*------------end of add firend---------------- */

  /*----------photo upload function-----------*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("/api/profile/user/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setUpdate(!update);
  };
  /*----------end-----------*/

  /*---------fetch user posts------------- */
  useEffect(async () => {
    try {
      const getPosts = await axios.get(`/api/posts/user/${username}`);
      setUserPosts(getPosts.data.posts);
      setUserDetail(getPosts.data.user);
    } catch (error) {
      console.log(error);
    }
  }, [update]);
  /*-------end of fetch user posts------------*/

  /*--------------Update isFriend Hook---------------- */
  useEffect(() => {
    /*---------check friend status from userDetails-------- */
    if (Object.keys(userDetails).length > 0) {
      const check = user
        ? userDetails.friends.find((f) => f.user === user.id)
        : false;

      //function to add status and action
      const addDetail = (state) => {
        return check && check !== false ? check[state] : " ";
      };
      setIsFriend({
        isFriend: check && check.status !== "pending" ? true : false,
        status: addDetail("status"),
        action: addDetail("action"),
      });
    }
    /*------------------------end------------------------- */

    //when accept socket return
    if (Object.keys(acceptUser).length > 0) {
      if (acceptUser.username === userDetails.username) {
        setIsFriend((preVal) => {
          return {
            ...preVal,
            isFriend: true,
            status: "accepted",
          };
        });
      }
    }
  }, [userDetails, acceptUser]);

  const acceptOrNot = useCallback(
    (action, make) => {
      socket.emit("accept_friend", {
        userId: userDetails.id,
        status: action,
      });
      setIsFriend((preVal) => {
        return { ...preVal, isFriend: make, status: action };
      });
    },
    [isFriend]
  );
  /*--------------End of update isFriend Hook---------------- */

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
            {isFriend.action === "requested" &&
            isFriend.status === "pending" ? (
              <>
                <IconButton
                  variant="ghost"
                  colorScheme="teal"
                  onClick={() => acceptOrNot("accepted", true)}
                  icon={<IoCheckmark size="1.4rem" />}
                />
                <IconButton
                  variant="ghost"
                  colorScheme="teal"
                  onClick={() => acceptOrNot("rejected", false)}
                  icon={<MdOutlineCancel size="1.4rem" />}
                />
              </>
            ) : (
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
            )}
          </Box>
        )}
        <Text fontWeight="bold" fontSize="xl" mt={3}>
          {userDetails && userDetails.username}
        </Text>
        {user && user.username !== username && (
          <Box ml={5} mt={4}>
            <IconButton
              as={Link}
              to={`/messages/${userDetails.id}?user=${userDetails.username}`}
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
              <Posts post={post} setUserPosts={setUserPosts} />
            </UserPostsContext.Provider>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
