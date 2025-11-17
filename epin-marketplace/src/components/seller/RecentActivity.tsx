'use client';

interface Activity {
  id: string;
  type: 'order' | 'review' | 'message';
  message: string;
  time: string;
  isPositive?: boolean;
}

export default function RecentActivity({ activities }: { activities: Activity[] }) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return 'shopping_cart';
      case 'review':
        return 'star';
      case 'message':
        return 'mail';
      default:
        return 'notifications';
    }
  };

  const getColor = (type: string, isPositive?: boolean) => {
    if (type === 'order') return 'bg-green-500/20 text-green-400';
    if (type === 'review') return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-blue-500/20 text-blue-400';
  };

  return (
    <div className="bg-[#0c161b] rounded-xl border border-[#315768] p-6">
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Recent Activity</h2>
      <div className="flex flex-col gap-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${getColor(activity.type, activity.isPositive)}`}>
              <span className="material-symbols-outlined text-base">{getIcon(activity.type)}</span>
            </div>
            <div>
              <p className="text-white text-sm">{activity.message}</p>
              <p className="text-slate-400 text-xs">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

