import { Route, Routes } from "react-router-dom";

import StudentProtected from "./StudentProtected";

import SignIn from "../components/student/SignIn";
import SignUp from "../components/student/SignUp";
import ForgotPass from "../components/student/ForgotPass";
import ResetPass from "../components/student/ResetPass";
import VerifyEmail from "../components/student/VerifyEmail";
import SelectInterests from "../components/student/SelectInterests";

import Layout from "../components/common/DashCommon/StudentLayout";

import Dashboard from "../components/common/contents/student/Dashboard";
import Courses from "../components/common/contents/student/Courses";
import Messages from "../components/common/contents/student/Messages";
import Webinars from "../components/common/contents/student/Webinar";
import Store from "../components/common/contents/student/Store";
import CourseDetails from "../components/common/contents/student/CourseDetails";
import { PaymentSuccess } from "../components/common/contents/student/PaymentSuccess";
import PaymentFailed from "../components/common/contents/student/PaymentFailed";
import EnrolledCourseDetails from "../components/common/contents/student/EnrolledCourseDetails";
import EnrolledLessonDetails from "../components/common/contents/student/EnrolledLessonDetails";

const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/recover-account" element={<ForgotPass />} />
      <Route path="/reset-pass" element={<ResetPass />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/select-interests" element={<SelectInterests />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-failed" element={<PaymentFailed />} />

      <Route
        path="/"
        element={
          <StudentProtected>
            <Layout />
          </StudentProtected>
        }
      >
        <Route path="details/:courseId" element={<CourseDetails />} />
        <Route path="courses/:courseId" element={<EnrolledCourseDetails />} />
        <Route path="lessons/:lessonId" element={<EnrolledLessonDetails />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="messages" element={<Messages />} />
        <Route path="webinar" element={<Webinars />} />
        <Route path="store" element={<Store />} />
      </Route>
    </Routes>
  );
};

export default StudentRoutes;
