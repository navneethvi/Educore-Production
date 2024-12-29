import axios from "axios";

import { BASE_URL } from "../../utils/configs";

import {
  ApiResponse,
  CategoriesResponse,
  Category,
  Lesson,
  SigninData,
} from "../../types/types";
import instance from "../../utils/axios";

const adminSigninService = async (data: SigninData) => {
  try {
    console.log("helloooo");
    
    const response = await instance.post(`${BASE_URL}/auth/admin/signin`, data);
    console.log("response in servcixe : ", response);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const adminLogoutService = async (token: string) => {
  try {
    console.log("token-==========>",token);

    const response = await instance.post(
      `${BASE_URL}/auth/admin/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("response in adminLogout service====?", response);
    
    return response;
  } catch (error: any) {
    throw error.response.data;
  }
};

const getStudentsDataService = async (
  token: string,
  page: number,
  searchTerm: string
): Promise<any> => {
  try {
    console.log("page in service ==>", page);

    const response = await instance.get(
      `${BASE_URL}/auth/admin/get_students?page=${page}&searchTerm=${searchTerm}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response in service: ", response.data);
    return response;
  } catch (error: any) {
    throw error.response.data;
  }
};

const getTutorsDataService = async (
  token: string,
  page: number,
  searchTerm: string
): Promise<any> => {
  try {
    console.log("page in service ==>", page);

    const response = await instance.get(
      `${BASE_URL}/auth/admin/get_tutors?page=${page}&searchTerm=${searchTerm}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response in service: ", response);
    return response;
  } catch (error: any) {
    throw error.response.data;
  }
};

// Update the return type to match the expected response for adding a category
const addCategoryService = async (
  token: string,
  categoryName: string
): Promise<any> => {
  try {
    const response = await instance.post(
      `${BASE_URL}/course/add_category`,
      { name: categoryName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response in service:", response.data);
    return response;
  } catch (error: any) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

const getCategoriesDataService = async (
  token: string,
  page: number
): Promise<CategoriesResponse> => {
  try {
    console.log("Page in service ==>", page);
    const response = await axios.get(
      `${BASE_URL}/course/get_categories?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response in service:", response.data);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const deleteCategoryService = async (
  token: string,
  category_id: string
): Promise<any> => {
  try {
    const response = await instance.post(
      `${BASE_URL}/course/delete_category`,
      { _id: category_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response in service: ", response.data);
    return response;
  } catch (error: any) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

const toggleBlockTutorService = async (
  token: string,
  tutorId: string
): Promise<any> => {
  try {
    const response = await instance.patch(
      `${BASE_URL}/auth/tutor/${tutorId}/block`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response in service: ", response.data);
    return response;
  } catch (error: any) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

const toggleBlockStudentService = async (
  token: string,
  studentId: string
): Promise<any> => {
  try {
    const response = await instance.patch(`${BASE_URL}/auth/${studentId}/block`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response in service: ", response.data);
    return response;
  } catch (error: any) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

const getALlCoursesService = async (
  token: string,
  status: boolean
): Promise<any> => {
  try {
    console.log("status in getallcourse service===>", status);

    const response = await instance.get(
      `${BASE_URL}/course/get_courses/${status}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response in service: ", response.data);
    return response;
  } catch (error: any) {
    throw error.response?.data || { message: "An error occurred" };
  }
};


const getCourseDetailsService = async (
  token: string,
  id: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/course/course_details/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response in service: ", response.data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

const adminApproveCourseService = async (
  token: string,
  id: string
): Promise<any> => {
  try {
    console.log("hitted service");

    const response = await axios.patch(
      `${BASE_URL}/course/approve_course/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response in service: ", response.data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

const adminFetchLessonDetailsService = async (
  token: string,
  courseId: string,
  lessonIndex: number
): Promise<Lesson> => {
  try {
    console.log("Fetching lesson details...");
    const response = await axios.post(
      `${BASE_URL}/course/${courseId}/lesson_details`,
      {
        lessonIndex: lessonIndex,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Response: ", response);

    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

const fetchCategoriesService = async (): Promise<Category[]> => {
  try {
    console.log("Fetching all categories....");
    const response = await axios.get(`${BASE_URL}/course/get_allcategories`);

    console.log("response in service : ", response);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Error Fetching Categories!!!" };
  }
};

export {
  adminSigninService,
  adminLogoutService,
  getStudentsDataService,
  getTutorsDataService,
  getCategoriesDataService,
  addCategoryService,
  deleteCategoryService,
  toggleBlockTutorService,
  toggleBlockStudentService,
  getALlCoursesService,
  getCourseDetailsService,
  adminApproveCourseService,
  adminFetchLessonDetailsService,
  fetchCategoriesService,
};
