"use client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/api";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const router = useRouter();
  return (
    <div className="h-14 border-b border-border bg-surface px-6 flex items-center justify-between">
      <div>
        <h1 className="text-sm font-semibold">{title}</h1>
        {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      </div>
      <button
        onClick={() => {
          clearToken();
          router.push("/");
        }}
        className="flex items-center gap-2 text-xs text-muted hover:text-text"
      >
        <LogOut size={14} /> Çıkış
      </button>
    </div>
  );
}
