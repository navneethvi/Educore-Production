import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

import { validatePassword, validatePasswordsMatch } from "../../validations/resetPassValidation";

import { AppDispatch, RootState } from "../../store/store";

import { studentResetPass } from "../../redux/students/studentActions";

interface LocationState {
  email: string;
  otp: string;
  message?: string;
}

const ResetPass: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setreNewPassword] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch : AppDispatch = useDispatch();

  const { loading, success, error, message } = useSelector(
    (state: RootState) => state.student
  );

  const { email, otp } = location.state as LocationState;
  console.log("location.state===>", location.state);

  useEffect(() => {
    if (location.state.message) {
      toast.success(location.state.message);
    }
  }, [location.state]);

  useEffect(() => {
    if (success) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Password Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/signin", {
        state: { message: "Password Updated Successfully" },
      });
    } else if (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: message || "An error occurred during password update",
      });
    }
  }, [success, error, message, navigate]);

  const handleUpdatePassword = async () => {
    if (!validatePasswordsMatch(newPassword, reNewPassword)) {
      toast.error("Passwords do not match");
      return;
    }

    if (!validatePassword(reNewPassword)) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    const data = {
      email,
      otp,
      newPassword,
      confirmNewPassword: reNewPassword,
    };

    dispatch(studentResetPass(data));
  };

  return (
    <>
    <ToastContainer />
    <div className="reset-pass-container flex flex-col md:flex-row px-6 md:px-20 py-44 md:py-20 items-center">
      <div className="left w-full md:w-1/2 flex flex-col items-center md:items-start max-w-lg md:ml-20">
        <div className="heading text-center md:text-left mb-6">
          <h1 className="text-3xl md:text-4xl font-reem-kufi text-gray-600">
            RESET YOUR PASSWORD
          </h1>
          <p className="w-full md:w-96 mt-4 text-gray-500 font-medium">
            Enter a new password for your account.
          </p>
        </div>
        <div className="mt-6 w-full">
          <label
            htmlFor="new-password"
            className="block text-gray-700 text-sm font-medium mb-2 font-reem-kufi"
          >
            New Password
          </label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-500 rounded-lg bg-gray-50 text-gray-800 font-reem-kufi focus:ring-blue-500 focus:border-blue-500 mb-4"
          />
          <label
            htmlFor="re-new-password"
            className="block text-gray-700 text-sm font-medium mb-2 font-reem-kufi"
          >
            Re-enter New Password
          </label>
          <input
            type="password"
            id="re-new-password"
            value={reNewPassword}
            onChange={(e) => setreNewPassword(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-500 rounded-lg bg-gray-50 text-gray-800 font-reem-kufi focus:ring-blue-500 focus:border-blue-500 mb-6"
          />
          {!loading ? (
            <button
              className="bg-gradient-to-r from-blue-500 to-blue-800 h-12 text-white px-4 py-2 rounded-lg hover:from-blue-800 hover:to-blue-500 w-full"
              onClick={handleUpdatePassword}
            >
              Change Password
            </button>
          ) : (
            <button className="bg-gradient-to-r from-blue-500 to-blue-800 h-12 text-white px-4 py-2 rounded-lg hover:from-blue-800 hover:to-blue-500 w-full">
              Loading...
            </button>
          )}
        </div>
      </div>
      <div className="right hidden md:block md:w-1/2 mt-6">
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

export default ResetPass;
