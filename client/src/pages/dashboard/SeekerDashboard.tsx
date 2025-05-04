import { useEffect, useState } from "react";
import { Calendar, Clock,ClipboardList, DollarSign } from "lucide-react";
import axios from "axios";

const colorMap: Record<string, string> = {
  blue: "text-blue-600",
  green: "text-green-600",
  yellow: "text-yellow-600",
  purple: "text-purple-600",
};
export function SeekerDashboard({ userData }: any) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeekerBookings = async () => {
      try {
        const seekerId = userData._id;
        const res = await axios.get(
          `http://localhost:5000/api/bookings/seeker/${seekerId}`
        );
        setBookings(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching provider bookings:", error);
        setLoading(false);
      }
    };

    if (userData._id) fetchSeekerBookings();
  }, [userData]);

  if (loading) return <p>Loading bookings...</p>;
  if (!Array.isArray(bookings)) return <p>Failed to load bookings.</p>;


  const upcoming = bookings.filter((b) => b.status === "accepted").length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  
  const totalEarnings = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + (b.price || 0), 0);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard icon={<Calendar />} title="Upcoming" value={upcoming} color="blue" />
        <DashboardCard icon={<Clock />} title="Completed" value={completed} color="green" />
        <DashboardCard icon={<ClipboardList />} title="Services Requested" value={bookings.length || 0} color="yellow" />
        <DashboardCard icon={<DollarSign />} title="Spent" value={totalEarnings} color="purple" />
      </div>
    </>
  );
}

function DashboardCard({ icon, title, value, color }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`w-12 h-12 ${colorMap[color]}`}>{icon}</div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold dark:text-white">{title}</h3>
          <p className={`text-2xl font-bold ${colorMap[color]}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
