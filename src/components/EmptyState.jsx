import React from 'react';
import { Button } from './Button';
import { Sparkles } from './icons';

export const EmptyState = ({
  icon: Icon = Sparkles,
  title = 'No items found',
  description = 'There are no records matching your criteria at this moment.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl bg-white/70 border border-beige-200/80 shadow-subtle ${className}`}>
      <div className="w-14 h-14 rounded-full bg-cream-100 border border-gold-200 flex items-center justify-center text-gold-600 mb-4 shadow-sm">
        <Icon size={26} />
      </div>
      <h3 className="font-serif text-xl md:text-2xl text-charcoal-900 font-medium mb-1">
        {title}
      </h3>
      <p className="text-sm text-charcoal-600 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="secondary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
