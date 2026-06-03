interface PropertyRowProps {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  vertical?: boolean;
  extra?: React.ReactNode;
}

export function PropertyRow({ label, icon, children, vertical = false, extra }: PropertyRowProps) {
  if (vertical) {
    return (
      <div className="py-2.5 border-b border-white/5">
        <div className="flex items-center gap-2 text-[11px] text-white/35 uppercase tracking-wider mb-1.5">
          {icon}
          <span>{label}</span>
        </div>
        <div>{children}</div>
      </div>
    );
  }

  return (
    <div className="group/row flex items-start gap-3 py-2 border-b border-white/5 hover:bg-white/[0.02] -mx-2 px-2 rounded transition-colors">
      <div className="flex items-center gap-1.5 w-40 flex-shrink-0 pt-0.5">
        {icon && <span className="text-white/30 flex-shrink-0">{icon}</span>}
        <span className="text-sm text-white/40 truncate">{label}</span>
        {extra}
      </div>
      <div className="flex-1 min-w-0 pt-0.5">{children}</div>
    </div>
  );
}
