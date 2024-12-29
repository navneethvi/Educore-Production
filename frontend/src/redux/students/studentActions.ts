import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  studentVerifyEmailService,
  studentResendOtpService,
  studentSignupService,
  setStudentInterestsService,
  forgotStudentPassService,
  verifyStudentAccountService,
  studentSigninService,
  studentResetPassService,
  studentGoogleSigninService,
  studentLogoutService,
  studentFetchCoursesService,
  studentCreatePaymentService,
  studentGetEnrolledCoursesService,
  studentGetTutorInfoService,
  getUsersWithExistingChatService,
} from "./studentServices";

import {
  SetStudentInterestsPayload,
  SigninData,
  StudentResendOtp,
  StudentResetPassData,
  StudentSignupData,
  StudentVerifyOtp,
} from "../../types/types";
import { setAccessToken } from "./studentSlice";

const handleThunkError = (error: any, thunkAPI: any) => {
  console.error("Thunk Error:", error);

  // Check if the error is an Axios error with a response
  if (error.response) {
    // HTTP error from server
    const status = error.response.status;
    const message = error.response.data?.error || error.response.data?.message;

    // Handle specific status codes if needed
    if (status === 409) {
      return thunkAPI.rejectWithValue("You are already enrolled in this course.");
    } else if (status === 400) {
      return thunkAPI.rejectWithValue("Bad Request. Please check your input.");
    }

    // Return generic message for other HTTP errors
    return thunkAPI.rejectWithValue(message || "Server error occurred.");
  } else if (error.request) {
    // Network error or no response received
    return thunkAPI.rejectWithValue("Network error. Please check your connection.");
  } else {
    // General JavaScript error or unexpected issue
    return thunkAPI.rejectWithValue(error.message || "An unexpected error occurred.");
  }
};


export const studentSignup = createAsyncThunk<
  any,
  StudentSignupData,
  { rejectValue: string }
>("studentSignup", async (data, thunkAPI) => {
  try {
    const response = await studentSignupService(data);
    console.log("in StudentSignup===>", response);
    return response;
  } catch (error: any) {
    return handleThunkError(error, thunkAPI);
  }
});

export const studentVerifyEmail = createAsyncThunk<
  any,
  StudentVerifyOtp,
  { rejectValue: string }
>("studentVerifyEmail", async (data, thunkAPI) => {
  try {
    const response = await studentVerifyEmailService(data);
    console.log("in StudentVerifyEmail===>", response);
    return response.data;
  } catch (error: any) {
    return handleThunkError(error, thunkAPI);
  }
});

export const studentResendOtp = createAsyncThunk<
  any,
  StudentResendOtp,
  { rejectValue: string }
>("studentResendOtp", async (data, thunkAPI) => {
  try {
    const response = await studentResendOtpService(data);
    console.log("in StudentResendOtp===>", response);
    return response.data;
  } catch (error: any) {
    return handleThunkError(error, thunkAPI);
  }
});

export const setStudentInterests = createAsyncThunk<
  any,
  SetStudentInterestsPayload,
  { rejectValue: string }
>("setStudentInterests", async (data, thunkAPI) => {
  try {
    const response = await setStudentInterestsService(data);
    console.log("in StudentSetInterests===>", response);
    return response;
  } catch (error: any) {
    return handleThunkError(error, thunkAPI);
  }
});

export const forgotStudentPass = createAsyncThunk<
  any,
  { email: string },
  { rejectValue: string }
>("forgotStudentPass", async (data, thunkAPI) => {
  try {
    const response = await forgotStudentPassService(data);
    console.log("in StudentForgotPass===>", response);
    return response.data;
  } catch (error: any) {
    return handleThunkError(error, thunkAPI);
  }
});

export const verifyStudentAccount = createAsyncThunk<
  any,
  { email: string; otp: string },
  { rejectValue: string }
>("verifyStudentAccount", async (data, thunkAPI) => {
  try {
    const response = await verifyStudentAccountService(data);
    console.log("in StudentVerifyAcc===>", response);
    return response;
  } catch (error: any) {
    return handleThunkError(error, thunkAPI);
  }
});

export const studentSignin = createAsyncThunk<
  any,
  SigninData,
  { rejectValue: string }
