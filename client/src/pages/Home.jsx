import React, { useEffect, useState, useContext } from "react";
import { Heading, Center, Box, Grid, Flex, Spinner } from "@chakra-ui/react";
import axios from "axios";
import Posts from "../components/Posts";
import { AuthContext } from "../context/AuthContext";
import CreatePost from "../components/CreatePost";

export default function Home() {
  const [posts, setPosts] = useState([]);

  const { user } = useContext(AuthContext);

  useEffect(async () => {
    try {
      const getPosts = await axios.get("/api/posts");
      setPosts(getPosts.data);
      console.log("called");
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (posts.length === 0) {
    return (
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box pt={5}>
      <Center>
        <Heading size="xl">Recent Posts</Heading>
      </Center>
      <Grid
        mt={10}
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}
      >
        {user && (
          <CreatePost setPosts={setPosts} posts={posts} />
        )}
        {posts.map((p) => (
          <Posts post={p} key={p._id} setPosts={setPosts} />
        ))}
      </Grid>
    </Box>
  );
}
