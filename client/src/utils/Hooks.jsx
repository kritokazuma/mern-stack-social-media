import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Hooks(initialVal = {}, route, props) {
  const [value, setValue] = useState(initialVal);
  const [errors, setErrors] = useState({});
  const context = useContext(AuthContext);
  const nevigate = useNavigate();

  function handleChange(e) {
    setValue((preVal) => {
      return {
        ...preVal,
        [e.target.name]: e.target.value,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const returnVal = await axios.post(`/api/users/${route}`, value);
      if (returnVal.status === 200) {
        setValue(initialVal);
        console.log(returnVal);
        context[route](returnVal.data);
        setErrors(false);
        nevigate("/");
      }
    } catch (error) {
      setErrors(error.response.data.errors);
      console.log(errors)
    }
  }

  return { value, handleChange, handleSubmit, errors };
}
