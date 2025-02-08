import React, { useState } from "react";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

function Register() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await newRequest.post("/auth/register", user);
      navigate("/");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message); // Show the error message in a pop-up
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
      console.error("Error fetching search results:", err);
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <h1>Create a new account</h1>
        <label>Username</label>
        <input name="username" type="text" placeholder="JohnDoe" onChange={handleChange} />
        <label>Email</label>
        <input name="email" type="email" placeholder="email@example.com" onChange={handleChange} />
        <label>Password</label>
        <input name="password" type="password" onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
