import clsx from "clsx";
import { scoreTemperature } from "../../lib/mockData";

// The signature element: lead scores read as "heat" (cold -> hot), tying the
// scoring system back to the forge/heat metaphor in the product name. A high
// score means a business needs the agency's help more -- i.e. it's a "hot" lead.
const HEAT_STYLES = {
  hot: "bg-forge-50 text-forge-600 ring-1 ring-inset ring-forge-200",
  warm: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  cool: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
  cold: "bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-200",
};

export default function ScoreBadge({ score, className }) {
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
