import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'bg-beige-100 text-charcoal-800 border-beige-200',
    gold: 'bg-gold-50 text-gold-700 border-gold-300 font-semibold',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    // Status Badges
    Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200 font-medium',
    Completed: 'bg-sky-50 text-sky-700 border-sky-200 font-medium',
    Cancelled: 'bg-rose-50 text-rose-600 border-rose-200 font-medium',
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Inactive: 'bg-charcoal-100 text-charcoal-600 border-charcoal-200',
    vip: 'bg-gradient-to-r from-charcoal-900 to-charcoal-800 text-gold-300 border-gold-500/50'
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider uppercase',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5'
  };

  const selectedVariant = variants[children] || variants[variant] || variants.default;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${selectedVariant} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
};
