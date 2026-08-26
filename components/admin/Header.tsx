"use client";

import Link from "next/link";
import { LogOut, ExternalLink } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import type { AdminUser } from "@/lib/auth";
import { AdminMobileNav } from "@/components/admin/MobileNav";

export function AdminHeader({ user }: { user: AdminUser }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b border-[color:var(--line)] bg-[color:var(--background)]/80 px-4 backdrop-blur md:px-8">
      <div className="flex min-w-0 items-center gap-2">
        <AdminMobileNav user={user} />
        <p className="truncate text-xs uppercase tracking-[0.22em] text-white/65">
          Hola, <span className="text-[color:var(--gold-mid)]">{user.fullName?.split(" ")[0] ?? "admin"}</span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--line)] px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-[color:var(--gold-mid)]/40 hover:text-white"
        >
          Ver sitio <ExternalLink className="size-3" aria-hidden />
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--line)] px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-red-500/40 hover:text-red-300"
        >
          <LogOut className="size-3" aria-hidden />
          Salir
        </button>
      </div>
    </header>
  );
}
