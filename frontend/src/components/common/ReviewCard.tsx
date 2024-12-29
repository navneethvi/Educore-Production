import StarBorderIcon from "@mui/icons-material/StarBorder";
import React from "react";

interface ReviewCardProps {
  reviewBy: {
    _id: string;
    name: string;
    image: string;
  };
  review: string;
  rating: number;
  courseName?: any;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  reviewBy,
  review,
  rating,
  courseName,
}) => {
  // Render stars based on the rating
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <StarBorderIcon
          key={i}
          style={{ color: i < rating ? "#FFD700" : "#ccc" }}
        />
      );
    }
    return stars;
  };

  console.log("courseName==>", courseName);

  return (
    <div className="review-cards border-2 shadow-sm h-auto rounded-lg text-center p-4 hover:shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105">
      <div className="stars mb-4 text-left">{renderStars()}</div>
      {courseName && courseName?.title ? (
        <h1 className="font-medium font-reem-kufi text-xl text-left">
          {courseName?.title} {/* Render title directly */}
        </h1>
      ) : (
        <h1 className="font-medium font-reem-kufi text-xl text-left">
          
        </h1>
      )}
      <h2 className="font-normal text-sm text-left mb-4">{review}</h2>
      <div className="flex items-center space-x-2">
        <img
          src={reviewBy.image}
          alt="tutor-profile"
          className="w-8 h-8 rounded-full"
        />
        <h2 className="font-normal text-sm mb-0 font-reem-kufi text-gray-500">
          {reviewBy.name}
        </h2>
      </div>
    </div>
  );
};

export default ReviewCard;
