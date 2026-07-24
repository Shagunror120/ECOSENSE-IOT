import { Area, AreaChart, ResponsiveContainer } from "recharts";
import type { LucideIcon } from "lucide-react";

export type MetricTone = "blue" | "green" | "orange" | "purple" | "emerald" | "amber";

const tones: Record<MetricTone, { bg: string; ring: string; color: string; chart: string }> = {
  blue: {
    bg: "var(--eco-blue-soft)",
    ring: "var(--eco-blue)",
    color: "var(--eco-blue)",
    chart: "var(--chart-1)",
  },
  green: {
    bg: "var(--eco-green-soft)",
    ring: "var(--eco-green)",
    color: "var(--eco-green)",
    chart: "var(--chart-2)",
  },
  orange: {
    bg: "var(--eco-orange-soft)",
    ring: "var(--eco-orange)",
    color: "var(--eco-orange)",
    chart: "var(--chart-3)",
  },
  purple: {
    bg: "var(--eco-purple-soft)",
    ring: "var(--eco-purple)",
    color: "var(--eco-purple)",
    chart: "var(--chart-4)",
  },
  emerald: {
    bg: "var(--eco-green-soft)",
    ring: "var(--eco-green)",
    color: "var(--eco-green)",
    chart: "var(--chart-2)",
  },
  amber: {
    bg: "var(--eco-orange-soft)",
    ring: "var(--eco-orange)",
    color: "var(--eco-orange)",
    chart: "var(--chart-3)",
  },
};

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  unit?: string;
  status: string;
  statusColor?: "green" | "orange" | "blue";
  tone: MetricTone;
  data: number[];
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  status,
  statusColor = "green",
  tone,
  data,
}: Props) {
  const t = tones[tone];
  const chartData = data.map((v, i) => ({ i, v }));
  const dot =
    statusColor === "green"
      ? "var(--eco-green)"
      : statusColor === "orange"
        ? "var(--eco-orange)"
        : "var(--eco-blue)";
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: t.bg }}>
          <Icon className="h-5 w-5" style={{ color: t.color }} />
        </div>
      </div>
      <div className="mt-3 text-sm font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        {unit && <span className="text-sm font-medium text-muted-foreground">{unit}</span>}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />
          {status}
        </div>
        <div className="h-8 w-20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`g-${tone}-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={t.chart} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={t.chart} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={t.chart}
                strokeWidth={2}
                fill={`url(#g-${tone}-${label})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
