import React, { useState } from "react";
import axiosInstance from "../api/axios";

const Signup = () => {
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      });
      alert(response.data.message || "User registered successfully!");
    } catch (error) {
      console.error(error.response.data.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSignup} className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <input
        type="text"
        placeholder="Username"
        value={name}
        onChange={(e) => setname(e.target.value)}
        className="w-full p-2 mb-4 border"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-4 border"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border"
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Sign Up
      </button>
    </form>
  );
};

export default Signup;
