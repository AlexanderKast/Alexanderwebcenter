import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/Header";

export const metadata: Metadata = {
  title: "Admin · Alexander Cast",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-[color:var(--background)]">
      {user ? (
        <div className="flex min-h-screen">
          <AdminSidebar user={user} />
          <div className="flex flex-1 flex-col">
            <AdminHeader user={user} />
            <main className="flex-1 bg-[color:var(--surface-0)] p-6 md:p-10">{children}</main>
          </div>
        </div>
      ) : (
        <main className="min-h-screen">{children}</main>
      )}
    </div>
  );
}
