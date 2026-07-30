import clsx from "clsx";

const STATUS_STYLES = {
  New: "bg-ink-100 text-ink-700",
  Contacted: "bg-blue-50 text-blue-700",
  Qualified: "bg-emerald-50 text-emerald-700",
  Closed: "bg-ink-100 text-ink-400",
};

export default function StatusBadge({ status, className }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status] || STATUS_STYLES.New,
        className
      )}
    >
      {status}
    </span>
  );
}
