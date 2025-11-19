interface DashboardStatsProps {
    totalOrders: number;
    totalSpent: number;
    totalReviews: number;
}

export default function DashboardStats({ totalOrders, totalSpent, totalReviews }: DashboardStatsProps) {
    const stats = [
        {
            label: 'Total Orders',
            value: totalOrders,
            icon: 'shopping_bag',
            color: 'bg-blue-500/20 text-blue-400',
            change: '+12%',
        },
        {
            label: 'Total Spent',
            value: `$${totalSpent.toFixed(2)}`,
            icon: 'payments',
            color: 'bg-green-500/20 text-green-400',
            change: '+8%',
        },
        {
            label: 'Reviews Written',
            value: totalReviews,
            icon: 'star',
            color: 'bg-yellow-500/20 text-yellow-400',
            change: '+15%',
        },
        {
            label: 'Trust Score',
            value: '85/100',
            icon: 'verified_user',
            color: 'bg-purple-500/20 text-purple-400',
            change: '+5',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg ${stat.color}`}>
                            <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                        </div>
                        <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                    </div>
                    <div>
                        <p className="text-white/60 text-sm mb-1">{stat.label}</p>
                        <p className="text-white text-2xl font-bold">{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
