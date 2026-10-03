import { initialServices } from '../data/services';
import { initialStaff } from '../data/staff';
import { initialOffers } from '../data/offers';
import { initialReviews } from '../data/reviews';
import { initialGallery } from '../data/gallery';
import { initialCustomers } from '../data/customers';
import { initialAppointments } from '../data/appointments';

// LocalStorage Keys
const STORAGE_KEYS = {
  SERVICES: 'aura_luxe_services',
  STAFF: 'aura_luxe_staff',
  OFFERS: 'aura_luxe_offers',
  REVIEWS: 'aura_luxe_reviews',
  GALLERY: 'aura_luxe_gallery',
  CUSTOMERS: 'aura_luxe_customers',
  APPOINTMENTS: 'aura_luxe_appointments',
  USER_PROFILE: 'aura_luxe_profile'
};

// Helper to get or seed localStorage
const getStorageItem = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
};

const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
};

// Simulate network latency for production realism
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// SERVICES API (Future: /api/services)
// ==========================================
export const getServices = async () => {
  await delay(150);
  return getStorageItem(STORAGE_KEYS.SERVICES, initialServices);
};

export const getServiceById = async (id) => {
  await delay(100);
  const services = getStorageItem(STORAGE_KEYS.SERVICES, initialServices);
  const service = services.find((s) => s.id === id);
  if (!service) {
    throw new Error(`Service with ID ${id} not found`);
  }
  return service;
};

export const createService = async (serviceData) => {
  await delay(200);
  const services = getStorageItem(STORAGE_KEYS.SERVICES, initialServices);
  const newService = {
    id: `srv-${Date.now()}`,
    rating: 5.0,
    reviewsCount: 0,
    isPopular: false,
    status: 'Active',
    benefits: serviceData.benefits || [
      'Delivered by certified master stylists',
      'Uses organic cruelty-free luxury formulations',
      'Noticeable revitalization from first session'
    ],
    included: serviceData.included || [
      'Comprehensive one-on-one consultation',
      'Custom treatment application',
      'Post-care recommendations & advice'
    ],
    staffIds: serviceData.staffIds || ['staff-1'],
    ...serviceData
  };
  const updated = [newService, ...services];
  setStorageItem(STORAGE_KEYS.SERVICES, updated);
  return newService;
};

export const updateService = async (id, updatedFields) => {
  await delay(200);
  const services = getStorageItem(STORAGE_KEYS.SERVICES, initialServices);
  const index = services.findIndex((s) => s.id === id);
  if (index === -1) throw new Error('Service not found');
  services[index] = { ...services[index], ...updatedFields };
  setStorageItem(STORAGE_KEYS.SERVICES, services);
  return services[index];
};

export const deleteService = async (id) => {
  await delay(200);
  const services = getStorageItem(STORAGE_KEYS.SERVICES, initialServices);
  const filtered = services.filter((s) => s.id !== id);
  setStorageItem(STORAGE_KEYS.SERVICES, filtered);
  return { success: true, id };
};

// ==========================================
// STAFF API (Future: /api/staff)
// ==========================================
export const getStaff = async () => {
  await delay(150);
  return getStorageItem(STORAGE_KEYS.STAFF, initialStaff);
};

export const getStaffById = async (id) => {
  await delay(100);
  const staff = getStorageItem(STORAGE_KEYS.STAFF, initialStaff);
  const member = staff.find((s) => s.id === id);
  if (!member) throw new Error('Staff member not found');
  return member;
};

export const createStaff = async (staffData) => {
  await delay(200);
  const staff = getStorageItem(STORAGE_KEYS.STAFF, initialStaff);
  const newStaff = {
    id: `staff-${Date.now()}`,
    rating: 5.0,
    reviewsCount: 0,
    status: 'Active',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: '10:00 AM - 07:00 PM',
    ...staffData
  };
  const updated = [...staff, newStaff];
  setStorageItem(STORAGE_KEYS.STAFF, updated);
  return newStaff;
};

