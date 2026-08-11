
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
    const loadLeads = async () => {
      try {
        const res = await leadsApi.list();
        setLeads(res.data);
      } catch (err) {
        console.error("Failed to load leads:", err);
        setError("Couldn't load leads. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, []);

  // Only leads explicitly marked as "qualified"
  // appear on the Leads page.
  const qualifiedLeads = useMemo(() => {
    return leads.filter((lead) => lead.status === "qualified");
  }, [leads]);

  // Search qualified leads by business name
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return qualifiedLeads;
    }

    return qualifiedLeads.filter((lead) =>
      lead.name?.toLowerCase().includes(search)
    );
  }, [query, qualifiedLeads]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-ink-400">Loading leads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          Qualified Leads
        </h1>

        <p className="mt-1 text-sm text-ink-400">
          {qualifiedLeads.length} qualified lead
          {qualifiedLeads.length === 1 ? "" : "s"} ready for outreach.
        </p>
      </header>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search qualified leads by name..."
            className="w-full rounded-lg border border-ink-200 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-forge-500"
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="overflow-hidden rounded-xl border border-ink-100 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
            <tr>
              <th className="px-5 py-3 font-medium">Business</th>

              <th className="px-5 py-3 font-medium">
                Industry
              </th>

              <th className="px-5 py-3 font-medium">
                Source
              </th>

              <th className="px-5 py-3 font-medium">
                Status
              </th>

              <th className="px-5 py-3 font-medium">
                Score
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-ink-50">
            {filtered.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-ink-50/60"
              >
                {/* Business */}
                <td className="px-5 py-3">
                  <Link
                    to={`/app/leads/${lead.id}`}
                    className="font-medium text-ink-800 hover:text-forge-600"
                  >
                    {lead.name}
                  </Link>

                  <p className="text-xs text-ink-400">
                    {lead.location || "No location on file"}
                  </p>
                </td>

                {/* Industry */}
                <td className="px-5 py-3 text-ink-500">
                  {lead.industry || "--"}
                </td>

                {/* Source */}
                <td className="px-5 py-3 text-ink-500 capitalize">
                  {lead.source || "manual"}
                </td>

                {/* Status */}
                <td className="px-5 py-3">
                  <StatusBadge status={lead.status} />
                </td>

                {/* Score */}
                <td className="px-5 py-3">
                  <ScoreBadge score={lead.score} />
                </td>
              </tr>
            ))}

            {/* Empty State */}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-sm text-ink-400"
                >
                  {qualifiedLeads.length === 0
                    ? 'No qualified leads yet. Go to Discovery, open a business, and mark it as "Qualified".'
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

