import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { WsContext } from "../App";
import {
  Box,
  Input,
  Button,
  Center,
  Text,
  Avatar,
  Flex,
} from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";

export default function SingleMessage() {
  const params = useParams();
  const friendId = params.user;

  const { socket } = useContext(WsContext);

  const [searchParams, setSearchParams] = useSearchParams()
  console.log(searchParams.get('user'))

  console.log(friendId);

  return (
    <Box>
      <Box h="80vh" borderWidth="1px" borderRadius="lg" mt={2}>
        <Flex m={3}>
          <Avatar
            size="md"
            name="Dan Abrahmov"
            src="https://bit.ly/dan-abramov"
          />
          <Box
            w="40%"
            bgColor="blue.500"
            px={5}
            py={3}
            ml={2}
            borderRadius="lg"
          >
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
              labore doloribus omnis libero, numquam suscipit voluptatum,
              quibusdam sapiente, optio repellendus quam voluptates cumque
              accusamus atque. Nisi eos molestiae quae dicta.
            </Text>
          </Box>
        </Flex>
      </Box>
      <Center mt={3}>
        <Input
          placeholder="send a message"
          maxW="90%"
          onFocus={({ target }) => (target.placeholder = "Aa")}
          onBlur={({ target }) => (target.placeholder = "send a message")}
        />
        <Button ml={3} colorScheme="teal">
          Send
        </Button>
      </Center>
    </Box>
  );
}
