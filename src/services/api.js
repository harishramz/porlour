import { initialServices } from '../data/services';
import { initialStaff } from '../data/staff';
import { initialOffers } from '../data/offers';
import { initialReviews } from '../data/reviews';
import { initialGallery } from '../data/gallery';
import { initialCustomers } from '../data/customers';
import { initialAppointments } from '../data/appointments';
import { profileToUser, supabase, supabaseConfigured } from './supabase';
import { groupLegacyServiceVariants } from '../utils/serviceOptions';
import { getCustomerAvatar } from '../utils/profileImage';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

// LocalStorage Keys
const STORAGE_KEYS = {
  SERVICES: 'her_glow_services',
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

const productionDataOnly = import.meta.env.PROD;

const visibleCatalogItem = (item) => {
  const status = item.status?.toLowerCase();
  return status !== 'inactive' && status !== 'expired';
};

const getOfferExpiryDate = (value) => {
  if (!value || value.toLowerCase() === 'ongoing') return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const legacyDate = value.match(/^(\d{1,2}) ([A-Za-z]+) (\d{4})$/);
  if (!legacyDate) return null;
  const parsed = new Date(`${legacyDate[2]} ${legacyDate[1]}, ${legacyDate[3]} 12:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}`;
};

const filterExpiredOffers = (offers) => {
  const dateParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());
  const datePart = (type) => dateParts.find((part) => part.type === type)?.value;
  const todayKey = `${datePart('year')}-${datePart('month')}-${datePart('day')}`;
  return offers.filter((offer) => {
    const expiryDate = getOfferExpiryDate(offer.validUntil);
    return !expiryDate || expiryDate >= todayKey;
  });
};

const removeExpiredLocalOffers = (offers) => {
  const currentOffers = filterExpiredOffers(offers);
  if (currentOffers.length !== offers.length) setStorageItem(STORAGE_KEYS.OFFERS, currentOffers);
  return currentOffers;
};

const getSalonDateKey = (date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const part = (type) => parts.find((entry) => entry.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
};

const getCatalogRecords = async (table, fallback, includeInactive = false) => {
  const { data: catalogState, error: stateError } = await supabase
    .from('salon_catalog_state')
    .select('initialized')
    .eq('id', 'primary')
    .single();
  if (stateError) {
    if (stateError.code === 'PGRST205' || stateError.code === '42P01') {
      if (productionDataOnly) {
        throw new Error('The Supabase salon data schema is missing. Apply server/supabase/schema.sql before publishing.');
      }
      console.warn('Supabase catalog schema is not installed; showing the bundled catalog until it is configured.');
      return includeInactive ? fallback : fallback.filter(visibleCatalogItem);
    }
    throw stateError;
  }
  if (!catalogState.initialized && !productionDataOnly) {
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
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  return { success: true, id };
};

export const apiRequest = async (path, { method = 'GET', body, accessToken } = {}) => {
  let token = accessToken;
  if (!token && supabase) {
    const { data } = await supabase.auth.getSession();
    token = data.session?.access_token;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  }).catch((cause) => {
    const error = new Error('Unable to reach the admin API. Start the Express server and check its Supabase configuration.');
    error.cause = cause;
    throw error;
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      result.error ||
      (response.status >= 500
        ? `Admin API request failed (${response.status}). Check that the Express server is running and configured.`
        : `API request failed (${response.status}).`)
    );
    error.status = response.status;
    error.code = result.code;
    throw error;
  }
  return result;
};

export const createPaymentOrder = async ({ serviceId, serviceOptionId, serviceVariantIds }) =>
  apiRequest('/payments/orders', {
    method: 'POST',
    body: { serviceId, serviceOptionId, serviceVariantIds }
  });

export const verifyPayment = async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) =>
  apiRequest('/payments/verify', {
    method: 'POST',
    body: { razorpayOrderId, razorpayPaymentId, razorpaySignature }
  });

// ==========================================
// SERVICES API (Future: /api/services)
// ==========================================
export const getServices = async ({ includeInactive = false } = {}) => {
  if (supabaseConfigured) {
    const services = await getCatalogRecords(catalogTables.services, initialServices, includeInactive);
    return groupLegacyServiceVariants(services);
  }
  await delay(150);
  const services = getStorageItem(STORAGE_KEYS.SERVICES, initialServices);
  return groupLegacyServiceVariants(includeInactive ? services : services.filter(visibleCatalogItem));
};

export const getServiceById = async (id) => {
  if (supabaseConfigured) {
    const service = groupLegacyServiceVariants(
      await getCatalogRecords(catalogTables.services, initialServices)
    ).find((record) => record.id === id || record.variantIds?.includes(id));
    if (!service) throw new Error(`Service with ID ${id} not found`);
    return service;
  }
  await delay(100);
  const services = groupLegacyServiceVariants(getStorageItem(STORAGE_KEYS.SERVICES, initialServices));
  const service = services.find((s) => s.id === id || s.variantIds?.includes(id));
  if (!service) {
    throw new Error(`Service with ID ${id} not found`);
  }
  return service;
};

export const createService = async (serviceData) => {
  if (supabaseConfigured) {
    return createCatalogRecord(catalogTables.services, {
      rating: null,
      reviewsCount: 0,
      isPopular: false,
      status: 'Active',
      benefits: serviceData.benefits || [],
      included: serviceData.included || [],
      staffIds: serviceData.staffIds || [],
      ...serviceData
    });
  }
  await delay(200);
  const services = getStorageItem(STORAGE_KEYS.SERVICES, initialServices);
  const newService = {
    id: `srv-${Date.now()}`,
    rating: null,
    reviewsCount: 0,
    isPopular: false,
    status: 'Active',
    benefits: serviceData.benefits || [],
    included: serviceData.included || [],
    staffIds: serviceData.staffIds || [],
    ...serviceData
  };
  const updated = [newService, ...services];
  setStorageItem(STORAGE_KEYS.SERVICES, updated);
  return newService;
};

export const updateService = async (id, updatedFields) => {
  const service = (await getServices({ includeInactive: true })).find((item) => item.id === id);
  const legacyVariantIds = (service?.variantIds || []).filter((variantId) => variantId !== id);
  if (supabaseConfigured) {
    const updated = await updateCatalogRecord(catalogTables.services, id, updatedFields);
    await Promise.all(legacyVariantIds.map((variantId) => deleteCatalogRecord(catalogTables.services, variantId)));
    return updated;
  }
  await delay(200);
  const services = getStorageItem(STORAGE_KEYS.SERVICES, initialServices);
  const index = services.findIndex((s) => s.id === id);
  if (index === -1) throw new Error('Service not found');
  services[index] = { ...services[index], ...updatedFields };
  const updatedServices = services.filter((item) => !legacyVariantIds.includes(item.id));
  setStorageItem(STORAGE_KEYS.SERVICES, updatedServices);
  return services[index];
};

export const deleteService = async (id) => {
  const service = (await getServices({ includeInactive: true })).find((item) => item.id === id);
  const serviceIds = service?.variantIds || [id];
  if (supabaseConfigured) {
    await Promise.all(serviceIds.map((serviceId) => deleteCatalogRecord(catalogTables.services, serviceId)));
    return { success: true, id };
  }
  await delay(200);
  const services = getStorageItem(STORAGE_KEYS.SERVICES, initialServices);
  const filtered = services.filter((s) => !serviceIds.includes(s.id));
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
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profileError) throw profileError;
    if (appointmentData.customerId === null && profile.role !== 'admin') {
      throw new Error('Only admins can create unlinked walk-in appointments.');
    }
    if (appointmentData.customerId === null && !appointmentData.customerName?.trim()) {
      throw new Error('Enter the walk-in customer name.');
    }
    const requestBody = { ...appointmentData };
    if (profile.role !== 'admin' || !Object.hasOwn(appointmentData, 'customerId')) {
      delete requestBody.customerId;
    }
    return apiRequest('/appointments', {
      method: 'POST',
      body: requestBody
    });
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
      .select('id, email, full_name, phone, date_of_birth, avatar_url, address, preferences, is_vip, role')
      .eq('id', user.id)
      .single();
    if (error) throw error;
    return profileToUser(data);
  }
  await delay(150);
  const customers = getStorageItem(STORAGE_KEYS.CUSTOMERS, initialCustomers);
  const customer = customers.find((c) => c.id === customerId);
  return customer ? { ...customer, avatar: getCustomerAvatar(customer.avatar) } : initialCustomers[0];
};

