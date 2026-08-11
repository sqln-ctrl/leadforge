
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  CheckCircle,
} from "lucide-react";

import { leadsApi } from "../lib/api";
import ScoreBadge from "../components/leads/ScoreBadge";
import StatusBadge from "../components/leads/StatusBadge";
import Button from "../components/ui/Button";

const STATUSES = [
  "new",
  "contacted",
  "qualified",
  "closed",
];

export default function LeadDetail() {
  const { id } = useParams();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [draft, setDraft] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // --------------------------------------------------
  // Load lead
  // --------------------------------------------------

  useEffect(() => {
    async function fetchLead() {
      try {
        setLoading(true);
        setError("");

        const res = await leadsApi.get(id);

        setLead({
          ...res.data,
          notes: res.data.notes || [],
        });
      } catch (err) {
        console.error("Failed to load lead:", err);

        setError(
          err.response?.data?.detail ||
            "Couldn't load this lead."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchLead();
    }
  }, [id]);

  // --------------------------------------------------
  // Update status
  // --------------------------------------------------

  async function handleStatusChange(newStatus) {
    if (!lead || savingStatus) return;

    const previousStatus = lead.status;

    // Clear previous success message
    setSuccessMessage("");

    // Optimistic update
    setLead((prev) => ({
      ...prev,
      status: newStatus,
    }));

    setSavingStatus(true);

    try {
      const { data } = await leadsApi.updateStatus(
        id,
        newStatus
      );

      // Use backend response as the source of truth
      setLead((prev) => ({
        ...prev,
        ...data,
        notes: prev.notes || [],
      }));

      if (newStatus === "qualified") {
        setSuccessMessage(
          "Lead qualified successfully. It is now available on the Leads page."
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);

      // Revert optimistic update
      setLead((prev) => ({
        ...prev,
        status: previousStatus,
      }));

      setError(
        err.response?.data?.detail ||
          "Failed to update lead status."
      );
    } finally {
      setSavingStatus(false);
    }
  }

  // --------------------------------------------------
  // Add note
  // --------------------------------------------------

  async function addNote() {
    if (!draft.trim() || !lead || addingNote) return;

    setAddingNote(true);

    try {
      const { data: newNote } =
        await leadsApi.addNote(
          id,
          draft.trim()
        );

      setLead((prev) => ({
        ...prev,
        notes: [
          newNote,
          ...(prev.notes || []),
        ],
      }));

      setDraft("");
    } catch (err) {
      console.error("Failed to add note:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to add note."
      );
    } finally {
      setAddingNote(false);
    }
  }

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-ink-400">
          Loading lead...
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error && !lead) {
    return (
      <div className="space-y-4">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to leads
        </Link>

        <div className="rounded-xl border border-red-100 bg-red-50 p-5">
          <p className="text-sm text-red-600">
            {error || "Lead not found."}
          </p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return null;
  }

  return (
    <div className="space-y-6">

      {/* ---------------------------------------------- */}
      {/* Back */}
      {/* ---------------------------------------------- */}

      <Link
        to="/app"
        className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </Link>

      {/* ---------------------------------------------- */}
      {/* Error message */}
      {/* ---------------------------------------------- */}

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* ---------------------------------------------- */}
      {/* Success message */}
      {/* ---------------------------------------------- */}

      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-4 py-3">
          <CheckCircle className="h-4 w-4 text-green-600" />

          <p className="text-sm text-green-700">
            {successMessage}
          </p>
        </div>
      )}

      {/* ---------------------------------------------- */}
      {/* Header */}
      {/* ---------------------------------------------- */}

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">
            {lead.name}
          </h1>

          <p className="mt-1 text-sm text-ink-400">
            {lead.industry || "Uncategorized"}
            {" · "}
            {lead.location || "No location on file"}
          </p>
        </div>

        <ScoreBadge
          score={lead.score}
          className="text-sm"
        />
      </div>

      {/* ---------------------------------------------- */}
      {/* Main content */}
      {/* ---------------------------------------------- */}

      <div className="grid grid-cols-3 gap-6">

        {/* ============================================ */}
        {/* LEFT COLUMN */}
        {/* ============================================ */}

        <div className="col-span-2 space-y-6">

          {/* ------------------------------------------ */}
          {/* Notes */}
          {/* ------------------------------------------ */}

          <section className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">

            <h2 className="mb-3 text-sm font-semibold text-ink-800">
              Notes
            </h2>

            <div className="mb-3 flex gap-2">

              <input
                value={draft}
                onChange={(e) =>
                  setDraft(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addNote();
                  }
                }}
                placeholder="Add a note about this lead..."
                className="flex-1 rounded-lg border border-ink-200 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-forge-500"
              />

              <Button
                onClick={addNote}
                variant="secondary"
                disabled={
                  addingNote ||
                  !draft.trim()
                }
              >
                {addingNote
                  ? "Adding..."
                  : "Add"}
              </Button>

            </div>

            <ul className="space-y-3">

              {lead.notes?.map((note) => (
                <li
                  key={note.id}
                  className="border-l-2 border-ink-100 pl-3 text-sm"
                >
                  <p className="text-ink-700">
                    {note.text}
                  </p>

                  <p className="mt-0.5 text-xs text-ink-300">
                    {note.created_at
                      ? new Date(
                          note.created_at
                        ).toLocaleString()
                      : ""}
                  </p>
                </li>
              ))}

              {(!lead.notes ||
                lead.notes.length === 0) && (
                <p className="text-sm text-ink-300">
                  No notes yet.
                </p>
              )}

            </ul>
          </section>

          {/* ------------------------------------------ */}
          {/* Lead Information */}
          {/* ------------------------------------------ */}

          <section className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">

            <h2 className="mb-4 text-sm font-semibold text-ink-800">
              Lead Information
            </h2>

            <div className="grid grid-cols-2 gap-5">

              <Info
                label="Business"
                value={lead.name}
              />

              <Info
                label="Industry"
                value={lead.industry}
              />

              <Info
                label="Location"
                value={lead.location}
              />

              <Info
                label="Country"
                value={lead.country}
              />

              <Info
                label="Source"
                value={lead.source}
              />

              <Info
                label="Created"
                value={
                  lead.created_at
                    ? new Date(
                        lead.created_at
                      ).toLocaleDateString()
                    : null
                }
              />

            </div>
          </section>

        </div>

        {/* ============================================ */}
        {/* RIGHT COLUMN */}
        {/* ============================================ */}

        <div className="space-y-6">

          {/* ------------------------------------------ */}
          {/* Qualification / Status */}
          {/* ------------------------------------------ */}

          <section className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">

            <h2 className="mb-3 text-sm font-semibold text-ink-800">
              Lead Status
            </h2>

            <div className="mb-4">
              <StatusBadge
                status={lead.status}
              />
            </div>

            {/* Main qualification button */}
            {lead.status !== "qualified" && (
              <Button
                onClick={() =>
                  handleStatusChange(
                    "qualified"
                  )
                }
                disabled={savingStatus}
                className="mb-3 w-full"
              >
                <CheckCircle className="h-4 w-4" />

                {savingStatus
                  ? "Updating..."
                  : "Mark as Qualified"}
              </Button>
            )}

            {/* Qualified message */}
            {lead.status === "qualified" && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">
                <CheckCircle className="h-4 w-4 text-green-600" />

                <span className="text-sm font-medium text-green-700">
                  Qualified Lead
                </span>
              </div>
            )}

            {/* Status selector */}
            <select
              value={lead.status || "new"}
              onChange={(e) =>
                handleStatusChange(
                  e.target.value
                )
              }
              disabled={savingStatus}
              className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm capitalize focus:outline-none focus-visible:ring-2 focus-visible:ring-forge-500"
            >
              {STATUSES.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>

          </section>

          {/* ------------------------------------------ */}
          {/* Contact */}
          {/* ------------------------------------------ */}

          <section className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">

            <h2 className="mb-3 text-sm font-semibold text-ink-800">
              Contact
            </h2>

            <ul className="space-y-3 text-sm text-ink-600">

              {/* Email */}
              <li className="flex items-start gap-2">

                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ink-300" />

                {lead.email ? (
                  <a
                    href={`mailto:${lead.email}`}
                    className="break-all hover:text-forge-600"
                  >
                    {lead.email}
                  </a>
                ) : (
                  <span className="text-ink-300">
                    No email on file
                  </span>
                )}

              </li>

              {/* Phone */}
              <li className="flex items-start gap-2">

                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ink-300" />

                {lead.phone ? (
                  <a
                    href={`tel:${lead.phone}`}
                    className="hover:text-forge-600"
                  >
                    {lead.phone}
                  </a>
                ) : (
                  <span className="text-ink-300">
                    No phone on file
                  </span>
                )}

              </li>

              {/* Website */}
              <li className="flex items-start gap-2">

                <Globe className="mt-0.5 h-4 w-4 shrink-0 text-ink-300" />

                {lead.website ? (
                  <a
                    href={
                      lead.website.startsWith(
                        "http://"
                      ) ||
                      lead.website.startsWith(
                        "https://"
                      )
                        ? lead.website
                        : `https://${lead.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all hover:text-forge-600"
                  >
                    {lead.website}
                  </a>
                ) : (
                  <span className="text-ink-300">
                    No website
                  </span>
                )}

              </li>

            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-ink-400">
        {label}
      </p>

      <p className="mt-1 text-sm text-ink-700">
        {value || "Not available"}
      </p>
    </div>
  );
}

