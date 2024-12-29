import { useRef, useEffect } from "react";
import React, { useState } from "react";
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
import { Player } from "@lottiefiles/react-lottie-player";

interface MessageSideProps {
  tutorInfo?: { name: string; image: string; tutorId: string };
  existingChats?: { _id: string | undefined; name: string; image: string }[];
  setExistingChats?: React.Dispatch<React.SetStateAction<any[]>>; 
  selectedTutor?: { name: string; image: string; _id: string } | null;
}

const MessageSide: React.FC<MessageSideProps> = ({
  tutorInfo,
  existingChats = [],
  setExistingChats,
  selectedTutor,
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
  const [chatId, setChatId] = useState("");
  const [chatRoomId, setChatRoomId] = useState("");
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  // const [isTyping, setIsTyping] = useState(false);

  const [showPicker, setShowPicker] = useState(false);

  const { studentToken, studentData } = useSelector(
    (state: RootState) => state.student
  );

  const messageEndRef = useRef<null | HTMLDivElement>(null);

  // Fetch Messages for a specific Chat ID
  const fetchMessages = async () => {
    try {
      const response = await fetch(`${BASE_URL}/chat/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({
          studentId: studentData?._id,
          tutorId: selectedTutor?._id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setChatRoomId(data.messages.chatRoom._id);
        setMessages(data.messages.messages || []);
      } else {
        console.error("Failed to fetch messages:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (tutorInfo || selectedTutor) {
      const generatedChatId = [
        studentData?._id,
        tutorInfo?.tutorId || selectedTutor?._id,
      ]
        .filter(Boolean)
        .sort()
        .join("_");

      setChatId(generatedChatId);
      socket.emit("join-room", generatedChatId);
    }
  }, [tutorInfo, selectedTutor, studentData?._id]);

  // Fetch messages when chatId changes
  useEffect(() => {
    if (selectedTutor) {
      fetchMessages();
    }
  }, [chatId]);

  // Scroll to the latest message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleReceiveMessage = (message: any) => {
      console.log("Received message:", message);

      if (!message.content || message.sender === studentData?._id) {
        return;
      }

      setMessages((prevMessages) => {
        const isDuplicate = prevMessages.some(
          (msg) =>
            msg.createdAt === message.createdAt &&
            msg.content === message.content
          // msg.sender === message.sender
        );
        if (!isDuplicate) {
          return [...prevMessages, message];
        }
        return prevMessages;
      });
    };

    socket.off("receive-message", handleReceiveMessage);
    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [chatId]); // Add chatId to ensure listener changes when chatId changes

  console.log("active userssss=?", activeUsers);

  const sendMessage = (chatId: string, roomId: string, text: string) => {
    if (!chatId || !text.trim() || !roomId) return;

    const messagePayload = { text, sender: "me" };
    console.log("Sending message:", {
      roomId: roomId,
      chatId: chatId,
      message: text,
      sender: studentData?._id,
    });
    socket.emit("send-message", {
      roomId: roomId,
      chatId: chatId,
      message: text,
      sender: studentData?._id,
      senderType: "Student",
    });

    // setMessages((prevMessages) => [...prevMessages, messagePayload]);
  };

  const sendMessageToChat = async (text: string, currentChatRoomId: string) => {
    console.log("Function `sendMessageToChat` called with text:", text);

    console.log(
      "chatId==>",
      chatId,
      "text==>",
      text,
      "chatRoomId==>",
      currentChatRoomId
    );

    if (!chatId || !text.trim() || !currentChatRoomId) {
      console.warn(
        "Missing required parameters. Check chatId, chatRoomId, and text."
      );
      return;
    }

    const trimmedMessage = text.trim();
    console.log("Trimmed message:", trimmedMessage);

    if (!trimmedMessage || !chatId || !currentChatRoomId) {
      console.error(
        "Invalid input: Ensure message, chatId, and chatRoomId are set.",
        { chatId, currentChatRoomId, message: trimmedMessage }
      );
      return;
    }

    const tempId = `${Date.now()}_${Math.random()}`;
    console.log("Generated temporary ID:", tempId);

    const newMessage = {
      id: tempId,
      content: trimmedMessage,
      messageBy: { _id: studentData?._id },
      createdAt: new Date().toISOString(),
      text: trimmedMessage,
      sender: studentData?._id,
    };

    console.log("New message object created:", newMessage);

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage];
      console.log("Updated messages state with new message:", updatedMessages);
      return updatedMessages;
    });

    setMessage("");
    console.log("Message input cleared.");

    try {
      console.log(
        `Attempting to send message to chat. chatId: ${chatId}, chatRoomId: ${chatRoomId}, message: ${trimmedMessage}`
      );
      await sendMessage(chatId, currentChatRoomId, trimmedMessage);
      console.log("Message sent successfully.");
    } catch (error) {
      console.error("Failed to send message:", error);

      setMessages((prevMessages) => {
        const filteredMessages = prevMessages.filter(
          (msg) => msg.id !== newMessage.id
        );
        console.log(
          "Message sending failed. Removing temporary message from state:",
          filteredMessages
        );
        return filteredMessages;
      });
    }
  };

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
    if (studentData?._id) {
      socket.emit("user-active", studentData._id);

      return () => {
        socket.emit("user-inactive", studentData._id); // Emit inactive on unmount
      };
    }
  }, [studentData?._id]);

  // const handleTyping = (text: string) => {
  //   setMessage(text);
  
  //   if (!isTyping && text.trim().length > 0) {
  //     setIsTyping(true);
  //     socket.emit("typing", chatId, studentData?._id); // Emit typing event
  //   }
  
  //   if (text.trim().length === 0 && isTyping) {
  //     setIsTyping(false);
  //     socket.emit("stop-typing", chatId, studentData?._id); // Emit stop-typing event
  //   }
  // };
  

  // useEffect(() => {
  //   const handleTypingNotification = ({ roomId, userId }: { roomId: string; userId: string }) => {
  //     if (roomId === chatId && userId !== studentData._id) {
  //       setIsTyping(true); // Only set typing state if the notification is from another user
  //       console.log(`User ${userId} is typing in room ${roomId}`);
  //     }
  //   };
  
  //   const handleStopTypingNotification = ({ roomId, userId }: { roomId: string; userId: string }) => {
  //     if (roomId === chatId && userId !== studentData._id) {
  //       setIsTyping(false); // Only clear typing state if the notification is from another user
  //       console.log(`User ${userId} stopped typing in room ${roomId}`);
  //     }
  //   };
  
  //   // Listen for typing events
  //   socket.on("show-typing", handleTypingNotification);
  //   socket.on("hide-typing", handleStopTypingNotification);
  
  //   return () => {
  //     // Cleanup listeners
  //     socket.off("show-typing", handleTypingNotification);
  //     socket.off("hide-typing", handleStopTypingNotification);
  //   };
  // }, [chatId, studentData._id]);
  
  

  const handleSendMessage = async () => {
    if (!message.trim()) {
      console.warn("Message is empty. Aborting send.");
      return;
    }

    try {
      console.log("Starting handleSendMessage...");
      console.log("Current chatRoomId:", chatRoomId);

      // Check if the chat already exists
      let newChatRoomId = chatRoomId;
      if (!newChatRoomId) {
        console.log("No existing chatRoomId. Creating a new chat...");

        // Create a new chat if it doesn't exist
        const response = await fetch(`${BASE_URL}/chat/create-chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${studentToken}`,
          },
          body: JSON.stringify({
            chatMembers: [studentData._id, tutorInfo?.tutorId],
            chatMemberModel: ["Student", "Tutor"],
          }),
        });

        if (!response.ok) {
          console.error("Failed to create chat:", response.statusText);
          return;
        }

        const data = await response.json();
        console.log("Chat created successfully. Data:", data);

        // Generate chatId using chatMembers
        const generatedChatId = `${data.chatMembers[0]}_${data.chatMembers[1]}`;
        console.log("Generated chatId:", generatedChatId);

        setChatId(generatedChatId);

        newChatRoomId = data._id;
        setChatId(generatedChatId);
        setChatRoomId(data._id); // State updates are asynchronous
        console.log("New chatRoomId (local variable):", newChatRoomId);
        setChatRoomId(newChatRoomId);

        // Update existing chats if a setter is provided
        if (setExistingChats) {
          console.log("Updating existing chats...");
          setExistingChats((prevChats) => {
            if (!prevChats.find((chat) => chat._id === data._id)) {
              return [...prevChats, data];
            }
            return prevChats;
          });
        }
      }

      // Send the message to the newly created or existing chat
      console.log("Sending message to chatRoomId:", newChatRoomId);
      sendMessageToChat(message, newChatRoomId);
      console.log("Message sent successfully:", message);

      // Clear the message input
      setMessage("");
    } catch (error) {
      console.error("Error creating chat or sending message:", error);
    }
  };

  const onEmojiClick = (emoji: any) => {
    setMessage((prevMessage) => prevMessage + emoji.emoji);
    setShowPicker(false);
  };
  if (!tutorInfo && !selectedTutor) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex flex-col justify-center items-center h-full bg-slate-200 rounded-xl text-center p-6"
      >
        {/* Heading */}
        <h3 className="text-lg font-bold bg-gradient-to-r from-violet-500 to-blue-600 bg-clip-text text-transparent mt-4">
          Welcome to Messages
        </h3>

        {/* Subheading */}
        <p className="mt-2 text-gray-600 max-w-md">
          Connect and collaborate! Start a conversation to resolve issues and
          share knowledge.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="message-side flex-1 h-full bg-slate-200 rounded-xl flex flex-col">
      {/* Message Header */}
      <div className="message-header flex items-center p-4 border-b border-gray-300">
  <div className="profile-container flex-shrink-0">
    <img
      src={tutorInfo?.image || selectedTutor?.image}
      alt="Profile"
      className="w-10 h-10 rounded-full"
    />
  </div>
  <div className="name ml-3 text-lg text-gray-800 font-reem-kufi">
    {tutorInfo?.name || selectedTutor?.name}
    {activeUsers.includes(
      selectedTutor?._id || tutorInfo?.tutorId || ""
    ) && (
      <div className="active-status mt-0 text-green-500 text-xs font-medium">
        Active now
      </div>
    )}
  </div>
</div>


      {/* Message Screen */}
      <div className="message-screen flex-grow p-4 overflow-y-auto h-[400px] max-h-full">
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const isSender =
              msg.messageBy && msg.messageBy?._id !== studentData?._id;

            return !isSender ? (
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
{/* )} */}
        <div ref={messageEndRef} />
      </div>

      {/* Sending Options */}
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
            id="message-input"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              // handleTyping(e.target.value);
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
