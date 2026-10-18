import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { ImageField } from '../../components/ImageField';
import { supabaseConfigured } from '../../services/supabase';
import { Lock, Mail, User } from '../../components/icons';
import { DEFAULT_PROFILE_IMAGE } from '../../utils/profileImage';

export const AdminProfile = () => {
  const { user, updateUserProfile, updatePassword, updateEmail } = useAuth();
  const { addToast } = useToast();
  const [name, setName] = useState(user.name || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    try {
      await updateUserProfile({ name, avatar });
      addToast('Admin profile updated.', 'success');
    } catch (error) {
      console.error('Failed to update admin profile', error);
      addToast(error.message || 'Unable to update admin profile.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    if (email.trim().toLowerCase() === user.email?.toLowerCase()) {
      addToast('Enter a different email address to change it.', 'error');
      return;
    }
    setSavingEmail(true);
    try {
      await updateEmail(email.trim());
      addToast(
        supabaseConfigured
          ? 'Email change requested. Check your inbox to verify the new address.'
          : 'Admin email updated.',
        'success'
      );
    } catch (error) {
      console.error('Failed to update admin email', error);
      addToast(error.message || 'Unable to update admin email.', 'error');
    } finally {
      setSavingEmail(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (password.length < 8) {
      addToast('Password must be at least 8 characters.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }
    setSavingPassword(true);
    try {
      await updatePassword(password);
      setPassword('');
      setConfirmPassword('');
      addToast('Admin password updated.', 'success');
    } catch (error) {
      console.error('Failed to update admin password', error);
      addToast(error.message || 'Unable to update admin password.', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-7">
      <header>
        <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-1">
          Account Settings
        </span>
        <h1 className="font-serif text-3xl font-bold text-charcoal-900">My Admin Profile</h1>
        <p className="mt-1 text-sm text-charcoal-500">
          Update your profile photo and personal sign-in information.
        </p>
      </header>

      <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl border border-beige-200 p-6 sm:p-8 shadow-subtle space-y-5">
        <h2 className="font-serif text-xl font-bold text-charcoal-900">Profile information</h2>
        <ImageField
          label="Profile photo"
          folder="profile"
          value={avatar}
          onChange={setAvatar}
          defaultValue={DEFAULT_PROFILE_IMAGE}
          allowRemove
        />
        <label className="block text-xs font-semibold text-charcoal-700">
          Full name
          <span className="relative block mt-1">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              required
              maxLength={120}
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-beige-300 py-2.5 pl-9 pr-3 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </span>
        </label>
        <Button variant="gold" type="submit" loading={savingProfile}>Save Profile</Button>
      </form>

      <form onSubmit={handleEmailSubmit} className="bg-white rounded-2xl border border-beige-200 p-6 sm:p-8 shadow-subtle space-y-4">
        <h2 className="font-serif text-xl font-bold text-charcoal-900">Admin email</h2>
        <p className="text-xs text-charcoal-500">
          {supabaseConfigured
            ? 'Supabase will ask you to verify the new email address before it becomes your sign-in email.'
            : 'Demo mode only; configure Supabase to change a live account email.'}
        </p>
        <label className="block text-xs font-semibold text-charcoal-700">
          Email address
          <span className="relative block mt-1">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              required
              type="email"
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-beige-300 py-2.5 pl-9 pr-3 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </span>
        </label>
        <Button variant="secondary" type="submit" loading={savingEmail}>Change Email</Button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl border border-beige-200 p-6 sm:p-8 shadow-subtle space-y-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-charcoal-900">Change password</h2>
          <p className="text-xs text-charcoal-500 mt-1">Choose a password with at least 8 characters.</p>
        </div>
        <label className="block text-xs font-semibold text-charcoal-700">
          New password
          <span className="relative block mt-1">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              required
              type="password"
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-beige-300 py-2.5 pl-9 pr-3 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </span>
        </label>
        <label className="block text-xs font-semibold text-charcoal-700">
          Confirm new password
          <input
            required
            type="password"
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="mt-1 w-full rounded-xl border border-beige-300 px-3 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
        </label>
        <Button variant="secondary" type="submit" loading={savingPassword}>Update Password</Button>
      </form>
    </div>
  );
};
