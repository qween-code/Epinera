"use client";
import { useCallback, useRef, useState } from "react";
import {
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Upload as UploadIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { apiUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import { SeverityBadge } from "@/components/severity-badge";
import { useToast } from "@/components/toast";

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

type Item = {
  id: string;
  file: File;
  preview?: string;
  status: "queued" | "running" | "done" | "failed";
  result?: AnalysisResponse;
  error?: string;
};

const TEXT_EXTS = [".log", ".txt", ".out", ".err"];
const IMAGE_EXTS = [".png", ".jpg", ".jpeg", ".webp", ".gif"];

function isImage(file: File) {
  return (
    file.type.startsWith("image/") ||
    IMAGE_EXTS.some((e) => file.name.toLowerCase().endsWith(e))
  );
}

export function UploadZone() {
  const toast = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [description, setDescription] = useState("");
  const [source, setSource] = useState<"manual_upload" | "promanage" | "sap">(
    "manual_upload",
  );
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((list: FileList | File[]) => {
    const next: Item[] = Array.from(list).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: isImage(file) ? URL.createObjectURL(file) : undefined,
      status: "queued",
    }));
    setItems((prev) => [...prev, ...next]);
  }, []);

  const removeItem = (id: string) => {
    setItems((prev) => {
      const it = prev.find((i) => i.id === id);
      if (it?.preview) URL.revokeObjectURL(it.preview);
      return prev.filter((i) => i.id !== id);
    });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const analyzeOne = async (item: Item) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: "running" } : i)),
    );

    const fd = new FormData();
    fd.append("file", item.file);
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
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, status: "done", result: data } : i,
        ),
      );
      toast.push("success", `${item.file.name}: ${data.analysis.severity.toUpperCase()} → incident oluşturuldu`);
    } catch (e) {
      const msg = (e as Error).message;
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, status: "failed", error: msg } : i,
        ),
      );
      toast.push("error", `${item.file.name}: ${msg}`);
    }
  };

  const analyzeAll = async () => {
    for (const it of items.filter((i) => i.status === "queued")) {
      // sıralı: rate limit dostu
      // eslint-disable-next-line no-await-in-loop
      await analyzeOne(it);
    }
  };

  const queuedCount = items.filter((i) => i.status === "queued").length;

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileInput.current?.click()}
        className={cn(
          "border border-dashed rounded-lg p-8 cursor-pointer transition-colors text-center",
          dragOver
            ? "border-accent bg-accent/5"
            : "border-border bg-surface hover:bg-elev",
        )}
      >
        <UploadIcon size={28} className="text-accent mx-auto mb-2" />
        <div className="text-sm">
          <span className="font-medium">Dosyaları sürükle</span> veya tıklayarak
          seç
        </div>
        <div className="text-xs text-muted mt-1">
          {[...TEXT_EXTS, ...IMAGE_EXTS].join(", ")} · birden fazla dosya
          desteklenir
        </div>
        <input
          ref={fileInput}
          type="file"
          multiple
          className="hidden"
          accept={[...TEXT_EXTS, ...IMAGE_EXTS].join(",")}
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
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
          <label className="text-xs text-muted">Açıklama / bağlam</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ne yaparken oldu, kim raporladı vb."
            className="w-full mt-1 bg-bg border border-border rounded-md px-3 py-2 text-sm"
          />
        </div>
      </div>

      {items.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted">
            {items.length} dosya · {queuedCount} bekliyor
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                items.forEach((i) => i.preview && URL.revokeObjectURL(i.preview));
                setItems([]);
              }}
              className="text-xs px-3 py-1.5 rounded border border-border hover:bg-elev flex items-center gap-1"
            >
              <Trash2 size={12} /> Tümünü kaldır
            </button>
            <button
              onClick={analyzeAll}
              disabled={queuedCount === 0}
              className="text-xs px-3 py-1.5 rounded bg-accent text-white disabled:opacity-50 flex items-center gap-1"
            >
              {items.some((i) => i.status === "running") && (
                <Loader2 size={12} className="animate-spin" />
              )}
              {queuedCount > 0 ? `${queuedCount} dosyayı analiz et` : "Tümü tamam"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((i) => (
          <ItemRow key={i.id} item={i} onRemove={removeItem} onRerun={analyzeOne} />
        ))}
      </div>
    </div>
  );
}

