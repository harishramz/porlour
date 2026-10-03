import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Scissors, Eye, X, AlertCircle } from './icons';
import { Badge } from './Badge';
import { Button } from './Button';
import { Modal } from './Modal';

export const AppointmentCard = ({ appointment, onCancelSuccess }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canCancel = appointment.status === 'Confirmed' || appointment.status === 'Pending';

  const handleConfirmCancel = async () => {
    setIsSubmitting(true);
    try {
      if (onCancelSuccess) {
        await onCancelSuccess(appointment.id, cancelReason);
      }
      setShowCancelModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-beige-200/80 p-5 sm:p-6 shadow-subtle hover:border-beige-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left: Service details & Staff */}
        <div className="space-y-3 flex-grow">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-mono text-charcoal-400">#{appointment.id}</span>
            <Badge variant={appointment.status}>{appointment.status}</Badge>
            <span className="text-xs text-charcoal-500 bg-cream-100 px-2.5 py-0.5 rounded-full border border-beige-200">
              {appointment.category || 'Beauty Care'}
            </span>
          </div>

          <div>
            <h4 className="font-serif text-lg sm:text-xl font-bold text-charcoal-900">
              {appointment.serviceName}
            </h4>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-charcoal-600 mt-1">
              <span className="flex items-center gap-1.5">
                <User size={14} className="text-gold-600" />
                <span>Specialist: <strong className="text-charcoal-800">{appointment.staffName}</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-gold-600" />
                <span>{appointment.duration}</span>
              </span>
            </div>
          </div>

          {/* Schedule details */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm bg-cream-50/80 px-3.5 py-2 rounded-xl border border-beige-200/60 text-charcoal-700">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar size={14} className="text-gold-600" />
              <span>{appointment.formattedDate || appointment.date}</span>
            </span>
            <span className="text-charcoal-300">|</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock size={14} className="text-gold-600" />
              <span>{appointment.time}</span>
            </span>
          </div>
        </div>

        {/* Right: Price & Actions */}
        <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-beige-200 gap-3 shrink-0">
          <div className="md:text-right">
            <span className="text-[11px] text-charcoal-500 uppercase tracking-wider block">Total Amount</span>
            <span className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900">
              ₹{appointment.price.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/appointments/${appointment.id}`}>
              <Button variant="secondary" size="sm" icon={Eye}>
                View Details
              </Button>
            </Link>

            {canCancel && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowCancelModal(true)}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Cancellation Confirmation Dialog */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Appointment"
        subtitle={`Booking Reference: #${appointment.id}`}
        footer={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setShowCancelModal(false)}
              disabled={isSubmitting}
            >
              Keep Appointment
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleConfirmCancel}
              loading={isSubmitting}
            >
              Confirm Cancellation
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 text-xs sm:text-sm">
            <AlertCircle size={20} className="shrink-0 text-rose-600 mt-0.5" />
            <p>
              Are you sure you want to cancel your appointment for{' '}
              <strong>{appointment.serviceName}</strong> scheduled on{' '}
              <strong>{appointment.formattedDate || appointment.date} at {appointment.time}</strong>?
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Reason for Cancellation (Optional)
            </label>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Schedule conflict, traveling out of town..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
