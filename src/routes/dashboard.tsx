import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/eco/Logo";
import { MetricCard } from "@/components/eco/MetricCard";
import { AlertItem } from "@/components/eco/AlertItem";
import { FlowDiagram } from "@/components/eco/FlowDiagram";
import { metrics, alerts } from "@/lib/eco-data";
import {
  Home, MonitorSmartphone, History, Zap, Bell, FileText, Settings, Info, Sun, ChevronDown, Wifi, Leaf,
  Thermometer, Droplets, Wind, Gauge, CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — EcoSense IoT" },
      { name: "description", content: "Real-time system overview for your environmental monitoring system." },
    ],
  }),
  component: DashboardPage,
});

const nav = [
  { Icon: Home,              label: "Home",           active: true },
  { Icon: MonitorSmartphone, label: "Live Dashboard" },
  { Icon: History,           label: "Data History" },
  { Icon: Zap,               label: "Energy Monitor" },
  { Icon: Bell,              label: "Alerts" },
  { Icon: FileText,          label: "Reports" },
  { Icon: Settings,          label: "Settings" },
  { Icon: Info,              label: "About Us" },
];

const recent = [
  { Icon: Thermometer, color: "var(--eco-blue)",   param: "Temperature",        value: "28.6 °C",  status: "Normal",   ok: true,  time: "10:24:30 AM" },
  { Icon: Droplets,    color: "var(--eco-green)",  param: "Humidity",           value: "65 %",     status: "Normal",   ok: true,  time: "10:24:30 AM" },
  { Icon: Wind,        color: "var(--eco-orange)", param: "Air Quality (AQI)",  value: "120",      status: "Moderate", ok: false, time: "10:24:30 AM" },
  { Icon: Gauge,       color: "var(--eco-purple)", param: "Pressure",           value: "1013 hPa", status: "Normal",   ok: true,  time: "10:24:30 AM" },
];

function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[var(--gradient-hero)]">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-card p-5 lg:flex lg:flex-col">
        <div className="mb-8">
          <Link to="/"><Logo subtitle="Smart Monitoring System" /></Link>
        </div>
        <nav className="space-y-1">
          {nav.map(({ Icon, label, active }) => (
            <a key={label} href="#"
               className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                 active
                   ? "bg-[var(--eco-green-soft)] text-[var(--eco-green)]"
                   : "text-foreground/70 hover:bg-muted hover:text-foreground"
               }`}>
              <Icon className="h-4 w-4" /> {label}
            </a>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl bg-[var(--gradient-hero)] p-4">
          <div className="mb-3 grid h-20 place-items-center rounded-xl bg-gradient-to-br from-[var(--eco-blue-soft)] to-[var(--eco-green-soft)]">
            <Sun className="h-10 w-10 text-yellow-500" />
          </div>
          <div className="text-sm font-semibold text-foreground">Energy Harvesting</div>
          <p className="mt-1 text-xs text-muted-foreground">Powered by nature, sustained for the future.</p>
          <a href="#" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--eco-green)]">Learn More →</a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 px-6 py-6 lg:px-10">
        {/* Topbar */}
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Welcome back, Team EcoSense! 👋</div>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">System Overview</h1>
            <p className="mt-1 text-sm text-muted-foreground">Real-time summary of your environmental monitoring system.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Sun className="h-6 w-6 text-yellow-500" />
              <div>
                <div className="font-semibold text-foreground">25°C</div>
                <div className="text-xs text-muted-foreground">Sunny</div>
              </div>
            </div>
            <button className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-muted">
              <Bell className="h-5 w-5 text-foreground/70" />
              <span className="absolute -top-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-[var(--destructive)] text-[10px] font-bold text-white">3</span>
            </button>
            <div className="flex items-center gap-2 rounded-xl bg-card px-3 py-1.5 ring-1 ring-border">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--eco-blue)] text-xs font-bold text-white">TE</div>
              <div className="text-sm">
                <div className="font-semibold text-foreground">Team EcoSense</div>
                <div className="text-xs text-muted-foreground">Admin</div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Metric strip */}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
        </section>

        {/* System flow + device status */}
        <section className="mb-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="text-base font-semibold text-foreground">System Flow</h3>
            <p className="mb-4 text-xs text-muted-foreground">Energy and data flow in your system</p>
            <FlowDiagram />
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--eco-green)]">
              <CheckCircle2 className="h-4 w-4" /> All systems operational
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="text-base font-semibold text-foreground">Device Status</h3>
            <p className="mb-4 text-xs text-muted-foreground">Current status of your monitoring device</p>
            <div className="flex gap-4 rounded-2xl bg-[var(--eco-green-soft)] p-4">
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-card">
                <Wifi className="h-12 w-12 text-[var(--eco-green)]" />
              </div>
              <div className="flex-1 space-y-2 text-sm">
                {[
                  { l: "Device ID",       v: "ES-2024-001" },
                  { l: "Status",          v: <span className="rounded-full bg-[var(--eco-green-soft)] px-2 py-0.5 text-xs font-medium text-[var(--eco-green)] ring-1 ring-[var(--eco-green)]/30">Online</span> },
                  { l: "Uptime",          v: "2d 14h 32m" },
                  { l: "Last Updated",    v: "10:24:30 AM" },
                  { l: "Signal Strength", v: <span className="inline-flex items-center gap-1 text-[var(--eco-green)]"><Wifi className="h-3.5 w-3.5" /> Excellent</span> },
                ].map((r) => (
                  <div key={r.l} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{r.l}</span>
                    <span className="font-medium text-foreground">{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Recent + alerts */}
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="text-base font-semibold text-foreground">Recent Readings</h3>
            <p className="mb-4 text-xs text-muted-foreground">Latest sensor readings from the system</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="pb-3 font-medium">Parameter</th>
                    <th className="pb-3 font-medium">Value</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r) => (
                    <tr key={r.param} className="border-t border-border/60">
                      <td className="py-3">
                        <span className="inline-flex items-center gap-2 font-medium text-foreground">
                          <r.Icon className="h-4 w-4" style={{ color: r.color }} /> {r.param}
                        </span>
                      </td>
                      <td className="py-3 font-medium text-foreground">{r.value}</td>
                      <td className="py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${
                          r.ok
                            ? "bg-[var(--eco-green-soft)] text-[var(--eco-green)] ring-[var(--eco-green)]/30"
                            : "bg-[var(--eco-orange-soft)] text-[var(--eco-orange)] ring-[var(--eco-orange)]/30"
                        }`}>{r.status}</span>
                      </td>
                      <td className="py-3 text-right text-muted-foreground">{r.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <a href="#" className="mt-3 block text-center text-sm font-medium text-[var(--eco-blue)]">View All Readings →</a>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">Recent Alerts</h3>
                <p className="text-xs text-muted-foreground">Latest system alerts and notifications</p>
              </div>
              <a href="#" className="text-xs font-medium text-[var(--eco-blue)]">View All Alerts →</a>
            </div>
            <div className="space-y-2.5">
              {alerts.map((a) => <AlertItem key={a.title} {...a as any} />)}
              <AlertItem type="ok" title="All Systems Normal" detail="Everything is working fine" time="10:10 AM" />
            </div>
          </div>
        </section>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Leaf className="h-3.5 w-3.5 text-[var(--eco-green)]" /> Powered by EcoSense IoT
        </div>
      </main>
    </div>
  );
}
