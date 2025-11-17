// Mock data for users - replace with actual data fetching later
const users = [
  {
    id: '1',
    name: 'Olivia Smith',
    email: 'olivia.s@example.com',
    role: 'Seller',
    status: 'Active',
    lastLogin: '2024-05-20',
    riskScore: 15,
  },
  {
    id: '2',
    name: 'Liam Johnson',
    email: 'liam.j@example.com',
    role: 'Buyer',
    status: 'Suspended',
    lastLogin: '2024-04-12',
    riskScore: 85,
  },
  {
    id: '3',
    name: 'Ava Brown',
    email: 'ava.b@example.com',
    role: 'Creator',
    status: 'Pending',
    lastLogin: '2024-05-18',
    riskScore: 40,
  },
];

const statusColors: { [key: string]: string } = {
    Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  };

export default function UserManagementPage() {
  return (
    <div>
        <div className="flex flex-wrap justify-between items-center gap-3 p-4">
            <h1 className="text-4xl font-black leading-tight tracking-[-0.033em]">User Management</h1>
        </div>
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-border-dark overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-background-dark border-b border-gray-200 dark:border-border-dark">
                        <tr>
                            <th scope="col" className="p-4"><input type="checkbox" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"/></th>
                            <th scope="col" className="px-6 py-3">User</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Last Login</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-gray-200 dark:border-border-dark hover:bg-gray-50 dark:hover:bg-background-dark">
                                <td className="w-4 p-4"><input type="checkbox" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"/></td>
                                <td className="px-6 py-4 font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <div className="text-base font-bold">{user.name}</div>
                                            <div className="font-normal text-gray-500 dark:text-gray-400">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{user.role}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[user.status]}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{user.lastLogin}</td>
                                <td className="px-6 py-4"><button className="text-primary hover:underline font-medium">Manage</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}
