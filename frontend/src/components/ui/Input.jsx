import clsx from "clsx";

export default function Input({ label, error, className, id, ...props }) {
  const inputId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          "rounded-lg border px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-forge-500",
          error ? "border-red-400" : "border-ink-200",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
