import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Calendar,
  Download,
  Sun,
  Bell,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

export const Route = createFileRoute("/dashboard/analytics")({
  component: AnalyticsPage,
  head: () => ({
    meta: [{ title: "Analytics - EcoSense IoT" }],
  }),
});

// Sparkline & chart data
const sparklineDataTemp = [
  { v: 24.2 }, { v: 24.8 }, { v: 25.5 }, { v: 26.0 }, { v: 26.8 }, { v: 27.2 }, { v: 27.6 }
];
const sparklineDataHum = [
  { v: 61.2 }, { v: 61.8 }, { v: 62.5 }, { v: 62.0 }, { v: 63.1 }, { v: 63.8 }, { v: 64.3 }
];
const sparklineDataAqi = [
  { v: 106 }, { v: 108 }, { v: 110 }, { v: 109 }, { v: 112 }, { v: 115 }, { v: 118 }
];
const sparklineDataPres = [
  { v: 1016 }, { v: 1015 }, { v: 1014 }, { v: 1014 }, { v: 1013 }, { v: 1012 }, { v: 1012 }
];

const weeklyData = [
  { name: "12 May", temp: 24.2, hum: 61.2, aqi: 106, pres: 1016 },
  { name: "13 May", temp: 26.5, hum: 58.5, aqi: 95, pres: 1012 },
  { name: "14 May", temp: 27.8, hum: 55.0, aqi: 112, pres: 1014 },
  { name: "15 May", temp: 26.0, hum: 52.5, aqi: 90, pres: 1011 },
  { name: "16 May", temp: 28.5, hum: 56.8, aqi: 105, pres: 1013 },
  { name: "17 May", temp: 26.8, hum: 54.2, aqi: 92, pres: 1010 },
  { name: "18 May", temp: 28.2, hum: 51.0, aqi: 130, pres: 1015 },
  { name: "19 May", temp: 27.6, hum: 56.3, aqi: 118, pres: 1012 },
];

interface SparklineProps {
  title: string;
  value: string;
  unit: string;
  change: string;
  changeType: "up" | "down" | "stable";
  data: { v: number }[];
  color: string;
  icon: any;
  bgLight: string;
}

