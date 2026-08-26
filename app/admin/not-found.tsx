import Link from "next/link";
import { FileQuestion } from "lucide-react";

/** Sin esto, una ruta vieja del panel caia en el 404 pelado de Next. */
export default function AdminNotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-start gap-5 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-1)] p-8">
      <span className="grid size-11 place-items-center rounded-full bg-white/5 text-white/60">
        <FileQuestion className="size-5" aria-hidden />
      </span>
      <div className="space-y-2">
        <h1 className="font-display text-xl font-semibold text-white">
          Esta página del panel no existe
        </h1>
        <p className="text-sm text-white/70">
          El enlace puede haber cambiado de lugar. Volvé al tablero y buscala en
          el menú.
        </p>
      </div>
      <Link
        href="/admin"
        className="inline-flex min-h-11 items-center rounded-lg border border-[color:var(--gold-mid)]/40 bg-[color:var(--gold-mid)]/10 px-4 text-sm font-medium text-[color:var(--gold-mid)] transition-colors hover:bg-[color:var(--gold-mid)]/20"
      >
        Ir al tablero
      </Link>
    </div>
  );
}
