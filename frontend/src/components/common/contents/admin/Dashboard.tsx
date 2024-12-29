import React, { useEffect, useState } from "react";
import CardDataStats from "../../../CardDataStats";
import {
  TotalProductIcon,
  TotalProfitIcon,
  TotalUsersIcon,
  TotalViewsIcon,
} from "../../../../Icons/Icons";
import ChartOne from "../../../../Charts/ChartOne";
import { BASE_URL } from "../../../../utils/configs";

interface Stats {
  numOfStudents: number;
  numOfTutors: number;
  numOfCourses: number;
  numOfCategories: number;
}

const Dashboard: React.FC = () => {
  const [statsData, setStatsData] = useState<Stats | null>(null);

  useEffect(() => {
    // Fetch data from your API
    fetch(`${BASE_URL}/course/admin-dash`) // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => {
        setStatsData(data);
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
      });
  }, []);

  if (!statsData) {
    return <div>Loading...</div>; // Add a loading state
  }

  const cardData = [
    {
      title: "Total Students",
      total: statsData.numOfStudents.toString(),
      rate: "+0.43%",
      levelUp: true,
      Icon: TotalViewsIcon,
    },
    {
      title: "Total Tutors",
      total: statsData.numOfTutors.toString(),
      rate: "+4.35%",
      levelUp: true,
      Icon: TotalProfitIcon,
    },
    {
      title: "Total Courses",
      total: statsData.numOfCourses.toString(),
      rate: "+2.59%",
      levelUp: true,
      Icon: TotalProductIcon,
    },
    {
      title: "Total Categories",
      total: statsData.numOfCategories.toString(),
      rate: "-0.95%",
      levelDown: true,
      Icon: TotalUsersIcon,
    },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-full">
        {cardData.map((stat, index) => (
          <CardDataStats
            key={index}
            title={stat.title}
            total={stat.total}
            rate={stat.rate}
            levelUp={stat.levelUp}
            levelDown={stat.levelDown}
          >
            <stat.Icon className="w-6 h-6" />
          </CardDataStats>
        ))}
      </div>

      {/* Chart Section */}
      <div className="chart">
        <ChartOne />
      </div>
    </div>
  );
};

export default Dashboard;
