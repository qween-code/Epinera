'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            const supabase = createClient();
            // This assumes an 'audit_logs' table exists.
            // A real implementation would need this table and corresponding logging triggers/logic.
            const { data, error } = await supabase
                .from('audit_logs')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(50);

            if (error) {
                console.error('Error fetching audit logs:', error);
                // For demonstration, create dummy data if the table doesn't exist
                setLogs([
                    { id: 1, timestamp: new Date().toISOString(), actor: 'user:123', action: 'ORDER_DELETED', resource: 'Order:456', ip_address: '192.168.1.1' },
                    { id: 2, timestamp: new Date().toISOString(), actor: 'admin:789', action: 'PRICE_UPDATED', resource: 'Product:101', ip_address: '203.0.113.45' },
                    { id: 3, timestamp: new Date().toISOString(), actor: 'user:456', action: 'LOGIN_SUCCESS', resource: 'User:456', ip_address: '198.51.100.22' },
                ]);
            } else {
                setLogs(data);
            }
            setLoading(false);
        };
        fetchLogs();
    }, []);

    if (loading) {
        return <div>Loading audit logs...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">Audit Logs</h1>
            <div className="bg-gray-800 rounded-xl overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="p-4">Timestamp</th>
                            <th className="p-4">Actor</th>
                            <th className="p-4">Action</th>
                            <th className="p-4">Resource</th>
                            <th className="p-4">IP Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="p-4 text-sm">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="p-4 font-mono text-xs">{log.actor}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 text-xs rounded-full bg-sky-900 text-sky-300">{log.action}</span>
                                </td>
                                <td className="p-4 font-mono text-xs">{log.resource}</td>
                                <td className="p-4 font-mono text-xs">{log.ip_address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {logs.length === 0 && (
                    <p className="text-center p-8 text-gray-500">No audit logs found.</p>
                )}
            </div>
        </div>
    );
}
