export default function ProductLoading() {
  return (
    <div className="container mx-auto px-6 py-10 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="h-80 md:h-[420px] skeleton rounded-2xl" />
          <div>
            <div className="h-6 skeleton w-24 rounded-full mb-4" />
            <div className="h-10 skeleton w-3/4 mb-4" />
            <div className="h-4 skeleton w-full mb-2" />
            <div className="h-4 skeleton w-2/3 mb-8" />
            <div className="h-px bg-[var(--border-dim)] my-6" />
            <div className="space-y-3">
              <div className="h-20 skeleton rounded-xl" />
              <div className="h-20 skeleton rounded-xl" />
              <div className="h-20 skeleton rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
