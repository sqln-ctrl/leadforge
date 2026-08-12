import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Download, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";

import { leadsApi } from "../lib/api";
import ScoreBadge from "../components/leads/ScoreBadge";
import Button from "../components/ui/Button";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // --------------------------------------------------
  // Load leads
  // --------------------------------------------------

  useEffect(() => {
    const loadLeads = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await leadsApi.list();
        setLeads(res.data);
      } catch (err) {
        console.error("Failed to load leads:", err);

        setError(
          err.response?.data?.detail ||
            "Couldn't load leads. Is the backend running?"
        );
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, []);

  // --------------------------------------------------
  // Automatically qualified leads
  // --------------------------------------------------

  const qualifiedLeads = useMemo(() => {
    return leads.filter(
      (lead) => lead.qualification === "qualified"
    );
  }, [leads]);

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return qualifiedLeads;
    }

    return qualifiedLeads.filter((lead) =>
      lead.name?.toLowerCase().includes(search)
    );
  }, [query, qualifiedLeads]);

  // --------------------------------------------------
  // Delete lead
  // --------------------------------------------------

  async function handleDelete(lead) {
    if (deletingId) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${lead.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(lead.id);
      setError("");

      await leadsApi.delete(lead.id);

      // Remove from local state immediately
      setLeads((prev) =>
        prev.filter((item) => item.id !== lead.id)
      );
    } catch (err) {
      console.error("Failed to delete lead:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to delete lead."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // --------------------------------------------------
  // Export to Excel
  // --------------------------------------------------

  function handleExport() {
    if (qualifiedLeads.length === 0) {
      return;
    }

    const exportData = qualifiedLeads.map((lead) => ({
      "Business Name": lead.name || "",
      Industry: lead.industry || "",
      Location: lead.location || "",
      Website: lead.website || "",
      Phone: lead.phone || "",
      Email: lead.email || "",
      Source: lead.source || "",
      "Lead Score": lead.lead_score ?? 0,
      Qualification: lead.qualification || "",
      Status: lead.status || "",
      "Created Date": lead.created_at
        ? new Date(lead.created_at).toLocaleDateString()
        : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    worksheet["!cols"] = [
      { wch: 28 },
      { wch: 20 },
      { wch: 25 },
      { wch: 35 },
      { wch: 18 },
      { wch: 30 },
      { wch: 15 },
      { wch: 12 },
      { wch: 18 },
      { wch: 15 },
      { wch: 15 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Qualified Leads"
    );

    const date = new Date()
      .toISOString()
      .split("T")[0];

    const filename = `leadforge-qualified-leads-${date}.xlsx`;

    XLSX.writeFile(workbook, filename);
  }

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-ink-400">
          Loading leads...
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error && leads.length === 0) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}

      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">
            Qualified Leads
          </h1>

          <p className="mt-1 text-sm text-ink-400">
            {qualifiedLeads.length} qualified lead
            {qualifiedLeads.length === 1 ? "" : "s"} ready
            for outreach.
          </p>
        </div>

        {/* Export */}

        <Button
          onClick={handleExport}
          variant="secondary"
          disabled={qualifiedLeads.length === 0}
        >
          <Download className="h-4 w-4" />
          Export to Excel
        </Button>
      </header>

      {/* Error */}

      {error && (
        <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

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
              <th className="px-5 py-3 font-medium">
                Business
              </th>

              <th className="px-5 py-3 font-medium">
                Industry
              </th>

              <th className="px-5 py-3 font-medium">
                Source
              </th>

              <th className="px-5 py-3 font-medium">
                Qualification
              </th>

              <th className="px-5 py-3 font-medium">
                Score
              </th>

              <th className="w-16 px-3 py-3 text-center font-medium">
                {/* Delete column */}
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
                    {lead.location ||
                      "No location on file"}
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

                {/* Qualification */}

                <td className="px-5 py-3">
                  <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium capitalize text-green-700">
                    {(lead.qualification ||
                      "qualified"
                    ).replaceAll("_", " ")}
                  </span>
                </td>

                {/* Score */}

                <td className="px-5 py-3">
                  <ScoreBadge
                    score={lead.lead_score ?? 0}
                  />
                </td>

                {/* Delete */}

                <td className="px-3 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleDelete(lead)}
                    disabled={deletingId === lead.id}
                    title="Delete lead"
                    aria-label={`Delete ${lead.name}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-300 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}

            {/* Empty State */}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-sm text-ink-400"
                >
                  {qualifiedLeads.length === 0
                    ? "No automatically qualified leads yet. Run a discovery search to find businesses."
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