import React, { useState, useEffect, useCallback, useMemo } from "react";
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

const Courses: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleGoToCourse = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  return (
<>
  {/* Search Bar */}
  <Paper
    component="form"
    sx={{
      p: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: 400,
      maxWidth: 600,
      margin: "0 auto",
      marginBottom: 2,
      border: 1,
      borderRadius: 10,
      borderColor: "#808999",
    }}
  >
    <InputBase
      sx={{ ml: 2, flex: 1 }}
      placeholder="Search Courses"
      inputProps={{ "aria-label": "search courses" }}
      value={searchTerm}
      onChange={handleSearchChange}
    />
    <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
      <SearchIcon />
    </IconButton>
  </Paper>

  {/* Courses List or Fallback */}
  {loading ? (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading courses...</p>
    </div>
  ) : error ? (
    <div className="flex items-center justify-center min-h-screen">
      <p>{error}</p>
    </div>
  ) : filteredCourses.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {filteredCourses.map((course) => (
        <CourseCard
          key={course._id}
          title={course.title}
          category={course.category}
          thumbnail={course.thumbnailUrl || course.thumbnail}
          courseId={course._id}
          handleGoToCourse={() => handleGoToCourse(course._id)}
          showGoToCourseButton={true}
        />
      ))}
    </div>
  ) : (
<motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center"
    >
      {/* Lottie Animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Player
          autoplay
          loop
          src="https://lottie.host/1b4ce5a2-8e67-4b4f-af81-9f3e136f34d8/n1sTMUEqF4.json"
          style={{ height: "300px", width: "400px" }}
        />
      </motion.div>

      {/* Message */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-xl font-semibold text-gray-700 mt-2"
      >
        No courses found!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-gray-500 mb-6"
      >
        Explore our store and discover amazing courses.
      </motion.p>

      {/* Button */}
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        onClick={() => navigate("/store")}
        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-200"
      >
        Go to Store
      </motion.button>
    </motion.div>
  )}
</>

  );
};

export default Courses;