export const updateStaff = async (id, updatedFields) => {
  await delay(200);
  const staff = getStorageItem(STORAGE_KEYS.STAFF, initialStaff);
  const index = staff.findIndex((s) => s.id === id);
  if (index === -1) throw new Error('Staff not found');
  staff[index] = { ...staff[index], ...updatedFields };
  setStorageItem(STORAGE_KEYS.STAFF, staff);
  return staff[index];
};

export const deleteStaff = async (id) => {
  await delay(200);
  const staff = getStorageItem(STORAGE_KEYS.STAFF, initialStaff);
  const filtered = staff.filter((s) => s.id !== id);
  setStorageItem(STORAGE_KEYS.STAFF, filtered);
  return { success: true, id };
};

// ==========================================
// AVAILABILITY SLOTS API (Future: /api/slots)
// ==========================================
export const getAvailableSlots = async (date, staffId) => {
  await delay(100);
  const standardSlots = [
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM'
  ];

  // Check appointments on that date and mark taken slots as unavailable
  const appointments = getStorageItem(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
  const bookedOnDate = appointments.filter(
    (apt) => apt.date === date && apt.status !== 'Cancelled' && (staffId === 'any' || apt.staffId === staffId)
  );
  const bookedTimes = bookedOnDate.map((apt) => apt.time);

  return standardSlots.map((time) => ({
    time,
    isAvailable: !bookedTimes.includes(time)
  }));
};

// ==========================================
// APPOINTMENTS API (Future: /api/appointments)
// ==========================================
export const getAppointments = async (customerId = null) => {
  await delay(150);
  const appointments = getStorageItem(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
  if (customerId) {
    return appointments.filter((apt) => apt.customerId === customerId);
  }
  return appointments;
};

export const getAppointmentById = async (id) => {
  await delay(100);
  const appointments = getStorageItem(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
  const apt = appointments.find((a) => a.id === id);
  if (!apt) throw new Error('Appointment not found');
  return apt;
};

export const createAppointment = async (appointmentData) => {
  await delay(250);
  const appointments = getStorageItem(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
  const newAppointment = {
    id: `apt-${Date.now().toString().slice(-4)}`,
    status: 'Confirmed', // new bookings default to confirmed
    createdAt: new Date().toISOString(),
    ...appointmentData
  };
  const updated = [newAppointment, ...appointments];
  setStorageItem(STORAGE_KEYS.APPOINTMENTS, updated);
  return newAppointment;
};

export const cancelAppointment = async (id, reason = 'Cancelled by client') => {
  await delay(200);
  const appointments = getStorageItem(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
  const index = appointments.findIndex((a) => a.id === id);
  if (index === -1) throw new Error('Appointment not found');
  appointments[index] = {
    ...appointments[index],
    status: 'Cancelled',
    cancellationReason: reason,
    cancelledAt: new Date().toISOString()
  };
  setStorageItem(STORAGE_KEYS.APPOINTMENTS, appointments);
  return appointments[index];
};

export const updateAppointmentStatus = async (id, status) => {
  await delay(200);
  const appointments = getStorageItem(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
  const index = appointments.findIndex((a) => a.id === id);
  if (index === -1) throw new Error('Appointment not found');
  appointments[index] = { ...appointments[index], status };
  setStorageItem(STORAGE_KEYS.APPOINTMENTS, appointments);
  return appointments[index];
};

// ==========================================
// CUSTOMER PROFILE & AUTH (Future: /api/auth, /api/customers)
// ==========================================
export const getCustomerProfile = async (customerId = 'cust-1') => {
  await delay(150);
  const customers = getStorageItem(STORAGE_KEYS.CUSTOMERS, initialCustomers);
  const customer = customers.find((c) => c.id === customerId);
  return customer || initialCustomers[0];
};

export const updateCustomerProfile = async (customerId, updatedData) => {
  await delay(200);
  const customers = getStorageItem(STORAGE_KEYS.CUSTOMERS, initialCustomers);
  const index = customers.findIndex((c) => c.id === customerId);
  if (index !== -1) {
    customers[index] = { ...customers[index], ...updatedData };
    setStorageItem(STORAGE_KEYS.CUSTOMERS, customers);
    return customers[index];
  }
  return updatedData;
};

export const getCustomers = async () => {
  await delay(150);
  return getStorageItem(STORAGE_KEYS.CUSTOMERS, initialCustomers);
};

export const loginUser = async ({ email, password, role = 'customer' }) => {
  await delay(250);
  if (role === 'admin' || email.includes('admin')) {
    return {
      id: 'admin-1',
      name: 'Super Admin',
      email: email || 'admin@auraluxe.com',
      role: 'admin',
      token: 'mock-jwt-admin-token-xyz'
    };
  }
  // Default to Harish Varma
  const profile = getStorageItem(STORAGE_KEYS.CUSTOMERS, initialCustomers)[0];
  return {
    ...profile,
    role: 'customer',
    token: 'mock-jwt-customer-token-abc'
  };
};

export const registerUser = async (formData) => {
  await delay(250);
  const newCustomer = {
    id: `cust-${Date.now()}`,
    name: formData.name,
    email: formData.email,
    phone: formData.phone || '+91 90000 00000',
    dob: formData.dob || '1995-01-01',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    address: 'Coimbatore, Tamil Nadu',
    preferences: {
      skinType: 'Normal',
      hairType: 'Straight',
      allergies: 'None',
      favoriteBeverage: 'Green tea',
      preferredStaff: 'Any'
    },
    totalAppointments: 0,
    totalSpending: 0,
    lastVisit: 'Never',
    status: 'New Customer',
    role: 'customer',
    token: `mock-jwt-reg-${Date.now()}`
  };
  const customers = getStorageItem(STORAGE_KEYS.CUSTOMERS, initialCustomers);
  setStorageItem(STORAGE_KEYS.CUSTOMERS, [newCustomer, ...customers]);
  return newCustomer;
};

// ==========================================
// OFFERS API (Future: /api/offers)
// ==========================================
export const getOffers = async () => {
  await delay(150);
  return getStorageItem(STORAGE_KEYS.OFFERS, initialOffers);
};

export const createOffer = async (offerData) => {
  await delay(200);
  const offers = getStorageItem(STORAGE_KEYS.OFFERS, initialOffers);
  const newOffer = {
    id: `off-${Date.now()}`,
    savings: Math.max(0, offerData.originalPrice - offerData.discountedPrice),
    discountPercent: Math.round(((offerData.originalPrice - offerData.discountedPrice) / offerData.originalPrice) * 100),
    status: 'Active',
    ...offerData
  };
  const updated = [newOffer, ...offers];
  setStorageItem(STORAGE_KEYS.OFFERS, updated);
  return newOffer;
};

export const updateOffer = async (id, updatedFields) => {
  await delay(200);
  const offers = getStorageItem(STORAGE_KEYS.OFFERS, initialOffers);
  const index = offers.findIndex((o) => o.id === id);
  if (index === -1) throw new Error('Offer not found');
  offers[index] = { ...offers[index], ...updatedFields };
  setStorageItem(STORAGE_KEYS.OFFERS, offers);
  return offers[index];
};

export const deleteOffer = async (id) => {
  await delay(200);
  const offers = getStorageItem(STORAGE_KEYS.OFFERS, initialOffers);
  const filtered = offers.filter((o) => o.id !== id);
  setStorageItem(STORAGE_KEYS.OFFERS, filtered);
  return { success: true, id };
};

// ==========================================
// REVIEWS API (Future: /api/reviews)
// ==========================================
export const getReviews = async () => {
  await delay(150);
  return getStorageItem(STORAGE_KEYS.REVIEWS, initialReviews);
};

export const addReview = async (reviewData) => {
  await delay(200);
  const reviews = getStorageItem(STORAGE_KEYS.REVIEWS, initialReviews);
  const newReview = {
    id: `rev-${Date.now()}`,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    ...reviewData
  };
  const updated = [newReview, ...reviews];
  setStorageItem(STORAGE_KEYS.REVIEWS, updated);
  return newReview;
};

// ==========================================
// GALLERY API (Future: /api/gallery)
// ==========================================
export const getGallery = async () => {
  await delay(150);
  return getStorageItem(STORAGE_KEYS.GALLERY, initialGallery);
};

export const addGalleryItem = async (itemData) => {
  await delay(200);
  const gallery = getStorageItem(STORAGE_KEYS.GALLERY, initialGallery);
  const newItem = {
    id: `gal-${Date.now()}`,
    ...itemData
  };
  const updated = [newItem, ...gallery];
  setStorageItem(STORAGE_KEYS.GALLERY, updated);
  return newItem;
};

export const deleteGalleryItem = async (id) => {
  await delay(200);
  const gallery = getStorageItem(STORAGE_KEYS.GALLERY, initialGallery);
  const filtered = gallery.filter((g) => g.id !== id);
  setStorageItem(STORAGE_KEYS.GALLERY, filtered);
  return { success: true, id };
};

// ==========================================
// REPORTS & ANALYTICS API (Future: /api/reports)
// ==========================================
export const getReportsData = async () => {
  await delay(200);
  const appointments = getStorageItem(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
  const completedApts = appointments.filter((a) => a.status === 'Completed');
  const confirmedApts = appointments.filter((a) => a.status === 'Confirmed');

  return {
    summary: {
      totalRevenue: completedApts.reduce((sum, a) => sum + (a.price || 0), 0) + 142000,
      monthlyRevenue: 84500,
      totalAppointments: appointments.length + 184,
      todayAppointments: 6,
      pendingAppointments: appointments.filter((a) => a.status === 'Pending').length,
      confirmedAppointments: confirmedApts.length,
      completedAppointments: completedApts.length + 150,
      cancelledAppointments: appointments.filter((a) => a.status === 'Cancelled').length,
      totalCustomers: 142
    },
    weeklyTrends: [
      { day: 'Mon', appointments: 12, revenue: 18500 },
      { day: 'Tue', appointments: 15, revenue: 22400 },
      { day: 'Wed', appointments: 18, revenue: 29800 },
      { day: 'Thu', appointments: 14, revenue: 21000 },
      { day: 'Fri', appointments: 24, revenue: 41200 },
      { day: 'Sat', appointments: 32, revenue: 58900 },
      { day: 'Sun', appointments: 28, revenue: 49500 }
    ],
    monthlyTrends: [
      { month: 'May', revenue: 62000, bookings: 78 },
      { month: 'Jun', revenue: 71000, bookings: 92 },
      { month: 'Jul', revenue: 68500, bookings: 86 },
      { month: 'Aug', revenue: 79000, bookings: 104 },
      { month: 'Sep', revenue: 84500, bookings: 118 },
      { month: 'Oct (Proj)', revenue: 98000, bookings: 135 }
    ],
    topServices: [
      { name: 'Royal Bridal HD Makeup', bookings: 48, revenue: 696000 },
      { name: '24K Gold Luxury Facial', bookings: 92, revenue: 322000 },
      { name: 'Balayage & Color', bookings: 54, revenue: 297000 },
      { name: 'Botanical Keratin Spa', bookings: 68, revenue: 217600 },
      { name: 'Signature Haircut', bookings: 145, revenue: 174000 }
    ],
    staffPerformance: [
      { name: 'Meena Sundaram', role: 'Bridal Artist', bookings: 52, revenue: 410000, rating: 5.0 },
      { name: 'Priya Sharma', role: 'Hair Stylist', bookings: 98, revenue: 312000, rating: 4.9 },
      { name: 'Anitha Nair', role: 'Aesthetician', bookings: 86, revenue: 254000, rating: 4.9 },
      { name: 'Divya Krishnan', role: 'Nail Artist', bookings: 74, revenue: 148000, rating: 4.8 }
    ]
  };
};
