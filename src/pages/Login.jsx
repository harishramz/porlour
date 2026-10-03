import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/Button';
import { Sparkles, Mail, Lock, User, ShieldCheck, ArrowRight } from '../components/icons';

export const Login = () => {
  const { login, loginAsCustomer, loginAsAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('harish.varma@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (email.toLowerCase().includes('admin')) {
        loginAsAdmin();
        addToast('Welcome back, Admin Manager!', 'success');
        navigate('/admin');
      } else {
        loginAsCustomer();
        addToast('Welcome back, Harish!', 'success');
        navigate('/dashboard');
      }
    }, 400);
  };

  const handleGoogleLogin = () => {
    loginAsCustomer();
    addToast('Authenticated with Google as Harish Varma.', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-beige-200 shadow-floating overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Side: Desktop Beauty Image (5 cols) */}
        <div className="hidden md:block md:col-span-5 relative bg-charcoal-950 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
            alt="Luxury Beauty Lounge"
            className="w-full h-full object-cover opacity-80 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/30 to-transparent flex flex-col justify-end p-8 text-white">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-gold-400 mb-1">
              Member Sanctuary
            </span>
            <h3 className="font-serif text-2xl font-bold leading-tight">
              Reclaim Your Personal Glow
            </h3>
            <p className="text-xs text-cream-200 mt-2 font-light leading-relaxed">
              Manage appointments, unlock personalized skin therapies, and access VIP seasonal privileges.
            </p>
          </div>
        </div>

        {/* Right Side: Form (7 cols) */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-1">
                Welcome Back
              </span>
              <h2 className="font-serif text-3xl font-bold text-charcoal-900">
                Sign In to Aura Luxe
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
                Enter your credentials to access your customer lounge.
              </p>
            </div>

            {/* Quick 1-Click Demo Logins */}
            <div className="bg-cream-50 p-3.5 rounded-2xl border border-beige-200 mb-6">
              <span className="text-[11px] font-bold text-charcoal-600 uppercase tracking-wider block mb-2 text-center">
                Instant Demo Access:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    loginAsCustomer();
                    addToast('Logged in as Harish Varma (Customer)', 'success');
                    navigate('/dashboard');
                  }}
                  className="py-1.5 px-3 rounded-xl bg-white border border-beige-300 hover:border-gold-500 text-xs font-semibold text-charcoal-800 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <User size={13} className="text-gold-600" />
                  Harish (Client)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    loginAsAdmin();
                    addToast('Logged in as Super Admin', 'success');
                    navigate('/admin');
                  }}
                  className="py-1.5 px-3 rounded-xl bg-charcoal-900 hover:bg-black text-xs font-semibold text-gold-400 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <ShieldCheck size={13} className="text-gold-400" />
                  Admin Manager
                </button>
              </div>
            </div>

            {/* Sign in Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-gold-700 hover:text-gold-800 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/30"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="gold"
                size="md"
                loading={loading}
                className="w-full shadow-gold mt-2"
              >
                Sign In
              </Button>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-beige-200" />
              </div>
              <span className="relative bg-white px-3 text-xs text-charcoal-400 uppercase tracking-wider">
                Or
              </span>
            </div>

            {/* Google Login button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-full border border-beige-300 text-xs sm:text-sm font-semibold text-charcoal-800 hover:bg-beige-50 transition-colors shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="pt-6 border-t border-beige-100 text-center text-xs text-charcoal-600 mt-6">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-gold-700 hover:text-gold-900 underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
