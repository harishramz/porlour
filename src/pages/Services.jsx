import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getServices } from '../services/api';
import { ServiceCard } from '../components/ServiceCard';
import { Loading } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import { Search, Filter, Sparkles, Scissors, RefreshCw } from '../components/icons';

export const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState(15000);
  const [sortBy, setSortBy] = useState('popularity'); // popularity, price-asc, price-desc, rating

  const categories = ['All', 'Hair', 'Skin', 'Nails', 'Makeup', 'Beauty'];

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

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const filteredServices = useMemo(() => {
    return services
      .filter((service) => {
        const matchesCategory =
          selectedCategory === 'All' || service.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch =
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = service.price <= priceRange;
        return matchesCategory && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'popularity') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [services, selectedCategory, searchQuery, priceRange, sortBy]);

  if (loading) {
    return <Loading fullScreen text="Loading luxury service catalogue..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold flex items-center justify-center gap-1.5 mb-2">
          <Sparkles size={14} /> Full Catalogue
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-charcoal-900 leading-tight">
          Exceptional Treatments & Rituals
        </h1>
        <p className="text-sm sm:text-base text-charcoal-600 mt-3 leading-relaxed">
          Explore our complete collection of bespoke hair styling, derma therapies, bridal artistry, and therapeutic nail care.
        </p>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="bg-white rounded-2xl border border-beige-200/90 p-5 sm:p-6 shadow-subtle mb-10 space-y-6">
        {/* Top: Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-grow max-w-lg">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by treatment name, keyword, or benefits..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full border border-beige-300 text-xs sm:text-sm bg-cream-50/50 focus:outline-none focus:ring-2 focus:ring-gold-400 placeholder:text-charcoal-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-charcoal-400 hover:text-charcoal-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            <label className="text-xs font-semibold text-charcoal-600 whitespace-nowrap">
              Sort By:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs sm:text-sm py-2 px-3.5 rounded-full border border-beige-300 bg-white text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-400 font-medium cursor-pointer"
            >
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Price Filter */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-4 border-t border-beige-100">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-charcoal-900 text-white shadow-sm'
                    : 'bg-beige-100/80 text-charcoal-700 hover:bg-beige-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Price Range Slider */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-charcoal-500 whitespace-nowrap">Max Price:</span>
            <input
              type="range"
              min="500"
              max="15000"
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="accent-gold-600 w-32 sm:w-44 cursor-pointer"
            />
            <span className="text-xs font-bold text-charcoal-900 font-mono w-16 text-right">
              ₹{priceRange.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Results Count & Current Active Filters Summary */}
      <div className="flex items-center justify-between mb-6 text-xs text-charcoal-500">
        <span>
          Showing <strong className="text-charcoal-900">{filteredServices.length}</strong> of{' '}
          {services.length} services
        </span>
        {(searchQuery || selectedCategory !== 'All' || priceRange < 15000) && (
          <button
            onClick={() => {
              setSearchQuery('');
              handleCategorySelect('All');
              setPriceRange(15000);
              setSortBy('popularity');
            }}
            className="text-gold-700 hover:underline flex items-center gap-1"
          >
            <RefreshCw size={12} /> Reset filters
          </button>
        )}
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <EmptyState
          title="No services match your filters"
          description="Try broadening your search term or adjusting the price filter."
          actionLabel="Clear All Filters"
          onAction={() => {
            setSearchQuery('');
            handleCategorySelect('All');
            setPriceRange(15000);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};
