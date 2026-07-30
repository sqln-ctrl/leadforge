import clsx from "clsx";

const variants = {
  primary: "bg-forge-500 text-white hover:bg-forge-600 focus-visible:ring-forge-500",
  secondary: "bg-white text-ink-800 border border-ink-200 hover:bg-ink-50",
  ghost: "text-ink-600 hover:bg-ink-100",
};

export default function Button({
  as: Component = "button",
  variant = "primary",
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
