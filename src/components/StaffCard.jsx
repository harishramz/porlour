import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Award, Calendar, Scissors, Sparkles } from './icons';
import { Button } from './Button';

export const StaffCard = ({ staff }) => {
  const navigate = useNavigate();

  const handleBookWithStaff = () => {
    navigate(`/book-appointment?staffId=${staff.id}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-beige-200/80 overflow-hidden shadow-subtle luxury-card-hover flex flex-col h-full text-center">
      {/* Photo with golden ring */}
      <div className="pt-8 pb-4 px-6 flex flex-col items-center">
        <div className="relative group mb-4">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 border-2 border-gold-300 shadow-premium overflow-hidden bg-cream-100">
            <img
              src={staff.avatar}
              alt={staff.name}
              className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
          <div className="absolute bottom-0 right-1 bg-charcoal-900 text-gold-400 p-1.5 rounded-full border border-gold-400/50 shadow-sm">
            <Sparkles size={14} />
          </div>
        </div>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900">
          {staff.name}
        </h3>
        <p className="text-xs sm:text-sm font-medium text-gold-700 mt-0.5 mb-2">
          {staff.role}
        </p>

        {/* Rating and Experience Badges */}
        <div className="flex items-center gap-2 mb-4 flex-wrap justify-center">
          <div className="inline-flex items-center gap-1 bg-cream-100 text-charcoal-800 text-xs px-2.5 py-1 rounded-full border border-beige-200">
            <Star size={13} className="text-gold-500 fill-gold-500" />
            <span className="font-semibold">{staff.rating}</span>
            <span className="text-charcoal-400">({staff.reviewsCount})</span>
          </div>
          <div className="inline-flex items-center gap-1 bg-cream-100 text-charcoal-800 text-xs px-2.5 py-1 rounded-full border border-beige-200">
            <Award size={13} className="text-gold-600" />
            <span>{staff.experience}</span>
          </div>
        </div>
      </div>

      {/* Specialization & Bio */}
      <div className="px-6 pb-6 flex-grow flex flex-col justify-between">
        <div className="bg-cream-50/70 p-3.5 rounded-xl border border-beige-200/60 mb-5 text-left">
          <span className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider block mb-1">
            Specialization
          </span>
          <p className="text-xs sm:text-sm text-charcoal-800 font-medium leading-snug">
            {staff.specialization}
          </p>
        </div>

        {/* Skills Pills */}
        {staff.skills && (
          <div className="flex flex-wrap gap-1.5 justify-center mb-5">
            {staff.skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-beige-100 text-charcoal-700 px-2.5 py-0.5 rounded-full border border-beige-200"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <Button
          onClick={handleBookWithStaff}
          variant="outline"
          size="sm"
          className="w-full rounded-full hover:bg-charcoal-900 hover:text-white"
        >
          Book with {staff.displayName || staff.name.split(' ')[0]}
        </Button>
      </div>
    </div>
  );
};
