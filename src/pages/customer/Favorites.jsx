import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { getServices } from '../../services/api';
import { ServiceCard } from '../../components/ServiceCard';
import { Loading } from '../../components/Loading';
import { EmptyState } from '../../components/EmptyState';
import { Button } from '../../components/Button';
import { Heart, Sparkles, ArrowRight } from '../../components/icons';

export const CustomerFavorites = () => {
  const { favoriteIds } = useFavorites();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        console.error('Failed to load services', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const favoriteServices = services.filter((s) => favoriteIds.includes(s.id));

  if (loading) {
    return <Loading text="Loading your curated favorites..." />;
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase tracking-[0.25em] text-rose-600 font-semibold block mb-1">
          Saved Treatments
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
          My Favorite Rituals
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
          Your bookmarked treatments for quick scheduling anytime.
        </p>
      </div>

      {favoriteServices.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites saved yet"
          description="Click the heart icon on any treatment in our catalogue to build your personal wishlist."
          actionLabel="Explore Services"
          onAction={() => (window.location.href = '/services')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};
