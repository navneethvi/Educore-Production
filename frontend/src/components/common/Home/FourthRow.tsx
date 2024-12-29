import { BASE_URL } from "../../../utils/configs";
import ReviewCard from "../ReviewCard";
import React, { useEffect, useState } from "react";

const FourthRow: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${BASE_URL}/course/reviews-home`);
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

    fetchReviews();
  }, []);
  return (
    <>
      <div className="review-card-container px-6 md:px-20 py-10">
        <h1 className="text-3xl md:text-4xl font-reem-kufi text-gray-600">
          Latest Reviews
        </h1>
        <div className="cards mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              reviewBy={review.reviewBy}
              review={review.review}
              rating={review.rating}
              courseName={review.courseId} // Replace with actual course name if available
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default FourthRow;