function SparklineMetricCard({
  title,
  value,
  unit,
  change,
  changeType,
  data,
  color,
  icon: Icon,
  bgLight,
}: SparklineProps) {
  const chartData = data.map((d, index) => ({ index, v: d.v }));
  const trendColor = changeType === "up" ? "text-emerald-600" : changeType === "down" ? "text-blue-600" : "text-muted-foreground";
  const trendSymbol = changeType === "up" ? "↑" : changeType === "down" ? "↓" : "→";

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)] flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-1">{title}</div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">{value}</span>
            <span className="text-sm font-semibold text-muted-foreground">{unit}</span>
          </div>
          <div className={`mt-2 flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
            <span>{trendSymbol} {change}</span>
            <span className="text-muted-foreground font-normal">(vs last 7 days)</span>
          </div>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: bgLight }}>
          <Icon className="h-5 w-5" style={{ color: color }} />
        </div>
      </div>
      <div className="h-10 mt-3 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`spark-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={2}
              fill={`url(#spark-${title})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Top Header Bar matching Layout Header */}
      <header className="mb-4 flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[var(--eco-green)] text-sm font-bold text-white">
            3
          </span>
          <h1 className="text-xl font-bold text-foreground">Analytics Dashboard</h1>
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
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Sensor Analytics</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Visualize historical trends and real-time insights of environmental data.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>May 12, 2024 - May 19, 2024</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
          </div>
          <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--eco-green)] px-4 text-sm font-medium text-white shadow-sm hover:bg-[var(--eco-green)]/90">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
            <span className="text-xs opacity-75">↓</span>
          </button>
        </div>
      </div>

      {/* 4 Sparkline Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SparklineMetricCard
          title="Avg. Temperature"
          value="27.6"
          unit="°C"
          change="1.8 °C"
          changeType="up"
          data={sparklineDataTemp}
          color="var(--eco-blue)"
          bgLight="var(--eco-blue-soft)"
          icon={Thermometer}
        />
        <SparklineMetricCard
          title="Avg. Humidity"
          value="64.3"
          unit="%"
          change="3.2 %"
          changeType="up"
          data={sparklineDataHum}
          color="var(--eco-green)"
          bgLight="var(--eco-green-soft)"
          icon={Droplets}
        />
        <SparklineMetricCard
          title="Avg. Air Quality (AQI)"
          value="118"
          unit=""
          change="12"
          changeType="up"
          data={sparklineDataAqi}
          color="var(--eco-orange)"
          bgLight="var(--eco-orange-soft)"
          icon={Wind}
        />
        <SparklineMetricCard
          title="Avg. Pressure"
          value="1012"
          unit="hPa"
          change="4 hPa"
          changeType="down"
          data={sparklineDataPres}
          color="var(--eco-purple)"
          bgLight="var(--eco-purple-soft)"
          icon={Gauge}
        />
      </section>

      {/* Four Detailed Charts */}
      <section className="grid gap-6 sm:grid-cols-2">
        {/* Temperature chart */}
        <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Temperature (°C)</h3>
            <div className="flex items-center gap-1 rounded-md border bg-card px-2 py-1 text-xs text-muted-foreground font-semibold cursor-pointer">
              <span>7 Days</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ left: -20, right: 6, top: 6, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--eco-blue)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--eco-blue)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={30} domain={[20, 38]} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="temp" stroke="var(--eco-blue)" strokeWidth={2} fill="url(#colorTemp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Humidity chart */}
        <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Humidity (%)</h3>
            <div className="flex items-center gap-1 rounded-md border bg-card px-2 py-1 text-xs text-muted-foreground font-semibold cursor-pointer">
              <span>7 Days</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ left: -20, right: 6, top: 6, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--eco-green)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--eco-green)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={30} domain={[40, 100]} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="hum" stroke="var(--eco-green)" strokeWidth={2} fill="url(#colorHum)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AQI Chart */}
        <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Air Quality Index (AQI)</h3>
            <div className="flex items-center gap-1 rounded-md border bg-card px-2 py-1 text-xs text-muted-foreground font-semibold cursor-pointer">
              <span>7 Days</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ left: -20, right: 6, top: 6, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--eco-orange)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--eco-orange)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={30} domain={[0, 200]} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="aqi" stroke="var(--eco-orange)" strokeWidth={2} fill="url(#colorAqi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pressure Chart */}
        <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Pressure (hPa)</h3>
            <div className="flex items-center gap-1 rounded-md border bg-card px-2 py-1 text-xs text-muted-foreground font-semibold cursor-pointer">
              <span>7 Days</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ left: -20, right: 6, top: 6, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPres" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--eco-purple)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--eco-purple)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={30} domain={[990, 1030]} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="pres" stroke="var(--eco-purple)" strokeWidth={2} fill="url(#colorPres)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Footer / Insights Summary Bar */}
      <footer className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-[var(--eco-green)] text-sm">
            <Activity className="h-5 w-5" />
            <span>Insights Summary</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--eco-blue-soft)]">
                <Thermometer className="h-4 w-4 text-[var(--eco-blue)]" />
              </span>
              <span>Temperature increased by 1.8 °C compared to last 7 days.</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--eco-green-soft)]">
                <Droplets className="h-4 w-4 text-[var(--eco-green)]" />
              </span>
              <span>Humidity decreased by 3.2 % compared to last 7 days.</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--eco-orange-soft)]">
                <Wind className="h-4 w-4 text-[var(--eco-orange)]" />
              </span>
              <span>AQI is higher than usual. Monitor air quality.</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--eco-purple-soft)]">
                <Gauge className="h-4 w-4 text-[var(--eco-purple)]" />
              </span>
              <span>Pressure is stable. No significant change detected.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
