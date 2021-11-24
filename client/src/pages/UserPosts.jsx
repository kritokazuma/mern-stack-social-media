import React, { useEffect, useState, useContext } from "react";
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
} from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BiUpload } from "react-icons/bi";
import Posts from "../components/Posts";
import { AuthContext } from "../context/AuthContext";

export const UserPostsContext = React.createContext();

export default function UserPosts() {
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

  console.log(userPosts);

  return (
    <Box>
      <Center mt={20}>
        <Wrap>
          <WrapItem>
            <Avatar size="xl" name="profile" src={profileImg} />
          </WrapItem>
        </Wrap>
      </Center>
      <Center>
        <Text fontWeight="bold" fontSize="xl" mt={3}>
          {userPosts.length > 0 && userPosts[0].username}
        </Text>
      </Center>
      {user.username === username && (
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
