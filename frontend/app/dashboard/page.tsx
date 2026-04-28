"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertOctagon,
  AlertTriangle,
  Clock,
  Inbox,
  ListChecks,
  Search,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { TopBar } from "@/components/topbar";
import { IncidentCard } from "@/components/incident-card";
import { KpiCard } from "@/components/kpi-card";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/skeleton";
import { apiFetch } from "@/lib/api";
import type { DashboardStats, Incident } from "@/lib/types";

const SEVERITIES = ["", "info", "low", "medium", "high", "critical"] as const;
const STATUSES = [
  "",
  "detected",
  "analyzing",
  "awaiting_action",
  "in_progress",
  "resolved",
  "closed",
] as const;
const SOURCES = ["", "promanage", "sap", "manual_upload"] as const;

export default function DashboardPage() {
  const [severity, setSeverity] = useState<(typeof SEVERITIES)[number]>("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("");
  const [source, setSource] = useState<(typeof SOURCES)[number]>("");
  const [q, setQ] = useState("");

  const params = new URLSearchParams();
  if (severity) params.set("severity", severity);
  if (status) params.set("status", status);
  if (source) params.set("source", source);
  if (q.trim()) params.set("q", q.trim());
  const qs = params.toString();

  const stats = useQuery<DashboardStats>({
    queryKey: ["stats"],
    queryFn: () => apiFetch<DashboardStats>("/stats/dashboard"),
    refetchInterval: 15_000,
  });

  const list = useQuery<Incident[]>({
    queryKey: ["incidents", qs],
    queryFn: () => apiFetch<Incident[]>(`/incidents?${qs}&limit=100`),
    refetchInterval: 20_000,
  });

  const severityOpen = stats.data?.by_severity ?? {};

  return (
    <>
      <TopBar
        title="Pano"
        subtitle="Aktif incident'lar, sistem durumu ve KPI"
      />
      <div className="p-6 space-y-6">
        {/* KPI bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
          {stats.isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))
          ) : stats.data ? (
            <>
              <KpiCard
                label="Açık (toplam)"
                value={stats.data.open_total}
                tone={stats.data.open_total > 0 ? "warn" : "success"}
                icon={<Inbox size={14} />}
              />
              <KpiCard
                label="Kritik"
                value={severityOpen.critical || 0}
                tone={severityOpen.critical ? "danger" : "default"}
                icon={<AlertOctagon size={14} />}
              />
              <KpiCard
                label="High"
                value={severityOpen.high || 0}
                tone={severityOpen.high ? "warn" : "default"}
                icon={<AlertTriangle size={14} />}
              />
              <KpiCard
                label="24s açılan"
                value={stats.data.opened_24h}
                sub={`7g: ${stats.data.opened_7d}`}
                tone="accent"
                icon={<Activity size={14} />}
              />
              <KpiCard
                label="24s çözülen"
                value={stats.data.resolved_24h}
                tone={stats.data.resolved_24h ? "success" : "default"}
                icon={<CheckCircle2 size={14} />}
              />
              <KpiCard
                label="MTTR (30g)"
                value={
                  stats.data.mttr_hours_30d != null
                    ? `${stats.data.mttr_hours_30d}sa`
                    : "—"
                }
                sub="ortalama çözüm süresi"
                icon={<Clock size={14} />}
              />
            </>
          ) : null}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="başlık, özet veya kök neden içinde ara…"
              className="w-full pl-8 pr-3 py-2 bg-surface border border-border rounded-md text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <select
            value={severity}
            onChange={(e) =>
              setSeverity(e.target.value as (typeof SEVERITIES)[number])
            }
            className="bg-surface border border-border rounded-md px-3 py-2 text-sm"
          >
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>
                severity: {s || "hepsi"}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as (typeof STATUSES)[number])
            }
            className="bg-surface border border-border rounded-md px-3 py-2 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                durum: {s || "hepsi"}
              </option>
            ))}
          </select>
          <select
            value={source}
            onChange={(e) =>
              setSource(e.target.value as (typeof SOURCES)[number])
            }
            className="bg-surface border border-border rounded-md px-3 py-2 text-sm"
          >
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                kaynak: {s || "hepsi"}
              </option>
            ))}
          </select>
          {(severity || status || source || q) && (
            <button
              onClick={() => {
                setSeverity("");
                setStatus("");
                setSource("");
                setQ("");
              }}
              className="text-xs text-muted hover:text-text px-2 py-1 rounded-md hover:bg-elev"
            >
              filtreleri temizle
            </button>
          )}
        </div>

        {/* List */}
        {list.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : list.data && list.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {list.data.map((i) => (
              <IncidentCard key={i.id} incident={i} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<ListChecks size={20} />}
            title={
              qs
                ? "Filtreye uyan incident yok"
                : "Henüz incident yok"
            }
            description={
              qs
                ? "Filtreleri yumuşatmayı deneyin."
                : "Bir log/dosya yükleyerek veya canlı ProManage akışıyla başlayın."
            }
          />
        )}
      </div>
    </>
  );
}
