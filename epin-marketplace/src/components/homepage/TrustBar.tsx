'use client';

export default function TrustBar() {
  const features = [
    {
      icon: 'security',
      title: 'Blockchain Secured',
      description: 'Web3 integrated for maximum transaction security.',
    },
    {
      icon: 'support_agent',
      title: '24/7 Support',
      description: 'Our team is always here to help you out.',
    },
    {
      icon: 'credit_card',
      title: 'Secure Payments',
      description: 'AI-powered fraud detection protects every purchase.',
    },
  ];

  return (
    <section className="border-t border-b border-white/10 mt-16">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-8 px-10 text-center">
        {features.map((feature) => (
          <div key={feature.icon} className="flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">{feature.icon}</span>
            <h3 className="font-bold text-white">{feature.title}</h3>
            <p className="text-sm text-white/60">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

