import Link from 'next/link';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="flex h-screen w-64 flex-col justify-between border-r border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4 sticky top-0">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            {/* Placeholder for store logo and name */}
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAwLwh0BEag7tsxQREglJWImSoQ5kJp2boyE6l57PPKX0fMJ2MJkLRTR5hSS-EeMt8txWt9Q_QzwIuiBR5O24rc8iMxNOOOakwYsbpRpfOoOt_4SIhwPmUy6Aj4iWqHqItnBY-dKDwp1VQw87XHhw3HEzBM-Bv7J5BoxbnVQB3Epy7J5DCXZUBrz9yohd5589usR06eCxKHd7fLtDgy2vDnXiJJSae8MR6i4Tm4YJ2CRIYenBdGQO4A4S8gfJZ15WFCrtcMWCPT_mhE")'}}></div>
            <div className="flex flex-col">
              <h1 className="text-text-light dark:text-text-dark text-base font-bold leading-normal">Mehmet's Store</h1>
              <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal">Seller Dashboard</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2 mt-4">
            <Link href="/seller" className="flex items-center gap-3 px-3 py-2 text-text-light dark:text-text-dark hover:bg-primary/10 rounded">
              <span className="material-symbols-outlined">dashboard</span>
              <p className="text-sm font-medium leading-normal">Dashboard</p>
            </Link>
            <Link href="/seller/orders" className="flex items-center gap-3 px-3 py-2 rounded bg-primary text-white">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>shopping_cart</span>
              <p className="text-sm font-bold leading-normal">Order Management</p>
            </Link>
            <Link href="/seller/products" className="flex items-center gap-3 px-3 py-2 text-text-light dark:text-text-dark hover:bg-primary/10 rounded">
              <span className="material-symbols-outlined">inventory_2</span>
              <p className="text-sm font-medium leading-normal">Product Listings</p>
            </Link>
            <Link href="/seller/analytics" className="flex items-center gap-3 px-3 py-2 text-text-light dark:text-text-dark hover:bg-primary/10 rounded">
              <span className="material-symbols-outlined">bar_chart</span>
              <p className="text-sm font-medium leading-normal">Analytics</p>
            </Link>
            <Link href="/seller/messages" className="flex items-center gap-3 px-3 py-2 text-text-light dark:text-text-dark hover:bg-primary/10 rounded">
              <span className="material-symbols-outlined">mail</span>
              <p className="text-sm font-medium leading-normal">Customer Messages</p>
            </Link>
          </nav>
        </div>
        <div className="flex flex-col gap-1 border-t border-border-light dark:border-border-dark pt-2">
            <a className="flex items-center gap-3 px-3 py-2 text-text-light dark:text-text-dark hover:bg-primary/10 rounded" href="/seller/settings">
                <span className="material-symbols-outlined">settings</span>
                <p className="text-sm font-medium leading-normal">Settings</p>
            </a>
        </div>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
