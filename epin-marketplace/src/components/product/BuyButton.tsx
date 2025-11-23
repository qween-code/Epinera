"use client";

import React, { useState } from "react";
import { NeonButton } from "@/components/ui/NeonButton";
import { buyProduct } from "@/lib/actions/order";
import { useRouter } from "next/navigation";
import { Wallet, Loader2 } from "lucide-react";

export const BuyButton = ({ productId, price }: { productId: string, price: number }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBuy = async () => {
    if (!confirm(`₺${price} tutarındaki ürünü satın almak istiyor musunuz?`)) return;

    setLoading(true);
    try {
      const result = await buyProduct(productId);
      if (result.success) {
        alert("Satın alma başarılı! Kodlarınız 'Envanterim' sayfasına eklendi.");
        router.push('/dashboard/inventory');
      }
    } catch (error) {
      // Ideally catch specific error for "Insufficient Funds"
      alert("İşlem başarısız. Lütfen bakiyenizi kontrol edin.");
      router.push('/dashboard/wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <NeonButton
      onClick={handleBuy}
      disabled={loading}
      className="w-full py-4 text-lg shadow-xl shadow-blue-900/20 hover:shadow-blue-900/40"
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <Wallet size={20} /> Hemen Satın Al
        </>
      )}
    </NeonButton>
  );
};
