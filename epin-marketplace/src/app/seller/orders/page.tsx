// Mock data for orders - replace with actual data fetching later
const orders = [
  {
    id: '#8B3D4F',
    buyer: 'Jane Doe',
    isVip: true,
    date: 'Oct 26, 2023',
    product: '100 Game Credits',
    total: '$10.00',
    status: 'New',
  },
  {
    id: '#9C2A5E',
    buyer: 'John Smith',
    isVip: false,
    date: 'Oct 26, 2023',
    product: 'Legendary Sword Skin',
    total: '$45.50',
    status: 'Processing',
  },
  {
    id: '#AF1B6D',
    buyer: 'Emily White',
    isVip: false,
    date: 'Oct 25, 2023',
    product: '5000 V-Bucks',
    total: '$39.99',
    status: 'New',
  },
  {
    id: '#BE0A7C',
    buyer: 'Michael Brown',
    isVip: true,
    date: 'Oct 24, 2023',
    product: 'Season 5 Battle Pass',
    total: '$9.50',
    status: 'Delivered',
  },
  {
    id: '#CD-FB8B',
    buyer: 'Sarah Green',
    isVip: false,
    date: 'Oct 23, 2023',
    product: 'Rare Mount Token',
    total: '$22.00',
    status: 'Disputed',
  },
];

const statusColors: { [key: string]: string } = {
    New: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    Processing: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    Delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Disputed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

export default function OrderManagementPage() {
  return (
    <div>
      <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-tighter">Order Management</h1>
          <p className="text-text-muted-light dark:text-text-muted-dark text-base font-normal leading-normal">View and process all incoming and pending orders.</p>
        </div>
      </header>
      <div className="overflow-x-auto bg-card-light dark:bg-card-dark rounded border border-border-light dark:border-border-dark">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-muted-light dark:text-text-muted-dark uppercase bg-background-light dark:bg-background-dark/50">
            <tr>
              <th scope="col" className="p-4"><input type="checkbox" className="form-checkbox rounded" /></th>
              <th scope="col" className="px-6 py-3">Order ID</th>
              <th scope="col" className="px-6 py-3">Buyer</th>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Product</th>
              <th scope="col" className="px-6 py-3">Total</th>
              <th scope="col" className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border-light dark:border-border-dark hover:bg-primary/5 cursor-pointer">
                <td className="w-4 p-4"><input type="checkbox" className="form-checkbox rounded" /></td>
                <td className="px-6 py-4 font-medium text-text-light dark:text-text-dark whitespace-nowrap">{order.id}</td>
                <td className="px-6 py-4 flex items-center gap-2">
                    {order.isVip && <span className="material-symbols-outlined text-vip text-lg" style={{fontVariationSettings: "'FILL' 1"}}>star</span>}
                    {order.buyer}
                </td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4">{order.product}</td>
                <td className="px-6 py-4">{order.total}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
