import { useRef, useEffect, useState } from "react";
import React from "react";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import Picker from "emoji-picker-react";
import ReceiverMessageBox from "./RecieverMessageBox";
import SenderMessageBox from "./SenderMessageBox";
import { motion } from "framer-motion";
import SendIcon from "@mui/icons-material/Send";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../utils/configs";
import socket from "../../utils/socket";
import { ExistingChat } from "../common/contents/tutor/Messages";
interface MessageSideProps {
  existingChats?: { _id: string; name: string; image: string }[];
  setExistingChats?: React.Dispatch<React.SetStateAction<ExistingChat[]>>;
  selectedStudent?: { name: string; image: string; _id: string } | null;
}

const MessageSide: React.FC<MessageSideProps> = ({
  existingChats = [],
  setExistingChats,
  selectedStudent,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    {
      id: string;
      messageBy: any;
      content: string;
      createdAt: string | number | Date;
      text: string;
      sender: string;
    }[]
  >([]);
  const [chatRoomId, setChatRoomId] = useState("");
  const [chatId, setChatId] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  // const [isTyping, setIsTyping] = useState(false);

  const { tutorToken, tutorData } = useSelector(
    (state: RootState) => state.tutor
  );
  const messageEndRef = useRef<null | HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  // console.log("existingCat=====?",existingChats);
  console.log("active userssss=?", activeUsers);

  useEffect(() => {
    if (selectedStudent) {
      const generatedChatId = [tutorData?._id, selectedStudent?._id]
        .filter(Boolean)
        .sort()
        .join("_");

      setChatId(generatedChatId);
      socket.emit("join-room", generatedChatId);

      const fetchChatHistory = async () => {
        try {
          const response = await fetch(`${BASE_URL}/chat/messages`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tutorToken}`,
            },
            body: JSON.stringify({
              tutorId: tutorData?._id,
              studentId: selectedStudent?._id,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log("response of fetch hostriy==>", data);
            setChatRoomId(data.messages.chatRoom._id);
            console.log("messages==>", data.messages.messages);

            setMessages(data.messages.messages || []);
          } else {
            console.error(
              "Failed to fetch chat history:",
              await response.text()
            );
            setMessages([]);
          }
        } catch (error) {
          console.error("Error fetching chat history:", error);
          setMessages([]);
        }
      };

      fetchChatHistory();
    }
  }, [selectedStudent, tutorData?._id, tutorToken]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleUpdateActiveUsers = (users: string[]) => {
      setActiveUsers(users);
    };

    socket.on("update-active-users", handleUpdateActiveUsers);

    return () => {
      socket.off("update-active-users", handleUpdateActiveUsers);
    };
  }, []);

  useEffect(() => {
    const handleReceiveMessage = (message: any) => {
      console.log("Received message:", message);

      if (!message.content || message.sender === tutorData?._id) {
        return;
      }

      setMessages((prevMessages) => {
        const isDuplicate = prevMessages.some(
          (msg) =>
            msg.createdAt === message.createdAt && msg.text === message.text
        );
        return isDuplicate ? prevMessages : [...prevMessages, message];
      });
    };

    socket.off("receive-message", handleReceiveMessage);
    socket.on("receive-message", handleReceiveMessage);
    return () => {
      // Cleanup to prevent memory leaks
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [chatId]);

  const sendMessageToChat = (chatId: string, roomId: string, text: string) => {
    if (!chatId || !text.trim() || !roomId) return;

    const messagePayload = { text, sender: "me" };
    console.log("Sending message:", {
      roomId: chatRoomId,
      chatId: chatId,
      message: text,
      sender: tutorData?._id,
    });
    socket.emit("send-message", {
      roomId: chatRoomId,
      chatId: chatId,
      message: text,
      sender: tutorData?._id,
      senderType: "Tutor",
    });

    // setMessages((prevMessages) => [...prevMessages, messagePayload]);
  };

  useEffect(() => {
    if (tutorData?._id) {
      socket.emit("user-active", tutorData._id);

      return () => {
        socket.emit("user-inactive", tutorData._id);
      };
    }
  }, [tutorData?._id]);

  // const handleTyping = (text: string, userId: string) => {
  //   setMessage(text);
  
  //   if (!isTyping && text.trim().length > 0) {
  //     setIsTyping(true);
  //     socket.emit("typing", chatId, userId); // Emit typing event with userId
  //   }
  
  //   if (text.trim().length === 0 && isTyping) {
  //     setIsTyping(false);
  //     socket.emit("stop-typing", chatId, userId); // Emit stop-typing event with userId
  //   }
  // };
  

  // useEffect(() => {
  //   const handleTypingNotification = ({ roomId, userId }: { roomId: string; userId: string }) => {
  //     if (roomId === chatId && userId !== tutorData?._id as string) {
  //       setIsTyping(true);
  //     }
  //   };
  
  //   const handleStopTypingNotification = ({ roomId, userId }: { roomId: string; userId: string }) => {
  //     if (roomId === chatId && userId !== tutorData?._id as string) {
  //       setIsTyping(false);
  //     }
  //   };
  
  //   socket.on("show-typing", handleTypingNotification);
  //   socket.on("hide-typing", handleStopTypingNotification);
  
  //   return () => {
  //     socket.off("show-typing", handleTypingNotification);
  //     socket.off("hide-typing", handleStopTypingNotification);
  //   };
  // }, [chatId, tutorData?._id]);
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !(pickerRef.current as any).contains(event.target)
      ) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendMessage = async () => {
    // Trim and validate input
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !chatId || !chatRoomId) {
      console.error(
        "Invalid input: Ensure message, chatId, and chatRoomId are set."
      );
      return;
    }

    // Create a new message object
    const newMessage = {
      id: `${Date.now()}_${Math.random()}`, // Add unique ID
      content: trimmedMessage,
      messageBy: { _id: tutorData?._id },
      createdAt: new Date().toISOString(),
      text: trimmedMessage,
      sender: "me",
    };

    // Optimistically update the UI
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");

    try {
      // Send message to the backend
      await sendMessageToChat(chatId, chatRoomId, trimmedMessage);
    } catch (error) {
      console.error("Failed to send message:", error);

      // Rollback optimistic UI update if sending fails
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== newMessage.id)
      );
    }
  };



  const onEmojiClick = (emoji: any) => {
    setMessage((prevMessage) => prevMessage + emoji.emoji);
    setShowPicker(false);
  };

  if (!selectedStudent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="text-center text-gray-500 flex-1 h-full bg-slate-200 rounded-xl flex flex-col justify-center items-center p-4"
      >
        <h3 className="text-lg font-bold bg-gradient-to-r from-violet-500 to-blue-600 bg-clip-text text-transparent">
          Welcome to Messages
        </h3>
        <p className="mt-2 w-78">
          Connect and collaborate! Start a conversation to resolve issues and
          share knowledge.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="message-side flex-1 h-full bg-slate-200 rounded-xl flex flex-col">
<div className="message-header flex items-center p-4 border-b border-gray-300">
  <div className="profile-container flex-shrink-0">
    <img
      src={selectedStudent?.image}
      alt="Profile"
      className="w-10 h-10 rounded-full"
    />
  </div>
  <div className="name ml-3 text-lg text-gray-800 font-reem-kufi">
    <div>{selectedStudent?.name}</div>
    {activeUsers.includes(selectedStudent?._id || "") && (
      <div className="active-status mt-0 text-green-500 text-xs font-medium">
        Active now
      </div>
    )}
  </div>
</div>




      <div className="message-screen flex-grow p-4 overflow-y-auto h-[400px] max-h-full">
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const isSender =
              msg.messageBy && msg.messageBy._id === tutorData?._id;

            return isSender ? (
              <SenderMessageBox
                key={index}
                message={msg.content || "No content available"}
                timestamp={
                  msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Unknown time"
                }
              />
            ) : (
              <ReceiverMessageBox
                key={index}
                message={msg.content || "No content available"}
                timestamp={
                  msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Unknown time"
                }
              />
            );
          })
        ) : (
          <div className="text-center text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        
       {/* {isTyping && (
  <div className="flex items-center space-x-2">
    <div className="flex-shrink-0">
      <img
        src= "https://avatars.githubusercontent.com/u/108149371?v=4"
        alt="Receiver's profile picture"
        className="w-6 h-6 rounded-full mr-0"
      />
    </div>
    <div className="inline-flex items-center bg-gradient-to-r from-violet-500 to-blue-600 rounded-2xl px-6 py-4 mt-2">
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
            style={{
              animationDelay: `${index * 0.15}s`,
              animationDuration: "0.8s",
            }}
          />
        ))}
      </div>
    </div>
  </div>
)} */}


        <div ref={messageEndRef} />
      </div>

      <div className="sending-options flex items-center p-2 border-t border-gray-300 bg-slate-200 rounded-xl relative">
        <div
          className="relative flex-shrink-0 mr-2"
          onClick={() => setShowPicker((prev) => !prev)}
        >
          <EmojiEmotionsOutlinedIcon
            style={{ fontSize: "24px", cursor: "pointer" }}
          />
          {showPicker && (
            <div className="absolute z-10 left-0 bottom-7">
              <Picker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
        <div className="relative w-full">
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              // handleTyping(e.target.value, tutorData?._id as string);
            }}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-full h-10 focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-12 shadow-sm placeholder-gray-500"
            placeholder="Type a message..."
          />
          <div
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
            onClick={handleSendMessage}
          >
            <SendIcon className="text-violet-500 hover:text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageSide;
