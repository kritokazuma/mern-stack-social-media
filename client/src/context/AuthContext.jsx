import React, { createContext, useReducer } from "react";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();
const initialState = {
  user: null,
};

if (localStorage.getItem("token")) {
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("token");
  } else {
    initialState.user = decodedToken;
    initialState.token = token;
  }
}

const authReducer = (state, action) => {
  switch (action.value) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "REGISTER":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
      };

    default:
      return state;
  }
};

export const AuthProvider = (props) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  function login(userData) {
    localStorage.setItem("token", userData.token);
    dispatch({ type: "LOGIN", payload: userData.token });
    window.location.replace("/");
  }

  function register(userData) {
    localStorage.setItem("token", userData.token);
    dispatch({ type: "REGISTER", payload: userData.token });
    window.location.replace("/");
  }

  function logout(userData) {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    window.location.reload();
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout, register }}
      {...props}
    />
  );
};
