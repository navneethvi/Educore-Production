import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

import {
  tutorSignup,
  tutorVerifyEmail,
  tutorResendOtp,
  tutorSignin,
  forgotTutorPass,
  verifyTutorAccount,
  tutorResetPass,
  tutorGoogleSignin,
  tutorLogout,
  tutorCreateCourse,
  tutorFetchCourses,
  tutorDeleteCourse,
  tutorEditCourse,
} from "./tutorActions";

interface TutorData {
  _id: string;
  name: string;
  image: string;
  token: string;
  email: string;
  phone: string;
  followers: string;
  bio: string;
}

interface PaginatedData<T> {
  [x: string]: any;
  data: T[];
  totalPages: number;
  loading: boolean;
  error: string;
}

interface Lesson {
  title: string;
  goal: string;
  video: string;
  materials: string;
  homework: string;
}

interface Course {
  lessoncount: number;
  lessonscount: number;
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

interface TutorState {
  tutorData: TutorData | null;
  tutorToken: string | null;
  success: boolean;
  error: string;
  loading: boolean;
  message: string;
  otpResendSuccess: boolean;
  otpResendError: string;
  otpResendLoading: boolean;
  otpVerifySuccess: boolean;
  otpVerifyLoading: boolean;
  otpVerifyError: string;
  approvedCourses: PaginatedData<Course>;
  pendingCourses: PaginatedData<Course>;
  totalPagesApproved: number;
  totalPagesPending: number;
  currentPageApproved: number;
  currentPagePending: number;
}

const initialState: TutorState = {
  tutorData: null,
  tutorToken: null,
  success: false,
  error: "",
  loading: false,
  message: "",
  otpResendSuccess: false,
  otpResendError: "",
  otpResendLoading: false,
  otpVerifySuccess: false,
  otpVerifyLoading: false,
  otpVerifyError: "",
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

// Your slice definition here

const tutorSlice = createSlice({
  name: "tutor",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.tutorToken = action.payload;
    },
    resetActions: (state) => {
      state.success = false;
      state.error = "";
      state.loading = false;
      state.message = "";
      state.otpResendSuccess = false;
      state.otpResendError = "";
      state.otpResendLoading = false;
      state.otpVerifySuccess = false;
      state.otpVerifyLoading = false;
      state.otpVerifyError = "";
      state.approvedCourses = {
        data: [],
        totalPages: 1,
        loading: false,
        error: "",
      };
      state.pendingCourses = {
        data: [],
        totalPages: 1,
        loading: false,
        error: "",
      };
      state.totalPagesApproved = 1;
      state.totalPagesPending = 1;
      state.currentPageApproved = 1;
      state.currentPagePending = 1;
    },
    tutorLogoutLocal: (state) => {
      state.tutorData = null;
      state.tutorToken = null;
      state.success = false;
      state.error = "";
      state.loading = false;
      state.message = "";
    },
    setTutorData: (
      state,
      action: PayloadAction<{ data: TutorData; token: string }>
    ) => {
      state.tutorData = action.payload.data;
      state.tutorToken = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(tutorSignup.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(tutorSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(tutorSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(tutorResendOtp.pending, (state) => {
        state.otpResendLoading = true;
        state.otpResendError = "";
      })
      .addCase(tutorResendOtp.fulfilled, (state) => {
        state.otpResendLoading = false;
        state.otpResendSuccess = true;
      })
      .addCase(tutorResendOtp.rejected, (state, action) => {
        state.otpResendLoading = false;
        state.otpResendError = action.payload || "Something went wrong";
      })

      .addCase(tutorVerifyEmail.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(tutorVerifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.tutorData = action.payload.tutorData;
        state.tutorToken = action.payload.tutorData.accessToken;
        state.message = "Signup successful";
      })
      .addCase(tutorVerifyEmail.rejected, (state, action) => {
        console.log("payload==========>", action.payload);
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(tutorSignin.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(tutorSignin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.tutorData = action.payload.tutorData;
        state.tutorToken = action.payload.tutorData.accessToken;
        state.message = "Signin successful";
      })
      .addCase(tutorSignin.rejected, (state, action) => {
        console.log("payload==========>", action.payload);
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(tutorGoogleSignin.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(tutorGoogleSignin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.tutorData = action.payload.tutorData;
        state.tutorToken = action.payload.tutorData.accessToken;
        state.message = "Signin successful";
      })
      .addCase(tutorGoogleSignin.rejected, (state, action) => {
        console.log("payload==========>", action.payload);
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(forgotTutorPass.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(forgotTutorPass.fulfilled, (state, action) => {
        console.log("paylooooooooad =========>", action.payload);
        state.loading = false;
        state.success = true;
      })
      .addCase(forgotTutorPass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(verifyTutorAccount.pending, (state) => {
        state.otpVerifyLoading = true;
        state.otpVerifyError = "";
      })
      .addCase(verifyTutorAccount.fulfilled, (state, action) => {
        console.log("paylooooooooad =========>", action.payload);
        state.otpVerifyLoading = false;
        state.otpVerifySuccess = true;
      })
      .addCase(verifyTutorAccount.rejected, (state, action) => {
        state.otpVerifyLoading = false;
        state.otpVerifyError = action.payload || "Something went wrong";
      })

      .addCase(tutorResetPass.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(tutorResetPass.fulfilled, (state, action) => {
        console.log("paylooooooooad =========>", action.payload);
        state.loading = false;
        state.success = true;
      })
      .addCase(tutorResetPass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(tutorLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(tutorLogout.fulfilled, (state) => {
        Object.assign(state, {
          tutorData: null,
          tutorToken: null,
          success: false,
          error: "",
          loading: false,
          message: "",
          otpResendSuccess: false,
          otpResendError: "",
          otpResendLoading: false,
          otpVerifySuccess: false,
          otpVerifyLoading: false,
          otpVerifyError: "",
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
        });
      })

      .addCase(tutorLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      })

      .addCase(tutorCreateCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(tutorCreateCourse.fulfilled, (state) => {
        state.success = true;
        state.loading = false;
      })
      .addCase(tutorCreateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Course creation failed";
        Swal.fire({
          title: "Error!",
          text: state.error,
          icon: "error",
          confirmButtonText: "OK",
        });
      })

      .addCase(tutorFetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(tutorFetchCourses.fulfilled, (state, action) => {
        const { data, totalPages } = action.payload; // Extract only the serializable data you need
        console.log("payloaaaaaaad===>", action.payload);

        if (action.meta.arg.status === true) {
          state.approvedCourses.data = data;
          state.totalPagesApproved = totalPages;
        } else if (action.meta.arg.status === false) {
          state.pendingCourses.data = data;
          state.totalPagesPending = totalPages;
        }
        state.loading = false;
      })

      .addCase(tutorDeleteCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(tutorDeleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        const deletedCourseId = action.payload;

        if (
          state.approvedCourses.data.some(
            (course) => course._id === deletedCourseId
          )
        ) {
          state.approvedCourses.data = state.approvedCourses.data.filter(
            (course) => course._id !== deletedCourseId
          );
        }

        if (
          state.pendingCourses.data.some(
            (course) => course._id === deletedCourseId
          )
        ) {
          state.pendingCourses.data = state.pendingCourses.data.filter(
            (course) => course._id !== deletedCourseId
          );
        }
      })
      .addCase(tutorDeleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Non Approved Course fetch failed";
      })

      .addCase(tutorEditCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(tutorEditCourse.fulfilled, (state, action) => {
        state.loading = false;
        const editedCourse = action.payload.data.updatedCourse;

        console.log("payloaaaaaaaad", editedCourse);

        const updatedFields = {
          _id: editedCourse._id,
          title: editedCourse.title,
          category: editedCourse.category,
          thumbnail: editedCourse.thumbnail,
          enrollments: editedCourse.enrollments,
          price: editedCourse.price,
          lessoncount: editedCourse.lessoncount,
        };

        const approvedIndex = state.approvedCourses.data.findIndex(
          (course) => course._id === editedCourse._id
        );
        if (approvedIndex !== -1) {
          state.approvedCourses.data[approvedIndex] = {
            ...state.approvedCourses.data[approvedIndex],
            ...updatedFields,
          };
        }

        // Find and update course in pendingCourses if it exists
        const pendingIndex = state.pendingCourses.data.findIndex(
          (course) => course._id === editedCourse._id
        );
        if (pendingIndex !== -1) {
          state.pendingCourses.data[pendingIndex] = {
            ...state.pendingCourses.data[pendingIndex],
            ...updatedFields,
          };
        }
      })
      .addCase(tutorEditCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Non Approved Course fetch failed";
      });
  },
});

export const { resetActions, tutorLogoutLocal, setTutorData, setAccessToken } =
  tutorSlice.actions;

export default tutorSlice.reducer;
