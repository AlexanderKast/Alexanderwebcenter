"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { navPrimary, ctaPrincipal } from "@/content/nav";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={
        <Button variant="ghost" size="icon" aria-label="Abrir menú" className="lg:hidden">
          <Menu className="size-5" />
        </Button>
      } />
      <SheetContent side="right" className="border-white/10 bg-background">
        <SheetHeader>
          <SheetTitle className="font-display text-lg">{site.name}</SheetTitle>
          <SheetDescription className="text-xs uppercase tracking-[0.2em] text-[color:var(--gold)]">
            {site.tagline}
          </SheetDescription>
        </SheetHeader>
        <nav
          className="mt-8 flex flex-col gap-1 px-4"
          aria-label="Navegación móvil"
        >
          {navPrimary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-base text-foreground/80 transition-colors hover:bg-white/5 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={ctaPrincipal.href}
            onClick={() => setOpen(false)}
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-6 bg-[color:var(--gold)] text-[color:var(--brand)] hover:bg-[color:var(--gold-soft)]",
            )}
          >
            {ctaPrincipal.label}
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
