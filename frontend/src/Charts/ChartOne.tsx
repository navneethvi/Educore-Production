import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { motion } from "framer-motion";
import { ApexOptions } from "apexcharts";

const options: ApexOptions = {
  chart: {
    type: "area",
    height: 300,
    fontFamily: "Satoshi, sans-serif",
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        reset: true,
        pan: false,
      },
    },
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
  },
  colors: ["#3C50E0", "#80CAEE"], // Base colors
  stroke: {
    curve: "smooth",
    width: [2, 2],
  },
  fill: {
    type: "gradient", // Enabling gradient fill
    gradient: {
      shade: "light",
      type: "horizontal", // Gradient direction (horizontal, vertical)
      gradientToColors: ["#80CAEE", "#3C50E0"], // Gradient transition
      opacityFrom: 0.8, // Starting opacity
      opacityTo: 0.4, // Ending opacity
      stops: [0, 100], // Gradient stops
    },
  },
  grid: {
    borderColor: "#e7e7e7",
    strokeDashArray: 4,
  },
  dataLabels: { enabled: false },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#3056D3", "#80CAEE"],
    strokeWidth: 3,
  },
  xaxis: {
    type: "category",
    categories: [
      "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"
    ],
    labels: {
      style: {
        colors: "#A3AED0",
        fontSize: "12px",
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    title: {
      text: "Count",
      style: { fontSize: "14px", color: "#6C757D" },
    },
    labels: {
      style: {
        colors: "#A3AED0",
        fontSize: "12px",
      },
    },
    min: 0,
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: { height: 250 },
        xaxis: {
          labels: { style: { fontSize: "10px" } },
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: { height: 280 },
        xaxis: {
          labels: { style: { fontSize: "11px" } },
        },
      },
    },
  ],
  tooltip: {
    theme: "light",
    x: {
      show: true,
    },
    y: {
      formatter: (val) => `${val}`,
    },
  },
};


interface ChartData {
  Enrollments: number[];
  Courses: number[];
}

const ChartOne: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "yearly">(
    "weekly"
  );
  

  useEffect(() => {
    // Fetch data based on selected time range
    fetch(
      `https://educore.live/api/payment/admin-stats?timeRange=${timeframe}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Extract and map data for courses and enrollments
        const coursesData = data.courses.map(
          (item: { _id: string; count: number }) => item.count
        );
        const enrollmentsData = data.enrollments.map(
          (item: { _id: string; count: number }) => item.count
        );

        setChartData({
          Courses: coursesData,
          Enrollments: enrollmentsData,
        });
      })
      .catch((error) => {
        console.error("Error fetching chart data:", error);
      });
  }, [timeframe]); // Re-fetch data when timeframe changes // Re-fetch data when timeframe changes
  if (!chartData) {
    return <div className="flex justify-center items-center">
    <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
  </div>
  }

  return (
    <motion.div
      className="col-span-12 max-w-full rounded-sm border border-stroke bg-white px-4 pt-7.5 pb-5 mt-6 shadow-default sm:px-7.5 xl:col-span-8"
      initial={{ opacity: 0, y: 50 }} // Start from invisible and slightly down
      animate={{ opacity: 1, y: 0 }} // End at full opacity and normal position
      transition={{
        duration: 0.6, // Duration of the animation
        ease: "easeOut", // Easing function for smoothness
        delay: 0.2, // Optional delay before starting the animation
      }}
    >
      {/* Timeframe Buttons */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {["weekly", "monthly", "yearly"].map((frame) => (
            <button
              key={frame}
              className={`px-4 py-2 rounded-full font-medium shadow-md transition-colors ${
                timeframe === frame
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-300"
              }`}
              onClick={() =>
                setTimeframe(frame as "weekly" | "monthly" | "yearly")
              }
            >
              {frame.charAt(0).toUpperCase() + frame.slice(1)}{" "}
              {/* Capitalize the button text */}
            </button>
          ))}
        </div>
      </div>
    
      {/* Chart */}
      <div id="chartOne" className="-ml-5">
        <ReactApexChart
          options={options}
          series={[
            {
              name: "Enrollments",
              data: chartData?.Enrollments || [],
            },
            {
              name: "Courses",
              data: chartData?.Courses || [],
            },
          ]}
          type="area"
          height={330}
        />
      </div>
    </motion.div>
    
  );
};

export default ChartOne;
