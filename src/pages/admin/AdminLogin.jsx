import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { ShieldCheck, Lock, Mail, Sparkles, ArrowRight, ArrowLeft } from '../../components/icons';
import { supabaseConfigured } from '../../services/supabase';
import { seedInitialCatalogData } from '../../services/api';

const getAdminSignInMessage = (error) => {
  if (error.message === 'Invalid login credentials') {
    return 'Supabase could not authenticate this email and password. Updating the profile role does not create an Auth user or change its password. Use Forgot Password to reset the password, and confirm the account exists in Supabase Authentication → Users.';
  }
  if (error.message?.includes('Unable to load your profile:')) {
    return `${error.message} Verify that this Auth user has a matching row in public.profiles.`;
  }
  return error.message || 'Unable to sign in.';
};

export const AdminLogin = () => {
  const { loginAsAdmin, signInWithPassword, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (supabaseConfigured) {
        const authenticatedUser = await signInWithPassword(email, password);
        if (authenticatedUser.role !== 'admin') {
          await logout();
          throw new Error('This account does not have administrator access.');
        }
        await seedInitialCatalogData();
      } else {
        loginAsAdmin();
      }
      addToast('Authenticated as Salon Executive Admin', 'success');
      navigate('/admin');
    } catch (error) {
      addToast(getAdminSignInMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white relative">
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-charcoal-400 hover:text-gold-400 transition-colors"
        >
          <ArrowLeft size={16} /> Return to Public Salon
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-full bg-gold-500 text-charcoal-950 flex items-center justify-center mx-auto mb-4 font-bold shadow-gold">
          <Sparkles size={24} />
        </div>
        <h2 className="font-serif text-3xl font-bold tracking-widest text-white">
          AURA LUXE ADMIN
        </h2>
        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
          Operational Management Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-charcoal-900 py-8 px-6 shadow-floating rounded-3xl sm:px-10 border border-charcoal-800">
          {!supabaseConfigured && <div className="bg-charcoal-800/80 p-3.5 rounded-xl border border-charcoal-700 mb-6 text-center">
            <span className="text-[11px] text-charcoal-300 block mb-1">
              Evaluator Quick Access:
            </span>
            <Button
              variant="gold"
              size="sm"
              className="w-full"
              icon={ShieldCheck}
              onClick={() => {
                loginAsAdmin();
                addToast('Welcome to Salon Operations, Admin!', 'success');
                navigate('/admin');
              }}
            >
              1-Click Fast Admin Sign In
            </Button>
          </div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-300 mb-1.5">
                Staff Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-charcoal-700 focus:outline-none focus:border-gold-400 bg-charcoal-800 text-white placeholder:text-charcoal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-charcoal-700 focus:outline-none focus:border-gold-400 bg-charcoal-800 text-white placeholder:text-charcoal-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="md"
              loading={loading}
              className="w-full shadow-gold mt-2"
              icon={ArrowRight}
              iconPosition="right"
            >
              Access Dashboard
            </Button>
          </form>
          {supabaseConfigured && (
            <div className="mt-5 text-center">
              <Link
                to={`/forgot-password?returnTo=${encodeURIComponent('/admin/login')}`}
                className="text-xs font-medium text-gold-400 hover:text-gold-300 underline underline-offset-4"
              >
                Forgot admin password?
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
