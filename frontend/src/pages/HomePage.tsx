import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/common/Home/Header";
import FirstRow from "../components/common/Home/FirstRow";
import SecondRow from "../components/common/Home/SecondRow";
import ThirdRow from "../components/common/Home/ThirdRow";
import Footer from "../components/common/Home/Footer";
import FourthRow from "../components/common/Home/FourthRow";
import FifthRow from "../components/common/Home/FifthRow";
import { BASE_URL } from "../utils/configs";
import { CourseForCard } from "../types/types";
import { TrendingCategory } from "../components/common/Home/ThirdRow";

interface HomePageData {
  trendingCourses: CourseForCard[];
  newlyAddedCourses: CourseForCard[];
  trendingCategories: TrendingCategory[];
}

const HomePage: React.FC = () => {
  const [homePageData, setHomePageData] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/course/homepage`);
        setHomePageData(response.data);
        setLoading(false); // Set loading to false
      } catch (err) {
        console.error("Error fetching homepage data:", err);
        setError("Failed to load data.");
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchHomePageData();
  }, []); 



  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg p-8 text-center">
        <div className="w-64 h-64 mx-auto mb-8">
          <svg
            className="w-full h-full text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          We're currently experiencing technical issues
        </h1>
        <p className="text-gray-600 mb-8">
          Please try again later. We apologize for the inconvenience.
        </p>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    </div>
    );
  }

  console.log("homepagedata============>", homePageData);

  return (
    <div>
      <Header />
      {/* Pass the fetched data to relevant components */}
      <FirstRow />
      <SecondRow
        trendingCourses={homePageData?.trendingCourses || []}
        newlyAddedCourses={homePageData?.newlyAddedCourses || []}
      />
      <ThirdRow trendingCategories={homePageData?.trendingCategories || []} />
      <FourthRow />
      <FifthRow />
      <Footer />
    </div>
  );
};

export default HomePage;
