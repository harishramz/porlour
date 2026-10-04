import { initialServices } from '../data/services';
import { initialStaff } from '../data/staff';
import { initialOffers } from '../data/offers';
import { initialReviews } from '../data/reviews';
import { initialGallery } from '../data/gallery';
import { initialCustomers } from '../data/customers';
import { initialAppointments } from '../data/appointments';
import { profileToUser, supabase, supabaseConfigured } from './supabase';

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

const catalogTables = {
  services: 'salon_services',
  staff: 'staff_members',
  offers: 'salon_offers',
  reviews: 'salon_reviews',
  gallery: 'gallery_items'
};

const visibleCatalogItem = (item) => {
  const status = item.status?.toLowerCase();
  return status !== 'inactive' && status !== 'expired';
};

const getCatalogRecords = async (table, fallback, includeInactive = false) => {
  const { data: catalogState, error: stateError } = await supabase
    .from('salon_catalog_state')
    .select('initialized')
    .eq('id', 'primary')
    .single();
  if (stateError) {
    if (stateError.code === 'PGRST205' || stateError.code === '42P01') {
      console.warn('Supabase catalog schema is not installed; showing the bundled catalog until it is configured.');
      return includeInactive ? fallback : fallback.filter(visibleCatalogItem);
    }
    throw stateError;
  }
  if (!catalogState.initialized) {
    return includeInactive ? fallback : fallback.filter(visibleCatalogItem);
  }

  const { data, error } = await supabase
    .from(table)
    .select('id, data')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  const records = (data || []).map((row) => ({ ...row.data, id: row.id }));
  return includeInactive ? records : records.filter(visibleCatalogItem);
};

const createCatalogRecord = async (table, record) => {
  const { data, error } = await supabase
    .from(table)
    .insert({ data: record, is_active: true })
    .select('id, data')
    .single();
  if (error) throw error;
  return { ...data.data, id: data.id };
};

const updateCatalogRecord = async (table, id, updatedFields) => {
  const { data: existing, error: readError } = await supabase
    .from(table)
    .select('data')
    .eq('id', id)
    .single();
  if (readError) throw readError;
  const updated = { ...existing.data, ...updatedFields, id };
  const { data, error } = await supabase
    .from(table)
    .update({ data: updated })
    .eq('id', id)
    .select('id, data')
    .single();
  if (error) throw error;
  return { ...data.data, id: data.id };
};

const deleteCatalogRecord = async (table, id) => {
  const { error } = await supabase.from(table).update({ is_active: false }).eq('id', id);
  if (error) throw error;
  return { success: true, id };
};

export const seedInitialCatalogData = async () => {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data: catalogState, error: stateError } = await supabase
    .from('salon_catalog_state')
    .select('initialized')
    .eq('id', 'primary')
    .single();
  if (stateError) throw stateError;
  if (catalogState.initialized) return;

  const seedTables = [
    [catalogTables.services, initialServices],
    [catalogTables.staff, initialStaff],
    [catalogTables.offers, initialOffers],
    [catalogTables.reviews, initialReviews],
    [catalogTables.gallery, initialGallery]
  ];

  for (const [table, records] of seedTables) {
    const { data: existing, error: readError } = await supabase.from(table).select('id').limit(1);
    if (readError) throw readError;
    if (existing?.length) continue;

    const rows = records.map((record) => ({
      id: record.id,
      data: record,
      is_active: true
    }));
    const { error } = await supabase.from(table).insert(rows);
    if (error) throw error;
  }

  const { error } = await supabase
    .from('salon_catalog_state')
    .update({ initialized: true })
    .eq('id', 'primary');
  if (error) throw error;
};

