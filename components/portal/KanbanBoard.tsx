'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Lock } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';

export interface KanbanItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  progress?: number;
  priority?: string;
  priorityColor?: string;
  meta?: string[];
}

export interface KanbanColumn {
  id: string;
  label: string;
  color: string;
  items: KanbanItem[];
}

/** Lo que se esta haciendo sobre una tarjeta, para pintarlo encima. */
export interface MarcaEnVivo {
  texto: string;
  estado: "trabajando" | "listo" | "error";
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onMoveItem: (itemId: string, newColumnId: string) => Promise<void>;
  canEdit: boolean;
  onCardClick?: (id: string) => void;
  /**
   * Quien mas esta tocando esta tarjeta ahora mismo. Se pinta sobre la
   * tarjeta y no en una esquina: "algo se movio" no sirve si hay que buscar
   * cual.
   */
  marcaDe?: (itemId: string) => MarcaEnVivo | null;
}

// ── Draggable Card ─────────────────────────────────────────────────────────────
function KanbanCard({ item, canEdit, isMoving, onCardClick, marca, registrar }: {
  item: KanbanItem; canEdit: boolean; isMoving: boolean; onCardClick?: (id: string) => void;
  marca?: MarcaEnVivo | null;
  registrar?: (id: string, el: HTMLElement | null) => void;
}) {
  // Mientras otro la esta moviendo, esta tarjeta no se arrastra. Dos manos
  // sobre la misma tarjeta terminan en que una de las dos pierde su cambio
  // sin enterarse.
  const bloqueada = marca?.estado === 'trabajando';

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    disabled: !canEdit || bloqueada,
  });

  // El mismo nodo lo necesitan dos: dnd-kit para arrastrar y el tablero para
  // medir donde estaba la tarjeta antes de que la movieran.
  const ref = useCallback(
    (el: HTMLElement | null) => {
      setNodeRef(el);
      registrar?.(item.id, el);
    },
    [setNodeRef, registrar, item.id],
  );

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={ref}
      style={style}
      {...(canEdit && !bloqueada ? { ...attributes, ...listeners } : {})}
      onClick={() => !isDragging && !bloqueada && onCardClick?.(item.id)}
      className={`relative rounded-xl border bg-white/5 p-3 transition-all select-none
        ${bloqueada ? 'cursor-not-allowed' : canEdit ? 'cursor-grab active:cursor-grabbing' : onCardClick ? 'cursor-pointer' : ''}
        ${isDragging ? 'opacity-30 scale-95' : 'hover:border-[#D4AF37]/30 hover:bg-white/8'}
        ${isMoving ? 'opacity-50' : ''}
        ${marca
          ? 'border-[#D4AF37]/70 bg-[#D4AF37]/[0.06] ring-1 ring-[#D4AF37]/40'
          : 'border-white/10'}`}
    >
      {marca && (
        <div className="mb-2 flex items-center gap-1.5 rounded-md bg-[#D4AF37]/15 px-2 py-1">
          {bloqueada ? (
            <Lock className="h-3 w-3 shrink-0 text-[#D4AF37]" />
          ) : (
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                marca.estado === 'error' ? 'bg-red-400' : 'bg-emerald-400'
              }`}
            />
          )}
          <span className="truncate text-[10px] font-medium uppercase tracking-wide text-[#D4AF37]">
            {marca.texto}
          </span>
        </div>
      )}
      <div className="space-y-2">
        {/* Título + badge */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-white/90 leading-snug">{item.title}</p>
          {item.badge && (
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${item.badgeColor ?? 'bg-white/10 text-white/60'}`}>
              {item.badge}
            </span>
          )}
        </div>

        {/* Subtítulo (responsable, campaña, etc.) */}
        {item.subtitle && (
          <p className="text-xs text-white/45 truncate">{item.subtitle}</p>
        )}

        {/* Barra de progreso */}
        {item.progress !== undefined && (
          <div className="space-y-1">
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  item.progress >= 100 ? 'bg-green-500' : 'bg-[#D4AF37]'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, item.progress))}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags: prioridad + meta */}
        {((item.meta && item.meta.length > 0) || item.priority) && (
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            {item.priority && (
              <span className={`rounded-full border border-white/10 px-2 py-0.5 text-[10px] ${item.priorityColor ?? 'text-white/40'}`}>
                {item.priority}
              </span>
            )}
            {item.meta?.map((m, i) => (
              <span key={i} className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-white/40">
                {m}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Droppable Column ───────────────────────────────────────────────────────────
function KanbanColumnComponent({ col, isOver, moving, canEdit, onCardClick, marcaDe, registrar }: {
  col: KanbanColumn; isOver: boolean; moving: string | null; canEdit: boolean;
  onCardClick?: (id: string) => void;
  marcaDe?: (itemId: string) => MarcaEnVivo | null;
  registrar?: (id: string, el: HTMLElement | null) => void;
}) {
  const { setNodeRef } = useDroppable({ id: col.id });

  return (
    <div className={`flex-shrink-0 w-64 rounded-xl border-t-2 transition-all ${col.color}
      ${isOver ? 'bg-white/[0.06] ring-1 ring-[#D4AF37]/30' : 'bg-white/[0.03]'}`}>
      <div className="flex items-center justify-between px-3 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-white/60">
          {col.label}
        </span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/50">
          {col.items.length}
        </span>
      </div>

      {/* Zona droppable — toda el área de tarjetas */}
      <div ref={setNodeRef} className="space-y-2 p-2 min-h-[120px]">
        {col.items.map((item) => (
          <KanbanCard
            key={item.id}
            item={item}
            canEdit={canEdit}
            isMoving={moving === item.id}
            onCardClick={onCardClick}
            marca={marcaDe?.(item.id) ?? null}
            registrar={registrar}
          />
        ))}
        {col.items.length === 0 && (
          <div className={`flex h-20 items-center justify-center rounded-lg border border-dashed transition-colors
            ${isOver ? 'border-[#D4AF37]/40 bg-[#D4AF37]/5' : 'border-white/10'}`}>
            <span className={`text-xs transition-colors ${isOver ? 'text-[#D4AF37]/50' : 'text-white/25'}`}>
              {isOver ? 'Soltar aquí' : 'Vacío'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Board ──────────────────────────────────────────────────────────────────────
export function KanbanBoard({ columns, onMoveItem, canEdit, onCardClick, marcaDe }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);
  const [moving, setMoving] = useState<string | null>(null);

  /**
   * La tarjeta tiene que verse viajar de una columna a la otra.
   *
   * Cuando el tablero se vuelve a dibujar con la tarjeta en su columna
   * nueva, el navegador la pone ahi de una: para el que estaba mirando eso
   * es un salto, y un salto no se lee como "alguien la movio", se lee como
   * que la pantalla se rompio.
   *
   * Se mide donde estaba antes y donde quedo, se la devuelve a la posicion
   * vieja con un transform y se la suelta. Es la tecnica FLIP: la unica que
   * anima un cambio de lugar en el arbol sin que haya que mover nada a mano.
   */
  const posiciones = useRef(new Map<string, DOMRect>());
  const nodos = useRef(new Map<string, HTMLElement>());

  const registrar = useCallback((id: string, el: HTMLElement | null) => {
    if (el) nodos.current.set(id, el);
    else nodos.current.delete(id);
  }, []);

  useLayoutEffect(() => {
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    nodos.current.forEach((el, id) => {
      const ahora = el.getBoundingClientRect();
      const antes = posiciones.current.get(id);
      posiciones.current.set(id, ahora);

      if (!antes || quieto) return;

      const dx = antes.left - ahora.left;
      const dy = antes.top - ahora.top;
      // Un pixel de diferencia es el navegador redondeando, no un movimiento.
      if (Math.abs(dx) < 2 && Math.abs(dy) < 2) return;

      el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)` },
          { transform: 'translate(0, 0)' },
        ],
        { duration: 420, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
      );
    });
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const allItems = columns.flatMap((c) => c.items);
  const activeItem = activeId ? allItems.find((i) => i.id === activeId) : null;

  function findColumnForItem(itemId: string) {
    return columns.find((col) => col.items.some((i) => i.id === itemId));
  }

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function handleDragOver(e: DragOverEvent) {
    const col = e.over ? columns.find((c) => c.id === String(e.over!.id)) : null;
    setOverColumnId(col?.id ?? null);
  }

  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveId(null);
    setOverColumnId(null);
    if (!over) return;

    const fromCol = findColumnForItem(String(active.id));
    const toCol = columns.find((c) => c.id === String(over.id));

    if (!fromCol || !toCol || fromCol.id === toCol.id) return;

    setMoving(String(active.id));
    try {
      await onMoveItem(String(active.id), toCol.id);
    } finally {
      setMoving(null);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <KanbanColumnComponent
            key={col.id}
            col={col}
            isOver={overColumnId === col.id}
            moving={moving}
            canEdit={canEdit}
            onCardClick={onCardClick}
            marcaDe={marcaDe}
            registrar={registrar}
          />
        ))}
      </div>

      {/* Ghost flotante durante el arrastre */}
      <DragOverlay dropAnimation={null}>
        {activeItem && (
          <div className="w-64 rounded-xl border border-[#D4AF37]/40 bg-[#141414] p-3 shadow-2xl ring-1 ring-[#D4AF37]/20 rotate-1 opacity-95">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-white">{activeItem.title}</p>
              {activeItem.badge && (
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${activeItem.badgeColor ?? 'bg-white/10 text-white/60'}`}>
                  {activeItem.badge}
                </span>
              )}
            </div>
            {activeItem.subtitle && (
              <p className="text-xs text-white/45 mt-0.5">{activeItem.subtitle}</p>
            )}
            {activeItem.progress !== undefined && (
              <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#D4AF37]"
                  style={{ width: `${activeItem.progress}%` }}
                />
              </div>
            )}
            {((activeItem.meta && activeItem.meta.length > 0) || activeItem.priority) && (
              <div className="flex flex-wrap gap-1 mt-2">
                {activeItem.priority && (
                  <span className={`rounded-full border border-white/10 px-2 py-0.5 text-[10px] ${activeItem.priorityColor ?? 'text-white/40'}`}>
                    {activeItem.priority}
                  </span>
                )}
                {activeItem.meta?.map((m, i) => (
                  <span key={i} className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-white/40">{m}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
