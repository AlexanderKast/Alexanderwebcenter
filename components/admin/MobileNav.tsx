"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { AdminUser } from "@/lib/auth";
import { seccionesVisibles, esRutaActiva } from "@/components/admin/nav-items";
import { cn } from "@/lib/utils";

/**
 * Navegacion del panel en movil. El sidebar es `hidden md:flex`, asi que sin
 * esto el admin en telefono quedaba sin ninguna forma de moverse entre
 * secciones: solo se veia la pagina en la que caias.
 */
export function AdminMobileNav({ user }: { user: AdminUser }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const visibles = seccionesVisibles(user);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Abrir menú del panel"
            className="md:hidden"
          >
            <Menu className="size-5" />
          </Button>
        }
      />
      <SheetContent
        side="left"
        className="w-[17rem] border-[color:var(--line)] bg-[color:var(--background)] p-0"
      >
        <SheetHeader className="border-b border-[color:var(--line)] px-5 py-4">
          <SheetTitle className="font-display text-base text-white">
            Alexander Cast
          </SheetTitle>
          <SheetDescription className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--gold-mid)]">
            Admin · {user.role}
          </SheetDescription>
        </SheetHeader>

        <nav
          className="flex-1 space-y-6 overflow-y-auto px-3 py-4"
          aria-label="Menú admin móvil"
        >
          {visibles.map((sec) => (
            <div key={sec.label}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                {sec.label}
              </p>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const active = esRutaActiva(item.href, pathname);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      // Cerrar aca y no en un efecto sobre pathname: el efecto
                      // provocaba un render extra en cada navegacion.
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-11 items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors",
                        active
                          ? "border-[color:var(--gold-mid)]/25 bg-[color:var(--gold-mid)]/10 text-[color:var(--gold-mid)]"
                          : "border-transparent text-white/80 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
