import instance from "../../utils/axios";
import axios from "axios";

import { BASE_URL } from "../../utils/configs";

import {
  StudentSignupData,
  SigninData,
  ApiResponse,
  StudentVerifyOtp,
  StudentResendOtp,
  SetStudentInterestsPayload,
  StudentResetPassData,
} from "../../types/types";
import { TokenResponse } from "@react-oauth/google";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const studentSignupService = async (
  data: StudentSignupData
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post<ApiResponse<any>>(
      `${BASE_URL}/auth/signup`,
      data
    );
    console.log("response in servcixe : ", response);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const studentVerifyEmailService = async (
  data: StudentVerifyOtp
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post<ApiResponse<any>>(
      `${BASE_URL}/auth/verify-otp`,
      data
    );
    console.log("response in servcixe : ", response);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const studentResendOtpService = async (
  data: StudentResendOtp
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post<ApiResponse<any>>(
      `${BASE_URL}/auth/resend-otp`,
      data
    );
    console.log("response in servcixe : ", response);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const setStudentInterestsService = async (
  data: SetStudentInterestsPayload
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post<ApiResponse<any>>(
      `${BASE_URL}/auth/set-interests`,
      data
    );
    console.log("response in servce : ", response.data);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const forgotStudentPassService = async (data: {
  email: string;
}): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post<ApiResponse<any>>(
      `${BASE_URL}/auth/recover-account`,
      data
    );
    console.log("response in servce : ", response.data);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const verifyStudentAccountService = async (data: {
  email: string;
  otp: string;
}): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post<ApiResponse<any>>(
      `${BASE_URL}/auth/verify-account`,
      data
    );
    console.log("response in servce : ", response.data);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const studentSigninService = async (
  data: SigninData
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post<ApiResponse<any>>(
      `${BASE_URL}/auth/signin`,
      data
    );
    console.log("response in servce : ", response.data);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const studentGoogleSigninService = async (data: { token: string }) => {
  try {
    const response = await instance.post<{ message: string }>(
      `${BASE_URL}/auth/google`,
      data
    );
    console.log("response in service : ", response.data);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const studentResetPassService = async (
  data: StudentResetPassData
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post<ApiResponse<any>>(
      `${BASE_URL}/auth/update-password`,
      data
    );
    console.log("response in servce : ", response.data);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const studentLogoutService = async (token: string): Promise<any> => {
  try {
    const response = await instance.post(
      `${BASE_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response in servce : ", response);
    return response;
  } catch (error: any) {
    throw error.response.data;
  }
};

const studentFetchCoursesService = async (
  token: string,
  limit: number,
  offset: number,
  searchTerm: string,
  categories: string[],
  sort: string
) => {
  try {
    const response = await axios.get(`${BASE_URL}/course/fetch_courses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: limit,
        offset: offset,
        searchTerm: searchTerm,
        categories: categories,
        sort: sort,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};

const studentCreatePaymentService = async (
  token: string,
  courseId: string,
  studentId: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/payment/create-payment-intent`,
      {
        courseId,
        studentId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};

const studentGetEnrolledCoursesService = async (
  token: string,
  studentId: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/payment/get-enrolled-courses`,
      { studentId }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response);
    
    return response;
  } catch (error: any) {
    throw error.response;
  }
};

const studentGetTutorInfoService = async (
  token: string,
  tutorId: string
) => {
  try {
    console.log("tutorId in services===>", tutorId);
    
    const response = await axios.post(
      `${BASE_URL}/auth/tutor/fetch-tutor`,
      { tutorId }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response);
    
    return response;
  } catch (error: any) {
    throw error.response;
  }
};

const getUsersWithExistingChatService = async (
  token: string,
  userId: string,
  userType: string
) => {
  try {
    console.log("userId in services===>", userId);
    
    const response = await axios.post(
      `${BASE_URL}/chat/fetch-chats`,
      { userId, userType }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response);
    
    return response;
  } catch (error: any) {
    throw error.response;
  }
};


export {
  studentSignupService,
  studentVerifyEmailService,
  studentResendOtpService,
  setStudentInterestsService,
  forgotStudentPassService,
  verifyStudentAccountService,
  studentSigninService,
  studentGoogleSigninService,
  studentResetPassService,
  studentLogoutService,
  studentFetchCoursesService,
  studentCreatePaymentService,
  studentGetEnrolledCoursesService,
  studentGetTutorInfoService,
  getUsersWithExistingChatService
};
