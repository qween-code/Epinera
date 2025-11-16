'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="text-white">
      {/* Hero Section */}
      <section className="text-center py-20 lg:py-32 bg-gray-900">
        <h1 className="text-5xl lg:text-7xl font-black mb-4">The Future of Digital Gaming is Here</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
          Instantly find, trade, and secure your next game with our AI-powered, blockchain-secured marketplace.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/store" className="px-8 py-4 bg-sky-600 rounded-md font-semibold hover:bg-sky-700 transition-colors">
            Explore the Marketplace
          </Link>
          <Link href="/register" className="px-8 py-4 bg-gray-700 rounded-md font-semibold hover:bg-gray-600 transition-colors">
            Become a Seller
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Placeholder Product Cards */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg overflow-hidden group">
              <div className="w-full h-48 bg-gray-700 group-hover:opacity-80 transition-opacity"></div>
              <div className="p-4">
                <h3 className="text-lg font-bold">Game Title {i + 1}</h3>
                <p className="text-gray-400 text-sm">Platform</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-xl font-bold text-sky-400">$49.99</p>
                  <button className="px-4 py-2 bg-sky-600 rounded-md text-sm font-semibold hover:bg-sky-700">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

       {/* Trust and Security Bar */}
       <section className="border-y border-gray-800 py-12 bg-gray-900/50">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                  <h3 className="text-2xl font-bold text-sky-400 mb-2">Blockchain Secured</h3>
                  <p className="text-gray-400">Every transaction is verified on-chain for maximum security and transparency.</p>
              </div>
              <div>
                  <h3 className="text-2xl font-bold text-sky-400 mb-2">AI-Powered Curation</h3>
                  <p className="text-gray-400">Our smart marketplace helps you find the best deals and products tailored to you.</p>
              </div>
              <div>
                  <h3 className="text-2xl font-bold text-sky-400 mb-2">24/7 Support</h3>
                  <p className="text-gray-400">Our dedicated support team is always here to help you out, day or night.</p>
              </div>
          </div>
       </section>
    </div>
  );
}
