import { createAsyncThunk, createAction } from "@reduxjs/toolkit";

import {
  addCategoryService,
  adminSigninService,
  deleteCategoryService,
  getCategoriesDataService,
  getStudentsDataService,
  getTutorsDataService,
  toggleBlockStudentService,
  toggleBlockTutorService,
  getALlCoursesService,
  getCourseDetailsService,
  adminApproveCourseService,
  adminLogoutService,
  adminFetchLessonDetailsService,
  fetchCategoriesService,
} from "./adminServices";

import {
  SigninData,
  AdminResponse,
  ApiResponse,
  CategoriesResponse,
  Lesson,
} from "../../types/types";
import axios from "axios";

import { Category } from "../../types/types";
import { setAccessToken } from "./adminSlice";

export const adminSignin = createAsyncThunk<
  AdminResponse,
  SigninData,
  {
    rejectValue: string;
  }
>("adminSignin", async (data, thunkAPI) => {
  try {
    const response = await adminSigninService(data);
    console.log("in AdminSignin===>", response);
    return response;
  } catch (error: any) {
    console.log(error);
    return thunkAPI.rejectWithValue(error.message || error.response.data.error);
  }
});

export const adminLogout = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("adminLogout", async (token, thunkAPI) => {
  try {
    const response = await adminLogoutService(token);

    console.log("response in adminLogout===========>", response);

    const newAccessToken = response.headers["authorization"]
      ? response.headers["authorization"].split(" ")[1]
      : null;

    if (newAccessToken) {
      thunkAPI.dispatch(setAccessToken(newAccessToken));
    }
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || error.response.data.error);
  }
});

export const fetchStudents = createAsyncThunk<
  ApiResponse<any>,
  { token: string; page: number; searchTerm: string },
  {
    rejectValue: string;
  }
>("fetchStudents", async ({ token, page, searchTerm }, thunkAPI) => {
  try {
    const response = await getStudentsDataService(token, page, searchTerm);
    const newAccessToken = response.headers["authorization"]
      ? response.headers["authorization"].split(" ")[1]
      : null;

    if (newAccessToken) {
      thunkAPI.dispatch(setAccessToken(newAccessToken));
    }
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || error.response?.data?.error
    );
  }
});

export const fetchTutors = createAsyncThunk<
  ApiResponse<any>,
  { token: string; page: number; searchTerm: string },
  {
    rejectValue: string;
  }
>("fetchTutors", async ({ token, page, searchTerm }, thunkAPI) => {
  try {
    const response = await getTutorsDataService(token, page, searchTerm);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || error.response?.data?.error
    );
  }
});

export const fetchCategories = createAsyncThunk<
  CategoriesResponse, // Update to match CategoriesResponse
  { token: string; page: number },
  { rejectValue: string }
>("fetchCategories", async ({ token, page }, thunkAPI) => {
  try {
    const response = await getCategoriesDataService(token, page);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || error.response?.data?.error
    );
  }
});

export const addCategory = createAsyncThunk<
  Category,
  { token: string; name: string },
  { rejectValue: string }
>("addCategory", async ({ token, name }, thunkAPI) => {
  try {
    const response = await addCategoryService(token, name);
    const newAccessToken = response.headers["authorization"]
      ? response.headers["authorization"].split(" ")[1]
      : null;

    if (newAccessToken) {
      thunkAPI.dispatch(setAccessToken(newAccessToken));
    }
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || error.response?.data?.error || "An error occurred"
    );
  }
});

export const deleteCategory = createAsyncThunk<
  ApiResponse<any>,
  { token: string; category_id: string },
  {
    rejectValue: string;
  }
>("deleteCategory", async ({ token, category_id }, thunkAPI) => {
  try {
    const response = await deleteCategoryService(token, category_id);
    const newAccessToken = response.headers["authorization"]
      ? response.headers["authorization"].split(" ")[1]
      : null;

    if (newAccessToken) {
      thunkAPI.dispatch(setAccessToken(newAccessToken));
    }
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || error.response?.data?.error || "An error occurred"
    );
  }
});

