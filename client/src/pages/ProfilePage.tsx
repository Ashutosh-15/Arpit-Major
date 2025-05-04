import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Edit } from "lucide-react";
import { Button } from "../components/ui/Button";

interface Provider {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  profileImage: string;
  rating: number;
  services: string[];
  experience: string;
  availability: string;
  reviews: { name: string; comment: string; rating: number; date: string }[];
}

export function ProfilePage() {
  const storedUserId = localStorage.getItem("userId");
  const storedUserType = localStorage.getItem("userType");
  const { id } = useParams(); // Get provider ID from URL
  const navigate = useNavigate();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storedUserId) {
      navigate("/login"); // Redirect to login page if not authenticated
    }
  }, [storedUserId, navigate]);
  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/profile/provider/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // If authentication is needed
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to load provider profile");
        const data = await response.json();
        setProvider(data);
      } catch (err) {
        setError("Failed to load provider profile.");
      } finally {
        setLoading(false);
      }
    };

    if (storedUserType === "provider") fetchProvider();
    else fetchSeeker();
  }, [id]);
  const fetchSeeker = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/profile/seeker/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // If authentication is needed
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to load provider profile");
      const data = await response.json();
      setProvider(data);
    } catch (err) {
      setError("Failed to load provider profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!provider) return <p className="text-center">Provider not found.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <img
                src={provider.profileImage || "/default-profile.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full"
              />
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full">
                <Edit size={16} />
              </button>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold mb-2 dark:text-white">
                {provider.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Service Provider
              </p>
              <div className="flex items-center justify-center md:justify-start mt-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-2 text-gray-600 dark:text-gray-300">
                  {provider.rating} ★
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(`/edit-profile/${id}`)}
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 dark:text-white">Personal Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                  <p className="font-medium dark:text-white">{provider.name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-medium dark:text-white">{provider.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="font-medium dark:text-white">{provider.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                  <p className="font-medium dark:text-white">{provider.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 dark:text-white">Service Information</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2 dark:text-white">Services Offered</h3>
                {provider.services.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {provider.services.map((service, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                        {service}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No services listed.</p>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-2 dark:text-white">Experience</h3>
                <p className="text-gray-600 dark:text-gray-300">{provider.experience}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2 dark:text-white">Availability</h3>
                <p className="text-gray-600 dark:text-gray-300">{provider.availability}</p>
              </div>
            </div>
          </div>
        </div>

         */}
        {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-6 dark:text-white">Recent Reviews</h2>
          <div className="space-y-6">
            {provider.reviews.length > 0 ? (
              provider.reviews.map((review, index) => (
                <div key={index} className="border-b dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-start gap-4">
                    <img
                      src={`https://i.pravatar.cc/40?img=${index + 1}`}
                      alt="Reviewer"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold dark:text-white">{review.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}
