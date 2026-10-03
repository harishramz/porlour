import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { FavoritesProvider } from './context/FavoritesContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { ServiceDetails } from './pages/ServiceDetails';
import { About } from './pages/About';
import { Team } from './pages/Team';
import { Gallery } from './pages/Gallery';
import { Offers } from './pages/Offers';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { BookAppointment } from './pages/BookAppointment';

// Customer Pages
import { CustomerDashboard } from './pages/customer/Dashboard';
import { CustomerProfile } from './pages/customer/Profile';
import { CustomerAppointments } from './pages/customer/Appointments';
import { AppointmentDetails } from './pages/customer/AppointmentDetails';
import { CustomerFavorites } from './pages/customer/Favorites';
import { CustomerReviews } from './pages/customer/Reviews';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminServices } from './pages/admin/Services';
import { AdminStaff } from './pages/admin/Staff';
import { AdminAppointments } from './pages/admin/Appointments';
import { AdminCustomers } from './pages/admin/Customers';
import { AdminOffers } from './pages/admin/Offers';
import { AdminGallery } from './pages/admin/Gallery';
import { AdminReports } from './pages/admin/Reports';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes with PublicLayout */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:id" element={<ServiceDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/team" element={<Team />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/book-appointment" element={<BookAppointment />} />
              </Route>

              {/* Customer Lounge Routes with CustomerLayout */}
              <Route element={<CustomerLayout />}>
                <Route path="/dashboard" element={<CustomerDashboard />} />
                <Route path="/profile" element={<CustomerProfile />} />
                <Route path="/appointments" element={<CustomerAppointments />} />
                <Route path="/appointments/:id" element={<AppointmentDetails />} />
                <Route path="/favorites" element={<CustomerFavorites />} />
                <Route path="/reviews" element={<CustomerReviews />} />
              </Route>

              {/* Admin Portal Login (Standalone) */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin Portal Routes with AdminLayout */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="staff" element={<AdminStaff />} />
                <Route path="appointments" element={<AdminAppointments />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="offers" element={<AdminOffers />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="reports" element={<AdminReports />} />
              </Route>

              {/* Catch-all redirect to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </FavoritesProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
