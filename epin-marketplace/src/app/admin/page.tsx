export default function AdminDashboardPage() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-3xl font-bold leading-tight tracking-tight text-black dark:text-white">Super Admin Dashboard</p>
          <p className="text-base font-normal leading-normal text-gray-500 dark:text-gray-400">Real-time overview of platform activity and system health.</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <p className="text-base font-medium leading-normal text-gray-600 dark:text-gray-400">Active Users</p>
            <p className="text-3xl font-bold leading-tight tracking-tight text-black dark:text-white">1,423</p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <p className="text-base font-medium leading-normal text-gray-600 dark:text-gray-400">Sales Volume (24h)</p>
            <p className="text-3xl font-bold leading-tight tracking-tight text-black dark:text-white">$54,120</p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <p className="text-base font-medium leading-normal text-gray-600 dark:text-gray-400">Pending Transactions</p>
            <p className="text-3xl font-bold leading-tight tracking-tight text-black dark:text-white">12</p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <p className="text-base font-medium leading-normal text-gray-600 dark:text-gray-400">Support Tickets</p>
            <p className="text-3xl font-bold leading-tight tracking-tight text-black dark:text-white">8</p>
        </div>
      </div>
    </div>
  );
}
