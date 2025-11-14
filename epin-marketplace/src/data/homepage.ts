import type { HeroContent } from "@/components/organisms/hero";
import type { CommunityContent } from "@/components/organisms/community-section";
import type { DiscoveryContent } from "@/components/organisms/product-discovery";

export type SupportedLocale = "en" | "tr";

type HomepageCopy = {
  hero: HeroContent;
  discovery: DiscoveryContent;
  community: CommunityContent;
  navigation: {
    links: Array<{ href: string; label: string }>;
    ctaLabel: string;
    secondaryLabel: string;
  };
};

const baseData: Record<SupportedLocale, HomepageCopy> = {
  en: {
    navigation: {
      links: [
        { href: "#hero", label: "Overview" },
        { href: "#discover", label: "Discover" },
        { href: "#flash-deals", label: "Flash Deals" },
        { href: "#community", label: "Community" },
      ],
      ctaLabel: "Launch Seller Hub",
      secondaryLabel: "Sign In",
    },
    hero: {
      eyebrow: "AI-FIRST MARKETPLACE",
      title: "Powering the next generation of digital epin commerce",
      description:
        "Personalized deals, AI fraud protection, and creator-first monetization wrapped into a mobile-native experience.",
      primaryCta: "Start trading keys",
      secondaryCta: "Watch product tour",
      searchPlaceholder: "Search 150+ games, gift cards or creators…",
      trending: ["valorant", "steam-wallet", "wild-rift"],
      stats: [
        {
          label: "Daily verified offers",
          value: "18k+",
          description: "Screened by AI-driven anti-fraud models",
          icon: "🛡️",
        },
        {
          label: "Lightning delivery",
          value: "< 55 min",
          description: "Average fulfillment time across sellers",
          icon: "⚡",
        },
        {
          label: "Creator payouts",
          value: "+27%",
          description: "Revenue lift for partnered streamers",
          icon: "🎥",
        },
        {
          label: "Global languages",
          value: "12",
          description: "Localized catalog & support coverage",
          icon: "🌍",
        },
      ],
    },
    discovery: {
      eyebrow: "PRODUCT DISCOVERY",
      title: "Smarter shopping with predictive intent",
      description:
        "Search by voice, filter by delivery time, or lean on AI suggestions tailored to your squads and favorite titles.",
      categories: [
        { id: "valorant", label: "Valorant VP", icon: "🎯" },
        { id: "lol", label: "League of Legends", icon: "🛡️" },
        { id: "pubg", label: "PUBG Mobile", icon: "🎮" },
        { id: "steam", label: "Steam Wallet", icon: "💳" },
        { id: "nft", label: "Web3 Keys", icon: "⛓️" },
      ],
      featured: [
        {
          id: "valorant-boost",
          name: "Valorant Night Market Bundle",
          badge: "FLASH DEAL",
          price: "₺489",
          icon: "🔥",
          meta: "Verified seller • Istanbul",
          deliveryTime: "Instant dispatch",
          rating: "4.9 (2.4k)",
          actionLabel: "View offer",
          footer: "Shield Protected • Ends in 02:14:06",
        },
        {
          id: "steam-global",
          name: "Steam Wallet Global 50$",
          badge: "TRENDING",
          price: "$47",
          icon: "🌐",
          meta: "Auto-delivery • Multi-region",
          deliveryTime: "Under 5 minutes",
          rating: "4.8 (9.1k)",
          actionLabel: "Add to cart",
          footer: "Save 8% with creator code LUNAR",
        },
      ],
      personalized: [
        {
          id: "wow-time",
          name: "World of Warcraft 60 Days",
          badge: "FOR YOU",
          price: "€25",
          icon: "🧙",
          meta: "AI picked based on last season",
          deliveryTime: "Instant email",
          rating: "4.9 (6.4k)",
          actionLabel: "Quick buy",
        },
        {
          id: "mlbb-skins",
          name: "MLBB Mythic Skin Vault",
          badge: "FOR YOU",
          price: "₺299",
          icon: "💠",
          meta: "Drops with 98% success rate",
          deliveryTime: "Within 15 minutes",
          rating: "5.0 (1.2k)",
          actionLabel: "Unlock now",
        },
      ],
    },
    community: {
      eyebrow: "COMMUNITY SIGNAL",
      title: "Trust the squads shipping daily",
      description:
        "Join creator channels, follow verified sellers, and get real-time delivery stats before you commit to a drop.",
      highlights: [
        {
          id: "review-1",
          title: "Lightning delivery badge unlocked in 42 minutes",
          excerpt: "Seller NovaKeys automated the drop with blockchain confirmation and biometric escrow release.",
          author: "@NovaKeys",
          badges: ["Verified Seller", "Lightning"],
        },
        {
          id: "forum-1",
          title: "Creator revenue share playbook for 2025",
          excerpt: "Streamers share how they grew payout margins by 27% using squad bundles and cross-game missions.",
          author: "#CreatorOps",
          badges: ["Creator", "Playbook"],
        },
        {
          id: "review-2",
          title: "AI dispute resolution closed a fraud case in 4m",
          excerpt: "Escrow auto-refunded while keeping the account secure thanks to anomaly signatures and 2FA.",
          author: "Community Hero Mira",
          badges: ["AI", "Security"],
        },
        {
          id: "forum-2",
          title: "Web3 wallet compatibility rollout",
          excerpt: "Support for Phantom, MetaMask and Ledger now in beta with instant NFT redemption.",
          author: "Product Updates",
          badges: ["Web3", "Beta"],
        },
      ],
    },
  },
  tr: {
    navigation: {
      links: [
        { href: "#hero", label: "Genel Bakis" },
        { href: "#discover", label: "Kesfet" },
        { href: "#flash-deals", label: "Yildirim Firsatlar" },
        { href: "#community", label: "Topluluk" },
      ],
      ctaLabel: "Satici Panelini Ac",
      secondaryLabel: "Giris Yap",
    },
    hero: {
      eyebrow: "AI ONCELIKLI MARKETPLACE",
      title: "Dijital epin ticaretinin gelecek dalgasini tasiyoruz",
      description:
        "Kisisellestirilmis fiyatlar, AI fraud korumasi ve yaratici odakli gelir modelleri mobil deneyimde birleşiyor.",
      primaryCta: "Anahtar satisina basla",
      secondaryCta: "Urun turunu izle",
      searchPlaceholder: "150+ oyun, gift card veya yayinci ara…",
      trending: ["valorant", "steam-cuzdan", "wild-rift"],
      stats: [
        {
          label: "Gunluk dogrulanmis ilan",
          value: "18b+",
          description: "AI fraud motorlari tarafindan tarandi",
          icon: "🛡️",
        },
        {
          label: "Yildirim teslimat",
          value: "< 55 dk",
          description: "Saticilar arasi ortalama teslim suresi",
          icon: "⚡",
        },
        {
          label: "Yayinci odemeleri",
          value: "+%27",
          description: "Is ortaklarimiz icin gelir artis ortalamasi",
          icon: "🎥",
        },
        {
          label: "Dil destegi",
          value: "12",
          description: "Yerellestirilmis katalog ve destek",
          icon: "🌍",
        },
      ],
    },
    discovery: {
      eyebrow: "URUN KESFI",
      title: "Niyet bazli akilli alisveris",
      description:
        "Sesle ara, teslim surelerine gore filtrele veya squad tercihlerine gore AI onerilerine guven.",
      categories: [
        { id: "valorant", label: "Valorant VP", icon: "🎯" },
        { id: "lol", label: "League of Legends", icon: "🛡️" },
        { id: "pubg", label: "PUBG Mobile", icon: "🎮" },
        { id: "steam", label: "Steam Cuzdan", icon: "💳" },
        { id: "nft", label: "Web3 Anahtar", icon: "⛓️" },
      ],
      featured: [
        {
          id: "valorant-boost",
          name: "Valorant Gece Pazari Paketi",
          badge: "ACIL FIRSAT",
          price: "₺489",
          icon: "🔥",
          meta: "Dogrulanmis satici • Istanbul",
          deliveryTime: "Aninda teslim",
          rating: "4.9 (2.4b)",
          actionLabel: "Teklifi gor",
          footer: "Shield korumali • 02:14:06 icinde bitiyor",
        },
        {
          id: "steam-global",
          name: "Steam Cuzdan Global 50$",
          badge: "TREND",
          price: "$47",
          icon: "🌐",
          meta: "Oto teslim • Multi-bolge",
          deliveryTime: "5 dk altinda",
          rating: "4.8 (9.1b)",
          actionLabel: "Sepete ekle",
          footer: "LUNAR kodu ile %8 indirim",
        },
      ],
      personalized: [
        {
          id: "wow-time",
          name: "World of Warcraft 60 Gun",
          badge: "SANA OZEL",
          price: "€25",
          icon: "🧙",
          meta: "Gecen sezon tercihlerine gore",
          deliveryTime: "Aninda email",
          rating: "4.9 (6.4b)",
          actionLabel: "Hemen al",
        },
        {
          id: "mlbb-skins",
          name: "MLBB Mitik Skin Kasa",
          badge: "SANA OZEL",
          price: "₺299",
          icon: "💠",
          meta: "%98 basari oranli drop",
          deliveryTime: "15 dakika icinde",
          rating: "5.0 (1.2b)",
          actionLabel: "Kilidi ac",
        },
      ],
    },
    community: {
      eyebrow: "TOPLULUK",
      title: "Her gun teslimat yapan squadlara katil",
      description:
        "Yayinci kanallarina katil, dogrulanmis saticilari takip et ve karar vermeden once anlik teslim istatistiklerini gor.",
      highlights: [
        {
          id: "review-1",
          title: "42 dakikada yildirim rozeti",
          excerpt: "NovaKeys blockchain teyitli otomasyon ve biyometrik escrow ile teslimati tamamladi.",
          author: "@NovaKeys",
          badges: ["Dogrulanmis", "Yildirim"],
        },
        {
          id: "forum-1",
          title: "2025 yayinci gelir paylasim rehberi",
          excerpt: "Yayincilar squad paketleriyle %27 gelir artisini nasil yakaladiklarini paylasiyor.",
          author: "#CreatorOps",
          badges: ["Yayinci", "Rehber"],
        },
        {
          id: "review-2",
          title: "AI 4 dakikada fraud dosyasini kapatti",
          excerpt: "Anomali imzalar ve 2FA sayesinde escrow guvende kalirken iade gerceklesti.",
          author: "Topluluk Kahramani Mira",
          badges: ["AI", "Guvenlik"],
        },
        {
          id: "forum-2",
          title: "Web3 cuzdan uyumlulugu yayinda",
          excerpt: "Phantom, MetaMask ve Ledger destegi aninda NFT teslimati ile betada.",
          author: "Urun Guncellemeleri",
          badges: ["Web3", "Beta"],
        },
      ],
    },
  },
};

export function getHomepageContent(locale: SupportedLocale) {
  return baseData[locale];
}

export function resolveLocale(acceptLanguage?: string | null): SupportedLocale {
  if (!acceptLanguage) {
    return "en";
  }
  const normalized = acceptLanguage.split(",")[0]?.trim().slice(0, 2).toLowerCase();
  if (normalized === "tr") {
    return "tr";
  }
  return "en";
}
