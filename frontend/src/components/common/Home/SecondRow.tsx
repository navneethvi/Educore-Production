import React, { useEffect, useState } from "react";
import CourseCard from "../CourseCard";
import { CourseForCard } from "../../../types/types";
import { BASE_URL } from "../../../utils/configs";

interface SecondRowProps {
  trendingCourses: CourseForCard[];
  newlyAddedCourses: CourseForCard[];
}

interface Thumbnails {
  [key: string]: string | null;
}

const SecondRow: React.FC<SecondRowProps> = ({ trendingCourses, newlyAddedCourses }) => {
  const [thumbnails, setThumbnails] = useState<Thumbnails>({});

  // Function to fetch the thumbnail URL
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

  // Load thumbnail URLs for all courses
  useEffect(() => {
    const loadThumbnails = async () => {
      const allCourses = [...trendingCourses, ...newlyAddedCourses];

      const thumbnailPromises = allCourses.map(async (course) => {
        const url = await fetchThumbnailUrl(course.thumbnail);
        return { courseId: course._id, url };
      });

      const thumbnailResults = await Promise.all(thumbnailPromises);

      // Update state with fetched thumbnail URLs
      const newThumbnails: Thumbnails = {};
      thumbnailResults.forEach((result) => {
        newThumbnails[result.courseId] = result.url;
      });
      setThumbnails(newThumbnails);
    };

    loadThumbnails();
  }, [trendingCourses, newlyAddedCourses]);

  return (
    <>
      <div className="second-row-container px-4 md:px-16 py-10">
        <h1 className="text-3xl md:text-4xl font-reem-kufi text-gray-600">
          Trending Courses
        </h1>
        <div className="trending-cards mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {trendingCourses.map((course) => (
            <CourseCard
              key={course._id}
              title={course.title}
              category={course.category}
              price={course.price}
              originalPrice={course.price} 
              tutorName={course.tutor_data?.[0]?.name || "Unknown Tutor"}
              image={course.tutor_data?.[0]?.image || "Unknown Tutor"}
              thumbnail={thumbnails[course._id] || ""}
              lessonsCount={course.lessoncount || 1}
              duration="2h 12m"
              enrollments={course.enrollments || 0}
              courseId={course._id}
            />
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-reem-kufi text-gray-600 mt-10 md:mt-20">
          Recent Additions
        </h1>
        <div className="recent-cards mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {newlyAddedCourses.map((course) => (
            <CourseCard
              key={course._id}
              title={course.title}
              category={course.category}
              price={course.price}
              originalPrice={course.price} 
              tutorName={course.tutor_data?.[0]?.name || "Unknown Tutor"}
              image={course.tutor_data?.[0]?.image || "Unknown Tutor"}
              thumbnail={thumbnails[course._id] || ""}
              lessonsCount={course.lessoncount}
              duration="2h 12m"
              enrollments={course.enrollments || 0}
              courseId={course._id}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SecondRow;
