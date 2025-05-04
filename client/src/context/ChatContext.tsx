// // src/context/chatcontext.tsx
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { io, Socket } from 'socket.io-client';

// type ChatContextType = {
//   socket: Socket | null;
// };

// const ChatContext = createContext<ChatContextType>({ socket: null });

// export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [socket, setSocket] = useState<Socket | null>(null);

//   useEffect(() => {
//     const newSocket = io('http://localhost:5000'); // Replace with your backend URL
//     setSocket(newSocket);

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   return <ChatContext.Provider value={{ socket }}>{children}</ChatContext.Provider>;
// };

// export const useChat = () => useContext(ChatContext);


// src/context/ChatContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Define the type for the chat contact
type ChatContact = {
  userId: string;
  name: string;
  avatar?: string;
  bookingId: string;
  service?: string;
  lastUpdated?: string;
};

// Extend ChatContextType
type ChatContextType = {
  socket: Socket | null;
  selectedChat: ChatContact | null;
  setSelectedChat: (chat: ChatContact | null) => void;
  selectedBookingId: string | null;
};

const ChatContext = createContext<ChatContextType>({
  socket: null,
  selectedChat: null,
  setSelectedChat: () => {},
  selectedBookingId: null,
});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatContact | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000"); // Assuming your backend is running on localhost:5000
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{
        socket,
        selectedChat,
        setSelectedChat,
        selectedBookingId: selectedChat?.bookingId || null, // Pass the bookingId if selectedChat exists
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
