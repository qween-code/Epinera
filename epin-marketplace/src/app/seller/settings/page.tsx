export default function StoreSettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-black dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Store Settings</h1>
        <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-md hover:bg-primary/90 transition-colors">
          <span className="truncate">Save All Changes</span>
        </button>
      </div>
      {/* Store Profile Section */}
      <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-black dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] px-6 py-4 border-b border-slate-200 dark:border-slate-800">Store Profile</h2>
        <div className="p-6 space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" htmlFor="store-name">Store Name</label>
                <input className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-transparent text-black dark:text-white focus:ring-primary focus:border-primary" id="store-name" type="text" value="GameDen"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" htmlFor="store-description">Store Description</label>
                <textarea className="form-textarea w-full rounded-lg border-slate-300 dark:border-slate-700 bg-transparent text-black dark:text-white focus:ring-primary focus:border-primary" id="store-description" rows={4}>Your one-stop shop for the best digital game keys and epins. Instant delivery and 24/7 support.</textarea>
            </div>
        </div>
      </div>
      {/* Notifications Section */}
      <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-black dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] px-6 py-4 border-b border-slate-200 dark:border-slate-800">Notifications</h2>
        <div className="p-6 divide-y divide-slate-200 dark:divide-slate-800">
            <div className="flex items-center justify-between py-4">
                <div>
                    <p className="text-black dark:text-white font-medium">New Sales</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Get notified when you make a new sale.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                </label>
            </div>
        </div>
      </div>
    </div>
  );
}
