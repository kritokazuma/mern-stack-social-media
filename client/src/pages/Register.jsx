import {
  Flex,
  Input,
  Heading,
  Button,
  useColorModeValue,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import Hooks from "../utils/Hooks";

export default function Register() {
  const formBackground = useColorModeValue("gray.100", "gray.700");
  const lightOrDark = localStorage.getItem("chakra-ui-color-mode");

  const { value, handleChange, handleSubmit, errors } = Hooks({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  }, "register");

  return (
    <Flex height="100vh" mt={20} justifyContent="center">
      <form onSubmit={handleSubmit}>
        <Flex direction="column" background={formBackground} p={12} rounded={6}>
          <FormControl isRequired={true}>
            <Heading mb={6} size="lg">
              Register
            </Heading>
            <FormLabel>Email</FormLabel>
            <Input
              variant={lightOrDark === "dark" ? "filled" : "flushed"}
              placeholder="youremail@email.com"
              mb={3}
              type="email"
              name="email"
              value={value.email}
              onChange={handleChange}
            />
            <FormLabel>Username</FormLabel>
            <Input
              variant={lightOrDark === "dark" ? "filled" : "flushed"}
              placeholder="JohnDoe"
              mb={3}
              type="text"
              name="username"
              value={value.username}
              onChange={handleChange}
            />
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="********"
              variant={lightOrDark === "dark" ? "filled" : "flushed"}
              mb={3}
              type="password"
              name="password"
              value={value.password}
              onChange={handleChange}
            />
            <FormLabel>Confirm Password</FormLabel>
            <Input
              placeholder="********"
              variant={lightOrDark === "dark" ? "filled" : "flushed"}
              mb={6}
              type="password"
              name="confirmPassword"
              value={value.confirmPassword}
              onChange={handleChange}
            />
            <Button type="submit" colorScheme="teal">
              Register
            </Button>
          </FormControl>
        </Flex>
      </form>
    </Flex>
  );
}
