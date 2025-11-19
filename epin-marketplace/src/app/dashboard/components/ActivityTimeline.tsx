import { createClient } from '@/utils/supabase/server';
import { formatDistanceToNow } from 'date-fns';

interface ActivityTimelineProps {
    userId: string;
}

export default async function ActivityTimeline({ userId }: ActivityTimelineProps) {
    const supabase = await createClient();

    // Fetch recent activities from audit logs
    const { data: activities } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

    // If no audit logs, create mock activities based on orders
    let displayActivities = activities || [];

    if (!displayActivities.length) {
        const { data: orders } = await supabase
            .from('orders')
            .select('id, created_at, status, total_amount')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(5);

        displayActivities = (orders || []).map((order) => ({
            id: order.id,
            action: 'order_placed',
            details: { order_id: order.id, amount: order.total_amount, status: order.status },
            created_at: order.created_at,
        }));
    }

    const getActivityIcon = (action: string) => {
        const icons: { [key: string]: string } = {
            order_placed: 'shopping_cart',
            review_posted: 'rate_review',
            product_viewed: 'visibility',
            profile_updated: 'person',
            payment_completed: 'payment',
            default: 'notifications',
        };
        return icons[action] || icons.default;
    };

    const getActivityDescription = (activity: any) => {
        if (activity.action === 'order_placed') {
            return `Placed an order for $${activity.details?.amount || '0.00'}`;
        }
        if (activity.action === 'review_posted') {
            return 'Posted a product review';
        }
        return activity.action?.replace(/_/g, ' ') || 'Activity';
    };

    return (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-xl font-bold">Recent Activity</h2>
                <button className="text-primary hover:text-primary/80 text-sm font-medium">
                    View All
                </button>
            </div>

            <div className="space-y-4">
                {displayActivities.length > 0 ? (
                    displayActivities.map((activity: any, index: number) => (
                        <div key={activity.id || index} className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-primary/20 text-primary">
                                <span className="material-symbols-outlined text-xl">
                                    {getActivityIcon(activity.action)}
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium">
                                    {getActivityDescription(activity)}
                                </p>
                                <p className="text-white/60 text-sm">
                                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <span className="material-symbols-outlined text-5xl text-white/20 mb-2">
                            history
                        </span>
                        <p className="text-white/60">No recent activity</p>
                    </div>
                )}
            </div>
        </div>
    );
}
