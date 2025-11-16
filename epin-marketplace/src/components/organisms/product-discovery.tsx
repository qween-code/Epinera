import { SectionHeading } from "@/components/atoms/section-heading";
import { ProductCard, type ProductCardProps } from "@/components/molecules/product-card";

export type Category = {
  id: string;
  label: string;
  icon: string;
};

export type DiscoveryContent = {
  eyebrow: string;
  title: string;
  description: string;
  categories: Category[];
  featured: ProductCardProps[];
  personalized: ProductCardProps[];
};

type ProductDiscoveryProps = {
  content: DiscoveryContent;
};

export function ProductDiscovery({ content }: ProductDiscoveryProps) {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 sm:px-10 lg:px-16">
      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <div className="flex snap-x gap-4 overflow-x-auto pb-2">
        {content.categories.map((category) => (
          <button
            type="button"
            key={category.id}
            className="snap-start rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-1 hover:border-epin-cyan/40"
          >
            <span className="mr-2 text-lg" aria-hidden>
              {category.icon}
            </span>
            {category.label}
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <h3
            id="flash-deals"
            className="text-sm font-semibold uppercase tracking-[0.3em] text-epin-cyan"
          >
            Flash Deals
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {content.featured.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <h3
            id="for-you"
            className="text-sm font-semibold uppercase tracking-[0.3em] text-epin-cyan"
          >
            For You
          </h3>
          <div className="grid gap-4">
            {content.personalized.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
