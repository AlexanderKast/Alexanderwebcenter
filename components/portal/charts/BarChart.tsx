interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  showValues?: boolean;
}

export function BarChart({ data, height = 120, showValues = true }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map((d, i) => {
          const pct = (d.value / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
              {showValues && d.value > 0 && (
                <span className="text-[9px] text-white/40">{d.value}</span>
              )}
              <div
                className="w-full rounded-t transition-all"
                style={{
                  height: `${Math.max(pct, 2)}%`,
                  backgroundColor: d.color ?? '#D4AF37',
                  opacity: 0.8,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[9px] text-white/35 truncate">
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}
