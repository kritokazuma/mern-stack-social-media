import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { WsContext } from "../App";

export default function SingleMessage() {
  const params = useParams();
  const friendId = params.user;

  const { socket } = useContext(WsContext);

  console.log(friendId);

  return <div>single message</div>;
}
