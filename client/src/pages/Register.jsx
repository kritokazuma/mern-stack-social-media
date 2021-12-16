import {
  Flex,
  Input,
  Heading,
  Button,
  useColorModeValue,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Center,
} from "@chakra-ui/react";
import React from "react";
import Hooks from "../utils/Hooks";

export default function Register() {
  const formBackground = useColorModeValue("gray.100", "gray.700");
  const fromStyle = useColorModeValue("flushed", "filled");

  const { value, handleChange, handleSubmit, errors } = Hooks(
    {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    "register"
  );

  return (
    <>
      {errors && Object.keys(errors).length > 0 && (
        <Center mt={3}>
          <Alert status="error" w="500px">
            <AlertIcon />
            <AlertTitle mr={2}>Error:</AlertTitle>
            <AlertDescription>{Object.values(errors)}</AlertDescription>
          </Alert>
        </Center>
      )}
      <Flex height="100vh" mt={10} justifyContent="center">
        <form onSubmit={handleSubmit}>
          <Flex
            direction="column"
            background={formBackground}
            p={12}
            rounded={6}
          >
            <FormControl isRequired={true}>
              <Heading mb={6} size="lg">
                Register
              </Heading>
              <FormLabel>Email</FormLabel>
              <Input
                variant={fromStyle}
                placeholder="youremail@email.com"
                mb={3}
                type="email"
                name="email"
                value={value.email}
                onChange={handleChange}
              />
              <FormLabel>Username</FormLabel>
              <Input
                variant={fromStyle}
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
                variant={fromStyle}
                mb={3}
                type="password"
                name="password"
                value={value.password}
                onChange={handleChange}
              />
              <FormLabel>Confirm Password</FormLabel>
              <Input
                placeholder="********"
                variant={fromStyle}
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
    </>
  );
}
