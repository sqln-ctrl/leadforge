import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MailCheck } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { authApi } from "../lib/api";

export default function VerifyEmailSent() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [submitting, setSubmitting] = useState(false);

  async function resendVerification(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await authApi.resendVerification(email);
      toast.success(data.message);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "We could not resend the verification email.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-ink-100 bg-white p-8 text-center shadow-card">
        <MailCheck className="mx-auto mb-5 h-12 w-12 text-forge-500" aria-hidden="true" />
        <h1 className="font-display text-2xl font-semibold text-ink-900">Check your inbox</h1>
        <p className="mt-3 text-sm leading-6 text-ink-500">
          We sent a verification link to your email address. Open it to activate your account, then log in.
        </p>

        <form onSubmit={resendVerification} className="mt-6 space-y-3 text-left">
          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button type="submit" variant="secondary" className="w-full" disabled={submitting}>
            {submitting ? "Sending..." : "Resend verification email"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-ink-500">
          Already verified? <Link to="/login" className="font-medium text-forge-600 hover:text-forge-700">Log in</Link>
        </p>
      </div>
    </div>
  );
}
