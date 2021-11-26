import React, { useState, useRef } from "react";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Container } from "@chakra-ui/layout";
import { AuthProvider } from "./context/AuthContext";
import SinglePost from "./pages/SinglePost";
import UserPosts from "./pages/UserPosts";
import axios from "axios";
import "./App.css";

export const WsContext = React.createContext();

function App() {
  const token = localStorage.getItem("token");

  axios.defaults.headers.common["Authorization"] = `bearer ${token}`;

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
            <Route path="/posts/user/:username" element={<UserPosts />} />
          </Routes>
        </Container>
      </AuthProvider>
    </Router>
  );
}

export default App;
