'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function UserManagementPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('profiles')
                .select(`
                    id,
                    full_name,
                    email,
                    role,
                    kyc_status
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching users:', error);
            } else {
                setUsers(data);
            }
            setLoading(false);
        };
        fetchUsers();
    }, []);

    if (loading) {
        return <div>Loading users...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">User Management</h1>
            <div className="bg-gray-800 rounded-xl overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">KYC Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="p-4">
                                    <div className="font-semibold">{user.full_name}</div>
                                    <div className="text-sm text-gray-400">{user.email}</div>
                                </td>
                                <td className="p-4 capitalize">{user.role}</td>
                                <td className="p-4">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                        user.kyc_status === 'verified' ? 'bg-green-900 text-green-300' :
                                        user.kyc_status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                                        'bg-red-900 text-red-300'
                                    }`}>
                                        {user.kyc_status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button className="text-sky-400 hover:underline">Manage</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <p className="text-center p-8 text-gray-500">No users found.</p>
                )}
            </div>
        </div>
    );
}
