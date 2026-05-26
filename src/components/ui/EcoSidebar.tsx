import { Link, useLocation } from "@tanstack/react-router";
import { Home, MonitorPlay, History, Zap, Bell, FileText, Settings, Info, Leaf, Sun, Wind } from "lucide-react";

const nav: { to: "/dashboard" | "/" | "/dashboard"; label: string; icon: typeof Home }[] = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/dashboard", label: "System Overview", icon: MonitorPlay },
  { to: "/dashboard", label: "Analytics", icon: History },
  { to: "/dashboard", label: "Energy Monitor", icon: Zap },
  { to: "/dashboard", label: "Alerts & Status", icon: Bell },
  { to: "/dashboard", label: "Reports", icon: FileText },
  { to: "/dashboard", label: "Settings", icon: Settings },
  { to: "/", label: "About Us", icon: Info },
];

export function EcoSidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-brand">
        <div className="brand-badge"><Leaf size={20} /></div>
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
                {/* const nav = [ 
    {/* { to: "/dashboard", label: "Home", icon: Home },
  { to: "/dashboard", label: "System Overview", icon: MonitorPlay },
  { to: "/dashboard", label: "Analytics", icon: History },
  { to: "/dashboard", label: "Energy Monitor", icon: Zap },
  { to: "/dashboard/alerts", label: "Alerts & Status", icon: Bell },
  { to: "/dashboard", label: "Reports", icon: FileText },
  { to: "/dashboard", label: "Settings", icon: Settings },
  { to: "/", label: "About Us", icon: Info },
] as const; */}

      <div className="sidebar-cta">
        <div className="icons">
          <Sun size={22} className="c-yellow" color="#eab308" />
          <Wind size={22} color="#2563eb" />
          <Leaf size={22} color="#16a34a" />
        </div>
        <div className="title">Energy Harvesting</div>
        <p className="desc">Powered by nature, sustained for the future.</p>
        <Link to="/" className="link">Learn More →</Link>
      </div>
    </aside>
  );
}
