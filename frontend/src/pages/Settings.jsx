import { useEffect, useState } from "react";
import { KeyRound, UserRound } from "lucide-react";
import { toast } from "react-hot-toast";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { authApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) setProfile({ name: user.name || "", email: user.email || "" });
  }, [user]);

  async function saveProfile(event) {
    event.preventDefault();
    setProfileError("");
    setSavingProfile(true);
    try {
      await updateUser(profile);
      toast.success("Personal details updated");
    } catch (err) {
      const message = err.response?.data?.detail || "Could not update personal details.";
      setProfileError(message);
      toast.error(message);
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(event) {
    event.preventDefault();
    setPasswordError("");
    if (passwords.new_password !== passwords.confirm_password) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      await authApi.changePassword({
        current_password: passwords.current_password,
        new_password: passwords.new_password,
      });
      setPasswords({ current_password: "", new_password: "", confirm_password: "" });
      toast.success("Password changed successfully");
    } catch (err) {
      const message = err.response?.data?.detail || "Could not change password.";
      setPasswordError(message);
      toast.error(message);
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Settings</h1>
        <p className="mt-1 text-sm text-ink-400">Manage your personal details and account security.</p>
      </header>

      <div className="grid max-w-4xl gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-forge-50 p-2.5 text-forge-600"><UserRound className="h-5 w-5" /></div>
            <div><h2 className="font-display text-lg font-semibold text-ink-900">Personal details</h2><p className="text-sm text-ink-400">Update the name and email on your account.</p></div>
          </div>
          <form className="mt-6 space-y-4" onSubmit={saveProfile}>
            <Input label="Name" name="name" autoComplete="name" required value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
            <Input label="Email address" name="email" type="email" autoComplete="email" required value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} />
            {profileError && <p className="text-sm text-red-600">{profileError}</p>}
            <Button type="submit" disabled={savingProfile}>{savingProfile ? "Saving..." : "Save details"}</Button>
          </form>
        </section>

        <section className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-forge-50 p-2.5 text-forge-600"><KeyRound className="h-5 w-5" /></div>
            <div><h2 className="font-display text-lg font-semibold text-ink-900">Password</h2><p className="text-sm text-ink-400">Use at least 8 characters and keep it private.</p></div>
          </div>
          <form className="mt-6 space-y-4" onSubmit={savePassword}>
            <Input label="Current password" name="current-password" type="password" autoComplete="current-password" required value={passwords.current_password} onChange={(event) => setPasswords({ ...passwords, current_password: event.target.value })} />
            <Input label="New password" name="new-password" type="password" autoComplete="new-password" minLength="8" required value={passwords.new_password} onChange={(event) => setPasswords({ ...passwords, new_password: event.target.value })} />
            <Input label="Confirm new password" name="confirm-password" type="password" autoComplete="new-password" minLength="8" required value={passwords.confirm_password} onChange={(event) => setPasswords({ ...passwords, confirm_password: event.target.value })} />
            {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
            <Button type="submit" disabled={savingPassword}>{savingPassword ? "Changing..." : "Change password"}</Button>
          </form>
        </section>
      </div>
    </div>
  );
}
