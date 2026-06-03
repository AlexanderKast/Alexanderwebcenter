'use client';

export function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = pct >= 100 ? 'bg-emerald-500' : pct >= 60 ? 'bg-yellow-400' : 'bg-[#D4AF37]';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-white/10">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right text-[11px] text-white/50">{value}%</span>
    </div>
  );
}
