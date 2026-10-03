import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DemoBar } from '../components/DemoBar';
import {
  Sparkles,
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  User,
  Tag,
  Image,
  BarChart2,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Search,
  CheckCircle
} from '../components/icons';
import { Button } from '../components/Button';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    addToast('Admin logged out successfully.', 'info');
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Appointments', path: '/admin/appointments', icon: Calendar },
    { label: 'Manage Services', path: '/admin/services', icon: Scissors },
    { label: 'Manage Staff', path: '/admin/staff', icon: Users },
    { label: 'Customers', path: '/admin/customers', icon: User },
    { label: 'Offers & Promos', path: '/admin/offers', icon: Tag },
    { label: 'Gallery Showcase', path: '/admin/gallery', icon: Image },
    { label: 'Business Reports', path: '/admin/reports', icon: BarChart2 }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2] text-charcoal-900">
      <DemoBar />

      <div className="flex flex-grow relative">
        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-charcoal-950/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Container */}
        <aside
          className={`fixed lg:sticky top-0 z-40 h-screen w-64 bg-charcoal-950 text-cream-100 flex flex-col justify-between border-r border-charcoal-800 transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Top Brand */}
          <div>
            <div className="p-6 flex items-center justify-between border-b border-charcoal-800">
              <Link to="/admin" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gold-500 text-charcoal-950 flex items-center justify-center font-bold">
                  <Sparkles size={16} />
                </div>
                <div>
                  <span className="font-serif text-lg font-bold tracking-widest text-white block leading-none">
                    AURA LUXE
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-gold-400 font-semibold block mt-0.5">
                    Admin Management
                  </span>
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 rounded-md text-charcoal-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav Menu Links */}
            <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gold-500 text-charcoal-950 font-semibold shadow-md'
                          : 'text-charcoal-400 hover:text-white hover:bg-charcoal-900'
                      }`
                    }
                  >
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-charcoal-800 space-y-2">
            <Link
              to="/"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-charcoal-400 hover:text-gold-300 hover:bg-charcoal-900 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink size={15} /> View Public Parlour
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
            >
              <LogOut size={16} /> Logout Admin
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Admin Header */}
          <header className="bg-white border-b border-beige-200/80 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-subtle">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-charcoal-700 hover:bg-beige-100"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="font-serif text-lg sm:text-xl font-bold text-charcoal-900 leading-tight">
                  Salon Administration
                </h1>
                <p className="text-[11px] text-charcoal-500 hidden sm:block">
                  Aura Luxe Haute Beauty & Wellness • Operational Control
                </p>
              </div>
            </div>

            {/* Admin Profile */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-charcoal-900">Admin Manager</p>
                  <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Systems Ready
                  </p>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                  alt="Admin Manager"
                  className="w-9 h-9 rounded-full object-cover border border-gold-400"
                />
              </div>
            </div>
          </header>

          {/* Main Subpage View */}
          <main className="p-4 sm:p-8 flex-grow">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
