import React, { useEffect, useState } from "react";
import ChatSideBar from "../../../Chat/TutorChatSideBar";
import { useDispatch, useSelector } from "react-redux";
import { getUsersWithExistingChat } from "../../../../redux/students/studentActions";
import { AppDispatch, RootState } from "../../../../store/store";
import socket from "../../../../utils/socket";
import MessageSide from "../../../Chat/TutorMessageSide";

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
  chatMembers: ChatMember[];
  _id: string;
}
const TutorMessages: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<{
    name: string;
    image: string;
    _id: string;
  } | null>(null);
  const [existingChats, setExistingChats] = useState<ExistingChat[]>([]);

  const { tutorToken, tutorData } = useSelector(
    (state: RootState) => state.tutor
  );
  const dispatch: AppDispatch = useDispatch();

  const handleStudentSelect = (student: {
    name: string;
    image: string;
    _id: string;
  }) => {
    setSelectedStudent(student);
  };

  useEffect(() => {
    const fetchExistingChats = async () => {
      try {
        const response = await dispatch(
          getUsersWithExistingChat({
            token: tutorToken as string,
            userId: tutorData?._id as string,
            userType: "Tutor",
          })
        );
        setExistingChats(response.payload.chats as ExistingChat[]);
        console.log("Fetched existing chats for tutor:", response.payload); // Check the response structure
      } catch (error) {
        console.error("Failed to fetch existing chats:", error);
      }
    };

    fetchExistingChats();
  }, [dispatch, tutorToken]);

  console.log("existing Chat=====>", existingChats);

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="w-full md:w-1/4 min-w-[200px]">
        <ChatSideBar
       
          existingChats={existingChats}
          onStudentSelect={handleStudentSelect}
        />
      </div>
      <div className="flex-1 w-full">
        {selectedStudent ? (
          <MessageSide
      
          selectedStudent={selectedStudent}
          existingChats={existingChats.map((chat) => ({
            _id: chat._id,
            name: chat.chatMembers[0]?.name || "Unknown",
            image: chat.chatMembers[0]?.image || "",
          }))}
          setExistingChats={setExistingChats}
        />
        ):(
          <MessageSide/>
        )}
      </div>
    </div>
  );
};

export default TutorMessages;
