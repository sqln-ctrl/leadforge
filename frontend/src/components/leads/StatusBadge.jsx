import clsx from "clsx";

// Backend's LeadStatus enum sends lowercase values ("new", "contacted", ...)
// -- keys here must match that exactly, display text is capitalized via CSS.
const STATUS_STYLES = {
  new: "bg-ink-100 text-ink-700",
  contacted: "bg-blue-50 text-blue-700",
  qualified: "bg-emerald-50 text-emerald-700",
  closed: "bg-ink-100 text-ink-400",
};

export default function StatusBadge({ status, className }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        STATUS_STYLES[status] || STATUS_STYLES.new,
        className
      )}
    >
      {status}
    </span>
  );
}