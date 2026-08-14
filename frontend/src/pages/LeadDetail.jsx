import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Sparkles,
  MapPin,
  Building2,
} from "lucide-react";

import {
  qualifiedLeadsApi,
  aiApi,
} from "../lib/api";

import ScoreBadge from "../components/leads/ScoreBadge";
import Button from "../components/ui/Button";


export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiError, setAiError] = useState("");


  // --------------------------------------------------
  // Load Qualified Lead
  // --------------------------------------------------

  useEffect(() => {
    const loadLead = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * IMPORTANT:
         *
         * This gets the lead from:
         *
         * GET /qualified-leads/{id}
         *
         * NOT:
         *
         * GET /businesses/{id}
         */

        const res =
          await qualifiedLeadsApi.get(id);

        setLead(res.data);

      } catch (err) {
        console.error(
          "Failed to load qualified lead:",
          err
        );

        setError(
          err.response?.data?.detail ||
            "Couldn't load this qualified lead."
        );

      } finally {
        setLoading(false);
      }
    };


    if (id) {
      loadLead();
    }

  }, [id]);


  // --------------------------------------------------
  // AI Analysis
  // --------------------------------------------------

  async function handleAnalyze() {
    if (!id || analyzing) {
      return;
    }

    try {
      setAnalyzing(true);
      setAiError("");

      /*
       * IMPORTANT:
       *
       * `id` here is the QualifiedLead ID.
       *
       * Backend:
       *
       * POST /ai/analyze/{qualified_lead_id}
       */

      const res =
        await aiApi.analyze(id);

      setAnalysis(
        res.data.ai_analysis
      );

    } catch (err) {
      console.error(
        "AI analysis failed:",
        err
      );

      setAiError(
        err.response?.data?.detail ||
          "AI analysis failed."
      );

    } finally {
      setAnalyzing(false);
    }
  }


  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-ink-400">
          Loading qualified lead...
        </p>
      </div>
    );
  }


  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error || !lead) {
    return (
      <div className="space-y-4">

        <Link
          to="/app/leads"
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-forge-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to qualified leads
        </Link>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">
            {error ||
              "Qualified lead not found."}
          </p>
        </div>

      </div>
    );
  }


  return (
    <div className="space-y-6">

      {/* -------------------------------------------------- */}
      {/* Back */}
      {/* -------------------------------------------------- */}

      <Link
        to="/app/leads"
        className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-forge-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to qualified leads
      </Link>


      {/* -------------------------------------------------- */}
      {/* Lead Header */}
      {/* -------------------------------------------------- */}

      <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">

        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <h1 className="font-display text-2xl font-semibold text-ink-900">
                {lead.name}
              </h1>

              <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                Qualified
              </span>

            </div>

            <p className="mt-2 text-sm text-ink-400">
              Qualified lead #{lead.id}
            </p>

          </div>


          {/* Score */}

          <div className="flex items-center gap-3">

            <span className="text-sm text-ink-400">
              Lead Score
            </span>

            <ScoreBadge
              score={lead.lead_score ?? 0}
            />

          </div>

        </div>

      </div>


      {/* -------------------------------------------------- */}
      {/* Lead Information */}
      {/* -------------------------------------------------- */}

      <div className="grid gap-6 lg:grid-cols-3">


        {/* ------------------------------------------------ */}
        {/* Main Information */}
        {/* ------------------------------------------------ */}

        <div className="lg:col-span-2">

          <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">

            <h2 className="font-display text-lg font-semibold text-ink-900">
              Business Information
            </h2>


            <div className="mt-5 grid gap-5 sm:grid-cols-2">


              {/* Industry */}

              <div>

                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-400">

                  <Building2 className="h-4 w-4" />

                  Industry

                </div>

                <p className="mt-1 text-sm text-ink-700">
                  {lead.industry || "--"}
                </p>

              </div>


              {/* Location */}

              <div>

                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-400">

                  <MapPin className="h-4 w-4" />

                  Location

                </div>

                <p className="mt-1 text-sm text-ink-700">
                  {lead.location || "--"}
                </p>

              </div>


              {/* Phone */}

              <div>

                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-400">

                  <Phone className="h-4 w-4" />

                  Phone

                </div>

                {lead.phone ? (
                  <a
                    href={`tel:${lead.phone}`}
                    className="mt-1 block text-sm text-forge-600 hover:underline"
                  >
                    {lead.phone}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-ink-400">
                    No phone available
                  </p>
                )}

              </div>


              {/* Email */}

              <div>

                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-400">

                  <Mail className="h-4 w-4" />

                  Email

                </div>

                {lead.email ? (
                  <a
                    href={`mailto:${lead.email}`}
                    className="mt-1 block break-all text-sm text-forge-600 hover:underline"
                  >
                    {lead.email}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-ink-400">
                    No email available
                  </p>
                )}

              </div>


              {/* Website */}

              <div>

                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-400">

                  <Globe className="h-4 w-4" />

                  Website

                </div>

                {lead.website ? (
                  <a
                    href={
                      lead.website.startsWith("http")
                        ? lead.website
                        : `https://${lead.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block break-all text-sm text-forge-600 hover:underline"
                  >
                    {lead.website}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-ink-400">
                    No website available
                  </p>
                )}

              </div>


              {/* Source */}

              <div>

                <div className="text-xs font-medium uppercase tracking-wide text-ink-400">
                  Source
                </div>

                <p className="mt-1 text-sm capitalize text-ink-700">
                  {lead.source || "manual"}
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* ------------------------------------------------ */}
        {/* AI Analysis Card */}
        {/* ------------------------------------------------ */}

        <div>

          <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">

            <div className="flex items-center gap-2">

              <Sparkles className="h-5 w-5 text-forge-500" />

              <h2 className="font-display text-lg font-semibold text-ink-900">
                AI Analysis
              </h2>

            </div>


            <p className="mt-2 text-sm leading-6 text-ink-400">
              Use Gemini to analyze this qualified lead
              and identify potential opportunities.
            </p>


            <Button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="mt-5 w-full"
            >

              <Sparkles className="h-4 w-4" />

              {analyzing
                ? "Analyzing..."
                : "AI Analyze"}

            </Button>


            {/* AI Error */}

            {aiError && (

              <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3">

                <p className="text-sm text-red-600">
                  {aiError}
                </p>

              </div>

            )}

          </div>

        </div>

      </div>


      {/* -------------------------------------------------- */}
      {/* AI Analysis Result */}
      {/* -------------------------------------------------- */}

      {analysis && (

        <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">

          <div className="flex items-center justify-between">

            <div>

              <div className="flex items-center gap-2">

                <Sparkles className="h-5 w-5 text-forge-500" />

                <h2 className="font-display text-lg font-semibold text-ink-900">
                  Gemini Analysis
                </h2>

              </div>

              {analysis.model && (
                <p className="mt-1 text-xs text-ink-400">
                  Model: {analysis.model}
                </p>
              )}

            </div>


            {analysis.score !== null &&
              analysis.score !== undefined && (

                <ScoreBadge
                  score={analysis.score}
                />

              )}

          </div>


          {/* Priority */}

          {analysis.priority && (

            <div className="mt-6">

              <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                Priority
              </p>

              <p className="mt-1 text-sm font-medium capitalize text-ink-800">
                {analysis.priority}
              </p>

            </div>

          )}


          {/* Summary */}

          {analysis.summary && (

            <div className="mt-6">

              <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                Summary
              </p>

              <p className="mt-2 text-sm leading-6 text-ink-600">
                {analysis.summary}
              </p>

            </div>

          )}


          {/* Opportunities */}

          {analysis.opportunities?.length > 0 && (

            <div className="mt-6">

              <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                Opportunities
              </p>

              <ul className="mt-2 space-y-2">

                {analysis.opportunities.map(
                  (opportunity, index) => (

                    <li
                      key={index}
                      className="rounded-lg bg-ink-50 px-3 py-2 text-sm text-ink-600"
                    >
                      {opportunity}
                    </li>

                  )
                )}

              </ul>

            </div>

          )}


          {/* Recommended Services */}

          {analysis.recommended_services?.length > 0 && (

            <div className="mt-6">

              <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                Recommended Services
              </p>

              <div className="mt-2 flex flex-wrap gap-2">

                {analysis.recommended_services.map(
                  (service, index) => (

                    <span
                      key={index}
                      className="rounded-full bg-forge-50 px-3 py-1 text-xs font-medium text-forge-700"
                    >
                      {service}
                    </span>

                  )
                )}

              </div>

            </div>

          )}


          {/* Outreach Angle */}

          {analysis.outreach_angle && (

            <div className="mt-6">

              <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                Outreach Angle
              </p>

              <p className="mt-2 rounded-lg bg-ink-50 p-4 text-sm leading-6 text-ink-600">
                {analysis.outreach_angle}
              </p>

            </div>

          )}

        </div>

      )}

    </div>
  );
}