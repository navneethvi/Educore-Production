import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  addCategory,
  adminSignin,
  deleteCategory,
  fetchCategories,
  fetchStudents,
  fetchTutors,
  getAllCourses,
  getCourseDetails,
  toggleBlockStudent,
  toggleBlockTutor,
  adminLogout
} from "./adminActions";
import { ApiResponse } from "../../types/types";
import { number } from "yup";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  activity: string;
  following: [];
  is_blocked: boolean;
}

interface Tutor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  followers: [];
  is_verified: boolean;
  is_blocked: boolean;
}

interface Category {
  _id: string;
  name: string;
  course: any[];
}

interface Lesson {
  title: string;
  goal: string;
  video: string;
  materials: string;
  homework: string;
}

interface Course {
  tutor_data: any;
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  enrollments: number;
  thumbnail: string;
  is_approved: boolean;
  lessons: Array<Lesson>;
  tutor_id: string;
  __v: number;
}

interface PaginatedData<T> {
  data: T[];
  totalPages: number;
  loading: boolean;
  error: string;
}

interface AdminState {
  adminData: any | null;
  adminToken: string | null;
  success: boolean;
  error: string;
  loading: boolean;
  message: string;
  students: PaginatedData<Student>;
  tutors: PaginatedData<Tutor>;
  categories: PaginatedData<Category>;
  approvedCourses: PaginatedData<Course>;
  pendingCourses: PaginatedData<Course>;
  totalPagesApproved: number;
  totalPagesPending: number;
  currentPageApproved: number;
  currentPagePending: number;
}

const initialState: AdminState = {
  adminData: null,
  adminToken: null,
  success: false,
  error: "",
  loading: false,
  message: "",
  students: {
    data: [],
    totalPages: 1,
    loading: false,
    error: "",
  },
  tutors: {
    data: [],
    totalPages: 1,
    loading: false,
    error: "",
  },
  categories: {
    data: [],
    totalPages: 1,
    loading: false,
    error: "",
  },
  approvedCourses: {
    data: [],
    totalPages: 1,
    loading: false,
    error: "",
  },
  totalPagesApproved: 1,
  pendingCourses: {
    data: [],
    totalPages: 1,
    loading: false,
    error: "",
  },
  totalPagesPending: 1,
  currentPageApproved: 1,
  currentPagePending: 1,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.adminToken = action.payload;
    },
    resetActions: (state) => {
      state.success = false;
      state.error = "";
      state.loading = false;
      state.message = "";
    },
    // adminLogout: (state: AdminState) => {
    //   return {
    //     ...initialState,
    //   };
    // },
    setAdminData: (
      state,
      action: PayloadAction<{ data: any; token: string }>
    ) => {
      (state.adminData = action.payload?.data),
        (state.adminToken = action.payload?.token);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminSignin.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        adminSignin.fulfilled,
        (state, action: PayloadAction<{ adminData: any }>) => {
          console.log("payload=======>", action.payload);

          state.loading = false;
          state.success = true;
          state.adminData = action.payload.adminData;
          state.adminToken = action.payload.adminData.accessToken;
        }
      )
      .addCase(adminSignin.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(fetchStudents.pending, (state) => {
        state.students.loading = true;
        state.students.error = "";
      })
      .addCase(fetchStudents.fulfilled, (state, action: any) => {
        state.students.loading = false;
        state.students.data = action.payload.students;
        state.students.totalPages = action.payload.totalPages;
      })
      .addCase(fetchStudents.rejected, (state, action: PayloadAction<any>) => {
        state.students.loading = false;
        state.students.error = action.payload || "Failed to fetch students";
      })

      .addCase(fetchTutors.pending, (state) => {
        state.tutors.loading = true;
        state.tutors.error = "";
      })
      .addCase(fetchTutors.fulfilled, (state, action: any) => {
        state.tutors.loading = false;
        state.tutors.data = action.payload.tutors;
        state.tutors.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTutors.rejected, (state, action: PayloadAction<any>) => {
        state.tutors.loading = false;
        state.tutors.error = action.payload || "Failed to fetch students";
      })

      .addCase(fetchCategories.pending, (state) => {
        state.categories.loading = true;
        state.categories.error = "";
      })
      .addCase(fetchCategories.fulfilled, (state, action: any) => {
        state.categories.loading = false;
        state.categories.data = action.payload.categories;
        state.categories.totalPages = action.payload.totalPages;
      })
      .addCase(
        fetchCategories.rejected,
        (state, action: PayloadAction<any>) => {
          state.categories.loading = false;
          state.categories.error = action.payload || "Failed to fetch students";
        }
      )

      .addCase(addCategory.pending, (state) => {
        state.categories.loading = true;
        state.categories.error = "";
      })
      .addCase(addCategory.fulfilled, (state, action: any) => {
        state.categories.loading = false;
        state.categories.data.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action: PayloadAction<any>) => {
        state.categories.loading = false;
        state.categories.error = action.payload || "Failed to fetch students";
      })

      .addCase(deleteCategory.pending, (state) => {
        state.categories.loading = true;
        state.categories.error = "";
      })
      .addCase(deleteCategory.fulfilled, (state, action: any) => {
        state.categories.loading = false;
        state.categories.data = state.categories.data.filter(
          (category) => category._id !== action.payload.category_id
        );
      })
      .addCase(deleteCategory.rejected, (state, action: PayloadAction<any>) => {
        state.categories.loading = false;
        state.categories.error = action.payload || "Failed to Delete Category";
      })

      .addCase(toggleBlockTutor.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(toggleBlockTutor.fulfilled, (state, action: any) => {
        console.log("payloaaaad=======>", action.payload);

        state.loading = false;
        const updatedTutor = action.payload;

        state.tutors.data = state.tutors.data.map((tutor) =>
          tutor._id === updatedTutor._id ? updatedTutor : tutor
        );
      })
      .addCase(
        toggleBlockTutor.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Failed to Delete Category";
        }
      )

      .addCase(toggleBlockStudent.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(toggleBlockStudent.fulfilled, (state, action: any) => {
        state.loading = false;
        const updatedStudent = action.payload;

        state.tutors.data = state.tutors.data.map((student) =>
          student._id === updatedStudent._id ? updatedStudent : student
        );
      })
      .addCase(
        toggleBlockStudent.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Failed to Block Student";
        }
      )

      .addCase(getAllCourses.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getAllCourses.fulfilled, (state, action: any) => {
        state.loading = false;
        state.success = true;
        console.log("payloaad", action.payload[0]?.is_approved);

        if (action.payload[0]?.is_approved) {
          state.approvedCourses.data = action.payload;
        } else {
          state.pendingCourses.data = action.payload;
        }
      })
      .addCase(getAllCourses.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Failed to Fetch Courses";
      })

      .addCase(getCourseDetails.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getCourseDetails.fulfilled, (state, action: any) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(
        getCourseDetails.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Failed to Fetch Course Details";
        }
      )
      .addCase(adminLogout.fulfilled, (state) => {
        // Reset state on logout
        return {
          ...initialState,
        };
      })
  },
});

export const { resetActions, setAdminData, setAccessToken } =
  adminSlice.actions;

export default adminSlice.reducer;
