import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { BadgeCheck, MailWarning } from "lucide-react";

import Button from "../components/ui/Button";
import { authApi } from "../lib/api";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [verificationStatus, setVerificationStatus] = useState("ready");
  const [message, setMessage] = useState("");

  async function verifyEmail() {
    if (!token) return;

    setVerificationStatus("submitting");
    setMessage("");
    try {
      const { data } = await authApi.verifyEmail(token);
      setVerificationStatus("success");
      setMessage(data.message);
      toast.success("Email verified successfully.");
    } catch (err) {
      setVerificationStatus("error");
      setMessage(err?.response?.data?.detail || "We could not verify this email address.");
    }
  }

  const isSuccess = verificationStatus === "success";
  const isInvalid = !token || verificationStatus === "error";

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-ink-100 bg-white p-8 text-center shadow-card">
        {isSuccess ? (
          <BadgeCheck className="mx-auto mb-5 h-12 w-12 text-emerald-500" aria-hidden="true" />
        ) : (
          <MailWarning className="mx-auto mb-5 h-12 w-12 text-forge-500" aria-hidden="true" />
        )}
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          {isSuccess ? "Email verified" : "Verify your email"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink-500">
          {isSuccess
            ? message
            : isInvalid
              ? message || "This verification link is incomplete or invalid. Request a new link below."
              : "Confirm your email address to activate your LeadForge account."}
        </p>

        {!isSuccess && !isInvalid && (
          <Button className="mt-6 w-full" onClick={verifyEmail} disabled={verificationStatus === "submitting"}>
            {verificationStatus === "submitting" ? "Verifying..." : "Verify email"}
          </Button>
        )}

        <div className="mt-6 text-sm text-ink-500">
          Need another link? <Link to="/verify-email-sent" className="font-medium text-forge-600 hover:text-forge-700">Resend verification email</Link>
        </div>
        {isSuccess && (
          <Link to="/login" className="mt-5 inline-block text-sm font-medium text-forge-600 hover:text-forge-700">
            Continue to log in
          </Link>
        )}
      </div>
    </div>
  );
}
