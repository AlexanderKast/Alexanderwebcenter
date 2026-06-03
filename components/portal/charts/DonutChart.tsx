interface Segment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: Segment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string | number;
}

export function DonutChart({
  segments,
  size = 120,
  strokeWidth = 16,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  const total = segments.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-xs text-white/25">Sin datos</span>
      </div>
    );
  }

  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const arcs = segments.map((seg) => {
    const pct = seg.value / total;
    const arc = {
      dash: pct * circumference,
      gap: circumference - pct * circumference,
      rotation: offset * 360 - 90,
      ...seg,
    };
    offset += pct;
    return arc;
  });

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          {arcs.map((arc, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={arc.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${arc.dash} ${arc.gap}`}
              strokeDashoffset={0}
              transform={`rotate(${arc.rotation} ${cx} ${cy})`}
              style={{ opacity: 0.85 }}
            />
          ))}
        </svg>
        {(centerValue !== undefined || centerLabel) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue !== undefined && (
              <span className="text-base font-semibold text-white">{centerValue}</span>
            )}
            {centerLabel && <span className="text-[9px] text-white/35 uppercase">{centerLabel}</span>}
          </div>
        )}
      </div>
      <div className="space-y-1.5 min-w-0">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-[11px] text-white/50 truncate">{seg.label}</span>
            <span className="text-[11px] text-white/70 ml-auto pl-2">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
