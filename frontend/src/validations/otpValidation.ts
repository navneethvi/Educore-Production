import * as Yup from "yup";

export const otpValidationSchema = Yup.object({
  otp: Yup.array()
    .of(Yup.string().matches(/^[0-9]*$/, "OTP must be a number").required("OTP is required"))
    .min(4, "OTP must be 4 digits long")
    .max(4, "OTP must be 4 digits long"),
});
