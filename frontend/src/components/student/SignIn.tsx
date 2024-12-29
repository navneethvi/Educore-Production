import GoogleIcon from "@mui/icons-material/Google";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { resetActions } from "../../redux/students/studentSlice";
import { studentGoogleSignin, studentSignin } from "../../redux/students/studentActions";
import { RootState, AppDispatch } from "../../store/store";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

import { validateEmail } from "../../validations/emailValidation";
import { validatePassword } from "../../validations/resetPassValidation";

import { motion } from "framer-motion";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();

  const { loading, error, message, success } = useSelector(
    (state: RootState) => state.student
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
      toast.success(message);
      dispatch(resetActions());
      navigate("/dashboard", {
        state: { message: "You've successfully signed in.", email: email },
      });
    }
  }, [error, success, message, email, navigate, dispatch]);

  const handleSignIn = async () => {
    if (!validateEmail(email)) {
      toast.error("Invalid email format");
      return;
    }
    if (!validatePassword(password)) {
      toast.error("Password must be at least 5 characters long");
      return;
    }

    dispatch(studentSignin({ email, password }));
  };



  const responseGoogle = (response: CredentialResponse) => {
    if (response.credential) {
      dispatch(studentGoogleSignin({ token: response.credential }));
    } else {
      console.error('ID token is missing');
    }
  };

  return (
    <div className="signin-container flex flex-col md:flex-row items-center md:items-start px-6 pt-32 md:pt-10 md:px-20 lg:px-28 mt-10 md:mt-16 lg:mt-24">

      <ToastContainer />
      <div className="left w-full md:w-1/2 flex flex-col items-center md:items-start px-4 md:px-0 lg:ml-10">
        <div className="heading text-center md:text-left mb-6 w-full">
          <h1 className="text-3xl md:text-4xl font-reem-kufi text-gray-600">
            WELCOME BACK🚀
          </h1>
          <p className="mt-4 text-gray-500 font-medium">
            Today is a new day, it's your day, you shape it. <br></br> Sign in to continue your learning.
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
            className="block w-full py-2 px-3 border border-gray-500 rounded-lg bg-gray-50 text-gray-800 font-reem-kufi focus:ring-blue-500 focus:border-blue-500 mb-4"
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
          <Link to={"/recover-account"}>
            <p className="text-sm font-reem-kufi cursor-pointer mb-5">
              Forgot password?
            </p>
          </Link>
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-800 h-12 text-white px-4 py-2 rounded-lg hover:from-blue-800 hover:to-blue-500 w-full max-w-md mb-4"
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <div className="w-full max-w-md flex justify-center mb-4">
            <GoogleLogin
              onSuccess={responseGoogle}
              onError={() => console.error("Google Sign-In Error")}
            />
          </div>
          <div className="w-full max-w-md flex justify-center mt-6">
            <Link to={"/signup"}>
              <h2 className="text-sm font-semibold font-reem-kufi text-center text-gray-600 hover:text-blue-600 cursor-pointer">
                Don't have an account?{" "}
                <span className="text-blue-600">Sign Up</span>
              </h2>
            </Link>
          </div>
        </div>
      </div>
      <div className="right hidden md:flex md:w-1/2 items-center justify-center mt-6 md:mt-0">
        <img
          src="/signin.png"
          alt="Description of the image"
          className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl object-cover rounded-lg"
        />
      </div>
    </div>
  );
  
  
};

export default SignIn;
