import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/eco/Logo";
import { MetricCard } from "@/components/eco/MetricCard";
import { AlertItem } from "@/components/eco/AlertItem";
import { FlowDiagram } from "@/components/eco/FlowDiagram";
import { LiveChart } from "@/components/eco/LiveChart";
import { metrics, alerts, liveSeries } from "@/lib/eco-data";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, BarChart3, Network, Radio, Thermometer, Droplets, Wind, Gauge,
  Bell, Bot, Cloud, Cpu, Database, Globe, Leaf, Sparkles, Activity, Github, Linkedin, Twitter, Instagram,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoSense IoT — Battery-Free Smart Environmental Monitoring" },
      { name: "description", content: "An IoT-based system that monitors environmental parameters in real-time using energy harvesting technology." },
    ],
  }),
  component: LandingPage,
});

const navItems = ["Home", "Dashboard", "Analytics", "Energy Monitor", "Alerts", "About", "Team"];

const features = [
  { Icon: Radio,    title: "Real-time Monitoring", desc: "Live sensor data visualization", color: "var(--eco-blue)",   bg: "var(--eco-blue-soft)" },
  { Icon: Bell,     title: "Smart Alerts",         desc: "Threshold-based notifications", color: "var(--eco-orange)", bg: "var(--eco-orange-soft)" },
  { Icon: Leaf,     title: "Energy Harvesting",    desc: "Solar powered, battery-free",   color: "var(--eco-green)",  bg: "var(--eco-green-soft)" },
  { Icon: BarChart3,title: "Data Analytics",       desc: "Trends and insights",           color: "var(--eco-purple)", bg: "var(--eco-purple-soft)" },
  { Icon: Cloud,    title: "Cloud Storage",        desc: "Secure data in the cloud",      color: "var(--eco-blue)",   bg: "var(--eco-blue-soft)" },
  { Icon: Globe,    title: "Remote Access",        desc: "Access from anywhere",          color: "var(--eco-pink)",   bg: "var(--eco-purple-soft)" },
];

const team = [
  { name: "Shagun Ror",    role: "", color: "var(--eco-orange)" },
  { name: "Vaishnavi Saxena", role: "", color: "var(--eco-purple)" },
  { name: "Ananya",        role: "", color: "var(--eco-blue)" },
];

const tech = ["ESP32", "Node.js", "Express.js", "MongoDB", "React.js", "Chart.js"];

