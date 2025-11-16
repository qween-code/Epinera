import Link from 'next/link';

// Mock data for order summary - replace with actual data fetching later
const orderSummary = {
  subtotal: 1000.00,
  taxesAndFees: 150.00,
  total: 1150.00,
  currency: 'Credits',
  item: {
    name: '100 Game Credits - Product Name',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBg6KGg2BemNYapReU0vqgof1OQYPaQ18Vm3qWIf9cU5aYexFP07Kp-QFwhaQKQ9OMQctC4z2GEzorgqqzTa6YTrC-4VM7MdwBbpE7UvIbwkBpDthSzaSjtVXqzHn1-3VAu3xt85_4jIT2gKJFvZjnQYhREbe7FzTCmBJAXXpf6hnY7p18zt4Nk2p7Yk2D83QSV3JnImanXAWmtenpZnhQa_yFx2E9zch5CXNKtUQKvgthcCYVq5xfFi9pV1GY90ZmhH5s0mxbBj-DN',
  },
};

const user = {
    availableCredits: 1500.00,
}

const sufficientCredits = user.availableCredits >= orderSummary.total;

export default function CheckoutPage() {
  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-wrap justify-between gap-4 mb-8">
        <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Confirm Your Purchase</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-1 lg:order-last">
          <div className="sticky top-28">
            <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-6">
              <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 py-2">
                  <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-12" style={{backgroundImage: `url("${orderSummary.item.image}")`}}></div>
                  <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal flex-1 truncate">{orderSummary.item.name}</p>
                  <div className="shrink-0"><p className="text-slate-900 dark:text-white text-base font-medium leading-normal">{orderSummary.total.toFixed(2)} {orderSummary.currency}</p></div>
                </div>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 mt-4 pt-4">
                <div className="flex justify-between gap-x-6 py-2">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">Subtotal</p>
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal text-right">{orderSummary.subtotal.toFixed(2)} {orderSummary.currency}</p>
                </div>
                <div className="flex justify-between gap-x-6 py-2">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">Taxes &amp; Fees</p>
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal text-right">{orderSummary.taxesAndFees.toFixed(2)} {orderSummary.currency}</p>
                </div>
                <div className="flex justify-between gap-x-6 py-3 border-t border-slate-200 dark:border-slate-700 mt-2">
                  <p className="text-slate-600 dark:text-slate-300 text-base font-bold leading-normal">Total</p>
                  <p className="text-slate-900 dark:text-white text-base font-bold leading-normal text-right">{orderSummary.total.toFixed(2)} {orderSummary.currency}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="space-y-8">
            <div>
              <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Payment Method</h2>
              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary">
                      <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Site Credits</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Using your available balance</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Available</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{user.availableCredits.toFixed(2)} {orderSummary.currency}</p>
                  </div>
                </div>
              </div>
            </div>

            {sufficientCredits ? (
                <div className="p-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-2xl text-green-600 dark:text-green-400 mt-1">check_circle</span>
                        <div>
                            <h3 className="text-lg font-bold text-green-800 dark:text-green-300">Sufficient Credits</h3>
                            <p className="text-green-700 dark:text-green-400 mt-1">You have enough credits to complete this purchase. Click the button below to confirm and finalize your transaction.</p>
                            <div className="mt-6">
                                <button className="w-full sm:w-auto flex items-center justify-center rounded-lg h-12 px-8 bg-primary text-white text-base font-bold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <span>Confirm Purchase</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-3xl text-red-600 dark:text-red-400 mt-0.5">error</span>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-red-800 dark:text-red-300">Insufficient Credits</h3>
                            <p className="text-red-700 dark:text-red-400 mt-2 text-base">You do not have enough credits for this purchase. Please add funds to your wallet to proceed.</p>
                            <div className="mt-6">
                                <button className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg h-12 px-8 bg-primary text-white text-base font-bold transition-opacity hover:opacity-90">
                                    <span className="material-symbols-outlined">add_card</span>
                                    <span>Add Funds to Wallet</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
