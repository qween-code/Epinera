"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { CreditCardForm } from "@/components/payment/CreditCardForm";
import { Wallet, ArrowUpRight, History } from "lucide-react";

interface WalletViewProps {
  initialBalance: number;
  transactions: any[];
}

export const WalletView = ({ initialBalance, transactions }: WalletViewProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const presetAmounts = [50, 100, 250, 500, 1000];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-900/20">
          <Wallet className="text-white h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Cüzdanım</h1>
          <p className="text-slate-400">Bakiye yükle, harcamalarını yönet.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <GlassCard className="p-6 flex flex-col justify-between bg-gradient-to-br from-slate-800/50 to-slate-900/80 md:col-span-1">
          <div>
            <span className="text-sm text-slate-400 font-medium">Mevcut Bakiye</span>
            <div className="text-4xl font-bold text-white mt-2 font-mono">
              ₺{initialBalance.toFixed(2)}
            </div>
          </div>
          <div className="mt-8 flex gap-2">
             <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                <ArrowUpRight size={14} /> Güvenli Ödeme
             </div>
          </div>
        </GlassCard>

        {/* Quick Actions / Load Balance */}
        <GlassCard className="p-6 md:col-span-2">
          <h3 className="text-lg font-bold text-white mb-4">Bakiye Yükle</h3>

          {!selectedAmount ? (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setSelectedAmount(amt)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-blue-600 hover:border-blue-400 transition-all group"
                >
                  <span className="text-lg font-bold text-white group-hover:scale-110 transition-transform">₺{amt}</span>
                </button>
              ))}
              <button
                onClick={() => setSelectedAmount(0)} // 0 triggers custom input mode ideally, simple for now
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 transition-all"
              >
                <span className="text-sm text-slate-400">Diğer</span>
              </button>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right">
              <button
                onClick={() => setSelectedAmount(null)}
                className="text-xs text-slate-400 hover:text-white mb-4 flex items-center gap-1"
              >
                ← Geri Dön
              </button>
              <CreditCardForm
                amount={selectedAmount}
                onSuccess={() => {
                  setSelectedAmount(null);
                  window.location.reload();
                }}
              />
            </div>
          )}
        </GlassCard>
      </div>

      {/* Transaction History */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="text-slate-400" size={20} />
          <h3 className="text-xl font-bold text-white">İşlem Geçmişi</h3>
        </div>

        <div className="rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-white/5 uppercase font-medium text-xs">
              <tr>
                <th className="px-6 py-4">İşlem</th>
                <th className="px-6 py-4">Tarih</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">Tutar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-black/20">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Henüz bir işlem bulunmuyor.
                  </td>
                </tr>
              ) : (
                transactions.map((tx: any) => (
                  <tr key={tx.id}>
                    <td className="px-6 py-4 capitalize">{tx.transaction_type}</td>
                    <td className="px-6 py-4">{new Date(tx.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-mono ${tx.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                      ₺{Number(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
