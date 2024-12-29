import { io } from "socket.io-client";


const socket = io("wss://educore.live", {
  transports: ["websocket"],
  path: "/chat-socket/socket.io", 
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on('connect', () => {
  console.log('WebSocket connected');
});

socket.on('disconnect', () => {
  console.log('WebSocket disconnected');
});

export default socket;
