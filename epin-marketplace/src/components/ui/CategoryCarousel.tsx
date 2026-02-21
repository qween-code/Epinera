type Category = {
  name: string;
  slug: string;
};

export default function CategoryCarousel({ categories }: { categories: Category[] }) {
  return (
    <div className="py-8">
      <h2 className="terminal-label mb-4">// KATEGORILER</h2>
      <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((category) => (
          <a
            key={category.slug}
            href={`/category/${category.slug}`}
            className="flex-shrink-0 px-5 py-2.5 neo-sm rounded-full text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)] border border-[var(--border-dim)] transition-all"
          >
            {category.name}
          </a>
        ))}
      </div>
    </div>
  );
}
