import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover" | "interactive";
  children: React.ReactNode;
}

export const GlassCard = ({
  className = "",
  variant = "default",
  children,
  ...props
}: GlassCardProps) => {
  const baseStyles = "rounded-xl border border-white/5 backdrop-blur-md transition-all duration-300";

  const variants = {
    default: "bg-slate-900/60",
    hover: "bg-slate-900/60 hover:bg-slate-800/70 hover:border-white/10 hover:shadow-lg hover:-translate-y-1",
    interactive: "bg-slate-900/40 hover:bg-slate-800/60 cursor-pointer active:scale-95"
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
