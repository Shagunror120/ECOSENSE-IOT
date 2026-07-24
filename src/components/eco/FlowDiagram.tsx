import { Sun, BatteryCharging, Cpu, Cloud, MonitorSmartphone, ChevronRight } from "lucide-react";

const steps = [
  { Icon: Sun, label: "Solar Panel", color: "var(--eco-orange)", bg: "var(--eco-orange-soft)" },
  {
    Icon: BatteryCharging,
    label: "Battery",
    color: "var(--eco-green)",
    bg: "var(--eco-green-soft)",
  },
  { Icon: Cpu, label: "ESP32", color: "var(--eco-blue)", bg: "var(--eco-blue-soft)" },
  { Icon: Cloud, label: "Cloud", color: "var(--eco-blue)", bg: "var(--eco-blue-soft)" },
  {
    Icon: MonitorSmartphone,
    label: "Dashboard",
    color: "var(--eco-purple)",
    bg: "var(--eco-purple-soft)",
  },
];

export function FlowDiagram() {
  return (
    <div>
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-2">
              <div
                className="grid h-14 w-14 place-items-center rounded-2xl"
                style={{ background: s.bg }}
              >
                <s.Icon className="h-7 w-7" style={{ color: s.color }} />
              </div>
              <div className="text-xs font-medium text-foreground">{s.label}</div>
            </div>
            {i < steps.length - 1 && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="relative h-1 flex-1 rounded-full bg-[var(--eco-green-soft)]">
          <div className="absolute inset-y-0 left-0 w-full rounded-full bg-[var(--eco-green)]/60" />
          {steps.map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[var(--eco-green)]"
              style={{
                left: `${(i / (steps.length - 1)) * 100}%`,
                transform: `translate(-50%, -50%)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
