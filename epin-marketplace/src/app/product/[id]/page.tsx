import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Zap, Star, Clock, Info } from "lucide-react";
import { BuyButton } from "@/components/product/BuyButton"; // Will create this next

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  // In a real scenario, we query by ID or Slug.
  // For the demo link from homepage, we might need to fetch one if 'id' is generic.
  // For now, assuming ID is passed correctly.

  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      category:category_id(name, slug),
      seller:seller_id(full_name, avatar_url)
    `)
    .eq('id', params.id)
    .single();

  if (!product) {
    // If simulation/demo, show a fallback mock product for aesthetic testing
    // notFound();
    return <MockProductView id={params.id} />;
  }

  return <ProductDetailView product={product} />;
}

function ProductDetailView({ product }: { product: any }) {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Images & Info */}
      <div className="lg:col-span-2 space-y-6">

        {/* Main Image Area */}
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-800 relative border border-white/5 shadow-2xl">
          <div className="absolute top-4 left-4 z-10">
             <Badge variant="success" className="bg-emerald-500 text-white shadow-lg">
               <Zap size={12} className="inline mr-1" /> Anında Teslimat
             </Badge>
          </div>
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
            {/* Placeholder for product image */}
            <span className="text-slate-600 font-bold text-4xl uppercase tracking-widest">
              {product.category?.name || "Product"}
            </span>
          </div>
        </div>

        {/* Description Card */}
        <GlassCard className="p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Info size={20} className="text-blue-400" />
            Ürün Açıklaması
          </h2>
          <div className="prose prose-invert max-w-none text-slate-300">
            <p>{product.description}</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>%100 Güvenli Satış</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={16} className="text-blue-400" />
                <span>7/24 Otomatik Teslimat</span>
              </li>
            </ul>
          </div>
        </GlassCard>

      </div>

      {/* Right Column: Purchase & Seller */}
      <div className="space-y-6">

        {/* Purchase Card */}
        <GlassCard className="p-6 sticky top-24 border-t-4 border-t-blue-500">
          <h1 className="text-2xl font-bold text-white mb-2 leading-tight">
            {product.title}
          </h1>

          <div className="flex items-end gap-2 mb-6">
            <span className="text-3xl font-bold text-emerald-400">
              ₺{product.price}
            </span>
            <span className="text-sm text-slate-500 mb-1 line-through">
              ₺{(product.price * 1.2).toFixed(2)}
            </span>
          </div>

          <div className="space-y-3">
            <BuyButton productId={product.id} price={product.price} />
            <NeonButton variant="secondary" className="w-full">
              Satıcıya Soru Sor
            </NeonButton>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5 text-xs text-slate-400 text-center">
            Bu ürün <strong className="text-white">EPINERA Güvencesi</strong> altındadır.
          </div>
        </GlassCard>

        {/* Seller Card */}
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500"></div>
          <div className="flex-1">
            <h4 className="font-bold text-white">GameStore TR</h4>
            <div className="flex items-center text-yellow-400 text-xs">
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <span className="ml-1 text-slate-400">(1250 Satış)</span>
            </div>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}

// Mock View for Simulation when ID doesn't exist
function MockProductView({ id }: { id: string }) {
  const mock = {
    id: id,
    title: "Valorant 2500 VP (TR) - Anında Teslimat",
    price: 450.00,
    description: "TR sunucularında geçerli 2500 Valorant Points kodu. Ödeme sonrası anında ekranda belirir. 7/24 Stok.",
    category: { name: "Valorant" }
  };
  return <ProductDetailView product={mock} />;
}
