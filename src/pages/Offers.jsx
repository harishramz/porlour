import React, { useState, useEffect } from 'react';
import { getOffers } from '../services/api';
import { OfferCard } from '../components/OfferCard';
import { Loading } from '../components/Loading';
import { Tag, Sparkles, ShieldCheck } from '../components/icons';

export const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await getOffers();
        setOffers(data);
      } catch (err) {
        console.error('Failed to load offers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (loading) {
    return <Loading fullScreen text="Loading luxury package offers..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-rose-600 font-semibold flex items-center justify-center gap-1.5 mb-2">
          <Tag size={14} /> Seasonal Privileges
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-charcoal-900 leading-tight">
          Exclusive Parlour Packages
        </h1>
        <p className="text-sm sm:text-base text-charcoal-600 mt-3 leading-relaxed">
          Indulge in all-inclusive ritual combinations at exceptional seasonal savings. Crafted to prepare you for life’s most celebrated milestones.
        </p>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>

      {/* Booking Terms Note */}
      <div className="bg-cream-100/70 p-6 sm:p-8 rounded-2xl border border-beige-200 text-xs sm:text-sm text-charcoal-600 max-w-3xl mx-auto leading-relaxed text-center">
        <p className="font-semibold text-charcoal-900 mb-1">
          Package Terms & Booking Policies
        </p>
        <p>
          Package prices are all-inclusive with no hidden consumables charges. Sessions can be split across multiple days for bridal packages upon request with our concierge.
        </p>
      </div>
    </div>
  );
};
