'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  color?: string;
  onClick?: () => void;
}

interface CalendarGridProps {
  events: CalendarEvent[];
}

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  // 0=Sun → convert to Mon-based: Mon=0
  const d = new Date(year, month, 1).getDay();
  return (d + 6) % 7;
}

export function CalendarGrid({ events }: CalendarGridProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  function prev() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }
  function next() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const eventsByDay: Record<string, CalendarEvent[]> = {};
  for (const ev of events) {
    if (ev.date) {
      const key = ev.date.slice(0, 10);
      if (!eventsByDay[key]) eventsByDay[key] = [];
      eventsByDay[key].push(ev);
    }
  }

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">
          {MONTHS[month]} {year}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={prev}
            className="rounded-lg border border-white/10 p-1.5 text-white/50 hover:text-white hover:border-white/25 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="rounded-lg border border-white/10 p-1.5 text-white/50 hover:text-white hover:border-white/25 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-white/10">
          {DAYS.map((d) => (
            <div key={d} className="py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-white/30">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {Array.from({ length: totalCells }).map((_, i) => {
            const dayNum = i - firstDay + 1;
            const isValid = dayNum >= 1 && dayNum <= daysInMonth;
            const dayStr = isValid
              ? `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
              : '';
            const dayEvents = dayStr ? (eventsByDay[dayStr] ?? []) : [];
            const isToday = dayStr === todayStr;

            return (
              <div
                key={i}
                className={`min-h-[80px] border-b border-r border-white/5 p-1.5 ${
                  !isValid ? 'bg-white/2' : ''
                } ${i % 7 === 6 ? 'border-r-0' : ''}`}
              >
                {isValid && (
                  <>
                    <span
                      className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-xs mb-1 ${
                        isToday
                          ? 'bg-[#D4AF37] text-black font-semibold'
                          : 'text-white/50'
                      }`}
                    >
                      {dayNum}
                    </span>
                    <div className="space-y-0.5">
                      {(expandedDay === dayStr ? dayEvents : dayEvents.slice(0, 3)).map((ev) => (
                        <button
                          key={ev.id}
                          onClick={ev.onClick}
                          className="w-full truncate rounded px-1.5 py-0.5 text-left text-[10px] font-medium transition-opacity hover:opacity-80"
                          style={{
                            backgroundColor: `${ev.color ?? '#D4AF37'}25`,
                            color: ev.color ?? '#D4AF37',
                            borderLeft: `2px solid ${ev.color ?? '#D4AF37'}`,
                          }}
                        >
                          {ev.title}
                        </button>
                      ))}
                      {dayEvents.length > 3 && (
                        <button
                          onClick={() => setExpandedDay(expandedDay === dayStr ? null : dayStr)}
                          className="text-[10px] text-white/35 pl-1 hover:text-[#D4AF37]/60 transition-colors"
                        >
                          {expandedDay === dayStr ? 'Ver menos' : `+${dayEvents.length - 3} más`}
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
