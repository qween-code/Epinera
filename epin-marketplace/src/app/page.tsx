import HomepageHeader from "@/components/homepage/HomepageHeader";
import HomepageHero from "@/components/homepage/HomepageHero";
import CategoryTabs from "@/components/homepage/CategoryTabs";
import FlashDeals from "@/components/homepage/FlashDeals";
import AIRecommendations from "@/components/homepage/AIRecommendations";
import CommunityFeed from "@/components/homepage/CommunityFeed";
import TrustBar from "@/components/homepage/TrustBar";
import HomepageFooter from "@/components/homepage/HomepageFooter";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-white">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center">
          <div className="layout-content-container flex flex-col w-full max-w-screen-xl flex-1">
            <HomepageHeader />
            <main className="flex-grow px-6 sm:px-10 py-8">
              <HomepageHero />
              <CategoryTabs />
              {/* Grid layout for main content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <FlashDeals />
                  <AIRecommendations />
                </div>
                <CommunityFeed />
              </div>
            </main>
            <TrustBar />
            <HomepageFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
