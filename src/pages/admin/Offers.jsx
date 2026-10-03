import React, { useState, useEffect } from 'react';
import { getOffers, createOffer, updateOffer, deleteOffer } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Loading } from '../../components/Loading';
import { Tag, Plus, Edit3, Trash2, CheckCircle, Sparkles } from '../../components/icons';

export const AdminOffers = () => {
  const { addToast } = useToast();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const defaultForm = {
    title: '',
    tagline: '',
    originalPrice: 5000,
    discountedPrice: 3500,
    validUntil: '31 December 2026',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    description: '',
    inclusionsStr: '24K Facial, Foot Spa, Hair Wash',
    badge: 'Seasonal Special',
    status: 'Active'
  };
  const [formData, setFormData] = useState(defaultForm);

  const fetchOffersData = async () => {
    try {
      const data = await getOffers();
      setOffers(data);
    } catch (err) {
      console.error('Failed to load offers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffersData();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentEditId(null);
    setFormData(defaultForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (offer) => {
    setIsEditing(true);
    setCurrentEditId(offer.id);
    setFormData({
      title: offer.title,
      tagline: offer.tagline || '',
      originalPrice: offer.originalPrice,
      discountedPrice: offer.discountedPrice,
      validUntil: offer.validUntil || '31 December 2026',
      image: offer.image,
      description: offer.description || '',
      inclusionsStr: (offer.inclusions || []).join(', '),
      badge: offer.badge || '',
      status: offer.status || 'Active'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        tagline: formData.tagline,
        originalPrice: Number(formData.originalPrice),
        discountedPrice: Number(formData.discountedPrice),
        validUntil: formData.validUntil,
        image: formData.image,
        description: formData.description,
        inclusions: formData.inclusionsStr.split(',').map((s) => s.trim()).filter(Boolean),
        badge: formData.badge,
        status: formData.status
      };

      if (isEditing && currentEditId) {
        await updateOffer(currentEditId, payload);
        addToast(`Offer "${formData.title}" updated.`, 'success');
      } else {
        await createOffer(payload);
        addToast(`Promotional package "${formData.title}" created!`, 'success');
      }
      setModalOpen(false);
      await fetchOffersData();
    } catch (err) {
      console.error('Offer save error', err);
      addToast('Failed to save offer.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete package "${title}"?`)) {
      try {
        await deleteOffer(id);
        addToast('Package deleted.', 'info');
        await fetchOffersData();
      } catch (err) {
        console.error('Delete offer failed', err);
        addToast('Failed to delete offer.', 'error');
      }
    }
  };

  if (loading) {
    return <Loading text="Loading promotional campaigns..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-1">
            Campaign Administration
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Manage Packages & Offers
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Configure promotional bundles, seasonal privileges, and discount tiers.
          </p>
        </div>

        <Button
          variant="gold"
          size="md"
          icon={Plus}
          onClick={handleOpenAdd}
        >
          Create Package Offer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-2xl border border-beige-200 overflow-hidden shadow-subtle flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 bg-beige-100">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    {offer.discountPercent}% OFF
                  </span>
                  <Badge variant={offer.status}>{offer.status}</Badge>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-serif text-xl font-bold text-charcoal-900">{offer.title}</h3>
                <p className="text-xs text-gold-700 font-semibold">{offer.tagline}</p>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="font-serif text-xl font-bold text-charcoal-900">
                    ₹{offer.discountedPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="line-through text-xs text-charcoal-400">
                    ₹{offer.originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-xs text-charcoal-500 mt-1 line-clamp-2">
                  Includes: {(offer.inclusions || []).join(' • ')}
                </p>
              </div>
            </div>

            <div className="p-5 pt-3 border-t border-beige-100 flex items-center justify-between">
              <span className="text-[11px] text-charcoal-500">
                Expires: {offer.validUntil}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(offer)}
                  className="p-1.5 rounded-lg text-charcoal-600 hover:bg-beige-100"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => handleDelete(offer.id, offer.title)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Package Offer' : 'Create Package Offer'}
        subtitle="Configure package pricing and inclusions"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              Package Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              Tagline / Subtitle
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Original Price (₹)
              </label>
              <input
                type="number"
                required
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Offer Price (₹)
              </label>
              <input
                type="number"
                required
                value={formData.discountedPrice}
                onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              Inclusions (Comma separated)
            </label>
            <input
              type="text"
              required
              value={formData.inclusionsStr}
              onChange={(e) => setFormData({ ...formData, inclusionsStr: e.target.value })}
              placeholder="e.g. Bridal Visage, Hair Styling, 24K Facial"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Valid Until
              </label>
              <input
                type="text"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              Banner Image URL
            </label>
            <input
              type="url"
              required
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-beige-200">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" loading={submitting}>
              {isEditing ? 'Save Offer' : 'Create Offer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
