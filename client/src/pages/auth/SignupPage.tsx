import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, CreditCard, ToyBrick, Type } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

// Define the structure of form data
interface FormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  password: string;
  userType: 'seeker' | 'provider';
  aadharCard?: string;
  experience?: string;
}

export function SignupPage() {
  // State to track user type (seeker or provider)
  const {setAuthData} = useAuth();
  const [userType, setUserType] = useState<'seeker' | 'provider'>('seeker');
  const navigate= useNavigate();

  // State to store form data
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    userType: 'seeker',
    aadharCard: '',
    experience: '',
  });

  // Handle input change for both input and textarea fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle user type change and update formData.userType accordingly
  const handleUserTypeChange = (type: 'seeker' | 'provider') => {
    setUserType(type);
    setFormData((prevData) => ({
      ...prevData,
      userType: type,
      // Reset provider-specific fields if switching to seeker
      aadharCard: type === 'provider' ? prevData.aadharCard : '',
      experience: type === 'provider' ? prevData.experience : '',
    }));

  };


  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const userData: any = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      password: formData.password,
      userType: formData.userType,
    };
  
    if (formData.userType === 'provider') {
      userData.aadharCard = formData.aadharCard;
      userData.experience = formData.experience;
    }
  
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // ✅ Auto-login the user using token & userId from backend
        setAuthData(result.token, result.user);  
        alert('Signup successful!');
        if(userType==='seeker')
        navigate('/dashboard');
      else{
        navigate('/become-provider');
      }
      } else {
        alert(result.message || 'Signup failed');
      }
    } catch (error) {
      console.error('🚨 Error during signup:', error);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>

        {/* User Type Selection */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            className={`px-4 py-2 rounded-md ${
              userType === 'seeker'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
            onClick={() => handleUserTypeChange('seeker')}
          >
            Service Seeker
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              userType === 'provider'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
            onClick={() => handleUserTypeChange('provider')}
          >
            Service Provider
          </button>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Full name"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Email address"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Phone number"
              />
            </div>

            {/* Location */}
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Location"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Password"
              />
            </div>
          </div>

          {/* Additional Fields for Service Provider */}
          {userType === 'provider' && (
            <div className="space-y-4">
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  name="aadharCard"
                  value={formData.aadharCard}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full px-10 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="Aadhar Card Number"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full px-10 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="Years of Experience"
                />
              </div>
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full">
            Create Account
            
          </Button>
        </form>
      </div>
    </div>
  );
}
