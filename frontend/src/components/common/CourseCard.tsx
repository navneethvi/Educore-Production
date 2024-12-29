import React, { useState } from "react";
import ClassIcon from "@mui/icons-material/Class";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SchoolIcon from "@mui/icons-material/School";
import { Button } from "@mui/material"; // Import Button from MUI

interface CourseCardProps {
  title: string;
  category: string;
  thumbnail: string;
  courseId: string;
  handleClick?: (courseId: string) => void;
  price?: number;
  originalPrice?: number;
  tutorName?: string;
  image?: string;
  lessonsCount?: number;
  duration?: string;
  enrollments?: number;
  onEdit?: (courseId: string) => void;
  onDelete?: (courseId: string) => void;
  isAdmin?: boolean;
  isTutor?: boolean;
  handleGoToCourse?: () => void;
  showGoToCourseButton?: boolean; // New prop to control button visibility

}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  category,
  thumbnail,
  courseId,
  handleClick,
  price,
  tutorName,
  image,
  lessonsCount,
  duration,
  enrollments,
  onEdit,
  onDelete,
  isAdmin = false,
  isTutor = false,
  handleGoToCourse,
  showGoToCourseButton = false, // Default to true

}) => {
  const [imageLoading, setImageLoading] = useState(true);

  const truncateTitle = (title: string, maxLength: number) => {
    return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
  };

  const handleCardClick = () => {
    if (handleClick) handleClick(courseId);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden w-full sm:w-64 h-auto cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-gray-300"
    >
      <div className="relative aspect-video">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-lg" />
        )}
        <img
          src={thumbnail}
          alt="Course Thumbnail"
          className={`w-full h-full object-cover rounded-t-lg transition-opacity duration-500 ${
            imageLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setImageLoading(false)}
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-600">{category}</h2>
          {price !== undefined && (
            <p className="text-gray-700 font-medium">₹{price}</p>
          )}
        </div>
        <h1 className="font-semibold text-md font-reem-kufi text-gray-800 leading-tight">
          {truncateTitle(title, 24)}
        </h1>
        {isAdmin && (
          <div className="flex justify-center items-center space-x-2">
            <button className="bg-purple-600 text-white text-xs px-4 py-2 rounded-full hover:bg-purple-700 transition duration-300">
              Approve
            </button>
            <button className="bg-red-600 text-white text-xs px-4 py-2 rounded-full hover:bg-red-700 transition duration-300">
              Reject
            </button>
          </div>
        )}
        {isTutor && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit && onEdit(courseId);
              }}
              className="bg-blue-600 text-white text-xs px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete(courseId);
              }}
              className="bg-red-600 text-white text-xs px-6 py-2 rounded-full hover:bg-red-700 transition duration-300"
            >
              Delete
            </button>
          </div>
        )}
        {tutorName  && (
          <div className="flex items-center space-x-2">
            <img
              src="data:image/png;base64,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"
              alt={tutorName}
              className="w-8 h-8 rounded-full object-cover"
            />
            <p className="text-sm text-gray-600">{tutorName}</p>
          </div>
        )}
        {(lessonsCount || duration || enrollments) && (
          <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-200">
            {lessonsCount && (
              <div className="flex items-center space-x-1">
                <ClassIcon className="w-4 h-4" />
                <span>{lessonsCount} lessons</span>
              </div>
            )}
            {duration && (
              <div className="flex items-center space-x-1">
                <AccessTimeIcon className="w-4 h-4" />
                <span>{duration}</span>
              </div>
            )}
            {enrollments && (
              <div className="flex items-center space-x-1">
                <SchoolIcon className="w-4 h-4" />
                <span>{enrollments || 0} enrolled</span>
              </div>
            )}
          </div>
        )}
        {showGoToCourseButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleGoToCourse && handleGoToCourse();
            }}
            className="w-full bg-violet-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-violet-700 transition duration-300"
          >
            Go to course
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
