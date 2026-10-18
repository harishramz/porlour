import React, { useState, useEffect, useMemo } from 'react';
import { createCustomer, deleteCustomer, getCustomers, getAppointments, setCustomerVipStatus } from '../../services/api';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Loading } from '../../components/Loading';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Search,
  Eye,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Star
} from '../../components/icons';
import { DEFAULT_PROFILE_IMAGE, getCustomerProfileImage } from '../../utils/profileImage';

export const AdminCustomers = () => {
  const { addToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Customer Detail Modal
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalCustomer, setDeleteModalCustomer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', phone: '', isVip: false });

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
      const matchesStatus = statusFilter === 'All' ||
        (statusFilter === 'VIP Customer' ? c.isVip : c.status.toLowerCase() === statusFilter.toLowerCase());
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

  const handleAddCustomer = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const customer = await createCustomer(customerForm);
      setCustomers((current) => [customer, ...current]);
      setCustomerForm({ name: '', email: '', phone: '', isVip: false });
      setAddModalOpen(false);
      addToast(
        `Customer ${customer.name} added${customer.invitationSent ? '. An invitation email has been sent.' : '.'}`,
        'success'
      );
    } catch (error) {
      console.error('Failed to add customer', error);
      addToast(error.message || 'Failed to add customer.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleVip = async (customer) => {
    const nextIsVip = !customer.isVip;
    setSubmitting(true);
    try {
      await setCustomerVipStatus(customer.id, nextIsVip);
      setCustomers((current) => current.map((record) => (
        record.id === customer.id ? { ...record, isVip: nextIsVip } : record
      )));
      if (selectedCustomer?.id === customer.id) {
        setSelectedCustomer((current) => ({ ...current, isVip: nextIsVip }));
      }
      addToast(`${customer.name} ${nextIsVip ? 'marked as' : 'removed as'} a VIP customer.`, 'success');
    } catch (error) {
      console.error('Failed to update VIP customer status', error);
      addToast(error.message || 'Failed to update VIP customer status.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!deleteModalCustomer) return;
    setSubmitting(true);
    try {
      await deleteCustomer(deleteModalCustomer.id);
      setCustomers((current) => current.filter((customer) => customer.id !== deleteModalCustomer.id));
      setAppointments((current) => current.filter((appointment) => (
        appointment.customerId !== deleteModalCustomer.id &&
        appointment.customerEmail !== deleteModalCustomer.email
      )));
      if (selectedCustomer?.id === deleteModalCustomer.id) setSelectedCustomer(null);
      addToast(`${deleteModalCustomer.name} and their appointment history were deleted.`, 'info');
      setDeleteModalCustomer(null);
    } catch (error) {
      console.error('Failed to delete customer', error);
      addToast(error.message || 'Failed to delete customer.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
        <Button variant="gold" icon={Plus} onClick={() => setAddModalOpen(true)}>
          Add Customer
        </Button>
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
          {['All', 'VIP Customer', 'Active'].map((st) => (
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
                        src={getCustomerProfileImage(cust.avatar)}
                        alt={cust.name}
                        className="w-10 h-10 rounded-full object-cover border border-gold-300 shadow-xs shrink-0"
                        onError={(event) => {
                          event.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                        }}
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
                    {cust.isVip
                      ? <Badge variant="vip" size="sm">VIP Customer</Badge>
                      : <Badge variant="gold" size="sm">{cust.status}</Badge>}
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
                    <Button
                      variant={cust.isVip ? 'gold' : 'secondary'}
                      size="sm"
                      icon={Star}
                      className="ml-2"
                      disabled={submitting}
                      onClick={() => handleToggleVip(cust)}
                    >
                      {cust.isVip ? 'Remove VIP' : 'Add VIP'}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      className="ml-2"
                      onClick={() => setDeleteModalCustomer(cust)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-charcoal-500">
                    No customers match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={addModalOpen}
        onClose={() => !submitting && setAddModalOpen(false)}
        title="Add Customer"
        subtitle="Add contact details to the customer directory."
        footer={
          <>
            <Button variant="secondary" disabled={submitting} onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" type="submit" form="add-customer-form" loading={submitting}>
              Add Customer
            </Button>
          </>
        }
      >
        <form id="add-customer-form" className="space-y-4" onSubmit={handleAddCustomer}>
          <label className="block text-xs font-semibold text-charcoal-700">
            Full name
            <input
              required
              maxLength={120}
              autoComplete="name"
              value={customerForm.name}
              onChange={(event) => setCustomerForm((form) => ({ ...form, name: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-beige-300 px-3 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold text-charcoal-700">
            <input
              type="checkbox"
              checked={customerForm.isVip}
              onChange={(event) => setCustomerForm((form) => ({ ...form, isVip: event.target.checked }))}
              className="h-4 w-4 accent-amber-600"
            />
            Mark this customer as VIP
          </label>
          <label className="block text-xs font-semibold text-charcoal-700">
            Email address
            <input
              required
              type="email"
              maxLength={254}
              autoComplete="email"
              value={customerForm.email}
              onChange={(event) => setCustomerForm((form) => ({ ...form, email: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-beige-300 px-3 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </label>
          <label className="block text-xs font-semibold text-charcoal-700">
            Phone number
            <input
              type="tel"
              maxLength={40}
              autoComplete="tel"
              value={customerForm.phone}
              onChange={(event) => setCustomerForm((form) => ({ ...form, phone: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-beige-300 px-3 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </label>
          <p className="text-xs text-charcoal-500">
            Live accounts receive an email invitation so the customer can set up account access.
          </p>
        </form>
      </Modal>

      <Modal
        isOpen={!!deleteModalCustomer}
        onClose={() => !submitting && setDeleteModalCustomer(null)}
        title="Delete Customer?"
        subtitle={deleteModalCustomer?.name}
        footer={
          <>
            <Button variant="secondary" disabled={submitting} onClick={() => setDeleteModalCustomer(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={submitting} onClick={handleDeleteCustomer}>
              Delete Customer
            </Button>
          </>
        }
      >
        <p className="text-sm text-charcoal-600">
          This permanently deletes the customer account and all associated appointment history. This action cannot be undone.
        </p>
      </Modal>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Guest Profile: ${selectedCustomer.name}`}
          subtitle={`${selectedCustomer.isVip ? 'VIP Customer • ' : ''}Status: ${selectedCustomer.status} • Total Spend: ₹${selectedCustomer.totalSpending.toLocaleString('en-IN')}`}
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
                src={getCustomerProfileImage(selectedCustomer.avatar)}
                alt={selectedCustomer.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gold-400"
                onError={(event) => {
                  event.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                }}
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
