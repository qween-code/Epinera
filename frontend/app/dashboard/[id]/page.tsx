"use client";
import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TopBar } from "@/components/topbar";
import { SeverityBadge } from "@/components/severity-badge";
import { ChatPanel } from "@/components/chat-panel";
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
      apiFetch(`/actions/${actionId}/execute`, { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["actions", id] }),
  });

  const update = useMutation({
    mutationFn: (patch: Partial<Incident>) =>
      apiFetch<Incident>(`/incidents/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["incident", id] }),
  });

  const saveKb = useMutation({
    mutationFn: () =>
      apiFetch(`/incidents/${id}/save-as-knowledge`, { method: "POST" }),
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

  return (
    <>
      <TopBar title={i.title} subtitle={`${i.source} · ${formatDateTime(i.created_at)}`} />
      <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 overflow-hidden">
        <div className="overflow-auto p-6 space-y-4 border-r border-border">
          <div className="flex items-center gap-2">
            <SeverityBadge severity={i.severity} />
            <span className="text-xs text-muted">durum: {i.status}</span>
          </div>

          {i.summary && (
            <section>
              <h3 className="text-xs text-muted uppercase">Özet</h3>
              <p className="text-sm whitespace-pre-wrap">{i.summary}</p>
            </section>
          )}
          {i.root_cause && (
            <section>
              <h3 className="text-xs text-muted uppercase">Olası kök neden</h3>
              <p className="text-sm whitespace-pre-wrap">{i.root_cause}</p>
            </section>
          )}

          <section>
            <h3 className="text-xs text-muted uppercase mb-2">Önerilen aksiyonlar</h3>
            <div className="space-y-2">
              {actions.data?.map((a) => (
                <div
                  key={a.id}
                  className="border border-border rounded-md p-3 bg-surface"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium">{a.title}</div>
                      <div className="text-xs text-muted">
                        {a.type} · {a.status}
                      </div>
                    </div>
                    <button
                      onClick={() => exec.mutate(a.id)}
                      disabled={exec.isPending || a.status === "succeeded"}
                      className="text-xs px-3 py-1 bg-accent text-white rounded disabled:opacity-50"
                    >
                      {a.requires_approval ? "Onayla & çalıştır" : "Çalıştır"}
                    </button>
                  </div>
                  {a.description && (
                    <p className="text-xs text-muted mt-2 whitespace-pre-wrap">
                      {a.description}
                    </p>
                  )}
                  {a.result && (
                    <pre className="text-xs mt-2 bg-bg border border-border rounded p-2 overflow-auto">
                      {JSON.stringify(a.result, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
              {actions.data?.length === 0 && (
                <div className="text-xs text-muted">Aksiyon yok.</div>
              )}
            </div>
          </section>

          <section className="border-t border-border pt-4">
            <h3 className="text-xs text-muted uppercase mb-2">Çözümü kaydet</h3>
            <input
              value={resolver}
              onChange={(e) => setResolver(e.target.value)}
              placeholder="Çözen kişi"
              className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm mb-2"
            />
            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              rows={4}
              placeholder="Ne yapıldı, hangi adımlar uygulandı…"
              className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() =>
                  update.mutate({ resolution, resolver, status: "resolved" })
                }
                className="px-3 py-1.5 rounded bg-success/20 border border-success/40 text-success text-xs"
              >
                Çözüldü olarak işaretle
              </button>
              <button
                onClick={() => saveKb.mutate()}
                disabled={!i.resolution}
                className="px-3 py-1.5 rounded bg-accent/20 border border-accent/40 text-accent text-xs disabled:opacity-50"
              >
                Know-How'a kaydet
              </button>
            </div>
            {saveKb.isSuccess && (
              <div className="text-xs text-success mt-2">KB girişi oluşturuldu.</div>
            )}
          </section>
        </div>

        <div className="flex flex-col h-[calc(100vh-3.5rem)]">
          <ChatPanel incidentId={i.id} />
        </div>
      </div>
    </>
  );
}
