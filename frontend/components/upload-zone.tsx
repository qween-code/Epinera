"use client";
import { useState } from "react";
import { Upload as UploadIcon, FileText, Loader2 } from "lucide-react";
import { apiFetch, apiUrl } from "@/lib/api";
import { SeverityBadge } from "@/components/severity-badge";

interface AnalysisResponse {
  incident_id: string;
  file_id: string;
  analysis: {
    title: string;
    severity: string;
    summary: string;
    root_cause: string;
    tags: string[];
    proactive_actions: Array<{
      title: string;
      description?: string;
      type: string;
      system?: string;
      requires_approval?: boolean;
    }>;
    similar_entries: Array<{
      title: string;
      problem: string;
      resolution: string;
      distance: number;
    }>;
  };
}

export function UploadZone() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [source, setSource] = useState<"manual_upload" | "promanage" | "sap">(
    "manual_upload",
  );
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);

    const fd = new FormData();
    fd.append("file", file);
    if (description) fd.append("description", description);
    fd.append("source", source);

    const token = window.localStorage.getItem("sentinel.token");
    try {
      const res = await fetch(`${apiUrl}/uploads/analyze`, {
        method: "POST",
        body: fd,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as AnalysisResponse;
      setResult(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="border border-dashed border-border rounded-lg p-6 bg-surface">
        <label className="flex flex-col items-center justify-center gap-3 cursor-pointer">
          <UploadIcon size={28} className="text-accent" />
          <span className="text-sm">
            Log / dosya / ekran görüntüsü seç veya sürükle-bırak
          </span>
          <span className="text-xs text-muted">
            .log, .txt, .out, .err, .png, .jpg, .jpeg, .webp
          </span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {file && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <FileText size={14} /> {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted">Kaynak</label>
          <select
            value={source}
            onChange={(e) =>
              setSource(e.target.value as "manual_upload" | "promanage" | "sap")
            }
            className="w-full mt-1 bg-bg border border-border rounded-md px-3 py-2 text-sm"
          >
            <option value="manual_upload">Manuel yükleme</option>
            <option value="promanage">ProManage</option>
            <option value="sap">SAP</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted">Açıklama / bağlam (ops.)</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ne yaparken oldu, kim raporladı vb."
            className="w-full mt-1 bg-bg border border-border rounded-md px-3 py-2 text-sm"
          />
        </div>
      </div>

      <button
        onClick={submit}
        disabled={!file || busy}
        className="px-4 py-2 rounded-md bg-accent text-white text-sm disabled:opacity-50 flex items-center gap-2"
      >
        {busy && <Loader2 size={14} className="animate-spin" />}
        Analiz et
      </button>

      {error && (
        <div className="text-sm text-danger border border-danger/30 bg-rose-900/20 rounded-md p-3">
          {error}
        </div>
      )}

      {result && (
        <div className="border border-border bg-surface rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">{result.analysis.title}</h3>
            <SeverityBadge severity={result.analysis.severity} />
          </div>
          {result.analysis.summary && (
            <p className="text-sm whitespace-pre-wrap">{result.analysis.summary}</p>
          )}
          {result.analysis.root_cause && (
            <div>
              <div className="text-xs text-muted">Olası kök neden</div>
              <p className="text-sm">{result.analysis.root_cause}</p>
            </div>
          )}
          {result.analysis.proactive_actions?.length > 0 && (
            <div>
              <div className="text-xs text-muted mb-1">Önerilen aksiyonlar</div>
              <ul className="space-y-2">
                {result.analysis.proactive_actions.map((a, idx) => (
                  <li
                    key={idx}
                    className="border border-border rounded-md p-2 bg-elev text-sm"
                  >
                    <div className="font-medium">{a.title}</div>
                    {a.description && (
                      <div className="text-muted text-xs mt-1">{a.description}</div>
                    )}
                    <div className="mt-1 text-xs text-muted flex gap-2">
                      <span>tip: {a.type}</span>
                      {a.system && <span>sistem: {a.system}</span>}
                      {a.requires_approval && <span>onay gerekli</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.analysis.similar_entries?.length > 0 && (
            <div>
              <div className="text-xs text-muted mb-1">Benzer geçmiş vakalar</div>
              <ul className="space-y-1 text-sm">
                {result.analysis.similar_entries.map((s, idx) => (
                  <li key={idx} className="text-muted">
                    <span className="text-text">{s.title}</span> · uzaklık{" "}
                    {s.distance.toFixed(3)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="text-xs text-muted">
            Incident ID: {result.incident_id}
          </div>
        </div>
      )}
    </div>
  );
}
