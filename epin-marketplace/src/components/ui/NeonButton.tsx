import React from "react";

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const NeonButton = ({
  className = "",
  variant = "primary",
  size = "md",
  children,
  ...props
}: NeonButtonProps) => {
  const baseStyles = "relative overflow-hidden rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] border border-blue-500/50",
    secondary: "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 hover:border-slate-600",
    danger: "bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-900/50",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
