import { useEffect, useState } from "react";
import { Calendar, Clock, Star, DollarSign } from "lucide-react";
import axios from "axios";

// Tailwind-safe color class mapping
const colorMap: Record<string, string> = {
  blue: "text-blue-600",
  green: "text-green-600",
  yellow: "text-yellow-600",
  purple: "text-purple-600",
};

export function ProviderDashboard({ userData }: any) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState<string>("0");
  const [reviewCount, setReviewCount] = useState<number>(0);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const providerId = userData._id;

        const [bookingsRes, reviewsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/bookings/provider/${providerId}`),
          axios.get(`http://localhost:5000/api/reviews/provider/${providerId}`),
        ]);

        setBookings(bookingsRes.data);
        setReviews(reviewsRes.data.reviews || []);

        // Calculate the average rating and review count
        const totalRating = reviewsRes.data.reviews.reduce(
          (sum: number, review: any) => sum + review.rating,
          0
        );
        const avgRating = reviewsRes.data.reviews.length
          ? (totalRating / reviewsRes.data.reviews.length).toFixed(1)
          : "0";

        setAverageRating(avgRating);
        setReviewCount(reviewsRes.data.reviews.length);

        // Update provider's rating and review count in the backend
        await axios.put(`http://localhost:5000/api/profile/provider/${providerId}/rating`, {
          rating: avgRating,
          reviewCount: reviewsRes.data.reviews.length,
        });
      } catch (error) {
        console.error("Error fetching provider dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userData._id) fetchProviderData();
  }, [userData]);

  if (loading) return <p>Loading dashboard...</p>;
  if (!Array.isArray(bookings)) return <p>Failed to load dashboard data.</p>;

  // Booking stats
  const upcoming = bookings.filter((b) => b.status === "accepted").length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  const totalEarnings = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + (b.price || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <DashboardCard
        icon={<Calendar />}
        title="Upcoming"
        value={upcoming}
        color="blue"
      />
      <DashboardCard
        icon={<Clock />}
        title="Completed"
        value={completed}
        color="green"
      />
      <DashboardCard
        icon={<Star />}
        title="Rating"
        value={`${averageRating}`}
        color="yellow"
      />
      <DashboardCard
        icon={<DollarSign />}
        title="Earnings"
        value={`$${totalEarnings}`}
        color="purple"
      />
    </div>
  );
}

function DashboardCard({ icon, title, value, color }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`w-12 h-12 ${colorMap[color]} flex justify-center items-center`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold dark:text-white">{title}</h3>
          <p className={`text-2xl font-bold ${colorMap[color]}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
