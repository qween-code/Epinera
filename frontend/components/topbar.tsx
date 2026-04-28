"use client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiFetch, clearToken } from "@/lib/api";
import { StatusPill } from "@/components/status-pill";
import type { SystemStatus } from "@/lib/types";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const router = useRouter();
  const status = useQuery<SystemStatus>({
    queryKey: ["system-status"],
    queryFn: () => apiFetch<SystemStatus>("/system/status"),
    refetchInterval: 30_000,
  });

  return (
    <div className="h-14 border-b border-border bg-surface px-6 flex items-center justify-between">
      <div>
        <h1 className="text-sm font-semibold">{title}</h1>
        {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {status.data && (
          <>
            <StatusPill
              ok={status.data.ai.openrouter_reachable || status.data.ai.ollama_reachable}
              label="AI"
              detail={`primary=${status.data.ai.primary} · text=${status.data.ai.models.text}`}
            />
            <StatusPill
              ok={status.data.promanage.configured}
              label="ProManage"
              detail={
                status.data.promanage.configured
                  ? `mode=${status.data.promanage.stream_mode}`
                  : "PROMANAGE_LOG_STREAM_URL boş"
              }
            />
            <StatusPill
              ok={status.data.ticket.smtp_configured}
              label="SMTP"
              detail={status.data.ticket.to_email || "SMTP_HOST boş"}
            />
          </>
        )}
        <button
          onClick={() => {
            clearToken();
            router.push("/");
          }}
          className="flex items-center gap-2 text-xs text-muted hover:text-text px-2 py-1 rounded-md hover:bg-elev"
        >
          <LogOut size={14} /> Çıkış
        </button>
      </div>
    </div>
  );
}
