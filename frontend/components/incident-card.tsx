import Link from "next/link";
import type { Incident } from "@/lib/types";
import { SeverityBadge } from "@/components/severity-badge";
import { formatDateTime } from "@/lib/utils";

export function IncidentCard({ incident }: { incident: Incident }) {
  return (
    <Link
      href={`/dashboard/${incident.id}`}
      className="block border border-border bg-surface hover:bg-elev transition-colors rounded-lg p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium">{incident.title}</div>
          <div className="text-xs text-muted mt-0.5">
            {incident.source} · {formatDateTime(incident.created_at)}
          </div>
        </div>
        <SeverityBadge severity={incident.severity} />
      </div>
      {incident.summary && (
        <p className="text-xs text-muted mt-2 line-clamp-2">{incident.summary}</p>
      )}
      <div className="text-xs text-muted mt-2">durum: {incident.status}</div>
    </Link>
  );
}
