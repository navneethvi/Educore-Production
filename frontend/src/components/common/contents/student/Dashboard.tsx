import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { studentGetEnrolledCourses } from "../../../../redux/students/studentActions";
import { AppDispatch, RootState } from "../../../../store/store";
import CourseCard from "../../CourseCard";
import { BASE_URL } from "../../../../utils/configs";
import { Paper, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import { motion } from "framer-motion";
import { Calendar } from "primereact/calendar";
import "primereact/resources/themes/saga-green/theme.css"; // Optional: Default PrimeReact theme
// import "primereact/resources/primereact.min.css";
// import "primeicons/primeicons.css";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ChatIcon from "@mui/icons-material/Chat";
import StylishChartV2 from "../../../../Charts/ChartThree";

const Dashboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // const [thumbnails, setThumbnails] = useState<Thumbnails>({});
  const [newlyAddedCourses, setNewlyAddedCourse] = useState<any[]>([]);

  const { studentToken, studentData } = useSelector(
    (state: RootState) => state.student
  );

  useEffect(() => {
    if (studentToken && studentData?._id) {
      setLoading(true);
      setError(null);

      dispatch(
        studentGetEnrolledCourses({
          token: studentToken,
          studentId: studentData._id,
        })
      )
        .unwrap()
        .then((fetchedCourses) => {
          setCourses(fetchedCourses);
          setLoading(false);
          fetchThumbnails(fetchedCourses);
        })
        .catch(() => {
          setError("Failed to fetch courses");
          setLoading(false);
        });
    }
  }, [dispatch, studentToken, studentData]);

  const fetchThumbnails = useCallback(async (courses: any) => {
    const updatedCourses = await Promise.all(
      courses.map(async (course: any) => {
        if (course.thumbnail) {
          try {
            const response = await fetch(
              `${BASE_URL}/course/get-presigned-url?filename=${course.thumbnail}`
            );
            const { url } = await response.json();
            return { ...course, thumbnailUrl: url };
          } catch (error) {
            console.error("Error fetching thumbnail URL:", error);
          }
        }
        return course;
      })
    );
    setCourses(updatedCourses);
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${BASE_URL}/course/newly-added-course`);
        if (!response.ok) {
          throw new Error("Failed to fetch newly added course");
        }
        const data = await response.json();

        // Fetch thumbnail URLs for newly added courses
        const updatedNewlyAddedCourses = await Promise.all(
          data.map(async (course: any) => {
            if (course.thumbnail) {
              try {
                const thumbnailResponse = await fetch(
                  `${BASE_URL}/course/get-presigned-url?filename=${course.thumbnail}`
                );
                const { url } = await thumbnailResponse.json();
                return { ...course, thumbnailUrl: url };
              } catch (error) {
                console.error("Error fetching thumbnail URL:", error);
              }
            }
            return course;
          })
        );

        setNewlyAddedCourse(updatedNewlyAddedCourses);
      } catch (error) {
        console.error("Error fetching newly added courses:", error);
      }
    };

    fetchReviews();
  }, []);

  const handleGoToCourse = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div>
      <motion.div
        className="flex h-full bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left side (65%) */}
        <motion.div
          className="w-[70%] pl-6 pr-6 flex flex-col"
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          {/* Top section with course cards */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-700">
              Your Courses
            </h2>
            <div className="grid grid-cols-3 gap-4">
  {courses.length > 0 ? (
    courses.slice(0, 3).map((course, index) => (
      <CourseCard
        key={course._id}
        title={course.title}
        category={course.category}
        thumbnail={course.thumbnailUrl || course.thumbnail}
        courseId={course._id}
        handleGoToCourse={() => handleGoToCourse(course._id)}
        showGoToCourseButton={true}
      />
    ))
  ) : (
    <div className="col-span-3 flex items-center justify-center h-72 bg-gray-100 rounded-lg shadow-md">
      <p className="text-gray-500 text-center">
        No courses available. Explore more content soon!
      </p>
    </div>
  )}
</div>

          </motion.div>

          {/* Bottom section split into two */}
          <motion.div
            className="flex flex-1 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-1/2 bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Popular Courses</h3>
              <div className="h-[180px] overflow-y-auto space-y-4 custom-scrollbar">
                {newlyAddedCourses.length > 0 ? (
                  newlyAddedCourses.map((course: any) => (
                    <div key={course._id}>
                      <div className="flex items-center space-x-4 bg-gray-100 p-1 rounded-lg">
                        {/* Course Image */}
                        <div className="course-image w-10 h-10 bg-gray-400 rounded-full overflow-hidden">
                          <img
                            src={
                              course.thumbnailUrl ||
                              "https://via.placeholder.com/150"
                            }
                            alt="Course Image"
                            className="object-cover w-full h-full"
                          />
                        </div>

                        {/* Course Name */}
                        <div className="course-name flex-grow">
                          <p className="text-sm font-semibold text-gray-800">
                            {course.title}
                          </p>
                        </div>

                        {/* Go to Course Button */}
                        <div
                          className="go-to-course-btn cursor-pointer"
                          onClick={() => navigate(`/details/${course._id}`)}
                        >
                          <PlayArrowIcon />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <h1>No newly added courses available</h1>
                )}
              </div>
              {/* {newlyAddedCourses.length > 3 && (
                <div
                  className="text-center mt-2 text-gray-500 cursor-pointer"
                  onClick={() => console.log("Show More")}
                >
                  <p>More Courses</p>
                </div>
              )} */}
            </div>

            <div className="w-1/2 bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Enrollment Stats</h3>
              <StylishChartV2 />
            </div>
          </motion.div>
        </motion.div>

        {/* Right side (35%) */}
        <motion.div
          className="w-[30%] pt-12 bg-white shadow-lg"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        >
          <div className="bg-gray-800 text-white rounded-lg shadow-md p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center font-reem-kufi">
              Welcome, Student !
            </h2>
            <p className="text-slate-300">
              Take on challenges, and excel in your learning journey!
            </p>
          </div>

          {/* Calendar */}
          <motion.div
            className="custom-calendar mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
          >
            <Calendar
              inline
              showWeek
              style={{
                width: "100%",
                maxHeight: "300px",
                overflow: "hidden",
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                marginTop: "10px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                boxSizing: "border-box",
              }}
            />
          </motion.div>

          {/* Chat with Tutors */}
          <motion.div
            className="bg-slate-200 text-gray-700 rounded-lg shadow-md p-4 max-w-md mx-auto flex items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
          >
            <p className="flex-grow mb-0">
              Chat with your favorite tutors and get the help you need.
            </p>
            <button
              onClick={() => navigate("/messages")}
              className="bg-blue-400 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md"
            >
              <ChatIcon />
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
