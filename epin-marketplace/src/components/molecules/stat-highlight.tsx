import type { ReactNode } from "react";

export type StatHighlightProps = {
  label: string;
  value: string;
  description: string;
  icon?: ReactNode;
};

export function StatHighlight({ label, value, description, icon }: StatHighlightProps) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-white">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-epin-cyan">
        {icon ? <span aria-hidden>{icon}</span> : null}
        {label}
      </div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <p className="text-xs text-epin-slate">{description}</p>
    </div>
  );
}
