import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DemoBar } from '../components/DemoBar';
import { Footer } from '../components/Footer';
import {
  Sparkles,
  LayoutDashboard,
  Calendar,
  User,
  Heart,
  Star,
  LogOut,
  ArrowLeft,
  Plus
} from '../components/icons';
import { Button } from '../components/Button';

export const CustomerLayout = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    addToast('Logged out of customer account.', 'info');
    navigate('/');
  };

  const customerTabs = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Appointments', path: '/appointments', icon: Calendar },
    { label: 'Profile Settings', path: '/profile', icon: User },
    { label: 'Saved Favorites', path: '/favorites', icon: Heart },
    { label: 'My Reviews', path: '/reviews', icon: Star }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-charcoal-900">
      <DemoBar />

      {/* Customer Header */}
      <header className="bg-white border-b border-beige-200/80 shadow-subtle sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left: Brand & Back */}
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="p-2 rounded-full border border-beige-200 text-charcoal-600 hover:text-charcoal-950 hover:bg-beige-50 transition-colors"
                title="Return to Main Website"
              >
                <ArrowLeft size={16} />
              </Link>
              <div>
                <Link to="/" className="flex items-center gap-2">
                  <span className="font-serif text-xl font-bold tracking-wider text-charcoal-900">
                    AURA LUXE
                  </span>
                  <span className="text-[10px] bg-gold-100 text-gold-800 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Member Lounge
                  </span>
                </Link>
              </div>
            </div>

            {/* Right: Quick actions & Avatar */}
            <div className="flex items-center gap-3">
              <Link to="/book-appointment">
                <Button variant="gold" size="sm" icon={Plus}>
                  Book Appointment
                </Button>
              </Link>

              <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-beige-200">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-gold-300 shadow-sm"
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-charcoal-900 leading-tight">{user.name}</p>
                  <p className="text-[11px] text-charcoal-500 capitalize">{user.status || 'Valued Member'}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-charcoal-500 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
                title="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pt-4 border-t border-beige-100 mt-3 no-scrollbar">
            {customerTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  end={tab.path === '/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-charcoal-900 text-white font-semibold shadow-sm'
                        : 'text-charcoal-600 hover:text-charcoal-950 hover:bg-beige-100/70'
                    }`
                  }
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Customer Page Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
