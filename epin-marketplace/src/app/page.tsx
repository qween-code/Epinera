import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, Shield, Zap, Star, ChevronRight, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  // Fetch real products for the homepage grid
  const supabase = await createClient();
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*, seller:seller_id(full_name)')
    .eq('status', 'active')
    .limit(8);

  return (
    <div className="flex flex-col gap-8">

      {/* Hero Section */}
      <section className="relative h-[400px] w-full rounded-2xl overflow-hidden border border-white/5 group">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-0)] via-[var(--color-surface-0)]/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-3xl">
          <Badge variant="info" className="mb-4 border-blue-400/30 bg-blue-500/20 text-blue-300">
            YENİ SEZON BAŞLADI
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              Geleceğin Pazar Yeri
            </span>
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
            En uygun fiyatlı Valorant VP, LoL RP ve CS2 Skinleri anında teslimat garantisiyle EPINERA'da.
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard/wallet">
               <NeonButton size="lg" className="px-8 shadow-lg shadow-blue-900/20">
                 Alışverişe Başla
               </NeonButton>
            </Link>
            <NeonButton variant="secondary" size="lg">
              Nasıl Çalışır?
            </NeonButton>
          </div>
        </div>
      </section>

      {/* Live Feed Ticker (Simulation) */}
      <div className="flex items-center gap-4 overflow-hidden py-2">
        <div className="flex items-center gap-2 text-emerald-400 whitespace-nowrap px-4 border-r border-white/5">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-widest">Canlı Satışlar</span>
        </div>
        <div className="flex gap-8 animate-marquee whitespace-nowrap text-xs text-slate-400">
          <span><strong className="text-white">Ahmet K.</strong> 1200 VP satın aldı.</span>
          <span><strong className="text-white">Selin Y.</strong> LoL 30 Level Hesap satın aldı.</span>
          <span><strong className="text-white">Mehmet T.</strong> 60 UC satın aldı.</span>
          <span><strong className="text-white">Can B.</strong> Knight Online 1 GB satın aldı.</span>
          <span><strong className="text-white">User_99</strong> Netflix 1 Aylık satın aldı.</span>
        </div>
      </div>

      {/* Featured Categories Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Valorant", sub: "VP & Hesap", bg: "from-red-500/20 to-red-900/5", border: "group-hover:border-red-500/30" },
          { title: "League of Legends", sub: "RP & Hesap", bg: "from-blue-500/20 to-blue-900/5", border: "group-hover:border-blue-500/30" },
          { title: "PUBG Mobile", sub: "UC & Hesap", bg: "from-yellow-500/20 to-yellow-900/5", border: "group-hover:border-yellow-500/30" },
          { title: "CS2", sub: "Skin & Key", bg: "from-orange-500/20 to-orange-900/5", border: "group-hover:border-orange-500/30" },
        ].map((item, i) => (
          <GlassCard
            key={i}
            variant="interactive"
            className={`h-32 flex flex-col justify-between p-6 bg-gradient-to-br ${item.bg} group relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div>
              <h3 className="text-xl font-bold text-white group-hover:scale-105 transition-transform origin-left">{item.title}</h3>
              <p className="text-sm text-white/60">{item.sub}</p>
            </div>
            <div className="flex justify-between items-end relative z-10">
              <span className="text-xs font-medium text-white/40 bg-white/5 px-2 py-1 rounded backdrop-blur-sm group-hover:text-white transition-colors">
                450+ İlan
              </span>
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                <ChevronRight size={16} />
              </div>
            </div>
          </GlassCard>
        ))}
      </section>

      {/* "Fırsat Ürünleri" (Featured Products) */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Zap className="text-yellow-400" />
            <h2 className="text-2xl font-bold">Günün Fırsatları</h2>
          </div>
          <button className="text-sm text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
            Tümünü Gör <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts && featuredProducts.length > 0 ? featuredProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="contents">
              <GlassCard variant="hover" className="flex flex-col group h-full cursor-pointer">
                {/* Image Area */}
                <div className="relative aspect-video bg-slate-800 rounded-t-xl overflow-hidden">
                  <div className="absolute top-2 left-2 z-10">
                    <Badge variant="success" className="bg-emerald-500 text-white border-none shadow-lg shadow-emerald-900/20">
                      Anında Teslimat
                    </Badge>
                  </div>
                  {/* Placeholder Image Gradient */}
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                     <span className="text-slate-500 font-bold text-xs uppercase">{product.title?.substring(0, 10)}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1 gap-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-200 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                      {product.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-auto">
                    <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                    <span>{product.seller?.full_name || "GameStore"}</span>
                    <div className="flex items-center text-yellow-400 ml-auto">
                      <Star size={12} fill="currentColor" />
                      <span className="ml-1 text-slate-300">4.9</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 line-through">₺{(product.price * 1.2).toFixed(2)}</span>
                      <span className="text-lg font-bold text-white">₺{product.price}</span>
                    </div>
                    <button className="h-8 w-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors shadow-lg shadow-blue-900/20">
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </Link>
          )) : (
            <div className="col-span-full py-12 text-center text-slate-500">
               Aktif ürün bulunamadı. Veritabanını kontrol edin.
            </div>
          )}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-surface-1)] border border-white/5">
          <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Shield size={24} />
          </div>
          <div>
            <h4 className="font-bold text-white">Güvenli Ödeme</h4>
            <p className="text-sm text-slate-400">3D Secure ile %100 koruma</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-surface-1)] border border-white/5">
          <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Zap size={24} />
          </div>
          <div>
            <h4 className="font-bold text-white">Anında Teslimat</h4>
            <p className="text-sm text-slate-400">7/24 Otomatik kod gönderimi</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-surface-1)] border border-white/5">
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <h4 className="font-bold text-white">En İyi Fiyatlar</h4>
            <p className="text-sm text-slate-400">Piyasadaki en rekabetçi fiyatlar</p>
          </div>
        </div>
      </section>
    </div>
  );
}
