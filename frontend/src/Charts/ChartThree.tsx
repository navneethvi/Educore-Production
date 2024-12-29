import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { motion } from "framer-motion";
import { ApexOptions } from "apexcharts";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const options: ApexOptions = {
  chart: {
    type: "area",
    height: 200, // Adjusted height for the chart
    fontFamily: "Satoshi, sans-serif",
    toolbar: {
        show: false, // Disable the chart toolbar
      },
    animations: {
      enabled: true,
      speed: 800,
    },
    dropShadow: {
      enabled: true,
      color: "#000",
      top: 5,
      left: 0,
      blur: 5,
      opacity: 0.1,
    },
  },
  colors: ["#4CAF50"], // Single color for enrollments
  stroke: {
    curve: "smooth",
    width: [3],
    dashArray: [0], // No dashed line since we're only showing enrollments
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      gradientToColors: ["#8BC34A"],
      type: "vertical",
      opacityFrom: 0.9,
      opacityTo: 0.3,
      stops: [0, 100],
    },
  },
  grid: {
    borderColor: "#e4e4e4",
    strokeDashArray: 3,
    padding: {
      left: 10,
      right: 10,
    },
  },
  markers: {
    size: 6,
    colors: ["#fff"],
    strokeColors: ["#4CAF50"],
    strokeWidth: 3,
    hover: {
      size: 8,
    },
  },
  xaxis: {
    type: "category",
    categories: ["Week 1", "Week 2", "Week 3", "Week 4"], // Only 4 weeks of data
    labels: {
      style: {
        colors: "#757575",
        fontSize: "10px",
        fontWeight: "600",
      },
    },
    axisBorder: { color: "#ddd" },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: {
        colors: "#757575",
        fontSize: "10px",
        fontWeight: "600",
      },
    },
    title: {
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#424242",
      },
    },
    min: 0,
  },
  legend: {
    position: "top",
    horizontalAlign: "center",
    fontSize: "14px",
    fontWeight: 600,
  },
  tooltip: {
    enabled: false, // Disable the tooltip
  },

  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: { height: 150 }, // Adjust height for smaller screens
        legend: { fontSize: "12px" },
        xaxis: {
          labels: { style: { fontSize: "12px" } },
        },
      },
    },
  ],
};

interface ChartData {
  Enrollments: number[];
}

const StylishChartV2: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "yearly">("weekly"); // Default to weekly

  const { tutorToken, tutorData } = useSelector((state: RootState) => state.tutor);

  useEffect(() => {
    // Replace with actual tutorToken and tutorId
    const tutorId = tutorData?._id as string;
  
    // Fetch the last 4 weeks enrollments
    fetch(`https://educore.live/api/payment/tutor-enrollments/${tutorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tutorToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const enrollmentsData = data.enrollments || [];
        setChartData({
          Enrollments: enrollmentsData,
        });
      })
      .catch((error) => console.error("Error fetching chart data:", error));
  }, [timeframe]);
  

  return (
    <motion.div
      className="col-span-12 max-w-full rounded-lg border border-stroke bg-gradient-to-br from-gray-50 to-gray-100 sm:px-7.5 xl:col-span-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      <div className="flex justify-between items-center mb-5"></div>

      <div id="chart" className="-ml-5">
        <ReactApexChart
          options={options}
          series={[
            {
              name: "Enrollments",
              data: chartData?.Enrollments || [],
            },
          ]}
          type="area"
          height={175} // Adjusted chart height here
        />
      </div>
    </motion.div>
  );
};

export default StylishChartV2;
