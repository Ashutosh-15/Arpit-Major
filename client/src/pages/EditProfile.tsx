import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<string | null>(null); // seeker or provider
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    profileImage: "",
    experience: "",           // for provider only
    availability: "",         // for provider only
    services: "",             // for provider only (string for UI)
    requestedServices: "",    // for seeker only (string for UI)
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Try fetching provider first
        let res = await fetch(`http://localhost:5000/api/profile/provider/${id}`);
        if (res.ok) {
          const data = await res.json();
          setUserType("provider");
          setProfile({
            ...data,
            services: Array.isArray(data.services) ? data.services.join(", ") : "",
            requestedServices: "",
          });
        } else {
          // Try fetching seeker if provider not found
          res = await fetch(`http://localhost:5000/api/profile/seeker/${id}`);
          if (!res.ok) throw new Error("User not found");
          const data = await res.json();
          setUserType("seeker");
          setProfile({
            ...data,
            experience: "",
            availability: "",
            services: "",
            requestedServices: Array.isArray(data.requestedServices) ? data.requestedServices.join(", ") : "",
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData = {
      ...profile,
      services: userType === "provider" ? (profile.services ? profile.services.split(",").map(s => s.trim()) : []) : undefined,
      requestedServices: userType === "seeker" ? (profile.requestedServices ? profile.requestedServices.split(",").map(s => s.trim()) : []) : undefined,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/profile/${userType}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error("Failed to update profile.");
      navigate(`/profile/${id}`);
    } catch (err) {
      console.error("Update failed:", err);
      setError("Error updating profile. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Profile ({userType})</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={profile.name} onChange={handleChange} className="border p-2 w-full" placeholder="Full Name" />
        <input type="email" name="email" value={profile.email} onChange={handleChange} className="border p-2 w-full" placeholder="Email" />
        <input type="text" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} className="border p-2 w-full" placeholder="Phone Number" />
        <input type="text" name="address" value={profile.address} onChange={handleChange} className="border p-2 w-full" placeholder="Address" />

        {/* Provider-only fields */}
        {userType === "provider" && (
          <>
            <input type="text" name="experience" value={profile.experience} onChange={handleChange} className="border p-2 w-full" placeholder="Experience" />
            <input type="text" name="availability" value={profile.availability} onChange={handleChange} className="border p-2 w-full" placeholder="Availability" />
            <textarea name="services" value={profile.services} onChange={handleChange} className="border p-2 w-full" placeholder="Services (comma-separated)" />
          </>
        )}


        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
      </form>
    </div>
  );
}


// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// export function EditProfile() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [provider, setProvider] = useState({
//     name: "",
//     email: "",
//     phoneNumber: "",
//     address: "",
//     profileImage: "",
//     experience: "",
//     availability: "",
//     services: "",
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProvider = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/profile/provider/${id}`);
//         if (!response.ok) throw new Error("Failed to fetch provider details.");
//         const data = await response.json();
//         setProvider({
//           ...data,
//           services: Array.isArray(data.services) ? data.services.join(", ") : "",
//         });
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError("Failed to load profile data.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProvider();
//   }, [id]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setProvider({ ...provider, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`http://localhost:5000/api/profile/provider/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...provider,
//           services: provider.services ? provider.services.split(",").map(s => s.trim()) : [],
//         }),
//       });
//       if (!response.ok) throw new Error("Failed to update profile.");
//       navigate(`/profile/${id}`);
//     } catch (err) {
//       console.error("Update failed:", err);
//       setError("Error updating profile. Please try again.");
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input type="text" name="name" value={provider.name} onChange={handleChange} className="border p-2 w-full" placeholder="Full Name" />
//         <input type="email" name="email" value={provider.email} onChange={handleChange} className="border p-2 w-full" placeholder="Email" />
//         <input type="text" name="phoneNumber" value={provider.phoneNumber} onChange={handleChange} className="border p-2 w-full" placeholder="Phone Number" />
//         <input type="text" name="address" value={provider.address} onChange={handleChange} className="border p-2 w-full" placeholder="Address" />
//         <input type="text" name="experience" value={provider.experience} onChange={handleChange} className="border p-2 w-full" placeholder="Experience" />
//         <input type="text" name="availability" value={provider.availability} onChange={handleChange} className="border p-2 w-full" placeholder="Availability" />
//         <textarea name="services" value={provider.services} onChange={handleChange} className="border p-2 w-full" placeholder="Services (comma-separated)" />
//         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
//       </form>
//     </div>
//   );
// }
