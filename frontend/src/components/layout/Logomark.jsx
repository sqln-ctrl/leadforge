export default function Logomark({ className = "h-7 w-7" }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Anvil silhouette -- the "forge" in LeadForge */}
      <path
        d="M6 20h5l2-3h9l3 3h1v3H6v-3Z"
        fill="currentColor"
        className="text-ink-900"
      />
      <rect x="13" y="23" width="6" height="4" rx="1" className="text-ink-900" fill="currentColor" />
      {/* Spark -- the signal a hot lead throws off */}
      <path
        d="M23 6c0 2.5-2 3.5-2 6 0-2.5-2-3.5-2-6s2-3.5 2-6c0 2.5 2 3.5 2 6Z"
        className="text-forge-500"
        fill="currentColor"
      />
    </svg>
  );
}
