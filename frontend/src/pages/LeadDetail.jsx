import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Globe } from "lucide-react";
import { mockLeads, STATUSES } from "../lib/mockData";
import ScoreBadge from "../components/leads/ScoreBadge";
import StatusBadge from "../components/leads/StatusBadge";
import Button from "../components/ui/Button";

export default function LeadDetail() {
  const { id } = useParams();
  const lead = mockLeads.find((l) => l.id === id);

  const [status, setStatus] = useState(lead?.status);
  const [notes, setNotes] = useState(lead?.notes || []);
  const [draft, setDraft] = useState("");

  if (!lead) {
    return (
      <div className="text-sm text-ink-500">
        Lead not found. <Link to="/app" className="text-forge-600">Back to leads</Link>
      </div>
    );
  }

  function addNote() {
    if (!draft.trim()) return;
    setNotes([{ id: crypto.randomUUID(), text: draft, createdAt: "Just now" }, ...notes]);
    setDraft("");
    // TODO(Phase 3): POST to /businesses/:id/notes once the endpoint exists.
  }

  return (
    <div>
      <Link to="/app" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-400 hover:text-ink-700">
        <ArrowLeft className="h-4 w-4" /> Back to leads
      </Link>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">{lead.name}</h1>
          <p className="mt-1 text-sm text-ink-400">
            {lead.category} · {lead.city}
          </p>
        </div>
        <ScoreBadge score={lead.score} className="text-sm" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <section className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
            <h2 className="mb-3 text-sm font-semibold text-ink-800">Why this is a lead</h2>
            <p className="text-sm text-ink-500">{lead.reason}</p>
          </section>

          <section className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
            <h2 className="mb-3 text-sm font-semibold text-ink-800">Notes</h2>
            <div className="mb-3 flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addNote()}
                placeholder="Add a note about this lead..."
                className="flex-1 rounded-lg border border-ink-200 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-forge-500"
              />
              <Button onClick={addNote} variant="secondary">
                Add
              </Button>
            </div>
            <ul className="space-y-3">
              {notes.map((note) => (
                <li key={note.id} className="border-l-2 border-ink-100 pl-3 text-sm">
                  <p className="text-ink-700">{note.text}</p>
                  <p className="mt-0.5 text-xs text-ink-300">{note.createdAt}</p>
                </li>
              ))}
              {notes.length === 0 && <p className="text-sm text-ink-300">No notes yet.</p>}
            </ul>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
            <h2 className="mb-3 text-sm font-semibold text-ink-800">Status</h2>
            <div className="mb-3">
              <StatusBadge status={status} />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-forge-500"
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </section>

          <section className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
            <h2 className="mb-3 text-sm font-semibold text-ink-800">Contact</h2>
            <ul className="space-y-2 text-sm text-ink-600">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-ink-300" /> {lead.contact.email}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-ink-300" /> {lead.contact.phone}
              </li>
              <li className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-ink-300" />
                {lead.website || <span className="text-ink-300">No website</span>}
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
