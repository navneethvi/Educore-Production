import React, { useEffect, useState } from "react";
import CardDataStats from "../../../CardDataStats";
import {
  TotalProductIcon,
  TotalProfitIcon,
  TotalUsersIcon,
  TotalViewsIcon,
  ReviewIcon,
  BookIcon,
  GraphIcon,
} from "../../../../Icons/Icons";
import StylishChart from "../../../../Charts/ChartRwo";
import { BASE_URL } from "../../../../utils/configs";

import { useSelector, UseSelector } from "react-redux";
import { RootState } from "../../../../store/store";

interface Stats {
  totalSales: any;
  avgRating: any;
  numOfStudents: number;
  numOfTutors: number;
  numOfCourses: number;
  numOfCategories: number;
  numOfEnrolls: number;
}

const Dashboard: React.FC = () => {
  const [statsData, setStatsData] = useState<Stats | null>(null);

  const { tutorToken } = useSelector((state: RootState) => state.tutor);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/course/tutor-dash`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tutorToken}`,
        },
      }).then((response) => response.json()),

      fetch(`${BASE_URL}/payment/tutor-dash`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tutorToken}`,
        },
      }).then((response) => response.json()),
    ])
      .then(([data1, data2]) => {
        const mergedData = {
          ...data1,
          ...data2,
        };
        setStatsData(mergedData);
        console.log("Merged statsData=>", mergedData);
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
      title: "Total Enrollments",
      total: statsData.numOfEnrolls,
      rate: "+0.43%",
      levelUp: true,
      Icon: TotalViewsIcon,
    },
    {
      title: "Total Sales",
      total: statsData.totalSales,
      rate: "+4.35%",
      levelUp: true,
      Icon: GraphIcon,
    },
    {
      title: "Overall Review",
      total: statsData.avgRating,
      rate: "+2.59%",
      levelUp: true,
      Icon: ReviewIcon,
    },
    {
      title: "Total Courses",
      total: statsData.numOfCourses,
      rate: "-0.95%",
      levelDown: true,
      Icon: BookIcon,
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
        <StylishChart />
      </div>
    </div>
  );
};

export default Dashboard;
