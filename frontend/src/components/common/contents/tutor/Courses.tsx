import React, { useState, useEffect } from "react";
import CourseCard from "../../CourseCard";
import {
  tutorFetchCourses,
  tutorDeleteCourse,
} from "../../../../redux/tutors/tutorActions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../../../utils/configs";

const Courses: React.FC = () => {
  const [showApproved, setShowApproved] = useState(true);
  const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({});
  const [fetchCompleted, setFetchCompleted] = useState(false); // New state to track fetch completion
  const dispatch: AppDispatch = useDispatch();
  const {
    tutorData,
    tutorToken,
    loading,
    approvedCourses = { data: [] },
    pendingCourses = { data: [] },
    totalPagesApproved,
    totalPagesPending,
    currentPageApproved,
    currentPagePending,
  } = useSelector((state: RootState) => state.tutor);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const token = tutorToken as string;
      const tutorId = tutorData?._id as string;

      if (showApproved && approvedCourses.data.length === 0 && !loading && !fetchCompleted) {
        await dispatch(tutorFetchCourses({ token, tutorId, status: true }));
        setFetchCompleted(true); // Set fetch as completed to avoid multiple calls
      } else if (!showApproved && pendingCourses.data.length === 0 && !loading && !fetchCompleted) {
        await dispatch(tutorFetchCourses({ token, tutorId, status: false }));
        setFetchCompleted(true);
      }
    };

    if (!loading) {  
      fetchCourses();
    }
  }, [
    dispatch,
    tutorToken,
    tutorData,
    showApproved,
    approvedCourses.data,
    pendingCourses.data,
    loading,
    fetchCompleted, // Add fetchCompleted to dependency array
  ]);

  const fetchThumbnailUrl = async (filename: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/course/get-presigned-url?filename=${filename}`
      );
      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error("Error fetching thumbnail URL:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadThumbnails = async () => {
      const courseList = showApproved
        ? approvedCourses.data
        : pendingCourses.data;

      const thumbnailUrls = await Promise.all(
        courseList.map(async (course) => {
          if (course.thumbnail) {
            const url = await fetchThumbnailUrl(course.thumbnail);
            return { id: course._id, url };
          }
          return { id: course._id, url: "" };
        })
      );

      const thumbnailMap = thumbnailUrls.reduce((acc, { id, url }) => {
        acc[id] = url;
        return acc;
      }, {} as { [key: string]: string });

      setThumbnails(thumbnailMap);
    };

    loadThumbnails();
  }, [showApproved, approvedCourses.data, pendingCourses.data]);

  const handleCourseClick = (courseId: string) => {
    console.log("Course ID:", courseId);
  };

  const handleEdit = (courseId: string) => {
    navigate(`/tutor/edit-course/${courseId}`);
  };

  const handleDelete = (courseId: string) => {
    const token = tutorToken as string;
    Swal.fire({
      title: "Are you sure you want to delete this course?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#bbb",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(tutorDeleteCourse({ token, courseId }));
          Swal.fire({
            title: "Deleted!",
            text: "The course has been deleted successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "There was an error deleting the course. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  const handlePageChange = (page: number) => {
    if (showApproved) {
      // Update the current page for approved courses
    } else {
      // Update the current page for pending courses
    }
  };

  const courses = showApproved ? approvedCourses.data || [] : pendingCourses.data || [];
  const totalPages = showApproved ? totalPagesApproved : totalPagesPending;
  const currentPage = showApproved ? currentPageApproved : currentPagePending;

  console.log("coursessssssss" , courses);
  

  return (
    <>
      <div className="heading mb-2">
        <h1 className="text-2xl font-semibold">My Courses</h1>
      </div>
      <div className="flex justify-end mb-6 mr-10">
        <button
          onClick={() => {
            setShowApproved(!showApproved);
            setFetchCompleted(false); // Reset fetchCompleted when toggling views
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          {showApproved ? "Show Pending Courses" : "Show Approved Courses"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {loading ? (
          <p className="text-center col-span-4">Loading...</p>
        ) : courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard
              key={course._id}
              title={course.title}
              category={course.category}
              price={course.price}
              originalPrice={course.price}
              tutorName={tutorData?.name as string}
              image={tutorData?.image as string}
              thumbnail={thumbnails[course._id] || course.thumbnail}
              lessonsCount={course.lessoncount}
              duration="2h 12m"
              enrollments={course.enrollments || 0}
              courseId={course._id}
              handleClick={handleCourseClick}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isTutor={true}
            />
          ))
        ) : (
          <p className="text-center col-span-4">No courses found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 mx-1 ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } rounded-md`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default Courses;
