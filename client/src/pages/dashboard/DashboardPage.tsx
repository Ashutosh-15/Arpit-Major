import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProviderDashboard } from "./ProviderDashboard";
import { SeekerDashboard } from "./SeekerDashboard";
import { Button } from "../../components/ui/Button";
import { MessageCircle } from "lucide-react";
import axios from "axios";
import socket from "../../utils/socket"; // adjust path if needed
import ChatBox from "../chat/ChatBox";
export function DashboardPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [showConfirmReject, setShowConfirmReject] = useState(false);
  const [rejectBookingId, setRejectBookingId] = useState<string | null>(null);
  const [showchat, setShowChat] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/bookings/${id}/status`,
        { status }
      );
      // Optional: show toast or update UI immediately
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id ? { ...booking, status } : booking
        )
      );
    } catch (error) {
      console.error("Failed to update booking status:", error);
    }
  };
  const toChat = (bookingid: any) => {
    console.log(bookingid);
    setBookingId(bookingid);
    setShowChat(true);
  };
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUserType = localStorage.getItem("userType");

    if (!storedUserId || !storedUserType) {
      navigate("/login");
      return;
    }
    // ✅ Connect socket manually since autoConnect is false
    if (!socket.connected) {
      socket.connect();
    }

    // ✅ Emit 'join' event with userId (after connect)
    socket.on("connect", () => {
      console.log("🟢 Connected to socket:", socket.id);
      socket.emit("join", storedUserId);
    });

    // ✅ Listen for incoming real-time booking updates
    socket.on("new-booking", (bookingData: any) => {
      console.log("📢 New booking received:", bookingData);
      setBookings((prev) => [bookingData, ...prev]);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    const fetchProviderBookings = async () => {
      try {
        // console.log(userData._id);
        const providerId = storedUserId;
        const res = await axios.get(
          `http://localhost:5000/api/bookings/provider/${providerId}`
        );

        setBookings(res.data);
      } catch (error) {
        console.error("Error fetching provider bookings:", error);
      }
    };
    const fetchUserDataAndBookings = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/profile/${storedUserType}/${storedUserId}`
        );
        const data = await res.json();
        setUserData({ ...data, userType: storedUserType });

        if (storedUserType === "seeker") {
          const bookingsRes = await fetch(
            `http://localhost:5000/api/bookings/seeker/${storedUserId}`
          );
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData);
        }
        if (storedUserType === "provider") {
          fetchProviderBookings();
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        navigate("/login");
      }
    };

    fetchUserDataAndBookings();

    return () => {
      socket.off("new-booking");
      socket.disconnect();
      console.log("Socket disconnected.");
    };
  }, [navigate]);

  if (!userData)
    return <div className="text-center mt-10">Loading dashboard...</div>;

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <Sidebar userData={userData} />

          {/* Main */}
          <div className="flex-1">
            {userData.userType === "provider" ? (
              <ProviderDashboard userData={userData} />
            ) : (
              <SeekerDashboard userData={userData} />
            )}

            {/* Shared: Recent Bookings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">
                Recent Bookings
              </h2>
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-300">
                    No bookings yet.
                  </p>
                ) : (
                  [...bookings]
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )
                    .slice(0, 3)
                    .map((booking) => (
                      <div
                        key={booking._id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center">
                          <img
                            src={`https://i.pravatar.cc/40?u=${
                              booking.providerId?._id || "user"
                            }`}
                            alt="User"
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="ml-4">
                            <h3 className="font-semibold dark:text-white">
                              {booking.services?.join(", ") || "Service"}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {new Date(booking.date).toLocaleDateString()} at{" "}
                              {booking.timeSlot}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {userData.userType === "provider"
                                ? `Requested by: ${
                                    booking.seekerId?.name ||
                                    booking.seekerName ||
                                    "Seeker"
                                  }`
                                : `Provider: ${
                                    booking.providerId?.name ||
                                    booking.providerName ||
                                    "Provider"
                                  }`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {userData.userType === "provider" ? (
                            booking.status === "Pending" ? (
                              <div className="flex gap-2">
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() =>
                                    updateBookingStatus(booking._id, "accepted")
                                  }
                                >
                                  Accept
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    setRejectBookingId(booking._id);
                                    setShowConfirmReject(true);
                                  }}
                                >
                                  Reject
                                </Button>
                              </div>
                            ) : booking.status === "accepted" ||
                              booking.status === "completed" ? (
                              <div className="flex gap-2">
                                {booking.status !== "completed" && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => toChat(booking._id)}
                                    >
                                      <MessageCircle
                                        size={16}
                                        className="mr-2"
                                      />
                                      Message
                                    </Button>
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() =>
                                        navigate(
                                          `/booking-details/${booking._id}`
                                        )
                                      }
                                    >
                                      View Details
                                    </Button>
                                    {showchat && (
                                      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 w-[90%] max-w-md relative">
                                          {/* Close Button */}
                                          <button
                                            onClick={() => setShowChat(false)}
                                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg font-bold"
                                          >
                                            ×
                                          </button>

                                          {/* ChatBox Component */}
                                          <ChatBox bookingId={bookingId} />
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}
                                {booking.status === "completed" && (
                                  <div style={{ fontWeight: "bold" }}>
                                    Service completed!
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-red-500 font-semibold">
                                Rejected
                              </span>
                            )
                          ) : userData.userType === "seeker" ? (
                            booking.status === "Pending" ? (
                              <span className="text-yellow-500 font-semibold">
                                Pending
                              </span>
                            ) : booking.status === "rejected" ? (
                              <span className="text-red-500 font-semibold">
                                Rejected
                              </span>
                            ) : (
                              <div className="flex gap-2 items-center">
                                {booking.status !== "completed" && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => toChat(booking._id)}
                                    >
                                      <MessageCircle
                                        size={16}
                                        className="mr-2"
                                      />
                                      Message
                                    </Button>
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() =>
                                        navigate(
                                          `/booking-details/${booking._id}`
                                        )
                                      }
                                    >
                                      View Details
                                    </Button>
                                    {showchat && (
                                      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 w-[90%] max-w-md relative">
                                          {/* Close Button */}
                                          <button
                                            onClick={() => setShowChat(false)}
                                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg font-bold"
                                          >
                                            ×
                                          </button>

                                          {/* ChatBox Component */}
                                          <ChatBox bookingId={bookingId} />
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}
                                {booking.status === "completed" && (
                                  <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() =>
                                      navigate(`/review/${booking._id}`)
                                    }
                                  >
                                    Leave a Review
                                  </Button>
                                )}
                              </div>
                            )
                          ) : null}
                        </div>
                      </div>
                    ))
                )}
              </div>
              {bookings.length > 3 && (
                <div className="mt-4 text-center">
                  <a
                    href={`/${userData.userType}/bookings`}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    View All
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showConfirmReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold dark:text-white mb-4">
              Confirm Rejection
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to reject this booking request?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmReject(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (rejectBookingId) {
                    updateBookingStatus(rejectBookingId, "rejected");
                    setShowConfirmReject(false);
                    setRejectBookingId(null);
                  }
                }}
              >
                Yes, Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Sidebar({ userData }: any) {
  const isProvider = userData.userType === "provider";
  return (
    <div className="md:w-64">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <img
            src={"https://i.pravatar.cc/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold dark:text-white">
            {userData.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {isProvider ? "Service Provider" : "Service Seeker"}
          </p>
        </div>
        <nav className="space-y-2">
          <a
            href="#"
            className="block px-4 py-2 rounded-md bg-blue-50 text-blue-600"
          >
            Dashboard
          </a>
          <a
            href={`/${userData.userType}/bookings`}
            className="block px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Bookings
          </a>
          <a
            href={`/chat`}
            className="block px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Chats
          </a>
          <a
            href={
              userData?.userType === "provider"
                ? "/reviews/providerpage"
                : "/reviews/seekerpage"
            }
            className="block px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Reviews
          </a>
          <a
            href={`/profile/${localStorage.getItem("userId")}`}
            className="block px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Profile
          </a>
        </nav>
      </div>
    </div>
  );
}
