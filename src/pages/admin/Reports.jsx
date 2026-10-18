import React, { useState, useEffect } from 'react';
import { getReportsData } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import {
  Download
} from '../../components/icons';

export const AdminReports = () => {
  const { addToast } = useToast();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReportsData();
        setReports(data);
      } catch (err) {
        console.error('Failed to load reports', err);
        setLoadError(err.message || 'Unable to load database reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleExportCSV = () => {
    // Generate CSV string
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Month,Completed appointment value (INR),Completed appointments\n' +
      reports.monthlyTrends.map((entry) => `${entry.month},${entry.completedValue},${entry.completedAppointments}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Her_Glow_Completed_Appointment_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Appointment report CSV generated and downloaded.', 'success');
  };

  if (loading) {
    return <Loading text="Loading appointment reports from the database..." />;
  }
  if (loadError || !reports) {
    return (
      <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        {loadError || 'Business reports are unavailable.'}
      </p>
    );
  }

  const maximumMonthValue = Math.max(1, ...reports.monthlyTrends.map((month) => month.completedValue));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-1">
            Appointment Analytics
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Business Reports & Insights
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Figures below are calculated from appointment records in the database. Completed service values are not payment records.
          </p>
        </div>

        <Button
          variant="gold"
          size="md"
          icon={Download}
          onClick={handleExportCSV}
        >
          Export CSV Report
        </Button>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-beige-200 shadow-subtle">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
            Completed Appointment Value (All Time)
          </span>
          <p className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
            ₹{reports.summary.totalCompletedValue.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-charcoal-500 mt-1 block">Based on appointments marked completed</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-beige-200 shadow-subtle">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
            Average Completed Appointment Value
          </span>
          <p className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
            ₹{Math.round(reports.summary.averageCompletedValue).toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-charcoal-500 mt-1 block">Completed appointment value per visit</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-beige-200 shadow-subtle">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
            Repeat Customer Rate
          </span>
          <p className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
            {reports.summary.repeatCustomerRate.toFixed(1)}%
          </p>
          <span className="text-[11px] text-charcoal-500 mt-1 block">Among customers with completed appointments</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-beige-200 shadow-subtle">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
            Completed Appointments
          </span>
          <p className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
            {reports.summary.completedAppointments}
          </p>
          <span className="text-[11px] text-charcoal-500 block mt-1">All time in the database</span>
        </div>
      </div>

      {/* Monthly Completed Appointment Value */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-beige-200 shadow-subtle space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-charcoal-900">
              Monthly Completed Appointment Value
            </h3>
            <p className="text-xs text-charcoal-500">Value of completed appointments in INR; not a payment ledger</p>
          </div>
        </div>

        {/* SVG Area / Line Chart with coordinates */}
        <div className="h-64 flex items-end justify-between gap-4 border-b border-beige-200 pb-4 pt-6">
          {reports.monthlyTrends.map((m, idx) => {
            const heightPct = Math.round((m.completedValue / maximumMonthValue) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group">
                <span className="text-[11px] font-mono font-bold text-charcoal-700">
                  ₹{(m.completedValue / 1000).toFixed(0)}k
                </span>
                <div
                  className="w-full max-w-[48px] bg-gradient-to-t from-charcoal-950 via-charcoal-800 to-gold-500 rounded-t-xl group-hover:brightness-110 transition-all cursor-pointer shadow-xs"
                  style={{ height: `${heightPct}%` }}
                  title={`${m.month}: ₹${m.completedValue.toLocaleString()} (${m.completedAppointments} completed appointments)`}
                />
                <span className="text-xs font-semibold text-charcoal-600 mt-1">{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Staff Leaderboard & Top Treatments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Staff Performance Table */}
        <div className="bg-white p-6 rounded-2xl border border-beige-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-charcoal-900">
              Completed Appointments by Staff
            </h3>
            <span className="text-xs text-charcoal-400">Completed appointment value</span>
          </div>

          <div className="space-y-3">
            {reports.staffPerformance.length === 0 && (
              <p className="text-sm text-charcoal-500">No completed appointments are recorded yet.</p>
            )}
            {reports.staffPerformance.map((st, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-cream-50/60 border border-beige-200/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-gold-200 text-charcoal-900 font-bold text-xs flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-charcoal-900 text-sm">{st.name}</h4>
                    <p className="text-xs text-charcoal-500">{st.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-serif font-bold text-charcoal-900 text-sm block">
                    ₹{st.completedValue.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-charcoal-500">{st.bookings} sessions</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Booked Completed Services */}
        <div className="bg-white p-6 rounded-2xl border border-beige-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-charcoal-900">
              Most Booked Completed Services
            </h3>
            <span className="text-xs text-charcoal-400">Completed visits & appointment value</span>
          </div>

          <div className="space-y-3">
            {reports.topServices.length === 0 && (
              <p className="text-sm text-charcoal-500">No completed appointments are recorded yet.</p>
            )}
            {reports.topServices.map((srv, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-beige-50/60 border border-beige-200/80 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-charcoal-900 text-sm">{srv.name}</h4>
                  <span className="text-xs text-charcoal-500">{srv.bookings} completed appointments</span>
                </div>

                <div className="text-right">
                  <span className="font-serif font-bold text-charcoal-900 text-sm block">
                    ₹{srv.completedValue.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded">
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
