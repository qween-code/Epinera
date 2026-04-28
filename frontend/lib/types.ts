export type Severity = "info" | "low" | "medium" | "high" | "critical";

export type IncidentStatus =
  | "detected"
  | "analyzing"
  | "awaiting_action"
  | "in_progress"
  | "resolved"
  | "closed";

export interface Incident {
  id: string;
  title: string;
  source: string;
  severity: Severity;
  status: IncidentStatus;
  summary: string | null;
  root_cause: string | null;
  resolution: string | null;
  resolver: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  tags: string[] | null;
}

export interface ActionItem {
  id: string;
  type: "promanage_inplace" | "email" | "ticket" | "note";
  status: string;
  title: string;
  description: string | null;
  requires_approval: boolean;
  payload: Record<string, unknown> | null;
  result: Record<string, unknown> | null;
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  problem: string;
  root_cause: string | null;
  resolution: string | null;
  actors: string[] | null;
  duration_minutes: number | null;
  tags: string[] | null;
  system: string | null;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeHit {
  entry: KnowledgeEntry;
  distance: number;
}

export interface ChatMessage {
  id: string;
  incident_id: string | null;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export interface LogEventLive {
  ts: string;
  severity: string;
  module: string | null;
  message: string;
  raw?: Record<string, unknown>;
}
