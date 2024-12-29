import * as Yup from "yup";

export const tutorSignUpValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be between 3 and 20 characters.")
    .max(20, "Name must be between 3 and 20 characters.")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Please enter a valid phone number.")
    .required("Phone number is required."),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});
