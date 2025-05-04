import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export function BookingDetailsPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const userType = localStorage.getItem('userType');

  const fetchBooking = async () => {
    const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`);
    const data = await res.json();
    setBooking(data);
  };

  const markAsCompleted = async () => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        status: 'completed',
      });
      alert('Booking marked as completed!');
      fetchBooking(); // refresh data
    } catch (err) {
      console.error('Error updating booking status:', err);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  if (!booking) return <div className="text-center mt-10">Loading booking details...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-2xl shadow-lg max-w-xl mx-auto mt-12">
      <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
      <p className="mb-2"><strong>Service(s):</strong> {booking.services?.join(', ')}</p>
      <p className="mb-2"><strong>Date:</strong> {booking.date}</p>
      <p className="mb-2"><strong>Time:</strong> {booking.timeSlot}</p>
      <p className="mb-2"><strong>Address:</strong> {booking.address}</p>
      <p className="mb-2"><strong>Payment:</strong> {booking.paymentMethod}</p>
      <p className="mb-2"><strong>Provider:</strong> {booking.providerName}</p>
      <p className="mb-2"><strong>Seeker:</strong> {booking.seekerName}</p>
      <p className="mb-4"><strong>Status:</strong> {booking.status}</p>

      {userType === 'provider' && booking.status !== 'completed' && (
        <button
          onClick={markAsCompleted}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          Mark as Completed
        </button>
      )}
    </div>
  );
}
