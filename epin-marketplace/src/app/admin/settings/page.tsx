// Mock data for categories - replace with actual data fetching later
const categories = [
  {
    name: 'PC Games',
    subcategories: 5,
    status: 'Active',
    lastUpdated: '2023-10-26',
  },
  {
    name: 'Mobile Games',
    subcategories: 8,
    status: 'Active',
    lastUpdated: '2023-10-25',
  },
  {
    name: 'Console Games',
    subcategories: 12,
    status: 'Active',
    lastUpdated: '2023-10-24',
  },
  {
    name: 'Software',
    subcategories: 3,
    status: 'Disabled',
    lastUpdated: '2023-09-15',
  },
];

export default function PlatformSettingsPage() {
  return (
    <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-72 flex-col gap-2">
                <p className="font-display text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">Manage Categories</p>
                <p className="text-base font-normal leading-normal text-slate-500 dark:text-[#90b8cb]">Organize product categories and subcategories for the marketplace.</p>
            </div>
            <button className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-4 text-sm font-bold leading-normal tracking-[0.015em] text-white">
                <span className="material-symbols-outlined">add_circle</span>
                <span className="truncate">Add New Category</span>
            </button>
        </div>
        <div className="mt-6 @container">
            <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-background-light dark:border-[#315768] dark:bg-background-dark">
                <table className="min-w-full flex-1">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-[#182b34]">
                            <th className="px-4 py-3 text-left text-sm font-medium leading-normal text-slate-600 dark:text-white">Category Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium leading-normal text-slate-600 dark:text-white">Subcategories</th>
                            <th className="px-4 py-3 text-left text-sm font-medium leading-normal text-slate-600 dark:text-white">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium leading-normal text-slate-600 dark:text-white">Last Updated</th>
                            <th className="px-4 py-3 text-left text-sm font-medium leading-normal text-slate-600 dark:text-[#90b8cb]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category, index) => (
                            <tr key={index} className="border-t border-t-slate-200/80 dark:border-t-[#315768]">
                                <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal text-slate-800 dark:text-white">{category.name}</td>
                                <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal text-slate-500 dark:text-[#90b8cb]">{category.subcategories}</td>
                                <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                                    <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${category.status === 'Active' ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                                        <div className={`size-2 rounded-full ${category.status === 'Active' ? 'bg-teal-500' : 'bg-slate-500'}`}></div>
                                        {category.status}
                                    </div>
                                </td>
                                <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal text-slate-500 dark:text-[#90b8cb]">{category.lastUpdated}</td>
                                <td className="h-[72px] px-4 py-2 text-sm font-bold leading-normal tracking-[0.015em]">
                                    <button className="flex items-center gap-2 font-medium text-primary hover:underline">
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                        Edit
                                    </button>
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
