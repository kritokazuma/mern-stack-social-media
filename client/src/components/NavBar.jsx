import React, { useContext, useState } from "react";
import {
  HStack,
  Text,
  Flex,
  Box,
  useColorMode,
  Button,
  Switch,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaSun } from "react-icons/fa";
import { IoMdMoon } from "react-icons/io";
import { AuthContext } from "../context/AuthContext";

export default function NavBar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useContext(AuthContext);

  const color = colorMode === "light" ? "black" : "white";

  return (
    <Flex
      justifyContent="center"
      py={3}
      style={{ borderBottom: `1px solid ${color}` }}
    >
      <HStack w="80%" fontWeight="semibold">
        <Text as={Link} to="/" fontSize="xl" color="green.400">
          {user ? user.username.toUpperCase() : "HOME"}
        </Text>
        {user ? (
          <Button
            onClick={logout}
            fontSize="xl"
            variant="ghost"
            style={{ marginLeft: "auto" }}
          >
            LOGOUT
          </Button>
        ) : (
          <>
            <Text
              as={Link}
              to="/login"
              fontSize="xl"
              style={{ marginLeft: "auto" }}
              pr={1}
            >
              LOGIN
            </Text>
            <Text as={Link} to="/register" fontSize="xl">
              REGISTER
            </Text>
          </>
        )}
        <Box mt={2} w="20px">
          {colorMode === "light" && <FaSun />}
        </Box>
        <Switch
          size="md"
          isChecked={colorMode === "dark"}
          onChange={toggleColorMode}
        />
        <Box mt={1} w="20px">
          <Box ml={1}>{colorMode === "dark" && <IoMdMoon />}</Box>
        </Box>
      </HStack>
    </Flex>
  );
}
