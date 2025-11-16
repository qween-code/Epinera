import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-epin-cyan/30 bg-epin-cyan/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-epin-cyan",
        className,
      )}
    >
      {children}
    </span>
  );
}
