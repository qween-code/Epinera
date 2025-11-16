// src/app/history/page.tsx
import React from 'react';

const TransactionHistoryPage = () => {
  const transactions = [
    {
      date: 'Oct 26, 2023, 10:45 AM',
      type: 'Purchase',
      details: 'Purchase: 10€ Steam Epin',
      amount: '-€10.00',
      status: 'Completed',
      icon: 'shopping_cart',
      amountClass: 'text-red-400',
      statusClass: 'bg-green-900 text-green-300',
    },
    {
      date: 'Oct 25, 2023, 02:17 PM',
      type: 'Deposit',
      details: 'Deposit from VISA **** 4242',
      amount: '+€50.00',
      status: 'Completed',
      icon: 'account_balance_wallet',
      amountClass: 'text-green-400',
      statusClass: 'bg-green-900 text-green-300',
    },
    {
      date: 'Oct 24, 2023, 09:00 AM',
      type: 'Purchase',
      details: 'Purchase: Game Subscription',
      amount: '-€15.99',
      status: 'Pending',
      icon: 'shopping_cart',
      amountClass: 'text-red-400',
      statusClass: 'bg-yellow-900 text-yellow-300',
    },
    {
      date: 'Oct 22, 2023, 06:30 PM',
      type: 'Bonus',
      details: 'Welcome Bonus Applied',
      amount: '+€5.00',
      status: 'Completed',
      icon: 'military_tech',
      amountClass: 'text-green-400',
      statusClass: 'bg-green-900 text-green-300',
    },
    {
      date: 'Oct 21, 2023, 11:11 AM',
      type: 'Withdrawal',
      details: 'Withdrawal to Wallet XYZ',
      amount: '-€25.00',
      status: 'Failed',
      icon: 'logout',
      amountClass: 'text-red-400',
      statusClass: 'bg-red-900 text-red-300',
    },
  ];

  return (
    <main className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col w-full max-w-7xl flex-1">
        <div className="flex flex-wrap justify-between items-center gap-4 p-4">
          <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Transaction History</p>
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-white/10 dark:bg-[#223d49] text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 hover:bg-white/20 dark:hover:bg-[#2e4f60] transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
            <span className="truncate">Export to CSV</span>
          </button>
        </div>
        <div className="flex flex-col gap-4 p-4 border-b border-white/10 dark:border-[#223d49]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                  <div className="text-white/50 dark:text-[#90b8cb] flex border-none bg-white/10 dark:bg-[#223d49] items-center justify-center pl-4 rounded-l-xl border-r-0">
                    <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>search</span>
                  </div>
                  <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-white/10 dark:bg-[#223d49] focus:border-none h-full placeholder:text-white/50 dark:placeholder:text-[#90b8cb] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" placeholder="Search by product or ID" value="" />
                </div>
              </label>
            </div>
            <div className="lg:col-span-2 flex items-center gap-3 overflow-x-auto">
              <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-white/10 dark:bg-[#223d49] px-4 hover:bg-white/20 dark:hover:bg-[#2e4f60] transition-colors">
                <span className="material-symbols-outlined text-white/70">calendar_month</span>
                <p className="text-white text-sm font-medium leading-normal">Date Range</p>
                <span className="material-symbols-outlined text-white/70">expand_more</span>
              </button>
              <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-white/10 dark:bg-[#223d49] px-4 hover:bg-white/20 dark:hover:bg-[#2e4f60] transition-colors">
                <span className="material-symbols-outlined text-white/70">receipt_long</span>
                <p className="text-white text-sm font-medium leading-normal">Transaction Type</p>
                <span className="material-symbols-outlined text-white/70">expand_more</span>
              </button>
              <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-white/10 dark:bg-[#223d49] px-4 hover:bg-white/20 dark:hover:bg-[#2e4f60] transition-colors">
                <span className="material-symbols-outlined text-white/70">sell</span>
                <p className="text-white text-sm font-medium leading-normal">Status</p>
                <span className="material-symbols-outlined text-white/70">expand_more</span>
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="flex gap-3">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-white/10 dark:bg-[#223d49] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/20 dark:hover:bg-[#2e4f60] transition-colors">
                <span className="truncate">Reset</span>
              </button>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
                <span className="truncate">Apply Filters</span>
              </button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/70 dark:text-[#a0aec0]">
              <thead className="border-b border-white/10 dark:border-[#223d49] text-xs uppercase text-white/50 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3" scope="col">Date</th>
                  <th className="px-6 py-3" scope="col">Type</th>
                  <th className="px-6 py-3" scope="col">Details</th>
                  <th className="px-6 py-3 text-right" scope="col">Amount</th>
                  <th className="px-6 py-3" scope="col">Status</th>
                  <th className="px-6 py-3 text-center" scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index} className="border-b border-white/10 dark:border-[#223d49]">
                    <td className="px-6 py-4">{transaction.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined">{transaction.icon}</span>
                        <span>{transaction.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-white">{transaction.details}</td>
                    <td className={`px-6 py-4 text-right ${transaction.amountClass}`}>{transaction.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${transaction.statusClass}`}>{transaction.status}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-primary hover:underline">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-between items-center p-4">
          <span className="text-sm text-white/50 dark:text-gray-400">Showing 1 to 5 of 20 Results</span>
          <div className="inline-flex items-center -space-x-px text-sm">
            <button className="flex items-center justify-center px-3 h-8 leading-tight text-white/70 bg-white/10 dark:bg-[#223d49] border border-white/20 dark:border-gray-700 rounded-l-lg hover:bg-white/20 dark:hover:bg-gray-700">Previous</button>
            <button className="flex items-center justify-center px-3 h-8 leading-tight text-white bg-primary border border-primary hover:bg-primary/90">1</button>
            <button className="flex items-center justify-center px-3 h-8 leading-tight text-white/70 bg-white/10 dark:bg-[#223d49] border border-white/20 dark:border-gray-700 hover:bg-white/20 dark:hover:bg-gray-700">2</button>
            <button className="flex items-center justify-center px-3 h-8 leading-tight text-white/70 bg-white/10 dark:bg-[#223d49] border border-white/20 dark:border-gray-700 hover:bg-white/20 dark:hover:bg-gray-700">3</button>
            <button className="flex items-center justify-center px-3 h-8 leading-tight text-white/70 bg-white/10 dark:bg-[#223d49] border border-white/20 dark:border-gray-700 rounded-r-lg hover:bg-white/20 dark:hover:bg-gray-700">Next</button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TransactionHistoryPage;
