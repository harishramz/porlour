import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Heart
} from './icons';

export const Footer = () => {
  return (
    <footer className="bg-charcoal-950 text-cream-100 border-t border-gold-600/30">
      {/* Upper Newsletter & VIP Banner */}
      <div className="border-b border-charcoal-800/80 py-10 px-4 sm:px-6 lg:px-8 bg-charcoal-900/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold flex items-center gap-1.5 mb-1">
              <Sparkles size={14} /> The Aura Luxe Circle
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium">
              Subscribe for Private Invitations & Seasonal Privileges
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-300 mt-1">
              Receive bespoke beauty trend guides and 15% off your premier booking.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for joining the Aura Luxe circle! Check your inbox for your welcome privilege.');
            }}
            className="flex w-full md:w-auto max-w-md gap-2"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="bg-charcoal-800 text-sm text-white px-4 py-3 rounded-full border border-charcoal-700 focus:outline-none focus:border-gold-400 flex-grow placeholder:text-charcoal-500"
            />
            <button
              type="submit"
              className="bg-gold-500 hover:bg-gold-600 text-charcoal-950 text-xs sm:text-sm font-semibold px-6 py-3 rounded-full transition-colors shrink-0"
            >
              Join Club
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold-500 text-charcoal-950 flex items-center justify-center font-bold">
                <Sparkles size={18} />
              </div>
              <span className="font-serif text-2xl font-bold tracking-widest text-white">
                AURA LUXE
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-charcoal-300 leading-relaxed max-w-sm">
              Coimbatore’s premier haute beauty sanctuary. Dedicated to delivering bespoke hair artistry, clinical facial therapies, and regal bridal makeovers with European luxury standards and holistic organic care.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-charcoal-800 text-cream-200 hover:text-gold-400 hover:bg-charcoal-700 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={17} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-charcoal-800 text-cream-200 hover:text-gold-400 hover:bg-charcoal-700 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={17} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-charcoal-800 text-cream-200 hover:text-gold-400 hover:bg-charcoal-700 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={17} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base font-semibold text-gold-400 tracking-wider uppercase text-xs mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-charcoal-300">
              <li>
                <Link to="/" className="hover:text-gold-300 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-gold-300 transition-colors">All Services</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold-300 transition-colors">Our Philosophy</Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-gold-300 transition-colors">Master Stylists</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-gold-300 transition-colors">Visual Gallery</Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-gold-300 transition-colors">Exclusive Offers</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-300 transition-colors">Contact & Locate</Link>
              </li>
            </ul>
          </div>

          {/* Signature Services */}
          <div>
            <h4 className="font-serif text-base font-semibold text-gold-400 tracking-wider uppercase text-xs mb-4">
              Signature Rituals
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-charcoal-300">
              <li>
                <Link to="/services/srv-1" className="hover:text-gold-300 transition-colors">Signature Haircut</Link>
              </li>
              <li>
                <Link to="/services/srv-5" className="hover:text-gold-300 transition-colors">24K Gold Radiance Facial</Link>
              </li>
              <li>
                <Link to="/services/srv-11" className="hover:text-gold-300 transition-colors">Royal HD Bridal Makeup</Link>
              </li>
              <li>
                <Link to="/services/srv-3" className="hover:text-gold-300 transition-colors">Balayage & Hair Color</Link>
              </li>
              <li>
                <Link to="/services/srv-8" className="hover:text-gold-300 transition-colors">Rose Petal Spa Manicure</Link>
              </li>
              <li>
                <Link to="/services/srv-4" className="hover:text-gold-300 transition-colors">Botanical Keratin Spa</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 className="font-serif text-base font-semibold text-gold-400 tracking-wider uppercase text-xs mb-4">
              Sanctuary Hours
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-charcoal-300">
              <div className="flex items-start gap-2.5">
                <Clock size={16} className="text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Mon — Sat</p>
                  <p className="text-charcoal-400 text-xs">09:00 AM — 08:30 PM</p>
                  <p className="text-white font-medium mt-1">Sunday</p>
                  <p className="text-charcoal-400 text-xs">10:00 AM — 06:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2">
                <MapPin size={16} className="text-gold-500 shrink-0 mt-0.5" />
                <p className="text-xs text-charcoal-300">
                  42 Elite Towers, Race Course Road, Coimbatore, TN 641018
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-gold-500 shrink-0" />
                <a href="tel:+919876543210" className="text-xs hover:text-white transition-colors">
                  +91 (0422) 234-5678
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-gold-500 shrink-0" />
                <a href="mailto:concierge@auraluxe.com" className="text-xs hover:text-white transition-colors">
                  concierge@auraluxe.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-charcoal-800/80 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-400">
          <p>© 2026 AURA LUXE Haute Beauty Parlour. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/admin" className="hover:text-gold-400 transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
