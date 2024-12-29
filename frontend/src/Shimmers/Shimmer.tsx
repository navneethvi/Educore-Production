import React from "react";

const Shimmer: React.FC = () => {
  return (
    <div className="relative bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden w-full sm:w-60 md:w-64 h-auto">
      {/* Placeholder for the image */}
      <div className="w-full h-36 bg-gray-300 animate-pulse rounded-t-lg"></div>

      {/* Placeholder for the category and price */}
      <div className="p-3">
        <div className="w-1/3 h-4 bg-gray-300 animate-pulse mb-2"></div>
        <div className="w-1/4 h-4 bg-gray-300 animate-pulse"></div>
      </div>

      {/* Placeholder for the title */}
      <div className="px-3">
        <div className="w-full h-6 bg-gray-300 animate-pulse mb-2"></div>
      </div>

      {/* Placeholder for tutor and enrollments */}
      <div className="p-3 flex items-center">
        <div className="w-6 h-6 rounded-full bg-gray-300 animate-pulse"></div>
        <div className="w-1/2 h-4 bg-gray-300 animate-pulse ml-2"></div>
        <div className="w-1/3 h-4 bg-gray-300 animate-pulse ml-auto"></div>
      </div>

      <hr className="my-1 border-gray-400" />

      {/* Placeholder for the icons and details */}
      <div className="px-3 pb-3 flex justify-between">
        <div className="w-1/4 h-4 bg-gray-300 animate-pulse"></div>
        <div className="w-1/4 h-4 bg-gray-300 animate-pulse"></div>
        <div className="w-1/4 h-4 bg-gray-300 animate-pulse"></div>
      </div>

      {/* Shimmer effect */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
        style={{ transform: "skewX(-25deg)" }}
      />
    </div>
  );
};

export default Shimmer;
