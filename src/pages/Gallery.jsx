import React, { useEffect, useMemo, useState } from 'react';
import { getGallery } from '../services/api';
import { Loading } from '../components/Loading';
import { Image, Sparkles, X } from '../components/icons';

const categories = ['All', 'Hair', 'Makeup', 'Skin', 'Nails', 'Bridal', 'Salon'];

export const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    getGallery()
      .then((items) => mounted && setGallery(Array.isArray(items) ? items : []))
      .catch(() => mounted && setError('We could not load the gallery right now. Please try again shortly.'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const filteredGallery = useMemo(() => (
    selectedCategory === 'All' ? gallery : gallery.filter((item) => item.category?.toLowerCase() === selectedCategory.toLowerCase())
  ), [gallery, selectedCategory]);

  if (loading) return <Loading fullScreen text="Loading our beauty showcase..." />;

  return (
    <div className="pb-16 sm:pb-24">
      <section className="bg-cream-100/70 border-b border-beige-200/80 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold"><Sparkles size={14} /> Her Glow Home Salon</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-charcoal-900 mt-3">Gallery Showcase</h1>
          <p className="text-sm sm:text-base text-charcoal-600 max-w-2xl mx-auto mt-4 leading-relaxed">A glimpse of the transformations, details, and calm salon moments created by our beauty team.</p>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center gap-2 flex-wrap justify-center mb-10" aria-label="Gallery categories">
          {categories.map((category) => <button key={category} type="button" onClick={() => setSelectedCategory(category)} className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${selectedCategory === category ? 'bg-charcoal-900 text-gold-300 shadow-sm' : 'bg-white text-charcoal-700 border border-beige-200 hover:bg-beige-100'}`}>{category}</button>)}
        </div>
        {error && <p className="text-center text-sm text-rose-700 mb-8">{error}</p>}
        {filteredGallery.length > 0 ? <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">{filteredGallery.map((item) => <button key={item.id} type="button" onClick={() => setSelectedImage(item)} className="group relative block w-full overflow-hidden rounded-2xl bg-beige-100 text-left break-inside-avoid border border-beige-200/80 shadow-subtle focus:outline-none focus:ring-2 focus:ring-gold-500"><img src={item.image} alt={item.title} loading="lazy" className="w-full min-h-56 object-cover transition-transform duration-700 group-hover:scale-105" /><span className="absolute top-3 left-3 bg-charcoal-900/90 text-gold-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">{item.category || 'Beauty'}</span><span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/40 to-transparent p-5 pt-16 text-white"><span className="font-serif text-xl block">{item.title}</span>{item.description && <span className="text-xs text-cream-100/85 mt-1 block line-clamp-2">{item.description}</span>}</span></button>)}</div> : <div className="rounded-2xl border border-dashed border-beige-300 bg-white px-6 py-16 text-center"><Image size={32} className="mx-auto text-gold-600" /><h2 className="font-serif text-2xl text-charcoal-900 mt-4">No showcase photos yet</h2><p className="text-sm text-charcoal-600 mt-2">New salon transformations will appear here as they are published.</p></div>}
      </section>
      {selectedImage && <div className="fixed inset-0 z-50 bg-charcoal-950/90 p-4 sm:p-8 flex items-center justify-center" role="dialog" aria-modal="true" aria-label={selectedImage.title} onClick={() => setSelectedImage(null)}><button type="button" onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20" aria-label="Close image"><X size={24} /></button><div className="max-w-5xl max-h-full text-center" onClick={(event) => event.stopPropagation()}><img src={selectedImage.image} alt={selectedImage.title} className="max-h-[75vh] max-w-full object-contain rounded-xl" /><h2 className="font-serif text-2xl text-white mt-4">{selectedImage.title}</h2>{selectedImage.description && <p className="text-sm text-cream-100/80 mt-1">{selectedImage.description}</p>}</div></div>}
    </div>
  );
};
