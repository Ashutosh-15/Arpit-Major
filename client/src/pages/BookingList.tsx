import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { CalendarDays, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";

type BookingType = {
  _id: string;
  date: string;
  timeSlot: string;
  address: string;
  status: "Pending" | "accepted" | "rejected" | "completed";
  seekerName?: string;
  providerName?: string;
};

const BookingList: React.FC = () => {
  const [showConfirmReject, setShowConfirmReject] = useState(false);
  const [rejectBookingId, setRejectBookingId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [filter, setFilter] = useState<
    "today" | "Pending" | "accepted" | "completed" | "rejected"
  >("today");
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType"); // 'provider' or 'seeker'

  const fetchBookings = async () => {
    try {
      if (!userId || !userType) return;
      const endpoint =
        userType === "provider"
          ? `http://localhost:5000/api/bookings/provider/${userId}`
          : `http://localhost:5000/api/bookings/seeker/${userId}`;

      const { data } = await axios.get(endpoint);
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };
  const updateBookingStatus = async (
    id: string,
    status: "Pending" | "accepted" | "rejected" | "completed"
  ) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/bookings/${id}/status`,
        { status }
      );
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id ? { ...booking, status } : booking
        )
      );
    } catch (error) {
      console.error("Failed to update booking status:", error);
    }
  };

  const today = format(new Date(), "yyyy-MM-dd");

  const filteredBookings = bookings.filter((booking) => {
    const bookingDateFormatted = format(new Date(booking.date), "yyyy-MM-dd");
    if (filter === "today") {
      return bookingDateFormatted === today && booking.status !== "rejected";
    }
    return booking.status === filter;
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>

      {/* Filter buttons */}
      <div className="mb-4 flex gap-4 flex-wrap">
        {["today", "Pending", "accepted", "completed", "rejected"].map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`px-4 py-2 rounded-xl ${
                filter === type
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {type === "today"
                ? "Today"
                : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Booking cards */}
      <div className="mt-6">
        {filteredBookings.length === 0 ? (
          <p className="mt-6 text-gray-500">No bookings in this category.</p>
        ) : (
          <div className="grid gap-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="p-4 rounded-2xl border bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div>
                  <h4 className="font-semibold text-lg">
                    {userType === "provider"
                      ? booking.seekerName
                      : booking.providerName || "User"}
                  </h4>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <CalendarDays size={16} />{" "}
                      {format(new Date(booking.date), "yyyy-MM-dd")}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} /> {booking.timeSlot}
                    </div>
                  </div>
                  <p className="mt-1 text-sm">Address: {booking.address}</p>
                </div>

                <div className="flex flex-col md:items-end gap-2 mt-4 md:mt-0">
                  {/* Status */}
                  <div
                    className={`text-sm font-bold px-4 py-2 rounded-xl text-center w-fit ${
                      booking.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : booking.status === "accepted"
                        ? "bg-blue-100 text-blue-800"
                        : booking.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </div>

                  {userType === "provider" && (
                    <>
                      {booking.status === "Pending" && (
                        <>
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
                        </>
                      )}
                      {booking.status === "accepted" ||
                      booking.status === "completed" ? (
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() =>
                              navigate(`/booking-details/${booking._id}`)
                            }
                            className="px-4 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm"
                          >
                            View Details
                          </button>
                          {booking.status === "accepted" && (
                            <button
                              onClick={() => navigate(`/chat/${booking._id}`)}
                              className="px-4 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 text-sm"
                            >
                              Message
                            </button>
                          )}
                          
                        </div>
                      ) : booking.status === "rejected" ? (
                        <div className="text-red-600 font-semibold text-sm">
                          
                        </div>
                      ) : null}
                    </>
                  )}
                  {/* Conditional Buttons */}
                  {userType === "seeker" && (
                    <>
                      {booking.status === "accepted" ||
                      booking.status === "completed" ? (
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() =>
                              navigate(`/booking-details/${booking._id}`)
                            }
                            className="px-4 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm"
                          >
                            View Details
                          </button>
                          {booking.status === "accepted" && (
                            <button
                              onClick={() => navigate(`/chat/${booking._id}`)}
                              className="px-4 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 text-sm"
                            >
                              Message
                            </button>
                          )}
                          {booking.status === "completed" && (
                            <button
                              onClick={() => navigate(`/review/${booking._id}`)}
                              className="px-4 py-1 rounded-lg bg-purple-500 text-white hover:bg-purple-600 text-sm"
                            >
                              Leave Review
                            </button>
                          )}
                        </div>
                      ) : booking.status === "rejected" ? (
                        <div className="text-red-600 font-semibold text-sm">
                          
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
      </div>
    </div>
  );
};

export default BookingList;
