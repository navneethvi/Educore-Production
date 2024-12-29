import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { motion } from "framer-motion";
import { ApexOptions } from "apexcharts";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const options: ApexOptions = {
  chart: {
    type: "area",
    height: 350,
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
    animations: {
      enabled: true,
    //   easing: "easeout",
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
  colors: ["#4CAF50", "#FFC107"], // Stylish color palette
  stroke: {
    curve: "smooth",
    width: [3, 3],
    dashArray: [0, 5], // Dashed line for the second series
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      gradientToColors: ["#8BC34A", "#FFEB3B"],
      type: "vertical", // Direction of gradient
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
    strokeColors: ["#4CAF50", "#FFC107"],
    strokeWidth: 3,
    hover: {
      size: 8,
    },
  },
  xaxis: {
    type: "category",
    categories: [
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
    ],
    labels: {
      style: {
        colors: "#757575",
        fontSize: "14px",
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
        fontSize: "14px",
        fontWeight: "600",
      },
    },
    title: {
      text: "Counts",
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
    theme: "dark",
    x: {
      show: true,
    },
    y: {
      formatter: (val) => `${val} items`,
    },
    marker: {
      show: true,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: { height: 300 },
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
  Courses: number[];
}

const StylishChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "yearly">(
    "weekly"
  );

  const { tutorToken } = useSelector((state: RootState) => state.tutor);


  useEffect(() => {
    fetch(
      `https://educore.live/api/payment/tutor-stats?timeRange=${timeframe}`
      , {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tutorToken}`,
        },
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
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
  }, [timeframe]);

  if (!chartData) {
    return (
      <div className="flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="col-span-12 max-w-full rounded-lg border border-stroke bg-gradient-to-br from-gray-50 to-gray-100 p-6 shadow-md sm:px-7.5 xl:col-span-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      <div className="flex justify-between items-center mb-5">
        <div className="flex gap-3">
          {["weekly", "monthly", "yearly"].map((frame) => (
            <button
              key={frame}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                timeframe === frame
                  ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() =>
                setTimeframe(frame as "weekly" | "monthly" | "yearly")
              }
            >
              {frame.charAt(0).toUpperCase() + frame.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div id="chart" className="-ml-5">
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
          height={350}
        />
      </div>
    </motion.div>
  );
};

export default StylishChart;
