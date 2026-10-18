import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { ImageField } from '../../components/ImageField';
import { getAppointments } from '../../services/api';
import { supabaseConfigured } from '../../services/supabase';
import { DEFAULT_PROFILE_IMAGE, getCustomerProfileImage } from '../../utils/profileImage';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  Lock,
  CheckCircle
} from '../../components/icons';

export const CustomerProfile = () => {
  const { user, updateUserProfile, updatePassword } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    phone: user?.phone || '',
    dob: user?.dob || '',
    address: user?.address || '',
    skinType: user?.preferences?.skinType || '',
    hairType: user?.preferences?.hairType || '',
    allergies: user?.preferences?.allergies || '',
    favoriteBeverage: user?.preferences?.favoriteBeverage || ''
  });

  const [saving, setSaving] = useState(false);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    setAppointmentsLoading(true);
    setAppointmentsError(false);

    getAppointments(user?.id || 'cust-1')
      .then((appointments) => {
        if (!isCurrent) return;
        setCompletedAppointments(
          appointments
            .filter((appointment) => appointment.status === 'Completed')
            .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
        );
      })
      .catch((error) => {
        console.error('Failed to load completed customer treatments', error);
        if (!isCurrent) return;
        setAppointmentsError(true);
      })
      .finally(() => {
        if (isCurrent) setAppointmentsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [user?.id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile({
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
        phone: formData.phone,
        dob: formData.dob,
        address: formData.address,
        preferences: {
          skinType: formData.skinType,
          hairType: formData.hairType,
          allergies: formData.allergies,
          favoriteBeverage: formData.favoriteBeverage
        }
      });
      addToast('Profile changes saved successfully!', 'success');
    } catch (err) {
      console.error('Error saving profile', err);
      addToast('Failed to save profile changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    setPasswordSaving(true);
    try {
      if (supabaseConfigured) {
        await updatePassword(passwordData.newPassword);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      addToast('Password updated securely!', 'success');
    } catch (error) {
      addToast(error.message || 'Unable to update the password.', 'error');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-1">
            Personal Dossier
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
            Profile & Beauty Preferences
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            Manage your personal data, medical notes, and treatment customizations.
          </p>
        </div>

        <Button
          variant="outline"
          size="md"
          icon={Lock}
          onClick={() => setShowPasswordModal(true)}
        >
          Change Password
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Avatar & Basic Info Card */}
        <div className="bg-white rounded-3xl border border-beige-200 p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-beige-100">
            <div className="relative group">
              <img
                src={getCustomerProfileImage(formData.avatar)}
                alt={formData.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-gold-400 shadow-premium"
                onError={(event) => {
                  event.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                }}
              />
              <span className="absolute bottom-0 right-0 bg-charcoal-900 text-gold-400 p-1.5 rounded-full border border-gold-400 text-xs shadow-sm">
                <Sparkles size={12} />
              </span>
            </div>

            <div className="text-center sm:text-left flex-grow">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900">
                {formData.name}
              </h3>
              <p className="text-xs text-charcoal-500 mt-0.5">{formData.email}</p>
              {user?.isVip && (
                <span className="mt-2 inline-flex text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-charcoal-900 text-gold-300 border border-gold-500/50">
                  VIP Customer
                </span>
              )}
              <p className="mt-3 text-xs font-semibold text-charcoal-700">
                {appointmentsLoading
                  ? 'Loading completed treatments…'
                  : appointmentsError
                  ? 'Completed treatment history is unavailable.'
                  : `${completedAppointments.length} ${completedAppointments.length === 1 ? 'treatment' : 'treatments'} completed`}
              </p>
            </div>
          </div>
          {!appointmentsLoading && !appointmentsError && completedAppointments.length > 0 && (
            <section aria-label="Completed treatments" className="rounded-2xl border border-beige-200 bg-cream-50/60 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-3">
                Completed treatments
              </h4>
              <ul className="space-y-2">
                {completedAppointments.map((appointment) => (
                  <li key={appointment.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm">
                    <span className="font-medium text-charcoal-800">
                      {appointment.serviceName || 'Salon treatment'}
                    </span>
                    <span className="text-xs text-charcoal-500">
                      {appointment.date
                        ? new Date(`${appointment.date}T12:00:00`).toLocaleDateString()
                        : 'Date unavailable'}
                      {appointment.staffName ? ` · ${appointment.staffName}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <ImageField
            label="Profile Photo"
            folder="profile"
            value={formData.avatar}
            onChange={(avatar) => setFormData({ ...formData, avatar })}
            defaultValue={DEFAULT_PROFILE_IMAGE}
            allowRemove
          />

          {/* Form Fields: Name, Email, Phone, DOB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="email"
                  required
                  readOnly={supabaseConfigured}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/40"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Beauty & Personal Preferences Card */}
        <div className="bg-white rounded-3xl border border-beige-200 p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-beige-100">
            <Sparkles size={18} className="text-gold-600" />
            <h3 className="font-serif text-xl font-bold text-charcoal-900">
              Personalized Beauty Preferences
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Skin Type
              </label>
              <select
                value={formData.skinType}
                onChange={(e) => setFormData({ ...formData, skinType: e.target.value })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/40 cursor-pointer"
              >
                <option value="Normal">Normal</option>
                <option value="Combination / Sensitive">Combination / Sensitive</option>
                <option value="Dry & Dehydrated">Dry & Dehydrated</option>
                <option value="Oily & Acne Prone">Oily & Acne Prone</option>
                <option value="Mature / Anti-Aging Focus">Mature / Anti-Aging Focus</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Hair Texture & Density
              </label>
              <input
                type="text"
                value={formData.hairType}
                onChange={(e) => setFormData({ ...formData, hairType: e.target.value })}
                placeholder="e.g. Wavy, Medium Density"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Known Sensitivities & Allergies
              </label>
              <input
                type="text"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="e.g. Mild lavender fragrance sensitivity"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Lounge Welcome Beverage
              </label>
              <select
                value={formData.favoriteBeverage}
                onChange={(e) => setFormData({ ...formData, favoriteBeverage: e.target.value })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/40 cursor-pointer"
              >
                <option value="Green tea with honey">Green tea with honey</option>
                <option value="Chamomile herbal infusion">Chamomile herbal infusion</option>
                <option value="Fresh tender coconut water">Fresh tender coconut water</option>
                <option value="Espresso coffee">Espresso coffee</option>
                <option value="Iced lemon mint cooler">Iced lemon mint cooler</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="gold"
            size="lg"
            loading={saving}
            className="shadow-gold px-8"
            icon={CheckCircle}
          >
            Save Changes
          </Button>
        </div>
      </form>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Account Password"
        subtitle="Ensure your account remains safe with a strong passcode."
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2">
          {!supabaseConfigured && <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              placeholder="Min 8 characters"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              placeholder="Re-type new password"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowPasswordModal(false)}
              disabled={passwordSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gold"
              loading={passwordSaving}
            >
              Update Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
