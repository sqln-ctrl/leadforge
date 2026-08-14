import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Sparkles,
} from "lucide-react";

import { aiApi, leadsApi } from "../lib/api";
import ScoreBadge from "../components/leads/ScoreBadge";
import StatusBadge from "../components/leads/StatusBadge";
import Button from "../components/ui/Button";

export default function LeadDetail() {
  const { id } = useParams();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [draft, setDraft] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  // AI Analysis state
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [aiError, setAiError] = useState("");

  const location = useLocation();

  const backTo = location.state?.from || "/app";

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
  // Add note
  // --------------------------------------------------

  async function addNote() {
    if (!draft.trim() || !lead || addingNote) return;

    setAddingNote(true);

    try {
      const { data: newNote } = await leadsApi.addNote(
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
  // Analyze lead with Gemini
  // --------------------------------------------------

  async function analyzeWithAI() {
    if (!lead || analyzingAI) return;

    const qualifiedLeadId =
      lead.qualified_lead_id;

    if (!qualifiedLeadId) {
      setAiError(
        "This lead does not have a qualified lead record."
      );
      return;
    }

    try {
      setAnalyzingAI(true);
      setAiError("");

      const { data } = await aiApi.analyze(
        qualifiedLeadId
      );

      setAiAnalysis(
        data.ai_analysis || null
      );
    } catch (err) {
      console.error(
        "Failed to analyze lead with AI:",
        err
      );

      setAiError(
        err.response?.data?.detail ||
          "Failed to analyze this lead with AI."
      );
    } finally {
      setAnalyzingAI(false);
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
          to={backTo}
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

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="space-y-6">

      {/* Back */}

      <Link
        to={backTo}
        className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </Link>

      {/* Error message */}

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* Header */}

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
          score={lead.lead_score ?? 0}
          className="text-sm"
        />
      </div>

      {/* Main content */}

      <div className="grid grid-cols-3 gap-6">

        {/* =========================================
            LEFT COLUMN
        ========================================== */}

        <div className="col-span-2 space-y-6">

          {/* Notes */}

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

          {/* Lead Information */}

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

        {/* =========================================
            RIGHT COLUMN
        ========================================== */}

        <div className="space-y-6">

          {/* =======================================
              AI ANALYSIS
          ======================================== */}

          <section className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">

            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forge-50">
                <Sparkles className="h-4 w-4 text-forge-600" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-ink-800">
                  AI Analysis
                </h2>

                <p className="mt-1 text-xs text-ink-400">
                  Gemini analysis for this qualified lead.
                </p>
              </div>

            </div>

            {/* Analyze button */}

            {!aiAnalysis && !analyzingAI && (
              <div className="mt-4">

                <Button
                  onClick={analyzeWithAI}
                  disabled={
                    lead.qualification !==
                    "qualified"
                  }
                  className="w-full"
                >
                  <Sparkles className="mr-2 h-4 w-4" />

                  Analyze with AI
                </Button>

                {lead.qualification !==
                  "qualified" && (
                  <p className="mt-2 text-xs text-ink-400">
                    Only qualified leads can be analyzed.
                  </p>
                )}

                {aiError && (
                  <p className="mt-3 text-xs text-red-500">
                    {aiError}
                  </p>
                )}

              </div>
            )}

            {/* Loading */}

            {analyzingAI && (
              <div className="mt-4 rounded-lg bg-ink-50 px-3 py-4">

                <div className="flex items-center gap-2">

                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink-200 border-t-forge-500" />

                  <p className="text-sm text-ink-600">
                    Analyzing lead...
                  </p>

                </div>

                <p className="mt-2 text-xs text-ink-400">
                  Gemini is analyzing the qualified lead.
                </p>

              </div>
            )}

            {/* Error */}

            {!analyzingAI &&
              aiError &&
              !aiAnalysis && (
                <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3">

                  <p className="text-xs text-red-600">
                    {aiError}
                  </p>

                </div>
              )}

            {/* AI Result */}

            {aiAnalysis && !analyzingAI && (
              <div className="mt-5 space-y-5">

                {/* Score + Priority */}

                <div className="grid grid-cols-2 gap-3">

                  <div className="rounded-lg bg-ink-50 p-3">

                    <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                      AI Score
                    </p>

                    <p className="mt-1 text-xl font-semibold text-ink-900">
                      {aiAnalysis.score ?? 0}

                      <span className="text-sm font-normal text-ink-400">
                        {" "}/ 100
                      </span>
                    </p>

                  </div>

                  <div className="rounded-lg bg-ink-50 p-3">

                    <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                      Priority
                    </p>

                    <p className="mt-1 text-sm font-semibold uppercase text-ink-800">
                      {aiAnalysis.priority ||
                        "N/A"}
                    </p>

                  </div>

                </div>

                {/* Summary */}

                {aiAnalysis.summary && (
                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                      Summary
                    </p>

                    <p className="mt-1 text-sm leading-6 text-ink-600">
                      {aiAnalysis.summary}
                    </p>

                  </div>
                )}

                {/* Opportunities */}

                {aiAnalysis.opportunities?.length >
                  0 && (
                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                      Opportunities
                    </p>

                    <ul className="mt-2 space-y-2">

                      {aiAnalysis.opportunities.map(
                        (opportunity, index) => (
                          <li
                            key={index}
                            className="flex gap-2 text-sm text-ink-600"
                          >
                            <span className="text-forge-500">
                              •
                            </span>

                            <span>
                              {opportunity}
                            </span>
                          </li>
                        )
                      )}

                    </ul>
                  </div>
                )}

                {/* Recommended Services */}

                {aiAnalysis
                  .recommended_services
                  ?.length > 0 && (
                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                      Recommended Services
                    </p>

                    <ul className="mt-2 space-y-2">

                      {aiAnalysis.recommended_services.map(
                        (service, index) => (
                          <li
                            key={index}
                            className="flex gap-2 text-sm text-ink-600"
                          >
                            <span className="text-forge-500">
                              •
                            </span>

                            <span>
                              {service}
                            </span>
                          </li>
                        )
                      )}

                    </ul>
                  </div>
                )}

                {/* Outreach Angle */}

                {aiAnalysis.outreach_angle && (
                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                      Outreach Angle
                    </p>

                    <div className="mt-2 rounded-lg bg-ink-50 p-3">

                      <p className="text-sm leading-6 text-ink-600">
                        {aiAnalysis.outreach_angle}
                      </p>

                    </div>

                  </div>
                )}

                {/* Model */}

                {aiAnalysis.model && (
                  <p className="pt-1 text-xs text-ink-300">
                    Powered by {aiAnalysis.model}
                  </p>
                )}

              </div>
            )}

          </section>

          {/* =======================================
              AUTOMATIC QUALIFICATION
          ======================================== */}

          <section className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">

            <h2 className="mb-3 text-sm font-semibold text-ink-800">
              Qualification
            </h2>

            <div className="mb-4">
              <ScoreBadge
                score={lead.lead_score ?? 0}
              />
            </div>

            <div className="rounded-lg bg-ink-50 px-3 py-3">

              <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                Qualification
              </p>

              <p className="mt-1 text-sm font-semibold capitalize text-ink-800">
                {(lead.qualification ||
                  "unqualified"
                ).replaceAll("_", " ")}
              </p>

            </div>

            <div className="mt-4">

              <p className="text-xs text-ink-400">
                Qualification is calculated automatically
                by the backend based on the available
                business information.
              </p>

            </div>

          </section>

          {/* =======================================
              STATUS
          ======================================== */}

          <section className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">

            <h2 className="mb-3 text-sm font-semibold text-ink-800">
              Lead Status
            </h2>

            <StatusBadge
              status={lead.status}
            />

            <p className="mt-3 text-xs text-ink-400">
              Status is managed automatically by the
              qualification process.
            </p>

          </section>

          {/* =======================================
              CONTACT
          ======================================== */}

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


// --------------------------------------------------
// Info component
// --------------------------------------------------

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