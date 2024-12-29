
import React from "react";

interface InterestButtonProps {
  interest: string;
  isSelected: (interest: string) => boolean;
  toggleRequirement: (interest: string) => void;
}


const InterestButton: React.FC<InterestButtonProps> = ({ interest, isSelected, toggleRequirement }) => {
  return (
    <li
      className={`flex items-center justify-center px-4 py-2 text-center rounded-lg shadow-sm cursor-pointer ${
        isSelected(interest)
          ? "bg-blue-300 text-blue-800"
          : "bg-gray-200 text-gray-800"
      }`}
      onClick={() => toggleRequirement(interest)}
    >
      {interest}
    </li>
  );
};

export default InterestButton;
