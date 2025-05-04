import React from 'react';
import { Routes, Route, Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Header } from './components/layout/Header';


// Public Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ServiceListingPage } from './pages/services/ServiceListingPage';
import { ServiceDetailPage } from './pages/services/ServiceDetailPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { TermsPage } from './pages/TermsPage';

// Profile and Edit
import { ProfilePage } from './pages/ProfilePage';
import { EditProfile } from './pages/EditProfile';

// Booking Pages
import { BookingPage } from './pages/BookingPage';
import { BookingDetailsPage } from './pages/BookingDetailsPage';
import BookingList from './pages/BookingList';

// Protected Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import ChatPage from './pages/chat/ChatPage';

import { BecomeProviderPage } from './pages/BecomeProviderPage';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Chat Pages
import ChatBox from './pages/chat/ChatBox';
import { ChatProvider } from './context/ChatContext';

// Reviews Page
import { ProviderReviewsPage } from './pages/reviews/ProviderReviewsPage';
import { ReviewFormPage } from './pages/reviews/ReviewFormPage';
import { SeekerReviewsPage } from './pages/reviews/SeekerReviewsPage';

function App() {
  return (
    <AuthProvider>
      
      <ChatProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/services" element={<ServiceListingPage />} />
              <Route path="/services/:id" element={<ServiceDetailPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/edit-profile/:id" element={<EditProfile />} />
              <Route path="/:userType/bookings" element={<BookingList />} />
              <Route path="/chat/:bookingId" element={<ChatBox bookingId={''} />} />
              <Route path="/reviews/seekerpage" element={<SeekerReviewsPage />} />
              <Route path="/review/:bookingId" element={<ReviewFormPage />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route
                path="/booking/:id"
                element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking-details/:bookingId"
                element={
                  <ProtectedRoute>
                    <BookingDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/reviews/providerpage" element={<ProviderReviewsPage />} />
              <Route path="/become-provider" element={<BecomeProviderPage />} />
            
            </Routes>
          </main>
          <ToastContainer position="top-right" autoClose={4000} />
        </div>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
