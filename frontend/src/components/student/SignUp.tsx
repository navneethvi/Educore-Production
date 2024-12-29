import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { studentSignup } from "../../redux/students/studentActions";
import { resetActions } from "../../redux/students/studentSlice";
import { RootState, AppDispatch } from "../../store/store";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { studentSignupValidationSchema } from "../../validations/studentValidation";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { loading, success, error, message } = useSelector(
    (state: RootState) => state.student
  );

  useEffect(() => {
    if (success) {
      toast.success(message);
      dispatch(resetActions());
      navigate("/verify-email", {
        state: { message: "OTP Sent to your email", email: email },
      });
    }
    if (error) {
      toast.error(error);
      dispatch(resetActions());
    }
  }, [success, error, message, dispatch, navigate]);

  const handleSubmit = (values: any) => {
    setEmail(values.email);
    dispatch(
      studentSignup({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: "student",
      })
    );
  };

  return (
    <>
      <ToastContainer />
      <div className="signup-container flex flex-col md:flex-row px-6 md:px-20 pt-32 md:pt-10">
        <div className="left w-full md:w-1/2 flex items-center justify-center">
          <div className="max-w-md mx-auto">
            <div className="heading text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-reem-kufi text-gray-600">
                WELCOME 🚀
              </h1>
              <p className="mt-4 text-gray-500 font-medium">
                Today is a new day, it's your day, you shape it. Sign in to
                continue your learning.
              </p>
            </div>
            <Formik
              initialValues={{
                name: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={studentSignupValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="mt-6 space-y-4">
                  <div className="relative">
                    <label
                      htmlFor="name"
                      className="block text-gray-700 text-sm font-medium mb-2 font-reem-kufi"
                    >
                      Name
                    </label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="block w-full py-2 px-3 border border-gray-500 rounded-lg bg-gray-50 text-gray-800 font-reem-kufi focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="name"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="block text-gray-700 text-sm font-medium mb-2 font-reem-kufi"
                    >
                      Email
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="block w-full py-2 px-3 border border-gray-500 rounded-lg bg-gray-50 text-gray-800 font-reem-kufi focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="phone"
                      className="block text-gray-700 text-sm font-medium mb-2 font-reem-kufi"
                    >
                      Phone No
                    </label>
                    <Field
                      type="tel"
                      id="phone"
                      name="phone"
                      className="block w-full py-2 px-3 border border-gray-500 rounded-lg bg-gray-50 text-gray-800 font-reem-kufi focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="phone"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="password"
                      className="block text-gray-700 text-sm font-medium mb-2 font-reem-kufi"
                    >
                      Password
                    </label>
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      className="block w-full py-2 px-3 border border-gray-500 rounded-lg bg-gray-50 text-gray-800 font-reem-kufi focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-gray-700 text-sm font-medium mb-2 font-reem-kufi"
                    >
                      Confirm Password
                    </label>
                    <Field
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="block w-full py-2 px-3 border border-gray-500 rounded-lg bg-gray-50 text-gray-800 font-reem-kufi focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-blue-800 h-12 text-white px-4 py-2 rounded-lg hover:from-blue-800 hover:to-blue-500 w-full"
                    disabled={isSubmitting || loading}
                  >
                    {loading ? "Signing Up..." : "Sign Up"}
                  </button>
                </Form>
              )}
            </Formik>

            <Link to={"/signin"}>
              <h2 className="text-sm font-semibold font-reem-kufi text-center mt-6 text-gray-600 hover:text-blue-600 cursor-pointer">
                Already have an account?{" "}
                <span className="text-blue-600">Sign In</span>
              </h2>
            </Link>
          </div>
        </div>

        <div className="right hidden md:flex w-full md:w-1/2 items-center justify-center mt-6 md:mt-0 md:ml-20">
          <img
            src="/signup.png"
            alt="Description of the image"
            className="w-full md:w-4/5 lg:w-full xl:max-w-lg 2xl:max-w-xl object-cover rounded-lg"
          />
        </div>
      </div>
    </>
  );
};

export default SignUp;
