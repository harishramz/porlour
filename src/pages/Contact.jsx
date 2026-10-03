import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/Button';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  CheckCircle,
  ExternalLink
} from '../components/icons';

export const Contact = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Consultation',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      addToast('Thank you! Your message has been received by our concierge.', 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Consultation',
        message: ''
      });
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold flex items-center justify-center gap-1.5 mb-2">
          <Sparkles size={14} /> At Your Service
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-charcoal-900 leading-tight">
          Contact Our Concierge
        </h1>
        <p className="text-sm sm:text-base text-charcoal-600 mt-3 leading-relaxed">
          Have questions regarding bespoke bridal packages, hair transformations, or group reservations? Our concierge is ready to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info & Hours (5 Cols) */}
        <div className="lg:col-span-5 space-y-8 bg-cream-50/80 p-8 sm:p-10 rounded-3xl border border-beige-200">
          <div>
            <h3 className="font-serif text-2xl font-bold text-charcoal-900 mb-2">
              The Sanctuary Details
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
              Located in the central heritage precinct of Coimbatore with dedicated private valet parking.
            </p>
          </div>

          <div className="space-y-6 text-sm text-charcoal-700">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-cream-100 border border-gold-300 text-gold-700 flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal-900 uppercase tracking-wider">Address</p>
                <p className="mt-1 leading-snug">
                  Aura Luxe Parlour, 42 Elite Towers, Race Course Road, Coimbatore, Tamil Nadu 641018
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-cream-100 border border-gold-300 text-gold-700 flex items-center justify-center shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal-900 uppercase tracking-wider">Direct Line</p>
                <a href="tel:+919876543210" className="mt-1 block hover:text-gold-700 font-medium">
                  +91 (0422) 234-5678 / +91 98765 43210
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-cream-100 border border-gold-300 text-gold-700 flex items-center justify-center shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal-900 uppercase tracking-wider">Email Inquiries</p>
                <a href="mailto:concierge@auraluxe.com" className="mt-1 block hover:text-gold-700 font-medium">
                  concierge@auraluxe.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5 pt-2 border-t border-beige-200">
              <div className="w-10 h-10 rounded-full bg-cream-100 border border-gold-300 text-gold-700 flex items-center justify-center shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal-900 uppercase tracking-wider">Operating Hours</p>
                <p className="mt-1 text-xs sm:text-sm">
                  <span className="font-semibold text-charcoal-900">Monday – Saturday:</span> 09:00 AM – 08:30 PM
                </p>
                <p className="text-xs sm:text-sm">
                  <span className="font-semibold text-charcoal-900">Sunday:</span> 10:00 AM – 06:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-beige-200 shadow-premium">
          <div className="mb-6">
            <h3 className="font-serif text-2xl font-bold text-charcoal-900">
              Send an Inquiry
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
              Leave your details below and our salon manager will reach out within 2 business hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                  Your Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Priyadarshini Rao"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. priya@example.com"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/40 cursor-pointer"
                >
                  <option value="General Consultation">General Consultation</option>
                  <option value="Bridal Visage Booking">Bridal Visage Booking</option>
                  <option value="Corporate / Party Spa">Corporate / Party Spa</option>
                  <option value="Custom Hair Color Advice">Custom Hair Color Advice</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Your Message <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about the desired date, questions regarding treatments, or custom requirements..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/40"
              />
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              loading={submitting}
              className="w-full shadow-gold"
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>

      {/* Google Maps Interactive Placeholder */}
      <div className="bg-white rounded-3xl border border-beige-200 overflow-hidden shadow-subtle p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-gold-600" />
            <h3 className="font-serif text-xl font-bold text-charcoal-900">
              Interactive Location & Directions
            </h3>
          </div>
          <span className="text-xs text-charcoal-500 font-medium">Race Course, Coimbatore</span>
        </div>

        {/* Map stylized placeholder */}
        <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-beige-100 flex items-center justify-center border border-beige-200">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1400&q=80"
            alt="Map satellite view"
            className="w-full h-full object-cover opacity-75 filter contrast-125"
          />
          <div className="absolute inset-0 bg-charcoal-950/20 backdrop-blur-[1px]" />

          {/* Central Map Pin Pinpoint */}
          <div className="absolute flex flex-col items-center animate-bounce">
            <div className="bg-charcoal-900 text-gold-400 p-3 rounded-full border-2 border-gold-400 shadow-floating">
              <Sparkles size={24} />
            </div>
            <div className="bg-white px-3 py-1 rounded-full shadow-md text-xs font-bold text-charcoal-900 mt-1 border border-beige-200">
              Aura Luxe Parlour
            </div>
          </div>

          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs text-charcoal-700 shadow-sm border border-beige-200 flex items-center gap-1.5">
            <span>Open in Google Maps</span>
            <ExternalLink size={13} />
          </div>
        </div>
      </div>
    </div>
  );
};
