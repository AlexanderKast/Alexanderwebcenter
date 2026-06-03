'use client';

import { useState } from 'react';
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

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onMoveItem: (itemId: string, newColumnId: string) => Promise<void>;
  canEdit: boolean;
  onCardClick?: (id: string) => void;
}

// ── Draggable Card ─────────────────────────────────────────────────────────────
function KanbanCard({ item, canEdit, isMoving, onCardClick }: {
  item: KanbanItem; canEdit: boolean; isMoving: boolean; onCardClick?: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    disabled: !canEdit,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(canEdit ? { ...attributes, ...listeners } : {})}
      onClick={() => !isDragging && onCardClick?.(item.id)}
      className={`rounded-xl border bg-white/5 p-3 transition-all select-none
        ${canEdit ? 'cursor-grab active:cursor-grabbing' : onCardClick ? 'cursor-pointer' : ''}
        ${isDragging ? 'opacity-30 scale-95' : 'hover:border-[#D4AF37]/30 hover:bg-white/8'}
        ${isMoving ? 'opacity-50' : ''}
        border-white/10`}
    >
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
function KanbanColumnComponent({ col, isOver, moving, canEdit, onCardClick }: {
  col: KanbanColumn; isOver: boolean; moving: string | null; canEdit: boolean;
  onCardClick?: (id: string) => void;
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
export function KanbanBoard({ columns, onMoveItem, canEdit, onCardClick }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);
  const [moving, setMoving] = useState<string | null>(null);

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
