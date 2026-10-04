import React, { useState, useEffect, useMemo } from 'react';
import {
  getServices,
  createService,
  updateService,
  deleteService
} from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Loading } from '../../components/Loading';
import { ImageField } from '../../components/ImageField';
import {
  Scissors,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  CheckCircle,
  Eye,
  Clock,
  Sparkles
} from '../../components/icons';

export const AdminServices = () => {
  const { addToast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Service form data
  const defaultForm = {
    name: '',
    category: 'Hair',
    shortDescription: '',
    description: '',
    price: 1500,
    duration: '60 mins',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
    status: 'Active',
    isPopular: false
  };
  const [formData, setFormData] = useState(defaultForm);
  const [currentEditId, setCurrentEditId] = useState(null);

  const categories = ['All', 'Hair', 'Skin', 'Nails', 'Makeup', 'Beauty'];

  const fetchServicesData = async () => {
    try {
      const data = await getServices({ includeInactive: true });
      setServices(data);
    } catch (err) {
      console.error('Failed to fetch services', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesData();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentEditId(null);
    setFormData(defaultForm);
    setModalOpen(true);
  };

  const handleOpenEditModal = (service) => {
    setIsEditing(true);
    setCurrentEditId(service.id);
    setFormData({
      name: service.name,
      category: service.category,
      shortDescription: service.shortDescription || '',
      description: service.description || '',
      price: service.price,
      duration: service.duration,
      image: service.image,
      status: service.status || 'Active',
      isPopular: !!service.isPopular
    });
    setModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Please provide a service title.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      if (isEditing && currentEditId) {
        await updateService(currentEditId, formData);
        addToast(`Service "${formData.name}" updated successfully.`, 'success');
      } else {
        await createService(formData);
        addToast(`New service "${formData.name}" created!`, 'success');
      }
      setModalOpen(false);
      await fetchServicesData();
    } catch (err) {
      console.error('Service save failed', err);
      addToast('Failed to save service.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    try {
      await deleteService(serviceToDelete.id);
      addToast(`Service "${serviceToDelete.name}" deleted.`, 'info');
      setDeleteModalOpen(false);
      setServiceToDelete(null);
      await fetchServicesData();
    } catch (err) {
      console.error('Delete failed', err);
      addToast('Failed to delete service.', 'error');
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesCat = categoryFilter === 'All' || s.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [services, categoryFilter, searchQuery]);

  if (loading) {
    return <Loading text="Loading service catalog inventory..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-1">
            Service Roster
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Manage Salon Services
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Add, edit, or adjust pricing and categorization for all parlour rituals.
          </p>
        </div>

        <Button
          variant="gold"
          size="md"
          icon={Plus}
          onClick={handleOpenAddModal}
        >
          Add New Service
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-beige-200 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search treatments..."
            className="w-full text-xs sm:text-sm pl-10 pr-3 py-2 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                categoryFilter.toLowerCase() === cat.toLowerCase()
                  ? 'bg-charcoal-900 text-gold-300 shadow-sm'
                  : 'bg-beige-100 text-charcoal-700 hover:bg-beige-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-beige-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-cream-50/70 border-b border-beige-200 text-charcoal-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-semibold">Service</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Duration</th>
                <th className="py-3 px-4 font-semibold">Price</th>
                <th className="py-3 px-4 font-semibold">Rating</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-100 text-charcoal-700">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-beige-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-11 h-11 rounded-xl object-cover shrink-0 border border-beige-200"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-charcoal-900 truncate max-w-xs">
                          {service.name}
                        </p>
                        <p className="text-[11px] text-charcoal-500 truncate max-w-xs">
                          {service.shortDescription}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="gold" size="sm">
                      {service.category}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-charcoal-600">
                    {service.duration}
                  </td>
                  <td className="py-3 px-4 font-serif font-bold text-charcoal-900 whitespace-nowrap">
                    ₹{service.price.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    ★ {service.rating} <span className="text-charcoal-400 text-xs">({service.reviewsCount})</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge variant={service.status}>{service.status}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(service)}
                        className="p-1.5 rounded-lg text-charcoal-600 hover:text-charcoal-900 hover:bg-beige-100 transition-colors"
                        title="Edit Service"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setServiceToDelete(service);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Service Details' : 'Add New Salon Service'}
        subtitle="Manage service parameters, imagery, and pricing"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Service Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. 24K Radiance Facial"
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
                <option value="Skin">Skin</option>
                <option value="Nails">Nails</option>
                <option value="Makeup">Makeup</option>
                <option value="Beauty">Beauty</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="100"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Duration (e.g. 45 mins, 60 mins)
              </label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
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

            <div className="sm:col-span-2">
              <ImageField
                label="Service Image"
                folder="services"
                value={formData.image}
                onChange={(image) => setFormData({ ...formData, image })}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Short Teaser Description
              </label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="1-sentence summary for catalogue cards"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Comprehensive Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Full details on methodology, products used, and experience"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-beige-200">
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gold"
              loading={submitting}
              icon={CheckCircle}
            >
              {isEditing ? 'Save Changes' : 'Create Service'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Service"
        subtitle="This action cannot be undone."
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
            >
              Delete Permanently
            </Button>
          </>
        }
      >
        <p className="text-xs sm:text-sm text-charcoal-700">
          Are you sure you want to delete <strong>{serviceToDelete?.name}</strong> from the service directory?
        </p>
      </Modal>
    </div>
  );
};
