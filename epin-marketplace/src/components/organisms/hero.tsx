import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { SearchBar } from "@/components/molecules/search-bar";
import { StatHighlight, type StatHighlightProps } from "@/components/molecules/stat-highlight";

export type HeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  stats: StatHighlightProps[];
  searchPlaceholder: string;
  trending: string[];
};

type HeroProps = {
  content: HeroContent;
};

export function MarketplaceHero({ content }: HeroProps) {
  return (
    <section className="relative isolate mx-auto flex w-full max-w-6xl flex-col gap-10 overflow-hidden rounded-4xl border border-white/10 bg-gradient-to-br from-black via-black/80 to-black/60 px-6 py-10 shadow-[0_60px_140px_-40px_rgba(15,23,42,0.6)] sm:px-10 lg:px-16 lg:py-14">
      <div className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_65%)] lg:block" />
      <div className="space-y-6 text-white">
        <Badge className="w-fit border-white/20 bg-white/10 text-white">
          {content.eyebrow}
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          {content.title}
        </h1>
        <p className="max-w-2xl text-base text-epin-slate sm:text-lg">
          {content.description}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="w-full sm:w-auto">{content.primaryCta}</Button>
          <Button variant="ghost" className="w-full bg-white/5 sm:w-auto">
            {content.secondaryCta}
          </Button>
        </div>
      </div>
      <SearchBar
        placeholder={content.searchPlaceholder}
        trending={content.trending}
        className="border-white/10 bg-black/40"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {content.stats.map((stat) => (
          <StatHighlight key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}
