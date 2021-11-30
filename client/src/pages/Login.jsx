import {
  Center,
  Flex,
  Input,
  Heading,
  Button,
  useColorModeValue,
  FormControl,
  FormLabel,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import Hooks from "../utils/Hooks";

export default function Login(props) {
  const formBackground = useColorModeValue("gray.100", "gray.700");
  const lightOrDark = localStorage.getItem("chakra-ui-color-mode");
  const { value, handleChange, handleSubmit, errors } = Hooks(
    {
      username: "",
      password: "",
    },
    "login",
    props
  );
  console.log(errors && Object.keys(errors).length);
  return (
    <>
      {errors && Object.keys(errors).length > 0 && (
        <Center mt={4}>
          <Alert status="error" w="500px">
            <AlertIcon />
            <AlertTitle mr={2}>Error: </AlertTitle>
            <AlertDescription>Wrong username or password</AlertDescription>
          </Alert>
        </Center>
      )}
      <Flex height="100vh" mt={!errors ? 20 : 5} justifyContent="center">
        <form onSubmit={handleSubmit}>
          <Flex
            direction="column"
            background={formBackground}
            p={12}
            rounded={6}
          >
            <FormControl isRequired={true}>
              <Heading mb={6} size="lg">
                Login
              </Heading>
              <FormLabel>Username</FormLabel>
              <Input
                placeholder="JohnDoe"
                variant={lightOrDark === "dark" ? "filled" : "flushed"}
                mb={3}
                type="text"
                value={value.username}
                name="username"
                onChange={handleChange}
              />
              <FormLabel>Password</FormLabel>
              <Input
                placeholder="********"
                variant={lightOrDark === "dark" ? "filled" : "flushed"}
                mb={6}
                type="password"
                value={value.password}
                name="password"
                onChange={handleChange}
              />
              <Button type="submit" colorScheme="teal">
                Login
              </Button>
            </FormControl>
          </Flex>
        </form>
      </Flex>
    </>
  );
}
