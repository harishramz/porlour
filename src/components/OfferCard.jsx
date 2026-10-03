import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Tag, Sparkles, ArrowRight } from './icons';
import { Button } from './Button';
import { Badge } from './Badge';

export const OfferCard = ({ offer }) => {
  const navigate = useNavigate();

  const handleBookPackage = () => {
    navigate(`/book-appointment?offerId=${offer.id}&offerTitle=${encodeURIComponent(offer.title)}&offerPrice=${offer.discountedPrice}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-beige-200/80 overflow-hidden shadow-subtle luxury-card-hover flex flex-col h-full group">
      {/* Hero Image with Discount Badge */}
      <div className="relative h-52 sm:h-60 overflow-hidden bg-beige-100">
        <img
          src={offer.image}
          alt={offer.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-charcoal-950/20 to-transparent" />

        {/* Discount Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="bg-rose-500 text-white font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <Tag size={12} /> {offer.discountPercent}% OFF
          </span>
          {offer.badge && (
            <span className="bg-charcoal-900/90 text-gold-300 text-xs px-2.5 py-1 rounded-full border border-gold-400/40">
              {offer.badge}
            </span>
          )}
        </div>

        {/* Valid until indicator */}
        <div className="absolute bottom-3 left-3 text-xs text-cream-100">
          <span>Valid until: <strong className="text-white">{offer.validUntil}</strong></span>
        </div>
      </div>

      {/* Offer Body */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900 mb-1">
            {offer.title}
          </h3>
          <p className="text-xs sm:text-sm text-gold-700 font-medium">
            {offer.tagline}
          </p>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-2 line-clamp-2 leading-relaxed">
            {offer.description}
          </p>
        </div>

        {/* Pricing Comparison */}
        <div className="bg-cream-50 p-4 rounded-xl border border-beige-200/80 mb-5 flex items-baseline justify-between">
          <div>
            <span className="text-[11px] text-charcoal-500 uppercase tracking-wider block">Special Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-serif text-charcoal-900">
                ₹{offer.discountedPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-sm line-through text-charcoal-400">
                ₹{offer.originalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
            Save ₹{offer.savings.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Package Inclusions Checklist */}
        <div className="mb-6 flex-grow">
          <span className="text-xs font-semibold text-charcoal-800 uppercase tracking-wider block mb-2.5">
            Package Includes:
          </span>
          <ul className="space-y-2">
            {offer.inclusions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-charcoal-700">
                <span className="w-4 h-4 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={11} strokeWidth={3} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleBookPackage}
          variant="gold"
          size="md"
          className="w-full rounded-full shadow-sm"
          icon={ArrowRight}
          iconPosition="right"
        >
          Book Package
        </Button>
      </div>
    </div>
  );
};
