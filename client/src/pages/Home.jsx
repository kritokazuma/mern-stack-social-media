import React, { useEffect, useState, useContext } from "react";
import {
  Heading,
  Center,
  Box,
  Grid,
  Flex,
  Spinner,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  IconButton,
} from "@chakra-ui/react";
import axios from "axios";
import Posts from "../components/Posts";
import { AuthContext } from "../context/AuthContext";
import CreatePost from "../components/CreatePost";
import { BiHome, BiMessageRoundedMinus } from "react-icons/bi";
import { IoNotificationsOutline } from "react-icons/io5";
import MessagePanel from "../components/MessagePanel";

export const HomeContext = React.createContext();

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

  // if (posts.length === 0) {
  //   return (
  //     <Flex height="100vh" alignItems="center" justifyContent="center">
  //       <Spinner size="xl" />
  //     </Flex>
  //   );
  // }

  return (
    <Box pt={5}>
      <Tabs isFitted>
        <TabList>
          <Tab>
            <BiHome color="teal" size="1.9rem" />
          </Tab>
          <Tab>
            <BiMessageRoundedMinus color="teal" size="1.9rem" />
          </Tab>
          <Tab>
            <IoNotificationsOutline color="teal" size="1.9rem" />
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid
              mt={10}
              templateColumns={{
                base: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap={6}
            >
              {user && <CreatePost setPosts={setPosts} posts={posts} />}
              {posts.map((p) => (
                <Box key={p._id}>
                  <HomeContext.Provider value={{ posts, setPosts }}>
                    <Posts post={p} setPosts={setPosts} location="home" />
                  </HomeContext.Provider>
                </Box>
              ))}
            </Grid>
          </TabPanel>
          <TabPanel>
            <MessagePanel />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
