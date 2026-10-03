import React, { useState, useEffect, useMemo } from 'react';
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

export const AdminAppointments = () => {
  const { addToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Manual Add Appointment Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newApt, setNewApt] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceId: '',
    staffId: 'staff-1',
    date: '2026-10-12',
    time: '11:00 AM',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // View details modal
  const [viewApt, setViewApt] = useState(null);

  const fetchAllAppointments = async () => {
    try {
      const [aptData, srvData, stData] = await Promise.all([
        getAppointments(),
        getServices(),
        getStaff()
      ]);
      setAppointments(aptData);
      setServices(srvData);
      setStaffList(stData);
      if (srvData.length > 0 && !newApt.serviceId) {
        setNewApt((prev) => ({ ...prev, serviceId: srvData[0].id }));
      }
    } catch (err) {
      console.error('Failed to load appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAppointments();
  }, []);

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
    setSubmitting(true);
    try {
      const selectedService = services.find((s) => s.id === newApt.serviceId) || services[0];
      const selectedStaff = staffList.find((s) => s.id === newApt.staffId) || staffList[0];

      await createAppointment({
        customerId: `cust-admin-${Date.now().toString().slice(-4)}`,
        customerName: newApt.customerName,
        customerEmail: newApt.customerEmail || 'walkin@auraluxe.com',
        customerPhone: newApt.customerPhone,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        category: selectedService.category,
        staffId: selectedStaff.id,
        staffName: selectedStaff.name,
        date: newApt.date,
        formattedDate: new Date(newApt.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        time: newApt.time,
        duration: selectedService.duration,
        price: selectedService.price,
        notes: newApt.notes,
        status: 'Confirmed'
      });
      addToast('Manual appointment created successfully.', 'success');
      setAddModalOpen(false);
      await fetchAllAppointments();
    } catch (err) {
      console.error('Error creating manual booking', err);
      addToast('Failed to create appointment.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesStatus =
        statusFilter === 'All' || apt.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesSearch =
        apt.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.staffName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.id?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [appointments, statusFilter, searchQuery]);

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
            Audit, confirm, reschedule, and manage all parlour bookings.
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
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-100 text-charcoal-700">
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
