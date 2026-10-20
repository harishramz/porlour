import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGallery, getOffers, getServices } from '../services/api';
import { ServiceCard } from '../components/ServiceCard';
import { OfferCard } from '../components/OfferCard';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import { ArrowRight, Image, Sparkles } from '../components/icons';

export const Home = () => {
  const [services, setServices] = useState([]);
  const [offers, setOffers] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getServices(), getOffers(), getGallery()])
      .then(([servicesResult, offersResult, galleryResult]) => {
        if (servicesResult.status === 'fulfilled') setServices(servicesResult.value);
        if (offersResult.status === 'fulfilled') setOffers(offersResult.value);
        if (galleryResult.status === 'fulfilled') setGallery(galleryResult.value);
        if (servicesResult.status === 'rejected') console.error('Failed to load salon services', servicesResult.reason);
        if (offersResult.status === 'rejected') console.error('Failed to load salon offers', offersResult.reason);
        if (galleryResult.status === 'rejected') console.error('Failed to load salon gallery', galleryResult.reason);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullScreen text="Loading the Her Glow service menu..." />;

  return (
    <div className="pb-16">
      <section
        className="relative isolate overflow-hidden border-y border-beige-200/80 py-12 sm:py-20"
        style={{ backgroundImage: "url('/images/home-background.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 -z-10 bg-white/65" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 bg-cream-100 text-gold-700 px-4 py-1.5 rounded-full border border-gold-300/60 text-xs font-semibold uppercase tracking-[0.2em]">
              <Sparkles size={15} /> Her Glow Home Salon
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl xl:text-7xl font-light text-charcoal-900 leading-[1.05] mt-6">
              Look Good.
              <br />
              <span className="italic font-semibold text-gold-700">Feel Good.</span>
              <br />
              Be You.
            </h1>
            <p className="text-base sm:text-lg text-charcoal-600 max-w-xl mx-auto lg:mx-0 mt-5 leading-relaxed">
              Explore threading, waxing, facials, massage, nail care and hair services, with prices from our salon menu.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mt-8">
              <Link to="/services">
                <Button variant="gold" size="lg" icon={ArrowRight} iconPosition="right">
                  View Services & Prices
                </Button>
              </Link>
              <Link to="/book-appointment">
                <Button variant="secondary" size="lg">
                  Book an Appointment
                </Button>
              </Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-md rounded-3xl overflow-hidden border border-white/70 shadow-floating bg-white/45 backdrop-blur-sm p-4">
            <img
              src="/images/her-glow-logo.jpeg"
              alt="Her Glow Home Salon logo — Look Good, Feel Good, Be You"
              className="w-full h-full object-contain"
            />
          </div>
          </div>
        </div>
      </section>

      <section className="bg-cream-100/70 border-y border-beige-200/80 py-14 sm:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-2">
                From the salon menu
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal-900">
                Popular Services
              </h2>
            </div>
            <Link to="/services" className="shrink-0">
              <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                See Full Menu
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.slice(0, 8).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-2">Limited-time privileges</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal-900">Offers & Promos</h2>
              <p className="text-sm text-charcoal-600 mt-2">Curated packages for your next glow-up.</p>
            </div>
            <Link to="/offers" className="shrink-0"><Button variant="outlineGold" size="sm" icon={ArrowRight} iconPosition="right">View All Offers</Button></Link>
          </div>
          {offers.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{offers.slice(0, 3).map((offer) => <OfferCard key={offer.id} offer={offer} />)}</div> : <div className="rounded-2xl border border-dashed border-beige-300 bg-white px-6 py-10 text-center"><p className="font-serif text-xl text-charcoal-900">New packages are coming soon.</p><Link to="/services" className="inline-block mt-4"><Button variant="secondary" size="sm">Browse Services</Button></Link></div>}
        </div>
      </section>

      <section className="bg-charcoal-900 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-gold-300 font-semibold block mb-2">Our work, your inspiration</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-white">Gallery Showcase</h2>
              <p className="text-sm text-cream-100/70 mt-2">Explore the details behind every Her Glow experience.</p>
            </div>
            <Link to="/gallery" className="shrink-0"><Button variant="outlineGold" size="sm" icon={ArrowRight} iconPosition="right">Explore Gallery</Button></Link>
          </div>
          {gallery.length > 0 ? <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">{gallery.slice(0, 6).map((item) => <Link key={item.id} to="/gallery" className="group relative aspect-square overflow-hidden rounded-xl bg-charcoal-800"><img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /><span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal-950/90 to-transparent p-3 pt-10 text-[11px] text-white line-clamp-2">{item.title}</span></Link>)}</div> : <div className="rounded-2xl border border-white/15 border-dashed px-6 py-10 text-center"><Image size={28} className="mx-auto text-gold-300" /><p className="font-serif text-xl text-white mt-3">Our latest transformations will appear here.</p></div>}
        </div>
      </section>
    </div>
  );
};
