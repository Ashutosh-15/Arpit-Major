import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Clock, Award, CheckCircle, Heart, Zap, Sparkles } from 'lucide-react';

export function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
            About ServiceHub
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            Transforming the way people connect with quality service providers, making everyday tasks simpler, 
            more efficient, and more reliable.
          </p>
        </div>
      </motion.section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6 dark:text-white">Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              At ServiceHub, we're revolutionizing the service industry by creating a trusted platform 
              that empowers both service providers and customers. Our mission is to make quality services 
              accessible to everyone while providing opportunities for skilled professionals to grow their business.
            </p>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="text-xl font-semibold mb-4 dark:text-white">For Customers</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Access to verified, skilled professionals for all your service needs
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Heart className="w-6 h-6 text-red-500 mr-2 flex-shrink-0 mt-1" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Transparent pricing and secure payment system
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 dark:text-white">For Providers</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Zap className="w-6 h-6 text-yellow-500 mr-2 flex-shrink-0 mt-1" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Platform to showcase skills and grow your business
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Sparkles className="w-6 h-6 text-purple-500 mr-2 flex-shrink-0 mt-1" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Flexible scheduling and reliable income opportunities
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Why Choose ServiceHub</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Providers",
                description: "Rigorous verification process ensures only qualified professionals join our platform"
              },
              {
                icon: Users,
                title: "Strong Community",
                description: "Join thousands of satisfied users who trust ServiceHub for their daily needs"
              },
              {
                icon: Clock,
                title: "Quick Booking",
                description: "Efficient booking system with real-time availability and instant confirmation"
              },
              {
                icon: Award,
                title: "Quality Guarantee",
                description: "100% satisfaction guarantee with our service quality promise"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { number: "50,000+", label: "Completed Services", description: "Successfully delivered services with high satisfaction" },
              { number: "10,000+", label: "Active Customers", description: "Trusted by thousands of satisfied customers" },
              { number: "5,000+", label: "Service Providers", description: "Professional providers earning through our platform" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
              >
                <h3 className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</h3>
                <p className="text-xl font-semibold mb-2 dark:text-white">{stat.label}</p>
                <p className="text-gray-600 dark:text-gray-300">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Trust & Safety</h3>
              <p>Building trust through verified providers and secure transactions</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Quality Service</h3>
              <p>Maintaining high standards in every service delivery</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Community First</h3>
              <p>Creating opportunities and fostering strong community connections</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}