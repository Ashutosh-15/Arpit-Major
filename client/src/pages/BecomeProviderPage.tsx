import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Briefcase, Key } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function BecomeProviderPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    services: [] as string[],
    password: '',
  });

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:5000/api/profile/provider/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user data');

        const userData = await response.json();

        setFormData({
          fullName: userData.name || '',
          email: userData.email || '',
          phone: userData.phoneNumber || '',
          location: userData.address || '',
          experience: userData.experience || '',
          services: userData.services || [],
          password: '', // Keep password empty for security
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [userId]);

  const serviceOptions = [
    'House Cleaning',
    'Deep Cleaning',
    'Office Cleaning',
    'Laundry',
    'Gardening',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const providerData = {
      name: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phone,
      address: formData.location,
      experience: formData.experience,
      password: formData.password,
      role: 'provider',
      services: formData.services,
    };

    console.log("Sending data:", providerData);

    try {
      const res = await fetch(`http://localhost:5000/api/profile/provider/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(providerData),
      });

      if (!res.ok) throw new Error('Update failed');

      const result = await res.json();
      console.log('Provider updated:', result);
      alert('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating provider:', error);
      alert('Update failed. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-8 dark:text-white">Become a Service Provider</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    required
                    readOnly
                    className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                    value={formData.fullName}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="email"
                    required
                    readOnly
                    className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                    value={formData.email}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="tel"
                    required
                    readOnly
                    className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                    value={formData.phone}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    required
                    readOnly
                    className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                    value={formData.location}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Services Offered
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {serviceOptions.map((service) => (
                  <label key={service} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.services.includes(service)}
                      onChange={(e) => {
                        const updatedServices = e.target.checked
                          ? [...formData.services, service]
                          : formData.services.filter(s => s !== service);
                        setFormData({ ...formData, services: updatedServices });
                      }}
                    />
                    <span className="text-gray-700 dark:text-gray-300">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Years of Experience
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <Button variant="primary" size="lg" className="w-full" type="submit">
              Submit Application
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
