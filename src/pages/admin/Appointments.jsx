import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  getAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  createAppointment,
  getServices,
  getStaff
} from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Loading } from '../../components/Loading';
import {
  Calendar,
  Clock,
  User,
  Plus,
  Search,
  Filter,
  CheckCircle,
  X,
  Eye,
  Scissors
} from '../../components/icons';
import { getPaymentMethodLabel, PAYMENT_METHODS } from '../../utils/payment';

const getTodayDate = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());
  const part = (type) => parts.find((item) => item.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
};

const getTimeMinutes = (time) => {
  const match = time?.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  const hour = Number(match[1]) % 12 + (match[3].toUpperCase() === 'PM' ? 12 : 0);
  return hour * 60 + Number(match[2]);
};

export const AdminAppointments = () => {
  const { addToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateView, setDateView] = useState('today');

  // Manual Add Appointment Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newApt, setNewApt] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceId: '',
    staffId: '',
    paymentMethod: PAYMENT_METHODS.AFTER_TREATMENT,
    date: getTodayDate(),
    time: '11:00 AM',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const knownAppointmentIds = useRef(null);
  const [browserNotificationPermission, setBrowserNotificationPermission] = useState(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  );

  // View details modal
  const [viewApt, setViewApt] = useState(null);

  const fetchAllAppointments = async ({ announceNew = false } = {}) => {
    try {
      const [aptData, srvData, stData] = await Promise.all([
        getAppointments(),
        getServices(),
        getStaff()
      ]);
      const newAppointments = knownAppointmentIds.current
        ? aptData.filter((appointment) => !knownAppointmentIds.current.has(appointment.id))
        : [];
      knownAppointmentIds.current = new Set(aptData.map((appointment) => appointment.id));
      setAppointments(aptData);
      setServices(srvData);
      setStaffList(stData);
      if (srvData.length > 0 && !newApt.serviceId) {
        setNewApt((prev) => ({ ...prev, serviceId: srvData[0].id }));
      }
      if (announceNew && newAppointments.length > 0) {
        for (const appointment of newAppointments) {
          const message = `${appointment.customerName || 'A customer'} booked ${appointment.serviceName || 'a service'} for ${appointment.date} at ${appointment.time}.`;
          addToast(`New appointment: ${message}`, 'success');
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New appointment booked', { body: message });
          }
        }
      }
    } catch (err) {
      console.error('Failed to load appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAppointments();
    const poll = window.setInterval(() => fetchAllAppointments({ announceNew: true }), 15000);
    return () => window.clearInterval(poll);
  }, []);

  const enableBrowserNotifications = async () => {
    if (!('Notification' in window)) {
      addToast('This browser does not support notifications. Keep the Appointments page open for in-app alerts.', 'info');
      return;
    }
    const permission = await Notification.requestPermission();
    setBrowserNotificationPermission(permission);
    addToast(
      permission === 'granted'
        ? 'Browser appointment alerts enabled.'
        : 'Browser alerts were not enabled. In-app alerts will still appear while this page is open.',
      permission === 'granted' ? 'success' : 'info'
    );
  };

  const handleStatusChange = async (aptId, newStatus) => {
    try {
      if (newStatus === 'Cancelled') {
        await cancelAppointment(aptId, 'Admin administrative action');
      } else {
        await updateAppointmentStatus(aptId, newStatus);
      }
      addToast(`Appointment #${aptId} marked as ${newStatus}.`, 'success');
      await fetchAllAppointments();
      if (viewApt && viewApt.id === aptId) {
        setViewApt((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Failed to change appointment status', err);
      addToast('Status update failed.', 'error');
    }
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    if (!newApt.customerName || !newApt.customerPhone) {
      addToast('Customer Name and Phone are required.', 'error');
      return;
    }
    const selectedService = services.find((service) => service.id === newApt.serviceId);
    if (!selectedService) {
      addToast('Add a service in the service catalog before scheduling an appointment.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const selectedStaff = staffList.find((staff) => staff.id === newApt.staffId);

      const appointment = await createAppointment({
        customerId: null,
        customerName: newApt.customerName,
        customerEmail: newApt.customerEmail.trim() || undefined,
        customerPhone: newApt.customerPhone,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        category: selectedService.category,
        staffId: selectedStaff?.id || null,
        staffName: selectedStaff?.name || 'Any available specialist',
        date: newApt.date,
        formattedDate: new Date(`${newApt.date}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        time: newApt.time,
        duration: selectedService.duration,
        price: selectedService.price,
        paymentMethod: newApt.paymentMethod,
        notes: newApt.notes,
        status: 'Confirmed'
      });
      addToast('Manual appointment created successfully.', 'success');
      setAddModalOpen(false);
      setNewApt({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        serviceId: services[0]?.id || '',
        staffId: '',
        paymentMethod: PAYMENT_METHODS.AFTER_TREATMENT,
        date: getTodayDate(),
        time: '11:00 AM',
        notes: ''
      });
      await fetchAllAppointments();
    } catch (err) {
      console.error('Error creating manual booking', err);
      addToast(err.message || 'Failed to create appointment.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const todayKey = getTodayDate();
  const dateFilteredAppointments = useMemo(() => {
    const matchesView = (appointment) => {
      if (dateView === 'today') return appointment.date === todayKey;
      return appointment.date < todayKey;
    };
    return appointments
      .filter(matchesView)
      .sort((first, second) => {
        const dateOrder = first.date.localeCompare(second.date);
        const timeOrder = getTimeMinutes(first.time) - getTimeMinutes(second.time);
        const order = dateOrder || timeOrder;
        return dateView === 'history' ? -order : order;
      });
  }, [appointments, dateView, todayKey]);

  const filteredAppointments = useMemo(() => {
    return dateFilteredAppointments.filter((apt) => {
      const matchesStatus =
        statusFilter === 'All' || apt.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesSearch =
        apt.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.staffName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.id?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [dateFilteredAppointments, statusFilter, searchQuery]);

  const appointmentViews = [
    { id: 'today', label: "Today's Appointments", count: appointments.filter((appointment) => appointment.date === todayKey).length },
    { id: 'history', label: 'Appointment History', count: appointments.filter((appointment) => appointment.date < todayKey).length }
  ];

  if (loading) {
    return <Loading text="Loading master salon schedule..." />;
  }

  const statuses = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-1">
            Appointment Control
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Manage Appointments
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Today’s schedule is shown first. Switch views to see future bookings or past appointment history.
          </p>
        </div>

        <Button
          variant="gold"
          size="md"
          icon={Plus}
          onClick={() => setAddModalOpen(true)}
        >
          Book Walk-in / Phone Client
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={enableBrowserNotifications}
          disabled={browserNotificationPermission === 'granted'}
        >
          {browserNotificationPermission === 'granted' ? 'Browser Alerts Enabled' : 'Enable Browser Alerts'}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Appointments by date">
        {appointmentViews.map((view) => (
          <button
            key={view.id}
            type="button"
            role="tab"
            aria-selected={dateView === view.id}
            onClick={() => setDateView(view.id)}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
              dateView === view.id
                ? 'border-charcoal-900 bg-charcoal-900 text-gold-300'
                : 'border-beige-200 bg-white text-charcoal-700 hover:bg-cream-50'
            }`}
          >
            {view.label}
            <span className={`rounded-full px-2 py-0.5 text-xs ${
              dateView === view.id ? 'bg-white/15 text-white' : 'bg-beige-100 text-charcoal-600'
            }`}>
              {view.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-beige-200 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer, service, ID..."
            className="w-full text-xs sm:text-sm pl-10 pr-3 py-2 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                statusFilter.toLowerCase() === st.toLowerCase()
                  ? 'bg-charcoal-900 text-gold-300 shadow-sm'
                  : 'bg-beige-100 text-charcoal-700 hover:bg-beige-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl border border-beige-200 shadow-subtle overflow-hidden">
        <div className="border-b border-beige-200 px-4 py-3">
          <h2 className="font-semibold text-charcoal-900">
            {dateView === 'today'
              ? `Today's Appointments · ${new Intl.DateTimeFormat('en-IN', {
                  timeZone: 'Asia/Kolkata',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }).format(new Date())}`
              : 'Appointment History'}
          </h2>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Showing {filteredAppointments.length} appointment{filteredAppointments.length === 1 ? '' : 's'}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-cream-50/70 border-b border-beige-200 text-charcoal-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-semibold">Ref</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Service</th>
                <th className="py-3 px-4 font-semibold">Staff</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Time</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Payment Method</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-100 text-charcoal-700">
              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-sm text-charcoal-500">
                    {dateFilteredAppointments.length === 0
                      ? dateView === 'today'
                        ? 'No appointments are scheduled for today.'
                        : 'There is no past appointment history.'
                      : 'No appointments match the selected search and status filters.'}
                  </td>
                </tr>
              )}
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-beige-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs font-bold text-charcoal-500 whitespace-nowrap">
                    #{apt.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-charcoal-900">
                    <div>
                      <p className="font-semibold">{apt.customerName}</p>
                      <p className="text-[11px] text-charcoal-400">{apt.customerPhone}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-charcoal-800">
                    {apt.serviceName}
                  </td>
                  <td className="py-3 px-4 text-charcoal-600 whitespace-nowrap">
                    {apt.staffName}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-charcoal-700">
                    {apt.formattedDate || apt.date}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-medium text-charcoal-900">
                    {apt.time}
                  </td>
                  <td className="py-3 px-4 font-serif font-bold text-charcoal-900 whitespace-nowrap">
                    ₹{apt.price.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-xs">
                    {getPaymentMethodLabel(apt.paymentMethod)}
                    {apt.paymentMethod === PAYMENT_METHODS.ONLINE && (
                      <span className="block text-[10px] text-emerald-700">
                        {apt.paymentStatus === 'captured' ? 'Captured' : 'Pending'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge variant={apt.status}>{apt.status}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {apt.status === 'Pending' && (
                        <button
                          onClick={() => handleStatusChange(apt.id, 'Confirmed')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs font-semibold"
                          title="Confirm Appointment"
                        >
                          Confirm
                        </button>
                      )}
                      {apt.status === 'Confirmed' && (
                        <button
                          onClick={() => handleStatusChange(apt.id, 'Completed')}
                          className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 hover:bg-sky-200 text-xs font-semibold"
                          title="Complete Appointment"
                        >
                          Complete
                        </button>
                      )}
                      {apt.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleStatusChange(apt.id, 'Cancelled')}
                          className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 text-xs font-semibold"
                          title="Cancel"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => setViewApt(apt)}
                        className="p-1 rounded-lg text-charcoal-600 hover:bg-beige-100"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Appointment Details Modal */}
      {viewApt && (
        <Modal
          isOpen={!!viewApt}
          onClose={() => setViewApt(null)}
          title={`Booking Dossier: #${viewApt.id}`}
          subtitle={`Status: ${viewApt.status}`}
          footer={
            <Button variant="secondary" onClick={() => setViewApt(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-cream-50 border border-beige-200 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block">Service</span>
                <p className="font-serif text-lg font-bold text-charcoal-900">{viewApt.serviceName}</p>
                <p className="text-xs text-charcoal-600 mt-0.5">Specialist: {viewApt.staffName}</p>
              </div>
              <span className="font-serif text-2xl font-bold text-charcoal-900">
                ₹{viewApt.price.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-beige-50">
                <span className="text-charcoal-500 text-[10px] uppercase block">Guest Name</span>
                <strong className="text-charcoal-900">{viewApt.customerName}</strong>
              </div>
              <div className="p-3 rounded-lg bg-beige-50">
                <span className="text-charcoal-500 text-[10px] uppercase block">Phone</span>
                <strong className="text-charcoal-900">{viewApt.customerPhone}</strong>
              </div>
              <div className="p-3 rounded-lg bg-beige-50">
                <span className="text-charcoal-500 text-[10px] uppercase block">Scheduled Date</span>
                <strong className="text-charcoal-900">{viewApt.formattedDate || viewApt.date}</strong>
              </div>
              <div className="p-3 rounded-lg bg-beige-50">
                <span className="text-charcoal-500 text-[10px] uppercase block">Scheduled Time</span>
                <strong className="text-gold-700">{viewApt.time}</strong>
              </div>
              <div className="p-3 rounded-lg bg-beige-50">
                <span className="text-charcoal-500 text-[10px] uppercase block">Payment Method</span>
                <strong className="text-charcoal-900">{getPaymentMethodLabel(viewApt.paymentMethod)}</strong>
                {viewApt.paymentMethod === PAYMENT_METHODS.ONLINE && (
                  <span className="block text-[10px] text-amber-700">Payment not processed</span>
                )}
              </div>
            </div>

            {viewApt.notes && (
              <div className="p-3.5 rounded-xl bg-cream-50/70 border border-beige-200 text-charcoal-700 italic">
                Notes: "{viewApt.notes}"
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Manual Booking Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Manual / Walk-in Booking"
        subtitle="Schedule an appointment directly from salon reception"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateAppointment} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Guest Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newApt.customerName}
                onChange={(e) => setNewApt({ ...newApt, customerName: e.target.value })}
                placeholder="e.g. Shalini Nair"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={newApt.customerPhone}
                onChange={(e) => setNewApt({ ...newApt, customerPhone: e.target.value })}
                placeholder="+91 98450 12345"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Select Service
              </label>
              <select
                required
                value={newApt.serviceId}
                onChange={(e) => setNewApt({ ...newApt, serviceId: e.target.value })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (₹{s.price})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Select Specialist
              </label>
              <select
                value={newApt.staffId}
                onChange={(e) => setNewApt({ ...newApt, staffId: e.target.value })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white"
              >
                <option value="">Any available specialist</option>
                {staffList.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                min={getTodayDate()}
                value={newApt.date}
                onChange={(e) => setNewApt({ ...newApt, date: e.target.value })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Time Slot
              </label>
              <select
                value={newApt.time}
                onChange={(e) => setNewApt({ ...newApt, time: e.target.value })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white"
              >
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="05:00 PM">05:00 PM</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Payment Method
              </label>
              <select
                value={newApt.paymentMethod}
                onChange={(event) => setNewApt({ ...newApt, paymentMethod: event.target.value })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white"
              >
                <option value={PAYMENT_METHODS.AFTER_TREATMENT}>Pay after treatment</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-beige-200">
            <Button
              variant="secondary"
              onClick={() => setAddModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gold"
              loading={submitting}
              icon={CheckCircle}
            >
              Schedule Booking
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
