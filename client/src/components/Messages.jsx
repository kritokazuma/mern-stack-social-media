import React from "react";
import { Flex, Avatar, Box, Text, useColorModeValue } from "@chakra-ui/react";

export default function Messages({ value: { mes, profileImage, user } }) {
  const textColor = useColorModeValue("gray.100", "gray.100");
  return (
    <Flex
      m={3}
      justifyContent={user.username === mes.sender ? "flex-end" : "flex-start"}
    >
      {user.username !== mes.sender && (
        <Avatar size="md" name={mes.sender} src={profileImage} />
      )}
      <Box maxW="40%" bgColor="blue.500" px={5} py={3} ml={2} borderRadius="lg">
        <Text color={textColor}>{mes.message}</Text>
      </Box>
    </Flex>
  );
}
