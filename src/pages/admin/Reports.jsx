import React, { useState, useEffect } from 'react';
import { getReportsData } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import {
  BarChart2,
  Download,
  TrendingUp,
  DollarSign,
  Users,
  Award,
  Sparkles
} from '../../components/icons';

export const AdminReports = () => {
  const { addToast } = useToast();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReportsData();
        setReports(data);
      } catch (err) {
        console.error('Failed to load reports', err);
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
      'Month,Revenue (INR),Bookings\n' +
      reports.monthlyTrends.map((e) => `${e.month},${e.revenue},${e.bookings}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Aura_Luxe_Financial_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Financial report CSV generated and downloaded.', 'success');
  };

  if (loading || !reports) {
    return <Loading text="Synthesizing business analytics & financial ledger..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold block mb-1">
            Financial Ledger & Analytics
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Business Reports & Insights
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Evaluate parlour revenue growth, staff commissions, and operational performance.
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
            Gross Revenue (YTD)
          </span>
          <p className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
            ₹{reports.summary.totalRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp size={12} /> +22.4% YoY growth
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-beige-200 shadow-subtle">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
            Avg. Ticket Value
          </span>
          <p className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
            ₹2,850
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp size={12} /> Boosted by bridal packages
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-beige-200 shadow-subtle">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
            Client Retention
          </span>
          <p className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
            78.4%
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            Industry benchmark: 60%
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-beige-200 shadow-subtle">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
            Completed Rituals
          </span>
          <p className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
            {reports.summary.completedAppointments}
          </p>
          <span className="text-[11px] text-charcoal-400 block mt-1">98.2% positive rating</span>
        </div>
      </div>

      {/* Monthly Revenue Progression Chart */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-beige-200 shadow-subtle space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-charcoal-900">
              Monthly Revenue Progression (2026)
            </h3>
            <p className="text-xs text-charcoal-500">Trailing 6-month fiscal trajectory in INR</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Peak Month: October (Projected)
          </span>
        </div>

        {/* SVG Area / Line Chart with coordinates */}
        <div className="h-64 flex items-end justify-between gap-4 border-b border-beige-200 pb-4 pt-6">
          {reports.monthlyTrends.map((m, idx) => {
            const max = 110000;
            const heightPct = Math.round((m.revenue / max) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group">
                <span className="text-[11px] font-mono font-bold text-charcoal-700">
                  ₹{(m.revenue / 1000).toFixed(0)}k
                </span>
                <div
                  className="w-full max-w-[48px] bg-gradient-to-t from-charcoal-950 via-charcoal-800 to-gold-500 rounded-t-xl group-hover:brightness-110 transition-all cursor-pointer shadow-xs"
                  style={{ height: `${heightPct}%` }}
                  title={`${m.month}: ₹${m.revenue.toLocaleString()} (${m.bookings} bookings)`}
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
              Staff Performance Ranking
            </h3>
            <span className="text-xs text-charcoal-400">By Gross Contribution</span>
          </div>

          <div className="space-y-3">
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
                    <p className="text-xs text-charcoal-500">{st.role} • ★ {st.rating}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-serif font-bold text-charcoal-900 text-sm block">
                    ₹{st.revenue.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-charcoal-500">{st.bookings} sessions</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highest Margin Packages */}
        <div className="bg-white p-6 rounded-2xl border border-beige-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-charcoal-900">
              High Margin Services
            </h3>
            <span className="text-xs text-charcoal-400">Volume & Revenue</span>
          </div>

          <div className="space-y-3">
            {reports.topServices.map((srv, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-beige-50/60 border border-beige-200/80 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-charcoal-900 text-sm">{srv.name}</h4>
                  <span className="text-xs text-charcoal-500">{srv.bookings} total reservations</span>
                </div>

                <div className="text-right">
                  <span className="font-serif font-bold text-charcoal-900 text-sm block">
                    ₹{srv.revenue.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded">
                    High Demand
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
