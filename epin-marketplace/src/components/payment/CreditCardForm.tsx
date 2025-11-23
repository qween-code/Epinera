"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";
import { depositFunds } from "@/lib/actions/wallet";

interface CreditCardFormProps {
  amount: number;
  onSuccess: () => void;
}

export const CreditCardForm = ({ amount, onSuccess }: CreditCardFormProps) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "3d-secure" | "success">("form");
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: ""
  });

  const handleFormatCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);
    const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    setFormData({ ...formData, cardNumber: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate Processing Delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Move to 3D Secure Simulation
    setLoading(false);
    setStep("3d-secure");
  };

  const handle3DSecure = async () => {
    setLoading(true);
    // Simulate Bank Auth
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Call Server Action
      await depositFunds(amount, { method: 'credit_card', last4: formData.cardNumber.slice(-4) });
      setStep("success");
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("Ödeme başarısız oldu.");
      setLoading(false);
    }
  };

  if (step === "3d-secure") {
    return (
      <GlassCard className="p-6 flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in">
        <ShieldCheck className="h-16 w-16 text-emerald-400" />
        <h3 className="text-xl font-bold">3D Secure Doğrulama</h3>
        <p className="text-sm text-slate-400">
          Lütfen bankanızdan gelen SMS kodunu giriniz.<br/>
          <span className="text-xs">(Simülasyon: Herhangi bir koda tıklayın)</span>
        </p>
        <div className="flex gap-2 my-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-12 w-10 rounded bg-white/5 border border-white/10 flex items-center justify-center text-xl font-mono">
              •
            </div>
          ))}
        </div>
        <NeonButton
          onClick={handle3DSecure}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Doğrulanıyor..." : "Onayla ve Tamamla"}
        </NeonButton>
      </GlassCard>
    );
  }

  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in">
        <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
          <CreditCard size={40} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Ödeme Başarılı!</h3>
        <p className="text-slate-400">Bakiyeniz güncellendi.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="space-y-1">
        <label className="text-xs text-slate-400 uppercase font-bold">Kart Sahibi</label>
        <input
          required
          type="text"
          placeholder="AD SOYAD"
          className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
          value={formData.cardName}
          onChange={e => setFormData({...formData, cardName: e.target.value})}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-400 uppercase font-bold">Kart Numarası</label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-3.5 text-slate-500 h-5 w-5" />
          <input
            required
            type="text"
            placeholder="0000 0000 0000 0000"
            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 pl-10 font-mono text-white focus:border-blue-500 focus:outline-none transition-colors"
            value={formData.cardNumber}
            onChange={handleFormatCardNumber}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs text-slate-400 uppercase font-bold">Son Kullanma</label>
          <input
            required
            type="text"
            placeholder="AA/YY"
            maxLength={5}
            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-center text-white focus:border-blue-500 focus:outline-none transition-colors"
            value={formData.expiry}
            onChange={e => {
              let val = e.target.value.replace(/\D/g, '');
              if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
              setFormData({...formData, expiry: val});
            }}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-400 uppercase font-bold flex items-center gap-1">
            CVC <Lock size={10} />
          </label>
          <input
            required
            type="text"
            placeholder="123"
            maxLength={3}
            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-center text-white focus:border-blue-500 focus:outline-none transition-colors"
            value={formData.cvc}
            onChange={e => setFormData({...formData, cvc: e.target.value.replace(/\D/g, '')})}
          />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500">Toplam Tutar</span>
          <span className="text-xl font-bold text-white">₺{amount.toFixed(2)}</span>
        </div>
        <NeonButton type="submit" disabled={loading} className="px-8">
          {loading ? "İşleniyor..." : "Ödeme Yap"}
        </NeonButton>
      </div>
    </form>
  );
};
