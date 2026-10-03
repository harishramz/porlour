import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getServiceById, getStaff, getReviews } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Loading } from '../components/Loading';
import { StaffCard } from '../components/StaffCard';
import { ReviewCard } from '../components/ReviewCard';
import {
  Star,
  Clock,
  Heart,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Calendar,
  User
} from '../components/icons';

export const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToast } = useToast();

  const [service, setService] = useState(null);
  const [allStaff, setAllStaff] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [srv, staffList, allReviews] = await Promise.all([
          getServiceById(id),
          getStaff(),
          getReviews()
        ]);
        setService(srv);
        setAllStaff(staffList);
        setReviews(allReviews.filter((r) => r.serviceName.toLowerCase().includes(srv.name.toLowerCase().slice(0, 10))));
      } catch (err) {
        console.error('Failed to load service details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <Loading fullScreen text="Loading treatment details..." />;
  }

  if (!service) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-charcoal-900 mb-4">Treatment Not Found</h2>
        <p className="text-charcoal-600 mb-6">The requested service could not be located in our salon registry.</p>
        <Link to="/services">
          <Button variant="primary">Return to Services</Button>
        </Link>
      </div>
    );
  }

  const isFav = isFavorite(service.id);
  const assignedStaff = allStaff.filter((st) => (service.staffIds || []).includes(st.id));

  const handleFavoriteToggle = () => {
    toggleFavorite(service.id);
    addToast(isFav ? 'Removed from favorites' : 'Saved to favorites', 'info');
  };

  return (
    <div className="pb-20">
      {/* Breadcrumb & Navigation */}
      <div className="bg-cream-100/60 border-b border-beige-200/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Services Catalogue
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="gold" size="sm">
              {service.category}
            </Badge>
            {service.isPopular && (
              <span className="text-[10px] uppercase font-bold tracking-widest bg-charcoal-900 text-gold-300 px-2 py-0.5 rounded-full">
                Signature
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Main Grid: Left Big Image & Right Key Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Large Image */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-3xl overflow-hidden shadow-floating bg-beige-100 aspect-[16/11]">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleFavoriteToggle}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                  isFav
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/80 text-charcoal-800 hover:bg-white hover:text-rose-500'
                }`}
                title={isFav ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-white p-3.5 rounded-xl border border-beige-200 text-center">
                <span className="text-[11px] text-charcoal-500 uppercase tracking-wider block">Duration</span>
                <span className="text-sm font-bold text-charcoal-900 font-serif flex items-center justify-center gap-1 mt-0.5">
                  <Clock size={14} className="text-gold-600" /> {service.duration}
                </span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-beige-200 text-center">
                <span className="text-[11px] text-charcoal-500 uppercase tracking-wider block">Rating</span>
                <span className="text-sm font-bold text-charcoal-900 font-serif flex items-center justify-center gap-1 mt-0.5">
                  <Star size={14} className="text-gold-500 fill-gold-500" /> {service.rating} ({service.reviewsCount})
                </span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-beige-200 text-center">
                <span className="text-[11px] text-charcoal-500 uppercase tracking-wider block">Hygiene</span>
                <span className="text-sm font-bold text-emerald-700 font-serif flex items-center justify-center gap-1 mt-0.5">
                  <ShieldCheck size={14} /> 100% Sterile
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Booking Card */}
          <div className="lg:col-span-5 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-beige-200 shadow-premium">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-[0.2em] text-gold-700 font-semibold">
                  Aura Luxe Ritual
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 leading-tight">
                {service.name}
              </h1>
              <p className="text-sm text-charcoal-600 mt-3 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Pricing Box */}
            <div className="p-4 rounded-2xl bg-cream-50 border border-beige-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-charcoal-500 uppercase tracking-wider block">Investment</span>
                <span className="font-serif text-3xl font-bold text-charcoal-900">
                  ₹{service.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-charcoal-500 block">Inclusive of all organic consumables</span>
              </div>
              <Badge variant="Active" size="sm">Available Today</Badge>
            </div>

            {/* Booking CTA Button */}
            <div className="space-y-3 pt-2">
              <Link to={`/book-appointment?serviceId=${service.id}`} className="block">
                <Button variant="gold" size="lg" className="w-full shadow-gold" icon={Calendar}>
                  Book Appointment Now
                </Button>
              </Link>
              <p className="text-center text-[11px] text-charcoal-500">
                Instant confirmation • Free cancellation up to 4 hours before slot
              </p>
            </div>

            {/* Key Service Highlights */}
            <div className="border-t border-beige-200/80 pt-5 space-y-3">
              <h4 className="text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                Experience Highlights:
              </h4>
              <ul className="space-y-2 text-xs text-charcoal-700">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-gold-600 shrink-0" />
                  <span>Personalized 1-on-1 skin / hair diagnostic consultation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-gold-600 shrink-0" />
                  <span>Cruelty-free dermatologically tested formulations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-gold-600 shrink-0" />
                  <span>Complimentary herbal beverage & relaxation lounge access</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Benefits & What is Included Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 pt-12 border-t border-beige-200/80">
          {/* Benefits */}
          <div className="bg-cream-50/70 p-8 rounded-3xl border border-beige-200">
            <h3 className="font-serif text-2xl font-bold text-charcoal-900 mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-gold-600" /> Key Clinical & Aesthetic Benefits
            </h3>
            <ul className="space-y-3">
              {(service.benefits || []).map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-charcoal-700">
                  <span className="w-5 h-5 rounded-full bg-gold-200 text-gold-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </span>
                  <span className="leading-snug">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What is Included */}
          <div className="bg-white p-8 rounded-3xl border border-beige-200 shadow-subtle">
            <h3 className="font-serif text-2xl font-bold text-charcoal-900 mb-4 flex items-center gap-2">
              <CheckCircle size={20} className="text-gold-600" /> What Is Included in This Session
            </h3>
            <ul className="space-y-3">
              {(service.included || []).map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-charcoal-700">
                  <span className="w-5 h-5 rounded-full bg-beige-200 text-charcoal-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Available Stylists Section */}
        {assignedStaff.length > 0 && (
          <div className="mt-20 pt-12 border-t border-beige-200/80">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs uppercase tracking-[0.2em] text-gold-700 font-semibold block mb-1">
                Handpicked Masters
              </span>
              <h3 className="font-serif text-3xl font-normal text-charcoal-900">
                Specialists Available for This Treatment
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {assignedStaff.map((st) => (
                <StaffCard key={st.id} staff={st} />
              ))}
            </div>
          </div>
        )}

        {/* Customer Reviews for this Service */}
        {reviews.length > 0 && (
          <div className="mt-20 pt-12 border-t border-beige-200/80">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs uppercase tracking-[0.2em] text-gold-700 font-semibold block mb-1">
                Client Experiences
              </span>
              <h3 className="font-serif text-3xl font-normal text-charcoal-900">
                What Guests Are Saying
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {reviews.map((rev) => (
                <ReviewCard key={rev.id} review={rev} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
