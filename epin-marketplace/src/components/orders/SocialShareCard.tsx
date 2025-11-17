'use client';

import { useState } from 'react';

export default function SocialShareCard() {
  const [copied, setCopied] = useState(false);

  const handleCopyReferralLink = async () => {
    const referralLink = `${window.location.origin}/?ref=${Math.random().toString(36).substring(7)}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSocialShare = (platform: string) => {
    const text = 'Check out Epin Marketplace!';
    const url = window.location.origin;
    
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl border border-primary/30 p-6 text-center">
      <h3 className="text-white text-lg font-bold mb-2">Share & Earn!</h3>
      <p className="text-white/70 text-sm mb-4">Share your purchase and get rewards when your friends sign up.</p>
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => handleSocialShare('twitter')}
          className="size-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          X
        </button>
        <button
          onClick={() => handleSocialShare('facebook')}
          className="size-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          f
        </button>
        <button
          onClick={() => handleSocialShare('linkedin')}
          className="size-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          in
        </button>
      </div>
      <button
        onClick={handleCopyReferralLink}
        className="w-full flex max-w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-white/10 text-white gap-2 text-sm font-bold leading-normal hover:bg-white/20 transition-colors"
      >
        <span className="material-symbols-outlined text-lg">link</span>
        {copied ? 'Copied!' : 'Copy Referral Link'}
      </button>
    </div>
  );
}