export const updateCustomerProfile = async (customerId, updatedData) => {
  if (supabaseConfigured) {
    const profileUpdates = {
      ...(updatedData.name !== undefined ? { full_name: updatedData.name } : {}),
      ...(updatedData.phone !== undefined ? { phone: updatedData.phone } : {}),
      ...(updatedData.avatar !== undefined ? { avatar_url: updatedData.avatar || null } : {}),
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
      .select('id, email, full_name, phone, date_of_birth, avatar_url, address, preferences, is_vip, role')
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
        .select('id, email, full_name, phone, avatar_url, is_vip, role, created_at')
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
        avatar: getCustomerAvatar(profile.avatar_url),
        isVip: Boolean(profile.is_vip),
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
  return getStorageItem(STORAGE_KEYS.CUSTOMERS, initialCustomers).map((customer) => ({
    ...customer,
    avatar: getCustomerAvatar(customer.avatar),
    isVip: Boolean(customer.isVip),
    status: customer.status === 'VIP Customer' || customer.status === 'Bridal Elite'
      ? 'Active'
      : customer.status
  }));
};

export const createCustomer = async (customerData) => {
  if (supabaseConfigured) {
    const customer = await apiRequest('/customers', { method: 'POST', body: customerData });
    if (customerData.isVip) await setCustomerVipStatus(customer.id, true);
    return { ...customer, isVip: Boolean(customerData.isVip), invitationSent: true };
  }
  await delay(200);
  const customers = getStorageItem(STORAGE_KEYS.CUSTOMERS, initialCustomers);
  if (customers.some((customer) => customer.email.toLowerCase() === customerData.email.toLowerCase())) {
    throw new Error('A customer with this email address already exists.');
  }
  const newCustomer = {
    id: `cust-${Date.now()}`,
    name: customerData.name.trim(),
    email: customerData.email.trim(),
    phone: customerData.phone.trim(),
    avatar: '',
    isVip: Boolean(customerData.isVip),
    totalAppointments: 0,
    totalSpending: 0,
    lastVisit: 'Never',
    status: 'New Customer',
    role: 'customer'
  };
  setStorageItem(STORAGE_KEYS.CUSTOMERS, [newCustomer, ...customers]);
  return newCustomer;
};

export const setCustomerVipStatus = async (customerId, isVip) => {
  if (supabaseConfigured) {
    const { error } = await supabase.rpc('set_customer_vip_status', {
      customer_id_input: customerId,
      is_vip_input: Boolean(isVip)
    });
    if (error) throw error;
    return { id: customerId, isVip: Boolean(isVip) };
  }
  await delay(100);
  const customers = getStorageItem(STORAGE_KEYS.CUSTOMERS, initialCustomers);
  const index = customers.findIndex((customer) => customer.id === customerId);
  if (index < 0) throw new Error('Customer not found.');
  customers[index] = { ...customers[index], isVip: Boolean(isVip) };
  setStorageItem(STORAGE_KEYS.CUSTOMERS, customers);
  return customers[index];
};

export const deleteCustomer = async (customerId) => {
  if (supabaseConfigured) {
    return apiRequest(`/customers/${encodeURIComponent(customerId)}`, { method: 'DELETE' });
  }
  await delay(200);
  const customers = getStorageItem(STORAGE_KEYS.CUSTOMERS, initialCustomers);
  const customer = customers.find((record) => record.id === customerId);
  setStorageItem(STORAGE_KEYS.CUSTOMERS, customers.filter((record) => record.id !== customerId));
  if (customer) {
    const appointments = getStorageItem(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
    setStorageItem(STORAGE_KEYS.APPOINTMENTS, appointments.filter((appointment) => (
      appointment.customerId !== customerId && appointment.customerEmail !== customer.email
    )));
  }
  return { success: true, id: customerId };
};

export const getAdmins = async () => apiRequest('/customers/admins');

export const inviteAdmin = async (adminData) =>
  apiRequest('/customers/admins', { method: 'POST', body: adminData });

export const sendAdminPasswordSetup = async (adminId) =>
  apiRequest(`/customers/admins/${encodeURIComponent(adminId)}/send-password-setup`, { method: 'POST' });

export const deleteAdmin = async (adminId) =>
  apiRequest(`/customers/admins/${encodeURIComponent(adminId)}`, { method: 'DELETE' });

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
    phone: formData.phone || '',
    dob: formData.dob || '1995-01-01',
    avatar: '',
    address: '',
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
  if (supabaseConfigured) {
    const { error } = await supabase.rpc('delete_expired_salon_offers');
    if (error) throw error;
    const offers = await getCatalogRecords(catalogTables.offers, initialOffers, includeInactive);
    return filterExpiredOffers(offers);
  }
  await delay(150);
  const offers = removeExpiredLocalOffers(getStorageItem(STORAGE_KEYS.OFFERS, initialOffers));
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
  const reviews = getStorageItem(STORAGE_KEYS.REVIEWS, initialReviews);
  const customerReviews = reviews.filter((review) => !/^rev-[1-5]$/.test(review.id));
  if (customerReviews.length !== reviews.length) setStorageItem(STORAGE_KEYS.REVIEWS, customerReviews);
  return customerReviews;
};

export const addReview = async (reviewData) => {
  if (supabaseConfigured) {
    const { data, error } = await supabase.rpc('submit_customer_review', {
      appointment_id_input: reviewData.appointmentId,
      rating_input: reviewData.rating,
      comment_input: reviewData.comment
    });
    if (error) throw error;
    return data;
  }
  await delay(200);
  const reviews = getStorageItem(STORAGE_KEYS.REVIEWS, initialReviews);
  const newReview = {
    id: `rev-${Date.now()}`,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    verified: true,
    avatar: '',
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
  if (!supabaseConfigured) throw new Error('Business reports require a configured Supabase database.');
  const [{ data: appointments, error: appointmentsError }, { data: customers, error: customersError }] = await Promise.all([
    supabase.from('appointments').select('customer_id, date, status, data'),
    supabase.from('profiles').select('id').eq('role', 'customer')
  ]);
  if (appointmentsError) throw appointmentsError;
  if (customersError) throw customersError;

  const records = appointments || [];
  const completed = records.filter((appointment) => appointment.status === 'Completed');
  const todayKey = getSalonDateKey(new Date());
  const monthKey = todayKey.slice(0, 7);
  const completedValue = (appointment) => Math.max(0, Number(appointment.data?.price) || 0);
  const totalCompletedValue = completed.reduce((sum, appointment) => sum + completedValue(appointment), 0);
  const monthlyTrends = Array.from({ length: 6 }, (_, index) => {
    const [year, month] = monthKey.split('-').map(Number);
    const monthStart = new Date(Date.UTC(year, month - 1 - (5 - index), 1));
    const key = monthStart.toISOString().slice(0, 7);
    const monthAppointments = completed.filter((appointment) => appointment.date?.startsWith(key));
    return {
      month: monthStart.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }),
      completedValue: monthAppointments.reduce((sum, appointment) => sum + completedValue(appointment), 0),
      completedAppointments: monthAppointments.length
    };
  });
  const weeklyTrends = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(`${todayKey}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    const daily = records.filter((appointment) => appointment.date === key);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
      appointments: daily.length,
      completedValue: daily
        .filter((appointment) => appointment.status === 'Completed')
        .reduce((sum, appointment) => sum + completedValue(appointment), 0)
    };
  });
  const serviceTotals = new Map();
  const staffTotals = new Map();
  const completedByCustomer = new Map();
  for (const appointment of completed) {
    const price = completedValue(appointment);
    const serviceName = appointment.data?.serviceName || 'Unspecified service';
    const service = serviceTotals.get(serviceName) || { name: serviceName, bookings: 0, completedValue: 0 };
    service.bookings += 1;
    service.completedValue += price;
    serviceTotals.set(serviceName, service);
    const staffName = appointment.data?.staffName || 'Unassigned';
    const staff = staffTotals.get(staffName) || {
      name: staffName,
      role: appointment.data?.staffRole || 'Not specified',
      bookings: 0,
      completedValue: 0
    };
    staff.bookings += 1;
    staff.completedValue += price;
    staffTotals.set(staffName, staff);
    if (appointment.customer_id) {
      completedByCustomer.set(
        appointment.customer_id,
        (completedByCustomer.get(appointment.customer_id) || 0) + 1
      );
    }
  }
  const repeatCustomerCount = [...completedByCustomer.values()].filter((count) => count > 1).length;

  return {
    summary: {
      totalCompletedValue,
      monthlyCompletedValue: completed
        .filter((appointment) => appointment.date?.startsWith(monthKey))
        .reduce((sum, appointment) => sum + completedValue(appointment), 0),
      averageCompletedValue: completed.length ? totalCompletedValue / completed.length : 0,
      repeatCustomerRate: completedByCustomer.size
        ? (repeatCustomerCount / completedByCustomer.size) * 100
        : 0,
      totalAppointments: records.length,
      todayKey,
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
    staffPerformance: [...staffTotals.values()].sort((a, b) => b.completedValue - a.completedValue).slice(0, 5)
  };
};
