import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import { getCourseDetails } from "../../../../redux/admin/adminActions";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { BASE_URL } from "../../../../utils/configs";
import ChatIcon from "@mui/icons-material/Chat";
import CourseRatingModal from "../../../../Modal/AddReviewCourseModal";
import Swal from "sweetalert2";

const shimmerStyle = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
  .shimmer {
    position: relative;
    overflow: hidden;
    background: #f6f7f8;
    background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
    background-size: 1000px 100%;
    animation: shimmer 1.5s infinite;
  }
`;

const Loading = () => (
  <div className="loading">
    <div></div>
    <div></div>
  </div>
);

const EnrolledCourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const { adminToken } = useSelector((state: RootState) => state.admin);

  const { studentToken } = useSelector((state: RootState) => state.student);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      const response: any = await dispatch(
        getCourseDetails({ token: adminToken as string, id: courseId })
      );

      if (response.payload) {
        const courseData = response.payload;
        setCourse(courseData);
        console.log(courseData); // Log the course data to check
        if (courseData.thumbnail) {
          const url = await fetchThumbnailUrl(courseData.thumbnail);
          setThumbnailUrl(url);
        }
      }
      setLoading(false);
    };

    fetchCourse();
  }, [courseId, dispatch, adminToken]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setImageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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

  const handleClickChat = async () => {
    navigate("/messages", { state: { tutorId: course.tutor_id } });
  };

  const handleSubmitReview = async (rating: number, review: string) => {
    if (!courseId) {
      console.error("Course ID is not available");
      return;
    }
  
    console.log(`Rating: ${rating}, Review: ${review}`);
    const tutorId = course.tutor_id;
    
    try {
      const response = await fetch(`${BASE_URL}/course/add-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({
          courseId,
          rating,
          review,
          tutorId,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to add review: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Review added successfully:", data);
      Swal.fire({
        title: 'Success!',
        text: 'Your review has been added successfully.',
        icon: 'success',
        confirmButtonText: 'Okay',
      });
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };
  

  if (loading) {
    return (
      <div className="content">
        <style>{shimmerStyle}</style>
        <Loading />
      </div>
    );
  }

  return (
    <div className="course-details p-4 flex gap-4 h-full">
      <style>{shimmerStyle}</style>

      {/* Left Side (70%) - Scrollable */}
      <div className="w-9/12 h-full overflow-y-auto custom-scrollbar">
        <div className="p-4 bg-white shadow-md rounded-md">
          <h2 className="text-2xl font-semibold mb-4 mt-6">
            {course?.title || <Skeleton width={200} />}
          </h2>
          <p className="course-description text-gray-600">
            {course?.description || <Skeleton count={3} />}
          </p>
        </div>

        {course?.lessons &&
          course.lessons.map((lesson: any, index: number) => (
            <div
              key={lesson._id}
              className="mt-6 p-4 bg-gray-300 shadow-md rounded-md"
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    Lesson {index + 1}: {lesson.title || `Lesson ${index + 1}`}
                  </h3>
                  <p className="mt-2 text-gray-500">Uploaded on: 10/10/24</p>
                  <p className="mt-2 text-gray-600">Goal: {lesson.goal}</p>
                </div>
                <button
                  onClick={() =>
                    navigate(`/lessons/${lesson._id}`, {
                      state: {
                        courseId: courseId,
                        lessonLength: course.lessons.length,
                        lessonIndex: index,
                        lessonTitle: lesson.title || `Lesson ${index}`,
                      },
                    })
                  }
                  className="mt-4 md:mt-0 bg-black text-white py-2 px-4 rounded inline-block"
                >
                  Go to Lesson
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Right Side (30%) */}
      <div className="w-3/12 flex flex-col gap-8">
        <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
          {imageLoading ? (
            <div className="shimmer h-40 rounded-md mb-4" />
          ) : (
            <img
              src={thumbnailUrl || "https://via.placeholder.com/150"}
              alt={course?.title || "Course Thumbnail"}
              className="w-full h-40 object-cover mt-4 rounded-md mb-4"
              onLoad={() => setImageLoading(false)}
            />
          )}

          <h2 className="text-xl font-semibold text-gray-800">
            {course?.title || <Skeleton width={200} />}
          </h2>
          <p className="mt-2 text-gray-600">
            <strong>{course?.category || <Skeleton width={100} />}</strong>
          </p>
          <p className="mt-2 text-gray-600">
            <strong>₹{course?.price || <Skeleton width={50} />}</strong>
          </p>
        </div>

        <div className="p-4 bg-white shadow-md rounded-md flex justify-between items-center space-x-4">
          {/* Tutor Image */}
          {loading ? (
            <Skeleton circle={true} height={64} width={64} />
          ) : (
            <img
              src={course?.tutor_image || "https://via.placeholder.com/64"}
              alt={course?.tutor_name || "Tutor"}
              className="w-12 h-12 object-cover rounded-full" // Adjusted for better responsive design
            />
          )}

          {/* Tutor Name */}
          <p className="text-xl font-semibold flex-grow text-left">
            {course?.tutor_name || <Skeleton width={100} />}
          </p>

          {/* Chat Icon */}
          <div
            className="border border-gray-300 p-2 rounded-full flex justify-center items-center cursor-pointer"
            onClick={handleClickChat}
          >
            <ChatIcon className="text-gray-600" />
          </div>
        </div>

        <div className="add-rating flex justify-center items-center mt-4">
          <button
            className="bg-purple-600 text-white text-md px-6 py-2 mr-2 rounded-full transition duration-200"
            onClick={() => setIsModalOpen(true)}
          >
            Add Rating and Review
          </button>
          <CourseRatingModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmitReview}
            courseName={course.title}
          />
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourseDetails;
