import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";

type MessageType = {
  _id?: string;
  bookingId: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt?: string;
};

type ChatBoxProps = {
  bookingId: string;
};

const ChatBox: React.FC<ChatBoxProps> = ({ bookingId }) => {

  console.log(bookingId);
  const { user } = useAuth();
  const { socket } = useChat();

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverId, setReceiverId] = useState<string | undefined>(undefined);
  const [isChatDisabled, setIsChatDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentUserId = user?.id;

  // Fetch all messages and booking data
  useEffect(() => {
    const fetchChatData = async () => {
      if (!bookingId || !user?.userType) return;

      try {
        const [msgRes, bookingRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/chat/${bookingId}`),
          axios.get(`http://localhost:5000/api/bookings/${bookingId}`),
        ]);

        setMessages(msgRes.data);

        const booking = bookingRes.data;

        if (user.userType === "seeker") {
          setReceiverId(booking.providerId._id || booking.providerId);
        } else {
          setReceiverId(booking.seekerId._id || booking.seekerId);
        }

        if (booking.status === "completed") {
          setIsChatDisabled(true);
        }
      } catch (err) {
        console.error("Error loading chat data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatData();
  }, [bookingId, user]);

  // Socket join & receive messages
  useEffect(() => {
    if (!socket || !currentUserId) return;

    socket.emit("join", currentUserId);

    const handleReceive = (msg: MessageType) => {
      if (msg.bookingId === bookingId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, [socket, bookingId, currentUserId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    const chatContainer = document.querySelector(".chat-scroll");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !receiverId || !currentUserId || isChatDisabled) return;

    const msgPayload: MessageType = {
      bookingId: bookingId!,
      senderId: currentUserId,
      receiverId,
      message: newMessage,
    };

    socket?.emit("sendMessage", msgPayload);

    try {
      await axios.post("http://localhost:5000/api/chat/send", msgPayload);
    } catch (err) {
      console.error("❌ Error saving message:", err);
    }

    setMessages((prev) => [...prev, msgPayload]);
    setNewMessage("");
  };

  if (!bookingId) {
    return (
      <div className="text-red-500 text-center mt-8">
        Error: Booking ID is undefined.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Loading chat...
      </div>
    );
  }

 

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="h-96 overflow-y-auto bg-white border p-4 rounded-lg mb-4 chat-scroll">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-2 rounded-lg w-fit max-w-xs ${
              msg.senderId === currentUserId
                ? "bg-blue-100 ml-auto"
                : "bg-gray-200"
            }`}
          >
            <div>{msg.message}</div>
            {msg.createdAt && (
              <div className="text-xs text-gray-500 text-right mt-1">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {!isChatDisabled ? (
        <div className="flex">
          <input
            type="text"
            className="flex-1 border px-4 py-2 rounded-l-lg"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      ) : (
        <div className="mt-2 text-red-500 text-center">
          Chat is closed because the booking is completed.
        </div>
      )}
    </div>
  );
};

export default ChatBox;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useChat } from "../../context/ChatContext";
// import { useAuth } from "../../context/AuthContext";

// type MessageType = {
//   _id?: string;
//   bookingId: string;
//   senderId: string;
//   receiverId: string;
//   message: string;
//   createdAt?: string;
// };

// type ChatBoxProps = {
//   bookingId: string;
//   receiver: any;
// };

// const ChatBox: React.FC<ChatBoxProps> = ({ bookingId, receiver }) => {
//   const { user } = useAuth();
//   const { socket } = useChat();

//   const [messages, setMessages] = useState<MessageType[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [receiverId, setReceiverId] = useState<string>(receiver?._id || "");
//   const [isChatDisabled, setIsChatDisabled] = useState(false);

//   const currentUserId = user?.id;

//   // Fetch messages
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/chat/${bookingId}`);
//         setMessages(res.data);
//       } catch (err) {
//         console.error("Error fetching messages:", err);
//       }
//     };

//     fetchMessages();
//   }, [bookingId]);

//   // Fetch booking to validate status (for disabling chat if completed)
//   useEffect(() => {
//     const fetchBooking = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/bookings/${bookingId}`);
//         const booking = res.data;

//         if (user?.userType === "seeker") {
//           setReceiverId(booking.providerId._id || booking.providerId);
//         } else {
//           setReceiverId(booking.seekerId._id || booking.seekerId);
//         }

//         if (booking.status === "completed") {
//           setIsChatDisabled(true);
//         }
//       } catch (err) {
//         console.error("Error fetching booking data:", err);
//       }
//     };

//     if (bookingId && user?.userType) {
//       fetchBooking();
//     }
//   }, [bookingId, user]);

//   // Join room & listen for incoming messages
//   useEffect(() => {
//     if (!socket || !currentUserId) return;

//     socket.emit("join", currentUserId);

//     socket.on("receiveMessage", (msg: MessageType) => {
//       if (msg.bookingId === bookingId) {
//         setMessages((prev) => [...prev, msg]);
//       }
//     });

//     return () => {
//       socket.off("receiveMessage");
//     };
//   }, [socket, bookingId, currentUserId]);

//   // Scroll to bottom on new message
//   useEffect(() => {
//     const chatContainer = document.querySelector(".chat-scroll");
//     if (chatContainer) {
//       chatContainer.scrollTop = chatContainer.scrollHeight;
//     }
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!newMessage.trim() || !receiverId || isChatDisabled) return;

//     const msgPayload: MessageType = {
//       bookingId,
//       senderId: currentUserId!,
//       receiverId,
//       message: newMessage,
//     };

//     socket?.emit("sendMessage", msgPayload);

//     try {
//       await axios.post("http://localhost:5000/api/chat/send", msgPayload);
//     } catch (err) {
//       console.error("❌ Error saving message:", err);
//     }

//     setMessages((prev) => [...prev, msgPayload]);
//     setNewMessage("");
//   };

//   return (
//     <div className="p-4 h-full flex flex-col justify-between border rounded-lg bg-white">
//       <div className="overflow-y-auto h-full chat-scroll pr-2">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`mb-2 p-2 rounded-lg w-fit max-w-xs ${
//               msg.senderId === currentUserId
//                 ? "bg-blue-100 ml-auto"
//                 : "bg-gray-200"
//             }`}
//           >
//             <div>{msg.message}</div>
//             {msg.createdAt && (
//               <div className="text-xs text-gray-500 text-right mt-1">
//                 {new Date(msg.createdAt).toLocaleTimeString()}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {!isChatDisabled ? (
//         <div className="flex mt-4">
//           <input
//             type="text"
//             className="flex-1 border px-4 py-2 rounded-l-lg"
//             placeholder="Type your message..."
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//           />
//           <button
//             className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
//             onClick={sendMessage}
//           >
//             Send
//           </button>
//         </div>
//       ) : (
//         <div className="mt-2 text-red-500 text-center">
//           Chat is closed because the booking is completed.
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatBox;
