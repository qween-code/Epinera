"use client";
import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, BookmarkPlus, Check, Copy, Play } from "lucide-react";
import Link from "next/link";
import { TopBar } from "@/components/topbar";
import { SeverityBadge } from "@/components/severity-badge";
import { ChatPanel } from "@/components/chat-panel";
import { useToast } from "@/components/toast";
import { apiFetch } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import type { ActionItem, Incident } from "@/lib/types";

export default function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const qc = useQueryClient();
  const toast = useToast();

  const incident = useQuery({
    queryKey: ["incident", id],
    queryFn: () => apiFetch<Incident>(`/incidents/${id}`),
  });

  const actions = useQuery({
    queryKey: ["actions", id],
    queryFn: () => apiFetch<ActionItem[]>(`/actions/incident/${id}`),
  });

  const exec = useMutation({
    mutationFn: (actionId: string) =>
      apiFetch<{ status: string; result: Record<string, unknown> }>(
        `/actions/${actionId}/execute`,
        { method: "POST" },
      ),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["actions", id] });
      toast.push(
        data.status === "succeeded" ? "success" : "error",
        `Aksiyon: ${data.status}`,
      );
    },
    onError: (e) => toast.push("error", (e as Error).message),
  });

  const update = useMutation({
    mutationFn: (patch: Partial<Incident>) =>
      apiFetch<Incident>(`/incidents/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["incident", id] });
      toast.push("success", "Incident güncellendi");
    },
    onError: (e) => toast.push("error", (e as Error).message),
  });

  const saveKb = useMutation({
    mutationFn: () =>
      apiFetch<{ knowledge_entry_id: string }>(
        `/incidents/${id}/save-as-knowledge`,
        { method: "POST" },
      ),
    onSuccess: (data) =>
      toast.push("success", `KB girişi oluşturuldu: ${data.knowledge_entry_id.slice(0, 8)}…`),
    onError: (e) => toast.push("error", (e as Error).message),
  });

  const [resolution, setResolution] = useState("");
  const [resolver, setResolver] = useState("");

  if (incident.isLoading) {
    return (
      <>
        <TopBar title="Incident" />
        <div className="p-6 text-sm text-muted">Yükleniyor…</div>
      </>
    );
  }

  if (!incident.data) {
    return (
      <>
        <TopBar title="Incident" />
        <div className="p-6 text-sm text-danger">Bulunamadı</div>
      </>
    );
  }

  const i = incident.data;
  const isResolved = i.status === "resolved" || i.status === "closed";

  return (
    <>
      <TopBar
        title={i.title}
        subtitle={`${i.source} · ${formatDateTime(i.created_at)}`}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 overflow-hidden min-h-0">
        <div className="overflow-auto p-6 space-y-4 border-r border-border">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 hover:text-text"
            >
              <ArrowLeft size={12} /> panoya dön
            </Link>
            <span>·</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(i.id);
                toast.push("info", "ID kopyalandı");
              }}
              className="flex items-center gap-1 hover:text-text"
            >
              <Copy size={12} /> ID
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <SeverityBadge severity={i.severity} />
            <span className="text-xs text-muted">durum: {i.status}</span>
            {i.tags?.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-0.5 rounded bg-elev border border-border text-muted"
              >
                #{t}
              </span>
            ))}
          </div>

          {i.summary && (
            <section>
              <h3 className="text-xs text-muted uppercase tracking-wide mb-1">
                Özet
              </h3>
              <p className="text-sm whitespace-pre-wrap">{i.summary}</p>
            </section>
          )}
          {i.root_cause && (
            <section>
              <h3 className="text-xs text-muted uppercase tracking-wide mb-1">
                Olası kök neden
              </h3>
              <p className="text-sm whitespace-pre-wrap">{i.root_cause}</p>
            </section>
          )}

          <section>
            <h3 className="text-xs text-muted uppercase tracking-wide mb-2">
              Önerilen aksiyonlar
            </h3>
            <div className="space-y-2">
              {actions.data?.map((a) => (
                <div
                  key={a.id}
                  className="border border-border rounded-md p-3 bg-surface"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{a.title}</div>
                      <div className="text-xs text-muted">
                        {a.type} · {a.status}
                        {a.requires_approval && " · onay gerekli"}
                      </div>
                    </div>
                    {a.status === "succeeded" ? (
                      <span className="text-xs text-success flex items-center gap-1">
                        <Check size={12} /> tamam
                      </span>
                    ) : (
                      <button
                        onClick={() => exec.mutate(a.id)}
                        disabled={exec.isPending}
                        className="text-xs px-3 py-1 bg-accent text-white rounded disabled:opacity-50 flex items-center gap-1 hover:bg-accent/90"
                      >
                        <Play size={12} />
                        {a.requires_approval ? "Onayla" : "Çalıştır"}
                      </button>
                    )}
                  </div>
                  {a.description && (
                    <p className="text-xs text-muted mt-2 whitespace-pre-wrap">
                      {a.description}
                    </p>
                  )}
                  {a.result && (
                    <pre className="text-[11px] mt-2 bg-bg border border-border rounded p-2 overflow-auto">
                      {JSON.stringify(a.result, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
              {actions.data?.length === 0 && (
                <div className="text-xs text-muted">Aksiyon önerisi yok.</div>
              )}
            </div>
          </section>

          <section className="border-t border-border pt-4">
            <h3 className="text-xs text-muted uppercase tracking-wide mb-2">
              Çözümü kaydet
            </h3>
            <input
              value={resolver}
              onChange={(e) => setResolver(e.target.value)}
              placeholder="Çözen kişi"
              className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm mb-2"
              disabled={isResolved}
            />
            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              rows={4}
              placeholder="Ne yapıldı, hangi adımlar uygulandı…"
              className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm"
              disabled={isResolved}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() =>
                  update.mutate({ resolution, resolver, status: "resolved" })
                }
                disabled={isResolved || !resolution.trim()}
                className="px-3 py-1.5 rounded bg-success/20 border border-success/40 text-success text-xs flex items-center gap-1 disabled:opacity-40"
              >
                <Check size={12} /> Çözüldü olarak işaretle
              </button>
              <button
                onClick={() => saveKb.mutate()}
                disabled={!isResolved}
                className="px-3 py-1.5 rounded bg-accent/20 border border-accent/40 text-accent text-xs flex items-center gap-1 disabled:opacity-40"
                title={!isResolved ? "Önce çözüm kaydedin" : ""}
              >
                <BookmarkPlus size={12} /> Know-How'a kaydet
              </button>
            </div>
          </section>
        </div>

        <div className="flex flex-col h-[calc(100vh-3.5rem)] min-h-0">
          <ChatPanel incidentId={i.id} />
        </div>
      </div>
    </>
  );
}
