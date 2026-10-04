import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  getServices,
  getStaff,
  getAvailableSlots,
  createAppointment
} from '../services/api';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Loading } from '../components/Loading';
import { supabaseConfigured } from '../services/supabase';
import {
  Scissors,
  User,
  Calendar,
  Clock,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Download,
  AlertCircle
} from '../components/icons';

export const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, authLoading } = useAuth();
  const { addToast } = useToast();

  const preselectedServiceId = searchParams.get('serviceId');
  const preselectedStaffId = searchParams.get('staffId');
  const preselectedOfferTitle = searchParams.get('offerTitle');
  const preselectedOfferPrice = searchParams.get('offerPrice');

  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Flow Steps: 1 to 6
  const [currentStep, setCurrentStep] = useState(1);

  // Form selections state
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState('any'); // 'any' or staffId
  const [selectedDate, setSelectedDate] = useState('2026-10-10'); // Default convenient date
  const [selectedTime, setSelectedTime] = useState('03:00 PM');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Customer Contact Info (Step 5)
  const [customerDetails, setCustomerDetails] = useState({
    name: user?.name || (supabaseConfigured ? '' : 'Harish Varma'),
    email: user?.email || (supabaseConfigured ? '' : 'harish.varma@example.com'),
    phone: user?.phone || (supabaseConfigured ? '' : '+91 98765 43210'),
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    if (!user?.isAuthenticated) return;
    setCustomerDetails((current) => ({
      ...current,
      name: user.name || current.name,
      email: user.email || current.email,
      phone: user.phone || current.phone
    }));
  }, [user?.id, user?.name, user?.email, user?.phone, user?.isAuthenticated]);

  // Fetch services and staff on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [srvData, stData] = await Promise.all([getServices(), getStaff()]);
        setServices(srvData);
        setStaffList(stData);

        // Pre-select service or offer if passed via URL
        if (preselectedOfferTitle && preselectedOfferPrice) {
          const promoService = {
            id: 'promo-pkg',
            name: preselectedOfferTitle,
            category: 'Package Offer',
            duration: '150 mins',
            price: Number(preselectedOfferPrice),
            image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
            shortDescription: 'Comprehensive luxury beauty & spa combination package'
          };
          setSelectedService(promoService);
          setCurrentStep(2);
        } else if (preselectedServiceId) {
          const match = srvData.find((s) => s.id === preselectedServiceId);
          if (match) {
            setSelectedService(match);
            setCurrentStep(2);
          }
        } else if (srvData.length > 0) {
          setSelectedService(srvData[0]);
        }

        if (preselectedStaffId) {
          setSelectedStaff(preselectedStaffId);
        }
      } catch (err) {
        console.error('Failed to load booking prerequisite data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [preselectedServiceId, preselectedStaffId, preselectedOfferTitle, preselectedOfferPrice]);

  // Sync logged in user details if available
  useEffect(() => {
    if (user && user.name && user.name !== 'Guest') {
      setCustomerDetails((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  // Load available time slots when date or staff changes
  useEffect(() => {
    const fetchSlots = async () => {
      setSlotsLoading(true);
      try {
        const slots = await getAvailableSlots(selectedDate, selectedStaff);
        setAvailableSlots(slots);
        // If current selectedTime is unavailable, pick first available
        const isCurrentAvailable = slots.find((s) => s.time === selectedTime)?.isAvailable;
        if (!isCurrentAvailable) {
          const firstAvail = slots.find((s) => s.isAvailable);
          if (firstAvail) setSelectedTime(firstAvail.time);
        }
      } catch (err) {
        console.error('Error fetching available slots', err);
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchSlots();
  }, [selectedDate, selectedStaff]);

  // Format readable date
  const getFormattedDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleNext = () => {
    if (currentStep === 1 && !selectedService) {
      addToast('Please select a service to proceed.', 'error');
      return;
    }
    if (currentStep === 5) {
      if (!customerDetails.name.trim() || !customerDetails.email.trim() || !customerDetails.phone.trim()) {
        addToast('Please fill in your name, email, and phone number.', 'error');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 6));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleConfirmAppointment = async () => {
    setSubmitting(true);
    try {
      const selectedStaffObj = staffList.find((s) => s.id === selectedStaff);
      const staffDisplayName = selectedStaff === 'any' ? 'Any Available Professional' : (selectedStaffObj?.name || 'Assigned Stylist');

      const appointmentPayload = {
        customerId: user?.id || 'cust-1',
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.phone,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        category: selectedService.category,
        staffId: selectedStaff,
        staffName: staffDisplayName,
        date: selectedDate,
        formattedDate: getFormattedDate(selectedDate),
        time: selectedTime,
        duration: selectedService.duration,
        price: selectedService.price,
        notes: customerDetails.notes,
        status: 'Confirmed'
      };

      const result = await createAppointment(appointmentPayload);
      setConfirmedBooking(result);
      addToast('Appointment booked successfully!', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error confirming appointment', err);
      addToast('Failed to complete booking. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Preparing appointment booking suite..." />;
  }

  if (supabaseConfigured && authLoading) {
    return <Loading fullScreen text="Restoring your account..." />;
  }

  if (supabaseConfigured && !user?.isAuthenticated) {
    const returnTo = `${window.location.pathname}${window.location.search}`;
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold text-charcoal-900">Sign in to book your appointment</h1>
        <p className="mt-3 text-sm text-charcoal-600">Your booking will be linked to your Aura Luxe account.</p>
        <Link
          to={`/login?returnTo=${encodeURIComponent(returnTo)}`}
          className="inline-flex mt-6 px-6 py-3 rounded-full bg-gold-500 text-charcoal-950 font-semibold"
        >
          Sign in to continue
        </Link>
      </div>
    );
  }

  // ==========================================
  // SUCCESS SCREEN
  // ==========================================
  if (confirmedBooking) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl border border-beige-200 p-8 sm:p-12 shadow-floating text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle size={40} />
          </div>

          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-1">
              Reservation Confirmed
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
              We Look Forward to Welcoming You
            </h1>
            <p className="text-sm text-charcoal-600 mt-2 max-w-md mx-auto">
              Your appointment has been successfully scheduled and added to our salon agenda. A confirmation SMS & email have been dispatched.
            </p>
          </div>

          {/* Receipt Summary Card */}
          <div className="bg-cream-50 rounded-2xl border border-beige-200 p-6 text-left max-w-lg mx-auto space-y-3 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-beige-200">
              <span className="text-xs text-charcoal-500 uppercase tracking-wider">Booking Reference</span>
              <span className="font-mono text-sm font-bold text-charcoal-900">#{confirmedBooking.id}</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-charcoal-600">Treatment:</span>
              <span className="font-semibold text-charcoal-900">{confirmedBooking.serviceName}</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-charcoal-600">Specialist:</span>
              <span className="font-semibold text-charcoal-900">{confirmedBooking.staffName}</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-charcoal-600">Date & Time:</span>
              <span className="font-semibold text-gold-800">
                {confirmedBooking.formattedDate} at {confirmedBooking.time}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-charcoal-600">Duration:</span>
              <span className="text-charcoal-800">{confirmedBooking.duration}</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-beige-200 text-sm sm:text-base font-bold text-charcoal-900">
              <span>Total Payable at Parlour:</span>
              <span className="font-serif text-xl text-gold-700">₹{confirmedBooking.price.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Post Confirmation Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link to="/appointments" className="w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full sm:w-auto">
                View in My Appointments
              </Button>
            </Link>
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button variant="secondary" size="md" className="w-full sm:w-auto">
                Customer Dashboard
              </Button>
            </Link>
            <Button
              variant="outline"
              size="md"
              icon={Download}
              onClick={() => {
                window.print();
              }}
              className="w-full sm:w-auto"
            >
              Print Receipt
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Steps Progress Bar data
  const steps = [
    { num: 1, label: 'Service' },
    { num: 2, label: 'Staff' },
    { num: 3, label: 'Date' },
    { num: 4, label: 'Time' },
    { num: 5, label: 'Details' },
    { num: 6, label: 'Review' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold flex items-center justify-center gap-1.5 mb-1">
          <Sparkles size={14} /> Concierge Reservation
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-charcoal-900 leading-tight">
          Book Your Experience
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 mt-2">
          Reserve your bespoke salon session in just a few seamless steps.
        </p>
      </div>

      {/* Multi-Step Indicator */}
      <div className="mb-10 max-w-3xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-beige-200 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-gold-600 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((st) => (
            <div key={st.num} className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                onClick={() => {
                  if (st.num < currentStep) setCurrentStep(st.num);
                }}
                disabled={st.num > currentStep}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  st.num < currentStep
                    ? 'bg-gold-600 text-white shadow-sm cursor-pointer'
                    : st.num === currentStep
                    ? 'bg-charcoal-900 text-gold-400 ring-4 ring-gold-200 font-bold'
                    : 'bg-white text-charcoal-400 border border-beige-300 cursor-not-allowed'
                }`}
              >
                {st.num < currentStep ? '✓' : st.num}
              </button>
              <span className={`text-[10px] sm:text-xs font-medium mt-1.5 hidden sm:block ${
                st.num === currentStep ? 'text-charcoal-900 font-bold' : 'text-charcoal-500'
              }`}>
                {st.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Step Container */}
      <div className="bg-white rounded-3xl border border-beige-200 p-6 sm:p-10 shadow-premium min-h-[420px] flex flex-col justify-between">
        <div>
          {/* ========================================== */}
          {/* STEP 1: SELECT SERVICE */}
          {/* ========================================== */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="font-serif text-2xl font-bold text-charcoal-900">
                  Step 1 — Select Your Treatment
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
                  Choose from our curated collection of signature hair, skin, bridal, and nail therapies.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[460px] overflow-y-auto pr-1">
                {services.map((service) => {
                  const isSelected = selectedService?.id === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-gold-500 bg-cream-50 ring-2 ring-gold-400/40 shadow-sm'
                          : 'border-beige-200 hover:border-beige-300 hover:bg-beige-50/50'
                      }`}
                    >
                      <div className="flex gap-3 mb-3">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] text-gold-700 uppercase font-semibold block">
                            {service.category}
                          </span>
                          <h4 className="font-serif font-bold text-charcoal-900 text-sm truncate leading-snug">
                            {service.name}
                          </h4>
                          <span className="text-xs text-charcoal-500 block mt-0.5">{service.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-beige-200/80">
                        <span className="font-serif font-bold text-charcoal-900 text-base">
                          ₹{service.price.toLocaleString('en-IN')}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-gold-600 text-white' : 'bg-beige-200 text-charcoal-700'
                        }`}>
                          {isSelected ? 'Selected' : 'Select'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* STEP 2: SELECT STAFF */}
          {/* ========================================== */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="font-serif text-2xl font-bold text-charcoal-900">
                  Step 2 — Select Beauty Specialist
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
                  Choose your preferred artisan or let us pair you with the best available talent.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Option: Any Available Professional */}
                <div
                  onClick={() => setSelectedStaff('any')}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedStaff === 'any'
                      ? 'border-gold-500 bg-cream-50 ring-2 ring-gold-400/40 shadow-sm'
                      : 'border-beige-200 hover:border-beige-300 hover:bg-beige-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className="w-14 h-14 rounded-full bg-charcoal-900 text-gold-400 flex items-center justify-center shrink-0">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-charcoal-900 text-base">
                        Any Available Professional
                      </h4>
                      <p className="text-xs text-charcoal-500">Maximum booking flexibility</p>
                    </div>
                  </div>
                  <p className="text-xs text-charcoal-600 leading-relaxed mb-3">
                    We will automatically allocate the most qualified specialist on duty for your selected treatment.
                  </p>
                  <div className="text-right">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      selectedStaff === 'any' ? 'bg-gold-600 text-white' : 'bg-beige-200 text-charcoal-700'
                    }`}>
                      {selectedStaff === 'any' ? 'Selected' : 'Select'}
                    </span>
                  </div>
                </div>

                {/* Specific Staff Cards: Priya, Anitha, Meena, Divya */}
                {staffList.map((st) => {
                  const isSelected = selectedStaff === st.id;
                  return (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStaff(st.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-gold-500 bg-cream-50 ring-2 ring-gold-400/40 shadow-sm'
                          : 'border-beige-200 hover:border-beige-300 hover:bg-beige-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 mb-3">
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-14 h-14 rounded-full object-cover border border-gold-300 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-serif font-bold text-charcoal-900 text-base leading-tight truncate">
                            {st.name}
                          </h4>
                          <p className="text-xs font-medium text-gold-700 truncate">{st.role}</p>
                          <span className="text-[11px] text-charcoal-500 block mt-0.5">★ {st.rating} ({st.reviewsCount})</span>
                        </div>
                      </div>

                      <p className="text-xs text-charcoal-600 leading-snug line-clamp-2 mb-3">
                        {st.specialization}
                      </p>

                      <div className="text-right">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          isSelected ? 'bg-gold-600 text-white' : 'bg-beige-200 text-charcoal-700'
                        }`}>
                          {isSelected ? 'Selected' : 'Select'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* STEP 3: SELECT DATE */}
          {/* ========================================== */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="font-serif text-2xl font-bold text-charcoal-900">
                  Step 3 — Select Appointment Date
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
                  Choose your preferred date. Our parlour operates 7 days a week.
                </p>
              </div>

              {/* Date Options */}
              <div className="max-w-xl mx-auto space-y-6">
                <div className="bg-cream-50 p-6 rounded-2xl border border-beige-200 text-center">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-2">
                    Pick a Date on the Calendar
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min="2026-10-02"
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="p-3.5 text-base sm:text-lg font-serif font-bold text-charcoal-900 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white shadow-sm cursor-pointer"
                  />
                  <p className="text-xs text-charcoal-500 mt-2">
                    Selected: <strong className="text-charcoal-900 font-serif text-sm">{getFormattedDate(selectedDate)}</strong>
                  </p>
                </div>

                {/* Quick Date Pills */}
                <div>
                  <span className="text-xs font-semibold text-charcoal-600 uppercase tracking-wider block mb-2 text-center">
                    Quick Select Options:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { label: 'Today (Oct 2)', date: '2026-10-02' },
                      { label: 'Tomorrow (Oct 3)', date: '2026-10-03' },
                      { label: 'This Weekend (Oct 4)', date: '2026-10-04' },
                      { label: 'Oct 10, 2026', date: '2026-10-10' }
                    ].map((qd) => (
                      <button
                        key={qd.date}
                        type="button"
                        onClick={() => setSelectedDate(qd.date)}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                          selectedDate === qd.date
                            ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-sm'
                            : 'bg-white text-charcoal-700 border-beige-200 hover:bg-beige-50'
                        }`}
                      >
                        {qd.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* STEP 4: SELECT TIME */}
          {/* ========================================== */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="font-serif text-2xl font-bold text-charcoal-900">
                  Step 4 — Select Available Time Slot
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
                  Showing real-time availability for <strong className="text-charcoal-900">{getFormattedDate(selectedDate)}</strong>.
                </p>
              </div>

              {slotsLoading ? (
                <Loading text="Checking schedule slots..." />
              ) : (
                <div className="max-w-xl mx-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedTime === slot.time && slot.isAvailable;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.isAvailable}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex flex-col items-center gap-1 ${
                            isSelected
                              ? 'bg-charcoal-900 text-gold-400 border-charcoal-900 shadow-md ring-2 ring-gold-400'
                              : slot.isAvailable
                              ? 'bg-white text-charcoal-800 border-beige-300 hover:border-gold-500 hover:bg-cream-50'
                              : 'bg-charcoal-100 text-charcoal-400 border-charcoal-200 cursor-not-allowed opacity-60'
                          }`}
                        >
                          <Clock size={15} />
                          <span>{slot.time}</span>
                          <span className="text-[10px] font-normal uppercase tracking-wider">
                            {slot.isAvailable ? 'Available' : 'Booked'}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-center text-xs text-charcoal-500 mt-6 flex items-center justify-center gap-1.5">
                    <ShieldCheck size={14} className="text-gold-600" />
                    Sessions include a 15-minute sanctuary buffer for thorough sanitization.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* STEP 5: CUSTOMER DETAILS */}
          {/* ========================================== */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
              <div>
                <h3 className="font-serif text-2xl font-bold text-charcoal-900">
                  Step 5 — Guest Information
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
                  Provide your contact details so our salon concierge can finalize your booking.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                    placeholder="e.g. Harish Varma"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/40"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={customerDetails.email}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                      placeholder="e.g. harish.varma@example.com"
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerDetails.phone}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                    Special Preferences / Allergies / Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={customerDetails.notes}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, notes: e.target.value })}
                    placeholder="e.g., Sensitive skin, prefer non-fragrant aloe gel, scalp tension focus..."
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-cream-50/40"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* STEP 6: CONFIRMATION & REVIEW */}
          {/* ========================================== */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
              <div>
                <h3 className="font-serif text-2xl font-bold text-charcoal-900">
                  Step 6 — Review & Confirm Appointment
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
                  Please verify all reservation details before confirming your session.
                </p>
              </div>

              {/* Review Card */}
              <div className="bg-cream-50 rounded-2xl border border-beige-200 p-6 space-y-4">
                <div className="flex items-start justify-between pb-3 border-b border-beige-200">
                  <div>
                    <span className="text-[11px] text-gold-700 uppercase font-bold tracking-wider">
                      {selectedService?.category}
                    </span>
                    <h4 className="font-serif text-xl font-bold text-charcoal-900">
                      {selectedService?.name}
                    </h4>
                  </div>
                  <span className="font-serif text-2xl font-bold text-charcoal-900">
                    ₹{selectedService?.price.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-charcoal-500 block text-[11px] uppercase">Specialist</span>
                    <strong className="text-charcoal-900">
                      {selectedStaff === 'any'
                        ? 'Any Available Professional'
                        : staffList.find((s) => s.id === selectedStaff)?.name}
                    </strong>
                  </div>
                  <div>
                    <span className="text-charcoal-500 block text-[11px] uppercase">Duration</span>
                    <strong className="text-charcoal-900">{selectedService?.duration}</strong>
                  </div>
                  <div>
                    <span className="text-charcoal-500 block text-[11px] uppercase">Date</span>
                    <strong className="text-charcoal-900">{getFormattedDate(selectedDate)}</strong>
                  </div>
                  <div>
                    <span className="text-charcoal-500 block text-[11px] uppercase">Time Slot</span>
                    <strong className="text-gold-700 font-bold">{selectedTime}</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-beige-200 text-xs text-charcoal-600 space-y-1">
                  <p>Guest: <strong className="text-charcoal-800">{customerDetails.name}</strong></p>
                  <p>Contact: <strong className="text-charcoal-800">{customerDetails.phone}</strong> • {customerDetails.email}</p>
                  {customerDetails.notes && (
                    <p className="italic text-charcoal-500">Note: "{customerDetails.notes}"</p>
                  )}
                </div>
              </div>

              <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80 text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 text-amber-600 mt-0.5" />
                <span>
                  No immediate advance payment required. Payment is collected at the parlour via UPI, Credit Card, or Cash following your service.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons (Back & Next / Confirm) */}
        <div className="flex items-center justify-between pt-8 border-t border-beige-200/80 mt-8">
          {currentStep > 1 ? (
            <Button
              variant="outline"
              size="md"
              onClick={handleBack}
              icon={ArrowLeft}
              disabled={submitting}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 6 ? (
            <Button
              variant="gold"
              size="md"
              onClick={handleNext}
              icon={ArrowRight}
              iconPosition="right"
            >
              Continue to {steps[currentStep].label}
            </Button>
          ) : (
            <Button
              variant="gold"
              size="lg"
              onClick={handleConfirmAppointment}
              loading={submitting}
              className="shadow-gold px-8"
              icon={CheckCircle}
            >
              Confirm Appointment
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
