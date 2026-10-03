import React from 'react';
import { RefreshCw } from './icons';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none';

  const variants = {
    primary: 'bg-charcoal-900 text-cream-50 hover:bg-black hover:shadow-floating focus:ring-charcoal-700 active:scale-[0.98]',
    gold: 'bg-gradient-to-r from-gold-600 to-gold-500 text-white hover:from-gold-700 hover:to-gold-600 hover:shadow-gold focus:ring-gold-400 active:scale-[0.98]',
    secondary: 'bg-beige-100 text-charcoal-900 hover:bg-beige-200 border border-beige-300/80 focus:ring-beige-400 active:scale-[0.98]',
    outline: 'border border-charcoal-800 text-charcoal-900 hover:bg-charcoal-900 hover:text-white focus:ring-charcoal-600 active:scale-[0.98]',
    outlineGold: 'border border-gold-500 text-gold-700 hover:bg-gold-50 focus:ring-gold-400 active:scale-[0.98]',
    rose: 'bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-400 active:scale-[0.98]',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 focus:ring-rose-400 active:scale-[0.98]',
    ghost: 'text-charcoal-700 hover:bg-beige-100 hover:text-charcoal-900 focus:ring-beige-300'
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5 font-semibold'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading && <RefreshCw size={16} className="animate-spin" />}
      {!loading && Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
    </button>
  );
};
