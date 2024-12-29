import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminApproveCourse,
  getAllCourses,
} from "../../../../redux/admin/adminActions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableBody from "@mui/material/TableBody";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { BASE_URL } from "../../../../utils/configs";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#4A5568",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const shimmerStyle = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
`;

interface Lesson {
  title: string;
  goal: string;
  video: string;
  materials: string;
  homework: string;
}

interface Course {
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

const Courses: React.FC = () => {
  const [showApproved, setShowApproved] = useState(true);
  const [loading, setLoading] = useState(true);
  const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({});
  const [imageLoadingMap, setImageLoadingMap] = useState<Map<string, boolean>>(
    new Map<string, boolean>()
  );

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { adminToken, approvedCourses, pendingCourses } = useSelector(
    (state: RootState) => state.admin
  );

  const courses = showApproved ? approvedCourses?.data : pendingCourses?.data;

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
        ? approvedCourses?.data || []
        : pendingCourses?.data || [];

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
  }, [showApproved, approvedCourses?.data, pendingCourses?.data]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const token = adminToken as string;

      try {
        await dispatch(getAllCourses({ token, status: showApproved }));
        const initialLoadingMap: Map<string, boolean> = new Map(
          (courses || []).map((course: Course) => [course._id, true])
        );
        setImageLoadingMap(initialLoadingMap);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [dispatch, adminToken, showApproved]);

  const handleCourseClick = (courseId: string) => {
    navigate(`/admin/course/${courseId}`);
  };

  const handleApprove = async (courseId: string) => {
    const token = adminToken as string;

    Swal.fire({
      title: "Are you sure you want to approve this course?",
      text: "This action will approve the course and make it available to students.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#bbb",
      confirmButtonText: "Yes, approve it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const approvalResult = await dispatch(
            adminApproveCourse({ token, courseId })
          );

          if (approvalResult) {
            await dispatch(getAllCourses({ token, status: showApproved }));
            Swal.fire({
              title: "Approved!",
              text: "The course has been approved successfully.",
              icon: "success",
              confirmButtonText: "OK",
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: "There was an issue approving the course. Please try again.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "There was an error approving the course. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  const handleReject = async (courseId: string) => {
    const token = adminToken as string;
    // Implement reject logic if needed
  };

  const handleImageLoad = (courseId: string) => {
    setImageLoadingMap((prev) => new Map(prev).set(courseId, false));
  };

  return (
<>
  <style>
    {`
      /* Custom Scrollbar for the TableContainer */
      .custom-scrollbar::-webkit-scrollbar {
        width: 10px; /* Adjust width */
      }

      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #888; /* Color of the scrollbar */
        border-radius: 5px; /* Rounded edges */
        border: 2px solid #fff; /* Space between the thumb and the track */
      }

      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: #555; /* Hover effect for the thumb */
      }

      .custom-scrollbar::-webkit-scrollbar-track {
        background-color: #f1f1f1; /* Track color */
        border-radius: 5px; /* Rounded edges */
      }

       .table-no-shadow {
        box-shadow: none !important;
      }
    `}
  </style>

  <div className="heading mb-6 px-4">
    <h1 className="text-2xl font-semibold text-gray-800">Courses</h1>
  </div>
  <div className="flex justify-end mb-6 px-4">
    <button
      onClick={() => setShowApproved(!showApproved)}
      className={`px-4 py-2 rounded text-white ${
        showApproved
          ? "bg-gray-800 hover:bg-gray-700"
          : "bg-gray-600 hover:bg-gray-500"
      }`}
    >
      {showApproved ? "Show Pending Courses" : "Show Approved Courses"}
    </button>
  </div>

  {loading ? (
    <div className="flex justify-center items-center h-[300px]">
      <CircularProgress />
    </div>
  ) : (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <TableContainer
        component={Paper}
        style={{ maxHeight: "500px", overflowY: "auto" }}
        className="custom-scrollbar table-no-shad"
      >
        <Table aria-label="courses table">
          <TableHead
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1, // Ensures the header stays on top
              backgroundColor: "#fff", // Adds a background color to avoid transparency while scrolling
            }}
          >
            <TableRow>
              <StyledTableCell align="left">Image</StyledTableCell>
              <StyledTableCell align="center">Title</StyledTableCell>
              <StyledTableCell align="center">Category</StyledTableCell>
              <StyledTableCell align="center">Price</StyledTableCell>
              <StyledTableCell align="center">Tutor</StyledTableCell>
              {showApproved && (
                <StyledTableCell align="center">
                  Enrollments
                </StyledTableCell>
              )}
              <StyledTableCell align="center">Approval</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses && courses.length > 0 ? (
              courses.map((course) => (
                <StyledTableRow key={course._id}>
                  <StyledTableCell align="left">
                    <div className="relative shimmer-wrapper">
                      {imageLoadingMap.get(course._id) && (
                        <div className="shimmer"></div>
                      )}
                      <img
                        src={thumbnails[course._id] || ""}
                        alt={course.title}
                        className={`image transition-opacity duration-500 ease-in-out ${
                          imageLoadingMap.get(course._id)
                            ? "opacity-0"
                            : "opacity-100"
                        }`}
                        onLoad={() => handleImageLoad(course._id)}
                        onError={() => handleImageLoad(course._id)}
                      />
                    </div>
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    {course.title}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {course.category}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {course.price}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {course.tutor_data[0].name}
                  </StyledTableCell>
                  {showApproved && (
                    <StyledTableCell align="center">
                      {course.enrollments}
                    </StyledTableCell>
                  )}
                  <StyledTableCell align="center">
                    {course.is_approved ? (
                      <Alert severity="success">Approved</Alert>
                    ) : (
                      <Alert severity="warning">Pending</Alert>
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <button
                      onClick={() => handleCourseClick(course._id)}
                      className="bg-purple-600 text-white text-xs px-6 py-2 mr-2 rounded-full"
                    >
                      View
                    </button>
                    {!course.is_approved && (
                      <button
                        onClick={() => handleApprove(course._id)}
                        className="bg-green-600 text-white text-xs px-6 py-2 ml-2 rounded-full"
                      >
                        Approve
                      </button>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={8} align="center">
                  <Alert severity="info">No courses found.</Alert>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </motion.div>
  )}
</>

  
  );
};

export default Courses;
