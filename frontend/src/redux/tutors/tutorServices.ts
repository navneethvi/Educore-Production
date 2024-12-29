// import axios from "../../utils/axios";
import axios from "axios";

import { BASE_URL } from "../../utils/configs";

import {
  ApiResponse,
  TutorSignupData,
  TutorVerifyOtp,
  SigninData,
  TutorResetPassData,
} from "../../types/types";
import instance from "../../utils/axios";
import { setAccessToken } from "./tutorSlice";

const tutorSignupService = async (
  data: TutorSignupData
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post<ApiResponse<any>>(
      `${BASE_URL}/auth/tutor/signup`,
      data
    );
    console.log("response in service : ", response);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const tutorVerifyEmailService = async (data: TutorVerifyOtp) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/tutor/verify-otp`,
      data
    );
    console.log("response in service : ", response);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const tutorResendOtpService = async (data: {
  email: string;
}): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/tutor/resend-otp`,
      data
    );
    console.log("response in service : ", response);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const tutorSigninService = async (
  data: SigninData
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/tutor/signin`, data);
    console.log("response in service : ", response);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const forgotTutorPassService = async (data: {
  email: string;
}): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/tutor/recover-account`,
      data
    );
    console.log("response in service : ", response);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const verifyTutorAccountService = async (data: {
  email: string;
  otp: string;
}): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/tutor/verify-account`,
      data
    );
    console.log("response in service : ", response);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const tutorGoogleSigninService = async (data: { token: string }) => {
  try {
    const response = await instance.post<{ message: string }>(
      `${BASE_URL}/auth/tutor/google`,
      data
    );
    console.log("response in service : ", response.data);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const tutorResetPassService = async (
  data: TutorResetPassData
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/tutor/update-password`,
      data
    );
    console.log("response in service : ", response);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const tutorLogoutService = async (token: string) => {
  try {
    console.log(token);

    const response = await instance.post(
      `${BASE_URL}/auth/tutor/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    throw error.response.data;
  }
};

const tutorCreateCourseService = async (token: string, courseData: any) => {
  try {
    console.log(token);
    console.log("in service ====>", courseData);

    const response = await axios.post(
      `${BASE_URL}/course/add_course`,
      courseData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response);

    return response;
  } catch (error: any) {
    throw error.response;
  }
};

const tutorFetchCoursesService = async (
  token: string,
  tutorId: string,
  status: boolean
) => {
  try {
    console.log("hereeeeeeeeeeeeeeeeeeee");

    const response = await instance.get(
      `/course/${tutorId}/courses/${status}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("rrrrrrrrrrrrrrrrrrrrrrrr", response);

    return response;
  } catch (error: any) {
    throw error.response;
  }
};

const tutorDeleteCourseService = async (token: string, courseId: string) => {
  try {
    console.log("courseId : ", courseId);

    const response = await axios.delete(
      `${BASE_URL}/course/delete_course/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Response:", response);

    if (response.status >= 200 && response.status < 300) {
      return courseId;
    } else {
      throw new Error("Failed to delete course");
    }
  } catch (error: any) {
    throw error.response?.data?.message || "An error occurred";
  }
};

const tutorFetchCourseDetailsService = async (
  token: string,
  courseId: string
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/course/course_details/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    throw error.response;
  }
};

const tutorEditCourseService = async (
  token: string,
  courseId: string,
  courseData: any
) => {
  try {
    console.log("Sending FormData:", courseData);

    const response = await axios.patch(
      `${BASE_URL}/course/edit_course/${courseId}`,
      courseData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Response:", response);

    return response;
  } catch (error: any) {
    throw error.response?.data?.message || "An error occurred";
  }
};

export {
  tutorSignupService,
  tutorVerifyEmailService,
  tutorResendOtpService,
  tutorSigninService,
  forgotTutorPassService,
  verifyTutorAccountService,
  tutorResetPassService,
  tutorGoogleSigninService,
  tutorLogoutService,
  tutorCreateCourseService,
  tutorFetchCoursesService,
  tutorDeleteCourseService,
  tutorFetchCourseDetailsService,
  tutorEditCourseService,
};
