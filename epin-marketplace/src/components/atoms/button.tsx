import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  variant?: Variant;
  icon?: ReactNode;
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-epin-cyan via-epin-violet to-epin-magenta text-white shadow-lg hover:shadow-xl", // gradient accent
  secondary:
    "border border-epin-cyan/40 text-epin-cyan hover:bg-epin-cyan/10", // border accent
  ghost:
    "text-epin-slate hover:text-white hover:bg-epin-slate/10",
};

export function Button({
  variant = "primary",
  icon,
  children,
  className,
  fullWidth,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-tight transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-epin-cyan",
        fullWidth && "w-full",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
