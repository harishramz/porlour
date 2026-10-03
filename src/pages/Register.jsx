import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/Button';
import { Sparkles, User, Mail, Phone, Lock } from '../components/icons';

export const Register = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match. Please re-enter.', 'error');
      return;
    }
    if (!formData.agreedToTerms) {
      addToast('Please agree to the Terms & Conditions to register.', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newCustomer = {
        id: `cust-${Date.now()}`,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        role: 'customer',
        totalAppointments: 0,
        totalSpending: 0,
        status: 'New Member'
      };
      login(newCustomer);
      addToast(`Welcome to Aura Luxe, ${formData.fullName}!`, 'success');
      navigate('/dashboard');
    }, 450);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-beige-200 shadow-floating p-8 sm:p-10">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-1">
            Exclusive Membership
          </span>
          <h2 className="font-serif text-3xl font-bold text-charcoal-900">
            Create an Account
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            Join our private member portal to book rituals and track services.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Ananya Sundaram"
                className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/30"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-type password"
                  className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/30"
                />
              </div>
            </div>
          </div>

          {/* Checkbox: I agree to the Terms & Conditions */}
          <div className="flex items-start gap-2.5 pt-2">
            <input
              type="checkbox"
              id="terms"
              checked={formData.agreedToTerms}
              onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
              className="mt-1 w-4 h-4 rounded text-gold-600 focus:ring-gold-400 border-beige-300 cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-charcoal-600 leading-snug cursor-pointer">
              I agree to the{' '}
              <Link to="/about" className="text-gold-700 font-semibold underline">
                Terms & Conditions
              </Link>{' '}
              and privacy policy of Aura Luxe Parlour.
            </label>
          </div>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            loading={loading}
            className="w-full shadow-gold mt-4"
          >
            Create Account
          </Button>
        </form>

        <div className="pt-6 border-t border-beige-100 text-center text-xs text-charcoal-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-gold-700 hover:text-gold-900 underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
