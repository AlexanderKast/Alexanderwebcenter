'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export function useRealtimeTable<T extends { id: string }>(
  table: string,
  clientId: string,
  initialData: T[],
): T[] {
  const [data, setData] = useState<T[]>(initialData);

  useEffect(() => { setData(initialData); }, [initialData]);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const channel = supabase
      .channel(`${table}_${clientId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter: `client_id=eq.${clientId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData((prev) => [payload.new as T, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setData((prev) =>
              prev.map((r) => (r.id === (payload.new as T).id ? (payload.new as T) : r)),
            );
          } else if (payload.eventType === 'DELETE') {
            setData((prev) => prev.filter((r) => r.id !== (payload.old as { id: string }).id));
          }
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [table, clientId]);

  return data;
}
