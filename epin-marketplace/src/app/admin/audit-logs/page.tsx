// Mock data for audit logs - replace with actual data fetching later
const auditLogs = [
  {
    timestamp: '2024-05-21 14:35:10 UTC',
    actor: 'user:usr_1a2b3c',
    action: 'ORDER_DELETED',
    resource: 'Order: ord_xyz789',
    ipAddress: '192.168.1.101',
  },
  {
    timestamp: '2024-05-21 14:32:55 UTC',
    actor: 'admin:adm_fatma',
    action: 'PRODUCT_PRICE_UPDATED',
    resource: 'Product: prod_4d5e6f',
    ipAddress: '203.0.113.45',
  },
  {
    timestamp: '2024-05-21 14:30:02 UTC',
    actor: 'user:usr_g7h8i9',
    action: 'USER_LOGIN_SUCCESS',
    resource: 'User: usr_g7h8i9',
    ipAddress: '198.51.100.22',
  },
];

const actionColors: { [key: string]: string } = {
    ORDER_DELETED: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
    PRODUCT_PRICE_UPDATED: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300',
    USER_LOGIN_SUCCESS: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  };

export default function AuditLogsPage() {
  return (
    <div>
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Audit Logs</h1>
                <p className="text-slate-600 dark:text-[#90b8cb] text-base font-normal leading-normal">Review all user and system actions across the platform.</p>
            </div>
        </div>
        <div className="mt-6 overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden rounded-xl border border-white/10 dark:border-black/20">
                    <table className="min-w-full divide-y divide-white/10 dark:divide-black/20">
                    <thead className="bg-slate-100 dark:bg-black/20">
                        <tr>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">Timestamp</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">Actor</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">Action</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">Resource</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">IP Address</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 dark:divide-black/20 bg-white/5 dark:bg-black/10">
                        {auditLogs.map((log, index) => (
                        <tr key={index} className="hover:bg-slate-100/50 dark:hover:bg-black/30">
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-700 dark:text-slate-300">{log.timestamp}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-700 dark:text-slate-300">{log.actor}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${actionColors[log.action]}`}>
                                {log.action}
                            </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-700 dark:text-slate-300">{log.resource}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-700 dark:text-slate-300">{log.ipAddress}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );
}
