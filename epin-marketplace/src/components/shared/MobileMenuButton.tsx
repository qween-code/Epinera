'use client';

interface MobileMenuButtonProps {
  onClick: () => void;
}

export default function MobileMenuButton({ onClick }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white"
      aria-label="Toggle menu"
    >
      <span className="material-symbols-outlined text-2xl">menu</span>
    </button>
  );
}

