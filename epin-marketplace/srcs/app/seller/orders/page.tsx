'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function OrderManagementPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const supabase = createClient();
            // This is a simplified query. A real implementation would need to join tables
            // to get orders for products sold by the current user.
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    id,
                    created_at,
                    total_amount,
                    currency,
                    status,
                    profiles (
                        full_name
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching orders:', error);
            } else {
                setOrders(data);
            }
            setLoading(false);
        };
        fetchOrders();
    }, []);

    if (loading) {
        return <div>Loading orders...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">Order Management</h1>
            <div className="bg-gray-800 rounded-xl overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="p-4 font-mono text-sm">{order.id.substring(0, 8)}...</td>
                                <td className="p-4">{new Date(order.created_at).toLocaleDateString()}</td>
                                <td className="p-4">{order.profiles?.full_name || 'N/A'}</td>
                                <td className="p-4">{order.total_amount.toFixed(2)} {order.currency}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        order.status === 'completed' ? 'bg-green-900 text-green-300' :
                                        order.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                                        'bg-red-900 text-red-300'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button className="text-sky-400 hover:underline">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {orders.length === 0 && (
                    <p className="text-center p-8 text-gray-500">No orders found.</p>
                )}
            </div>
        </div>
    );
}
