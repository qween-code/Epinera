'use client';

interface DeliveryTrackingProps {
  status: 'placed' | 'payment_verified' | 'securing' | 'delivered';
  code?: string | null;
}

export default function DeliveryTracking({ status, code }: DeliveryTrackingProps) {
  const getStatusIndex = () => {
    switch (status) {
      case 'placed': return 0;
      case 'payment_verified': return 1;
      case 'securing': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStatusIndex();

  const steps = [
    { label: 'Order Placed', icon: 'check' },
    { label: 'Payment Verified', icon: 'check' },
    { label: 'Securing Code', icon: 'sync' },
    { label: 'Delivered', icon: '' },
  ];

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-6">
      <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] mb-6">Delivery Status</h2>
      <div className="flex flex-col gap-6">
        <div className="flex items-center w-full">
          {steps.map((step, index) => {
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const isCompleted = index < currentIndex;

            return (
              <div key={index} className="flex items-center flex-1">
                <div className="flex flex-col items-center relative flex-1">
                  <div
                    className={`rounded-full size-6 flex items-center justify-center ${
                      isCompleted
                        ? 'bg-primary'
                        : isCurrent
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-white/20'
                    }`}
                  >
                    {step.icon && (
                      <span className={`material-symbols-outlined text-sm ${isCompleted || isCurrent ? 'text-black' : 'text-white/50'}`}>
                        {step.icon}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-2 text-center ${isCurrent ? 'text-amber-400' : isCompleted ? 'text-white' : 'text-white/50'}`}>
                    {step.label}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 ${isCompleted ? 'bg-primary' : isCurrent ? 'bg-amber-500' : 'bg-white/20'}`} />
                )}
              </div>
            );
          })}
        </div>
        {!code && status !== 'delivered' && (
          <div className="bg-black/20 rounded-lg p-4 text-center">
            <p className="text-white/60 font-mono text-lg animate-pulse tracking-widest">••••-••••-••••-••••</p>
            <p className="text-xs text-amber-400 mt-2">Your code is being securely generated...</p>
          </div>
        )}
        {code && (
          <div className="bg-black/20 rounded-lg p-4 text-center">
            <p className="text-white font-mono text-lg tracking-widest">{code}</p>
            <p className="text-xs text-green-400 mt-2">Your code has been delivered!</p>
          </div>
        )}
      </div>
    </div>
  );
}

