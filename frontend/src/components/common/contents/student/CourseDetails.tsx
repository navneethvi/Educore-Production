import React, { useEffect, useState } from "react";
import ReviewCard from "../../ReviewCard";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import { getCourseDetails } from "../../../../redux/admin/adminActions";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import { BASE_URL } from "../../../../utils/configs";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { studentCreatePayment } from "../../../../redux/students/studentActions";
import Swal from "sweetalert2";

const CourseDetails = () => {
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<any>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const { studentToken, studentData } = useSelector(
    (state: RootState) => state.student
  );

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      try {
        const response: any = await dispatch(
          getCourseDetails({ token: studentToken as string, id: courseId })
        );
        if (response.payload) {
          const courseData = response.payload;
          setCourse(courseData);

          if (courseData.thumbnail) {
            const url = await fetchThumbnailUrl(courseData.thumbnail);
            setThumbnailUrl(url);
          }
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
      setLoading(false);
    };

    fetchCourse();
  }, [courseId, dispatch, studentToken]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/course/get-reviews/?courseId=${courseId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        console.log("reviews--->", data);
        
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (courseId) {
      console.log("courseID", courseId);
      
      fetchReviews();
    }
  }, [courseId]);

  const handleEnrollNow = async () => {
    console.log("clicked");

    if (!stripe || !elements) return;

    try {
      const response = await dispatch(
        studentCreatePayment({
          token: studentToken as string,
          courseId: courseId as string,
          studentId: studentData._id,
        })
      );

      console.log("Payment Intent Created:", response);

      if (response.type === "studentCreatePayment/rejected") {
        Swal.fire({
          title: "Enrollment Failed",
          text: "You are already enrolled in this course.",
          customClass: {
            popup: "custom-popup", // Custom class for the popup
            title: "custom-title", // Custom class for the title
            htmlContainer: "custom-text", // Custom class for the text
          },
          background: "#fdf2f2", // Light red background
          color: "#721c24", // Text color to match the error theme
          showConfirmButton: true, // Display the "OK" button
          confirmButtonText: "Close", // Button text
          confirmButtonColor: "#f44336", // Button color (red)
        });
        return;
      }

      const sessionId = response.payload.sessionId;

      if (sessionId) {
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          console.error("Error redirecting to Stripe:", error);
          alert("Redirect to payment failed, please try again.");
        }
      } else {
        alert("Unable to initiate payment, please try again.");
      }
    } catch (error) {
      console.error("Error handling enrollment:", error);
      alert("Enrollment failed, please try again.");
    }
  };

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
      <div className="animate-pulse p-4 flex gap-4">
        <div className="left w-full md:w-2/4 p-4">
          <div className="bg-gray-300 h-8 w-1/2 mb-4 rounded"></div>
          <div className="bg-gray-300 h-72 w-full rounded-lg mb-4"></div>
          <div className="flex gap-4 mb-4">
            <div className="bg-gray-300 h-10 w-1/4 rounded"></div>
            <div className="bg-gray-300 h-10 w-1/4 rounded"></div>
          </div>
          <div className="bg-gray-300 h-48 w-full rounded-lg"></div>
        </div>
        <div className="right w-full md:w-2/4 p-4">
          <div className="bg-gray-300 h-8 w-1/2 mb-4 rounded"></div>
          <div className="bg-gray-300 h-16 w-full rounded mb-4"></div>
          <div className="bg-gray-300 h-8 w-1/3 mb-4 rounded"></div>
          <div className="bg-gray-300 h-16 w-full rounded mb-4"></div>
          <div className="bg-gray-300 h-24 w-full rounded"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="course-details-container flex gap-4">
      {/* Left Section */}
      <div className="left w-full md:w-2/4 p-4">
        <div className="title text-2xl font-bold mb-2 font-reem-kufi">
          {course.title}
        </div>
        <div className="thumbnail mb-4 relative">
          {/* Shimmer effect for image while loading */}
          {imageLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 h-72 w-full rounded-lg animate-pulse"></div>
          )}

          {/* Image will only be shown when it's fully loaded */}
          <img
            src={thumbnailUrl || "https://via.placeholder.com/300"}
            alt="Course Thumbnail"
            className={`w-full h-72 object-cover rounded-lg ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setImageLoading(false)}
          />
        </div>

        <div className="info flex items-center justify-center gap-4 mb-4">
          <button className="flex items-center bg-slate-300 text-black px-4 py-2 rounded-md font-reem-kufi">
            <StarIcon className="mr-2" style={{ color: "gold" }} />{" "}
            {course.rating || "4.5"} Rating
          </button>
          <button className="flex items-center bg-slate-300 text-black px-4 py-2 rounded-md font-reem-kufi">
            <PersonIcon className="mr-2" style={{ color: "skyblue" }} />{" "}
            {course.learners || "200"} Learners
          </button>
        </div>
        <div className="reviews h-48 p-4 bg-gray-100 rounded-lg overflow-y-scroll scrollbar-hide">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              reviewBy={review.reviewBy}
              review={review.review}
              rating={review.rating}
              courseName={"Course Name Here"} // Replace with actual course name if available
            />
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="right w-full md:w-2/4 p-4 mt-8">
        <div className="course-description mb-4">
          <h2 className="text-xl font-semibold mb-2">Course Description</h2>
          <p>{course.description}</p>
        </div>
        <div className="enrollment-info mb-4">
          <div className="price text-2xl font-bold text-green-600 mb-2">
            ${course.price || "49.99"}
          </div>
          <button
            className="buttonenroll bg-blue-600 text-white px-4 py-2 rounded-md w-28"
            onClick={handleEnrollNow}
          >
            Enroll Now
          </button>
        </div>
        <div className="additional-info mt-4">
          <h3 className="font-semibold">Additional Information</h3>
          <p>Duration: {course.duration || "4 weeks"}</p>
          <p>Level: {course.level || "Beginner"}</p>
          <p>Language: {course.language || "English"}</p>

          {/* Lesson List Section */}
          <div className="lessons mt-4">
            <h4 className="font-semibold mb-2">Lessons</h4>
            <div className="lesson-cards grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto scrollbar-hide max-h-56">
              {course.lessons?.map((lesson: any, index: number) => (
                <div
                  key={index}
                  className="lesson-card p-4 bg-slate-300 shadow-lg rounded-lg"
                >
                  <h5 className="text-lg font-semibold">{lesson.title}</h5>
                  <p className="text-sm">{lesson.goal}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
