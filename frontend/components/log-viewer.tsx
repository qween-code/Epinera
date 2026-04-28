"use client";
import { useEffect, useRef, useState } from "react";
import { buildLogStreamUrl } from "@/lib/ws";
import { cn } from "@/lib/utils";
import type { LogEventLive } from "@/lib/types";

const SEVERITY_COLOR: Record<string, string> = {
  ERROR: "text-rose-300",
  WARN: "text-amber-300",
  WARNING: "text-amber-300",
  INFO: "text-text",
  DEBUG: "text-muted",
};

export function LogViewer() {
  const [events, setEvents] = useState<LogEventLive[]>([]);
  const [connected, setConnected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        setEvents((prev) => {
          const next = [...prev, evt];
          return next.slice(-1000);
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
  }, []);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight });
  }, [events]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-elev">
        <div className="flex items-center gap-2 text-xs">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              connected ? "bg-success" : "bg-danger",
            )}
          />
          <span className="text-muted">
            {connected ? "Bağlı" : "Bağlantı yok"} · {events.length} olay
          </span>
        </div>
        <button
          onClick={() => setEvents([])}
          className="text-xs text-muted hover:text-text"
        >
          Temizle
        </button>
      </div>
      <div
        ref={ref}
        className="flex-1 overflow-auto font-mono text-xs leading-relaxed p-3 bg-bg"
      >
        {events.length === 0 && (
          <div className="text-muted">
            ProManage canlı log akışı bekleniyor… (PROMANAGE_LOG_STREAM_URL
            ayarlandığında akış başlar)
          </div>
        )}
        {events.map((e, idx) => (
          <div key={idx} className="whitespace-pre-wrap">
            <span className="text-muted">{e.ts}</span>{" "}
            <span
              className={cn(
                "font-semibold",
                SEVERITY_COLOR[e.severity?.toUpperCase()] || "text-text",
              )}
            >
              [{e.severity}]
            </span>{" "}
            {e.module && <span className="text-accent">{e.module}</span>}{" "}
            <span>{e.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
