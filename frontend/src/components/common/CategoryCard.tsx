import CategoryIcon from "@mui/icons-material/Category";
import React from "react";

interface CategoryCardProps {
  name: string; // Accept name as a prop
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name }) => {
  return (
    <div className="category-card-container border-2 shadow-sm h-auto rounded-lg text-center p-4 hover:shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105">
      <CategoryIcon className="text-gray-700 text-lg mt-4" />
      <h1 className="font-reem-kufi text-2xl m-4 text-gray-600">{name}</h1> {/* Use the name prop */}
    </div>
  );
};

export default CategoryCard;
