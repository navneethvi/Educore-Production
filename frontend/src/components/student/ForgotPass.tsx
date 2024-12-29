/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { resetActions } from "../../redux/students/studentSlice";
import {
  forgotStudentPass,
  verifyStudentAccount,
} from "../../redux/students/studentActions";
import { RootState } from "../../store/store";

interface State {
  loading: boolean;
  success: boolean;
  error: string | null;
  otpVerifyLoading: boolean;
  otpVerifySuccess: boolean;
  otpVerifyError: string | null;
}

const ForgotPass: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch : AppDispatch = useDispatch();

  const {
    loading,
    success,
    error,
    otpVerifyLoading,
    otpVerifySuccess,
    otpVerifyError,
  } : State = useSelector((state: RootState) => state.student);

  useEffect(() => {
    if (success) {
      toast.success("Otp sent successfully");
    }
    if (error) {
      toast.error(error);
    }
  }, [success, error]);

  useEffect(() => {
    if (otpVerifyError) {
      toast.error(otpVerifyError);
    }
  }, [otpVerifySuccess, otpVerifyError]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (!element.value.match(/^[0-9]*$/)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      event.currentTarget.previousSibling
    ) {
      (event.currentTarget.previousSibling as HTMLInputElement).focus();
    }
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailSubmit = () => {
    if (!validateEmail(email)) {
      toast.error("Invalid email format");
      return;
    }

    console.log("Email before dispatch :::", email);

    dispatch(forgotStudentPass({ email }));
  };

  const handleOtpSubmit = () => {
    console.log("im hereeeeeeeeeeeeeeeee");
    
    const otpCode = otp.join("");
    dispatch(verifyStudentAccount({ email, otp: otpCode })).then((result) => {
      console.log(result.payload.isValid);
      console.log(result.type === "verifyStudentAccount/fulfilled");
      
      if (
        result.type === "verifyStudentAccount/fulfilled" &&
        result.payload.isValid
      )  {
        console.log("hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        navigate("/reset-pass", {
          state: {
            message: "Email Verified Successfully",
            email,
            otp: otpCode,
          },
        });
        dispatch(resetActions())
      }
    });
  };

  return (
    <>
      <ToastContainer />
      <div className="signup-container flex flex-col md:flex-row px-6 md:px-20 py-44 md:py-20 items-center">
      <div className="left w-full md:w-1/2 max-w-lg md:ml-20 mb-10 md:mb-0">
      <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-reem-kufi text-gray-600">
              RECOVER YOUR ACCOUNT
            </h1>
            <p className="mt-4 text-gray-500 font-medium">
              We will send you an email with instructions to reset your password.
            </p>
          </div>
          <div className="mt-6">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-2 font-reem-kufi"
            >
              Email
            </label>
            <div className="flex flex-col md:flex-row justify-center md:justify-start space-y-4 md:space-y-0 md:space-x-4 mb-8">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow py-2 px-3 border border-gray-500 rounded-lg bg-gray-50 text-gray-800 font-reem-kufi focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                className={`bg-gradient-to-r from-blue-500 to-blue-800 h-11 text-white px-4 py-2 rounded-lg w-full md:w-32 ${
                  loading
                    ? "cursor-not-allowed"
                    : "hover:from-blue-800 hover:to-blue-500"
                }`}
                onClick={handleEmailSubmit}
                disabled={loading}
              >
                {loading ? "Loading..." : "Send OTP"}
              </button>
            </div>
          </div>

          <label
            htmlFor="otp"
            className="block text-gray-700 text-sm font-medium mt-6 mb-2 font-reem-kufi"
          >
            OTP
          </label>
          <div className="flex flex-wrap justify-center gap-4">
            {otp.map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleChange(e.target as HTMLInputElement, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-16 h-12 border border-gray-500 rounded-lg bg-gray-50 text-gray-800 font-reem-kufi text-center text-xl focus:ring-blue-500 focus:border-blue-500"
              />
            ))}
          </div>

          <button
            className={`bg-gradient-to-r from-blue-500 to-blue-800 h-12 text-white px-4 py-2 rounded-lg w-full mt-6 ${
              otpVerifyLoading
                ? "cursor-not-allowed"
                : "hover:from-blue-800 hover:to-blue-500"
            }`}
            onClick={handleOtpSubmit}
            disabled={otpVerifyLoading}
          >
            {otpVerifyLoading ? "Loading..." : "Submit"}
          </button>
        </div>
        <div className="hidden md:block md:w-1/2 mt-6">
          <img
            src="/signin.png"
            alt="Description of the image"
            className="w-full object-cover rounded-lg"
          />
        </div>
      </div>
    </>
  );
};


export default ForgotPass;
