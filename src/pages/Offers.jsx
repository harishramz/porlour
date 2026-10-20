import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOffers } from '../services/api';
import { OfferCard } from '../components/OfferCard';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import { ArrowRight, Sparkles } from '../components/icons';

export const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    getOffers()
      .then((items) => mounted && setOffers(Array.isArray(items) ? items : []))
      .catch(() => mounted && setError('We could not load today’s offers. Please try again shortly.'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <Loading fullScreen text="Loading current offers..." />;

  return (
    <div className="pb-16 sm:pb-24">
      <section className="bg-charcoal-900 text-cream-50 py-14 sm:py-20"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"><span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold-300 font-semibold"><Sparkles size={14} /> Limited-time beauty privileges</span><h1 className="font-serif text-4xl sm:text-6xl font-light mt-3">Offers & Promos</h1><p className="text-sm sm:text-base text-cream-100/75 max-w-2xl mx-auto mt-4 leading-relaxed">Enjoy thoughtfully curated packages that bring together our most-loved treatments at a special price.</p></div></section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {error && <p className="text-center text-sm text-rose-700 mb-8">{error}</p>}
        {offers.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">{offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)}</div> : <div className="rounded-2xl border border-dashed border-beige-300 bg-white px-6 py-16 text-center"><Sparkles size={32} className="mx-auto text-gold-600" /><h2 className="font-serif text-2xl text-charcoal-900 mt-4">Fresh offers are coming soon</h2><p className="text-sm text-charcoal-600 mt-2">Browse our complete service menu while we prepare the next promotion.</p><Link to="/services" className="inline-block mt-6"><Button variant="gold" icon={ArrowRight} iconPosition="right">View Services</Button></Link></div>}
      </section>
    </div>
  );
};
