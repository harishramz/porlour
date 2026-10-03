import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAppointmentById, cancelAppointment } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Loading } from '../../components/Loading';
import {
  Calendar,
  Clock,
  User,
  Scissors,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Download,
  MapPin,
  Phone,
  Sparkles
} from '../../components/icons';

export const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchApt = async () => {
      try {
        const data = await getAppointmentById(id);
        setAppointment(data);
      } catch (err) {
        console.error('Failed to load appointment details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApt();
  }, [id]);

  const handleCancel = async () => {
    setSubmitting(true);
    try {
      const updated = await cancelAppointment(appointment.id, cancelReason);
      setAppointment(updated);
      setShowCancelModal(false);
      addToast('Appointment cancelled successfully.', 'info');
    } catch (err) {
      console.error('Cancellation failed', err);
      addToast('Failed to cancel appointment.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading text="Loading reservation dossier..." />;
  }

  if (!appointment) {
    return (
      <div className="text-center py-20">
        <h3 className="font-serif text-2xl font-bold text-charcoal-900 mb-2">Appointment Not Found</h3>
        <p className="text-sm text-charcoal-600 mb-6">We could not locate this appointment reference.</p>
        <Link to="/appointments">
          <Button variant="primary">Return to Appointments</Button>
        </Link>
      </div>
    );
  }

  const canCancel = appointment.status === 'Confirmed' || appointment.status === 'Pending';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top back bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/appointments"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-charcoal-600 hover:text-charcoal-950"
        >
          <ArrowLeft size={16} /> Back to Appointments List
        </Link>
        <Button
          variant="outline"
          size="sm"
          icon={Download}
          onClick={() => window.print()}
        >
          Print Receipt
        </Button>
      </div>

      {/* Main Receipt Sheet */}
      <div className="bg-white rounded-3xl border border-beige-200 p-8 sm:p-12 shadow-floating space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-beige-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-charcoal-400">#{appointment.id}</span>
              <Badge variant={appointment.status}>{appointment.status}</Badge>
            </div>
            <h1 className="font-serif text-3xl font-bold text-charcoal-900">
              {appointment.serviceName}
            </h1>
            <p className="text-xs text-charcoal-500 mt-1">
              Booked on {new Date(appointment.createdAt || Date.now()).toLocaleDateString('en-GB')}
            </p>
          </div>

          <div className="sm:text-right">
            <span className="text-xs text-charcoal-400 uppercase tracking-wider block">Total Amount</span>
            <span className="font-serif text-3xl font-bold text-charcoal-900">
              ₹{appointment.price.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Schedule & Specialist Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-cream-50/80 border border-beige-200/80 space-y-1">
            <span className="text-xs uppercase tracking-wider text-charcoal-500 block font-semibold">
              Date & Schedule
            </span>
            <p className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <Calendar size={16} className="text-gold-600" />
              {appointment.formattedDate || appointment.date}
            </p>
            <p className="text-xs text-charcoal-600 flex items-center gap-1.5 mt-0.5">
              <Clock size={13} className="text-gold-600" />
              {appointment.time} ({appointment.duration})
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50/80 border border-beige-200/80 space-y-1">
            <span className="text-xs uppercase tracking-wider text-charcoal-500 block font-semibold">
              Assigned Specialist
            </span>
            <p className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <User size={16} className="text-gold-600" />
              {appointment.staffName}
            </p>
            <p className="text-xs text-charcoal-600">Senior Beauty Practitioner</p>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50/80 border border-beige-200/80 space-y-1">
            <span className="text-xs uppercase tracking-wider text-charcoal-500 block font-semibold">
              Parlour Location
            </span>
            <p className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <MapPin size={16} className="text-gold-600" />
              Aura Luxe Sanctuary
            </p>
            <p className="text-xs text-charcoal-600">Race Course, Coimbatore</p>
          </div>
        </div>

        {/* Customer Notes */}
        <div className="p-5 rounded-2xl bg-beige-50/60 border border-beige-200/70">
          <h4 className="text-xs uppercase font-bold text-charcoal-700 tracking-wider mb-1">
            Special Requests & Notes
          </h4>
          <p className="text-xs sm:text-sm text-charcoal-600 italic">
            {appointment.notes ? `"${appointment.notes}"` : 'No special dietary or fragrance allergies indicated.'}
          </p>
        </div>

        {/* Payment Policy Breakdown */}
        <div className="border-t border-beige-200 pt-6 space-y-2 text-xs text-charcoal-600">
          <div className="flex justify-between py-1">
            <span>Base Service Fee:</span>
            <span>₹{(appointment.price * 0.82).toFixed(0)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Sterilization & Consumables Kit:</span>
            <span>₹{(appointment.price * 0.18).toFixed(0)}</span>
          </div>
          <div className="flex justify-between py-1 font-bold text-charcoal-900 text-sm border-t border-beige-100 pt-2">
            <span>Grand Total:</span>
            <span className="text-base font-serif">₹{appointment.price.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-[11px] text-charcoal-400 italic pt-1">
            Payment will be settled on-site following treatment completion.
          </p>
        </div>

        {/* Actions Footer */}
        {canCancel && (
          <div className="pt-6 border-t border-beige-200 flex justify-end gap-3">
            <Button
              variant="danger"
              size="md"
              onClick={() => setShowCancelModal(true)}
            >
              Cancel Appointment
            </Button>
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Appointment"
        subtitle={`Booking #${appointment.id}`}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowCancelModal(false)}
              disabled={submitting}
            >
              Keep Appointment
            </Button>
            <Button
              variant="danger"
              onClick={handleCancel}
              loading={submitting}
            >
              Confirm Cancellation
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-charcoal-700">
            Are you sure you want to cancel this booking? This slot will immediately be made available to other clients.
          </p>
          <textarea
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Reason for cancellation..."
            className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white"
          />
        </div>
      </Modal>
    </div>
  );
};
