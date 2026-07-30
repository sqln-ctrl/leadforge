import { mockLeads, STATUSES } from "../lib/mockData";

export default function Analytics() {
  const total = mockLeads.length;
  const avgScore = Math.round(mockLeads.reduce((sum, l) => sum + l.score, 0) / total);
  const statusCounts = STATUSES.map((status) => ({
    status,
    count: mockLeads.filter((l) => l.status === status).length,
  }));

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Analytics</h1>
        <p className="mt-1 text-sm text-ink-400">Pipeline health at a glance.</p>
      </header>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <Stat label="Total leads" value={total} />
        <Stat label="Average score" value={avgScore} />
        <Stat label="Qualified" value={mockLeads.filter((l) => l.status === "Qualified").length} />
      </div>

      <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">
        <h2 className="mb-4 text-sm font-semibold text-ink-800">Leads by status</h2>
        <div className="space-y-3">
          {statusCounts.map(({ status, count }) => (
            <div key={status} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-sm text-ink-500">{status}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-50">
                <div
                  className="h-full rounded-full bg-forge-500"
                  style={{ width: `${(count / total) * 100}%` }}
                />
              </div>
              <span className="w-6 text-right font-mono text-xs text-ink-400">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-ink-300">
        Showing placeholder data. Real analytics land in Phase 6 once the CRM and export endpoints exist.
      </p>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-4 shadow-card">
      <p className="text-xs text-ink-400">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-ink-900">{value}</p>
    </div>
  );
}
