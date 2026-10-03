import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getReviews, addReview, getServices } from '../../services/api';
import { ReviewCard } from '../../components/ReviewCard';
import { Loading } from '../../components/Loading';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Star, Sparkles, Plus, CheckCircle } from '../../components/icons';

export const CustomerReviews = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // New review modal state
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [serviceName, setServiceName] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const [revData, srvData] = await Promise.all([getReviews(), getServices()]);
      setReviews(revData);
      setServices(srvData);
      if (srvData.length > 0 && !serviceName) {
        setServiceName(srvData[0].name);
      }
    } catch (err) {
      console.error('Failed to load reviews', err);
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
      await addReview({
        customerName: user?.name || 'Harish Varma',
        serviceName,
        rating,
        comment,
        verified: true
      });
      addToast('Thank you! Your testimonial has been posted.', 'success');
      setShowModal(false);
      setComment('');
      setRating(5);
      await fetchReviews();
    } catch (err) {
      console.error('Error posting review', err);
      addToast('Failed to post review.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading text="Loading client review testimonials..." />;
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
          onClick={() => setShowModal(true)}
        >
          Write a Review
        </Button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <ReviewCard key={rev.id} review={rev} />
        ))}
      </div>

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
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/40 cursor-pointer"
            >
              {services.map((srv) => (
                <option key={srv.id} value={srv.name}>
                  {srv.name} ({srv.category})
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
