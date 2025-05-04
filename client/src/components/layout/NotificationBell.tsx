import { Bell } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import socket from "../../utils/socket";
import { Link } from "react-router-dom";
import axios from "axios";

type Notification = {
  _id: string;
  type: string;
  message: string;
  isRead: boolean;
  relatedBookingId?: string;
  createdAt: string;
};

type Props = {
  user: any; // contains _id and userType
};

const NotificationBell: React.FC<Props> = ({ user }) => {
  console.log(user);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.isRead);

      await Promise.all(
        unreadNotifications.map((n) => {
          const endpoint =
            user.userType === "provider"
              ? `http://localhost:5000/api/notifications/provider/${n._id}/mark-read`
              : `http://localhost:5000/api/notifications/seeker/${n._id}/mark-read`;
          return axios.put(endpoint);
        })
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const endpoint =
        user.userType === "provider"
          ? `http://localhost:5000/api/notifications/provider/${user.id}`
          : `http://localhost:5000/api/notifications/seeker/${user.id}`;
      console.log(endpoint);
      const res = await axios.get(endpoint);
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const endpoint =
        user.userType === "provider"
          ? `http://localhost:5000/api/notifications/provider/${id}/mark-read`
          : `http://localhost:5000/api/notifications/seeker/${id}/mark-read`;

      await axios.put(endpoint);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    fetchNotifications();
    socket.emit("join", user.id);

    const handleNewNotification = (newNotification: Notification) => {
      setNotifications((prev) => [newNotification, ...prev]);
      setAnimate(true);
      playNotificationSound();
      setTimeout(() => setAnimate(false), 1000);
    };

    socket.on("receiveNotification", handleNewNotification);

    return () => {
      socket.off("receiveNotification", handleNewNotification);
    };
  }, [user]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const playNotificationSound = () => {
    const audio = new Audio("/sounds/notification.mp3");
    audio.play().catch((e) => console.error("Failed to play sound", e));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`relative text-gray-600 hover:text-blue-600 dark:text-gray-300 transition-transform ${
          animate ? "animate-bounce" : ""
        }`}
        onClick={handleToggle}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-md border bg-white shadow-lg dark:bg-gray-800 z-50">
          <div className="flex items-center justify-between p-2 font-semibold text-gray-700 dark:text-gray-100 border-b">
            Notifications
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={notifications.filter((n) => !n.isRead).length === 0}
                className={`text-xs ${
                  notifications.filter((n) => !n.isRead).length > 0
                    ? "text-blue-500 hover:underline"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                Mark all as read
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 dark:text-gray-300">
              No notifications
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all border-b cursor-pointer ${
                  n.isRead ? "text-gray-500" : "text-black font-medium"
                }`}
              >
                <Link
                  to={`/booking-details/${n.relatedBookingId}`}
                  onClick={() => {
                    markAsRead(n._id);
                    setIsOpen(false); // close the notification dropdown
                  }}
                >
                  {n.message}
                  <div className="text-xs text-gray-400 mt-1">
                    {formatTime(n.createdAt)}
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
