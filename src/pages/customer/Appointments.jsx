import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getAppointments, cancelAppointment } from '../../services/api';
import { AppointmentCard } from '../../components/AppointmentCard';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { Button } from '../../components/Button';
import { Calendar, Plus } from '../../components/icons';

export const CustomerAppointments = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'completed', 'cancelled'

  const fetchAppointments = async () => {
    try {
      const data = await getAppointments(user?.id || 'cust-1');
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleCancel = async (id, reason) => {
    try {
      await cancelAppointment(id, reason);
      addToast('Appointment has been cancelled successfully.', 'info');
      await fetchAppointments();
    } catch (err) {
      console.error('Cancellation failed', err);
      addToast('Failed to cancel appointment.', 'error');
    }
  };

  const upcomingList = appointments.filter(
    (a) => a.status === 'Confirmed' || a.status === 'Pending'
  );
  const completedList = appointments.filter((a) => a.status === 'Completed');
  const cancelledList = appointments.filter((a) => a.status === 'Cancelled');

  const displayedList =
    activeTab === 'upcoming'
      ? upcomingList
      : activeTab === 'completed'
      ? completedList
      : cancelledList;

  if (loading) {
    return <Loading text="Retrieving your parlour appointments history..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-1">
            Reservations Agenda
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
            My Appointments
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            Track, review, or reschedule your upcoming and historic parlour visits.
          </p>
        </div>

        <Link to="/book-appointment">
          <Button variant="gold" size="md" icon={Plus}>
            Book New Ritual
          </Button>
        </Link>
      </div>

      {/* Tabs Bar: Upcoming, Completed, Cancelled */}
      <div className="flex items-center gap-2 border-b border-beige-200 pb-3">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'upcoming'
              ? 'bg-charcoal-900 text-gold-400 shadow-sm'
              : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-beige-100'
          }`}
        >
          Upcoming ({upcomingList.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'completed'
              ? 'bg-charcoal-900 text-gold-400 shadow-sm'
              : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-beige-100'
          }`}
        >
          Completed ({completedList.length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'cancelled'
              ? 'bg-charcoal-900 text-gold-400 shadow-sm'
              : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-beige-100'
          }`}
        >
          Cancelled ({cancelledList.length})
        </button>
      </div>

      {/* Appointment Cards List */}
      {displayedList.length === 0 ? (
        <EmptyState
          title={`No ${activeTab} appointments`}
          description={
            activeTab === 'upcoming'
              ? 'You have no treatments currently scheduled. Treat yourself to a session today!'
              : `You do not have any ${activeTab} appointments in your history.`
          }
          actionLabel={activeTab === 'upcoming' ? 'Book an Appointment' : undefined}
          onAction={activeTab === 'upcoming' ? () => (window.location.href = '/book-appointment') : undefined}
        />
      ) : (
        <div className="space-y-4">
          {displayedList.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancelSuccess={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
};
