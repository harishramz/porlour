import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/Button';
import { Mail, CheckCircle, ArrowLeft } from '../components/icons';
import { supabaseConfigured } from '../services/supabase';

export const ForgotPassword = () => {
  const { sendPasswordReset, updatePassword, logout } = useAuth();
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const returnTo = searchParams.get('returnTo') === '/admin/login' ? '/admin/login' : '/login';
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const isResetMode = searchParams.get('mode') === 'reset';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isResetMode && newPassword !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    setLoading(true);
    try {
      if (isResetMode) {
        await updatePassword(newPassword);
        await logout();
        addToast('Password updated. Sign in with your new password.', 'success');
        navigate(returnTo);
        return;
      }

      if (supabaseConfigured) {
        await sendPasswordReset(email, `/forgot-password?mode=reset&returnTo=${encodeURIComponent(returnTo)}`);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
      setSubmitted(true);
      addToast('Reset instructions sent to your email address.', 'success');
    } catch (error) {
      addToast(error.message || 'Unable to process password recovery.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-beige-200 shadow-floating p-8 sm:p-10 text-center">
        {submitted ? (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle size={32} />
            </div>
            <h2 className="font-serif text-2xl font-bold text-charcoal-900">Check Your Inbox</h2>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
              We have dispatched password recovery instructions to{' '}
              <strong className="text-charcoal-900">{email}</strong>.
            </p>
            <div className="pt-4">
              <Link to={returnTo}>
                <Button variant="secondary" size="md" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-1">
                Account Recovery
              </span>
              <h2 className="font-serif text-3xl font-bold text-charcoal-900">
                {isResetMode ? 'Choose a New Password' : 'Forgot Password?'}
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-600 mt-2 leading-relaxed">
                {isResetMode
                  ? 'Enter and confirm your new password to secure your account.'
                  : 'Provide your registered email address and we will send you a secure link to reset your credentials.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {isResetMode ? (
                <>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700">
                    New Password
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      className="mt-1.5 w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/30"
                    />
                  </label>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700">
                    Confirm New Password
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="mt-1.5 w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/30"
                    />
                  </label>
                </>
              ) : <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/30"
                  />
                </div>
              </div>}

              <Button
                type="submit"
                variant="gold"
                size="md"
                loading={loading}
                className="w-full shadow-gold"
              >
                {isResetMode ? 'Update Password' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="pt-4 border-t border-beige-100">
              <Link
                to={returnTo}
                className="inline-flex items-center gap-1.5 text-xs text-charcoal-600 hover:text-charcoal-900 font-medium"
              >
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
