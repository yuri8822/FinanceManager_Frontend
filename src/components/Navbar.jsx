import { TrendingUp } from 'lucide-react';

export default function Navbar() {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <nav className="sticky top-0 z-10 border-b border-white/[0.06] bg-[#080a0f]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <TrendingUp size={16} className="text-white" />
          </div>
          <span className="font-semibold text-white tracking-tight">FinanceManager</span>
        </div>
        <span className="text-xs text-gray-600 hidden sm:block">{dateStr}</span>
      </div>
    </nav>
  );
}
