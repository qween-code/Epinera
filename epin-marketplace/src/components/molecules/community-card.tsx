type CommunityCardProps = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  badges: string[];
};

export function CommunityCard({ title, excerpt, author, badges }: CommunityCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-white transition hover:-translate-y-1 hover:border-epin-cyan/50">
      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => (
          <span
            key={badge}
            className="rounded-full bg-epin-cyan/10 px-3 py-1 text-xs font-medium text-epin-cyan"
          >
            {badge}
          </span>
        ))}
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-epin-slate">{excerpt}</p>
      <div className="mt-auto flex items-center justify-between text-xs text-epin-slate">
        <span>{author}</span>
        <span className="flex items-center gap-1 text-epin-cyan">
          <span aria-hidden>↗</span>
          Join Thread
        </span>
      </div>
    </article>
  );
}
