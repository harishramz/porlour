import React, { useState, useEffect, useMemo } from 'react';
import { getCustomers, getAppointments } from '../../services/api';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Loading } from '../../components/Loading';
import {
  Users,
  Search,
  Eye,
  Calendar,
  Sparkles,
  DollarSign,
  Phone,
  Mail,
  MapPin
} from '../../components/icons';

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Customer Detail Modal
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custData, aptData] = await Promise.all([getCustomers(), getAppointments()]);
        setCustomers(custData);
        setAppointments(aptData);
      } catch (err) {
        console.error('Failed to load customers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'All' || c.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchQuery, statusFilter]);

  if (loading) {
    return <Loading text="Loading customer directory..." />;
  }

  // Get appointments for selected customer
  const customerApts = selectedCustomer
    ? appointments.filter((a) => a.customerEmail === selectedCustomer.email || a.customerName === selectedCustomer.name)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-1">
          Clientele Database
        </span>
        <h1 className="font-serif text-3xl font-bold text-charcoal-900">
          Customer Directory & Loyalty
        </h1>
        <p className="text-xs text-charcoal-500 mt-0.5">
          Review guest spending, history, beauty preferences, and tier status.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-beige-200 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full text-xs sm:text-sm pl-10 pr-3 py-2 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'VIP Customer', 'Bridal Elite', 'Active'].map((st) => (
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

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-beige-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-cream-50/70 border-b border-beige-200 text-charcoal-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Contact</th>
                <th className="py-3 px-4 font-semibold">Total Appointments</th>
                <th className="py-3 px-4 font-semibold">Total Spending</th>
                <th className="py-3 px-4 font-semibold">Last Visit</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-100 text-charcoal-700">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-beige-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={cust.avatar}
                        alt={cust.name}
                        className="w-10 h-10 rounded-full object-cover border border-gold-300 shadow-xs shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-charcoal-900">{cust.name}</p>
                        <p className="text-[11px] text-charcoal-400">ID: {cust.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="text-charcoal-800 font-medium">{cust.phone}</p>
                    <p className="text-[11px] text-charcoal-500">{cust.email}</p>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-charcoal-800">
                    {cust.totalAppointments} visits
                  </td>
                  <td className="py-3.5 px-4 font-serif font-bold text-charcoal-900">
                    ₹{cust.totalSpending.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-charcoal-600 whitespace-nowrap">
                    {cust.lastVisit}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="gold" size="sm">{cust.status}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Eye}
                      onClick={() => setSelectedCustomer(cust)}
                    >
                      Dossier
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Guest Profile: ${selectedCustomer.name}`}
          subtitle={`Tier: ${selectedCustomer.status} • Total Spend: ₹${selectedCustomer.totalSpending.toLocaleString('en-IN')}`}
          maxWidth="max-w-2xl"
          footer={
            <Button variant="secondary" onClick={() => setSelectedCustomer(null)}>
              Close Dossier
            </Button>
          }
        >
          <div className="space-y-5 text-xs sm:text-sm">
            {/* Header info */}
            <div className="p-4 rounded-xl bg-cream-50 border border-beige-200 flex items-center gap-4">
              <img
                src={selectedCustomer.avatar}
                alt={selectedCustomer.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gold-400"
              />
              <div className="space-y-0.5">
                <h4 className="font-serif text-xl font-bold text-charcoal-900">{selectedCustomer.name}</h4>
                <p className="text-charcoal-600 flex items-center gap-2">
                  <Phone size={13} className="text-gold-600" /> {selectedCustomer.phone}
                </p>
                <p className="text-charcoal-600 flex items-center gap-2">
                  <Mail size={13} className="text-gold-600" /> {selectedCustomer.email}
                </p>
              </div>
            </div>

            {/* Beauty Preferences */}
            {selectedCustomer.preferences && (
              <div className="p-4 rounded-xl bg-beige-50 border border-beige-200 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-700 block">
                  Bespoke Beauty Preferences & Skin Notes
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-charcoal-500 block">Skin Profile:</span>
                    <strong className="text-charcoal-800">{selectedCustomer.preferences.skinType}</strong>
                  </div>
                  <div>
                    <span className="text-charcoal-500 block">Hair Texture:</span>
                    <strong className="text-charcoal-800">{selectedCustomer.preferences.hairType}</strong>
                  </div>
                  <div>
                    <span className="text-charcoal-500 block">Sensitivities / Allergies:</span>
                    <strong className="text-rose-700">{selectedCustomer.preferences.allergies}</strong>
                  </div>
                  <div>
                    <span className="text-charcoal-500 block">Lounge Beverage:</span>
                    <strong className="text-charcoal-800">{selectedCustomer.preferences.favoriteBeverage}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Past & Upcoming Appointments */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-800 block mb-2">
                Recent Appointment History ({customerApts.length})
              </span>
              {customerApts.length === 0 ? (
                <p className="text-charcoal-500 text-xs italic">No appointments on record.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {customerApts.map((a) => (
                    <div
                      key={a.id}
                      className="p-3 rounded-lg bg-cream-50/70 border border-beige-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-charcoal-900">{a.serviceName}</p>
                        <p className="text-[11px] text-charcoal-500">
                          {a.formattedDate || a.date} at {a.time} • Stylist: {a.staffName}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-serif font-bold text-charcoal-900 block">
                          ₹{a.price.toLocaleString('en-IN')}
                        </span>
                        <Badge variant={a.status} size="sm">{a.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
