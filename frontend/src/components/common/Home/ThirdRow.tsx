import CategoryCard from "../CategoryCard";
import React, { useState } from "react";

export interface TrendingCategory {
  _id: string;
  name: string;
  courses?: any[]; // Adjust the type according to your courses structure
}

interface ThirdRowProps {
  trendingCategories?: TrendingCategory[]; // Make trendingCategories optional
}

const ThirdRow: React.FC<ThirdRowProps> = ({ trendingCategories = [] }) => {
  const [visibleCount, setVisibleCount] = useState(8); // Initially show 8 categories

  const handleViewMore = () => {
    setVisibleCount((prevCount) => prevCount + 4); // Show 4 more categories on each click
  };

  if (!trendingCategories || trendingCategories.length === 0) {
    return (
      <div className="third-row-container px-6 md:px-20 py-10">
        <h1 className="text-3xl md:text-4xl font-reem-kufi text-gray-600">
          Trending Categories
        </h1>
        <p className="text-center pt-10 text-gray-600">No categories available.</p>
      </div>
    );
  }

  return (
    <div className="third-row-container px-6 md:px-20 py-10">
      <h1 className="text-3xl md:text-4xl font-reem-kufi text-gray-600">
        Trending Categories
      </h1>
      <div className="trending-categories mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Render Category Cards based on visibleCount */}
        {trendingCategories.slice(0, visibleCount).map((category) => (
          <CategoryCard key={category._id} name={category.name} />
        ))}
      </div>
      {visibleCount < trendingCategories.length && (
        <p className="text-center pt-10 text-blue-600 cursor-pointer" onClick={handleViewMore}>
          View more...
        </p>
      )}
    </div>
  );
};

export default ThirdRow;
