import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logomark from "../components/layout/Logomark";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't create your account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <Logomark className="h-9 w-9" />
          <h1 className="font-display text-xl font-semibold text-ink-900">Create your account</h1>
          <p className="text-sm text-ink-400">New accounts start as a Viewer</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-ink-100 bg-white p-6 shadow-card">
          <Input
            label="Full name"
            name="full_name"
            autoComplete="name"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-forge-600 hover:text-forge-700">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
