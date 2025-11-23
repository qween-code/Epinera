import { createClient } from "@/utils/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Copy, ExternalLink, Package } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import { redirect } from "next/navigation";

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch Orders with their items
  // Note: We need to fetch order_items to get the digital content
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:product_id (title, description)
      )
    `)
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Package size={24} />
          </div>
          <h1 className="text-3xl font-bold text-white">Envanterim</h1>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['Tümü', 'Bekleyenler', 'Teslim Edilenler', 'İptal'].map((f, i) => (
          <button
            key={f}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${i === 0 ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {(!orders || orders.length === 0) ? (
           <GlassCard className="p-12 text-center flex flex-col items-center justify-center">
             <Package size={48} className="text-slate-600 mb-4" />
             <h3 className="text-lg font-bold text-white">Henüz satın alma yapmadınız.</h3>
             <p className="text-slate-400 mb-6">İlk alışverişinizi yapmak için markete göz atın.</p>
             <NeonButton>
                <a href="/">Markete Git</a>
             </NeonButton>
           </GlassCard>
        ) : (
          orders.map((order: any) => {
            // Flatten items to display
            // Assuming 1 item per order for this simple flow, or map them all
            return order.order_items.map((item: any) => {
              const content = item.digital_content_delivered || {};
              const displayCode = content.code || content.account || content.account_data || "Teslimat Bekleniyor";

              return (
                <GlassCard key={item.id} className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center group hover:bg-slate-800/40">
                  <div className="h-20 w-20 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    <span className="text-xs text-slate-500 font-bold text-center px-2">{item.product?.title?.substring(0, 10)}...</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white truncate">{item.product?.title || "Ürün"}</h4>
                      <Badge variant="success">Tamamlandı</Badge>
                    </div>
                    <p className="text-sm text-slate-400">
                      {new Date(order.created_at).toLocaleDateString('tr-TR')} • {new Date(order.created_at).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                    </p>

                    {/* Delivered Code Section */}
                    <div className="mt-3 p-3 rounded bg-black/30 border border-white/5 flex items-center justify-between group/code">
                      <div className="flex flex-col">
                         <span className="text-[10px] text-slate-500 uppercase font-bold">Teslim Edilen Kod / Bilgi</span>
                         <code className="font-mono text-emerald-400 text-sm break-all">
                           {displayCode}
                         </code>
                      </div>
                      <button className="text-slate-500 hover:text-white opacity-0 group-hover/code:opacity-100 transition-opacity">
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-lg font-bold text-white">₺{item.total_price}</span>
                    <NeonButton variant="secondary" size="sm">
                      Destek
                    </NeonButton>
                  </div>
                </GlassCard>
              );
            });
          })
        )}
      </div>
    </div>
  );
}
