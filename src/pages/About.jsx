import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Heart,
  Scissors,
  CheckCircle,
  ArrowRight
} from '../components/icons';

export const About = () => {
  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:py-24 bg-cream-100/60 border-b border-beige-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs uppercase tracking-[0.3em] text-gold-700 font-semibold block mb-2">
            The Philosophy of Aura Luxe
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-charcoal-900 leading-tight">
            Where Artistry Meets Wellness
          </h1>
          <p className="text-base sm:text-lg text-charcoal-600 mt-4 leading-relaxed font-light">
            Founded with an enduring belief that beauty is an intimate expression of individuality. We merge timeless Ayurvedic herbal wisdom with advanced European cosmetology.
          </p>
        </div>
      </section>

      {/* Story & Heritage Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-floating bg-beige-100 aspect-[4/5] border border-beige-200">
              <img
                src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1000&q=80"
                alt="Aura Luxe Sanctuary Ambience"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Small offset card */}
            <div className="absolute -bottom-8 -right-6 sm:bottom-8 sm:-right-8 bg-charcoal-900 text-cream-100 p-6 rounded-2xl shadow-floating max-w-xs border border-gold-400/40 hidden sm:block">
              <span className="font-serif text-3xl font-bold text-gold-400 block mb-1">Since 2018</span>
              <p className="text-xs text-charcoal-300 leading-snug">
                Pioneering clean luxury and medical-grade salon sanitization across South India.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
              Our Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal-900 leading-tight">
              A Serene Oasis Designed for Your Rejuvenation
            </h2>
            <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed">
              At Aura Luxe, every detail is engineered to soothe your senses. From the moment you enter our reception with our signature jasmine aromatherapy to our private acoustic-treated facial chambers, you are ensconced in unhurried elegance.
            </p>
            <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed">
              We reject the one-size-fits-all conveyor-belt approach of ordinary salons. Every client begins their ritual with an in-depth consultation with our master stylists to diagnose hair porosity, scalp health, and derma requirements.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-cream-50 border border-beige-200">
                <h4 className="font-serif font-bold text-lg text-charcoal-900">Ethical Sourcing</h4>
                <p className="text-xs text-charcoal-600 mt-1">100% cruelty-free and organic botanical actives.</p>
              </div>
              <div className="p-4 rounded-xl bg-cream-50 border border-beige-200">
                <h4 className="font-serif font-bold text-lg text-charcoal-900">Master Artists</h4>
                <p className="text-xs text-charcoal-600 mt-1">Internationally certified Vidal Sassoon & CIDESCO alumni.</p>
              </div>
            </div>

            <div className="pt-4">
              <Link to="/team">
                <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right">
                  Meet Our Master Stylists
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hospital-Grade Hygiene Standards */}
      <section className="bg-cream-100/70 border-y border-beige-200/80 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-emerald-700 font-semibold block mb-2">
              Uncompromising Safety
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal-900">
              Gold Standard Sanitation
            </h2>
            <p className="text-sm text-charcoal-600 mt-2">
              Your health and tranquility are sacred. We adhere to clinical sterilization protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-beige-200 shadow-subtle text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                <ShieldCheck size={28} />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                Medical Autoclave Sterilization
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                All metal shears, cuticle nippers, and extractors undergo high-pressure steam autoclave sterilization sealed in single-use pouches opened in front of you.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-beige-200 shadow-subtle text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                <CheckCircle size={28} />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                Single-Use Biodegradable Kits
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                Nail files, foot pumice sponges, waxing spatulas, bedsheets, and towels are strictly single-use and compostable for zero cross-contamination.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-beige-200 shadow-subtle text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                <Sparkles size={28} />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                Medical HEPA Air Purification
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                Our parlour suites feature continuous medical-grade HEPA 14 filtration to eliminate chemical fumes, airborne allergens, and odors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facility Highlights CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-3xl border border-beige-200 p-8 sm:p-14 shadow-premium max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 mb-4">
            Experience the Luxury Firsthand
          </h2>
          <p className="text-sm text-charcoal-600 max-w-xl mx-auto mb-8 leading-relaxed">
            Conveniently situated in the leafy enclave of Race Course, Coimbatore with private valet parking and luxury VIP suites.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/book-appointment">
              <Button variant="gold" size="lg" className="shadow-gold">
                Reserve an Experience
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Contact Concierge
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
