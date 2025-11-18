'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';

export default function AboutPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display group/design-root overflow-x-hidden">
      <Header />
      <main className="flex-1 pt-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
              About Epin Marketplace
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Your trusted gateway to the digital gaming universe
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-16">
            <div className="bg-container-dark rounded-lg p-8 md:p-12 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-4xl">flag</span>
                <h2 className="text-3xl font-bold text-white">Our Mission</h2>
              </div>
              <div className="space-y-4 text-white/90 leading-relaxed">
                <p className="text-lg">
                  At Epin Marketplace, our mission is to revolutionize the digital gaming commerce experience by creating a secure, transparent, and creator-first platform that empowers gamers, content creators, and sellers worldwide.
                </p>
                <p>
                  We are committed to building a marketplace where trust, innovation, and community thrive. Through cutting-edge AI technology, we ensure every transaction is safe, every seller is verified, and every customer receives instant fulfillment of their digital goods.
                </p>
                <p>
                  Our platform bridges the gap between creators and their audiences, enabling seamless transactions across 150+ gaming ecosystems while maintaining the highest standards of security and customer satisfaction.
                </p>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8 text-center">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">shield</span>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Security First</h3>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400">
                  We prioritize the security and privacy of our users with advanced fraud protection and verification systems.
                </p>
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">rocket_launch</span>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Innovation</h3>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400">
                  We leverage AI and cutting-edge technology to deliver the best possible experience for our community.
                </p>
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">groups</span>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Community</h3>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400">
                  We foster a vibrant community where creators, sellers, and gamers can connect and thrive together.
                </p>
              </div>
            </div>
          </section>

          {/* What We Do Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8 text-center">
              What We Do
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl">store</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                    Digital Marketplace
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    We provide a comprehensive marketplace for digital gaming products including game keys, gift cards, top-ups, and creator bundles across multiple gaming platforms.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl">verified_user</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                    Verified Sellers
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Our rigorous verification process ensures that every seller on our platform is legitimate and trustworthy, giving you peace of mind with every purchase.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl">smart_toy</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                    AI-Powered Experience
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Our advanced AI systems provide personalized recommendations, fraud detection, and instant customer support to enhance your shopping experience.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl">flash_on</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                    Instant Fulfillment
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Get your digital goods delivered instantly after purchase. No waiting, no delays—just immediate access to your favorite games and content.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 border border-primary/20">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
              Join Our Community
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-2xl mx-auto">
              Whether you're a gamer looking for the best deals, a creator wanting to monetize your content, or a seller seeking a trusted platform, Epin Marketplace is here for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-black text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg h-10 px-6 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm font-bold hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

