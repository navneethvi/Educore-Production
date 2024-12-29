import React from "react";
import { motion } from "framer-motion";

const ReceiverMessageBox: React.FC<{ message: string; timestamp: string }> = ({
  message,
  timestamp,
}) => {
  return (
    <motion.div
      className="group flex items-start mb-2"
      initial={{ x: 100, opacity: 0 }} // Starts off-screen to the right
      animate={{ x: 0, opacity: 1 }} // Slides in and becomes visible
      transition={{ duration: 0.5, ease: "easeOut" }} // Smooth animation
    >
      {/* Profile Picture */}
      <div className="flex-shrink-0">
        <img
          src="https://avatars.githubusercontent.com/u/108149371?v=4" // Replace with the actual receiver's profile picture
          alt="Receiver"
          className="w-6 h-6 rounded-full mr-2"
        />
      </div>

      {/* Message Box */}
      <div className="bg-gradient-to-r from-violet-500 to-blue-600 text-white px-6 py-2 rounded-2xl shadow-lg max-w-xs transition-transform transform hover:scale-105">
        {message}
      </div>

      {/* Timestamp (Optional) */}
      <div className="text-xs text-gray-400 mt-1 ml-8 opacity-0 group-hover:opacity-100 group-hover:block transition-opacity">
        {timestamp}
      </div>
    </motion.div>
  );
};

export default ReceiverMessageBox;
