'use client';

interface ActionButtonsProps {
  onViewCodes?: () => void;
  onDownloadReceipt?: () => void;
}

export default function ActionButtons({ onViewCodes, onDownloadReceipt }: ActionButtonsProps) {
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-6 flex flex-col gap-3">
      <h3 className="text-white text-lg font-bold">Actions</h3>
      <button
        onClick={onViewCodes}
        className="w-full flex max-w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 bg-primary text-black gap-2 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
      >
        <span className="material-symbols-outlined text-lg">key</span>
        View My Codes
      </button>
      <button
        onClick={onDownloadReceipt}
        className="w-full flex max-w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 bg-white/10 text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/20 transition-colors"
      >
        <span className="material-symbols-outlined text-lg">download</span>
        Download Receipt
      </button>
    </div>
  );
}

