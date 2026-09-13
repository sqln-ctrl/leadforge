import { useEffect, useMemo, useState } from "react";
import { Filter, Search, Trash2 } from "lucide-react";
import clsx from "clsx";

import { leadsApi } from "../lib/api";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "closed", label: "Closed" },
];

const STATUS_ROW_STYLES = {
  contacted: "bg-emerald-50/70 hover:!bg-emerald-50",
  closed: "bg-red-50/70 hover:!bg-red-50",
};

const STATUS_SELECT_STYLES = {
  contacted: "border-emerald-200 bg-emerald-50 text-emerald-700",
  closed: "border-red-200 bg-red-50 text-red-700",
};

export default function Crm() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function loadBusinesses() {
      try {
        const { data } = await leadsApi.list();
        setBusinesses(data);
      } catch (err) {
        setError(err.response?.data?.detail || "Could not load CRM records.");
      } finally {
        setLoading(false);
      }
    }
    loadBusinesses();
  }, []);

  const filteredBusinesses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return businesses.filter((business) => {
      const matchesQuery = !normalizedQuery || [business.name, business.industry, business.location]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery));
      return matchesQuery && (statusFilter === "all" || business.status === statusFilter);
    });
  }, [businesses, query, statusFilter]);

  async function updateStatus(business, status) {
    if (status === business.status) return;
    try {
      setUpdatingId(business.id);
      setError("");
      const { data } = await leadsApi.updateStatus(business.id, status);
      setBusinesses((current) => current.map((item) => (item.id === business.id ? data : item)));
    } catch (err) {
      setError(err.response?.data?.detail || "Could not update the lead status.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteBusiness(business) {
    if (deletingId || !window.confirm(`Delete "${business.name}" from the CRM?`)) return;

    try {
      setDeletingId(business.id);
      setError("");
      await leadsApi.delete(business.id);
      setBusinesses((current) => current.filter((item) => item.id !== business.id));
    } catch (err) {
      setError(err.response?.data?.detail || "Could not delete the CRM record.");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <p className="py-12 text-center text-sm text-ink-400">Loading CRM records...</p>;

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink-900">CRM</h1>
        <p className="mt-1 text-sm text-ink-400">Manage discovered businesses and move them through your sales pipeline.</p>
      </header>

      {error && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_12rem]">
        <label className="relative block">
          <span className="sr-only">Search CRM</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search businesses, industries, or locations..." className="w-full rounded-lg border border-ink-200 bg-white py-2 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-300" />
        </label>
        <label className="relative block">
          <span className="sr-only">Filter by status</span>
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full appearance-none rounded-lg border border-ink-200 bg-white py-2 pl-9 pr-3 text-sm text-ink-700">
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
          </select>
        </label>
      </div>

      <div className="overflow-x-auto rounded-xl border border-ink-100 bg-white shadow-card">
        <table className="min-w-[800px] w-full text-left text-sm">
          <thead className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400"><tr>
            <th className="px-5 py-3 font-medium">Business</th><th className="px-5 py-3 font-medium">Contact</th><th className="px-5 py-3 font-medium">Industry</th><th className="px-5 py-3 font-medium">Score</th><th className="px-5 py-3 font-medium">Pipeline status</th><th className="w-14 px-3 py-3" aria-label="Actions" />
          </tr></thead>
          <tbody className="divide-y divide-ink-50">
            {filteredBusinesses.map((business) => (
              <tr
                key={business.id}
                className={clsx("hover:bg-ink-50/60", STATUS_ROW_STYLES[business.status])}
              >
                <td className="px-5 py-3"><p className="font-medium text-ink-800">{business.name}</p><p className="mt-0.5 text-xs text-ink-400">{business.location || "No location"}</p></td>
                <td className="px-5 py-3 text-ink-500"><p>{business.email || business.phone || "No contact details"}</p>{business.website && <a href={business.website} target="_blank" rel="noreferrer" className="mt-0.5 block text-xs text-forge-600 hover:underline">Website</a>}</td>
                <td className="px-5 py-3 text-ink-500">{business.industry || "--"}</td>
                <td className="px-5 py-3 font-medium text-ink-700">{business.lead_score ?? 0}</td>
                <td className="px-5 py-3"><select value={business.status} disabled={updatingId === business.id} onChange={(event) => updateStatus(business, event.target.value)} className={clsx("rounded-lg border border-ink-200 bg-white px-2.5 py-1.5 text-xs font-medium text-ink-700 disabled:opacity-50", STATUS_SELECT_STYLES[business.status])}>
                  {STATUS_OPTIONS.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                </select></td>
                <td className="px-3 py-3 text-center"><button type="button" onClick={() => deleteBusiness(business)} disabled={deletingId === business.id} title="Delete CRM record" aria-label={`Delete ${business.name}`} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-300 transition hover:bg-red-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"><Trash2 className="h-4 w-4" /></button></td>
              </tr>
            ))}
            {!filteredBusinesses.length && <tr><td colSpan="6" className="px-5 py-12 text-center text-sm text-ink-400">No CRM records match your filters.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