export const toggleBlockTutor = createAsyncThunk<
  ApiResponse<any>,
  { token: string; tutorId: string },
  {
    rejectValue: string;
  }
>("toggleBlockTutor", async ({ token, tutorId }, thunkAPI) => {
  try {
    const response = await toggleBlockTutorService(token, tutorId);
    const newAccessToken = response.headers["authorization"]
      ? response.headers["authorization"].split(" ")[1]
      : null;

    if (newAccessToken) {
      thunkAPI.dispatch(setAccessToken(newAccessToken));
    }
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || error.response?.data?.error || "An error occurred"
    );
  }
});

export const updateTutorStatus = createAction(
  "UPDATE_TUTOR_STATUS",
  (tutorId: string, isBlocked: boolean) => ({ payload: { tutorId, isBlocked } })
);

export const toggleBlockStudent = createAsyncThunk<
  ApiResponse<any>,
  { token: string; studentId: string },
  {
    rejectValue: string;
  }
>("toggleBlockStudent", async ({ token, studentId }, thunkAPI) => {
  try {
    const response = await toggleBlockStudentService(token, studentId);
    const newAccessToken = response.headers["authorization"]
      ? response.headers["authorization"].split(" ")[1]
      : null;

    if (newAccessToken) {
      thunkAPI.dispatch(setAccessToken(newAccessToken));
    }
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || error.response?.data?.error || "An error occurred"
    );
  }
});

export const getAllCourses = createAsyncThunk<
  ApiResponse<any>,
  { token: string; status: boolean },
  {
    rejectValue: string;
  }
>("getAllCourses", async ({ token, status }, thunkAPI) => {
  try {
    console.log("status in getAllcourse ===>", status);
    const response = await getALlCoursesService(token, status);
    const newAccessToken = response.headers["authorization"]
      ? response.headers["authorization"].split(" ")[1]
      : null;

    if (newAccessToken) {
      console.log("New Access Token found in studentLogout:", newAccessToken);

      thunkAPI.dispatch(setAccessToken(newAccessToken));
    }
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || error.response?.data?.error || "An error occurred"
    );
  }
});

export const getCourseDetails = createAsyncThunk<
  ApiResponse<any>,
  { token: string; id: string },
  {
    rejectValue: string;
  }
>("getCourseDetails", async ({ token, id }, thunkAPI) => {
  try {
    const response = await getCourseDetailsService(token, id);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || error.response?.data?.error || "An error occurred"
    );
  }
});

export const adminApproveCourse = createAsyncThunk<
  ApiResponse<any>,
  { token: string; courseId: string },
  {
    rejectValue: string;
  }
>("adminApproveCourse", async ({ token, courseId }, thunkAPI) => {
  try {
    console.log("hitted action");

    const response = await adminApproveCourseService(token, courseId);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message || error.response?.data?.error || "An error occurred"
    );
  }
});

export const adminFetchLessonDetails = createAsyncThunk<
  Promise<any>,
  { token: string; courseId: string; lessonIndex: number }, // Adjust parameters
  {
    rejectValue: string;
  }
>(
  "adminFetchLessonDetails",
  async ({ token, courseId, lessonIndex }, thunkAPI) => {
    try {
      console.log("hereeeeeeeeeeeeeeeeeee");

      const response = await adminFetchLessonDetailsService(
        token,
        courseId,
        lessonIndex
      );
      console.log("res in action", response);

      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || error.response?.data?.error || "An error occurred"
      );
    }
  }
);

export const fetchAllCategories = createAsyncThunk<
  Category[],
  void,
  {
    rejectValue: string;
  }
>("fetchAllCategories", async (_, thunkAPI) => {
  try {
    console.log("Fetching categories...");

    const response = await fetchCategoriesService();

    console.log("Response in action", response);

    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.message ||
        error.response?.data?.error ||
        "An error occurred while fetching categories"
    );
  }
});
