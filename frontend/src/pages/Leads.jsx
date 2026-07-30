import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { mockLeads, STATUSES } from "../lib/mockData";
import ScoreBadge from "../components/leads/ScoreBadge";
import StatusBadge from "../components/leads/StatusBadge";

export default function Leads() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    return mockLeads
      .filter((l) => statusFilter === "All" || l.status === statusFilter)
      .filter((l) => l.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.score - a.score);
  }, [query, statusFilter]);

  const avgScore = Math.round(mockLeads.reduce((sum, l) => sum + l.score, 0) / mockLeads.length);
  const hotCount = mockLeads.filter((l) => l.score >= 80).length;

  return (
    <div>
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Leads</h1>
          <p className="mt-1 text-sm text-ink-400">Businesses discovered, scored, and ranked by opportunity.</p>
        </div>
      </header>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Total leads" value={mockLeads.length} />
        <StatCard label="Avg. score" value={avgScore} />
        <StatCard label="Hot leads" value={hotCount} accent />
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads by name..."
            className="w-full rounded-lg border border-ink-200 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-forge-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-forge-500"
        >
          <option>All</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-100 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
            <tr>
              <th className="px-5 py-3 font-medium">Business</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Why it's a lead</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {filtered.map((lead) => (
              <tr key={lead.id} className="hover:bg-ink-50/60">
                <td className="px-5 py-3">
                  <Link to={`/leads/${lead.id}`} className="font-medium text-ink-800 hover:text-forge-600">
                    {lead.name}
                  </Link>
                  <p className="text-xs text-ink-400">{lead.city}</p>
                </td>
                <td className="px-5 py-3 text-ink-500">{lead.category}</td>
                <td className="px-5 py-3 text-ink-500">{lead.reason}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-5 py-3">
                  <ScoreBadge score={lead.score} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-ink-400">
                  No leads match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-ink-300">
        Showing placeholder data. This list will connect to <code className="font-mono">/businesses</code> once
        Phase 3 (Lead Management) endpoints are built on the backend.
      </p>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-4 shadow-card">
      <p className="text-xs text-ink-400">{label}</p>
      <p className={`mt-1 font-display text-2xl font-semibold ${accent ? "text-forge-600" : "text-ink-900"}`}>
        {value}
      </p>
    </div>
  );
}
