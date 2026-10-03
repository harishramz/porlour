import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getServices, getStaff, getOffers, getReviews, getGallery } from '../services/api';
import { ServiceCard } from '../components/ServiceCard';
import { StaffCard } from '../components/StaffCard';
import { OfferCard } from '../components/OfferCard';
import { ReviewCard } from '../components/ReviewCard';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import {
  Sparkles,
  Scissors,
  Award,
  ShieldCheck,
  Smile,
  ArrowRight,
  Star,
  CheckCircle,
  Calendar,
  Heart
} from '../components/icons';

export const Home = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [offers, setOffers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [srvData, staffData, offerData, revData, galData] = await Promise.all([
          getServices(),
          getStaff(),
          getOffers(),
          getReviews(),
          getGallery()
        ]);
        setServices(srvData);
        setStaff(staffData);
        setOffers(offerData);
        setReviews(revData);
        setGallery(galData.slice(0, 6));
      } catch (err) {
        console.error('Error fetching homepage data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter popular services (Haircut, Hair Styling, Facial, Manicure, Pedicure, Makeup, Bridal Makeup, Hair Coloring)
  const popularServices = services.filter((s) => s.isPopular).slice(0, 8);

  if (loading) {
    return <Loading fullScreen text="Curating luxury sanctuary experiences..." />;
  }

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* ========================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-cream-100 text-gold-700 px-4 py-1.5 rounded-full border border-gold-300/60 shadow-sm">
                <Sparkles size={15} />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Haute Beauty & Wellness Sanctuary
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-light text-charcoal-900 leading-[1.08] tracking-tight">
                BEAUTY BEGINS <br />
                <span className="font-semibold italic bg-gradient-to-r from-charcoal-950 via-charcoal-800 to-gold-700 bg-clip-text text-transparent">
                  WITH YOU
                </span>
              </h1>

              <p className="text-base sm:text-lg xl:text-xl text-charcoal-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Experience personalized beauty and wellness services designed to make you feel confident, refreshed and beautiful.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/book-appointment" className="w-full sm:w-auto">
                  <Button variant="gold" size="lg" className="w-full sm:w-auto shadow-gold" icon={ArrowRight} iconPosition="right">
                    Book an Appointment
                  </Button>
                </Link>
                <Link to="/services" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Explore Services
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-beige-200/80 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">12k+</p>
                  <p className="text-xs text-charcoal-500 mt-0.5">Delighted Clients</p>
                </div>
                <div>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">4.9 ★</p>
                  <p className="text-xs text-charcoal-500 mt-0.5">Average Rating</p>
                </div>
                <div>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">100%</p>
                  <p className="text-xs text-charcoal-500 mt-0.5">Organic Certified</p>
                </div>
              </div>
            </div>

            {/* Right Premium Hero Image Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative golden ambient frame */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-gold-300/40 via-beige-200/50 to-rose-200/30 transform rotate-1 filter blur-sm" />
                
                <div className="relative rounded-3xl overflow-hidden shadow-floating border-2 border-white/80 bg-beige-100 aspect-[4/5]">
                  <img
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=85"
                    alt="Luxury Beauty Parlour Treatment"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 via-transparent to-transparent" />
                </div>

                {/* Floating Award Card */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-beige-200 shadow-floating flex items-center gap-3.5 max-w-xs animate-float">
                  <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center shrink-0">
                    <Award size={24} />
                  </div>
                  <div>
                    <div className="flex text-gold-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} className="fill-gold-500" />
                      ))}
                    </div>
                    <p className="text-xs font-bold text-charcoal-900 mt-0.5 leading-tight">Best Luxury Parlour 2026</p>
                    <p className="text-[10px] text-charcoal-500">Tamil Nadu Lifestyle Awards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. POPULAR SERVICES */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 text-center md:text-left">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold flex items-center justify-center md:justify-start gap-1.5 mb-2">
              <Scissors size={14} /> Curated Treatments
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal-900">
              Popular Services
            </h2>
            <p className="text-sm text-charcoal-600 mt-2 max-w-xl">
              From precision cuts and restorative skin therapies to timeless bridal couture, explore our most beloved salon experiences.
            </p>
          </div>
          <Link to="/services" className="shrink-0">
            <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
              View All Services
            </Button>
          </Link>
        </div>

        {/* Services Grid (8 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {popularServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. WHY CHOOSE US (4 Feature Cards) */}
      {/* ========================================================= */}
      <section className="bg-cream-100/70 border-y border-beige-200/80 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-2">
              The Aura Luxe Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal-900">
              Why Choose Us
            </h2>
            <p className="text-sm text-charcoal-600 mt-3">
              We redefine modern beauty with hospital-grade sanitization, certified international stylists, and ethically sourced organic ingredients.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-7 rounded-2xl border border-beige-200 shadow-subtle text-center luxury-card-hover">
              <div className="w-14 h-14 rounded-2xl bg-cream-100 text-gold-600 border border-gold-300/50 flex items-center justify-center mx-auto mb-5 shadow-sm">
                <Award size={26} />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                Professional Experts
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                Trained at prestigious international academies with over a decade of high-fashion and bridal experience.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-7 rounded-2xl border border-beige-200 shadow-subtle text-center luxury-card-hover">
              <div className="w-14 h-14 rounded-2xl bg-cream-100 text-gold-600 border border-gold-300/50 flex items-center justify-center mx-auto mb-5 shadow-sm">
                <Sparkles size={26} />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                Premium Products
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                We use only dermatologically tested, cruelty-free European formulations, pure 24K gold leaves, and organic botanical extracts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-7 rounded-2xl border border-beige-200 shadow-subtle text-center luxury-card-hover">
              <div className="w-14 h-14 rounded-2xl bg-cream-100 text-gold-600 border border-gold-300/50 flex items-center justify-center mx-auto mb-5 shadow-sm">
                <ShieldCheck size={26} />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                Hygienic Environment
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                Hospital-grade autoclave tool sterilization, single-use disposable kits, and hospital-standard air purification.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-7 rounded-2xl border border-beige-200 shadow-subtle text-center luxury-card-hover">
              <div className="w-14 h-14 rounded-2xl bg-cream-100 text-gold-600 border border-gold-300/50 flex items-center justify-center mx-auto mb-5 shadow-sm">
                <Smile size={26} />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                Personalized Experience
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                Every service begins with a tailored 1-on-1 skin and hair diagnostic to customize every formulation to your unique profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. FEATURED OFFERS */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-rose-600 font-semibold block mb-2">
            Limited Time Privileges
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal-900">
            Featured Packages & Offers
          </h2>
          <p className="text-sm text-charcoal-600 mt-2">
            Pamper yourself or prepare for your landmark celebrations with our curated, high-value bundles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.slice(0, 3).map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/offers">
            <Button variant="secondary" size="md" icon={ArrowRight} iconPosition="right">
              Explore All Promotional Packages
            </Button>
          </Link>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. OUR TEAM PREVIEW */}
      {/* ========================================================= */}
      <section className="bg-cream-100/50 py-16 sm:py-20 border-y border-beige-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 text-center md:text-left">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-2">
                Master Practitioners
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal-900">
                Meet Our Experts
              </h2>
              <p className="text-sm text-charcoal-600 mt-2 max-w-lg">
                Our certified senior stylists and aestheticians dedicate their craft to elevating your natural radiance.
              </p>
            </div>
            <Link to="/team" className="shrink-0">
              <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                View Full Team
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {staff.slice(0, 4).map((member) => (
              <StaffCard key={member.id} staff={member} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. GALLERY PREVIEW */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-2">
            Visual Harmony
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal-900">
            Aura Luxe Gallery
          </h2>
          <p className="text-sm text-charcoal-600 mt-2">
            Glimpses of our bespoke hair styling, bridal transformations, and serene parlour interior.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-beige-100 shadow-subtle"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] uppercase tracking-widest text-gold-300 font-semibold">
                  {item.category}
                </span>
                <h4 className="font-serif text-lg font-bold mt-0.5">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/gallery">
            <Button variant="secondary" size="md" icon={ArrowRight} iconPosition="right">
              View Full Gallery
            </Button>
          </Link>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. CUSTOMER REVIEWS */}
      {/* ========================================================= */}
      <section className="bg-cream-100/60 py-16 sm:py-20 border-y border-beige-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-2">
              Client Testimonials
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal-900">
              Stories of Transformation
            </h2>
            <p className="text-sm text-charcoal-600 mt-2">
              Discover what our esteemed clientele has to say about their pampering experiences with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.slice(0, 3).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. CALL TO ACTION (CTA) */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-charcoal-950 via-charcoal-900 to-charcoal-950 text-white p-8 sm:p-14 lg:p-20 text-center shadow-floating border border-gold-600/30">
          {/* Subtle decorative background glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-gold-600/10 filter blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-rose-500/10 filter blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-gold-400 font-semibold inline-flex items-center gap-1.5">
              <Sparkles size={14} /> Begin Your Journey
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
              Ready for your beauty transformation?
            </h2>

            <p className="text-sm sm:text-base text-cream-200 leading-relaxed font-light">
              Step into an oasis of calm and artistry. Schedule your personalized consultation with our master stylists today.
            </p>

            <div className="pt-4">
              <Link to="/book-appointment">
                <Button variant="gold" size="lg" className="shadow-gold px-9" icon={ArrowRight} iconPosition="right">
                  Book Your Appointment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
