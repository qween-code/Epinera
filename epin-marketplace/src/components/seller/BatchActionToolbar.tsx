'use client';

interface BatchActionToolbarProps {
  selectedCount: number;
  onMarkProcessing?: () => void;
  onFulfill?: () => void;
  onSendMessage?: () => void;
  onMarkDelivered?: () => void;
}

export default function BatchActionToolbar({
  selectedCount,
  onMarkProcessing,
  onFulfill,
  onSendMessage,
  onMarkDelivered,
}: BatchActionToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-4 px-4 py-2 mb-4 rounded bg-primary/10 border border-primary/20">
      <p className="text-sm font-medium text-primary">{selectedCount} order{selectedCount !== 1 ? 's' : ''} selected</p>
      <div className="flex items-center gap-2">
        <button
          onClick={onMarkProcessing}
          className="p-2 text-primary hover:bg-primary/20 rounded-full transition-colors"
          title="Mark as Processing"
        >
          <span className="material-symbols-outlined">hourglass_top</span>
        </button>
        <button
          onClick={onFulfill}
          className="p-2 text-primary hover:bg-primary/20 rounded-full transition-colors"
          title="Fulfill Selected"
        >
          <span className="material-symbols-outlined">check_circle</span>
        </button>
        <button
          onClick={onSendMessage}
          className="p-2 text-primary hover:bg-primary/20 rounded-full transition-colors"
          title="Send Message"
        >
          <span className="material-symbols-outlined">send</span>
        </button>
        <button
          onClick={onMarkDelivered}
          className="p-2 text-primary hover:bg-primary/20 rounded-full transition-colors"
          title="Mark as Delivered"
        >
          <span className="material-symbols-outlined">local_shipping</span>
        </button>
      </div>
    </div>
  );
}

