import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';
import { Star, Clock, Heart, ArrowRight } from './icons';
import { Button } from './Button';
import { Badge } from './Badge';

export const ServiceCard = ({ service }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const isFav = isFavorite(service.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(service.id);
    addToast(
      isFav ? `Removed ${service.name} from favorites` : `Saved ${service.name} to favorites`,
      'info'
    );
  };

  const handleBookNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/book-appointment?serviceId=${service.id}`);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-beige-200/80 overflow-hidden shadow-subtle luxury-card-hover flex flex-col h-full">
      {/* Image Container with Badges & Wishlist */}
      <Link to={`/services/${service.id}`} className="block relative h-56 sm:h-64 overflow-hidden bg-beige-100">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-charcoal-950/10 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 flex gap-2 items-center">
          <Badge variant="gold" size="sm">
            {service.category}
          </Badge>
          {service.isPopular && (
            <span className="bg-charcoal-900/90 backdrop-blur-sm text-gold-300 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border border-gold-400/40">
              Popular
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            isFav
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-white/80 text-charcoal-700 hover:bg-white hover:text-rose-500'
          }`}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
        </button>

        {/* Price & Rating Overlay in Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-1.5 bg-charcoal-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs border border-white/10">
            <Star size={13} className="text-gold-400 fill-gold-400" />
            <span className="font-semibold text-white">{service.rating}</span>
            <span className="text-charcoal-300 text-[11px]">({service.reviewsCount})</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/90 bg-charcoal-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            <Clock size={12} className="text-gold-400" />
            <span>{service.duration}</span>
          </div>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/services/${service.id}`} className="block group-hover:text-gold-700 transition-colors">
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-charcoal-900 line-clamp-1 mb-1.5">
            {service.name}
          </h3>
        </Link>

        <p className="text-xs sm:text-sm text-charcoal-600 line-clamp-2 mb-4 leading-relaxed flex-grow">
          {service.shortDescription}
        </p>

        {/* Price and Action Footer */}
        <div className="pt-3 border-t border-beige-200/80 flex items-center justify-between gap-3 mt-auto">
          <div>
            <span className="text-[11px] text-charcoal-500 uppercase tracking-wider block">Starting At</span>
            <span className="text-lg sm:text-xl font-bold font-serif text-charcoal-900">
              ₹{service.price.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/services/${service.id}`}
              className="p-2 rounded-full border border-beige-300 text-charcoal-600 hover:border-charcoal-800 hover:text-charcoal-900 transition-colors"
              title="View Service Details"
            >
              <ArrowRight size={14} />
            </Link>
            <Button
              onClick={handleBookNow}
              variant="primary"
              size="sm"
              className="rounded-full"
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
