import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/utils/cn";

type SearchBarProps = {
  placeholder: string;
  trending: string[];
  className?: string;
};

export function SearchBar({ placeholder, trending, className }: SearchBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:gap-4",
        className,
      )}
    >
      <div className="flex flex-1 items-center gap-3 rounded-2xl bg-black/40 px-4 py-3">
        <span aria-hidden className="text-xl text-epin-cyan">
          🔍
        </span>
        <input
          type="search"
          placeholder={placeholder}
          className="flex-1 border-0 bg-transparent text-sm text-white placeholder:text-epin-slate focus:outline-none"
        />
        <Button variant="ghost" className="hidden whitespace-nowrap text-xs sm:inline-flex">
          AI Assist
        </Button>
      </div>
      <Button className="w-full text-sm sm:w-auto">Explore Deals</Button>
      <div className="flex flex-wrap items-center gap-2 text-xs text-epin-slate">
        <span className="font-semibold uppercase tracking-[0.2em] text-epin-cyan">Trending:</span>
        {trending.map((item) => (
          <span
            key={item}
            className="rounded-full bg-white/5 px-3 py-1 text-epin-slate/80"
          >
            #{item}
          </span>
        ))}
      </div>
    </div>
  );
}
