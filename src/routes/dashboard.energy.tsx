import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Battery,
  Sun,
  Zap,
  Cpu,
  ChevronDown,
  Bell,
  ArrowRight,
  Gauge,
  CheckCircle,
} from "lucide-react";
import { Area, AreaChart, LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

export const Route = createFileRoute("/dashboard/energy")({
  component: EnergyPage,
  head: () => ({
    meta: [{ title: "Energy Monitor - EcoSense IoT" }],
  }),
});

// Mock data for 24 Hours trends
const batteryTrend = [
  { time: "00:00", level: 95 },
  { time: "02:00", level: 90 },
  { time: "04:00", level: 82 },
  { time: "06:00", level: 75 },
  { time: "08:00", level: 70 },
  { time: "10:00", level: 72 },
  { time: "12:00", level: 76 },
  { time: "14:00", level: 80 },
  { time: "16:00", level: 84 },
  { time: "18:00", level: 78 },
  { time: "20:00", level: 72 },
  { time: "22:00", level: 68 },
  { time: "24:00", level: 65 },
];

const powerCompareTrend = [
  { time: "00:00", solar: 0, load: 1.2 },
  { time: "02:00", solar: 0, load: 1.1 },
  { time: "04:00", solar: 0, load: 1.0 },
  { time: "06:00", solar: 0.5, load: 1.2 },
  { time: "08:00", solar: 2.1, load: 1.4 },
  { time: "10:00", solar: 4.8, load: 1.6 },
  { time: "12:00", solar: 6.2, load: 1.8 },
  { time: "14:00", solar: 5.5, load: 2.1 },
  { time: "16:00", solar: 4.2, load: 1.7 },
  { time: "18:00", solar: 1.8, load: 1.5 },
  { time: "20:00", solar: 0, load: 1.3 },
  { time: "22:00", solar: 0, load: 1.2 },
  { time: "24:00", solar: 0, load: 1.2 },
];

function EnergyPage() {
  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <header className="mb-4 flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[var(--eco-green)] text-sm font-bold text-white">
            4
          </span>
          <h1 className="text-xl font-bold text-foreground">Energy Monitoring Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Sun className="h-5 w-5 text-yellow-500" />
            <div>
              <div className="font-semibold text-foreground">25°C</div>
              <div className="text-xs text-muted-foreground font-medium">Sunny</div>
            </div>
          </div>
          <Link to="/dashboard/alerts" className="relative grid h-9 w-9 place-items-center rounded-full border bg-card hover:bg-muted">
            <Bell className="h-4.5 w-4.5 text-foreground/70" />
            <span className="absolute -top-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-[var(--destructive)] text-[10px] font-bold text-white">
              3
            </span>
          </Link>
          <div className="flex items-center gap-2 rounded-xl bg-card px-3 py-1.5 border">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-[var(--eco-blue)] text-xs font-bold text-white">
              TE
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </header>

      {/* Main Title Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Energy Monitoring</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track energy harvesting, battery status, and power consumption in real-time.
          </p>
        </div>
      </div>

      {/* 4 Premium Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Battery Level Card */}
        <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)] flex justify-between items-center">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">Battery Level</div>
            <div className="text-3xl font-extrabold text-foreground">78 %</div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--eco-green)] font-semibold mt-1">
              <span className="h-2 w-2 rounded-full bg-[var(--eco-green)] animate-pulse" />
              Charging
            </div>
          </div>
          {/* Vertical Battery Indicator */}
          <div className="relative w-10 h-16 border-2 border-muted-foreground/30 rounded-lg p-0.5 flex flex-col justify-end">
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-muted-foreground/30 rounded-t-sm" />
            <div className="w-full bg-[var(--eco-green)] rounded-[4px] transition-all" style={{ height: "78%" }} />
          </div>
        </div>

        {/* Solar Input Card */}
        <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)] flex justify-between items-center">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">Solar Input</div>
            <div className="text-3xl font-extrabold text-foreground">4.2 w</div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--eco-green)] font-semibold mt-1">
              <span className="h-2 w-2 rounded-full bg-[var(--eco-green)]" />
              Active
            </div>
          </div>
          {/* Solar Panel Icon Grid */}
          <div className="w-14 h-14 bg-[var(--eco-blue-soft)] rounded-xl flex flex-col p-1.5 gap-1 border border-[var(--eco-blue)]/20 shadow-inner">
            <div className="grid grid-cols-3 gap-0.5 flex-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-[var(--eco-blue)] rounded-sm opacity-80" />
              ))}
            </div>
            <div className="h-1 bg-[var(--eco-orange)] rounded-full w-full" />
          </div>
        </div>

        {/* Power Consumption Card */}
        <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)] flex justify-between items-center">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">Power Consumption</div>
            <div className="text-3xl font-extrabold text-foreground">1.6 w</div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--eco-green)] font-semibold mt-1">
              <span className="h-2 w-2 rounded-full bg-[var(--eco-green)]" />
              Normal
            </div>
          </div>
          {/* Power Meter Gauge / Circular Indicator */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="28" cy="28" r="22" className="stroke-muted fill-none" strokeWidth="4" />
              <circle
                cx="28"
                cy="28"
                r="22"
                className="stroke-[var(--eco-blue)] fill-none"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 22}
                strokeDashoffset={2 * Math.PI * 22 * (1 - 1.6 / 5.0)}
                strokeLinecap="round"
              />
            </svg>
            <Zap className="absolute h-5 w-5 text-[var(--eco-blue)]" />
          </div>
        </div>

        {/* System Mode Card */}
        <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)] flex justify-between items-center">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">System Mode</div>
            <div className="text-3xl font-extrabold text-foreground">Active</div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--eco-green)] font-semibold mt-1">
              <span className="h-2 w-2 rounded-full bg-[var(--eco-green)]" />
              Normal Operation
            </div>
          </div>
          {/* Chip/CPU representation */}
          <div className="relative w-14 h-14 bg-[var(--eco-purple-soft)] rounded-xl border border-[var(--eco-purple)]/20 flex items-center justify-center p-2 shadow-inner">
            <Cpu className="h-7 w-7 text-[var(--eco-purple)]" />
            <div className="absolute top-0 inset-x-2 flex justify-between"><div className="w-0.5 h-1 bg-[var(--eco-purple)]" /><div className="w-0.5 h-1 bg-[var(--eco-purple)]" /><div className="w-0.5 h-1 bg-[var(--eco-purple)]" /></div>
            <div className="absolute bottom-0 inset-x-2 flex justify-between"><div className="w-0.5 h-1 bg-[var(--eco-purple)]" /><div className="w-0.5 h-1 bg-[var(--eco-purple)]" /><div className="w-0.5 h-1 bg-[var(--eco-purple)]" /></div>
            <div className="absolute left-0 inset-y-2 flex flex-col justify-between"><div className="w-1 h-0.5 bg-[var(--eco-purple)]" /><div className="w-1 h-0.5 bg-[var(--eco-purple)]" /><div className="w-1 h-0.5 bg-[var(--eco-purple)]" /></div>
            <div className="absolute right-0 inset-y-2 flex flex-col justify-between"><div className="w-1 h-0.5 bg-[var(--eco-purple)]" /><div className="w-1 h-0.5 bg-[var(--eco-purple)]" /><div className="w-1 h-0.5 bg-[var(--eco-purple)]" /></div>
          </div>
        </div>
      </section>

      {/* Grid for Trends and Flow */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Battery Level Trend */}
        <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Battery Level Trend (%)</h3>
            <div className="flex items-center gap-1 rounded-md border bg-card px-2 py-1 text-xs text-muted-foreground font-semibold cursor-pointer">
              <span>24 Hours</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={batteryTrend} margin={{ left: -20, right: 6, top: 6, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBattery" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--eco-green)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--eco-green)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={30} domain={[40, 100]} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="level" stroke="var(--eco-green)" strokeWidth={2} fill="url(#colorBattery)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Solar Input vs Power Consumption */}
        <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Solar Input vs Power Consumption (W)</h3>
            <div className="flex items-center gap-1 rounded-md border bg-card px-2 py-1 text-xs text-muted-foreground font-semibold cursor-pointer">
              <span>24 Hours</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={powerCompareTrend} margin={{ left: -20, right: 6, top: 6, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={25} domain={[0, 8]} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, fontWeight: 600 }} />
                <Line type="monotone" dataKey="solar" name="Solar Input (W)" stroke="var(--eco-green)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="load" name="Power Consumption (W)" stroke="red" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Energy Flow */}
        <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground mb-4">Energy Flow</h3>
            <div className="grid grid-cols-5 gap-1 items-center bg-muted/30 rounded-xl p-3 border">
              {[
                { label: "Solar Panel", icon: Sun, color: "var(--eco-orange)" },
                { label: "Charging Circuit", icon: Zap, color: "var(--eco-orange)" },
                { label: "Battery", icon: Battery, color: "var(--eco-green)" },
                { label: "ESP32", icon: Cpu, color: "var(--eco-blue)" },
                { label: "Sensors", icon: Gauge, color: "var(--eco-purple)" },
              ].map((item, idx, arr) => (
                <div key={item.label} className="contents">
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-card border shadow-sm">
                      <item.icon className="h-5 w-5" style={{ color: item.color }} />
                    </span>
                    <span className="text-[9px] text-center font-bold text-muted-foreground whitespace-pre-line leading-tight">
                      {item.label}
                    </span>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="flex justify-center">
                      <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-[var(--eco-green-soft)] p-3 border border-[var(--eco-green)]/20 text-xs font-semibold text-[var(--eco-green)]">
            <CheckCircle className="h-4 w-4" />
            <span>Energy harvesting system is operating efficiently.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
