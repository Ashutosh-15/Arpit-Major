import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { Search } from "lucide-react";

// Type definition for a single chat contact
type ChatContact = {
  userId: string;
  name: string;
  avatar?: string;
  bookingId: string;
  service?: string;
  lastUpdated?: string;
};

const ChatSidebar = () => {
  const { user } = useAuth();
  const { setSelectedChat, selectedChat } = useChat();
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user || !user.id) {
        console.log("User ID is not available");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`http://localhost:5000/api/chat/contacts/${user.id}`);

        if (Array.isArray(res.data)) {
          setContacts(res.data);
        } else {
          console.error("Contacts API did not return an array:", res.data);
          setContacts([]);
        }
      } catch (err) {
        console.error("Error fetching contacts:", err);
        setError("Failed to load contacts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [user]);

  const handleChatOpen = (contact: ChatContact) => {
    if (!contact.bookingId) {
      console.warn("Clicked contact has no bookingId:", contact);
      return;
    }

    //console.log("Opening chat with bookingId:", contact.bookingId);
    setSelectedChat(contact); // This makes it show on the right side
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.service?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full w-full flex flex-col gap-4 p-4 border-r overflow-y-auto">
      <h1 className="text-lg font-semibold">Chats</h1>

      <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search chat..."
          className="w-full outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading chats...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : filteredContacts.length > 0 ? (
        <div className="space-y-3">
          {filteredContacts.map((contact) => (
            <div
              key={contact.bookingId}
              onClick={() => handleChatOpen(contact)}
              className={`p-3 rounded-xl shadow hover:bg-gray-100 cursor-pointer transition ${
                selectedChat?.bookingId === contact.bookingId ? "bg-gray-200" : ""
              }`}
            >
              <p className="font-medium">{contact.name}</p>
              <p className="text-sm text-gray-500">{contact.service || "Service"}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No contacts available</div>
      )}
    </div>
  );
};

export default ChatSidebar;
