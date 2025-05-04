import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { set } from "date-fns";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icon for the current location
const currentLocationIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41], // Default size
  iconAnchor: [12, 41], // Anchor point
});

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

// Component to recenter the map when coordinates change
function RecenterMap({ coordinates }: { coordinates: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates) {
      map.setView(coordinates, map.getZoom());
    }
  }, [coordinates, map]);

  return null;
}

function LocationSelector({
  setCoordinates,
  setAddress,
  API_KEY,
}: {
  setCoordinates: React.Dispatch<React.SetStateAction<[number, number] | null>>;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  API_KEY: string;
}) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setCoordinates([lat, lng]);

      try {
        // Reverse geocode the clicked location
        const response = await fetch(
          `https://us1.locationiq.com/v1/reverse.php?key=${API_KEY}&lat=${lat}&lon=${lng}&format=json`
        );
        const data = await response.json();

        if (data.address) {
          setAddress(data.display_name);
        } else {
          alert("Unable to fetch address. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        alert("Failed to fetch address. Please try again.");
      }
    },
  });

  return null; // This component doesn't render anything
}

export function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const provider = location.state?.provider;

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [selectedService, setSelectedService] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false); // State to toggle the map modal
  const API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY;

  // Error states
  const [errors, setErrors] = useState({
    date: "",
    timeSlot: "",
    address: "",
    selectedService: "",
  });

  useEffect(() => {
    if (!provider) navigate("/find-services");
  }, [provider, navigate]);

  const handleConfirmBooking = async () => {
    const newErrors = {
      date: date ? "" : "Date is required",
      timeSlot: timeSlot ? "" : "Time slot is required",
      address: address ? "" : "Address is required",
      selectedService: selectedService ? "" : "Please select a service",
    };

    setErrors(newErrors);

    // If there are any errors, don't proceed
    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) return;

    if (!isAuthenticated || !user) {
      navigate("/login?redirect=" + window.location.pathname);
      return;
    }

    let seeker;
    try {
      const res = await fetch(`http://localhost:5000/api/profile/seeker/${user?.id}`);
      const data = await res.json();
      seeker = data;
    } catch (err) {
      console.error("Error fetching seeker data:", err);
      navigate("/login");
      return;
    }

    const bookingData = {
      providerId: provider._id,
      providerName: provider.name,
      services: [selectedService],
      seekerId: user?.id,
      seekerName: seeker.name,
      date,
      timeSlot,
      address,
      paymentMethod,
    };

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) throw new Error("Failed to create booking");

      const savedBooking = await res.json();
      console.log("Booking success:", savedBooking);

      navigate("/dashboard");
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Something went wrong. Try again.");
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    const option = confirm("Do you want to use your current location?");
    if (option) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates([latitude, longitude]);

          try {
            const response = await fetch(
              `https://us1.locationiq.com/v1/reverse.php?key=${API_KEY}&lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();

            if (data.address) {
              setAddress(data.display_name);
            } else {
              alert("Unable to fetch address. Please try again.");
            }
          } catch (error) {
            console.error("Error fetching address:", error);
            alert("Failed to fetch address. Please try again.");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Failed to get your location. Please enable location services.");
        }
      );
    }
  };

  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setAddress(input);

    if (input.length > 4) {
      setSuggestions([]);
      try {
        const response = await fetch(
          `https://us1.locationiq.com/v1/autocomplete.php?key=${API_KEY}&q=${input}&limit=5&format=json`
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          const fetchedSuggestions = data.map((item: any) => ({
            display_name: item.display_name,
            lat: item.lat,
            lon: item.lon,
          }));
          setSuggestions(fetchedSuggestions);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setAddress(suggestion.display_name);
    setCoordinates([parseFloat(suggestion.lat), parseFloat(suggestion.lon)]);
    setSuggestions([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Book Service</h1>

        {/* Service Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Service Details</h2>
          <div className="flex items-start gap-4 mb-6">
            <img
              src={provider?.profileImage || "https://via.placeholder.com/150"}
              alt="Service"
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold dark:text-white">{provider?.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">{provider?.services?.join(", ")}</p>
              <p className="text-blue-600 font-semibold mt-2">
                ₹{provider?.ratePerHour || "N/A"}/hour
              </p>
            </div>
          </div>

          {/* Service Selection Dropdown */}
          <div className="relative mb-2">
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select a service</option>
              {provider?.services?.map((service: string, index: number) => (
                <option key={index} value={service}>
                  {service}
                </option>
              ))}
            </select>
            {errors.selectedService && (
              <p className="text-red-500 text-sm mt-1">{errors.selectedService}</p>
            )}
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Schedule</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-gray-400" />
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md"
              >
                <option value="">Select time slot</option>
                <option value="morning">Morning (9 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (1 PM - 4 PM)</option>
                <option value="evening">Evening (5 PM - 8 PM)</option>
              </select>
              {errors.timeSlot && (
                <p className="text-red-500 text-sm mt-1">{errors.timeSlot}</p>
              )}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Location</h2>
          <div className="relative mb-2">
            <MapPin className="absolute left-3 top-2 text-gray-400" />
            
            <input
              type="text"
              value={address}
              onChange={handleAddressChange}
              placeholder="Enter your address"
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
            {suggestions.length > 0 && (
              <ul className="absolute bg-white border rounded-md shadow-lg mt-1 w-full z-10">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {suggestion.display_name}
                  </li>
                ))}
              </ul>
            )}
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>
          <span
            onClick={() => setIsMapOpen(true)} // Open the map modal
            className="text-cyan-700 hover:underline hover:cursor-pointer"
          >
            Locate on Map
          </span>
        </div>

        {/* Map Modal */}
        {isMapOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 p-4 relative">
              <button
                onClick={() => setIsMapOpen(false)} // Close the map modal
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold mb-4">Select Location</h2>
              <span
                className="text-cyan-700 hover:underline hover:cursor-pointer"
                onClick={handleGetCurrentLocation}
              >
                Add Current Location
              </span>
              <MapContainer
                center={coordinates || [51.505, -0.09]} // Default center if no coordinates
                zoom={13}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {coordinates && (
                  <Marker position={coordinates} icon={currentLocationIcon}>
                    <Popup>{address || "Selected Location"}</Popup>
                  </Marker>
                )}
                <RecenterMap coordinates={coordinates} />
                <LocationSelector
                  setCoordinates={setCoordinates}
                  setAddress={setAddress}
                  API_KEY={API_KEY}
                />
              </MapContainer>
            </div>
          </div>
        )}

        {/* Confirm Button */}
        <button
          onClick={handleConfirmBooking}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg w-full"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

