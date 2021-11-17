import { useState } from "react";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Container } from "@chakra-ui/layout";
import { AuthProvider } from "./context/AuthContext";
import SinglePost from "./pages/SinglePost";
import axios from 'axios'
import './App.css'

function App() {
  const token = localStorage.getItem('token')

  axios.defaults.headers.common['Authorization'] = `bearer ${token}`

  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Container maxWidth="container.lg">
          <Routes>
            <Route path="/" element={<Home />} render={<NavBar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='/posts/:postId' element={<SinglePost />} />
          </Routes>
        </Container>
      </AuthProvider>
    </Router>
  );
}

export default App;
