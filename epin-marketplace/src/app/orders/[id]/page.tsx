import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import OrderConfirmationHeader from '@/components/orders/OrderConfirmationHeader';
import OrderSummaryCard from '@/components/orders/OrderSummaryCard';
import ConfirmationBanner from '@/components/orders/ConfirmationBanner';
import OrderDetailsCard from '@/components/orders/OrderDetailsCard';
import DeliveryTracking from '@/components/orders/DeliveryTracking';
import ActionButtons from '@/components/orders/ActionButtons';
import SupportCard from '@/components/orders/SupportCard';
import SocialShareCard from '@/components/orders/SocialShareCard';
import { getOrderDeliveryStatus } from '@/app/actions/order';

type OrderPageProps = {
  params: {
    id: string;
  };
  searchParams: {
    success?: string;
  };
};

export default async function OrderPage({ params, searchParams }: OrderPageProps) {
  const { id } = params;
  const supabase = await createClient();

  // Fetch order details
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles!orders_buyer_id_fkey(full_name),
      order_items (
        *,
        product_variants (
          name,
          price,
          currency
        ),
        products (
          title,
          slug,
          image_url
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error || !order) {
    notFound();
  }

  // Verify user owns this order
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || order.buyer_id !== user.id) {
    notFound();
  }

  // Get delivery status
  const deliveryStatusResult = await getOrderDeliveryStatus(id);
  const deliveryStatus = deliveryStatusResult.success ? deliveryStatusResult.status : 'placed';
  const deliveryCode = deliveryStatusResult.success ? deliveryStatusResult.code : null;

  // Format order number (short version)
  const orderNumber = `#${id.substring(0, 8).toUpperCase()}`;
  
  // Format date
  const dateOfPurchase = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Format payment method
  const paymentMethodMap: Record<string, string> = {
    wallet: 'Site Credits',
    credit_card: 'Credit/Debit Card',
    paypal: 'PayPal',
    bank_transfer: 'Bank Transfer',
  };
  const paymentMethod = paymentMethodMap[order.payment_method as string] || order.payment_method || 'Site Credits';

  // Calculate totals
  const subtotal = parseFloat(order.subtotal?.toString() || order.total_amount.toString()) - parseFloat(order.tax_amount?.toString() || '0');
  const taxes = parseFloat(order.tax_amount?.toString() || '0');
  const total = parseFloat(order.total_amount.toString());

  // Get buyer name
  const buyerName = (order.profiles as any)?.full_name || user.email?.split('@')[0] || 'Customer';

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-white">
      <OrderConfirmationHeader />
      <main className="flex-grow px-4 py-8 sm:px-6 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Link className="text-white/60 hover:text-white transition-colors text-sm font-medium leading-normal" href="/">
              Home
            </Link>
            <span className="text-white/60 text-sm font-medium leading-normal">/</span>
            <Link className="text-white/60 hover:text-white transition-colors text-sm font-medium leading-normal" href="/wallet">
              My Account
            </Link>
            <span className="text-white/60 text-sm font-medium leading-normal">/</span>
            <span className="text-white text-sm font-medium leading-normal">{orderNumber}</span>
          </div>

          {/* Page Heading */}
          <div className="flex flex-wrap justify-between gap-4 mb-8">
            <div className="flex flex-col gap-2">
              <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Thank You For Your Order, {buyerName.split(' ')[0]}!
              </p>
              <p className="text-white/70 text-base font-normal leading-normal">
                Your purchase is complete and your digital items are being delivered.
              </p>
            </div>
          </div>

          {/* Three-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Order Summary */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <OrderSummaryCard
                items={order.order_items as any[]}
                subtotal={subtotal}
                taxes={taxes}
                total={total}
                currency={order.currency}
              />
            </div>

            {/* Center Column: Main Confirmation & Tracking */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <ConfirmationBanner />
              <OrderDetailsCard
                orderNumber={orderNumber}
                dateOfPurchase={dateOfPurchase}
                paymentMethod={paymentMethod}
              />
              <DeliveryTracking 
                status={deliveryStatus === 'payment_verified' ? 'verified' : deliveryStatus as 'placed' | 'verified' | 'securing' | 'delivered'} 
                code={deliveryCode} 
              />
            </div>

            {/* Right Column: Actions & Support */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <ActionButtons
                onViewCodes={() => {
                  // TODO: Implement view codes modal/page
                  console.log('View codes');
                }}
                onDownloadReceipt={() => {
                  // TODO: Implement download receipt
                  console.log('Download receipt');
                }}
              />
              <SupportCard />
              <SocialShareCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
