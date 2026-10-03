import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  Menu,
  X,
  User,
  LogOut,
  Calendar,
  Heart,
  Star,
  ShieldCheck,
  ChevronDown,
  ArrowRight
} from './icons';
import { Button } from './Button';

export const Navbar = () => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    addToast('You have been logged out successfully.', 'info');
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'About Us', path: '/about' },
    { label: 'Our Team', path: '/team' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Offers', path: '/offers' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-cream-50/95 backdrop-blur-md shadow-premium border-b border-beige-200/80 py-3.5'
          : 'bg-[#FDFBF7] border-b border-beige-200/40 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-charcoal-900 to-charcoal-800 text-gold-400 flex items-center justify-center border border-gold-400/40 shadow-sm group-hover:border-gold-400 transition-colors">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-widest text-charcoal-900 block leading-none">
                AURA LUXE
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-gold-700 font-semibold block mt-0.5">
                Haute Beauty & Spa
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-medium tracking-wide transition-all ${
                    isActive
                      ? 'text-charcoal-950 font-semibold bg-beige-100/90 shadow-sm'
                      : 'text-charcoal-600 hover:text-charcoal-950 hover:bg-beige-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Buttons / Auth menu */}
          <div className="hidden lg:flex items-center gap-3">
            {role === 'admin' ? (
              <div className="flex items-center gap-2">
                <Link to="/admin">
                  <Button variant="primary" size="sm" icon={ShieldCheck}>
                    Admin Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} icon={LogOut}>
                  Logout
                </Button>
              </div>
            ) : isAuthenticated && role === 'customer' ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/appointments"
                  className="text-xs font-semibold text-charcoal-700 hover:text-charcoal-900 px-3 py-1.5 rounded-full hover:bg-beige-100 transition-colors flex items-center gap-1.5"
                >
                  <Calendar size={15} className="text-gold-600" />
                  My Appointments
                </Link>

                <Link to="/book-appointment">
                  <Button variant="gold" size="sm">
                    Book Now
                  </Button>
                </Link>

                {/* Customer Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-beige-100 transition-all border border-beige-300"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-gold-300"
                    />
                    <ChevronDown size={14} className="text-charcoal-600 pr-0.5" />
                  </button>

                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-floating border border-beige-200 py-2 z-50 animate-scale-up"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-beige-100">
                        <p className="text-xs text-charcoal-400">Signed in as</p>
                        <p className="text-sm font-bold text-charcoal-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-charcoal-500 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-charcoal-700 hover:bg-cream-100 hover:text-charcoal-950 font-medium"
                        >
                          <User size={15} className="text-gold-600" /> Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-charcoal-700 hover:bg-cream-100 hover:text-charcoal-950 font-medium"
                        >
                          <User size={15} className="text-gold-600" /> My Profile
                        </Link>
                        <Link
                          to="/appointments"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-charcoal-700 hover:bg-cream-100 hover:text-charcoal-950 font-medium"
                        >
                          <Calendar size={15} className="text-gold-600" /> My Appointments
                        </Link>
                        <Link
                          to="/favorites"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-charcoal-700 hover:bg-cream-100 hover:text-charcoal-950 font-medium"
                        >
                          <Heart size={15} className="text-rose-500" /> Favorites
                        </Link>
                        <Link
                          to="/reviews"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-charcoal-700 hover:bg-cream-100 hover:text-charcoal-950 font-medium"
                        >
                          <Star size={15} className="text-gold-500" /> My Reviews
                        </Link>
                      </div>

                      <div className="border-t border-beige-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                        >
                          <LogOut size={15} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs xl:text-sm font-semibold text-charcoal-700 hover:text-charcoal-950 px-3 py-1.5 rounded-full hover:bg-beige-100 transition-colors"
                >
                  Login
                </Link>
                <Link to="/book-appointment">
                  <Button variant="gold" size="sm" icon={ArrowRight} iconPosition="right">
                    Book Appointment
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link to="/book-appointment">
              <Button variant="gold" size="sm" className="text-xs px-3 py-1.5">
                Book
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-charcoal-700 hover:bg-beige-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-beige-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 animate-slide-down">
          <nav className="flex flex-col space-y-1 mb-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-beige-100 text-charcoal-950 font-semibold'
                      : 'text-charcoal-700 hover:bg-cream-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-beige-200/80 pt-4 flex flex-col gap-2">
            {role === 'admin' ? (
              <>
                <Link to="/admin">
                  <Button variant="primary" size="md" className="w-full" icon={ShieldCheck}>
                    Admin Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="md" onClick={handleLogout} className="w-full" icon={LogOut}>
                  Logout
                </Button>
              </>
            ) : isAuthenticated && role === 'customer' ? (
              <>
                <div className="p-3 bg-cream-100 rounded-xl mb-1 flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-gold-400"
                  />
                  <div>
                    <p className="text-xs text-charcoal-400">Logged in as</p>
                    <p className="text-sm font-bold text-charcoal-900">{user.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <Link
                    to="/dashboard"
                    className="p-2 rounded-lg bg-beige-50 border border-beige-200 text-charcoal-800 text-center font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/appointments"
                    className="p-2 rounded-lg bg-beige-50 border border-beige-200 text-charcoal-800 text-center font-medium"
                  >
                    Appointments
                  </Link>
                  <Link
                    to="/profile"
                    className="p-2 rounded-lg bg-beige-50 border border-beige-200 text-charcoal-800 text-center font-medium"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/favorites"
                    className="p-2 rounded-lg bg-beige-50 border border-beige-200 text-charcoal-800 text-center font-medium"
                  >
                    Favorites
                  </Link>
                </div>
                <Button variant="danger" size="md" onClick={handleLogout} className="w-full" icon={LogOut}>
                  Logout
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login">
                  <Button variant="secondary" size="md" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="md" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
