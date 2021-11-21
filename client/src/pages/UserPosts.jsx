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
} from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FcUpload } from "react-icons/fc";
import Posts from "../components/Posts";
import { AuthContext } from "../context/AuthContext";

export const UserPostsContext = React.createContext();

export default function UserPosts() {
  const textBg = useColorModeValue("gray.100", "gray.700");

  const { user } = useContext(AuthContext);

  const [userPosts, setUserPosts] = useState({
    username: "",
    posts: [],
  });
  const params = useParams();

  const username = params.username;

  useEffect(async () => {
    try {
      const getPosts = await axios.get(`/api/posts/user/${username}`);
      setUserPosts(getPosts.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Box>
      <Center mt={20}>
        <Wrap>
          <WrapItem>
            <Avatar size="xl" name="profile" src="https://bit.ly/dan-abramov" />
          </WrapItem>
        </Wrap>
      </Center>
      <Center>
        <Text fontWeight="bold" fontSize="xl" mt={3}>
          {userPosts.username}
        </Text>
      </Center>
      {user.username === username && (
        <Center mt={3}>
          <Box w="300px" borderRadius="lg" backgroundColor={textBg}>
            <label for="file-input">
              <Box p={2}>
                <Flex justifyContent="center">
                  <span>Upload new profile picture</span>
                  <FcUpload size="1.5rem" />
                </Flex>
              </Box>
            </label>
            <Input
              display="none"
              id="file-input"
              colorScheme="teal"
              type="file"
            />
          </Box>
        </Center>
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
        {userPosts.posts.map((post) => (
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
