'use client';

interface OrderDetailsCardProps {
  orderNumber: string;
  dateOfPurchase: string;
  paymentMethod: string;
}

export default function OrderDetailsCard({ orderNumber, dateOfPurchase, paymentMethod }: OrderDetailsCardProps) {
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-6">
      <div className="flex justify-between gap-x-6 py-2 border-b border-white/10">
        <p className="text-white/70 text-sm font-normal leading-normal">Order Number</p>
        <p className="text-white text-sm font-bold leading-normal text-right">{orderNumber}</p>
      </div>
      <div className="flex justify-between gap-x-6 py-2 border-b border-white/10">
        <p className="text-white/70 text-sm font-normal leading-normal">Date of Purchase</p>
        <p className="text-white text-sm font-normal leading-normal text-right">{dateOfPurchase}</p>
      </div>
      <div className="flex justify-between items-center gap-x-6 py-2">
        <p className="text-white/70 text-sm font-normal leading-normal">Payment Method</p>
        <p className="text-white text-sm font-normal leading-normal text-right">{paymentMethod}</p>
      </div>
      <div className="flex justify-between items-center gap-x-6 pt-3 mt-2 border-t border-white/10">
        <p className="text-white/70 text-sm font-normal leading-normal flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-green-400">lock</span>
          Security
        </p>
        <p className="text-white/70 text-sm font-normal leading-normal text-right">Secured by Blockchain</p>
      </div>
    </div>
  );
}

