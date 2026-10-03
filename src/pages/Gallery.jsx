import React, { useState, useEffect } from 'react';
import { getGallery } from '../services/api';
import { Loading } from '../components/Loading';
import { Modal } from '../components/Modal';
import { Sparkles, Eye, X } from '../components/icons';

export const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePhoto, setActivePhoto] = useState(null);

  const categories = ['All', 'Hair', 'Makeup', 'Skin', 'Nails', 'Bridal', 'Salon'];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await getGallery();
        setGallery(data);
      } catch (err) {
        console.error('Failed to load gallery items', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredGallery = gallery.filter((item) =>
    selectedCategory === 'All' ? true : item.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  if (loading) {
    return <Loading fullScreen text="Loading beauty visual showcase..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold flex items-center justify-center gap-1.5 mb-2">
          <Sparkles size={14} /> Haute Portfolio
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-charcoal-900 leading-tight">
          Visual Elegance & Craft
        </h1>
        <p className="text-sm sm:text-base text-charcoal-600 mt-3 leading-relaxed">
          Witness transformations from our hair ateliers, bridal suites, and serene salon spaces.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all ${
              selectedCategory === cat
                ? 'bg-charcoal-900 text-gold-300 shadow-md ring-2 ring-gold-400/40'
                : 'bg-white text-charcoal-700 border border-beige-200 hover:bg-beige-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry / Grid Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGallery.map((item) => (
          <div
            key={item.id}
            onClick={() => setActivePhoto(item)}
            className="group relative rounded-3xl overflow-hidden bg-beige-100 shadow-subtle border border-beige-200 cursor-pointer aspect-[4/3] sm:aspect-square lg:aspect-[4/5] luxury-card-hover"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              loading="lazy"
            />
            {/* Dark glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 text-white">
              <span className="text-[10px] uppercase font-bold tracking-widest text-gold-300 mb-1">
                {item.category}
              </span>
              <h3 className="font-serif text-xl font-bold leading-snug">{item.title}</h3>
              <p className="text-xs text-cream-200 mt-1 line-clamp-2">{item.description}</p>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-gold-300 font-semibold">
                <Eye size={14} /> Click to expand
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <Modal
          isOpen={!!activePhoto}
          onClose={() => setActivePhoto(null)}
          title={activePhoto.title}
          subtitle={`Category: ${activePhoto.category}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden bg-charcoal-950 max-h-[65vh] flex items-center justify-center">
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                className="max-h-[65vh] w-auto object-contain mx-auto"
              />
            </div>
            <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
              {activePhoto.description}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
