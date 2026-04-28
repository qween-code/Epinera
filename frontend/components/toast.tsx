"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "warn" | "info";
interface Toast {
  id: string;
  tone: ToastTone;
  message: string;
}

interface ToastContextValue {
  push: (tone: ToastTone, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

const ICONS = {
  success: <CheckCircle2 size={16} />,
  warn: <AlertTriangle size={16} />,
  error: <XCircle size={16} />,
  info: <Info size={16} />,
};

const STYLES: Record<ToastTone, string> = {
  success: "border-emerald-700/40 bg-emerald-900/40 text-emerald-200",
  warn: "border-amber-700/40 bg-amber-900/40 text-amber-200",
  error: "border-rose-700/40 bg-rose-900/40 text-rose-200",
  info: "border-border bg-elev text-text",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const push = useCallback((tone: ToastTone, message: string) => {
    const id = crypto.randomUUID();
    setItems((prev) => [...prev, { id, tone, message }]);
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    const t = setTimeout(() => {
      setItems((prev) => prev.slice(1));
    }, 4500);
    return () => clearTimeout(t);
  }, [items]);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-start gap-2 rounded-lg border px-3 py-2 text-sm shadow-lg",
              STYLES[t.tone],
            )}
          >
            <span className="mt-0.5">{ICONS[t.tone]}</span>
            <div className="flex-1 whitespace-pre-wrap">{t.message}</div>
            <button
              onClick={() =>
                setItems((prev) => prev.filter((i) => i.id !== t.id))
              }
              className="text-muted hover:text-text"
              aria-label="Kapat"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
