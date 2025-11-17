'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import OrderFilters from '@/components/seller/OrderFilters';
import OrderSearch from '@/components/seller/OrderSearch';
import BatchActionToolbar from '@/components/seller/BatchActionToolbar';
import OrdersTable from '@/components/seller/OrdersTable';
import OrderDetailsSidebar from '@/components/seller/OrderDetailsSidebar';

export default function SellerOrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    vip: 'all',
    search: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: { user: currentUser } } = await supabase.auth.getUser();

        if (!currentUser) {
          router.push('/login?redirect=/seller/orders');
          return;
        }

        setUser(currentUser);

        // Fetch seller's order items
        let query = supabase
          .from('order_items')
          .select(
            `
            id,
            quantity,
            unit_price,
            total_price,
            delivery_status,
            created_at,
            orders!inner (
              id,
              buyer_id,
              delivery_info,
              created_at
            ),
            products (
              title,
              image_url
            ),
            product_variants (
              name
            ),
            profiles!order_items_seller_id_fkey (
              full_name
            )
          `
          )
          .eq('seller_id', currentUser.id)
          .order('created_at', { ascending: false });

        // Apply filters
        if (filters.status !== 'all') {
          query = query.eq('delivery_status', filters.status);
        }

        if (filters.dateRange !== 'all') {
          const now = new Date();
          let startDate: Date;
          switch (filters.dateRange) {
            case '7days':
              startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              break;
            case '30days':
              startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              break;
            case '90days':
              startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
              break;
            default:
              startDate = new Date(0);
          }
          query = query.gte('created_at', startDate.toISOString());
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching orders:', error);
        } else {
          // Fetch buyer names
          const buyerIds = [...new Set((data || []).map((item: any) => item.orders.buyer_id))];
          const { data: buyers } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', buyerIds);

          const buyerMap = new Map(buyers?.map((b: any) => [b.id, b.full_name]) || []);

          const enrichedData = (data || []).map((item: any) => ({
            ...item,
            buyer_name: buyerMap.get(item.orders.buyer_id) || 'Unknown',
            buyer_id: item.orders.buyer_id,
            order_id: item.orders.id,
            product_title: item.products?.title || 'Unknown Product',
            variant_name: item.product_variants?.name || '',
            currency: 'USD',
            is_vip: false, // TODO: Implement VIP check
          }));

          // Apply search filter
          let filteredData = enrichedData;
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredData = enrichedData.filter(
              (item: any) =>
                item.order_id.toLowerCase().includes(searchLower) ||
                item.buyer_name.toLowerCase().includes(searchLower) ||
                item.product_title.toLowerCase().includes(searchLower)
            );
          }

          setOrderItems(filteredData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, router]);

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const handleDateRangeChange = (range: string) => {
    setFilters((prev) => ({ ...prev, dateRange: range }));
  };

  const handleVIPChange = (vip: string) => {
    setFilters((prev) => ({ ...prev, vip }));
  };

  const handleSearchChange = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]));
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedOrders(orderItems.map((item) => item.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleOrderClick = (orderId: string) => {
    setSelectedOrder(orderId);
  };

  const handleBatchAction = (action: string) => {
    // TODO: Implement batch actions
    console.log('Batch action:', action, selectedOrders);
  };

  const handleExport = () => {
    // TODO: Implement export
    console.log('Export orders');
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display">
        <div className="flex-1 p-8">
          <div className="text-center text-gray-800 dark:text-[#EDF2F7]">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display">
      <main className="flex-1">
        <div className="flex">
          {/* Orders List Section */}
          <div className="flex-grow p-8">
            {/* Page Heading */}
            <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <h1 className="text-gray-800 dark:text-[#EDF2F7] text-4xl font-black leading-tight tracking-tighter">
                  Order Management
                </h1>
                <p className="text-gray-600 dark:text-[#A0AEC0] text-base font-normal leading-normal">
                  View and process all incoming and pending orders.
                </p>
              </div>
              <button
                onClick={handleExport}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded h-10 px-4 bg-white dark:bg-[#1A2831] text-gray-800 dark:text-[#EDF2F7] border border-gray-200 dark:border-[#2D3748] text-sm font-bold leading-normal tracking-wide hover:bg-primary/10 transition-colors"
              >
                <span className="truncate">Export Orders</span>
              </button>
            </header>

            {/* Filters & Search */}
            <div className="flex flex-col gap-4 mb-4">
              <OrderFilters
                onStatusChange={handleStatusChange}
                onDateRangeChange={handleDateRangeChange}
                onVIPChange={handleVIPChange}
              />
              <OrderSearch onSearchChange={handleSearchChange} />
            </div>

            {/* Batch Action Toolbar */}
            {selectedOrders.length > 0 && (
              <BatchActionToolbar
                selectedCount={selectedOrders.length}
                onBatchAction={handleBatchAction}
              />
            )}

            {/* Orders Table */}
            <div className="overflow-x-auto bg-white dark:bg-[#1A2831] rounded border border-gray-200 dark:border-[#2D3748]">
              <OrdersTable
                orders={orderItems}
                selectedOrders={selectedOrders}
                onSelectOrder={handleSelectOrder}
                onSelectAll={handleSelectAll}
                onOrderClick={handleOrderClick}
              />
            </div>
          </div>

          {/* Order Details Side Panel */}
          {selectedOrder && (
            <OrderDetailsSidebar
              orderId={selectedOrder}
              onClose={() => setSelectedOrder(null)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
