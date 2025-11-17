'use client';

interface Product {
  id: string;
  title: string;
  image_url?: string;
  unitsSold: number;
  revenue: number;
}

interface TopProductsProps {
  products: Product[];
}

export default function TopProducts({ products }: TopProductsProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white dark:bg-[#2C2C3E] p-6">
      <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white">
        Top Products by Revenue
      </h2>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-12"
              data-alt={`${product.title} icon`}
              style={{
                backgroundImage: product.image_url || 'url("https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100")',
              }}
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">{product.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{product.unitsSold} units sold</p>
            </div>
            <p className="font-bold text-gray-900 dark:text-white">{formatAmount(product.revenue)}</p>
          </div>
        ))}
        {products.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">No products found</p>
        )}
      </div>
    </div>
  );
}

