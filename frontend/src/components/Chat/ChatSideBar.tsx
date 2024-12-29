import React, { useState } from "react";
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";
import ProfileBox from "./ProfileBox";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { ExistingChat } from "../common/contents/student/Messages";

interface ChatSideProps {
  tutorInfo?: { name: string; image: string; _id: string };
  existingChats?: ExistingChat[];
  onTutorSelect: (selectedTutor: {
    name: string;
    image: string;
    _id: string;
  }) => void;
}

const ChatSideBar: React.FC<ChatSideProps> = ({
  tutorInfo,
  existingChats = [],
  onTutorSelect,
}) => {
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<
    number | null
  >(null);

  const { studentToken, studentData } = useSelector(
    (state: RootState) => state.student
  );

  const handleProfileClick = (
    index: number,
    selectedTutor: { name: string; image: string; _id: string }
  ) => {
    setSelectedProfileIndex(index);
    onTutorSelect(selectedTutor);
    
  };

  const hasChats = Array.isArray(existingChats) && existingChats.length > 0;

  return (
    <div className="border h-full w-full md:w-72 flex flex-col bg-gray-100">
      <div className="p-4 border-b">
        <SearchBar />
      </div>

      <div className="flex-grow overflow-y-auto p-2 space-y-2 max-h-screen">
        {!hasChats && !tutorInfo?.name && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-500 mt-2"
          >
            <p className="text-sm font-semibold">No messages yet</p>
          </motion.div>
        )}

        {tutorInfo && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleProfileClick(0, tutorInfo)}
          >
            <ProfileBox
              isSelected={selectedProfileIndex === 0}
              tutorInfo={tutorInfo}
            />
          </motion.div>
        )}

        {hasChats &&
          existingChats.map((chat, index) => {
            const otherMember = Array.isArray(chat.chatMembers)
              ? chat.chatMembers.find(
                  (member) => member._id !== studentData?._id
                )
              : null;

            return otherMember ? (
              <motion.div
                key={chat._id}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() =>
                  handleProfileClick(index, {
                    name: otherMember.name,
                    image: otherMember.image,
                    _id: otherMember._id,
                  })
                }
              >
                <ProfileBox
                  isSelected={selectedProfileIndex === index}
                  tutorInfo={{
                    name: otherMember.name,
                    image: otherMember.image,
                    _id: otherMember._id,
                    
                  }}
                  lastMessage={chat.lastMessage}
                />
              </motion.div>
            ) : null;
          })}
      </div>
    </div>
  );
};

export default ChatSideBar;
