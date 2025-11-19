import HomepageHeader from "@/components/homepage/HomepageHeader";
import NewHero from "@/components/homepage/NewHero";
import ProductGrid from "@/components/homepage/ProductGrid";
import HomepageFooter from "@/components/homepage/HomepageFooter";
import TrustBar from "@/components/homepage/TrustBar";

// Mock Data
const trendingProducts = [
  { id: '1', title: 'Elden Ring', slug: 'elden-ring', price: 49.99, originalPrice: 59.99, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop', platform: 'steam' as const, rating: 4.9 },
  { id: '2', title: 'God of War Ragnarök', slug: 'god-of-war-ragnarok', price: 59.99, originalPrice: 69.99, image: 'https://images.unsplash.com/photo-1535453130691-7631e12771b3?q=80&w=2070&auto=format&fit=crop', platform: 'playstation' as const, rating: 4.8 },
  { id: '3', title: 'Cyberpunk 2077', slug: 'cyberpunk-2077', price: 29.99, originalPrice: 59.99, image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop', platform: 'steam' as const, rating: 4.5 },
  { id: '4', title: 'FIFA 24', slug: 'fifa-24', price: 39.99, originalPrice: 69.99, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop', platform: 'xbox' as const, rating: 4.2 },
  { id: '5', title: 'Red Dead Redemption 2', slug: 'red-dead-redemption-2', price: 19.99, originalPrice: 59.99, image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1947&auto=format&fit=crop', platform: 'steam' as const, rating: 4.9 },
];

const bestSellers = [
  { id: '6', title: 'Minecraft Java & Bedrock', slug: 'minecraft-java-bedrock', price: 24.99, originalPrice: 29.99, image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2074&auto=format&fit=crop', platform: 'steam' as const, rating: 4.8 },
  { id: '7', title: 'GTA V Premium Edition', slug: 'gta-v-premium-edition', price: 14.99, originalPrice: 29.99, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop', platform: 'steam' as const, rating: 4.7 },
  { id: '8', title: 'Call of Duty: MW3', slug: 'call-of-duty-mw3', price: 59.99, originalPrice: 69.99, image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop', platform: 'xbox' as const, rating: 4.3 },
  { id: '9', title: 'Hogwarts Legacy', slug: 'hogwarts-legacy', price: 44.99, originalPrice: 59.99, image: 'https://images.unsplash.com/photo-1519669556878-63bdad8a1a49?q=80&w=2071&auto=format&fit=crop', platform: 'steam' as const, rating: 4.6 },
  { id: '10', title: 'Valorant Points 1000', slug: 'valorant-points-1000', price: 9.99, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop', platform: 'steam' as const, rating: 5.0 },
];

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#0B0E14] font-display text-white">
      <HomepageHeader />

      <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section */}
        <NewHero />

        {/* Categories / Quick Links */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {['Steam', 'Xbox', 'PlayStation', 'Gift Cards', 'Software', 'Antivirus'].map((cat) => (
            <div key={cat} className="group cursor-pointer rounded-xl border border-white/5 bg-[#13161C] p-4 text-center transition-all hover:border-[#00A3FF] hover:bg-[#1A1D24]">
              <span className="mb-2 block text-2xl text-[#00A3FF]">
                {cat === 'Steam' ? 'sports_esports' :
                  cat === 'Xbox' ? 'gamepad' :
                    cat === 'PlayStation' ? 'stadia_controller' :
                      cat === 'Gift Cards' ? 'card_giftcard' :
                        cat === 'Software' ? 'terminal' : 'security'}
              </span>
              <span className="text-sm font-bold text-white group-hover:text-[#00A3FF] transition-colors">{cat}</span>
            </div>
          ))}
        </div>

        {/* Trending Products */}
        <ProductGrid
          title="Trending Now"
          icon="trending_up"
          products={trendingProducts}
        />

        {/* Banner / Ad Space */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 px-8 py-12 shadow-2xl">
          <div className="relative z-10 flex flex-col items-start justify-center md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="mb-2 text-3xl font-bold text-white">Sell Your Skins & Games</h3>
              <p className="text-gray-200">Turn your digital assets into cash instantly. Secure and fast.</p>
            </div>
            <button className="rounded-xl bg-white px-8 py-3 text-base font-bold text-indigo-900 transition-all hover:bg-gray-100 hover:scale-105">
              Start Selling
            </button>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        </div>

        {/* Best Sellers */}
        <ProductGrid
          title="Best Sellers"
          icon="verified"
          products={bestSellers}
        />

        <TrustBar />
      </main>

      <HomepageFooter />
    </div>
  );
}
