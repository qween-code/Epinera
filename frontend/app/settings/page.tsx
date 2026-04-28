"use client";
import { useQuery } from "@tanstack/react-query";
import { TopBar } from "@/components/topbar";
import { StatusPill } from "@/components/status-pill";
import { Skeleton } from "@/components/skeleton";
import { apiFetch } from "@/lib/api";
import type { SystemStatus } from "@/lib/types";

export default function SettingsPage() {
  const status = useQuery<SystemStatus>({
    queryKey: ["system-status-page"],
    queryFn: () => apiFetch<SystemStatus>("/system/status"),
    refetchInterval: 15_000,
  });

  return (
    <>
      <TopBar
        title="Ayarlar"
        subtitle="Yapılandırma .env üzerinden yönetilir; bu sayfa canlı durumu gösterir"
      />
      <div className="p-6 space-y-6 max-w-3xl">
        <section>
          <h3 className="text-xs uppercase tracking-wide text-muted mb-2">
            Servis durumu
          </h3>
          {status.isLoading || !status.data ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <StatusPill
                ok={status.data.ai.openrouter_reachable}
                label="OpenRouter"
                detail={status.data.ai.openrouter_reachable ? "ulaşılabilir" : "OPENAI_COMPAT_API_KEY ya da ağ"}
              />
              <StatusPill
                ok={status.data.ai.ollama_reachable}
                label="Ollama (lokal)"
                detail={
                  status.data.ai.ollama_reachable
                    ? "embedding hazır"
                    : "ollama serve çalışıyor mu?"
                }
              />
              <StatusPill
                ok={status.data.infra.redis_reachable}
                label="Redis"
                detail="canlı log pub/sub"
              />
              <StatusPill
                ok={status.data.promanage.configured}
                label="ProManage"
                detail={`stream_mode=${status.data.promanage.stream_mode}`}
              />
              <StatusPill
                ok={status.data.promanage.actions_configured}
                label="ProManage in-place"
                detail={
                  status.data.promanage.actions_configured
                    ? "aksiyon endpoint hazır"
                    : "PROMANAGE_BASE_URL boş"
                }
              />
              <StatusPill
                ok={status.data.ticket.smtp_configured}
                label="SMTP"
                detail={status.data.ticket.to_email || "SMTP_HOST boş"}
              />
            </div>
          )}
        </section>

        <section>
          <h3 className="text-xs uppercase tracking-wide text-muted mb-2">
            AI yapılandırması
          </h3>
          {status.data && (
            <div className="border border-border rounded-lg bg-surface p-4 text-sm space-y-1">
              <Row label="Birincil" value={status.data.ai.primary} />
              <Row label="Fallback" value={status.data.ai.fallback} />
              <Row label="Embedding" value={status.data.ai.embedding} />
              <hr className="border-border my-2" />
              <Row label="Text modeli" value={status.data.ai.models.text} />
              <Row label="Vision modeli" value={status.data.ai.models.vision} />
              <Row label="Triage modeli" value={status.data.ai.models.triage} />
              <Row label="Heavy modeli" value={status.data.ai.models.heavy} />
              <Row label="Embedding modeli" value={status.data.ai.models.embedding} />
            </div>
          )}
        </section>

        <section>
          <h3 className="text-xs uppercase tracking-wide text-muted mb-2">
            Önemli env değişkenleri
          </h3>
          <ul className="list-disc pl-5 text-sm text-muted space-y-1">
            <li>
              <code className="text-text">AI_PROVIDER</code> — openai_compat | ollama | anthropic
            </li>
            <li>
              <code className="text-text">OPENAI_COMPAT_API_KEY</code> — OpenRouter key
            </li>
            <li>
              <code className="text-text">OLLAMA_BASE_URL</code> —{" "}
              <code>http://host.docker.internal:11434</code>
            </li>
            <li>
              <code className="text-text">PROMANAGE_LOG_STREAM_URL</code> — canlı log endpoint'i
            </li>
            <li>
              <code className="text-text">SMTP_*</code> ve{" "}
              <code className="text-text">TICKET_TO_EMAIL</code> — mail/ticket
            </li>
          </ul>
          <p className="text-xs text-muted mt-2">
            Değiştirdikten sonra <code className="text-text">docker compose up -d --build</code>{" "}
            ile yeniden başlatın.
          </p>
        </section>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted">{label}</span>
      <code className="text-text text-xs">{value}</code>
    </div>
  );
}
