import { SectionHeading } from "@/components/atoms/section-heading";
import { CommunityCard } from "@/components/molecules/community-card";

export type CommunityContent = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: Array<{
    id: string;
    title: string;
    excerpt: string;
    author: string;
    badges: string[];
  }>;
};

type CommunitySectionProps = {
  content: CommunityContent;
};

export function CommunitySection({ content }: CommunitySectionProps) {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-20 sm:px-10 lg:px-16">
      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <div className="grid gap-6 md:grid-cols-2">
        {content.highlights.map((highlight) => (
          <CommunityCard key={highlight.id} {...highlight} />
        ))}
      </div>
    </section>
  );
}
