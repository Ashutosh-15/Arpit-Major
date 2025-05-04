// import React, { useEffect } from "react";
// import ChatSidebar from "./ChatSidebar";
// import ChatBox from "./ChatBox";
// import { useAuth } from "../../context/AuthContext";
// import { useChat } from "../../context/ChatContext";

// const ChatPage = () => {
//   const { user } = useAuth();
//   const { selectedChat, socket } = useChat();
//   console.log("this chat is sselected",selectedChat);
//   // Join the socket room when the user is authenticated
//   useEffect(() => {
//     if (user?._id && socket) {
//       socket.emit("join", user._id);
//     }
//   }, [user, socket]);

//   return (
//     <div className="flex h-[calc(100vh-60px)] bg-background text-foreground">
//       {/* Sidebar */}
//       <div className="w-1/3 min-w-[250px] max-w-[350px] border-r border-border p-4">
//         <ChatSidebar />
//       </div>

//       {/* Main chat area */}
//       <div className="flex-1 p-4">
//         {selectedChat ? (
//           <ChatBox bookingId={selectedChat.bookingId}/>
//         ) : (
//           <div className="h-full flex items-center justify-center text-muted-foreground">
//             Select a chat from the left to begin messaging.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatPage;








import React, { useEffect } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatBox from "./ChatBox";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";

const ChatPage = () => {
  const { user } = useAuth();
  const { selectedChat, socket } = useChat();

  useEffect(() => {
    if (user?._id && socket) {
      socket.emit("join", user._id);
    }
  }, [user, socket]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r dark:border-gray-700">
          <div className="h-full overflow-y-auto">
            <ChatSidebar />
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header (optional you can add here later) */}

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4">
            {selectedChat ? (
              <ChatBox bookingId={selectedChat.bookingId} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                Select a chat from the left to begin messaging.
              </div>
            )}
          </div>

          {/* Message input (optional you can add fixed input here later) */}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
