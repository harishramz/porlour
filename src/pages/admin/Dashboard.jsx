import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getAppointments,
  getReportsData,
  updateAppointmentStatus
} from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import {
  Calendar,
  DollarSign,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  X,
  Eye,
  Sparkles,
  ArrowRight
} from '../../components/icons';

export const AdminDashboard = () => {
  const { addToast } = useToast();
  const [reports, setReports] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const [repData, aptData] = await Promise.all([
        getReportsData(),
        getAppointments()
      ]);
      setReports(repData);
      setAppointments(aptData);
    } catch (err) {
      console.error('Failed to load admin dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleStatusChange = async (aptId, newStatus) => {
    try {
      await updateAppointmentStatus(aptId, newStatus);
      addToast(`Appointment #${aptId} marked as ${newStatus}.`, 'success');
      await fetchDashboard();
    } catch (err) {
      console.error('Status update failed', err);
      addToast('Failed to update status.', 'error');
    }
  };

  if (loading || !reports) {
    return <Loading text="Aggregating real-time salon operations..." />;
  }

  // Filter Today's Appointments (or recent list of active appointments)
  const todayAppointments = appointments.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* 4 Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Today's Appointments */}
        <div className="bg-white p-6 rounded-2xl border border-beige-200 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Today's Appointments
            </span>
            <p className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
              {reports.summary.todayAppointments}
            </p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp size={12} /> +15% vs yesterday
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cream-100 text-gold-600 flex items-center justify-center">
            <Calendar size={22} />
          </div>
        </div>

        {/* Metric 2: Total Customers */}
        <div className="bg-white p-6 rounded-2xl border border-beige-200 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Total Customers
            </span>
            <p className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
              {reports.summary.totalCustomers}
            </p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp size={12} /> +12 new this month
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cream-100 text-gold-600 flex items-center justify-center">
            <Users size={22} />
          </div>
        </div>

        {/* Metric 3: Monthly Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-beige-200 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Monthly Revenue
            </span>
            <p className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
              ₹{reports.summary.monthlyRevenue.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp size={12} /> +8.4% target pacing
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cream-100 text-gold-600 flex items-center justify-center">
            <DollarSign size={22} />
          </div>
        </div>

        {/* Metric 4: Pending Appointments */}
        <div className="bg-white p-6 rounded-2xl border border-beige-200 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Pending Verification
            </span>
            <p className="font-serif text-3xl font-bold text-amber-600 mt-1">
              {reports.summary.pendingAppointments}
            </p>
            <span className="text-[11px] text-charcoal-400 block mt-1">Requires confirmation</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={22} />
          </div>
        </div>
      </div>

      {/* Analytics Charts Section (Weekly Trends & Popular Services) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Appointments Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-2xl border border-beige-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900">
                Weekly Appointments Pacing
              </h3>
              <p className="text-xs text-charcoal-500">Daily booking volume over the current week</p>
            </div>
            <span className="text-xs font-semibold text-gold-700 bg-cream-100 px-3 py-1 rounded-full border border-gold-200">
              Peak: Saturday
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-56 pt-6 flex items-end justify-between gap-3 sm:gap-6 border-b border-beige-200 pb-2">
            {reports.weeklyTrends.map((d, i) => {
              const maxVal = 35;
              const heightPct = Math.round((d.appointments / maxVal) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-bold text-charcoal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.appointments}
                  </span>
                  <div
                    className="w-full max-w-[36px] bg-gradient-to-t from-charcoal-900 to-charcoal-700 rounded-t-lg group-hover:from-gold-600 group-hover:to-gold-500 transition-all cursor-pointer"
                    style={{ height: `${heightPct}%` }}
                    title={`${d.day}: ${d.appointments} appointments (₹${d.revenue})`}
                  />
                  <span className="text-[11px] font-semibold text-charcoal-500 mt-1">{d.day}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-xs text-charcoal-500 pt-1">
            <span>Weekday Avg: 16 slots/day</span>
            <span>Weekend Avg: 30 slots/day</span>
          </div>
        </div>

        {/* Popular Services Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-2xl border border-beige-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900">
                Top Revenue Services
              </h3>
              <p className="text-xs text-charcoal-500">Highest grossing salon rituals</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {reports.topServices.map((srv, idx) => {
              const maxRev = 700000;
              const barWidth = Math.round((srv.revenue / maxRev) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-charcoal-800 truncate font-semibold">{srv.name}</span>
                    <span className="text-charcoal-500 font-mono text-[11px] shrink-0">
                      ₹{(srv.revenue / 1000).toFixed(0)}k ({srv.bookings})
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-beige-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Today's Appointments Master Table */}
      <div className="bg-white rounded-2xl border border-beige-200 shadow-subtle overflow-hidden">
        <div className="p-6 border-b border-beige-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-charcoal-900">
              Today's Appointments Roster
            </h3>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Live schedule of appointments booked at Aura Luxe
            </p>
          </div>
          <Link to="/admin/appointments">
            <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
              View All Appointments
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-cream-50/70 border-b border-beige-200 text-charcoal-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Service</th>
                <th className="py-3 px-4 font-semibold">Staff</th>
                <th className="py-3 px-4 font-semibold">Time</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-100 text-charcoal-700">
              {todayAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-beige-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-charcoal-900">
                    <div className="flex flex-col">
                      <span>{apt.customerName}</span>
                      <span className="text-[11px] text-charcoal-400">{apt.customerPhone}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-charcoal-800">
                    {apt.serviceName}
                  </td>
                  <td className="py-3.5 px-4 text-charcoal-600">
                    {apt.staffName}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-charcoal-900 whitespace-nowrap">
                    {apt.time}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={apt.status}>{apt.status}</Badge>
                  </td>
                  <td className="py-3.5 px-4 font-serif font-bold text-charcoal-900 whitespace-nowrap">
                    ₹{apt.price.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {apt.status === 'Pending' && (
                        <button
                          onClick={() => handleStatusChange(apt.id, 'Confirmed')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold"
                          title="Confirm Appointment"
                        >
                          Confirm
                        </button>
                      )}
                      {apt.status === 'Confirmed' && (
                        <button
                          onClick={() => handleStatusChange(apt.id, 'Completed')}
                          className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold"
                          title="Complete Appointment"
                        >
                          Complete
                        </button>
                      )}
                      {apt.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleStatusChange(apt.id, 'Cancelled')}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50"
                          title="Cancel"
                        >
                          <X size={15} />
                        </button>
                      )}
                      <Link
                        to={`/appointments/${apt.id}`}
                        className="p-1 rounded-lg text-charcoal-500 hover:bg-beige-100"
                        title="View Full Receipt"
                      >
                        <Eye size={15} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
