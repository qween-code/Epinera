import React from "react";

interface BadgeProps {
  variant?: "success" | "warning" | "error" | "info" | "neutral";
  children: React.ReactNode;
  className?: string;
}

export const Badge = ({ variant = "neutral", children, className = "" }: BadgeProps) => {
  const variants = {
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    neutral: "bg-slate-500/10 text-slate-400 border-slate-500/20"
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
