import { cn } from "@/lib/utils";

interface StatusPillProps {
  ok: boolean;
  label: string;
  detail?: string;
}

export function StatusPill({ ok, label, detail }: StatusPillProps) {
  return (
    <div
      className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-border bg-elev text-xs"
      title={detail || (ok ? "OK" : "down")}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          ok ? "bg-success" : "bg-danger animate-pulse",
        )}
      />
      <span className="text-muted">{label}</span>
      <span className={cn(ok ? "text-success" : "text-danger")}>
        {ok ? "ok" : "down"}
      </span>
    </div>
  );
}