export const apiRequest = async (path, { method = 'GET', body, accessToken } = {}) => {
  let token = accessToken;
  if (!token && supabase) {
    const { data } = await supabase.auth.getSession();
    token = data.session?.access_token;
  }

  const response = await fetch(`/api${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(result.error || `API request failed (${response.status}).`);
    error.status = response.status;
    error.code = result.code;
    throw error;
  }
  return result;
};

// ==========================================
// SERVICES API (Future: /api/services)
// ==========================================
export const getServices = async ({ includeInactive = false } = {}) => {
  if (supabaseConfigured) return getCatalogRecords(catalogTables.services, initialServices, includeInactive);
  await delay(150);
  const services = getStorageItem(STORAGE_KEYS.SERVICES, initialServices);
  return includeInactive ? services : services.filter(visibleCatalogItem);
};

export const getServiceById = async (id) => {
  if (supabaseConfigured) {
    const service = (await getCatalogRecords(catalogTables.services, initialServices)).find((record) => record.id === id);
    if (!service) throw new Error(`Service with ID ${id} not found`);
    return service;
  }
  await delay(100);
  const services = getStorageItem(STORAGE_KEYS.SERVICES, initialServices);
  const service = services.find((s) => s.id === id);
  if (!service) {
    throw new Error(`Service with ID ${id} not found`);
  }
  return service;
};

export const createService = async (serviceData) => {
  if (supabaseConfigured) {
    return createCatalogRecord(catalogTables.services, {
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
    });
  }
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
  if (supabaseConfigured) return updateCatalogRecord(catalogTables.services, id, updatedFields);
  await delay(200);
  const services = getStorageItem(STORAGE_KEYS.SERVICES, initialServices);
  const index = services.findIndex((s) => s.id === id);
  if (index === -1) throw new Error('Service not found');
  services[index] = { ...services[index], ...updatedFields };
  setStorageItem(STORAGE_KEYS.SERVICES, services);
  return services[index];
};

export const deleteService = async (id) => {
  if (supabaseConfigured) return deleteCatalogRecord(catalogTables.services, id);
  await delay(200);
  const services = getStorageItem(STORAGE_KEYS.SERVICES, initialServices);
  const filtered = services.filter((s) => s.id !== id);
  setStorageItem(STORAGE_KEYS.SERVICES, filtered);
  return { success: true, id };
};

// ==========================================
// STAFF API (Future: /api/staff)
// ==========================================
export const getStaff = async ({ includeInactive = false } = {}) => {
  if (supabaseConfigured) return getCatalogRecords(catalogTables.staff, initialStaff, includeInactive);
  await delay(150);
  const staff = getStorageItem(STORAGE_KEYS.STAFF, initialStaff);
  return includeInactive ? staff : staff.filter(visibleCatalogItem);
};

export const getStaffById = async (id) => {
  if (supabaseConfigured) {
    const member = (await getCatalogRecords(catalogTables.staff, initialStaff)).find((record) => record.id === id);
    if (!member) throw new Error('Staff member not found');
    return member;
  }
  await delay(100);
  const staff = getStorageItem(STORAGE_KEYS.STAFF, initialStaff);
  const member = staff.find((s) => s.id === id);
  if (!member) throw new Error('Staff member not found');
  return member;
};

export const createStaff = async (staffData) => {
  if (supabaseConfigured) return createCatalogRecord(catalogTables.staff, { status: 'Active', ...staffData });
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
  if (supabaseConfigured) return updateCatalogRecord(catalogTables.staff, id, updatedFields);
  await delay(200);
  const staff = getStorageItem(STORAGE_KEYS.STAFF, initialStaff);
  const index = staff.findIndex((s) => s.id === id);
  if (index === -1) throw new Error('Staff not found');
  staff[index] = { ...staff[index], ...updatedFields };
  setStorageItem(STORAGE_KEYS.STAFF, staff);
  return staff[index];
};

export const deleteStaff = async (id) => {
  if (supabaseConfigured) return deleteCatalogRecord(catalogTables.staff, id);
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
  if (supabaseConfigured) {
    const { data, error } = await supabase.rpc('get_booked_appointment_times', {
      requested_date: date,
      requested_staff_id: staffId || 'any'
    });
    if (error) throw error;
    const bookedTimes = new Set((data || []).map((appointment) => appointment.booked_time));
    return ['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']
      .map((time) => ({ time, isAvailable: !bookedTimes.has(time) }));
  }
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
const serializeAppointment = (appointment) => ({
  ...appointment.data,
  id: appointment.id,
  customerId: appointment.customer_id,
  date: appointment.date,
  time: appointment.time,
  staffId: appointment.staff_id,
  status: appointment.status,
  createdAt: appointment.created_at
});

export const getAppointments = async (customerId = null) => {
  if (supabaseConfigured) {
    let query = supabase.from('appointments').select('*').order('date', { ascending: false });
    if (customerId) query = query.eq('customer_id', customerId);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(serializeAppointment);
  }
  await delay(150);
  const appointments = getStorageItem(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
  if (customerId) {
    return appointments.filter((apt) => apt.customerId === customerId);
  }
  return appointments;
};

export const getAppointmentById = async (id) => {
  if (supabaseConfigured) {
    const { data, error } = await supabase.from('appointments').select('*').eq('id', id).single();
    if (error) throw error;
    return serializeAppointment(data);
  }
  await delay(100);
  const appointments = getStorageItem(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
  const apt = appointments.find((a) => a.id === id);
  if (!apt) throw new Error('Appointment not found');
  return apt;
};

export const createAppointment = async (appointmentData) => {
  if (supabaseConfigured) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('Sign in before booking an appointment.');
    const customerId = appointmentData.customerId || user.id;
    const record = {
      ...appointmentData,
      customerId,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        customer_id: customerId,
        date: appointmentData.date,
        time: appointmentData.time,
        staff_id: appointmentData.staffId && appointmentData.staffId !== 'any' ? appointmentData.staffId : null,
        status: record.status,
        data: record
      })
      .select('*')
      .single();
    if (error) throw error;
    return serializeAppointment(data);
  }
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
  if (supabaseConfigured) {
    const appointment = await getAppointmentById(id);
    const updated = {
      ...appointment,
      status: 'Cancelled',
      cancellationReason: reason,
      cancelledAt: new Date().toISOString()
    };
    const { data, error } = await supabase
      .from('appointments')
      .update({ status: 'Cancelled', data: updated })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return serializeAppointment(data);
  }
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
  if (supabaseConfigured) {
    const appointment = await getAppointmentById(id);
    const updated = { ...appointment, status };
    const { data, error } = await supabase
      .from('appointments')
      .update({ status, data: updated })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return serializeAppointment(data);
  }
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
  if (supabaseConfigured) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('Sign in to view your customer profile.');
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, phone, date_of_birth, avatar_url, address, preferences, role')
      .eq('id', user.id)
      .single();
    if (error) throw error;
    return profileToUser(data);
  }
  await delay(150);
  const customers = getStorageItem(STORAGE_KEYS.CUSTOMERS, initialCustomers);
  const customer = customers.find((c) => c.id === customerId);
  return customer || initialCustomers[0];
};

export const updateCustomerProfile = async (customerId, updatedData) => {
  if (supabaseConfigured) {
    const profileUpdates = {
      ...(updatedData.name !== undefined ? { full_name: updatedData.name } : {}),
      ...(updatedData.phone !== undefined ? { phone: updatedData.phone } : {}),
      ...(updatedData.avatar !== undefined ? { avatar_url: updatedData.avatar } : {}),
      ...(updatedData.dob !== undefined ? { date_of_birth: updatedData.dob || null } : {}),
      ...(updatedData.address !== undefined ? { address: updatedData.address } : {}),
      ...(updatedData.preferences !== undefined ? { preferences: updatedData.preferences } : {})
    };
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('Sign in to update your customer profile.');
    const { data, error } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', user.id)
      .select('id, email, full_name, phone, date_of_birth, avatar_url, address, preferences, role')
      .single();
    if (error) throw error;
    return profileToUser(data);
  }
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
  if (supabaseConfigured) {
    const [{ data: profiles, error: profilesError }, { data: appointments, error: appointmentsError }] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, email, full_name, phone, avatar_url, role, created_at')
        .eq('role', 'customer'),
      supabase.from('appointments').select('customer_id, status, data, date')
    ]);
    if (profilesError) throw profilesError;
    if (appointmentsError) throw appointmentsError;

    const appointmentsByCustomer = new Map();
    for (const appointment of appointments || []) {
      const customerAppointments = appointmentsByCustomer.get(appointment.customer_id) || [];
      customerAppointments.push(appointment);
      appointmentsByCustomer.set(appointment.customer_id, customerAppointments);
    }
    return (profiles || []).map((profile) => {
      const visits = appointmentsByCustomer.get(profile.id) || [];
      const completedVisits = visits.filter((visit) => visit.status === 'Completed');
      return {
        id: profile.id,
        name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        avatar: profile.avatar_url || '',
        role: profile.role,
        totalAppointments: visits.length,
        totalSpending: completedVisits.reduce((sum, visit) => sum + Number(visit.data.price || 0), 0),
        lastVisit: completedVisits.map((visit) => visit.date).sort().at(-1) || 'Never',
        status: visits.length ? 'Active' : 'New Customer',
        createdAt: profile.created_at
      };
    });
  }
  await delay(150);
  return getStorageItem(STORAGE_KEYS.CUSTOMERS, initialCustomers);
};

export const loginUser = async ({ email, password, role = 'customer' }) => {
  if (supabaseConfigured) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return apiRequest('/auth/me', { accessToken: data.session.access_token });
  }
  await delay(250);
  if (role === 'admin' || email.includes('admin')) {
    return {
      id: 'admin-1',
      name: 'Super Admin',
      email: email || 'admin@aura-luxe.local',
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
  if (supabaseConfigured) {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { data: { full_name: formData.name, phone: formData.phone || '' } }
    });
    if (error) throw error;
    return data;
  }
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
export const getOffers = async ({ includeInactive = false } = {}) => {
  if (supabaseConfigured) return getCatalogRecords(catalogTables.offers, initialOffers, includeInactive);
  await delay(150);
  const offers = getStorageItem(STORAGE_KEYS.OFFERS, initialOffers);
  return includeInactive ? offers : offers.filter(visibleCatalogItem);
};

export const createOffer = async (offerData) => {
  if (supabaseConfigured) {
    return createCatalogRecord(catalogTables.offers, {
      savings: Math.max(0, offerData.originalPrice - offerData.discountedPrice),
      discountPercent: Math.round(((offerData.originalPrice - offerData.discountedPrice) / offerData.originalPrice) * 100),
      status: 'Active',
      ...offerData
    });
  }
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
  if (supabaseConfigured) return updateCatalogRecord(catalogTables.offers, id, updatedFields);
  await delay(200);
  const offers = getStorageItem(STORAGE_KEYS.OFFERS, initialOffers);
  const index = offers.findIndex((o) => o.id === id);
  if (index === -1) throw new Error('Offer not found');
  offers[index] = { ...offers[index], ...updatedFields };
  setStorageItem(STORAGE_KEYS.OFFERS, offers);
  return offers[index];
};

export const deleteOffer = async (id) => {
  if (supabaseConfigured) return deleteCatalogRecord(catalogTables.offers, id);
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
  if (supabaseConfigured) return getCatalogRecords(catalogTables.reviews, initialReviews);
  await delay(150);
  return getStorageItem(STORAGE_KEYS.REVIEWS, initialReviews);
};

export const addReview = async (reviewData) => {
  if (supabaseConfigured) {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (!user) throw new Error('Sign in before submitting a review.');
    return createCatalogRecord(catalogTables.reviews, {
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      verified: true,
      customerId: user.id,
      ...reviewData
    });
  }
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
  if (supabaseConfigured) return getCatalogRecords(catalogTables.gallery, initialGallery);
  await delay(150);
  return getStorageItem(STORAGE_KEYS.GALLERY, initialGallery);
};

export const addGalleryItem = async (itemData) => {
  if (supabaseConfigured) return createCatalogRecord(catalogTables.gallery, itemData);
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
  if (supabaseConfigured) return deleteCatalogRecord(catalogTables.gallery, id);
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
  if (supabaseConfigured) {
    const [{ data: appointments, error: appointmentsError }, { data: customers, error: customersError }] = await Promise.all([
      supabase.from('appointments').select('customer_id, date, status, data'),
      supabase.from('profiles').select('id').eq('role', 'customer')
    ]);
    if (appointmentsError) throw appointmentsError;
    if (customersError) throw customersError;

    const records = appointments || [];
    const today = new Date();
    const todayKey = today.toISOString().slice(0, 10);
    const monthKey = todayKey.slice(0, 7);
    const completed = records.filter((appointment) => appointment.status === 'Completed');
    const monthlyTrends = Array.from({ length: 6 }, (_, index) => {
      const month = new Date(today.getFullYear(), today.getMonth() - 5 + index, 1);
      const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
      const monthAppointments = records.filter((appointment) => appointment.date?.startsWith(key));
      return {
        month: month.toLocaleString('en-US', { month: 'short' }),
        revenue: monthAppointments
          .filter((appointment) => appointment.status === 'Completed')
          .reduce((sum, appointment) => sum + Number(appointment.data.price || 0), 0),
        bookings: monthAppointments.length
      };
    });
    const weeklyTrends = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const key = date.toISOString().slice(0, 10);
      const daily = records.filter((appointment) => appointment.date === key);
      return {
        day: date.toLocaleString('en-US', { weekday: 'short' }),
        appointments: daily.length,
        revenue: daily
          .filter((appointment) => appointment.status === 'Completed')
          .reduce((sum, appointment) => sum + Number(appointment.data.price || 0), 0)
      };
    });
    const serviceTotals = new Map();
    const staffTotals = new Map();
    for (const appointment of records) {
      if (appointment.status === 'Cancelled') continue;
      const price = Number(appointment.data.price || 0);
      const serviceName = appointment.data.serviceName || 'Salon service';
      const service = serviceTotals.get(serviceName) || { name: serviceName, bookings: 0, revenue: 0 };
      service.bookings += 1;
      service.revenue += price;
      serviceTotals.set(serviceName, service);
      const staffName = appointment.data.staffName || 'Unassigned';
      const staff = staffTotals.get(staffName) || {
        name: staffName,
        role: appointment.data.staffRole || 'Salon professional',
        bookings: 0,
        revenue: 0,
        rating: Number(appointment.data.rating || 5)
      };
      staff.bookings += 1;
      staff.revenue += price;
      staffTotals.set(staffName, staff);
    }
    const currentMonth = records.filter((appointment) => appointment.date?.startsWith(monthKey));
    const completedTotal = completed.reduce((sum, appointment) => sum + Number(appointment.data.price || 0), 0);
    return {
      summary: {
        totalRevenue: completedTotal,
        monthlyRevenue: currentMonth
          .filter((appointment) => appointment.status === 'Completed')
          .reduce((sum, appointment) => sum + Number(appointment.data.price || 0), 0),
        totalAppointments: records.length,
        todayAppointments: records.filter((appointment) => appointment.date === todayKey).length,
        pendingAppointments: records.filter((appointment) => appointment.status === 'Pending').length,
        confirmedAppointments: records.filter((appointment) => appointment.status === 'Confirmed').length,
        completedAppointments: completed.length,
        cancelledAppointments: records.filter((appointment) => appointment.status === 'Cancelled').length,
        totalCustomers: customers?.length || 0
      },
      weeklyTrends,
      monthlyTrends,
      topServices: [...serviceTotals.values()].sort((a, b) => b.bookings - a.bookings).slice(0, 5),
      staffPerformance: [...staffTotals.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5)
    };
  }
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
