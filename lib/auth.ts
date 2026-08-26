import { redirect } from "next/navigation";
import {
  createSupabaseServer,
  createSupabaseServiceRole,
} from "@/lib/supabase/server";

export type Role =
  | "founder"
  | "manager"
  | "coordinator"
  | "sales"
  | "creative"
  | "tester";

export interface AdminUser {
  id: string;
  authUserId: string;
  email: string;
  fullName: string | null;
  role: Role;
  isActive: boolean;
}

export async function getCurrentUser(): Promise<AdminUser | null> {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createSupabaseServiceRole();
  const { data: member } = await admin
    .from("admin_users")
    .select("id, auth_user_id, email, full_name, role, is_active")
    .eq("auth_user_id", user.id)
    .single();

  if (!member || !member.is_active) return null;
  return {
    id: member.id as string,
    authUserId: member.auth_user_id as string,
    email: member.email as string,
    fullName: member.full_name as string | null,
    role: member.role as Role,
    isActive: member.is_active as boolean,
  };
}

export async function requireAuth(): Promise<AdminUser> {
  const supabase = await createSupabaseServer();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/admin/login");

  const admin = createSupabaseServiceRole();
  const { data: member } = await admin
    .from("admin_users")
    .select("id, auth_user_id, email, full_name, role, is_active")
    .eq("auth_user_id", authUser.id)
    .single();

  if (!member || !member.is_active) redirect("/admin/sin-acceso");

  return {
    id: member.id as string,
    authUserId: member.auth_user_id as string,
    email: member.email as string,
    fullName: member.full_name as string | null,
    role: member.role as Role,
    isActive: member.is_active as boolean,
  };
}

export async function requireRole(roles: Role[]): Promise<AdminUser> {
  const user = await requireAuth();
  if (!roles.includes(user.role)) redirect("/admin");
  return user;
}

export function hasRole(user: AdminUser | null, roles: Role[]): boolean {
  return !!user && roles.includes(user.role);
}
