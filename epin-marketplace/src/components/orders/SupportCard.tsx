'use client';

import Link from 'next/link';

export default function SupportCard() {
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-6">
      <h3 className="text-white text-lg font-bold mb-3">Need Help?</h3>
      <div className="flex flex-col gap-3">
        <Link className="text-primary hover:underline flex items-center gap-2" href="/support">
          <span className="material-symbols-outlined text-xl">support_agent</span>
          Contact Support
        </Link>
        <Link className="text-primary hover:underline flex items-center gap-2" href="/support/chat">
          <span className="material-symbols-outlined text-xl">chat</span>
          Start Live Chat
        </Link>
        <Link className="text-primary hover:underline flex items-center gap-2" href="/support/faq">
          <span className="material-symbols-outlined text-xl">quiz</span>
          View FAQs
        </Link>
      </div>
    </div>
  );
}

