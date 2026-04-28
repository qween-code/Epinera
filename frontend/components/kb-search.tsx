"use client";
import { useState } from "react";
import { Loader2, Plus, Search } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { KnowledgeEntry, KnowledgeHit } from "@/lib/types";
import { useToast } from "@/components/toast";
import { EmptyState } from "@/components/empty-state";

export function KbSearch() {
  const toast = useToast();
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [hits, setHits] = useState<KnowledgeHit[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Manuel ekleme formu state
  const [form, setForm] = useState({
    title: "",
    problem: "",
    root_cause: "",
    resolution: "",
    actors: "",
    tags: "",
    system: "promanage" as "promanage" | "sap" | "other",
    duration_minutes: "",
  });

  const create = useMutation({
    mutationFn: () =>
      apiFetch<KnowledgeEntry>("/knowledge", {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          problem: form.problem,
          root_cause: form.root_cause || null,
          resolution: form.resolution || null,
          actors: form.actors
            ? form.actors.split(",").map((s) => s.trim()).filter(Boolean)
            : null,
          tags: form.tags
            ? form.tags.split(",").map((s) => s.trim()).filter(Boolean)
            : null,
          system: form.system,
          duration_minutes: form.duration_minutes
            ? Number(form.duration_minutes)
            : null,
        }),
      }),
    onSuccess: () => {
      toast.push("success", "Know-How girişi eklendi");
      setShowForm(false);
      setForm({
        title: "",
        problem: "",
        root_cause: "",
        resolution: "",
        actors: "",
        tags: "",
        system: "promanage",
        duration_minutes: "",
      });
      qc.invalidateQueries({ queryKey: ["kb"] });
    },
    onError: (e) => toast.push("error", (e as Error).message),
  });

  async function run() {
    if (!q.trim()) return;
    setBusy(true);
    try {
      const data = await apiFetch<KnowledgeHit[]>(
        `/knowledge/search?q=${encodeURIComponent(q)}&limit=10`,
      );
      setHits(data);
    } catch (e) {
      toast.push("error", (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="hata mesajı, modül, kök neden veya çözüm anahtar kelimesi…"
            className="w-full pl-8 pr-3 py-2 bg-surface border border-border rounded-md text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <button
          onClick={run}
          disabled={busy}
          className="px-3 py-2 rounded-md bg-accent text-white text-sm flex items-center gap-1 disabled:opacity-50"
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
          Ara
        </button>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-3 py-2 rounded-md border border-border text-sm flex items-center gap-1 hover:bg-elev"
        >
          <Plus size={14} /> Yeni
        </button>
      </div>

      {showForm && (
        <div className="border border-border bg-surface rounded-lg p-4 space-y-3">
          <div className="text-sm font-medium">Yeni Know-How girişi</div>
          <input
            placeholder="Başlık (örn. SAP MIGO TIME_OUT — MSEG performans)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Problem"
            value={form.problem}
            onChange={(e) => setForm({ ...form, problem: e.target.value })}
            rows={2}
            className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Kök neden"
            value={form.root_cause}
            onChange={(e) => setForm({ ...form, root_cause: e.target.value })}
            rows={2}
            className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Çözüm (adım adım)"
            value={form.resolution}
            onChange={(e) => setForm({ ...form, resolution: e.target.value })}
            rows={3}
            className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="Aktörler (virgülle: Murat, Ayşe)"
              value={form.actors}
              onChange={(e) => setForm({ ...form, actors: e.target.value })}
              className="bg-bg border border-border rounded-md px-3 py-2 text-sm"
            />
            <input
              placeholder="Etiketler (virgülle: wms, timeout)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="bg-bg border border-border rounded-md px-3 py-2 text-sm"
            />
            <select
              value={form.system}
              onChange={(e) =>
                setForm({
                  ...form,
                  system: e.target.value as typeof form.system,
                })
              }
              className="bg-bg border border-border rounded-md px-3 py-2 text-sm"
            >
              <option value="promanage">ProManage</option>
              <option value="sap">SAP</option>
              <option value="other">Diğer</option>
            </select>
            <input
              type="number"
              placeholder="Süre (dakika)"
              value={form.duration_minutes}
              onChange={(e) =>
                setForm({ ...form, duration_minutes: e.target.value })
              }
              className="bg-bg border border-border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="text-xs px-3 py-1.5 rounded border border-border hover:bg-elev"
            >
              İptal
            </button>
            <button
              onClick={() => create.mutate()}
              disabled={
                !form.title.trim() || !form.problem.trim() || create.isPending
              }
              className="text-xs px-3 py-1.5 rounded bg-accent text-white disabled:opacity-50 flex items-center gap-1"
            >
              {create.isPending && <Loader2 size={12} className="animate-spin" />}
              Kaydet
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {hits.length === 0 ? (
          <EmptyState
            title={q ? "Eşleşen kayıt yok" : "Önce bir sorgu girin"}
            description={
              q
                ? "Daha genel kelimeler deneyin (örn. 'timeout', 'license', 'tablespace')."
                : "Geçmiş vakaları semantik olarak arar — sözcük eşleşmesi gerekmez."
            }
          />
        ) : (
          hits.map((h) => (
            <div
              key={h.entry.id}
              className="border border-border bg-surface rounded-lg p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="text-sm font-medium">{h.entry.title}</div>
                <span className="text-xs text-muted">d={h.distance.toFixed(3)}</span>
              </div>
              <div className="text-xs text-muted mt-1">
                {h.entry.system}
                {h.entry.tags?.length ? ` · ${h.entry.tags.join(", ")}` : ""}
              </div>
              {h.entry.problem && (
                <div className="mt-2">
                  <div className="text-xs text-muted">Problem</div>
                  <p className="text-sm">{h.entry.problem}</p>
                </div>
              )}
              {h.entry.root_cause && (
                <div className="mt-1">
                  <div className="text-xs text-muted">Kök neden</div>
                  <p className="text-sm">{h.entry.root_cause}</p>
                </div>
              )}
              {h.entry.resolution && (
                <div className="mt-1">
                  <div className="text-xs text-muted">Çözüm</div>
                  <p className="text-sm whitespace-pre-wrap">{h.entry.resolution}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
