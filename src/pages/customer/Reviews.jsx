import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getReviews, addReview, getAppointments } from '../../services/api';
import { ReviewCard } from '../../components/ReviewCard';
import { Loading } from '../../components/Loading';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Star, Sparkles, Plus, CheckCircle } from '../../components/icons';

export const CustomerReviews = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [reviews, setReviews] = useState([]);
  const [eligibleAppointments, setEligibleAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // New review modal state
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [appointmentId, setAppointmentId] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const [revData, appointmentData] = await Promise.all([
        getReviews(),
        getAppointments(user?.id || 'cust-1')
      ]);
      setReviews(revData);
      const reviewedAppointmentIds = new Set(revData.map((review) => review.appointmentId));
      const completed = appointmentData.filter((appointment) =>
        appointment.status === 'Completed' && !reviewedAppointmentIds.has(appointment.id)
      );
      setEligibleAppointments(completed);
      setAppointmentId((currentId) =>
        completed.some((appointment) => appointment.id === currentId)
          ? currentId
          : completed[0]?.id || ''
      );
      setLoadError('');
    } catch (err) {
      console.error('Failed to load reviews', err);
      setLoadError('Reviews or completed appointment history could not be loaded. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      addToast('Please enter your review comments.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const appointment = eligibleAppointments.find((record) => record.id === appointmentId);
      if (!appointmentId) {
        addToast('Select a completed appointment before submitting a review.', 'error');
        return;
      }
      await addReview({
        appointmentId,
        rating,
        comment,
        customerName: user?.name || '',
        serviceName: appointment?.serviceName || ''
      });
      addToast('Thank you! Your review has been posted.', 'success');
      setShowModal(false);
      setComment('');
      setRating(5);
      await fetchReviews();
    } catch (err) {
      console.error('Error posting review', err);
      addToast(err.message || 'Failed to post review.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading text="Loading customer reviews..." />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-1">
            Testimonials & Feedback
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
            Reviews & Ratings
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            Read verified experiences and share feedback from your recent visits.
          </p>
        </div>

        <Button
          variant="gold"
          size="md"
          icon={Plus}
          disabled={eligibleAppointments.length === 0}
          onClick={() => setShowModal(true)}
        >
          Write a Review
        </Button>
      </div>

      {eligibleAppointments.length === 0 && !loadError && (
        <p className="rounded-xl border border-beige-200 bg-white p-4 text-sm text-charcoal-600">
          You can review an appointment after it has been marked completed. Each completed appointment can be reviewed once.
        </p>
      )}

      {loadError && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {loadError}
        </p>
      )}

      {/* Reviews Grid */}
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => <ReviewCard key={rev.id} review={rev} />)}
        </div>
      ) : !loadError && (
        <p className="rounded-xl border border-beige-200 bg-white p-8 text-center text-sm text-charcoal-600">
          No customer reviews yet. Be the first to share feedback after a completed visit.
        </p>
      )}

      {/* Write Review Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Share Your Salon Experience"
        subtitle="Your feedback helps our artisans refine their craft."
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Service Received
            </label>
            <select
              required
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/40 cursor-pointer"
            >
              {eligibleAppointments.map((appointment) => (
                <option key={appointment.id} value={appointment.id}>
                  {appointment.serviceName || 'Salon service'} — {appointment.date || 'Date unavailable'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Your Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-gold-500 hover:scale-110 transition-transform"
                >
                  <Star
                    size={26}
                    className={star <= rating ? 'fill-gold-500 text-gold-500' : 'text-charcoal-300'}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-charcoal-800 ml-2 font-serif text-sm">
                {rating} out of 5 Stars
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Your Review & Comments
            </label>
            <textarea
              required
              maxLength={3000}
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe your session, staff professionalism, ambience, or results..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/40"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gold"
              loading={submitting}
              disabled={!appointmentId}
              icon={CheckCircle}
            >
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
