'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ProductListingsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const supabase = createClient();
            // This is a simplified query. A real implementation would fetch products
            // belonging to the currently logged-in seller.
            const { data, error } = await supabase
                .from('products')
                .select(`
                    id,
                    title,
                    status,
                    product_variants (
                        price,
                        currency,
                        stock_quantity
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching products:', error);
            } else {
                setProducts(data);
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);

    if (loading) {
        return <div>Loading products...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">Product Listings</h1>
            <div className="bg-gray-800 rounded-xl overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="p-4">Product Name</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="p-4 font-semibold">{product.title}</td>
                                <td className="p-4">
                                    {product.product_variants.length > 0
                                        ? `${product.product_variants[0].price.toFixed(2)} ${product.product_variants[0].currency}`
                                        : 'N/A'
                                    }
                                </td>
                                <td className="p-4">
                                    {product.product_variants.reduce((acc: number, v: any) => acc + v.stock_quantity, 0)}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        product.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                                    }`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button className="text-sky-400 hover:underline">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <p className="text-center p-8 text-gray-500">No products found.</p>
                )}
            </div>
        </div>
    );
}
