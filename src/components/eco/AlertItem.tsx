import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

interface Props {
  type: "warn" | "ok" | "info";
  title: string;
  detail: string;
  time: string;
}

const map = {
  warn: { Icon: AlertTriangle, color: "var(--eco-orange)", bg: "var(--eco-orange-soft)" },
  ok:   { Icon: CheckCircle2,  color: "var(--eco-green)",  bg: "var(--eco-green-soft)" },
  info: { Icon: Info,          color: "var(--eco-blue)",   bg: "var(--eco-blue-soft)" },
} as const;

export function AlertItem({ type, title, detail, time }: Props) {
  const { Icon, color, bg } = map[type];
  return (
    <div className="flex items-start gap-3 rounded-xl p-3" style={{ background: bg }}>
      <Icon className="h-5 w-5 shrink-0" style={{ color }} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate text-sm font-semibold" style={{ color }}>{title}</div>
          <div className="shrink-0 text-xs text-muted-foreground">{time}</div>
        </div>
        <div className="text-xs text-muted-foreground">{detail}</div>
      </div>
    </div>
  );
}
