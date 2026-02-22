import { ProductGridSkeleton } from '@/components/ui/Skeleton';

export default function CategoryLoading() {
  return (
    <div className="container mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <div className="h-6 skeleton w-32 rounded-full mb-3" />
        <div className="h-10 skeleton w-48 mb-2" />
        <div className="h-4 skeleton w-24" />
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}
