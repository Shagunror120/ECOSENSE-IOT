import { Link, useLocation } from "@tanstack/react-router";
import {
  Home,
  MonitorPlay,
  History,
  Zap,
  Bell,
  FileText,
  Settings,
  Leaf,
} from "lucide-react";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/dashboard", label: "System Overview", icon: MonitorPlay },
  { to: "/dashboard/analytics", label: "Analytics", icon: History },
  { to: "/dashboard/energy", label: "Energy Monitor", icon: Zap },
  { to: "/dashboard/alerts", label: "Alerts & Status", icon: Bell },
  { to: "/dashboard", label: "Reports", icon: FileText },
  { to: "/dashboard", label: "Settings", icon: Settings },
] as const;

export function EcoSidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="sidebar">
      <Link to="/dashboard" className="sidebar-brand">
        <div className="brand-badge">
          <Leaf size={20} />
        </div>
        <div>
          <div className="brand-title">EcoSense IoT</div>
          <div className="brand-sub">Smart Monitoring System</div>
        </div>
      </Link>

      <nav className="nav">
        {nav.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link key={label} to={to} className={`nav-item ${active ? "active" : ""}`}>
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
