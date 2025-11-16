import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Epin Marketplace
        </Link>
        <nav className="space-x-4">
          <Link href="/products">Products</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/sell">Sell</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/cart">
            {/* Replace with a proper icon later */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </Link>
          <Link href="/login" className="px-4 py-2 bg-primary text-white rounded-md">
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
