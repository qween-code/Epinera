import Link from "next/link";
import { Button } from "@/components/atoms/button";

export type NavigationLink = {
  href: string;
  label: string;
};

type NavigationProps = {
  links: NavigationLink[];
  ctaLabel: string;
  secondaryLabel: string;
};

export function MarketplaceNavigation({ links, ctaLabel, secondaryLabel }: NavigationProps) {
  return (
    <header className="sticky top-0 z-50 mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-xl sm:px-6">
      <Link href="#" className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-epin-cyan to-epin-magenta text-lg">
          ⚡
        </span>
        <span>Epin Marketplace</span>
      </Link>
      <nav className="hidden items-center gap-6 text-xs font-medium uppercase tracking-[0.2em] text-epin-slate md:flex">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="transition hover:text-white">
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="hidden text-xs md:inline-flex">
          {secondaryLabel}
        </Button>
        <Button className="hidden text-xs md:inline-flex">{ctaLabel}</Button>
        <Button
          variant="ghost"
          className="inline-flex rounded-full border border-white/10 bg-white/5 text-xs text-white md:hidden"
        >
          ☰
        </Button>
      </div>
    </header>
  );
}
