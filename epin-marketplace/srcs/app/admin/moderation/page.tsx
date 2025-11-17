'use client';
// Placeholder for content moderation page for admins.
// A full implementation would involve fetching flagged content, showing previews,
// and providing actions to approve, reject, or edit.

export default function ContentModerationPage() {
    // Dummy data for flagged items
    const flaggedItems = [
        { id: 1, type: 'Product Review', user: 'GamerX123', reason: 'AI: Profanity', status: 'Pending' },
        { id: 2, type: 'Forum Post', user: 'CommunityHelper', reason: 'User Report: Spam', status: 'Pending' },
        { id: 3, type: 'Product Listing', user: 'NewSeller_01', reason: 'AI: Suspicious Link', status: 'In Review' },
    ];

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">Content Moderation Queue</h1>
            <div className="bg-gray-800 rounded-xl overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="p-4">Item ID</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">User</th>
                            <th className="p-4">Reason</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flaggedItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="p-4 font-mono text-sm">#{item.id}</td>
                                <td className="p-4">{item.type}</td>
                                <td className="p-4">{item.user}</td>
                                <td className="p-4">{item.reason}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        item.status === 'Pending' ? 'bg-yellow-900 text-yellow-300' :
                                        'bg-blue-900 text-blue-300'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button className="text-sky-400 hover:underline">Review</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {flaggedItems.length === 0 && (
                    <p className="text-center p-8 text-gray-500">No items in the moderation queue.</p>
                )}
            </div>
        </div>
    );
}
