import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminSignIn from "../components/admin/SignIn";
import AdminProtected from "./AdminProtected";
import Layout from "../components/common/DashCommon/AdminLayout";

import Dashboard from "../components/common/contents/admin/Dashboard";
import Courses from "../components/common/contents/admin/Courses";
import Students from "../components/common/contents/admin/Students";
import Tutors from "../components/common/contents/admin/Tutors";
import Category from "../components/common/contents/admin/Category";

import CourseDetails from "../components/common/contents/admin/CourseDetails";
import LessonDetails from "../components/common/contents/admin/LessonDetails";

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/signin" element={<AdminSignIn />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <AdminProtected>
            <Layout />
          </AdminProtected>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="/course/:courseId" element={<CourseDetails />} />{" "}
        <Route path="/lessons/:lessonId" element={<LessonDetails />} />{" "}
        <Route path="students" element={<Students />} />
        <Route path="tutors" element={<Tutors />} />
        <Route path="category" element={<Category />} />
        {/* <Route path="add-course" element={<AddCourses />} />
        <Route path="profile" element={<Profile />} />   */}
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
