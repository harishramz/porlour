import React, { useState, useEffect } from 'react';
import { getStaff } from '../services/api';
import { StaffCard } from '../components/StaffCard';
import { Loading } from '../components/Loading';
import { Sparkles, Award, ShieldCheck } from '../components/icons';

export const Team = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await getStaff();
        setStaff(data);
      } catch (err) {
        console.error('Failed to load staff team', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  if (loading) {
    return <Loading fullScreen text="Introducing our master artisans..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold flex items-center justify-center gap-1.5 mb-2">
          <Sparkles size={14} /> The Creative Collective
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-charcoal-900 leading-tight">
          Master Stylists & Aestheticians
        </h1>
        <p className="text-sm sm:text-base text-charcoal-600 mt-3 leading-relaxed">
          Our team comprises dedicated beauty artisans certified by top global academies. With refined technique and sincere care, they tailor every service to your distinct personal aesthetic.
        </p>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {staff.map((member) => (
          <StaffCard key={member.id} staff={member} />
        ))}
      </div>

      {/* Philosophy banner */}
      <div className="bg-cream-100/70 p-8 sm:p-12 rounded-3xl border border-beige-200 text-center max-w-3xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center mx-auto mb-3">
          <Award size={22} />
        </div>
        <h3 className="font-serif text-2xl font-bold text-charcoal-900 mb-2">
          Continuous International Masterclasses
        </h3>
        <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed max-w-xl mx-auto">
          Every stylist at Aura Luxe participates in biannual training in Milan, Paris, and London to ensure Coimbatore enjoys the absolute frontier of global hair trends, derma research, and runway bridal aesthetics.
        </p>
      </div>
    </div>
  );
};
