import { Leaf } from "lucide-react";

export function Logo({ subtitle = "Smart Environment Monitoring" }: { subtitle?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--eco-green-soft)] ring-1 ring-[var(--eco-green)]/20">
        <Leaf className="h-5 w-5 text-[var(--eco-green)]" />
      </div>
      <div className="leading-tight">
        <div className="text-lg font-bold text-[var(--eco-green)]">EcoSense IoT</div>
        <div className="text-[11px] text-muted-foreground">{subtitle}</div>
      </div>
    </div>
  );
}
