import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ArrowRight, Sparkles } from '../components/icons';

export const Team = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
    <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold inline-flex items-center gap-2">
      <Sparkles size={14} /> Her Glow Home Salon
    </span>
    <h1 className="font-serif text-4xl sm:text-5xl font-light text-charcoal-900 mt-3">
      Personal Beauty Care
    </h1>
    <p className="text-sm sm:text-base text-charcoal-600 mt-4 leading-relaxed">
      Practitioner and team details were not included in the materials provided. Explore the listed services or contact the salon to ask about availability.
    </p>
    <div className="flex flex-col sm:flex-row justify-center gap-3 mt-7">
      <Link to="/services">
        <Button variant="gold" size="lg" icon={ArrowRight} iconPosition="right">
          Browse Services
        </Button>
      </Link>
      <Link to="/contact">
        <Button variant="secondary" size="lg">Contact the Salon</Button>
      </Link>
    </div>
  </div>
);
