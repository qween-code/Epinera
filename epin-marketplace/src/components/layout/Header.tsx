import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Epin Marketplace
        </Link>
        <nav className="space-x-4">
          <Link href="/games">Games</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/sell">Sell</Link>
        </nav>
        <div>
          <Link href="/onboarding" className="px-4 py-2 bg-green-600 rounded-md mr-2">
            Onboarding
          </Link>
          <Link href="/login" className="px-4 py-2 bg-sky-600 rounded-md">
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
