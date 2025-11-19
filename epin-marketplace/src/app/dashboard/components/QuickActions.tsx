import Link from 'next/link';

export default function QuickActions() {
    const actions = [
        {
            title: 'Browse Products',
            description: 'Explore our marketplace',
            icon: 'storefront',
            href: '/products',
            color: 'bg-blue-500/20 text-blue-400',
        },
        {
            title: 'My Orders',
            description: 'Track your purchases',
            icon: 'receipt_long',
            href: '/orders',
            color: 'bg-green-500/20 text-green-400',
        },
        {
            title: 'Top Up Wallet',
            description: 'Add funds',
            icon: 'account_balance_wallet',
            href: '/wallet',
            color: 'bg-purple-500/20 text-purple-400',
        },
        {
            title: 'Write Review',
            description: 'Share your experience',
            icon: 'rate_review',
            href: '/orders',
            color: 'bg-yellow-500/20 text-yellow-400',
        },
        {
            title: 'Support',
            description: 'Get help',
            icon: 'support_agent',
            href: '/support',
            color: 'bg-red-500/20 text-red-400',
        },
        {
            title: 'Refer Friends',
            description: 'Earn rewards',
            icon: 'person_add',
            href: '/referral',
            color: 'bg-pink-500/20 text-pink-400',
        },
    ];

    return (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-white text-xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {actions.map((action, index) => (
                    <Link
                        key={index}
                        href={action.href}
                        className="flex flex-col items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-white/20"
                    >
                        <div className={`p-3 rounded-lg ${action.color}`}>
                            <span className="material-symbols-outlined text-2xl">{action.icon}</span>
                        </div>
                        <div className="text-center">
                            <p className="text-white font-medium text-sm">{action.title}</p>
                            <p className="text-white/60 text-xs">{action.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
