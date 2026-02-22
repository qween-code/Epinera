import { ProductGridSkeleton } from '@/components/ui/Skeleton';

export default function SearchLoading() {
  return (
    <div className="container mx-auto px-6 py-10 max-w-7xl animate-fade-in">
      <div className="h-8 skeleton w-1/4 mb-8" />
      <div className="h-48 skeleton rounded-xl mb-8" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}
