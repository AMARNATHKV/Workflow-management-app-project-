import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginSubmit = async (e) => {
    e.preventDefault();
    const loginDetails = {
      email,
      password,
    };

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginDetails),
    });
    console.log(res, "login res from /login");
    if (res.ok) {
      const data = await res.json();
      const userType = data.userType;
      toast.success(`Logged in as : ${userType}`);

      if (userType === "manager") {
        return navigate("/manager-dashboard");
      } else if (userType === "staff") {
        return navigate("/staff-dashboard");
      }
    } else {
      toast.error(`Please check your credentials`);
      return navigate("/login");
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-100 flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">
          Login
        </h2>
        <form onSubmit={loginSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-800 font-medium mb-2"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-800 font-medium mb-2"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-2 rounded-lg focus:outline-none hover:bg-blue-500 transition duration-300"
            >
              Login
            </button>
            
          </div>
          <p className="text-center text-gray-700">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-blue-700 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const getUserType = () => {
  const authToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("Authtoken"))
    ?.split("=")[1];
  console.log("documemnt.cookie vslue", authToken);

  const decoded = jwtDecode(authToken);
  console.log("decoded", decoded);
  const userType = decoded.userType;
  console.log("usertype", userType);
  return userType;
};

export { LoginPage as default, getUserType };
