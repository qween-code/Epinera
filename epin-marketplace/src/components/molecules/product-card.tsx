import type { ReactNode } from "react";
import { Button } from "@/components/atoms/button";

export type ProductCardProps = {
  id: string;
  name: string;
  price: string;
  badge: string;
  icon: string;
  meta: string;
  deliveryTime: string;
  rating: string;
  actionLabel: string;
  footer?: ReactNode;
};

export function ProductCard({
  name,
  price,
  badge,
  icon,
  meta,
  deliveryTime,
  rating,
  actionLabel,
  footer,
}: ProductCardProps) {
  return (
    <article className="group flex flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-5 text-white shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:border-epin-cyan/50">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-epin-cyan/20 via-epin-violet/20 to-epin-magenta/30 text-2xl">
          <span aria-hidden>{icon}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-epin-cyan">
            {badge}
          </span>
          <h3 className="text-lg font-semibold tracking-tight">{name}</h3>
          <p className="text-xs text-epin-slate">{meta}</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-epin-slate">
        <span className="flex items-center gap-1">⚡ {deliveryTime}</span>
        <span className="flex items-center gap-1">⭐ {rating}</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-xs uppercase text-epin-slate">Starting at</span>
          <div className="text-2xl font-semibold tracking-tight">{price}</div>
        </div>
        <Button className="text-sm">{actionLabel}</Button>
      </div>
      {footer ? <div className="text-xs text-epin-slate">{footer}</div> : null}
    </article>
  );
}
