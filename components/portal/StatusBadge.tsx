'use client';

const colors: Record<string, string> = {
  // estados genéricos
  Activa: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Activo: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Listo: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Publicado: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'En curso': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  Programado: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  'En producción': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  'Inscripción abierta': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  Borrador: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
  Idea: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
  Pendiente: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
  'Sin empezar': 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
  'Sin Activar': 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
  Planificación: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Por renovar': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Pausada: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Suspendida: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Finalizada: 'bg-zinc-600/20 text-zinc-400 border-zinc-600/30',
  Cancelado: 'bg-red-500/15 text-red-400 border-red-500/30',
  Cerrada: 'bg-red-500/15 text-red-400 border-red-500/30',
  // prioridades
  Alta: 'bg-red-500/15 text-red-400 border-red-500/30',
  Media: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  Baja: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
};

export function StatusBadge({ value }: { value: string }) {
  const cls = colors[value] ?? 'bg-zinc-700/30 text-zinc-400 border-zinc-600/30';
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${cls}`}>
      {value}
    </span>
  );
}
