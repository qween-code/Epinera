export default function CheckoutLoading() {
  return (
    <div className="container mx-auto px-6 py-10 max-w-3xl animate-fade-in">
      <div className="h-8 skeleton w-1/3 mb-8" />
      <div className="neo rounded-xl p-6 space-y-4">
        <div className="h-16 skeleton rounded-lg" />
        <div className="h-16 skeleton rounded-lg" />
        <div className="h-16 skeleton rounded-lg" />
        <div className="h-px bg-[var(--border-dim)] my-4" />
        <div className="h-12 skeleton rounded-xl" />
      </div>
    </div>
  );
}
