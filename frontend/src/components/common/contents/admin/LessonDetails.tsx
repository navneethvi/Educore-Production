import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import { adminFetchLessonDetails } from "../../../../redux/admin/adminActions";
import VideoPlayer from "../../VideoPlayer";
import { Tabs, Tab, Box } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DownloadIcon from "@mui/icons-material/Download";
import Skeleton from "react-loading-skeleton";
import { BASE_URL } from "../../../../utils/configs";

const LessonDetails: React.FC = () => {
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const { lessonIndex: initialLessonIndex, lessonLength, lessonTitle: initialLessonTitle, courseId: initialCourseId } =
    location.state || {};

  const [lessonDetails, setLessonDetails] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(initialLessonIndex);
  const [lessonTitle, setLessonTitle] = useState<string>(initialLessonTitle || "");
  const { adminToken, loading } = useSelector((state: RootState) => state.admin);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState<boolean>(false);

  // Fetch pre-signed URLs for downloads
  const fetchPresignedUrl = async (filename: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/course/get-presigned-url?filename=${filename}`
      );
      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error("Error fetching presigned URL:", error);
      return null;
    }
  };

  // Fetch lesson details whenever the selected lesson changes
  useEffect(() => {
    const fetchLessonDetails = async () => {
      if (initialCourseId != null && selectedLesson != null) {
        try {
          setIsLoadingLesson(true);
          setVideoUrl(null);  // Reset video URL when a new lesson is being fetched

          const response = await dispatch(
            adminFetchLessonDetails({
              token: adminToken as string,
              courseId: initialCourseId,
              lessonIndex: selectedLesson,
            })
          ).unwrap();

          setLessonDetails(response);  
          setLessonTitle(response.title);  

          // Fetch video URL
          if (response?.video) {
            const url = await fetchPresignedUrl(response.video);
            setVideoUrl(url);  // Set the video URL after fetching
          }

          setIsLoadingLesson(false);  // Stop the loading spinner
        } catch (error) {
          console.error("Failed to fetch lesson details:", error);
          setIsLoadingLesson(false);
        }
      }
    };
    fetchLessonDetails();
  }, [selectedLesson, initialCourseId, dispatch, adminToken]);

  // Handle tab change (Materials/Homework)
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle switching lessons
  const handleLessonClick = (index: number) => {
    setSelectedLesson(index);
  };

  const handleDownloadMaterials = async () => {
    const presignedUrl = await fetchPresignedUrl(lessonDetails?.materials);
    if (presignedUrl) {
      window.open(presignedUrl, "_blank");
    } else {
      console.error("Failed to fetch materials.");
    }
  };

  const handleDownloadHomeworks = async () => {
    try {
      const presignedUrl = await fetchPresignedUrl(lessonDetails?.homework);
  
      if (presignedUrl) {
        const response = await fetch(presignedUrl);
  
        if (!response.ok) {
          throw new Error("Failed to fetch the file.");
        }
  
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
  
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = "homework"; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        URL.revokeObjectURL(objectUrl);
      } else {
        console.error("Failed to fetch the pre-signed URL.");
      }
    } catch (error) {
      console.error("Error downloading homework:", error);
    }
  };

  // Video player options
  const videoJsOptions = {
    autoplay: true,
    controls: true,
    fluid: true,
    preload: "auto",
    playbackRates: [0.5, 1, 1.5, 2],
    aspectRatio: "16:9",
    controlBar: {
      volumePanel: { inline: false },
      pictureInPictureToggle: true,
      fullscreenToggle: true,
    },
    sources: videoUrl
      ? [
          {
            src: videoUrl,
            type: "video/mp4",
          },
        ]
      : [],
  };

  return (
    <div className="flex p-6">
      <div className="w-3/4 pr-6">
        <h1 className="text-2xl font-bold mb-4 mt-10">
          {isLoadingLesson ? (
            <Skeleton width={200} />
          ) : (
            `Lesson ${selectedLesson != null ? selectedLesson + 1 : initialLessonIndex + 1}: ${lessonTitle}`
          )}
        </h1>

        <div className="w-full h-[490px] rounded-lg overflow-hidden shadow-lg mb-6">
          {isLoadingLesson ? (
            <p>Loading video...</p>
          ) : videoUrl ? (
            <VideoPlayer videoJsOptions={videoJsOptions} />
          ) : (
            <p>No video available</p>
          )}
        </div>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Materials" />
            <Tab label="Homeworks" />
          </Tabs>
        </Box>

        <div className="mt-4">
          {tabValue === 0 && (
            <div>
              <p>Materials for this lesson:</p>
              <button
                type="button"
                onClick={handleDownloadMaterials}
                className="py-2.5 px-5 me-2 mb-2 mt-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-400 hover:bg-gray-100 hover:text-blue-700 flex items-center"
              >
                <DownloadIcon className="mr-2" /> Download Materials
              </button>
            </div>
          )}
          {tabValue === 1 && (
            <div>
              <p>Homework assignments:</p>
              <button
                type="button"
                onClick={handleDownloadHomeworks}
                className="py-2.5 px-5 me-2 mb-2 mt-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-400 hover:bg-gray-100 hover:text-blue-700 flex items-center"
              >
                <DownloadIcon className="mr-2" /> Download Homeworks
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="w-1/4 space-y-4">
        <div className="p-4 bg-white shadow-md rounded-md flex mt-32 justify-start items-center space-x-4">
          {loading ? (
            <Skeleton circle={true} height={64} width={64} />
          ) : (
            <img
              src={
                lessonDetails?.tutor_image || "https://via.placeholder.com/64"
              }
              alt={lessonDetails?.tutor_name || "Tutor"}
              className="w-10 h-10 object-cover rounded-full"
            />
          )}
          <p className="text-xl font-semibold">
            {loading ? (
              <Skeleton width={100} />
            ) : (
              lessonDetails?.tutor_name || "Tutor"
            )}
          </p>
        </div>

        <div className="bg-gray-100 p-9 rounded-lg justify-start">
          <h2 className="text-xl font-semibold mb-4">Other Lessons</h2>
          <div style={{ maxHeight: "360px", overflowY: "auto" }}>
            <ul className="space-y-2">
              {Array.from({ length: lessonLength }, (_, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => handleLessonClick(i)}
                    className={`w-full py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-400 hover:bg-gray-100 hover:text-blue-700 flex items-center transition duration-200 ease-in-out ${
                      selectedLesson === i ? "border-indigo-400 bg-indigo-200" : ""
                    }`}
                  >
                    <PlayArrowIcon className="mr-2" /> Lesson {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetails;
