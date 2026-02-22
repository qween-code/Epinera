export function ProductCardSkeleton() {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="h-44 skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 skeleton w-3/4" />
        <div className="h-3 skeleton w-1/2" />
        <div className="pt-3 border-t border-[var(--border-dim)]">
          <div className="h-6 skeleton w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableRowSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="neo-flat rounded-xl p-5 flex justify-between items-center">
          <div className="space-y-2 flex-1">
            <div className="h-4 skeleton w-1/3" />
            <div className="h-3 skeleton w-1/4" />
          </div>
          <div className="h-8 w-20 skeleton rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="container mx-auto px-6 py-10 max-w-7xl">
      <div className="h-8 skeleton w-1/4 mb-8" />
      <div className="space-y-4">
        <div className="h-40 skeleton rounded-xl" />
        <div className="h-60 skeleton rounded-xl" />
      </div>
    </div>
  );
}

export function StatCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="neo rounded-xl p-5">
          <div className="h-3 skeleton w-1/2 mb-3" />
          <div className="h-8 skeleton w-2/3" />
        </div>
      ))}
    </div>
  );
}
