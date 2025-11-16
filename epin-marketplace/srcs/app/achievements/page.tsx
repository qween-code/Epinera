'use client';

// Placeholder for the achievements page.
// A full implementation would fetch the user's unlocked achievements
// and display progress towards others.

export default function AchievementsPage() {

    // Dummy data for achievements
    const achievements = [
        { name: 'First Purchase', description: 'Make your first purchase on the marketplace.', unlocked: true },
        { name: 'Top Trader', description: 'Complete 10 successful trades.', unlocked: true },
        { name: 'Community Helper', description: 'Receive 5 upvotes on a helpful comment.', unlocked: false },
        { name: 'High Roller', description: 'Spend over $1000 in a single month.', unlocked: false },
    ];

    return (
        <div className="max-w-4xl mx-auto py-12">
            <h1 className="text-4xl font-bold mb-8">Achievements & Badges</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((ach, i) => (
                    <div key={i} className={`p-6 rounded-xl ${ach.unlocked ? 'bg-green-900/50 border-green-700' : 'bg-gray-800 border-gray-700'} border`}>
                        <h2 className={`font-bold text-lg ${ach.unlocked ? 'text-green-300' : 'text-white'}`}>{ach.name}</h2>
                        <p className="text-sm text-gray-400 mt-2">{ach.description}</p>
                        {ach.unlocked && <p className="text-xs text-green-400 mt-4">Unlocked!</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}
