import React, { useState, useEffect } from 'react';
import { getGallery, addGalleryItem, deleteGalleryItem } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Loading } from '../../components/Loading';
import { Image, Plus, Trash2, Eye, Sparkles } from '../../components/icons';

export const AdminGallery = () => {
  const { addToast } = useToast();
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Hair',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    description: ''
  });

  const categories = ['All', 'Hair', 'Makeup', 'Skin', 'Nails', 'Bridal', 'Salon'];

  const fetchGalleryData = async () => {
    try {
      const data = await getGallery();
      setGallery(data);
    } catch (err) {
      console.error('Failed to load gallery', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addGalleryItem(formData);
      addToast('New photograph added to gallery showcase!', 'success');
      setModalOpen(false);
      setFormData({
        title: '',
        category: 'Hair',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        description: ''
      });
      await fetchGalleryData();
    } catch (err) {
      console.error('Gallery add error', err);
      addToast('Failed to add photo.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete photo "${title}"?`)) {
      try {
        await deleteGalleryItem(id);
        addToast('Photo removed from gallery.', 'info');
        await fetchGalleryData();
      } catch (err) {
        console.error('Delete photo failed', err);
        addToast('Failed to delete photo.', 'error');
      }
    }
  };

  const filtered = gallery.filter((item) =>
    selectedCat === 'All' ? true : item.category.toLowerCase() === selectedCat.toLowerCase()
  );

  if (loading) {
    return <Loading text="Loading gallery archives..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-1">
            Media Asset Manager
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Manage Visual Gallery
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Curate photography showcased on the public website and service lookbooks.
          </p>
        </div>

        <Button
          variant="gold"
          size="md"
          icon={Plus}
          onClick={() => setModalOpen(true)}
        >
          Add Photo Asset
        </Button>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCat === cat
                ? 'bg-charcoal-900 text-gold-300 shadow-sm'
                : 'bg-white text-charcoal-700 border border-beige-200 hover:bg-beige-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl border border-beige-200 overflow-hidden shadow-subtle flex flex-col justify-between"
          >
            <div>
              <div className="relative h-56 bg-beige-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-charcoal-900/90 text-gold-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  {item.category}
                </span>
              </div>
              <div className="p-4">
                <h4 className="font-serif text-lg font-bold text-charcoal-900">{item.title}</h4>
                <p className="text-xs text-charcoal-600 mt-1 line-clamp-2">{item.description}</p>
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-beige-100 flex justify-end">
              <button
                onClick={() => handleDelete(item.id, item.title)}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1"
              >
                <Trash2 size={15} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Photo Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Gallery Photograph"
        subtitle="Publish a new transformation or interior picture to the showcase"
      >
        <form onSubmit={handleAddPhoto} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              Photo Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Amber Balayage on Silk Curls"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white"
            >
              <option value="Hair">Hair</option>
              <option value="Makeup">Makeup</option>
              <option value="Skin">Skin</option>
              <option value="Nails">Nails</option>
              <option value="Bridal">Bridal</option>
              <option value="Salon">Salon</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              required
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              Description / Caption
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Highlight stylist, technique, or event context"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-beige-200">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" loading={submitting}>
              Upload Photo
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
