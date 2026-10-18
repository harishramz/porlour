import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ArrowRight, MapPin } from '../components/icons';

const mapUrl = 'https://www.google.com/maps/search/?api=1&query=13.01475%2C77.62175';
const mapEmbedUrl = 'https://www.google.com/maps?q=13.01475,77.62175&z=17&output=embed';

export const Contact = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <div className="text-center max-w-2xl mx-auto mb-10">
      <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold inline-flex items-center gap-2">
        <MapPin size={14} /> Visit Her Glow
      </span>
      <h1 className="font-serif text-4xl sm:text-5xl font-light text-charcoal-900 mt-2">
        Contact & Location
      </h1>
      <p className="text-sm sm:text-base text-charcoal-600 mt-3 leading-relaxed">
        Find Her Glow Home Salon at the location shared below. Phone contact details will be added when available.
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      <section className="lg:col-span-4 bg-white rounded-3xl border border-beige-200 shadow-subtle p-7 sm:p-8">
        <div className="w-12 h-12 rounded-full bg-cream-100 border border-gold-300 text-gold-700 flex items-center justify-center">
          <MapPin size={21} />
        </div>
        <h2 className="font-serif text-2xl font-bold text-charcoal-900 mt-5">Her Glow Home Salon</h2>
        <p className="text-sm text-charcoal-600 mt-3">
          Plus Code: <strong className="text-charcoal-900">2J7C+VPR Bengaluru, Karnataka</strong>
        </p>
        <p className="text-xs text-charcoal-500 mt-2">
          13.01475° N, 77.62175° E
        </p>
        <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-block mt-5">
          <Button variant="outline" size="md" icon={ArrowRight} iconPosition="right">
            Get Directions
          </Button>
        </a>
        <div className="mt-8 pt-6 border-t border-beige-200">
          <p className="text-sm text-charcoal-600">Ready to book a service?</p>
          <Link to="/book-appointment" className="inline-block mt-3">
            <Button variant="gold" size="md">Book an Appointment</Button>
          </Link>
        </div>
      </section>

      <div className="lg:col-span-8 min-h-[360px] sm:min-h-[460px] rounded-3xl overflow-hidden border border-beige-200 shadow-subtle bg-beige-100">
        <iframe
          title="Map showing Her Glow Home Salon location in Bengaluru"
          src={mapEmbedUrl}
          className="w-full h-full min-h-[360px] sm:min-h-[460px] border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  </div>
);
