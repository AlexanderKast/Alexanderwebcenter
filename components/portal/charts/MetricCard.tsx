interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  trend?: number; // positive = up, negative = down
}

export function MetricCard({ label, value, sub, color = '#D4AF37', trend }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 space-y-1">
      <p className="text-[11px] uppercase tracking-wider text-white/40">{label}</p>
      <p className="text-2xl font-semibold" style={{ color }}>{value}</p>
      <div className="flex items-center gap-2">
        {sub && <p className="text-xs text-white/35">{sub}</p>}
        {trend !== undefined && trend !== 0 && (
          <span className={`text-[11px] font-medium ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
}
