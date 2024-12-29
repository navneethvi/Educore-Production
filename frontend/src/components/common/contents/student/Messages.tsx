import React, { useEffect, useState } from "react";
import ChatSideBar from "../../../Chat/ChatSideBar";
import MessageSide from "../../../Chat/MessageSide";
import { useNavigate, useLocation } from "react-router-dom";
import {
  studentGetTutorInfo,
  getUsersWithExistingChat,
} from "../../../../redux/students/studentActions";
import { setExistingChats } from "../../../../redux/students/studentSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import socket from "../../../../utils/socket";

interface TutorInfo {
  name: string;
  image: string;
  _id: string;
}

interface ChatMember {
  name: string;
  image: string;
  _id: string;
}

export interface ExistingChat {
  name: string;
  image: string;
  chatMembers: ChatMember[];
  lastMessage: string;
  lastMessageAt: string;
  _id: string;
}

const Messages: React.FC = () => {
  const [tutorInfo, setTutorInfo] = useState<TutorInfo | null>(null);
  const [selectedTutor, setSelectedTutor] = useState<{
    name: string;
    image: string;
    _id: string;
  } | null>(null);
  const [existingChats, setExistingChats] = useState<ExistingChat[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const { tutorId } = location.state || {};
  const { studentToken, studentData } = useSelector(
    (state: RootState) => state.student
  );
  const dispatch: AppDispatch = useDispatch();

  const handleTutorSelect = (tutor: {
    name: string;
    image: string;
    _id: string;
  }) => {
    setSelectedTutor(tutor);
    setTutorInfo(null); // Clear tutorInfo to avoid conflicts
  };

  console.log("selectedTutor=====>", selectedTutor);

  useEffect(() => {
    const fetchExistingChats = async () => {
      try {
        const response = await dispatch(
          getUsersWithExistingChat({
            token: studentToken as string,
            userId: studentData._id,
            userType: "Student",
          })
        );
        console.log("Raw API Response:", response.payload);
        setExistingChats(response.payload.chats); // Cast to correct type
      } catch (error) {
        console.error("Failed to fetch existing chats:", error);
      }
    };

    fetchExistingChats();
  }, [dispatch, studentToken]);
  console.log("existingChatsunni========>", existingChats);

  useEffect(() => {
    if (!tutorId) {
      console.warn("No tutorId provided. Skipping fetch.");
      return;
    }
  
    // Check if the tutor already exists in existingChats
    const chatExists = existingChats.some((chat) =>
      chat.chatMembers.some((member) => member._id === tutorId)
    );
  
    if (chatExists) {
      console.log("Chat with this tutor already exists. Skipping fetch.");
      setTutorInfo(null)
      navigate("/messages");  // Navigate to the existing chat page
      return;
    }


  
    const fetchTutorInfo = async () => {
      try {
        const response = await dispatch(
          studentGetTutorInfo({ token: studentToken as string, tutorId })
        );
        console.log("tutorInfo fetched=====>", response.payload);
        setTutorInfo(response.payload);
      } catch (error) {
        console.error("Failed to fetch tutor info:", error);
      }
    };
  
    fetchTutorInfo();
  }, [dispatch, tutorId, studentToken, existingChats]);
  

  console.log("existing Chat=====>", existingChats);

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="w-full md:w-1/4 min-w-[200px]">
        <ChatSideBar
          tutorInfo={{
            name: tutorInfo?.name as string,
            image: tutorInfo?.image as string,
            _id: tutorInfo?._id as string,
          }}
          existingChats={existingChats}
          onTutorSelect={handleTutorSelect}
        />
      </div>
      <div className="flex-1 w-full">
        {tutorInfo || selectedTutor ? (
          <MessageSide
            tutorInfo={{
              name: tutorInfo?.name ?? selectedTutor?.name ?? "", // Use selectedTutor if tutorInfo is undefined
              image: tutorInfo?.image ?? selectedTutor?.image ?? "", // Same for image
              tutorId: tutorInfo?._id ?? selectedTutor?._id ?? "", // Same for tutorId
            }}
            existingChats={existingChats.map((chat) => ({
              _id: chat._id as string,
              name: chat?.name || "Unknown", // Provide default "Unknown" if name is missing
              image: chat?.image || "", // Default image if missing
            }))}
            setExistingChats={setExistingChats}
            selectedTutor={selectedTutor}
          />
        ) : (
          <MessageSide />
        )}
      </div>
    </div>
  );
};

export default Messages;
