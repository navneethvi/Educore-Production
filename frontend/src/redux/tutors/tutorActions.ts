import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  tutorResendOtpService,
  tutorSignupService,
  tutorVerifyEmailService,
  tutorSigninService,
  forgotTutorPassService,
  verifyTutorAccountService,
  tutorResetPassService,
  tutorGoogleSigninService,
  tutorLogoutService,
  tutorCreateCourseService,
  tutorDeleteCourseService,
  tutorFetchCoursesService,
  tutorFetchCourseDetailsService,
  tutorEditCourseService,
} from "./tutorServices";

import {
  TutorSignupData,
  TutorVerifyOtp,
  SigninData,
  TutorResetPassData,
  CourseData,
} from "../../types/types";
import { setAccessToken } from "./tutorSlice";

const handleThunkError = (error: any, thunkAPI: any) => {
  console.log(error);
  return thunkAPI.rejectWithValue(
    error.message || error.response?.data?.error || "Unknown error"
  );
};

export const tutorSignup = createAsyncThunk<
  any,
  TutorSignupData,
  { rejectValue: string }
>("tutorSignup", async (data, thunkAPI) => {
  try {
    const response = await tutorSignupService(data);
    console.log("in TutorSignup===>", response);
    return response.data;
  } catch (error: any) {
    return handleThunkError(error, thunkAPI);
  }
});

export const tutorVerifyEmail = createAsyncThunk<
  any,
  TutorVerifyOtp,
  { rejectValue: string }
>("tutorVerifyEmail", async (data, thunkAPI) => {
  try {
    const response = await tutorVerifyEmailService(data);
    console.log("in TutorVerifyEmail===>", response);
    return response;
  } catch (error: any) {
    return handleThunkError(error, thunkAPI);
  }
});

export const tutorResendOtp = createAsyncThunk<
  any,
  { email: string },
  { rejectValue: string }
>("tutorResendOtp", async (data, thunkAPI) => {
  try {
    const response = await tutorResendOtpService(data);
    console.log("in TutorResendOtp===>", response);
    return response;
  } catch (error: any) {
    return handleThunkError(error, thunkAPI);
  }
});

export const tutorSignin = createAsyncThunk<
  any,
  SigninData,
  { rejectValue: string }
>("tutorSignin", async (data, thunkAPI) => {
  try {
    const response = await tutorSigninService(data);
    console.log("in TutorSignin===>", response);
    return response;
  } catch (error: any) {
    return handleThunkError(error, thunkAPI);
  }
});

export const forgotTutorPass = createAsyncThunk<
  any,
  { email: string },
  { rejectValue: string }
>("forgotTutorPass", async (data, thunkAPI) => {
  try {
    const response = await forgotTutorPassService(data);
    console.log("in TutorForgotPass===>", response);
    return response;
  } catch (error) {
    return handleThunkError(error, thunkAPI);
  }
});

export const verifyTutorAccount = createAsyncThunk<
  any,
  { email: string; otp: string },
  { rejectValue: string }
>("verifyTutorAccount", async (data, thunkAPI) => {
  try {
    const response = await verifyTutorAccountService(data);
    console.log("in TutorVerifyAcc===>", response);
    return response;
  } catch (error: any) {
    return handleThunkError(error, thunkAPI);
  }
});

export const tutorGoogleSignin = createAsyncThunk<
  any,
  { token: string },
  { rejectValue: string }
>("tutorGoogleSignin", async (data: { token: string }, thunkAPI) => {
  try {
    const response = await tutorGoogleSigninService(data);
    console.log("in TutorGoogleSignin===>", response);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const tutorResetPass = createAsyncThunk<
  any,
  TutorResetPassData,
  { rejectValue: string }
>("tutorResetPass", async (data, thunkAPI) => {
  try {
    const response = await tutorResetPassService(data);
    console.log("in TutorResetPass===>", response);
    return response;
  } catch (error: any) {
    return handleThunkError(error, thunkAPI);
  }
});

export const tutorLogout = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("tutorLogout", async (token, thunkAPI) => {
  try {
    const response = await tutorLogoutService(token);
    const newAccessToken = response.headers["authorization"]
    ? response.headers["authorization"].split(" ")[1]
    : null;

  if (newAccessToken) {
    thunkAPI.dispatch(setAccessToken(newAccessToken));
  }
  } catch (error: any) {
    return handleThunkError(error, thunkAPI);
  }
});

export const tutorCreateCourse = createAsyncThunk<
  void,
  { token: string; courseData: any },
  { rejectValue: string }
>("tutorCreateCourse", async ({ token, courseData }, thunkAPI) => {
  try {
    const response = await tutorCreateCourseService(token, courseData);
    console.log("in TutorCreateCourse===>", response);
    return response;
  } catch (error: any) {
    return handleThunkError(error, thunkAPI);
  }
});

export const tutorFetchCourses = createAsyncThunk<
  any,
  { token: string; tutorId: string; status: boolean },
  { rejectValue: string }
>("tutorFetchCourses", async ({ token, tutorId, status }, thunkAPI) => {
  try {
    console.log("her");
    
    const response = await tutorFetchCoursesService(token, tutorId, status);
    const newAccessToken = response.headers["authorization"]
    ? response.headers["authorization"].split(" ")[1]
    : null;

  if (newAccessToken) {
    thunkAPI.dispatch(setAccessToken(newAccessToken));
  }
  console.log("res.data", response.data);
  
    return response.data;
  } catch (error: any) {
    return handleThunkError(error, thunkAPI);
  }
});

export const tutorDeleteCourse = createAsyncThunk<
  string,
  { token: string; courseId: string },
  { rejectValue: string }
>("tutordeleteCourse", async ({ token, courseId }, thunkAPI) => {
  try {
    const response = await tutorDeleteCourseService(token, courseId);
    console.log("in TutorDeleteCourses ===>", response);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Failed to delete course");
  }
});

export const tutorFetchCourseDetails = createAsyncThunk<
  any,
  { token: string; courseId: string },
  { rejectValue: string }
>("tutorFetchCourseDetails", async ({ token, courseId }, thunkAPI) => {
  try {
    const response = await tutorFetchCourseDetailsService(token, courseId);
    console.log("in TutorFetchCourseDetails===>", response);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || "Failed to fetch course details"
    );
  }
});

export const tutorEditCourse = createAsyncThunk<
  any,
  { token: string; courseId: string; courseData: any },
  { rejectValue: string }
>("tutorEditCourse", async ({ token,courseId, courseData }, thunkAPI) => {
  try {
    const response = await tutorEditCourseService(token,courseId, courseData);
    console.log("in TutorEditCourses ===>", response);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Failed to delete course");
  }
});