function ItemRow({
  item,
  onRemove,
  onRerun,
}: {
  item: Item;
  onRemove: (id: string) => void;
  onRerun: (item: Item) => void;
}) {
  const i = item;
  return (
    <div className="border border-border bg-surface rounded-lg p-3">
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          {i.preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={i.preview}
              alt=""
              className="h-16 w-16 object-cover rounded border border-border"
            />
          ) : (
            <div className="h-16 w-16 rounded border border-border bg-elev flex items-center justify-center">
              {isImage(i.file) ? <ImageIcon size={20} /> : <FileText size={20} />}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium truncate">{i.file.name}</div>
            <button
              onClick={() => onRemove(i.id)}
              className="text-muted hover:text-text"
              aria-label="Kaldır"
            >
              <X size={14} />
            </button>
          </div>
          <div className="text-xs text-muted">
            {(i.file.size / 1024).toFixed(1)} KB · {i.file.type || "?"}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            {i.status === "queued" && (
              <span className="text-muted">bekliyor</span>
            )}
            {i.status === "running" && (
              <span className="flex items-center gap-1 text-accent">
                <Loader2 size={12} className="animate-spin" /> analiz ediliyor…
              </span>
            )}
            {i.status === "done" && i.result && (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-success" />
                <SeverityBadge severity={i.result.analysis.severity} />
                <span className="text-muted">→</span>
                <Link
                  href={`/dashboard/${i.result.incident_id}`}
                  className="text-accent hover:underline"
                >
                  incident'a git
                </Link>
              </span>
            )}
            {i.status === "failed" && (
              <>
                <span className="text-danger">hata</span>
                <button
                  onClick={() => onRerun(i)}
                  className="text-xs underline text-muted hover:text-text"
                >
                  yeniden dene
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {i.status === "done" && i.result && (
        <div className="mt-3 border-t border-border pt-3 space-y-2 text-sm">
          <div className="font-medium">{i.result.analysis.title}</div>
          {i.result.analysis.summary && (
            <p className="whitespace-pre-wrap text-text">{i.result.analysis.summary}</p>
          )}
          {i.result.analysis.root_cause && (
            <div>
              <div className="text-xs text-muted">Olası kök neden</div>
              <p>{i.result.analysis.root_cause}</p>
            </div>
          )}
          {i.result.analysis.proactive_actions?.length > 0 && (
            <div>
              <div className="text-xs text-muted mb-1">Önerilen aksiyonlar</div>
              <ul className="space-y-1">
                {i.result.analysis.proactive_actions.map((a, idx) => (
                  <li
                    key={idx}
                    className="text-xs border border-border rounded px-2 py-1.5 bg-elev"
                  >
                    <span className="font-medium">{a.title}</span>
                    <span className="text-muted ml-2">
                      [{a.type}
                      {a.system ? ` · ${a.system}` : ""}
                      {a.requires_approval ? " · onay gerekli" : ""}]
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {i.result.analysis.similar_entries?.length > 0 && (
            <div>
              <div className="text-xs text-muted mb-1">Benzer geçmiş vakalar</div>
              <ul className="text-xs">
                {i.result.analysis.similar_entries.map((s, idx) => (
                  <li key={idx} className="text-muted">
                    <span className="text-text">{s.title}</span> · d=
                    {s.distance.toFixed(3)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {i.status === "failed" && i.error && (
        <div className="mt-2 text-xs text-danger border border-danger/30 bg-rose-900/10 rounded p-2">
          {i.error}
        </div>
      )}
    </div>
  );
}
