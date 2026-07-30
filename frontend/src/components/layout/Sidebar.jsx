import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { LayoutGrid, BarChart3, Search, LogOut } from "lucide-react";
import Logomark from "./Logomark";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Leads", icon: LayoutGrid, end: true },
  { to: "/discovery", label: "Discovery", icon: Search },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-ink-100 bg-white">
      <div className="flex items-center gap-2 px-5 py-5">
        <Logomark />
        <span className="font-display text-lg font-semibold text-ink-900">LeadForge</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-forge-50 text-forge-600"
                  : "text-ink-500 hover:bg-ink-50 hover:text-ink-800"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-ink-100 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-800 text-xs font-medium text-white">
            {user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink-800">
              {user?.full_name || user?.email}
            </p>
            <p className="truncate text-xs capitalize text-ink-400">{user?.role?.replace("_", " ")}</p>
          </div>
          <button
            onClick={logout}
            className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
