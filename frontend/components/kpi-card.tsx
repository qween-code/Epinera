import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: number | string;
  sub?: string;
  tone?: "default" | "success" | "warn" | "danger" | "accent";
  icon?: React.ReactNode;
  className?: string;
}

const TONES = {
  default: "border-border bg-surface",
  success: "border-emerald-700/40 bg-emerald-900/10",
  warn: "border-amber-700/40 bg-amber-900/10",
  danger: "border-rose-700/40 bg-rose-900/10",
  accent: "border-accent/30 bg-accent/5",
};

const TEXT_TONES = {
  default: "text-text",
  success: "text-emerald-300",
  warn: "text-amber-300",
  danger: "text-rose-300",
  accent: "text-accent",
};

export function KpiCard({
  label,
  value,
  sub,
  tone = "default",
  icon,
  className,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border px-4 py-3 flex flex-col gap-1",
        TONES[tone],
        className,
      )}
    >
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{label}</span>
        {icon && <span>{icon}</span>}
      </div>
      <div className={cn("text-2xl font-semibold", TEXT_TONES[tone])}>
        {value}
      </div>
      {sub && <div className="text-xs text-muted">{sub}</div>}
    </div>
  );
}
