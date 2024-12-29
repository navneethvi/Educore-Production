import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { tutorSignup } from "../../redux/tutors/tutorActions";
import { resetActions } from "../../redux/tutors/tutorSlice";
import { tutorSignUpValidationSchema } from "../../validations/tutorValidation";

import { RootState, AppDispatch } from "../../store/store";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
}

const TutorSignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { loading, success, error, message } = useSelector(
    (state: RootState) => state.tutor
  );

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "tutor",
    },
    validationSchema: tutorSignUpValidationSchema,
    onSubmit: (
      values: FormValues,
      formikHelpers: FormikHelpers<FormValues>
    ) => {
      setEmail(values.email);
      dispatch(
        tutorSignup({
          name: values.name,
          email: values.email,
          phone: values.phone,
          password: values.password,
          confirmPassword: values.confirmPassword,
          role: "tutor",
        })
      );
    },
  });

  useEffect(() => {
    if (success) {
      toast.success(message);
      navigate("/tutor/verify-otp", {
        state: { message: "OTP Sented to your email", email: email },
      });
      dispatch(resetActions());
    }
    if (error) {
      toast.error(error || "Sign up failed. Please try again.");
      dispatch(resetActions());
    }
  }, [success, error, message, navigate, dispatch]);

  return (
    <>
      <ToastContainer />
      <div className="signup-container flex flex-col lg:flex-row px-6 lg:px-20 pt-8 lg:pt-10 items-center lg:items-center justify-center lg:justify-between min-h-screen">
        <div className="left w-full lg:w-1/2 max-w-lg flex flex-col items-center lg:items-start lg:ml-10">
          <div className="heading text-center lg:text-left mb-6">
            <h1 className="text-3xl lg:text-4xl font-reem-kufi text-gray-600">
              WELCOME 🎓
            </h1>
            <p className="mt-4 text-gray-500 font-medium w-full lg:w-96">
              Share Your Knowledge, Inspire the Future
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="w-full">
            <div className="relative mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-medium mb-2 font-reem-kufi"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                {...formik.getFieldProps("name")}
                className="block w-full py-2 px-3 border border-gray-500 rounded-lg bg-gray-50 text-gray-800 font-reem-kufi focus:ring-blue-500 focus:border-blue-500"
              />
              {formik.touched.name && formik.errors.name ? (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.name}
                </p>
              ) : null}
            </div>

            <div className="relative mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-2 font-reem-kufi"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...formik.getFieldProps("email")}
                className="block w-full py-2 px-3 border border-gray-500 rounded-lg bg-gray-50 text-gray-800 font-reem-kufi focus:ring-blue-500 focus:border-blue-500"
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </p>
              ) : null}
            </div>

            <div className="relative mb-4">
              <label
                htmlFor="phone"
                className="block text-gray-700 text-sm font-medium mb-2 font-reem-kufi"
              >
                Phone No
              </label>
              <input
                type="tel"
                id="phone"
                {...formik.getFieldProps("phone")}
                className="block w-full py-2 px-3 border border-gray-500 rounded-lg bg-gray-50 text-gray-800 font-reem-kufi focus:ring-blue-500 focus:border-blue-500"
              />
              {formik.touched.phone && formik.errors.phone ? (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.phone}
                </p>
              ) : null}
            </div>

            <div className="relative mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-medium mb-2 font-reem-kufi"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...formik.getFieldProps("password")}
                className="block w-full py-2 px-3 border border-gray-500 rounded-lg bg-gray-50 text-gray-800 font-reem-kufi focus:ring-blue-500 focus:border-blue-500"
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </p>
              ) : null}
            </div>

            <div className="relative mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 text-sm font-medium mb-2 font-reem-kufi"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...formik.getFieldProps("confirmPassword")}
                className="block w-full py-2 px-3 border border-gray-500 rounded-lg bg-gray-50 text-gray-800 font-reem-kufi focus:ring-blue-500 focus:border-blue-500"
              />
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.confirmPassword}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-800 h-12 text-white px-4 py-2 rounded-lg hover:from-blue-800 hover:to-blue-500 w-full mb-4"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <div className="w-full flex justify-center">
            <Link to={"/tutor/signin"}>
              <h2 className="text-sm font-semibold font-reem-kufi text-center mt-6 text-gray-600 hover:text-blue-600 cursor-pointer">
                Already have an account?{" "}
                <span className="text-blue-600">Sign In</span>
              </h2>
            </Link>
          </div>
        </div>
        <div className="right hidden lg:flex w-full lg:w-1/2 items-center justify-center lg:h-full">
          <img
            src="/signup.png"
            alt="Sign up illustration"
            className="w-full lg:w-4/5 object-cover rounded-lg"
          />
        </div>
      </div>
    </>
  );
};

export default TutorSignUp;
