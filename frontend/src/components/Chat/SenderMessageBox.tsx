import React from "react";
import { motion } from "framer-motion";

const SenderMessageBox: React.FC<{ message: string; timestamp: string }> = ({
  message,
  timestamp,
}) => {
  return (
    <motion.div
      className="flex items-start mb-2 justify-end"
      initial={{ x: -100, opacity: 0 }} // Starts off-screen to the left
      animate={{ x: 0, opacity: 1 }} // Slides in and becomes visible
      transition={{ duration: 0.5, ease: "easeOut" }} // Smooth animation
    >
      {/* Message Box */}
      <div className="bg-gradient-to-r from-violet-500 to-blue-600 text-white px-6 py-2 rounded-2xl shadow-lg max-w-xs transition-transform transform hover:scale-105">
        {message}
      </div>

      {/* Timestamp (Optional) */}
      <div className="text-xs text-gray-300 ml-2">{timestamp}</div>
    </motion.div>
  );
};

export default SenderMessageBox;
