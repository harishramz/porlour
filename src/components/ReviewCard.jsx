import React from 'react';
import { Star, ShieldCheck } from './icons';

export const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white rounded-2xl border border-beige-200/80 p-6 shadow-subtle luxury-card-hover flex flex-col justify-between h-full">
      <div>
        {/* Rating Stars & Verified tag */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-1 text-gold-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < review.rating ? 'fill-gold-500 text-gold-500' : 'text-charcoal-300'}
              />
            ))}
          </div>
          {review.verified && (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 font-medium">
              <ShieldCheck size={12} /> Verified Client
            </span>
          )}
        </div>

        {/* Review Quote */}
        <blockquote className="text-charcoal-700 text-sm sm:text-base leading-relaxed mb-6 font-normal italic">
          "{review.comment}"
        </blockquote>
      </div>

      {/* Author & Service attribution footer */}
      <div className="pt-4 border-t border-beige-200/80 flex items-center gap-3">
        <img
          src={review.avatar}
          alt={review.customerName}
          className="w-11 h-11 rounded-full object-cover border border-gold-300 shadow-sm shrink-0"
          loading="lazy"
        />
        <div className="min-w-0">
          <h4 className="font-semibold text-charcoal-900 text-sm truncate">
            {review.customerName}
          </h4>
          <p className="text-xs text-charcoal-500 truncate">
            Treated with: <span className="text-gold-700 font-medium">{review.serviceName}</span>
          </p>
          {review.date && (
            <span className="text-[10px] text-charcoal-400 block mt-0.5">{review.date}</span>
          )}
        </div>
      </div>
    </div>
  );
};
