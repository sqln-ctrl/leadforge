import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 text-center">
      <p className="font-display text-4xl font-semibold text-ink-900">404</p>
      <p className="text-sm text-ink-400">This page doesn't exist.</p>
      <Link to="/" className="mt-2 text-sm font-medium text-forge-600 hover:text-forge-700">
        Back to leads
      </Link>
    </div>
  );
}
