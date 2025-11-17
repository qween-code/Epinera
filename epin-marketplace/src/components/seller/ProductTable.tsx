'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  image_url?: string;
  sku?: string;
  stock: number;
  price: number;
  currency: string;
  status: string;
}

interface ProductTableProps {
  products: Product[];
  selectedProducts: string[];
  onSelectProduct: (productId: string) => void;
  onSelectAll: (selected: boolean) => void;
  onEdit?: (productId: string) => void;
  onView?: (productId: string) => void;
  onDelete?: (productId: string) => void;
}

export default function ProductTable({
  products,
  selectedProducts,
  onSelectProduct,
  onSelectAll,
  onEdit,
  onView,
  onDelete,
}: ProductTableProps) {
  const allSelected = products.length > 0 && selectedProducts.length === products.length;

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getStatusBadge = (status: string, stock: number) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          Out of Stock
        </span>
      );
    }

    const statusMap: Record<string, { label: string; className: string }> = {
      active: { label: 'Active', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      inactive: { label: 'Inactive', className: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300' },
      draft: { label: 'Draft', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
    };

    const statusInfo = statusMap[status.toLowerCase()] || {
      label: status,
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="bg-slate-100/50 dark:bg-slate-900/50 rounded-xl overflow-hidden border border-slate-200/10 dark:border-slate-800">
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full text-sm text-left text-slate-600 dark:text-slate-400">
          <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-200/30 dark:bg-slate-800/50">
            <tr>
              <th className="p-4" scope="col">
                <div className="flex items-center">
                  <input
                    className="w-4 h-4 text-primary bg-slate-200 border-slate-400 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                    id="checkbox-all"
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                  />
                  <label className="sr-only" htmlFor="checkbox-all">
                    checkbox
                  </label>
                </div>
              </th>
              <th className="px-6 py-3" scope="col">
                Product Name
              </th>
              <th className="px-6 py-3" scope="col">
                SKU
              </th>
              <th className="px-6 py-3" scope="col">
                Stock
              </th>
              <th className="px-6 py-3" scope="col">
                Price
              </th>
              <th className="px-6 py-3" scope="col">
                Status
              </th>
              <th className="px-6 py-3" scope="col">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product.id}
                className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-200/20 dark:hover:bg-slate-800/20 transition-colors"
              >
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      className="w-4 h-4 text-primary bg-slate-200 border-slate-400 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                      id={`checkbox-table-${index}`}
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => onSelectProduct(product.id)}
                    />
                    <label className="sr-only" htmlFor={`checkbox-table-${index}`}>
                      checkbox
                    </label>
                  </div>
                </td>
                <th className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap" scope="row">
                  <div className="flex items-center gap-3">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded size-10"
                      data-alt={`${product.title} cover art`}
                      style={{
                        backgroundImage: product.image_url || 'url("https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100")',
                      }}
                    />
                    <span>{product.title}</span>
                  </div>
                </th>
                <td className="px-6 py-4">{product.sku || 'N/A'}</td>
                <td className="px-6 py-4">{product.stock > 999 ? '999+' : product.stock}</td>
                <td className="px-6 py-4">{formatPrice(product.price, product.currency)}</td>
                <td className="px-6 py-4">{getStatusBadge(product.status, product.stock)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit?.(product.id)}
                      className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                        edit
                      </span>
                    </button>
                    <button
                      onClick={() => onView?.(product.id)}
                      className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                      title="View"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                        visibility
                      </span>
                    </button>
                    <button
                      onClick={() => onDelete?.(product.id)}
                      className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                        delete
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
          </div>
        </div>
      </div>
    </div>
  );
}

