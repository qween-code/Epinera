import { headers } from "next/headers";
import { MarketplaceNavigation } from "@/components/organisms/navigation";
import { MarketplaceHero } from "@/components/organisms/hero";
import { ProductDiscovery } from "@/components/organisms/product-discovery";
import { CommunitySection } from "@/components/organisms/community-section";
import { getHomepageContent, resolveLocale } from "@/data/homepage";

export default function Home() {
  const locale = resolveLocale(headers().get("accept-language"));
  const content = getHomepageContent(locale);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05060b] via-[#050816] to-[#0b1026] pb-24 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-12 px-3 py-6 sm:px-6">
        <MarketplaceNavigation
          links={content.navigation.links}
          ctaLabel={content.navigation.ctaLabel}
          secondaryLabel={content.navigation.secondaryLabel}
        />
        <main className="flex flex-1 flex-col gap-16">
          <div id="hero">
            <MarketplaceHero content={content.hero} />
          </div>
          <section id="discover" className="rounded-[2.5rem] border border-white/5 bg-white/5 backdrop-blur-sm">
            <ProductDiscovery content={content.discovery} />
          </section>
          <section id="community" className="rounded-[2.5rem] border border-white/5 bg-black/40">
            <CommunitySection content={content.community} />
          </section>
        </main>
        <footer className="flex flex-col items-center gap-2 text-xs text-epin-slate sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Epin Marketplace. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <a href="#" className="hover:text-white">
              Support
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
