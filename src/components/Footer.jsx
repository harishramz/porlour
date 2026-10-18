import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from './icons';

const mapUrl = 'https://www.google.com/maps/search/?api=1&query=13.01475%2C77.62175';

const serviceLinks = [
  ['Beauty', 'Threading, waxing & massage'],
  ['Skin', 'Bleach, D-Tan, clean-ups & facials'],
  ['Nails', 'Manicure & pedicure'],
  ['Hair', 'Henna & hair spa']
];

export const Footer = () => (
  <footer className="bg-charcoal-950 text-cream-100 border-t border-gold-600/30">
    <div className="border-b border-charcoal-800/80 py-6 px-4 sm:px-6 lg:px-8 bg-charcoal-900/60">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-serif text-xl text-white">Look Good. Feel Good. Be You.</p>
        <Link to="/services" className="text-sm font-semibold text-gold-300 hover:text-white inline-flex items-center gap-2">
          Browse services & prices <ArrowRight size={15} />
        </Link>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/her-glow-logo.jpeg"
              alt="Her Glow Home Salon"
              className="w-12 h-12 rounded-full object-cover border border-gold-400/50"
            />
            <span className="font-serif text-2xl font-bold tracking-widest text-white">HER GLOW</span>
          </Link>
          <p className="text-sm text-charcoal-300 leading-relaxed max-w-sm">
            Home salon services and prices from our menu. Look Good, Feel Good, Be You.
          </p>
        </div>

        <div>
          <h2 className="font-serif font-semibold text-gold-400 tracking-wider uppercase text-xs mb-4">Explore</h2>
          <ul className="space-y-3 text-sm text-charcoal-300">
            <li><Link to="/" className="hover:text-gold-300">Home</Link></li>
            <li><Link to="/services" className="hover:text-gold-300">All Services & Prices</Link></li>
            <li><Link to="/about" className="hover:text-gold-300">About Her Glow</Link></li>
            <li><Link to="/contact" className="hover:text-gold-300">Contact & Booking</Link></li>
            <li><Link to="/payment-terms" className="hover:text-gold-300">Payment Terms</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="font-serif font-semibold text-gold-400 tracking-wider uppercase text-xs mb-4">Menu Categories</h2>
          <ul className="space-y-3 text-sm text-charcoal-300">
            {serviceLinks.map(([category, label]) => (
              <li key={category}>
                <Link to={`/services?category=${category}`} className="hover:text-gold-300">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-serif font-semibold text-gold-400 tracking-wider uppercase text-xs mb-4">Find Us</h2>
          <a href={mapUrl} target="_blank" rel="noreferrer" className="text-sm text-charcoal-300 hover:text-gold-300 inline-flex items-start gap-2">
            <MapPin size={16} className="shrink-0 mt-0.5" />
            <span>2J7C+VPR<br />Bengaluru, Karnataka</span>
          </a>
          <Link to="/book-appointment" className="block text-sm text-charcoal-300 hover:text-gold-300 mt-4">
            Book an appointment
          </Link>
        </div>
      </div>

      <div className="border-t border-charcoal-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-400">
        <p>© {new Date().getFullYear()} Her Glow Home Salon. All rights reserved.</p>
        <Link to="/admin" className="hover:text-gold-400">Admin Portal</Link>
      </div>
    </div>
  </footer>
);
