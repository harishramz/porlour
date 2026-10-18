import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ArrowRight, Sparkles } from '../components/icons';

export const Offers = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
    <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold inline-flex items-center gap-2">
      <Sparkles size={14} /> Her Glow Home Salon
    </span>
    <h1 className="font-serif text-4xl sm:text-5xl font-light text-charcoal-900 mt-3">
      Services & Prices
    </h1>
    <p className="text-sm sm:text-base text-charcoal-600 mt-4 leading-relaxed">
      No separate promotional offers were included in the supplied salon menu. Browse the full service list for the current menu prices.
    </p>
    <Link to="/services" className="inline-block mt-7">
      <Button variant="gold" size="lg" icon={ArrowRight} iconPosition="right">
        View the Full Menu
      </Button>
    </Link>
  </div>
);
