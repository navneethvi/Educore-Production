import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface CardDataStatsProps {
  title: string;
  total:  string | number;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children?: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  children,
}) => {
  // Framer Motion animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="rounded-xl border border-stroke bg-white p-3 shadow-lg transition duration-300 hover:shadow-lg dark:border-strokedark dark:bg-boxdark"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <div className="flex items-center justify-between">
        {/* Icon Container */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white">
          {children}
        </div>

        {/* Performance Indicators */}
        <span
          className={`flex items-center gap-1 text-sm font-medium ${
            levelUp
              ? "text-success"
              : levelDown
              ? "text-danger"
              : "text-body-color dark:text-body-color-dark"
          }`}
        >
          {rate}
          {levelUp && <ArrowUpIcon className="h-4 w-4" />}
          {levelDown && <ArrowDownIcon className="h-4 w-4" />}
        </span>
      </div>

      {/* Stats Details */}
      <div className="mt-4">
        <h4 className="text-3xl font-bold text-gray-700">{total}</h4>
        <p className="mt-1 text-sm font-medium text-body-color">{title}</p>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="relative h-2 w-full rounded-full bg-stroke">
          <div
            className={`absolute left-0 top-0 h-full rounded-full ${
              levelUp ? "bg-success" : levelDown ? "bg-danger" : "bg-primary"
            }`}
            style={{ width: `${Math.abs(parseFloat(rate))}%` }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
};

export default CardDataStats;
