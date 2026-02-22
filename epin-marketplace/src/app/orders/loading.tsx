import { TableRowSkeleton } from '@/components/ui/Skeleton';

export default function OrdersLoading() {
  return (
    <div className="container mx-auto px-6 py-10 max-w-7xl animate-fade-in">
      <div className="h-8 skeleton w-1/4 mb-8" />
      <TableRowSkeleton count={5} />
    </div>
  );
}
