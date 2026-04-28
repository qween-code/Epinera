import { cn } from "@/lib/utils";
import type { Severity } from "@/lib/types";

const STYLES: Record<Severity | string, string> = {
  info: "bg-elev text-muted border-border",
  low: "bg-emerald-900/30 text-emerald-300 border-emerald-700/50",
  medium: "bg-amber-900/30 text-amber-300 border-amber-700/50",
  high: "bg-orange-900/30 text-orange-300 border-orange-700/50",
  critical: "bg-rose-900/40 text-rose-300 border-rose-700/60",
};

export function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded text-xs font-medium border uppercase tracking-wide",
        STYLES[severity] ?? STYLES.info,
      )}
    >
      {severity}
    </span>
  );
}
