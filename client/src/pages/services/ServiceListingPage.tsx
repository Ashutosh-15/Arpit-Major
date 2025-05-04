import React, { useEffect, useState } from "react";
import { Search, MapPin, Filter, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../../components/ui/Button";

type Provider = {
  _id: string;
  name: string;
  services: string[];
  address: string;
  phoneNumber: string;
  email: string;
  availability: string;
  experience: string;
  profileImage?: string;
  rating?: number;
  reviewCount?: number;
};

export const ServiceListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [availability, setAvailability] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProviders = async () => {
    try {
      const params: any = {};
      if (category) params.category = category;
      if (area) params.area = area;
      if (availability) params.availability = availability;

      const res = await axios.get(
        "http://localhost:5000/api/profile/providers",
        { params }
      );
      setProviders(res.data);
    } catch (err) {
      console.error("Error fetching providers:", err);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [category, area, availability]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 🔍 Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Category"
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Area"
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
          <select
            className="border py-2 px-4 rounded-md focus:ring-2 focus:ring-blue-500"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option value="">All Availability</option>
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
          </select>
        </div>
      </motion.div>

      {/* 📋 Providers */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.length > 0 ? (
          providers.map((provider, index) => (
            <motion.div
              key={provider._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
            >
              <img
                src={
                  provider.profileImage ||
                  "https://via.placeholder.com/400x300?text=No+Image"
                }
                alt={provider.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-1 dark:text-white">
                  {provider.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {provider.address}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Services:</strong> {provider.services.join(", ")}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Experience:</strong> {provider.experience}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Availability:</strong> {provider.availability}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center text-yellow-400">
                    <Star className="w-5 h-5" />
                    {provider.reviewCount && provider.reviewCount > 0 ? (
                      <span className="ml-1 text-gray-600 dark:text-gray-300">
                        {provider.rating} ({provider.reviewCount} reviews)
                      </span>
                    ) : (
                      <span className="ml-1 text-gray-600 dark:text-gray-300">
                        No rating yet
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() =>
                      navigate(`/booking/${provider._id}`, {
                        state: { provider },
                      })
                    }
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">
            No services found.
          </p>
        )}
      </div>
    </div>
  );
};
