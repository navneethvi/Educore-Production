// TutorRoutes.tsx
import { Routes, Route } from "react-router-dom";
import TutorProtected from "./TutorProtected";
import TutorSignIn from "../components/tutor/TutorSignIn";
import TutorSignUp from "../components/tutor/TutorSignUp";
import VerifyEmail from "../components/tutor/VerifyEmail";
import ForgotPass from "../components/tutor/ForgotPass";
import ResetPass from "../components/tutor/ResetPass";

import Layout from "../components/common/DashCommon/TutorLayout";
import Dashboard from "../components/common/contents/tutor/Dashboard";
import Courses from "../components/common/contents/tutor/Courses";
import Students from "../components/common/contents/tutor/Students";
import Messages from "../components/common/contents/tutor/Messages";
import Webinars from "../components/common/contents/tutor/Webinars";
import AddCourses from "../components/common/contents/tutor/AddCourses";
import Profile from "../components/common/contents/tutor/Profile";
import EditCourse from "../components/common/contents/tutor/EditCourse";

const TutorRoutes = () => {
  return (
    <Routes>
      <Route path="/signin" element={<TutorSignIn />} />
      <Route path="/verify-otp" element={<VerifyEmail />} />
      <Route path="/signup" element={<TutorSignUp />} />
      <Route path="/recover-account" element={<ForgotPass />} />
      <Route path="/reset-pass" element={<ResetPass />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <TutorProtected>
            <Layout />
          </TutorProtected>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="students" element={<Students />} />
        <Route path="messages" element={<Messages />} />
        <Route path="webinar" element={<Webinars />} />
        <Route path="add-course" element={<AddCourses />} />
        <Route path="profile" element={<Profile />} />
        <Route path="/edit-course/:courseId" element={<EditCourse />} />

      </Route>
    </Routes>
  );
};

export default TutorRoutes;
