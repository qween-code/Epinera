import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full">
      <aside className="flex w-64 flex-col bg-white/5 dark:bg-black/20 p-4 font-display">
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-2">
            <a href="/admin" className="flex items-center gap-3 rounded-lg bg-primary/20 px-3 py-2 text-primary dark:bg-primary/30">
              <span className="material-symbols-outlined">dashboard</span>
              <p className="text-sm font-medium leading-normal">Dashboard</p>
            </a>
            <Link href="/admin/users" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-white/10">
              <span className="material-symbols-outlined">group</span>
              <p className="text-sm font-medium leading-normal">User Management</p>
            </Link>
            <Link href="/admin/audit-logs" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-white/10">
              <span className="material-symbols-outlined">history</span>
              <p className="text-sm font-medium leading-normal">Audit Logs</p>
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-white/10">
              <span className="material-symbols-outlined">settings</span>
              <p className="text-sm font-medium leading-normal">Settings</p>
            </Link>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
