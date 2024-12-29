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
    return <div>{error}</div>;
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
