import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, User, ShieldCheck, LogOut, ExternalLink } from './icons';
import { supabaseConfigured } from '../services/supabase';

export const DemoBar = () => {
  const { user, role, loginAsCustomer, loginAsAdmin, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  if (supabaseConfigured) return null;

  const handleRoleChange = (targetRole) => {
    if (targetRole === 'customer') {
      loginAsCustomer();
      addToast('Switched to Customer account (Harish Varma)', 'success');
      navigate('/dashboard');
    } else if (targetRole === 'admin') {
      loginAsAdmin();
      addToast('Switched to Admin Portal (Super Admin)', 'success');
      navigate('/admin');
    } else {
      logout();
      addToast('Switched to Guest mode', 'info');
      navigate('/');
    }
  };

  return (
    <aside aria-label="Demo controls" className="bg-charcoal-900 text-cream-100 text-xs py-1.5 px-4 border-b border-gold-600/30 transition-all select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-gold-400 uppercase tracking-widest text-[10px]">
            <Sparkles size={12} /> Live Interactive Demo
          </span>
          <span className="hidden sm:inline text-charcoal-400">|</span>
          <span className="text-charcoal-300">
            Current Role:{' '}
            <strong className="text-white capitalize">
              {role === 'customer' ? `Customer (${user.name})` : role === 'admin' ? 'Administrator' : 'Guest'}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[11px] text-charcoal-400 hidden md:inline">Quick Switch:</span>
          
          <button
            onClick={() => handleRoleChange('customer')}
            className={`px-2.5 py-0.5 rounded-full transition-all text-[11px] flex items-center gap-1 ${
              role === 'customer'
                ? 'bg-gold-500 text-charcoal-950 font-semibold shadow-sm'
                : 'bg-charcoal-800 text-charcoal-300 hover:text-white hover:bg-charcoal-700'
            }`}
          >
            <User size={11} /> Harish (Customer)
          </button>

          <button
            onClick={() => handleRoleChange('admin')}
            className={`px-2.5 py-0.5 rounded-full transition-all text-[11px] flex items-center gap-1 ${
              role === 'admin'
                ? 'bg-gold-500 text-charcoal-950 font-semibold shadow-sm'
                : 'bg-charcoal-800 text-charcoal-300 hover:text-white hover:bg-charcoal-700'
            }`}
          >
            <ShieldCheck size={11} /> Admin Portal
          </button>

          <button
            onClick={() => handleRoleChange('guest')}
            className={`px-2.5 py-0.5 rounded-full transition-all text-[11px] flex items-center gap-1 ${
              role === 'guest'
                ? 'bg-gold-500 text-charcoal-950 font-semibold shadow-sm'
                : 'bg-charcoal-800 text-charcoal-300 hover:text-white hover:bg-charcoal-700'
            }`}
          >
            <LogOut size={11} /> Guest
          </button>

          {role === 'customer' && (
            <Link
              to="/dashboard"
              className="text-gold-400 hover:text-gold-300 underline underline-offset-2 ml-1 hidden sm:inline-flex items-center gap-0.5"
            >
              Customer Dash <ExternalLink size={10} />
            </Link>
          )}

          {role === 'admin' && (
            <Link
              to="/admin"
              className="text-gold-400 hover:text-gold-300 underline underline-offset-2 ml-1 hidden sm:inline-flex items-center gap-0.5"
            >
              Admin Dash <ExternalLink size={10} />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
};
