import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Sparkles,
  MapPin,
  Building2,
  FileText,
  Copy,
  Check,
} from "lucide-react";

import {
  qualifiedLeadsApi,
  aiApi,
  proposalApi,
} from "../lib/api";

import ScoreBadge from "../components/leads/ScoreBadge";
import Button from "../components/ui/Button";

export default function LeadDetail() {
  const { id } = useParams();

  const [lead, setLead] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // AI Analysis
  // --------------------------------------------------

  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiError, setAiError] = useState("");

  // --------------------------------------------------
  // Proposal
  // --------------------------------------------------

  const [proposal, setProposal] = useState(null);
  const [generatingProposal, setGeneratingProposal] =
    useState(false);
  const [proposalError, setProposalError] = useState("");

  const [copied, setCopied] = useState(false);

  // ==================================================
  // LOAD QUALIFIED LEAD
  // ==================================================

  useEffect(() => {
    const loadLead = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * IMPORTANT
         *
         * This endpoint reads ONLY from:
         *
         * qualified_leads
         *
         * It does NOT read from businesses.
         */

        const res = await qualifiedLeadsApi.get(id);

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

  // ==================================================
  // AI ANALYSIS
  // ==================================================

  async function handleAnalyze() {
    if (!id || analyzing) {
      return;
    }

    try {
      setAnalyzing(true);
      setAiError("");

      /*
       * `id` is the QualifiedLead ID.
       *
       * Backend should use:
       *
       * POST /ai/analyze/{qualified_lead_id}
       */

      const res = await aiApi.analyze(id);

      setAnalysis(res.data.ai_analysis);
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

  // ==================================================
  // GENERATE PROPOSAL
  // ==================================================

  async function handleGenerateProposal() {
    if (!id || generatingProposal) {
      return;
    }

    try {
      setGeneratingProposal(true);
      setProposalError("");

      /*
       * IMPORTANT
       *
       * This calls:
       *
       * POST /proposals/generate/{qualified_lead_id}
       *
       * The backend gets the lead from
       * qualified_leads table.
       *
       * Gemini then generates the proposal.
       *
       * The generated proposal is saved
       * in the proposals table.
       */

      const res =
        await proposalApi.generate(id);

      console.log(
        "Proposal response:",
        res.data
      );

      /*
       * Backend response:
       *
       * {
       *   qualified_lead_id: 1,
       *   cached: false,
       *   proposal: {
       *      id,
       *      subject,
       *      greeting,
       *      introduction,
       *      identified_problem,
       *      proposed_solution,
       *      services,
       *      benefits,
       *      call_to_action,
       *      closing,
       *      full_proposal,
       *      model,
       *      created_at
       *   }
       * }
       */

      if (!res.data?.proposal) {
        throw new Error(
          "The server did not return a proposal."
        );
      }

      setProposal(res.data.proposal);
    } catch (err) {
      console.error(
        "Proposal generation failed:",
        err
      );

      setProposalError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to generate proposal."
      );
    } finally {
      setGeneratingProposal(false);
    }
  }

  // ==================================================
  // COPY PROPOSAL
  // ==================================================

  async function handleCopyProposal() {
    if (!proposal) {
      return;
    }

    const text =
      proposal.full_proposal ||
      buildProposalText(proposal);

    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(
        "Failed to copy proposal:",
        err
      );
    }
  }

  // ==================================================
  // BUILD PROPOSAL TEXT
  // ==================================================

  function buildProposalText(proposalData) {
    if (!proposalData) {
      return "";
    }

    let text = "";

    if (proposalData.subject) {
      text += `Subject: ${proposalData.subject}\n\n`;
    }

    if (proposalData.greeting) {
      text += `${proposalData.greeting}\n\n`;
    }

    if (proposalData.introduction) {
      text += `${proposalData.introduction}\n\n`;
    }

    if (proposalData.identified_problem) {
      text += `Problem\n${proposalData.identified_problem}\n\n`;
    }

    if (proposalData.proposed_solution) {
      text += `Proposed Solution\n${proposalData.proposed_solution}\n\n`;
    }

    if (
      proposalData.services &&
      proposalData.services.length > 0
    ) {
      text += `Services\n`;

      proposalData.services.forEach((service) => {
        text += `- ${service}\n`;
      });

      text += "\n";
    }

    if (
      proposalData.benefits &&
      proposalData.benefits.length > 0
    ) {
      text += `Benefits\n`;

      proposalData.benefits.forEach((benefit) => {
        text += `- ${benefit}\n`;
      });

      text += "\n";
    }

    if (proposalData.call_to_action) {
      text += `${proposalData.call_to_action}\n\n`;
    }

    if (proposalData.closing) {
      text += `${proposalData.closing}\n`;
    }

    return text.trim();
  }

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-ink-400">
          Loading qualified lead...
        </p>
      </div>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error || !lead) {
    return (
      <div className="space-y-4">

        <Link
          to="/app"
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

  // ==================================================
  // EMAIL URL
  // ==================================================

  const emailSubject =
    proposal?.subject ||
    `Proposal for ${lead.name}`;

  const emailBody =
    proposal?.full_proposal ||
    buildProposalText(proposal);

  const mailtoUrl = lead.email
    ? `mailto:${lead.email}?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody)}`
    : "#";

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <div className="space-y-6">

      {/* ==================================================
          BACK
      ================================================== */}

      <Link
        to="/app"
        className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-forge-600"
      >
        <ArrowLeft className="h-4 w-4" />

        Back to qualified leads
      </Link>

      {/* ==================================================
          LEAD HEADER
      ================================================== */}

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

          {/* SCORE */}

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

      {/* ==================================================
          LEAD INFORMATION
      ================================================== */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* ==================================================
            BUSINESS INFORMATION
        ================================================== */}

        <div className="lg:col-span-2">

          <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">

            <h2 className="font-display text-lg font-semibold text-ink-900">
              Business Information
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">

              {/* INDUSTRY */}

              <div>

                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-400">

                  <Building2 className="h-4 w-4" />

                  Industry

                </div>

                <p className="mt-1 text-sm text-ink-700">
                  {lead.industry || "--"}
                </p>

              </div>

              {/* LOCATION */}

              <div>

                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-400">

                  <MapPin className="h-4 w-4" />

                  Location

                </div>

                <p className="mt-1 text-sm text-ink-700">
                  {lead.location || "--"}
                </p>

              </div>

              {/* PHONE */}

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

              {/* EMAIL */}

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

              {/* WEBSITE */}

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

              {/* SOURCE */}

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

        {/* ==================================================
            AI TOOLS
        ================================================== */}

        <div>

          <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">

            <div className="flex items-center gap-2">

              <Sparkles className="h-5 w-5 text-forge-500" />

              <h2 className="font-display text-lg font-semibold text-ink-900">
                AI Tools
              </h2>

            </div>

            <p className="mt-2 text-sm leading-6 text-ink-400">
              Analyze this qualified lead with Gemini
              or generate a personalized proposal for
              outreach.
            </p>

            {/* AI ANALYZE */}

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

            {/* GENERATE PROPOSAL */}

            <Button
              onClick={handleGenerateProposal}
              disabled={generatingProposal}
              variant="secondary"
              className="mt-3 w-full"
            >

              <FileText className="h-4 w-4" />

              {generatingProposal
                ? "Generating Proposal..."
                : "Generate Proposal"}

            </Button>

            {/* AI ERROR */}

            {aiError && (
              <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3">

                <p className="text-sm text-red-600">
                  {aiError}
                </p>

              </div>
            )}

            {/* PROPOSAL ERROR */}

            {proposalError && (
              <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3">

                <p className="text-sm text-red-600">
                  {proposalError}
                </p>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* ==================================================
          AI ANALYSIS RESULT
      ================================================== */}

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

          {/* PRIORITY */}

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

          {/* SUMMARY */}

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

          {/* OPPORTUNITIES */}

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

          {/* RECOMMENDED SERVICES */}

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

          {/* OUTREACH ANGLE */}

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

      {/* ==================================================
          GENERATED PROPOSAL
      ================================================== */}

      {proposal && (

        <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">

          {/* HEADER */}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <FileText className="h-5 w-5 text-forge-500" />

                <h2 className="font-display text-lg font-semibold text-ink-900">
                  Generated Proposal
                </h2>

              </div>

              <p className="mt-1 text-xs text-ink-400">
                Personalized AI-generated proposal for{" "}
                {lead.name}
              </p>

            </div>

            {proposal.model && (

              <span className="text-xs text-ink-400">
                Model: {proposal.model}
              </span>

            )}

          </div>

  
          {/* ==================================================
              FULL PROPOSAL
          ================================================== */}

          {proposal.full_proposal && (

            <div className="mt-6">

              <div className="flex items-center justify-between">

                <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                  Proposal
                </p>

                <button
                  type="button"
                  onClick={handleCopyProposal}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-ink-500 transition hover:bg-ink-50 hover:text-forge-600"
                >

                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}

                </button>

              </div>

              <div className="mt-2 rounded-lg bg-ink-50 p-5">

                <p className="whitespace-pre-wrap text-sm leading-7 text-ink-700">
                  {proposal.full_proposal}
                </p>

              </div>

            </div>

          )}

          {/* ==================================================
              STRUCTURED PROPOSAL DETAILS
          ================================================== */}

          {!proposal.full_proposal && (

            <div className="mt-6 space-y-6">

              {/* GREETING */}

              {proposal.greeting && (

                <div>

                  <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                    Greeting
                  </p>

                  <p className="mt-2 text-sm leading-7 text-ink-700">
                    {proposal.greeting}
                  </p>

                </div>

              )}

              {/* INTRODUCTION */}

              {proposal.introduction && (

                <div>

                  <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                    Introduction
                  </p>

                  <p className="mt-2 text-sm leading-7 text-ink-700">
                    {proposal.introduction}
                  </p>

                </div>

              )}

              {/* IDENTIFIED PROBLEM */}

              {proposal.identified_problem && (

                <div>

                  <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                    Identified Problem
                  </p>

                  <p className="mt-2 text-sm leading-7 text-ink-700">
                    {proposal.identified_problem}
                  </p>

                </div>

              )}

              {/* PROPOSED SOLUTION */}

              {proposal.proposed_solution && (

                <div>

                  <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                    Proposed Solution
                  </p>

                  <p className="mt-2 text-sm leading-7 text-ink-700">
                    {proposal.proposed_solution}
                  </p>

                </div>

              )}

              {/* SERVICES */}

              {proposal.services?.length > 0 && (

                <div>

                  <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                    Services
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">

                    {proposal.services.map(
                      (service, index) => (

                        <span
                          key={index}
                          className="rounded-full bg-forge-50 px-3 py-1.5 text-xs font-medium text-forge-700"
                        >
                          {service}
                        </span>

                      )
                    )}

                  </div>

                </div>

              )}

              {/* BENEFITS */}

              {proposal.benefits?.length > 0 && (

                <div>

                  <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                    Benefits
                  </p>

                  <ul className="mt-2 space-y-2">

                    {proposal.benefits.map(
                      (benefit, index) => (

                        <li
                          key={index}
                          className="rounded-lg bg-ink-50 px-4 py-3 text-sm leading-6 text-ink-700"
                        >
                          {benefit}
                        </li>

                      )
                    )}

                  </ul>

                </div>

              )}

              {/* CALL TO ACTION */}

              {proposal.call_to_action && (

                <div>

                  <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                    Call to Action
                  </p>

                  <p className="mt-2 rounded-lg bg-ink-50 p-4 text-sm leading-7 text-ink-700">
                    {proposal.call_to_action}
                  </p>

                </div>

              )}

              {/* CLOSING */}

              {proposal.closing && (

                <div>

                  <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                    Closing
                  </p>

                  <p className="mt-2 text-sm leading-7 text-ink-700">
                    {proposal.closing}
                  </p>

                </div>

              )}

            </div>

          )}

          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div className="mt-6 flex flex-wrap gap-3">

            {/* COPY */}

            <Button
              variant="secondary"
              onClick={handleCopyProposal}
            >

              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}

              {copied
                ? "Copied"
                : "Copy Proposal"}

            </Button>

            {/* SEND EMAIL */}

            {lead.email ? (

              <a
                href={mailtoUrl}
                className="inline-flex items-center gap-2 rounded-lg bg-forge-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-forge-700"
              >

                <Mail className="h-4 w-4" />

                Send Proposal

              </a>

            ) : (

              <Button
                variant="secondary"
                disabled
              >

                <Mail className="h-4 w-4" />

                No Email Available

              </Button>

            )}

          </div>

        </div>

      )}

    </div>
  );
}