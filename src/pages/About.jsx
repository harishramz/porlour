import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ArrowRight, Sparkles } from '../components/icons';

export const About = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
    <section className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
      <div className="rounded-3xl overflow-hidden border border-beige-200 shadow-premium bg-[#fff2ee]">
        <img
          src="/images/her-glow-logo.jpeg"
          alt="Her Glow Home Salon — Look Good, Feel Good, Be You"
          className="w-full h-auto"
        />
      </div>
      <div>
        <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold flex items-center gap-2">
          <Sparkles size={14} /> Her Glow Home Salon
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-charcoal-900 mt-3">
          Look Good. Feel Good. Be You.
        </h1>
        <p className="text-charcoal-600 mt-5 leading-relaxed">
          Her Glow offers home salon beauty and personal-care services. Choose from threading, waxing, massage, manicure and pedicure, bleach and D-Tan, clean-ups, facials, henna application and hair spa.
        </p>
        <p className="text-charcoal-600 mt-4 leading-relaxed">
          The online service list follows the treatments and prices shown in the salon’s supplied menu. Massage times and hair-spa length options are included where they were listed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link to="/services">
            <Button variant="gold" size="md" icon={ArrowRight} iconPosition="right">
              Browse Services & Prices
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="secondary" size="md">
              Contact the Salon
            </Button>
          </Link>
        </div>
      </div>
    </section>
  </div>
);
