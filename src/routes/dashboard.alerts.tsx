import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Battery,
  Droplets,
  Sun,
  Bell,
  ChevronDown,
  Thermometer,
  Gauge,
  Wind,
  Wifi,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Info,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/alerts")({
  component: AlertsPage,
  head: () => ({ meta: [{ title: "Alerts & Device Status · EcoSense IoT" }] }),
});

const activeAlerts = [
  {
    Icon: AlertTriangle,
    color: "#dc2626",
    bg: "#fee2e2",
    title: "High Air Quality (AQI)",
    desc: "AQI has reached 162 which is unhealthy.",
    time: "10:24 AM",
    level: "High",
    lvlCls: "lvl-high",
  },
  {
    Icon: Battery,
    color: "#ea580c",
    bg: "#ffedd5",
    title: "Low Battery",
    desc: "Battery level is below 20%.",
    time: "09:45 AM",
    level: "Medium",
    lvlCls: "lvl-med",
  },
  {
    Icon: Droplets,
    color: "#ca8a04",
    bg: "#fef9c3",
    title: "Humidity Out of Range",
    desc: "Humidity is above normal range.",
    time: "09:10 AM",
    level: "Low",
    lvlCls: "lvl-low",
  },
  {
    Icon: Sun,
    color: "#2563eb",
    bg: "#dbeafe",
    title: "Solar Input Low",
    desc: "Solar input is lower than expected.",
    time: "Yesterday",
    level: "Info",
    lvlCls: "lvl-info",
  },
];

const deviceInfo: { k: string; v: React.ReactNode }[] = [
  { k: "Device ID", v: "ES-2024-001" },
  { k: "ESP32 Status", v: <span className="ok-text">Online</span> },
  { k: "WiFi Status", v: <span className="ok-text">Connected</span> },
  { k: "Uptime", v: "2d 14h 32m" },
  { k: "Last Data Received", v: "10:24:30 AM" },
  { k: "Firmware Version", v: "v1.2.3" },
  {
    k: "Signal Strength",
    v: (
      <span className="ok-text signal-cell">
        <Wifi size={14} /> Excellent (92%)
      </span>
    ),
  },
];

const sensors = [
  { Icon: Thermometer, color: "#2563eb", name: "Temperature Sensor" },
  { Icon: Droplets, color: "#2563eb", name: "Humidity Sensor" },
  { Icon: Gauge, color: "#8b5cf6", name: "Pressure Sensor" },
  { Icon: Wind, color: "#0ea5e9", name: "Air Quality Sensor" },
];

function AlertsPage() {
  return (
    <div className="page">
      {/* Topbar */}
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="step-badge">5</span>
          <h1 style={{ color: "var(--green)", margin: 0 }}>Alerts &amp; Device Status Dashboard</h1>
        </div>
        <div className="topbar-right">
          <Sun size={22} color="#eab308" />
          <button className="bell-btn">
            <Bell size={16} />
            <span className="bell-badge">3</span>
          </button>
          <button className="user-btn">
            <span className="avatar">TE</span>
            <ChevronDown size={16} color="#6b7c75" />
          </button>
        </div>
      </div>

      {/* 3-col grid */}
      <div className="alerts-grid">
        {/* Active Alerts */}
        <section className="panel">
          <div className="panel-head">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <AlertTriangle size={20} color="#dc2626" />
              <h2 className="panel-title" style={{ color: "#dc2626" }}>
                Active Alerts
              </h2>
            </div>
          </div>
          <div className="alert-list">
            {activeAlerts.map((a) => (
              <div key={a.title} className="alert-row">
                <div className="alert-ico" style={{ background: a.bg }}>
                  <a.Icon size={20} color={a.color} />
                </div>
                <div className="alert-text">
                  <div className="t">{a.title}</div>
                  <div className="d">{a.desc}</div>
                </div>
                <div className="alert-time">{a.time}</div>
                <span className={`lvl ${a.lvlCls}`}>{a.level}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <a href="#" className="panel-link">
              View All Alerts <ArrowRight size={14} />
            </a>
          </div>
        </section>

        {/* Device Status */}
        <section className="panel">
          <div className="panel-head">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ShieldCheck size={20} color="var(--green)" />
              <h2 className="panel-title">Device Status</h2>
            </div>
          </div>
          <div className="info-list">
            {deviceInfo.map((r) => (
              <div key={r.k} className="info-row">
                <span className="k">{r.k}</span>
                <span className="v">{r.v}</span>
              </div>
            ))}
          </div>
          <div className="ops-bar">
            <CheckCircle2 size={16} color="var(--green)" />
            All systems are operational.
          </div>
        </section>

        {/* Sensors Status + Health */}
        <div className="stack">
          <section className="panel">
            <div className="panel-head">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Info size={20} color="var(--green)" />
                <h2 className="panel-title">Sensors Status</h2>
              </div>
            </div>
            <div className="sensor-list">
              {sensors.map((s) => (
                <div key={s.name} className="sensor-row">
                  <span className="sensor-name">
                    <s.Icon size={16} color={s.color} /> {s.name}
                  </span>
                  <span className="pill-online">Online</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel health-card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <ShieldCheck size={22} color="var(--blue)" />
              <h2 className="panel-title" style={{ color: "var(--blue)" }}>
                System Health
              </h2>
            </div>
            <div className="health-body">
              <div>
                <div className="health-sub">Overall System Status</div>
                <div className="health-status">
                  Healthy <CheckCircle2 size={18} color="var(--green)" />
                </div>
              </div>
              <Gauge92 />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Gauge92() {
  const pct = 92;
  const r = 56;
  const c = Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="gauge">
      <svg viewBox="0 0 140 80" width="140" height="80">
        <path
          d="M14 70 A56 56 0 0 1 126 70"
          stroke="#e5e7eb"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M14 70 A56 56 0 0 1 126 70"
          stroke="#16a34a"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="gauge-val">
        92<span>%</span>
      </div>
    </div>
  );
}
