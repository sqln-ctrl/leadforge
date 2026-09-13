import { useEffect, useMemo, useState } from "react";
import { BarChart3, Building2, CircleGauge, Users } from "lucide-react";

import { leadsApi } from "../lib/api";

const STATUS_META = {
  new: { label: "New", barClass: "bg-ink-400" },
  contacted: { label: "Contacted", barClass: "bg-emerald-500" },
  qualified: { label: "Qualified", barClass: "bg-forge-500" },
  closed: { label: "Closed", barClass: "bg-red-500" },
};

function MetricCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-400">{label}</p>
          <p className="mt-2 font-display text-3xl font-semibold text-ink-900">{value}</p>
        </div>
        <div className="rounded-lg bg-forge-50 p-2.5 text-forge-600"><Icon className="h-5 w-5" /></div>
      </div>
      <p className="mt-3 text-xs text-ink-400">{detail}</p>
    </div>
  );
}

export default function Analytics() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const { data } = await leadsApi.list();
        setBusinesses(data);
      } catch (err) {
        setError(err.response?.data?.detail || "Could not load CRM analytics.");
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const metrics = useMemo(() => {
    const statusCounts = Object.keys(STATUS_META).reduce(
      (counts, status) => ({ ...counts, [status]: 0 }),
      {}
    );
    const industries = {};
    businesses.forEach((business) => {
      statusCounts[business.status] = (statusCounts[business.status] || 0) + 1;
      const industry = business.industry || "Uncategorized";
      industries[industry] = (industries[industry] || 0) + 1;
    });
    const totalScore = businesses.reduce((sum, business) => sum + (business.lead_score || 0), 0);
    const contactable = businesses.filter((business) => business.email || business.phone).length;
    const withWebsite = businesses.filter((business) => business.website).length;
    return {
      statusCounts,
      averageScore: businesses.length ? Math.round(totalScore / businesses.length) : 0,
      contactable,
      withWebsite,
      industries: Object.entries(industries).sort(([, left], [, right]) => right - left).slice(0, 5),
    };
  }, [businesses]);

  if (loading) return <p className="py-12 text-center text-sm text-ink-400">Loading CRM analytics...</p>;
  if (error) return <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</p>;

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Analytics</h1>
        <p className="mt-1 text-sm text-ink-400">A live view of your discovery and CRM pipeline.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Building2} label="Total businesses" value={businesses.length} detail="All discovered businesses" />
        <MetricCard icon={Users} label="Contactable leads" value={metrics.contactable} detail="Have an email or phone number" />
        <MetricCard icon={CircleGauge} label="Average lead score" value={metrics.averageScore} detail="Across all CRM records" />
        <MetricCard icon={BarChart3} label="Qualified leads" value={metrics.statusCounts.qualified} detail="Ready for outreach" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold text-ink-900">Pipeline status</h2>
          <div className="mt-5 space-y-4">
            {Object.entries(STATUS_META).map(([status, meta]) => {
              const count = metrics.statusCounts[status] || 0;
              const share = businesses.length ? Math.round((count / businesses.length) * 100) : 0;
              return (
                <div key={status}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-ink-600">{meta.label}</span>
                    <span className="font-medium text-ink-800">{count} <span className="font-normal text-ink-400">({share}%)</span></span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-ink-100"><div className={`h-full rounded-full ${meta.barClass}`} style={{ width: `${share}%` }} /></div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold text-ink-900">Lead data coverage</h2>
          <div className="mt-5 space-y-5">
            {[["Contact details", metrics.contactable], ["Website available", metrics.withWebsite]].map(([label, count]) => {
              const share = businesses.length ? Math.round((count / businesses.length) * 100) : 0;
              return (
                <div key={label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-ink-600">{label}</span>
                    <span className="font-medium text-ink-800">{count} <span className="font-normal text-ink-400">({share}%)</span></span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-ink-100"><div className="h-full rounded-full bg-ember-cold" style={{ width: `${share}%` }} /></div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-ink-100 bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold text-ink-900">Top industries</h2>
        {metrics.industries.length ? (
          <div className="mt-4 flex flex-wrap gap-3">
            {metrics.industries.map(([industry, count]) => (
              <div key={industry} className="rounded-lg bg-ink-50 px-4 py-3">
                <p className="text-sm font-medium text-ink-800">{industry}</p>
                <p className="mt-0.5 text-xs text-ink-400">{count} business{count === 1 ? "" : "es"}</p>
              </div>
            ))}
          </div>
        ) : <p className="mt-4 text-sm text-ink-400">Run discovery to populate your analytics.</p>}
      </section>
    </div>
  );
}
