import React from "react";

interface ProfileBoxProps {
  isSelected?: boolean; // Optional prop to determine if this box is selected
  tutorInfo?: { name: string; image: string; _id: string}; // Optional tutorInfo prop
  studentInfo?: { name: string; image: string; _id: string }; // Optional studentInfo prop
  lastMessage?: string
}

const ProfileBox: React.FC<ProfileBoxProps> = ({
  isSelected,
  tutorInfo,
  studentInfo,
  lastMessage
}) => {
  // Determine whether to use tutorInfo or studentInfo
  const info = tutorInfo || studentInfo;

  // Do not render if neither tutorInfo nor studentInfo is provided
  if (!info?.name) {
    return null;
  }

  return (
    <div
      className={`profile-container flex items-center p-2 bg-white rounded-lg shadow-md transition-transform cursor-pointer w-full 
      ${
        isSelected
          ? "transform bg-zinc-200 scale-105 text-indigo-900"
          : "hover:scale-105 hover:bg-slate-50"
      }
      `}
    >
      {/* Profile Image */}
      <div className="flex-shrink-0">
        <img
          src={info.image} // Dynamically use the image from the selected info
          alt={info.name} // Dynamically use the name for alt text
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-indigo-500"
        />
      </div>

      {/* Name and Last Message */}
      <div className="flex-grow px-2 text-xs sm:text-sm">
        <div className="name text-gray-900 font-reem-kufi">{info.name}</div>
        <div className="last-message text-gray-500 text-xs truncate">
          {lastMessage}
        </div>
      </div>

    </div>
  );
};

export default ProfileBox;
