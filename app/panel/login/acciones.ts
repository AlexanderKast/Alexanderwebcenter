'use server';

import { redirect } from 'next/navigation';
import { clientePanel, correosPermitidos } from '@/lib/brief/panel-auth';

export interface EstadoAcceso {
  error: string;
}

/** Entrar al panel del brief. */
export async function accionEntrar(_previo: EstadoAcceso, datos: FormData): Promise<EstadoAcceso> {
  const email = String(datos.get('email') ?? '')
    .trim()
    .toLowerCase();
  const clave = String(datos.get('clave') ?? '');

  if (!email || !clave) return { error: 'Faltan datos.' };
  if (!correosPermitidos().includes(email)) {
    return { error: 'Ese correo no tiene acceso al panel.' };
  }

  const supabase = await clientePanel();
  const { error } = await supabase.auth.signInWithPassword({ email, password: clave });
  if (error) {
    return { error: 'Correo o contraseña incorrectos.' };
  }

  redirect('/panel');
}

export async function accionSalir(): Promise<void> {
  const supabase = await clientePanel();
  await supabase.auth.signOut();
  redirect('/panel/login');
}
