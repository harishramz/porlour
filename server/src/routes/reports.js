import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { requireSupabase, supabase } from '../lib/supabase.js';

export const reportsRouter = Router();
reportsRouter.use(requireSupabase, authenticate, requireRole('admin'));

const dateKeyInSalonTimezone = (date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const part = (type) => parts.find((entry) => entry.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
};

reportsRouter.get('/', asyncHandler(async (req, res) => {
  const [{ data: appointments, error: appointmentsError }, { data: profiles, error: profilesError }] = await Promise.all([
    supabase.from('appointments').select('customer_id, date, status, data'),
    supabase.from('profiles').select('id').eq('role', 'customer')
  ]);
  if (appointmentsError) throw appointmentsError;
  if (profilesError) throw profilesError;

  const records = appointments || [];
  const completed = records.filter((appointment) => appointment.status === 'Completed');
  const todayKey = dateKeyInSalonTimezone(new Date());
  const monthKey = todayKey.slice(0, 7);
  const valueOf = (appointment) => Math.max(0, Number(appointment.data?.price) || 0);
  const totalCompletedValue = completed.reduce((sum, appointment) => sum + valueOf(appointment), 0);
  const [year, month] = monthKey.split('-').map(Number);
  const monthKeys = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(Date.UTC(year, month - 1 - (5 - index), 1));
    const key = date.toISOString().slice(0, 7);
    return {
      key,
      month: date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
    };
  });
  const monthlyTrends = monthKeys.map(({ key, month }) => {
    const monthAppointments = completed.filter((appointment) => appointment.date?.startsWith(key));
    return {
      month,
      completedValue: monthAppointments.reduce((sum, appointment) => sum + valueOf(appointment), 0),
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
        .reduce((sum, appointment) => sum + valueOf(appointment), 0)
    };
  });

  const serviceTotals = new Map();
  const staffTotals = new Map();
  const completedByCustomer = new Map();
  for (const appointment of completed) {
    const value = valueOf(appointment);
    const serviceName = appointment.data?.serviceName || 'Unspecified service';
    const service = serviceTotals.get(serviceName) || { name: serviceName, bookings: 0, completedValue: 0 };
    service.bookings += 1;
    service.completedValue += value;
    serviceTotals.set(serviceName, service);

    const staffName = appointment.data?.staffName || 'Unassigned';
    const staff = staffTotals.get(staffName) || {
      name: staffName,
      role: appointment.data?.staffRole || 'Not specified',
      bookings: 0,
      completedValue: 0
    };
    staff.bookings += 1;
    staff.completedValue += value;
    staffTotals.set(staffName, staff);
    if (appointment.customer_id) {
      completedByCustomer.set(
        appointment.customer_id,
        (completedByCustomer.get(appointment.customer_id) || 0) + 1
      );
    }
  }

  const repeatCustomers = [...completedByCustomer.values()].filter((count) => count > 1).length;
  res.json({
    summary: {
      totalCompletedValue,
      monthlyCompletedValue: completed
        .filter((appointment) => appointment.date?.startsWith(monthKey))
        .reduce((sum, appointment) => sum + valueOf(appointment), 0),
      averageCompletedValue: completed.length ? totalCompletedValue / completed.length : 0,
      repeatCustomerRate: completedByCustomer.size
        ? (repeatCustomers / completedByCustomer.size) * 100
        : 0,
      totalAppointments: records.length,
      todayKey,
      todayAppointments: records.filter((appointment) => appointment.date === todayKey).length,
      pendingAppointments: records.filter((appointment) => appointment.status === 'Pending').length,
      confirmedAppointments: records.filter((appointment) => appointment.status === 'Confirmed').length,
      completedAppointments: completed.length,
      cancelledAppointments: records.filter((appointment) => appointment.status === 'Cancelled').length,
      totalCustomers: profiles?.length || 0
    },
    weeklyTrends,
    monthlyTrends,
    topServices: [...serviceTotals.values()].sort((a, b) => b.bookings - a.bookings).slice(0, 5),
    staffPerformance: [...staffTotals.values()].sort((a, b) => b.completedValue - a.completedValue).slice(0, 5)
  });
}));
