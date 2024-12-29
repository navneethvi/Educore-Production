import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import { getCourseDetails } from "../../../../redux/admin/adminActions";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { BASE_URL } from "../../../../utils/configs";

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

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const { adminToken } = useSelector((state: RootState) => state.admin);

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
                    navigate(`/admin/lessons/${lesson._id}`, {
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

        <div className="p-4 bg-white shadow-md rounded-md text-center flex justify-center items-center space-x-4">
          {loading ? (
            <Skeleton circle={true} height={64} width={64} />
          ) : (
            <img
              src={course?.tutor_image || "https://via.placeholder.com/64"}
              alt={course?.tutor_name || "Tutor"}
              className="w-10 h-10 object-cover rounded-full"
            />
          )}
          <p className="text-xl font-semibold">
            {course?.tutor_name || <Skeleton width={100} />}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
