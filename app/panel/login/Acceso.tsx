'use client';

import { useActionState } from 'react';
import { accionEntrar, type EstadoAcceso } from './acciones';

const INICIAL: EstadoAcceso = { error: '' };

const CAJA =
  'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[15px] text-white outline-none transition-colors focus:border-white/30';

export default function Acceso() {
  const [estado, accion, pendiente] = useActionState(accionEntrar, INICIAL);

  return (
    <form
      action={accion}
      className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400">Panel</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Respuestas del formulario</h1>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm text-white/70">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
          className={CAJA}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="clave" className="text-sm text-white/70">
          Contraseña
        </label>
        <input
          id="clave"
          name="clave"
          type="password"
          autoComplete="current-password"
          required
          className={CAJA}
        />
      </div>

      {estado.error && (
        <p
          role="alert"
          className="rounded-xl border border-red-400/30 bg-red-400/5 px-4 py-2.5 text-sm text-red-200"
        >
          {estado.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pendiente}
        className="w-full rounded-xl bg-yellow-400 px-6 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
      >
        {pendiente ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
