'use client';

export default function CommunityFeed() {
  const feedItems = [
    {
      id: '1',
      user: 'GamerGal',
      action: 'just reviewed',
      target: 'Cyber Renegade 2088',
      excerpt: '"Absolutely stunning visuals! The gameplay is immersive..."',
      time: '2 minutes ago',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GamerGal',
    },
    {
      id: '2',
      user: 'PixelPilot',
      action: 'started a new discussion',
      target: '',
      excerpt: '"What are the best indie games of this year?"',
      time: '15 minutes ago',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PixelPilot',
    },
    {
      id: '3',
      user: 'ProStrats',
      action: 'posted in',
      target: 'Action RPGs',
      excerpt: '"New speedrun record for Aethelgard\'s Chronicle!"',
      time: '1 hour ago',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProStrats',
    },
  ];

  return (
    <aside className="lg:col-span-1">
      <div className="bg-container-dark rounded-xl p-6 sticky top-24">
        <h2 className="text-white text-xl font-bold mb-4">Community Feed</h2>
        <div className="space-y-6">
          {feedItems.map((item) => (
            <div key={item.id} className="flex items-start gap-4">
              <div
                className="size-10 rounded-full object-cover bg-center bg-no-repeat bg-cover"
                style={{ backgroundImage: `url("${item.avatar}")` }}
              />
              <div>
                <p className="text-sm text-white">
                  <span className="font-bold text-primary">{item.user}</span> {item.action}{' '}
                  {item.target && <span className="font-semibold">{item.target}</span>}
                </p>
                <p className="text-xs text-white/50 mt-1">{item.excerpt}</p>
                <p className="text-xs text-white/40 mt-1">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

