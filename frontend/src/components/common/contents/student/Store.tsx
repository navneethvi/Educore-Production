import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { studentFetchCourses } from "../../../../redux/students/studentActions";
import { AppDispatch, RootState } from "../../../../store/store";
import CourseCard from "../../CourseCard";
import { BASE_URL } from "../../../../utils/configs";
import { motion } from "framer-motion";
import { throttle } from "lodash";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

const Store: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [isSortDropdownVisible, setSortDropdownVisible] =
    useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>("");
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(4);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();
  const { studentToken } = useSelector((state: RootState) => state.student);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 1000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  console.log("selected====>", selectedCategories);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await dispatch(
        studentFetchCourses({
          token: studentToken as string,
          limit,
          offset,
          searchTerm: debouncedSearchTerm,
          categories: selectedCategories,
          sort: sortOption,
        })
      ).unwrap();

      const coursesWithThumbnails = await Promise.all(
        response.courses.map(async (course: any) => ({
          ...course,
          thumbnail: await fetchThumbnailUrl(course.thumbnail),
        }))
      );

      if (coursesWithThumbnails.length > 0) {
        setItems((prev) => [
          ...prev,
          ...coursesWithThumbnails.filter(
            (course) => !prev.some((item) => item._id === course._id)
          ),
        ]);
        setHasMore(coursesWithThumbnails.length === limit);
      } else {
        setHasMore(false);
      }
      setCategories(response.categories.map((category: any) => category.name));
    } catch (error) {
      setError("Failed to fetch courses. Please try again.");
      console.error(error);
    }
    setIsLoading(false);
  }, [
    dispatch,
    studentToken,
    limit,
    offset,
    debouncedSearchTerm,
    selectedCategories,
    sortOption,
  ]);

  const fetchThumbnailUrl = useCallback(async (filename: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/course/get-presigned-url?filename=${filename}`
      );
      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error("Error fetching thumbnail URL:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleScroll = useCallback(
    throttle(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.scrollHeight - 5 &&
        hasMore &&
        !isLoading
      ) {
        setOffset((prev) => prev + limit);
      }
    }, 200),
    [hasMore, isLoading]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleCourseClick = (courseId: string) => {
    console.log(courseId);
    navigate(`/details/${courseId}`);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setSortDropdownVisible(false);
  };

  const filteredItems = useMemo(() => {
    return items
      .filter(
        (item) =>
          item.title
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) &&
          (selectedCategories.length === 0 ||
            selectedCategories.includes(item.category))
      )
      .sort((a, b) => {
        if (sortOption === "low-to-high") return a.price - b.price;
        if (sortOption === "high-to-low") return b.price - a.price;
        return 0;
      });
  }, [items, debouncedSearchTerm, selectedCategories, sortOption]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="store-header flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
        <form className="flex items-center max-w-sm w-full">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <input
              type="text"
              id="simple-search"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 shadow-sm"
              placeholder="Search course name..."
              value={searchTerm}
              onChange={handleSearchChange}
              required
            />
          </div>
        </form>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              className="text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 inline-flex items-center shadow"
              type="button"
              onClick={() => setDropdownVisible(!isDropdownVisible)}
            >
              Filter by category
              <svg
                className={`w-4 h-4 ml-2 transform transition-transform ${
                  isDropdownVisible ? "rotate-180" : "rotate-0"
                }`}
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownVisible && (
              <div className="absolute z-10 w-56 p-3 bg-white border border-gray-200 rounded-lg shadow-lg mt-2">
                <h6 className="mb-3 text-sm font-medium text-gray-900">
                  Category
                </h6>
                <ul className="space-y-2 text-sm">
                  {categories.map((category) => (
                    <li key={category} className="flex items-center">
                      <input
                        id={category}
                        type="checkbox"
                        value={category}
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={category}
                        className="ml-2 text-sm font-medium text-gray-700"
                      >
                        {category}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className="text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 inline-flex items-center shadow"
              type="button"
              onClick={() => setSortDropdownVisible(!isSortDropdownVisible)}
            >
              Sort by price
              <svg
                className={`w-4 h-4 ml-2 transform transition-transform ${
                  isSortDropdownVisible ? "rotate-180" : "rotate-0"
                }`}
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isSortDropdownVisible && (
              <div className="absolute z-10 w-48 p-2 bg-white border border-gray-200 rounded-lg shadow-lg mt-2">
                <button
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 w-full text-left"
                  onClick={() => handleSortChange("low-to-high")}
                >
                  Price: Low to High
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 w-full text-left"
                  onClick={() => handleSortChange("high-to-low")}
                >
                  Price: High to Low
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filtered Results */}
      <div className="p-4 mt-4 bg-white rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Results</h2>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {filteredItems.map((course) => (
              <CourseCard
                key={course._id}
                title={course.title}
                thumbnail={course.thumbnail}
                tutorName={course.tutor.name}
                image={course.tutor.image}
                lessonsCount={course.lessonsCount}
                price={course.price}
                category={course.category}
                originalPrice={course.price}
                duration={"10:00"}
                enrollments={course.enrollments}
                courseId={""}
                handleClick={() => handleCourseClick(course._id)}
              />
            ))}
          </div>
        ) : (
          <p></p>
        )}

        {isLoading && (
          <motion.div
            className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75"
            style={{ zIndex: 10 }}
          >
            <motion.div
              className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: "linear",
              }}
            />
          </motion.div>
        )}

        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default Store;
