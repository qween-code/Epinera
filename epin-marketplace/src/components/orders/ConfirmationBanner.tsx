'use client';

export default function ConfirmationBanner() {
  return (
    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 flex items-center gap-4">
      <span className="material-symbols-outlined text-green-400 text-3xl">check_circle</span>
      <div>
        <h3 className="font-bold text-white text-lg">Your Order is Confirmed!</h3>
        <p className="text-white/80 text-sm">Digital items are being delivered below.</p>
      </div>
    </div>
  );
}

