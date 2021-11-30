import React, { useState, useEffect, useRef } from "react";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Container, useToast, Text } from "@chakra-ui/react";
import { AuthProvider } from "./context/AuthContext";
import SinglePost from "./pages/SinglePost";
import UserPosts from "./pages/UserPosts";
import axios from "axios";
import { io } from "socket.io-client";
import Toast from "./components/Toast";
import "./App.css";

export const WsContext = React.createContext();

const token = localStorage.getItem("token");
export const socket = io("ws://localhost:4000", { query: `token=${token}` });

function App() {
  axios.defaults.headers.common["Authorization"] = `bearer ${token}`;
  //websocket
  const toast = useToast();
  const toastRef = useRef();

  const [acceptUser, setAcceptUser] = useState({});
  const [isAccept, setIsAccept] = useState(false);

  const addToast = (username, userId) => {
    toastRef.current = toast({
      title: (
        <Text>
          Friend requested by <b>{username}</b>
        </Text>
      ),
      position: "top-right",
      isClosable: "true",
      status: "success",
      duration: 5000,
      description: (
        <Toast socket={socket} value={{ username, userId, setIsAccept }} />
      ),
    });
  };

  useEffect(() => {
    socket.on("send_message", ({ username, userId }) => {
      addToast(username, userId);
    });
    socket.on("accept_noti", (data) => setAcceptUser(data));
  }, [socket]);

  useEffect(() => {
    if (Object.keys(acceptUser).length > 0) {
      toast({
        title: `${acceptUser.username} accepted your friend request`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [acceptUser]);

  socket.on("active_user", (data) => {
    console.log(data);
  });

  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Container maxWidth="container.lg">
          <Routes>
            <Route path="/" element={<Home />} render={<NavBar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/posts/:postId" element={<SinglePost />} />
            <Route
              path="/posts/user/:username"
              element={
                <UserPosts acceptUser={acceptUser} isAccept={isAccept} />
              }
            />
          </Routes>
        </Container>
      </AuthProvider>
    </Router>
  );
}

export default App;
