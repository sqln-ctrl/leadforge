import clsx from "clsx";

const HEAT_STYLES = {
  hot: "bg-forge-50 text-forge-600 ring-1 ring-inset ring-forge-200",
  warm: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  cool: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
  cold: "bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-200",
};

function scoreTemperature(score) {
  if (score >= 80) return "hot";
  if (score >= 55) return "warm";
  if (score >= 30) return "cool";
  return "cold";
}

// Score is undefined/null until Phase 5 (Lead Scoring) exists on the
// backend -- render an honest "not scored" state instead of a fake 0,
// which would look like a real (very cold) score.
export default function ScoreBadge({ score, className }) {
  if (score === null || score === undefined) {
    return (
      <span
        className={clsx(
          "inline-flex items-center gap-1 rounded-md bg-ink-50 px-2 py-0.5 font-mono text-xs text-ink-300 ring-1 ring-inset ring-ink-100",
          className
        )}
        title="Lead scoring isn't built yet"
      >
        --
      </span>
    );
  }

  const temp = scoreTemperature(score);
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-xs font-medium",
        HEAT_STYLES[temp],
        className
      )}
      title={`Lead score: ${score}/100`}
    >
      {score}
    </span>
  );
}