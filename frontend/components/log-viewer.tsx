"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Filter, Pause, Play, Search, Trash2 } from "lucide-react";
import { buildLogStreamUrl } from "@/lib/ws";
import { cn } from "@/lib/utils";
import type { LogEventLive } from "@/lib/types";
import { EmptyState } from "@/components/empty-state";

const SEVERITY_COLOR: Record<string, string> = {
  ERROR: "text-rose-300",
  CRITICAL: "text-rose-400",
  FATAL: "text-rose-400",
  WARN: "text-amber-300",
  WARNING: "text-amber-300",
  INFO: "text-text",
  DEBUG: "text-muted",
  TRACE: "text-muted",
};

const SEVERITY_BG: Record<string, string> = {
  ERROR: "bg-rose-900/20 hover:bg-rose-900/30",
  CRITICAL: "bg-rose-900/30 hover:bg-rose-900/40",
  FATAL: "bg-rose-900/30 hover:bg-rose-900/40",
  WARN: "bg-amber-900/15 hover:bg-amber-900/25",
  WARNING: "bg-amber-900/15 hover:bg-amber-900/25",
};

const SEVERITIES = ["", "ERROR", "WARN", "INFO", "DEBUG"] as const;

export function LogViewer() {
  const [events, setEvents] = useState<LogEventLive[]>([]);
  const [connected, setConnected] = useState(false);
  const [paused, setPaused] = useState(false);
  const [severity, setSeverity] = useState<(typeof SEVERITIES)[number]>("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<LogEventLive | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const pausedBuffer = useRef<LogEventLive[]>([]);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("sentinel.token")
        : null;
    if (!token) return;
    const ws = new WebSocket(buildLogStreamUrl(token));
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (e) => {
      try {
        const evt = JSON.parse(e.data) as LogEventLive;
        if (paused) {
          pausedBuffer.current.push(evt);
          return;
        }
        setEvents((prev) => {
          const next = [...prev, evt];
          return next.slice(-2000);
        });
      } catch {
        /* ignore */
      }
    };
    const ping = setInterval(() => ws.readyState === 1 && ws.send("ping"), 25_000);
    return () => {
      clearInterval(ping);
      ws.close();
    };
  }, [paused]);

  // resume → flush buffered
  useEffect(() => {
    if (!paused && pausedBuffer.current.length > 0) {
      setEvents((prev) => [...prev, ...pausedBuffer.current].slice(-2000));
      pausedBuffer.current = [];
    }
  }, [paused]);

  const filtered = useMemo(() => {
    const lc = search.toLowerCase();
    return events.filter((e) => {
      if (severity && (e.severity || "").toUpperCase() !== severity) return false;
      if (lc && !e.message.toLowerCase().includes(lc)) return false;
      return true;
    });
  }, [events, severity, search]);

  useEffect(() => {
    if (!paused) ref.current?.scrollTo({ top: ref.current.scrollHeight });
  }, [filtered, paused]);

  return (
    <div className="flex h-full min-h-0">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-elev gap-3 flex-wrap">
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  connected ? "bg-success" : "bg-danger animate-pulse",
                )}
              />
              <span className="text-muted">
                {connected ? "Bağlı" : "Bağlantı yok"}
              </span>
            </span>
            <span className="text-muted">
              {filtered.length}/{events.length} olay
            </span>
            {paused && pausedBuffer.current.length > 0 && (
              <span className="text-amber-300">
                +{pausedBuffer.current.length} bekliyor
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="relative">
              <Search
                size={12}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="mesajda ara…"
                className="pl-7 pr-2 py-1 bg-bg border border-border rounded-md w-44 text-xs focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex items-center gap-1">
              <Filter size={12} className="text-muted" />
              <select
                value={severity}
                onChange={(e) =>
                  setSeverity(e.target.value as (typeof SEVERITIES)[number])
                }
                className="bg-bg border border-border rounded-md py-1 px-2 text-xs"
              >
                {SEVERITIES.map((s) => (
                  <option key={s} value={s}>
                    {s || "hepsi"}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setPaused((p) => !p)}
              className="px-2 py-1 rounded-md border border-border hover:bg-elev flex items-center gap-1"
              title={paused ? "Devam et" : "Duraklat"}
            >
              {paused ? <Play size={12} /> : <Pause size={12} />}
              {paused ? "devam" : "durdur"}
            </button>
            <button
              onClick={() => setEvents([])}
              className="px-2 py-1 rounded-md border border-border hover:bg-elev flex items-center gap-1"
            >
              <Trash2 size={12} /> temizle
            </button>
          </div>
        </div>

        <div
          ref={ref}
          className="flex-1 overflow-auto font-mono text-xs leading-relaxed p-3 bg-bg"
        >
          {filtered.length === 0 ? (
            <EmptyState
              className="mt-12"
              title={connected ? "Olay bekleniyor…" : "Akış kapalı"}
              description={
                connected
                  ? "ProManage akışı aktif. PROMANAGE_LOG_STREAM_URL ayarlandığında olaylar burada görünür. /upload ile manuel test yapabilirsiniz."
                  : "WebSocket bağlanamadı. Token'ı yenilemeyi deneyin (çıkış→giriş)."
              }
            />
          ) : (
            filtered.map((e, idx) => {
              const sev = (e.severity || "").toUpperCase();
              return (
                <button
                  key={idx}
                  onClick={() => setSelected(e)}
                  className={cn(
                    "block w-full text-left whitespace-pre-wrap rounded px-2 py-0.5 cursor-pointer",
                    SEVERITY_BG[sev] || "hover:bg-elev",
                  )}
                >
                  <span className="text-muted">{e.ts}</span>{" "}
                  <span
                    className={cn(
                      "font-semibold",
                      SEVERITY_COLOR[sev] || "text-text",
                    )}
                  >
                    [{e.severity}]
                  </span>{" "}
                  {e.module && <span className="text-accent">{e.module}</span>}{" "}
                  <span>{e.message}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="w-96 border-l border-border bg-surface flex flex-col">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="text-sm font-semibold">Olay detayı</div>
            <button
              onClick={() => setSelected(null)}
              className="text-muted hover:text-text text-xs"
            >
              kapat
            </button>
          </div>
          <div className="p-4 space-y-3 text-sm overflow-auto">
            <div>
              <div className="text-xs text-muted">Zaman</div>
              <div>{selected.ts}</div>
            </div>
            <div>
              <div className="text-xs text-muted">Severity</div>
              <div>{selected.severity}</div>
            </div>
            {selected.module && (
              <div>
                <div className="text-xs text-muted">Modül</div>
                <div>{selected.module}</div>
              </div>
            )}
            <div>
              <div className="text-xs text-muted">Mesaj</div>
              <div className="whitespace-pre-wrap">{selected.message}</div>
            </div>
            {selected.raw && (
              <div>
                <div className="text-xs text-muted">Ham veri</div>
                <pre className="bg-bg border border-border rounded p-2 overflow-auto text-[11px]">
                  {JSON.stringify(selected.raw, null, 2)}
                </pre>
              </div>
            )}
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${selected.ts} [${selected.severity}] ${selected.module ?? ""} ${selected.message}`,
                );
              }}
              className="w-full text-xs px-3 py-1.5 rounded bg-elev border border-border hover:bg-bg"
            >
              satırı kopyala
            </button>
            <button
              onClick={() => {
                const blob = new Blob(
                  [
                    `${selected.ts} [${selected.severity}] ${selected.module ?? ""} ${selected.message}\n` +
                      (selected.raw
                        ? `\n${JSON.stringify(selected.raw, null, 2)}`
                        : ""),
                  ],
                  { type: "text/plain" },
                );
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `log-${Date.now()}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="w-full text-xs px-3 py-1.5 rounded bg-accent text-white hover:bg-accent/90"
            >
              .txt indir → /upload'da analiz et
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