function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--gradient-hero)]">
      {/* Top nav */}
      <header className="border-b border-border/60 bg-card/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <Logo />
          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((n, i) => (
              <a key={n} href={n === "Dashboard" ? "/dashboard" : "#"}
                 className={`text-sm font-medium transition-colors ${i === 0 ? "text-[var(--eco-green)]" : "text-foreground/70 hover:text-foreground"}`}>
                {n}
                {i === 0 && <div className="mt-1 h-0.5 w-full rounded-full bg-[var(--eco-green)]" />}
              </a>
            ))}
          </nav>
          <Button className="bg-[var(--eco-green)] text-white hover:bg-[var(--eco-green)]/90">
            <Radio className="mr-2 h-4 w-4" /> Live Simulation
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        {/* Hero */}
        <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr_0.9fr]">
          <div className="space-y-5">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
              Battery-Free<br />
              <span className="text-[var(--eco-green)]">Smart Environmental</span><br />
              <span className="text-[var(--eco-blue)]">Monitoring System</span>
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              An IoT-based system that monitors environmental parameters in real-time using energy harvesting technology and provides intelligent insights through a smart dashboard.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild className="bg-[var(--eco-green)] text-white hover:bg-[var(--eco-green)]/90">
                <Link to="/dashboard">Open Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" className="border-[var(--eco-blue)] text-[var(--eco-blue)] hover:bg-[var(--eco-blue-soft)]">
                <Activity className="mr-2 h-4 w-4" /> View Live Data
              </Button>
              <Button variant="ghost" className="text-foreground">
                <Network className="mr-2 h-4 w-4" /> System Architecture
              </Button>
            </div>
          </div>

          {/* Illustration block */}
          <div className="relative grid place-items-center rounded-3xl bg-gradient-to-br from-[var(--eco-blue-soft)] to-[var(--eco-green-soft)] p-6">
            <div className="absolute left-6 top-6 grid h-10 w-10 place-items-center rounded-full bg-yellow-300">
              <Sparkles className="h-5 w-5 text-yellow-700" />
            </div>
            <div className="grid grid-cols-2 items-end gap-3">
              <div className="grid h-32 w-32 grid-cols-4 grid-rows-4 gap-0.5 rounded-md bg-blue-900 p-1">
                {Array.from({ length: 16 }).map((_, i) => <div key={i} className="rounded-sm bg-blue-400/80" />)}
              </div>
              <div className="grid h-36 w-28 place-items-center rounded-md bg-slate-800 text-[10px] font-mono text-emerald-300 shadow-inner">
                <Cpu className="h-10 w-10 text-emerald-300" />
                <span>ESP32</span>
              </div>
            </div>
            <div className="absolute right-4 top-1/4 space-y-2">
              {[
                { Icon: Thermometer, label: "Temperature", color: "var(--eco-blue)",   bg: "var(--card)" },
                { Icon: Droplets,    label: "Humidity",    color: "var(--eco-green)",  bg: "var(--card)" },
                { Icon: Gauge,       label: "Pressure",    color: "var(--eco-orange)", bg: "var(--card)" },
                { Icon: Wind,        label: "Air Quality", color: "var(--eco-purple)", bg: "var(--card)" },
              ].map(({ Icon, label, color, bg }) => (
                <div key={label} className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium shadow-sm" style={{ background: bg, color }}>
                  <Icon className="h-4 w-4" /> {label}
                </div>
              ))}
            </div>
          </div>

          {/* System status */}
          <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-lg font-semibold">System Status</div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--eco-green-soft)] px-2.5 py-1 text-xs font-medium text-[var(--eco-green)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--eco-green)]" /> ONLINE
              </span>
            </div>
            {[
              { label: "Device ID",     value: "ES-2024-001" },
              { label: "Uptime",        value: "2d 14h 32m" },
              { label: "Last Updated",  value: "10:24:30 AM" },
              { label: "Connection",    value: "Excellent" },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between border-b border-border/60 py-2.5 text-sm last:border-0">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Leaf className="h-3.5 w-3.5 text-[var(--eco-green)]" /> {r.label}
                </span>
                <span className="font-medium text-foreground">{r.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Metric strip */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
        </section>

        {/* Flow + Architecture + Alerts */}
        <section className="grid gap-4 lg:grid-cols-[1.1fr_1.1fr_0.9fr]">
          <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--eco-green)]">
              <Sparkles className="h-4 w-4" /> Energy Harvesting Flow
            </h3>
            <FlowDiagram />
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-4 text-base font-semibold text-[var(--eco-green)]">System Architecture</h3>
            <div className="flex items-center justify-between gap-2 overflow-x-auto">
              {[
                { label: "Sensors", items: ["Temperature", "Humidity", "Pressure", "Air Quality"], color: "var(--eco-green)", bg: "var(--eco-green-soft)" },
                { label: "ESP32", subtitle: "Microcontroller", color: "var(--eco-blue)", bg: "var(--eco-blue-soft)" },
                { label: "Backend", subtitle: "Server", color: "var(--eco-purple)", bg: "var(--eco-purple-soft)" },
                { label: "Database", subtitle: "(MongoDB)", color: "var(--eco-orange)", bg: "var(--eco-orange-soft)" },
                { label: "Dashboard", subtitle: "(Web App)", color: "var(--eco-green)", bg: "var(--eco-green-soft)" },
              ].map((b, i, arr) => (
                <div key={b.label} className="flex items-center gap-1">
                  <div className="min-w-[110px] rounded-xl p-3 text-center" style={{ background: b.bg }}>
                    <div className="text-xs font-bold" style={{ color: b.color }}>{b.label}</div>
                    {b.subtitle && <div className="text-[10px] text-muted-foreground">{b.subtitle}</div>}
                    {b.items && (
                      <ul className="mt-1 space-y-0.5 text-[10px] text-foreground/80">
                        {b.items.map((it) => <li key={it}>• {it}</li>)}
                      </ul>
                    )}
                    <div className="mx-auto mt-2 grid h-8 w-8 place-items-center rounded-md bg-white/70">
                      {[Bot, Cpu, Database, Database, BarChart3][i] && (() => {
                        const I = [Radio, Cpu, Cloud, Database, BarChart3][i];
                        return <I className="h-4 w-4" style={{ color: b.color }} />;
                      })()}
                    </div>
                  </div>
                  {i < arr.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--eco-green)]">
              <Bell className="h-4 w-4" /> Quick Alerts
            </h3>
            <div className="space-y-2.5">
              {alerts.map((a) => <AlertItem key={a.title} {...a as any} />)}
            </div>
            <a href="#" className="mt-3 block text-right text-xs font-medium text-[var(--eco-blue)]">View All Alerts</a>
          </div>
        </section>

        {/* Live monitoring + Key features */}
        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--eco-green)]">
              <Activity className="h-4 w-4" /> Live Monitoring (Real-Time)
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <LiveChart title="Temperature (°C)"   value="28.6 °C" data={liveSeries(28, 4)} color="var(--eco-blue)" />
              <LiveChart title="Humidity (%)"       value="65 %"    data={liveSeries(65, 10)} color="var(--eco-green)" />
              <LiveChart title="Air Quality (AQI)"  value="120"     data={liveSeries(120, 30)} color="var(--eco-orange)" />
              <LiveChart title="Battery Level (%)"  value="78 %"    data={liveSeries(78, 6)} color="var(--eco-green)" />
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--eco-green)]">
              <Sparkles className="h-4 w-4" /> Key Features
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {features.map(({ Icon, title, desc, color, bg }) => (
                <div key={title} className="flex items-start gap-3 rounded-xl border bg-background/50 p-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ background: bg }}>
                    <Icon className="h-4 w-4" style={{ color }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground">{title}</div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team + About + Tech */}
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--eco-green)]">
              <Sparkles className="h-4 w-4" /> Our Team
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {team.map((p) => (
                <div key={p.name} className="text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full text-lg font-bold text-white"
                       style={{ background: p.color }}>
                    {p.name.split(" ").map((w) => w[0]).join("")}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-foreground">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.role}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-[var(--eco-green)]">
              <Leaf className="h-4 w-4" /> About Project
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This project aims to develop a sustainable, battery-free environmental monitoring system using energy harvesting techniques. It collects real-time data on temperature, humidity, pressure, and air quality to help in making smarter environmental decisions.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { label: "IoT",              color: "var(--eco-orange)", bg: "var(--eco-orange-soft)" },
                { label: "ESP32",            color: "var(--eco-blue)",   bg: "var(--eco-blue-soft)" },
                { label: "Energy Harvesting",color: "var(--eco-pink)",   bg: "var(--eco-purple-soft)" },
                { label: "Cloud",            color: "var(--eco-green)",  bg: "var(--eco-green-soft)" },
                { label: "AI/ML Ready",      color: "var(--eco-purple)", bg: "var(--eco-purple-soft)" },
              ].map((t) => (
                <span key={t.label} className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: t.bg, color: t.color }}>{t.label}</span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-4 text-base font-semibold text-[var(--eco-green)]">Technologies Used</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              {tech.map((t) => (
                <div key={t}>
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-muted text-sm font-bold text-foreground">
                    {t.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="mt-2 text-xs font-medium text-foreground">{t}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-center gap-3 border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
          <div>© 2024 EcoSense IoT. All Rights Reserved.</div>
          <div className="flex items-center gap-4">
            {[Github, Linkedin, Twitter, Instagram].map((I, i) => (
              <a key={i} href="#" className="text-foreground/70 hover:text-foreground"><I className="h-4 w-4" /></a>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
}
