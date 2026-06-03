'use client';

interface View {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface ViewSwitcherProps {
  views: View[];
  active: string;
  onChange: (id: string) => void;
}

export function ViewSwitcher({ views, active, onChange }: ViewSwitcherProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
      {views.map((v) => (
        <button
          key={v.id}
          onClick={() => onChange(v.id)}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            active === v.id
              ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/25'
              : 'text-white/40 hover:text-white/70 border border-transparent'
          }`}
        >
          {v.icon}
          {v.label}
        </button>
      ))}
    </div>
  );
}
