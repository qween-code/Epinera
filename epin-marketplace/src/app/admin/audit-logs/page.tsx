'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface AuditLog {
  id: string;
  created_at: string;
  actor: string;
  action: string;
  resource: string;
  ip_address: string;
}

const actionColors: { [key: string]: string } = {
  ORDER_DELETED: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  PRODUCT_PRICE_UPDATED: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300',
  USER_LOGIN_SUCCESS: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
};

export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) {
        setAuditLogs(data);
      }
      setLoading(false);
    };

    fetchLogs();
  }, [supabase]);

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
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-center text-sm text-slate-500">Loading logs...</td>
                  </tr>
                ) : auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-center text-sm text-slate-500">No audit logs found</td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-100/50 dark:hover:bg-black/30">
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-700 dark:text-slate-300">{new Date(log.created_at).toLocaleString()}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-700 dark:text-slate-300">{log.actor}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${actionColors[log.action] || 'bg-gray-100 text-gray-700'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-700 dark:text-slate-300">{log.resource}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-700 dark:text-slate-300">{log.ip_address}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
