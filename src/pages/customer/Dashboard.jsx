import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useFavorites } from '../../context/FavoritesContext';
import { getAppointments, cancelAppointment, getServices } from '../../services/api';
import { AppointmentCard } from '../../components/AppointmentCard';
import { ServiceCard } from '../../components/ServiceCard';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import {
  Calendar,
  CheckCircle,
  Heart,
  Sparkles,
  User,
  Clock,
  ArrowRight,
  Plus
} from '../../components/icons';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { favoriteIds } = useFavorites();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [aptData, srvData] = await Promise.all([
        getAppointments(user?.id || 'cust-1'),
        getServices()
      ]);
      setAppointments(aptData);
      setServices(srvData);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleCancelAppointment = async (id, reason) => {
    try {
      await cancelAppointment(id, reason);
      addToast('Appointment cancelled successfully.', 'info');
      await fetchDashboardData();
    } catch (err) {
      console.error('Failed to cancel appointment', err);
      addToast('Failed to cancel appointment.', 'error');
    }
  };

  // Find upcoming appointments (Confirmed or Pending)
  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'Confirmed' || a.status === 'Pending'
  );
  const nextAppointment = upcomingAppointments[0];

  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const totalAppointmentsCount = appointments.length;

  // Favorite services list
  const favoriteServices = services.filter((s) => favoriteIds.includes(s.id)).slice(0, 3);

  if (loading) {
    return <Loading text="Preparing your private member lounge..." />;
  }

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-charcoal-950 via-charcoal-900 to-charcoal-950 text-white p-8 sm:p-10 shadow-floating border border-gold-600/30 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold flex items-center gap-1.5">
              <Sparkles size={14} /> VIP Sanctuary Lounge
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white">
              Welcome, <span className="font-normal italic text-gold-300">{user?.name || 'Harish'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-cream-200 max-w-xl font-light leading-relaxed">
              We look forward to pampering you. Review your scheduled rituals or book your next transformative session below.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link to="/book-appointment">
              <Button variant="gold" size="md" icon={Plus}>
                Book New Session
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" size="md" className="border-cream-300 text-cream-100 hover:bg-white/10">
                Preferences
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full filter blur-3xl pointer-events-none" />
      </div>

      {/* 4 Dashboard Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-beige-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-charcoal-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Upcoming</span>
            <div className="w-8 h-8 rounded-full bg-cream-100 text-gold-600 flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <div>
            <p className="font-serif text-3xl font-bold text-charcoal-900">
              {upcomingAppointments.length}
            </p>
            <p className="text-xs text-charcoal-500 mt-1">Confirmed or Pending</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-beige-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-charcoal-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Bookings</span>
            <div className="w-8 h-8 rounded-full bg-cream-100 text-gold-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div>
            <p className="font-serif text-3xl font-bold text-charcoal-900">
              {totalAppointmentsCount}
            </p>
            <p className="text-xs text-charcoal-500 mt-1">Lifetime Appointments</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-beige-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-charcoal-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
            <div className="w-8 h-8 rounded-full bg-cream-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
          </div>
          <div>
            <p className="font-serif text-3xl font-bold text-charcoal-900">
              {completedCount}
            </p>
            <p className="text-xs text-charcoal-500 mt-1">Services Enjoyed</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-beige-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-charcoal-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Saved Favorites</span>
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
              <Heart size={16} />
            </div>
          </div>
          <div>
            <p className="font-serif text-3xl font-bold text-charcoal-900">
              {favoriteIds.length}
            </p>
            <p className="text-xs text-charcoal-500 mt-1">Curated Treatments</p>
          </div>
        </div>
      </div>

      {/* Featured Upcoming Appointment Spotlight Card */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-gold-600" />
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900">
              Next Scheduled Appointment
            </h3>
          </div>
          <Link
            to="/appointments"
            className="text-xs sm:text-sm font-semibold text-gold-700 hover:text-gold-900 flex items-center gap-1"
          >
            All Appointments <ArrowRight size={13} />
          </Link>
        </div>

        {nextAppointment ? (
          <AppointmentCard
            appointment={nextAppointment}
            onCancelSuccess={handleCancelAppointment}
          />
        ) : (
          <EmptyState
            title="No upcoming appointments scheduled"
            description="You currently have no pending or confirmed bookings on your calendar. Ready for a rejuvenation session?"
            actionLabel="Book Your Treatment"
            onAction={() => navigate('/book-appointment')}
          />
        )}
      </div>

      {/* Recommended & Saved Favorites */}
      {favoriteServices.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-beige-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart size={18} className="text-rose-500" />
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900">
                Your Preferred Rituals
              </h3>
            </div>
            <Link
              to="/favorites"
              className="text-xs sm:text-sm font-semibold text-gold-700 hover:text-gold-900 flex items-center gap-1"
            >
              View All Favorites <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
