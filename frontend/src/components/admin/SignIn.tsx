/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetActions } from "../../redux/admin/adminSlice";

import { RootState, AppDispatch } from "../../store/store";

import { adminSignin } from "../../redux/admin/adminActions";

const AdminSignIn: React.FC = () => {
  const [email, setEmail] = useState("pegpilot7@gmail.com");
  const [password, setPassword] = useState("admin");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();

  const { loading, error, message, success } = useSelector(
    (state: RootState) => state.admin
  );

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
    }
    
    if (error) {
      toast.error(error);
      dispatch(resetActions());
    }
    if (success) {
      toast.success("Signin Successfull");
      dispatch(resetActions());
      navigate("/admin/dashboard", {
        state: { email: email },
      });
    }
  });

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSignIn = async (): Promise<void> => {
    if (!validateEmail(email)) {
      toast.error("Invalid email format");
      return;
    }
    if (password.length < 4) {
      toast.error("Password must be at least 5 characters long");
      return;
    }

    dispatch(adminSignin({ email, password }));
  };

  return (
    <div className="signin-container flex flex-col md:flex-row items-center md:items-start px-6 pt-32 md:pt-10 md:px-20 lg:px-28 mt-10 md:mt-16 lg:mt-24">
      <ToastContainer />
      <div className="left w-full md:w-1/2 flex flex-col items-center md:items-start px-4 md:px-0 lg:ml-10">
        <div className="heading text-center md:text-left mb-6 w-full">
          <h1 className="text-3xl md:text-4xl font-reem-kufi text-gray-600">
            WELCOME BACK 👨‍💻
          </h1>
          <p className="mt-4 text-gray-500 font-medium">
            Today is a new day, it's your day, you shape it. <br /> Sign in to
            continue your learning.
          </p>
        </div>
        <div className="w-full max-w-md mb-6">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-medium mb-2 font-reem-kufi"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-500 rounded-lg bg-gray-50 text-gray-800  font-reem-kufi focus:ring-blue-500 focus:border-blue-500 mb-8"
          />
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-medium mb-2 font-reem-kufi"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-500 rounded-lg bg-gray-50 text-gray-800 font-reem-kufi focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="w-full flex flex-col items-center md:items-start mb-6">
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-800 h-12 text-white px-4 py-2 rounded-lg hover:from-blue-800 hover:to-blue-500 w-full max-w-md mb-10"
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </div>
      <div className="right hidden md:flex md:w-1/2 items-center justify-center mt-6 md:mt-0">
        <img
          src="/signin.png"
          alt="Sign In Illustration"
          className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl object-cover rounded-lg"
        />
      </div>
    </div>
  );
};

export default AdminSignIn;
