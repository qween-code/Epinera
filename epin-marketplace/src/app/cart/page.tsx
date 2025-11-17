import Link from 'next/link';

// Mock data for cart items - replace with actual data fetching later
const cartItems = [
  {
    id: 1,
    name: '5,000 Credits Steam Wallet Code',
    price: 5000,
    quantity: 1,
    platform: 'Steam',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrRmHp2nx-hFpmlWuYqzKc5hhmof2000CL-ZqQVbWPyplaECWCer6TPHhUy0uwesLdguaJYiT6lHucnmjb34QB7S6SsXd0FDVr6dgXrhx7r_ZMna2DZIycoTGXEEHYZvFD0qw2dobWXjSe15vWf4JtzIDmMucnrkGstNg55uTTEJ4OwTS8VS5kT38OYTaBYU2Q1mkfKsMm-NwwpgY-d-zG3m9ZvyR22_iHg2cPDJg1AcN_5bI3LIpVUnGuItP_r4Ikqnp7yT7xat7l',
  },
  {
    id: 2,
    name: '1,000 V-Bucks Gift Card',
    price: 999,
    quantity: 2,
    platform: 'Fortnite',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOocAliale3TwHZpWe00zbHohz6kZpvIeVvN7eRn8TTsDwBNC_qSZEcx39Q048P8_jzUE3aVxeuqVQs3nyjhR6z0wSn-CpXEkVT_mtPYfZGAU1dRDGkkAiuQJMzXZ_XCTxnZj4YZ8D1rJtqwBhDtwsZAtjIPP9WeQsSwB4ucmIm4zv-Etc_eRzhonrgg1_b9KOaRpRkUB4xbK0d2gkaLoiSgyMKV9Fy6lfzV4BigF73D_EU445RC6FA_QWUw0OiOYTSiQ5B9Ms8BJ9',
  },
];

const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
const taxes = subtotal * 0.08; // Example tax rate
const total = subtotal + taxes;

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Link href="/" className="text-gray-400 hover:text-primary text-sm font-medium transition-colors">
            Home
          </Link>
          <span className="text-gray-500 text-sm">/</span>
          <span className="text-white text-sm font-medium">Your Cart</span>
        </div>
        <div className="flex flex-wrap justify-between gap-4 items-baseline">
          <h1 className="text-white text-4xl lg:text-5xl font-bold tracking-tighter">Your Shopping Cart</h1>
          <Link href="/products" className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-px overflow-hidden rounded-lg border border-gray-200/20 bg-gray-200/20">
            {cartItems.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 bg-background-dark p-4 sm:p-6 justify-between items-start sm:items-center">
                    <div className="flex items-start gap-4 w-full">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-20 shrink-0" style={{ backgroundImage: `url("${item.image}")` }}></div>
                        <div className="flex flex-1 flex-col justify-center gap-1">
                            <p className="text-white text-lg font-semibold leading-tight">{item.name}</p>
                            <p className="text-gray-400 text-sm font-normal">Platform: {item.platform}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                        <div className="shrink-0">
                            <div className="flex items-center gap-2 text-white bg-gray-200/10 rounded-full px-1">
                                <button className="text-xl font-medium flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-200/20 transition-colors cursor-pointer">-</button>
                                <input className="text-base font-medium w-8 p-0 text-center bg-transparent focus:outline-none border-none" type="number" value={item.quantity} readOnly />
                                <button className="text-xl font-medium flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-200/20 transition-colors cursor-pointer">+</button>
                            </div>
                        </div>
                        <p className="text-white text-lg font-semibold w-24 text-right">{item.price * item.quantity} Cr</p>
                        <button className="text-gray-400 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
            <div className="sticky top-28 flex flex-col gap-6 rounded-xl border border-gray-200/20 bg-background-dark p-6">
                <h2 className="text-white text-2xl font-bold">Order Summary</h2>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center text-gray-300">
                        <span>Subtotal</span>
                        <span className="text-white font-medium">{subtotal} Credits</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-300">
                        <span>Taxes</span>
                        <span className="text-white font-medium">{taxes.toFixed(0)} Credits</span>
                    </div>
                </div>
                <div className="w-full h-px bg-gray-200/20"></div>
                <div className="flex justify-between items-center">
                    <span className="text-white text-xl font-bold">Total</span>
                    <span className="text-white text-2xl font-bold">{total.toFixed(0)} Credits</span>
                </div>
                <Link href="/checkout" className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-primary text-white gap-2 text-base font-bold tracking-wide hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined">lock</span>
                    <span>Proceed to Secure Payment</span>
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}
