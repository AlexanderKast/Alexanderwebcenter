'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import { createSupabaseServiceRole } from '@/lib/supabase/server';
import { BRIEF_ESTADOS, type BriefEstado } from '@/types/brief';

/**
 * Acciones del panel sobre un brief. Ambas exigen sesion de admin y
 * validan la entrada antes de tocar la base.
 */

function esUuid(valor: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(valor);
}

export async function cambiarEstadoBrief(formData: FormData): Promise<void> {
  await requireAuth();

  const id = String(formData.get('id') ?? '');
  const estado = String(formData.get('estado') ?? '') as BriefEstado;

  if (!esUuid(id) || !BRIEF_ESTADOS.includes(estado)) return;

  const supabase = createSupabaseServiceRole();
  await supabase.from('brief_submissions').update({ estado }).eq('id', id);

  revalidatePath('/admin/briefs');
  revalidatePath(`/admin/briefs/${id}`);
}

export async function guardarNotasBrief(formData: FormData): Promise<void> {
  await requireAuth();

  const id = String(formData.get('id') ?? '');
  if (!esUuid(id)) return;

  const notas = String(formData.get('notas') ?? '').slice(0, 5000);

  const supabase = createSupabaseServiceRole();
  await supabase.from('brief_submissions').update({ notas }).eq('id', id);

  revalidatePath(`/admin/briefs/${id}`);
}
