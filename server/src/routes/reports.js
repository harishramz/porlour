import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { requireSupabase, supabase } from '../lib/supabase.js';

export const reportsRouter = Router();
reportsRouter.use(requireSupabase, authenticate, requireRole('admin'));

reportsRouter.get('/', asyncHandler(async (req, res) => {
  const [{ data: appointments, error: appointmentsError }, { data: profiles, error: profilesError }] = await Promise.all([
    supabase.from('appointments').select('customer_id, date, status, data'),
    supabase.from('profiles').select('id').eq('role', 'customer')
  ]);
  if (appointmentsError) throw appointmentsError;
  if (profilesError) throw profilesError;

  const records = appointments || [];
  const completed = records.filter((appointment) => appointment.status === 'Completed');
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  const monthKey = todayKey.slice(0, 7);
  const monthKeys = Array.from({ length: 6 }, (_, index) => {
    const month = new Date(today.getFullYear(), today.getMonth() - 5 + index, 1);
    return {
      key: `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`,
      month: month.toLocaleString('en-US', { month: 'short' })
    };
  });
  const monthlyTrends = monthKeys.map(({ key, month }) => {
    const monthAppointments = records.filter((appointment) => appointment.date?.startsWith(key));
    return {
      month,
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

  const currentMonthAppointments = records.filter((appointment) => appointment.date?.startsWith(monthKey));
  res.json({
    summary: {
      totalRevenue: completed.reduce((sum, appointment) => sum + Number(appointment.data.price || 0), 0),
      monthlyRevenue: currentMonthAppointments
        .filter((appointment) => appointment.status === 'Completed')
        .reduce((sum, appointment) => sum + Number(appointment.data.price || 0), 0),
      totalAppointments: records.length,
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
    staffPerformance: [...staffTotals.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  });
}));
