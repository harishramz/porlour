import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/Button';
import { Mail, CheckCircle, ArrowLeft } from '../components/icons';

export const ForgotPassword = () => {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      addToast('Reset instructions sent to your email address.', 'success');
    }, 400);
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
              <Link to="/login">
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
                Forgot Password?
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-600 mt-2 leading-relaxed">
                Provide your registered email address and we will send you a secure link to reset your credentials.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
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
              </div>

              <Button
                type="submit"
                variant="gold"
                size="md"
                loading={loading}
                className="w-full shadow-gold"
              >
                Send Reset Link
              </Button>
            </form>

            <div className="pt-4 border-t border-beige-100">
              <Link
                to="/login"
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
