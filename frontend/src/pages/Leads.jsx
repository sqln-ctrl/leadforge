import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { leadsApi } from "../lib/api";
import ScoreBadge from "../components/leads/ScoreBadge";
import StatusBadge from "../components/leads/StatusBadge";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    leadsApi
      .list()
      .then((res) => setLeads(res.data))
      .catch((err) => {
        console.error(err);
        setError("Couldn't load leads. Is the backend running?");
      })
      .finally(() => setLoading(false));
  }, []);

  // This page is scoped to qualified leads only -- freshly discovered
  // businesses live on the Discovery page until someone marks them
  // "qualified" from the lead detail view.
const isQualified = (lead) => Boolean(lead.phone || lead.email || lead.website);
const qualifiedLeads = useMemo(() => leads.filter(isQualified), [leads]);

  const filtered = useMemo(() => {
    return qualifiedLeads.filter((l) => l.name.toLowerCase().includes(query.toLowerCase()));
  }, [query, qualifiedLeads]);

  if (loading) {
    return <p className="text-sm text-ink-400">Loading leads...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Leads</h1>
        <p className="mt-1 text-sm text-ink-400">
          {qualifiedLeads.length} qualified lead{qualifiedLeads.length === 1 ? "" : "s"} ready for outreach.
        </p>
      </header>

      <div className="mb-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search qualified leads by name..."
            className="w-full rounded-lg border border-ink-200 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-forge-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-100 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
            <tr>
              <th className="px-5 py-3 font-medium">Business</th>
              <th className="px-5 py-3 font-medium">Industry</th>
              <th className="px-5 py-3 font-medium">Source</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {filtered.map((lead) => (
              <tr key={lead.id} className="hover:bg-ink-50/60">
                <td className="px-5 py-3">
                  <Link to={`/app/leads/${lead.id}`} className="font-medium text-ink-800 hover:text-forge-600">
                    {lead.name}
                  </Link>
                  <p className="text-xs text-ink-400">{lead.location || "No location on file"}</p>
                </td>
                <td className="px-5 py-3 text-ink-500">{lead.industry || "--"}</td>
                <td className="px-5 py-3 text-ink-500 capitalize">{lead.source || "manual"}</td>
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
                  {qualifiedLeads.length === 0
                    ? 'No qualified leads yet -- mark a discovered business as "Qualified" from its detail page.'
                    : "No qualified leads match your search."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}