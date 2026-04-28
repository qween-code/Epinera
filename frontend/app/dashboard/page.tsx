"use client";
import { useQuery } from "@tanstack/react-query";
import { TopBar } from "@/components/topbar";
import { IncidentCard } from "@/components/incident-card";
import { apiFetch } from "@/lib/api";
import type { Incident } from "@/lib/types";

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["incidents"],
    queryFn: () => apiFetch<Incident[]>("/incidents?limit=50"),
  });

  return (
    <>
      <TopBar
        title="Pano"
        subtitle="Aktif incident'lar ve son sistem durumu"
      />
      <div className="p-6 space-y-4">
        {isLoading && <div className="text-sm text-muted">Yükleniyor…</div>}
        {error && (
          <div className="text-sm text-danger">
            Hata: {(error as Error).message}
          </div>
        )}
        {data && data.length === 0 && (
          <div className="text-sm text-muted">
            Henüz incident yok. Bir log/dosya yükleyerek veya canlı log akışı
            ile sisteme veri sağlayın.
          </div>
        )}
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {data?.map((i) => (
            <IncidentCard key={i.id} incident={i} />
          ))}
        </div>
      </div>
    </>
  );
}