>("studentSignin", async (data, thunkAPI) => {
  try {
    const response = await studentSigninService(data);
    console.log("in StudentSignin===>", response);
    return response;
  } catch (error: any) {
    return handleThunkError(error, thunkAPI);
  }
});

export const studentGoogleSignin = createAsyncThunk<
  any,
  { token: string },
  { rejectValue: string }
>("studentGoogleSignin", async (data: { token: string }, thunkAPI) => {
  try {
    const response = await studentGoogleSigninService(data);
    console.log("in StudentGoogleSignin===>", response);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const studentResetPass = createAsyncThunk<
  any,
  StudentResetPassData,
  { rejectValue: string }
>("studentResetPass", async (data, thunkAPI) => {
  try {
    const response = await studentResetPassService(data);
    console.log("in StudentResetPass===>", response);
    return response.data;
  } catch (error: any) {
    return handleThunkError(error, thunkAPI);
  }
});

export const studentLogout = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("studentLogout", async (token, thunkAPI) => {
  try {
    const response = await studentLogoutService(token);
    console.log("res.head==>", response.headers);
    const newAccessToken = response.headers["authorization"]
      ? response.headers["authorization"].split(" ")[1]
      : null;

    if (newAccessToken) {
      console.log("New Access Token found in studentLogout:", newAccessToken);

      thunkAPI.dispatch(setAccessToken(newAccessToken));
    }
    console.log("in StudentLogout===>", response);
    return response.data;
  } catch (error: any) {
    return handleThunkError(error, thunkAPI);
  }
});

export const studentFetchCourses = createAsyncThunk<
  any,
  {
    token: string;
    limit: number;
    offset: number;
    searchTerm: string;
    categories: string[];
    sort: string;
  },
  { rejectValue: string }
>(
  "studentfetchCourses",
  async ({ token, limit, offset, searchTerm, categories, sort }, thunkAPI) => {
    try {
      const response = await studentFetchCoursesService(
        token,
        limit,
        offset,
        searchTerm,
        categories,
        sort
      );
      console.log("Fetched courses:", response);
      return response;
    } catch (error: any) {
      return handleThunkError(error, thunkAPI);
    }
  }
);

export const studentCreatePayment = createAsyncThunk<
  any,
  { token: string; courseId: string; studentId: string },
  { rejectValue: string }
>("studentCreatePayment", async ({ token, courseId, studentId }, thunkAPI) => {
  try {
    const response = await studentCreatePaymentService(
      token,
      courseId,
      studentId
    );
    console.log("Create Payment:", response);
    return response;
  } catch (error: any) {
    return handleThunkError(error, thunkAPI);
  }
});

export const studentGetEnrolledCourses = createAsyncThunk(
  "studentGetEnrolledCourses",
  async (
    { token, studentId }: { token: string; studentId: string },
    thunkAPI
  ) => {
    try {
      console.log("studentId received in action:", studentId); // Should log the studentId correctly
      const response = await studentGetEnrolledCoursesService(token, studentId);
      console.log("Fetched enrolled courses:", response);
      return response.data;
    } catch (error: any) {
      // Handle any errors
      return handleThunkError(error, thunkAPI);
    }
  }
);

export const studentGetTutorInfo = createAsyncThunk(
  "studentGetTutorInfo",
  async ({ token, tutorId }: { token: string; tutorId: string }, thunkAPI) => {
    try {
      console.log("tutorId received in action:", tutorId); // Should log the studentId correctly
      const response = await studentGetTutorInfoService(token, tutorId);
      console.log("Fetched tutor info :", response);
      return response.data;
    } catch (error: any) {
      // Handle any errors
      return handleThunkError(error, thunkAPI);
    }
  }
);

export const getUsersWithExistingChat = createAsyncThunk(
  "getUsersWithExistingChat",
  async ({ token, userId, userType }: { token: string; userId: string, userType: string }, thunkAPI) => {
    try {
      console.log("existing chat received in action:", userId);
      const response = await getUsersWithExistingChatService(token, userId, userType);
      console.log("Fetched existing chat i=userws info :", response);
      return response.data;
    } catch (error: any) {
      // Handle any errors
      return handleThunkError(error, thunkAPI);
    }
  }
);