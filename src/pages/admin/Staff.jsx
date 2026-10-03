import React, { useState, useEffect } from 'react';
import {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff
} from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Loading } from '../../components/Loading';
import {
  Users,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  Award,
  Sparkles,
  CheckCircle
} from '../../components/icons';

export const AdminStaff = () => {
  const { addToast } = useToast();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  // View Schedule Modal
  const [scheduleModalStaff, setScheduleModalStaff] = useState(null);

  // Delete modal
  const [deleteModalStaff, setDeleteModalStaff] = useState(null);

  const defaultForm = {
    name: '',
    displayName: '',
    role: 'Senior Stylist',
    specialization: '',
    experience: '5+ Years Experience',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    status: 'Active',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: '10:00 AM - 07:00 PM'
  };
  const [formData, setFormData] = useState(defaultForm);

  const fetchStaffData = async () => {
    try {
      const data = await getStaff();
      setStaffList(data);
    } catch (err) {
      console.error('Failed to load staff list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentEditId(null);
    setFormData(defaultForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (staff) => {
    setIsEditing(true);
    setCurrentEditId(staff.id);
    setFormData({
      name: staff.name,
      displayName: staff.displayName || staff.name.split(' ')[0],
      role: staff.role,
      specialization: staff.specialization,
      experience: staff.experience,
      avatar: staff.avatar,
      status: staff.status || 'Active',
      workingDays: staff.workingDays || ['Monday', 'Tuesday', 'Wednesday'],
      workingHours: staff.workingHours || '10:00 AM - 07:00 PM'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing && currentEditId) {
        await updateStaff(currentEditId, formData);
        addToast(`Staff profile for ${formData.name} updated.`, 'success');
      } else {
        await createStaff(formData);
        addToast(`New practitioner ${formData.name} added to team!`, 'success');
      }
      setModalOpen(false);
      await fetchStaffData();
    } catch (err) {
      console.error('Staff operation failed', err);
      addToast('Failed to save staff record.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModalStaff) return;
    try {
      await deleteStaff(deleteModalStaff.id);
      addToast(`${deleteModalStaff.name} removed from team.`, 'info');
      setDeleteModalStaff(null);
      await fetchStaffData();
    } catch (err) {
      console.error('Delete failed', err);
      addToast('Failed to delete staff member.', 'error');
    }
  };

  if (loading) {
    return <Loading text="Loading staff records..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-1">
            Talent Management
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Manage Salon Staff
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Configure practitioners, specializations, schedules, and active duty status.
          </p>
        </div>

        <Button
          variant="gold"
          size="md"
          icon={Plus}
          onClick={handleOpenAdd}
        >
          Add Staff Member
        </Button>
      </div>

      {/* Staff Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl border border-beige-200 p-6 shadow-subtle flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gold-300 shadow-sm"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-lg text-charcoal-900 leading-tight">
                      {member.name}
                    </h3>
                    <p className="text-xs text-gold-700 font-medium">{member.role}</p>
                    <span className="text-[11px] text-charcoal-400 block mt-0.5">
                      ★ {member.rating || 5.0} ({member.reviewsCount || 0} reviews)
                    </span>
                  </div>
                </div>
                <Badge variant={member.status || 'Active'}>{member.status || 'Active'}</Badge>
              </div>

              <div className="space-y-2 text-xs text-charcoal-600 bg-cream-50 p-3.5 rounded-xl border border-beige-200/80 mb-4">
                <p>
                  <strong className="text-charcoal-800">Specialization:</strong>{' '}
                  {member.specialization}
                </p>
                <p>
                  <strong className="text-charcoal-800">Experience:</strong> {member.experience}
                </p>
                <p>
                  <strong className="text-charcoal-800">Hours:</strong> {member.workingHours || '10:00 AM - 07:00 PM'}
                </p>
              </div>
            </div>

            {/* Actions: View Schedule, Edit, Delete */}
            <div className="pt-3 border-t border-beige-100 flex items-center justify-between gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={Calendar}
                onClick={() => setScheduleModalStaff(member)}
              >
                View Schedule
              </Button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(member)}
                  className="p-2 rounded-lg text-charcoal-600 hover:text-charcoal-900 hover:bg-beige-100 transition-colors"
                  title="Edit Staff Member"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => setDeleteModalStaff(member)}
                  className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                  title="Delete Staff Member"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Staff Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Staff Profile' : 'Add New Staff Member'}
        subtitle="Manage practitioner bio, specialization, and availability"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Anitha Nair"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Display Name (Short)
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="e.g. Anitha"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Role / Title
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Senior Aesthetician"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Experience
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="e.g. 7+ Years Experience"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Specialization
              </label>
              <input
                type="text"
                required
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="e.g. 24K Gold Therapy, Hydra Peels, Sensitive Skin"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Photo URL
              </label>
              <input
                type="url"
                required
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Duty Hours
              </label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                placeholder="10:00 AM - 07:00 PM"
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
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
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
            >
              {isEditing ? 'Save Staff Changes' : 'Create Staff Profile'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Schedule Modal */}
      {scheduleModalStaff && (
        <Modal
          isOpen={!!scheduleModalStaff}
          onClose={() => setScheduleModalStaff(null)}
          title={`Duty Schedule: ${scheduleModalStaff.name}`}
          subtitle={scheduleModalStaff.role}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-cream-50 border border-beige-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-charcoal-500 uppercase tracking-wider">Working Hours</span>
                <p className="font-serif text-lg font-bold text-charcoal-900">
                  {scheduleModalStaff.workingHours || '10:00 AM - 07:00 PM'}
                </p>
              </div>
              <Badge variant={scheduleModalStaff.status}>{scheduleModalStaff.status}</Badge>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 block mb-2">
                Rostered Days of the Week:
              </span>
              <div className="flex flex-wrap gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                  const isScheduled = (scheduleModalStaff.workingDays || []).includes(day);
                  return (
                    <span
                      key={day}
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        isScheduled
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold'
                          : 'bg-beige-100 text-charcoal-400 line-through'
                      }`}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalStaff && (
        <Modal
          isOpen={!!deleteModalStaff}
          onClose={() => setDeleteModalStaff(null)}
          title="Delete Staff Member"
          subtitle="Confirm removal from salon roster"
          footer={
            <>
              <Button variant="secondary" onClick={() => setDeleteModalStaff(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Confirm Delete
              </Button>
            </>
          }
        >
          <p className="text-xs sm:text-sm text-charcoal-700">
            Are you sure you want to remove <strong>{deleteModalStaff.name}</strong> from the staff team?
          </p>
        </Modal>
      )}
    </div>
  );
};
