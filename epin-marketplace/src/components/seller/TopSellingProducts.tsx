'use client';

interface Product {
  id: string;
  name: string;
  type: string;
  revenue: number;
  sold: number;
  image: string;
}

export default function TopSellingProducts({ products }: { products: Product[] }) {
  return (
    <div className="bg-[#0c161b] rounded-xl border border-[#315768] p-6">
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Top Selling Products</h2>
      <div className="flex flex-col gap-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4">
            <div
              className="w-12 h-12 bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
              data-alt={`Game cover art for ${product.name}`}
              style={{ backgroundImage: `url("${product.image}")` }}
            />
            <div className="flex-1">
              <p className="text-white font-medium">{product.name}</p>
              <p className="text-slate-400 text-sm">{product.type}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">${product.revenue.toLocaleString()}</p>
              <p className="text-slate-400 text-sm">{product.sold} Sold</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

