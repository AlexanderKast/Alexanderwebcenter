'use client';

interface AISuggestionChipsProps {
  suggestions: string[];
  loading: boolean;
  onSelect: (text: string) => void;
}

export function AISuggestionChips({ suggestions, loading, onSelect }: AISuggestionChipsProps) {
  if (!loading && suggestions.length === 0) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-wrap gap-2">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-7 rounded-full bg-gray-800 animate-pulse"
                style={{ width: `${80 + i * 30}px` }}
              />
            ))
          : suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSelect(s)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-gray-400 border border-dashed border-yellow-400/30 hover:border-yellow-400/60 hover:text-yellow-300 transition-colors cursor-pointer"
              >
                <span className="text-yellow-400/60 text-[10px]">âœ¦</span>
                {s}
              </button>
            ))}
      </div>
      {!loading && suggestions.length > 0 && (
        <p className="text-[11px] text-gray-700">
          Ideas basadas en tus respuestas — edita libremente
        </p>
      )}
    </div>
  );
}

