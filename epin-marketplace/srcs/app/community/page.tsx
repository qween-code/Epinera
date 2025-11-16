'use client';

// Placeholder for the community forums page.
// A full implementation would involve fetching forum threads, posts,
// and handling user interactions like creating posts and replies.

export default function CommunityPage() {

    // Dummy data for forum threads
    const threads = [
        { id: 1, title: 'Question about NFT Avatars Integration', author: 'SarahPixels', replies: 42, views: 1200 },
        { id: 2, title: 'PSA: Watch out for Phishing Scams', author: 'GlitchGamer', replies: 89, views: 5400 },
        { id: 3, title: 'What are your top 5 favorite indie games?', author: 'IndieExplorer', replies: 128, views: 8900 },
    ];

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Community Forums</h1>
                <button className="px-6 py-3 bg-sky-600 rounded-md font-semibold hover:bg-sky-700">
                    Create Post
                </button>
            </div>

            <div className="bg-gray-800 rounded-xl overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="p-4">Topic</th>
                            <th className="p-4">Author</th>
                            <th className="p-4 text-center">Replies</th>
                            <th className="p-4 text-center">Views</th>
                        </tr>
                    </thead>
                    <tbody>
                        {threads.map(thread => (
                            <tr key={thread.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="p-4">
                                    <a href="#" className="font-semibold hover:underline">{thread.title}</a>
                                </td>
                                <td className="p-4 text-gray-400">{thread.author}</td>
                                <td className="p-4 text-center">{thread.replies}</td>
                                <td className="p-4 text-center">{thread.views}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
