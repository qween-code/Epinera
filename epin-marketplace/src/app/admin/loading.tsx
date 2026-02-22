import { StatCardSkeleton, TableRowSkeleton } from '@/components/ui/Skeleton';

export default function AdminLoading() {
  return (
    <div className="animate-fade-in">
      <div className="h-8 skeleton w-1/4 mb-8" />
      <StatCardSkeleton count={4} />
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 skeleton rounded-xl" />
        <div className="h-64 skeleton rounded-xl" />
      </div>
    </div>
  );
}
