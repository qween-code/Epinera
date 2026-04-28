"use client";
import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { KnowledgeHit } from "@/lib/types";

export function KbSearch() {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [hits, setHits] = useState<KnowledgeHit[]>([]);

  async function run() {
    if (!q.trim()) return;
    setBusy(true);
    try {
      const data = await apiFetch<KnowledgeHit[]>(
        `/knowledge/search?q=${encodeURIComponent(q)}&limit=10`,
      );
      setHits(data);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run()}
          placeholder="Geçmiş bir hata, kök neden ya da çözüm anahtar kelimesi…"
          className="flex-1 bg-surface border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
        />
        <button
          onClick={run}
          disabled={busy}
          className="px-3 py-2 rounded-md bg-accent text-white text-sm flex items-center gap-1 disabled:opacity-50"
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
          Ara
        </button>
      </div>

      <div className="space-y-2">
        {hits.length === 0 && (
          <div className="text-sm text-muted">Sonuç yok.</div>
        )}
        {hits.map((h) => (
          <div
            key={h.entry.id}
            className="border border-border bg-surface rounded-lg p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm font-medium">{h.entry.title}</div>
              <span className="text-xs text-muted">d={h.distance.toFixed(3)}</span>
            </div>
            <div className="text-xs text-muted mt-1">
              {h.entry.system} · {h.entry.tags?.join(", ") || "-"}
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
        ))}
      </div>
    </div>
  );
}
