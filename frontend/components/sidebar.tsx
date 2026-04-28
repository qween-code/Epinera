"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpen,
  LayoutDashboard,
  MessageSquare,
  ScrollText,
  Settings,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Pano", icon: LayoutDashboard },
  { href: "/logs", label: "Canlı Log", icon: ScrollText },
  { href: "/chat", label: "Asistan", icon: MessageSquare },
  { href: "/upload", label: "Dosya Analizi", icon: Upload },
  { href: "/knowledge", label: "Know-How", icon: BookOpen },
  { href: "/settings", label: "Ayarlar", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 border-r border-border bg-surface flex flex-col">
      <div className="px-5 py-5 flex items-center gap-2 border-b border-border">
        <Activity className="text-accent" size={20} />
        <span className="font-semibold tracking-tight">Sentinel</span>
      </div>
      <nav className="flex-1 px-3 py-3 space-y-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-elev text-text"
                  : "text-muted hover:bg-elev hover:text-text",
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-3 text-xs text-muted border-t border-border">
        SAP & ProManage Sentinel
      </div>
    </aside>
  );
}
