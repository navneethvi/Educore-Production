export interface SigninData {
  email: string;
  password: string;
}

export interface AdminData {
  _id: string;
  email: string;
  name: string;
  password: string;
  __v: number;
  token: string;
}

export interface AdminResponse {
  message: string;
  adminData: AdminData;
}

export interface StudentSignupData {
  name: string;
  email: string;
  phone: number;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface StudentVerifyOtp {
  email: string;
  otp: string;
}

export interface StudentResendOtp {
  email: string;
}

export interface ApiResponse<T> {
  headers: any;
  success: boolean;
  message: string;
  data: T;
}

export type SetStudentInterestsPayload = {
  interests: string[];
  email: string;
};

export interface StudentResetPassData {
  email: string;
  otp: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface TutorSignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface TutorVerifyOtp {
  email: string;
  otp: string;
}

export interface TutorResetPassData {
  email: string;
  otp: string;
  newPassword: string;
  confirmNewPassword: string;
}


export interface Lesson {
  title: string;
  goal: string;
  video?: string;
  materials?: string;
  homework?: string;
}

export interface CourseData {
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;

  lessons: Lesson[];
}

interface TutorData {
  bio: string;
  email: string;
  followers: string[]; 
  image: string;
  is_blocked: boolean;
  is_verified: boolean;
  name: string;
  password: string; 
  phone: string;
  __v: number; 
  _id: string; 
}


export interface CourseForCard {
  _id: string;
  title: string;
  category: string;
  price: number;
  tutor_data?: TutorData[];
  thumbnail: string;
  enrollments: number;
  lessoncount: number;
}


export interface Category {
  _id: string;
  name: string;
  courses?: string[];
}

export interface CategoriesResponse {
  categories: Category[];
  totalPages: number;
  currentPage: number;
}

