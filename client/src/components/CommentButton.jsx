import React, {useContext} from "react";
import { Button } from "@chakra-ui/react";
import { BiMessageSquareDots } from "react-icons/bi";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function CommentButton({postId}) {

  const {user} = useContext(AuthContext)

  return (
    <Button
      leftIcon={<BiMessageSquareDots />}
      size="sm"
      colorScheme="teal"
      variant="outline"
      as={Link}
      to={user ? `/posts/${postId}` : "/login"}
    >
      Comment
    </Button>
  );
}
