import React from 'react';
import { Star, Clock, MapPin, Calendar, MessageCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ServiceDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Service Info */}
        <div className="md:col-span-2">
          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Service"
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
          <h1 className="text-3xl font-bold mb-4 dark:text-white">Professional House Cleaning Service</h1>
          
          <div className="flex items-center mb-6">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">4.8 (120+ reviews)</span>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-8">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">About This Service</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Professional house cleaning service with over 5 years of experience. We provide thorough cleaning
              of all rooms, including kitchen, bathrooms, bedrooms, and living areas. Our team uses eco-friendly
              cleaning products and follows strict cleaning protocols.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">Service Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">3-4 hours per session</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Service available in your area</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Card */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2 dark:text-white">$25/hour</h3>
              <p className="text-gray-600 dark:text-gray-300">Professional cleaning service</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Select time slot</option>
                <option>Morning (9 AM - 12 PM)</option>
                <option>Afternoon (1 PM - 4 PM)</option>
                <option>Evening (5 PM - 8 PM)</option>
              </select>
            </div>

            <div className="space-y-4">
              <Button variant="primary" size="lg" className="w-full">
                Book Now
              </Button>
              <Button variant="outline" size="lg" className="w-full flex items-center justify-center gap-2">
                <MessageCircle size={20} />
                Contact Provider
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}