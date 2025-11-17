// Mock data for products - replace with actual data fetching later
const products = [
  {
    id: '1',
    name: 'Cyber Warrior - 1000 Credits',
    sku: 'CW-1000C-US',
    stock: 250,
    price: '$10.00',
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2mn3GXfErq_j9PiqwdJt6bkGxyTtCa2657-WafVAZVzs_XTzWE3DbMQqen9bHLn059Fkkf0WiEcmIYOkrccGwuXPyLxnUUzJdm0SmZPycozzQh3lBt1Tzcc4xo9buCAUPedl-waKUFjHqrzr8TBIWIBUqPOkPJ27g7_eUTBBNW9bF7oYd4M_TPqEGGuHZnY2V5w8h_dkMeU2rDeRju9L-b4gt3djKBBBfsyclTxuLQ9db_8rmxW35Y7z85EPrg6Xt3obz4GVZTR22',
  },
  {
    id: '2',
    name: 'Galaxy Runner - Starter Pack',
    sku: 'GR-SP-EU',
    stock: 120,
    price: '$5.00',
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi8IZokgZb3XXI4k7MyQ_ZTOidCtbfed1hBOGqQu-7uuIOdEcY_Jwko8LzJOWJpPfA9ijENJbgW5YnTn5hmulGfBf_f66Q6lL-utNhsqOI4iQ8_UFt9vDsFpXjuzw9Cn2qQyd_O9n_tsIrN2okgs0_7ViMT4TYlkDMgnSxZs7VVbattZ3W96HpKDNjd96ML2nOTOo9IokaYdt0yAvMJOJ5sWhpU33G33akk3vNrJq3JV9oZ74r-ZibGOE4PbK74g_6__-ISDtnBEgd',
  },
  {
    id: '3',
    name: 'Mystic Legends - Dragon Skin',
    sku: 'ML-DS-WW',
    stock: 0,
    price: '$15.00',
    status: 'Out of Stock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXklPr8TBZ49pBa8uTg64XHmyrej510RYz8kShk2e3jYOH3Y1q9kOGYpK6xzxl7HKA6dYxgdln6hO6kWtXHwki5xeIFUdJJJ2AeTnVxr7_2VAUvjpagiFM9WkpRxdnwbvfPaWXHvB2zBGa06ksL88kJjk0iEgJy4Dx8Cgq_okHDa5jqfRMYXK1YJNlNEBpG6fl-vQQnMIHdgBJrQl_LJiHP2jQC_BXhouTPCuOX43_K-HmMMcJ4kJP1WIzWnFTLXy8bSiHGN1h9ZyD',
  },
];

export default function ProductListingsPage() {
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">My Products</h1>
        <div className="flex items-center gap-2">
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-300 dark:hover:bg-slate-700">
            <span className="truncate">Import via CSV</span>
          </button>
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90">
            <span className="truncate">Add New Product</span>
          </button>
        </div>
      </div>
      <div className="bg-slate-100/50 dark:bg-slate-900/50 rounded-xl overflow-hidden border border-slate-200/10 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-200/30 dark:bg-slate-800/50">
              <tr>
                <th scope="col" className="p-4"><input type="checkbox" className="w-4 h-4 text-primary bg-slate-200 border-slate-400 rounded focus:ring-primary" /></th>
                <th scope="col" className="px-6 py-3">Product Name</th>
                <th scope="col" className="px-6 py-3">SKU</th>
                <th scope="col" className="px-6 py-3">Stock</th>
                <th scope="col" className="px-6 py-3">Price</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-200/20 dark:hover:bg-slate-800/20">
                  <td className="w-4 p-4"><input type="checkbox" className="w-4 h-4 text-primary bg-slate-200 border-slate-400 rounded focus:ring-primary" /></td>
                  <th scope="row" className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="bg-center bg-no-repeat aspect-square bg-cover rounded size-10" style={{ backgroundImage: `url("${product.image}")` }}></div>
                      <span>{product.name}</span>
                    </div>
                  </th>
                  <td className="px-6 py-4">{product.sku}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">{product.price}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span></button>
                      <button className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>visibility</span></button>
                      <button className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500"><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
