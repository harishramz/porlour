import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { Modal } from '../../components/Modal';
import { supabaseConfigured } from '../../services/supabase';
import { getAdmins, inviteAdmin, deleteAdmin, sendAdminPasswordSetup } from '../../services/api';
import { Lock, Plus, Trash2 } from '../../components/icons';
import { DEFAULT_PROFILE_IMAGE } from '../../utils/profileImage';

export const AdminAccounts = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(supabaseConfigured);
  const [submitting, setSubmitting] = useState(false);
  const [sendingSetupFor, setSendingSetupFor] = useState(null);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '' });
  const [adminToDelete, setAdminToDelete] = useState(null);

  const loadAdmins = useCallback(async () => {
    if (!supabaseConfigured) return;
    setLoading(true);
    try {
      setAdmins(await getAdmins());
    } catch (error) {
      console.error('Failed to load admin accounts', error);
      addToast(error.message || 'Unable to load admin accounts.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const handleInvite = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const admin = await inviteAdmin(inviteForm);
      setAdmins((current) => [...current, admin]);
      setInviteForm({ name: '', email: '' });
      addToast(`Invitation sent to ${admin.email}. They can set their password from the email link.`, 'success');
    } catch (error) {
      console.error('Failed to invite admin', error);
      addToast(error.message || 'Unable to invite administrator.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!adminToDelete) return;
    setSubmitting(true);
    try {
      await deleteAdmin(adminToDelete.id);
      setAdmins((current) => current.filter((admin) => admin.id !== adminToDelete.id));
      addToast(`${adminToDelete.name || adminToDelete.email} no longer has administrator access.`, 'info');
      setAdminToDelete(null);
    } catch (error) {
      console.error('Failed to remove admin access', error);
      addToast(error.message || 'Unable to remove administrator access.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendPasswordSetup = async (admin) => {
    setSendingSetupFor(admin.id);
    try {
      await sendAdminPasswordSetup(admin.id);
      addToast(`Password setup email sent to ${admin.email}.`, 'success');
    } catch (error) {
      console.error('Failed to send admin password setup email', error);
      addToast(error.message || 'Unable to send password setup email.', 'error');
    } finally {
      setSendingSetupFor(null);
    }
  };

  return (
    <div className="max-w-5xl space-y-7">
      <header>
        <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-1">
          Access Control
        </span>
        <h1 className="font-serif text-3xl font-bold text-charcoal-900">Manage Admin Access</h1>
        <p className="mt-1 text-sm text-charcoal-500">
          Invite administrators and remove their access when needed.
        </p>
      </header>

      {!supabaseConfigured ? (
        <div className="rounded-2xl border border-beige-200 bg-white p-6 text-sm text-charcoal-600">
          Administrator invitations require a connected Supabase project and the configured Express API.
        </div>
      ) : (
        <>
          <form onSubmit={handleInvite} className="rounded-2xl border border-beige-200 bg-white p-6 sm:p-8 shadow-subtle space-y-4">
            <div className="flex items-center gap-2">
              <Plus size={18} className="text-gold-700" />
              <h2 className="font-serif text-xl font-bold text-charcoal-900">Invite an administrator</h2>
            </div>
            <p className="text-xs text-charcoal-500">
              An invitation email will let them securely set up their own sign-in password.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block text-xs font-semibold text-charcoal-700">
                Full name
                <input
                  required
                  maxLength={120}
                  value={inviteForm.name}
                  onChange={(event) => setInviteForm((form) => ({ ...form, name: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-beige-300 px-3 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </label>
              <label className="block text-xs font-semibold text-charcoal-700">
                Email address
                <input
                  required
                  type="email"
                  maxLength={254}
                  value={inviteForm.email}
                  onChange={(event) => setInviteForm((form) => ({ ...form, email: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-beige-300 px-3 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </label>
            </div>
            <Button variant="gold" type="submit" loading={submitting} icon={Plus}>Send Admin Invitation</Button>
          </form>

          <section className="rounded-2xl border border-beige-200 bg-white shadow-subtle overflow-hidden">
            <div className="border-b border-beige-200 px-6 py-4">
              <h2 className="font-serif text-xl font-bold text-charcoal-900">Administrator accounts</h2>
              <p className="mt-1 text-xs text-charcoal-500">
                Passwords are never displayed. Each admin manages their own password from My Profile.
              </p>
            </div>
            {loading ? <Loading text="Loading administrator accounts..." /> : admins.length === 0 ? (
              <p className="p-6 text-sm text-charcoal-500">No administrator accounts were found.</p>
            ) : (
              <ul className="divide-y divide-beige-100">
                {admins.map((admin) => (
                  <li key={admin.id} className="flex items-center justify-between gap-4 px-6 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={admin.avatar || DEFAULT_PROFILE_IMAGE}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover border border-beige-200"
                        onError={(event) => {
                          event.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                        }}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-charcoal-900">{admin.name || 'Administrator'}</p>
                        <p className="truncate text-xs text-charcoal-500">{admin.email}</p>
                        {admin.id === user.id && <span className="text-[11px] font-semibold text-emerald-700">Your account</span>}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Lock}
                        loading={sendingSetupFor === admin.id}
                        disabled={submitting || sendingSetupFor !== null}
                        onClick={() => handleSendPasswordSetup(admin)}
                      >
                        Send Password Setup
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        disabled={admin.id === user.id || submitting || sendingSetupFor !== null || admins.length <= 1}
                        onClick={() => setAdminToDelete(admin)}
                      >
                        Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      <Modal
        isOpen={!!adminToDelete}
        onClose={() => !submitting && setAdminToDelete(null)}
        title="Remove administrator access?"
        subtitle={adminToDelete?.email}
        footer={
          <>
            <Button variant="secondary" disabled={submitting} onClick={() => setAdminToDelete(null)}>Cancel</Button>
            <Button variant="danger" loading={submitting} onClick={handleDelete}>Remove Access</Button>
          </>
        }
      >
        <p className="text-sm text-charcoal-600">
          This permanently removes the administrator’s sign-in account and associated profile. They will no longer be able to access the admin portal.
        </p>
      </Modal>
    </div>
  );
};
