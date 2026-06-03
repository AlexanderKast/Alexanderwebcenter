'use server';

import { createSupabaseServer, createSupabaseServiceRole } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type {
  PortalClient,
  Campaign,
  Project,
  Objective,
  PortalEvent,
  SocialPost,
  EditorialItem,
  AdAccount,
  Tool,
  PortalTask,
  ClientDashboardData,
  PortalFieldDef,
  EntityType,
  FieldType,
} from './types';

const sb = () => createSupabaseServiceRole();

// Verifica sesión activa (admin O cliente portal). Retorna el user.id.
// requireAuth() de lib/auth.ts requiere admin_users — no usar para reads del portal.
async function requireAnyAuth(): Promise<string> {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/portal/login');
  return user.id;
}

// Verifica que el usuario es admin O es miembro editor activo del clientId específico.
// Usar en acciones de escritura que reciben clientId como parámetro (previene IDOR).
async function requireClientAccess(clientId: string): Promise<void> {
  const userId = await requireAnyAuth();
  const [adminRow, memberRow] = await Promise.all([
    sb().from('admin_users').select('id').eq('auth_user_id', userId).eq('is_active', true).maybeSingle(),
    sb().from('portal_client_users').select('id, rol')
      .eq('auth_user_id', userId).eq('client_id', clientId).eq('activo', true).maybeSingle(),
  ]);
  const isAdmin = !!adminRow.data;
  const isEditor = !!(memberRow.data && (memberRow.data as { rol: string }).rol === 'editor');
  if (!isAdmin && !isEditor) redirect('/portal/login');
}

// ── Clients ──────────────────────────────────────────────────

export async function getClients(): Promise<PortalClient[]> {
  await requireAuth();
  const { data } = await sb()
    .from('portal_clients')
    .select('*')
    .order('nombre');
  return (data ?? []) as PortalClient[];
}

// Solo columnas no-PII — safe para llamar desde generateMetadata (sin auth).
// Campos sensibles (contacto_email, notas, etc.) no se exponen aquí.
export async function getClientBySlug(slug: string): Promise<Pick<PortalClient, 'id' | 'nombre' | 'slug' | 'logo_url' | 'activo'> | null> {
  const { data } = await sb()
    .from('portal_clients')
    .select('id, nombre, slug, logo_url, activo')
    .eq('slug', slug)
    .single();
  return data as Pick<PortalClient, 'id' | 'nombre' | 'slug' | 'logo_url' | 'activo'> | null;
}

export async function getClientById(id: string): Promise<PortalClient | null> {
  await requireAuth();
  const { data } = await sb()
    .from('portal_clients')
    .select('*')
    .eq('id', id)
    .single();
  return data as PortalClient | null;
}

export async function createClient(input: {
  nombre: string;
  slug: string;
  industria?: string;
  contacto_email?: string;
  contacto_nombre?: string;
  notas?: string;
}): Promise<{ id: string } | { error: string }> {
  await requireAuth(); // admin only
  const { data, error } = await sb()
    .from('portal_clients')
    .insert(input)
    .select('id')
    .single();
  if (error) return { error: error.message };
  revalidatePath('/admin/clientes');
  return { id: data.id as string };
}

export async function updateClient(
  id: string,
  input: Partial<Omit<PortalClient, 'id' | 'created_at' | 'updated_at'>>,
): Promise<{ error?: string }> {
  await requireAuth(); // admin only
  const { error } = await sb()
    .from('portal_clients')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/clientes');
  revalidatePath(`/admin/clientes/${id}`);
  return {};
}

export async function deleteClient(id: string): Promise<{ error?: string }> {
  await requireAuth(); // admin only
  const { error } = await sb().from('portal_clients').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/clientes');
  return {};
}

// ── Dashboard data (all tables for one client) ────────────────
export async function getClientDashboardData(clientId: string): Promise<ClientDashboardData> {
  const userId = await requireAnyAuth();

  // Verificar que el usuario es admin O tiene acceso a este cliente específico.
  const [adminRow, memberRow] = await Promise.all([
    sb().from('admin_users').select('id').eq('auth_user_id', userId).eq('is_active', true).maybeSingle(),
    sb().from('portal_client_users').select('id').eq('auth_user_id', userId).eq('client_id', clientId).eq('activo', true).maybeSingle(),
  ]);
  if (!adminRow.data && !memberRow.data) redirect('/portal/login');

  const [client, campaigns, projects, objectives, events, social_posts, editorial, ad_accounts, tools, tasks, field_defs] =
    await Promise.all([
      sb().from('portal_clients').select('*').eq('id', clientId).single(),
      sb().from('portal_campaigns').select('*').eq('client_id', clientId).order('created_at', { ascending: false }),
      sb().from('portal_projects').select('*').eq('client_id', clientId).order('created_at', { ascending: false }),
      sb().from('portal_objectives').select('*').eq('client_id', clientId).order('created_at', { ascending: false }),
      sb().from('portal_events').select('*').eq('client_id', clientId).order('fecha_evento', { ascending: true }),
      sb().from('portal_social_posts').select('*').eq('client_id', clientId).order('fecha_publicacion', { ascending: true }),
      sb().from('portal_editorial').select('*').eq('client_id', clientId).order('fecha', { ascending: true }),
      sb().from('portal_ad_accounts').select('*').eq('client_id', clientId).order('nombre'),
      sb().from('portal_tools').select('*').eq('client_id', clientId).order('nombre'),
      sb().from('portal_tasks').select('*').eq('client_id', clientId).order('created_at', { ascending: false }),
      sb().from('portal_field_defs').select('*').eq('client_id', clientId).order('position'),
    ]);

  return {
    client: client.data as PortalClient,
    campaigns: (campaigns.data ?? []) as Campaign[],
    projects: (projects.data ?? []) as Project[],
    objectives: (objectives.data ?? []) as Objective[],
    events: (events.data ?? []) as PortalEvent[],
    social_posts: (social_posts.data ?? []) as SocialPost[],
    editorial: (editorial.data ?? []) as EditorialItem[],
    ad_accounts: (ad_accounts.data ?? []) as AdAccount[],
    tools: (tools.data ?? []) as Tool[],
    tasks: (tasks.data ?? []) as PortalTask[],
    field_defs: (field_defs.data ?? []) as PortalFieldDef[],
  };
}

// ── Campaigns ────────────────────────────────────────────────

export async function createCampaign(
  clientId: string,
  input: Partial<Omit<Campaign, 'id' | 'client_id' | 'created_at' | 'updated_at'>>,
): Promise<{ id: string } | { error: string }> {
  await requireAuth();
  const { data, error } = await sb()
    .from('portal_campaigns')
    .insert({ ...input, client_id: clientId })
    .select('id')
    .single();
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return { id: data.id as string };
}

export async function updateCampaign(
  id: string,
  clientId: string,
  input: Partial<Campaign>,
): Promise<{ error?: string }> {
  await requireAuth();
  const { error } = await sb()
    .from('portal_campaigns')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('client_id', clientId); // prevent cross-tenant mutation
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return {};
}

export async function deleteCampaign(id: string, clientId: string): Promise<{ error?: string }> {
  await requireAuth();
  const { error } = await sb()
    .from('portal_campaigns')
    .delete()
    .eq('id', id)
    .eq('client_id', clientId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return {};
}

// ── Projects ─────────────────────────────────────────────────

export async function createProject(
  clientId: string,
  input: Partial<Omit<Project, 'id' | 'client_id' | 'created_at' | 'updated_at'>>,
): Promise<{ id: string } | { error: string }> {
  await requireAuth();
  const { data, error } = await sb()
    .from('portal_projects')
    .insert({ ...input, client_id: clientId })
    .select('id')
    .single();
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return { id: data.id as string };
}

export async function updateProject(
  id: string,
  clientId: string,
  input: Partial<Project>,
): Promise<{ error?: string }> {
  await requireAuth();
  const { error } = await sb()
    .from('portal_projects')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('client_id', clientId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return {};
}

export async function deleteProject(id: string, clientId: string): Promise<{ error?: string }> {
  await requireAuth();
  const { error } = await sb()
    .from('portal_projects')
    .delete()
    .eq('id', id)
    .eq('client_id', clientId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return {};
}

// ── Objectives ───────────────────────────────────────────────

export async function createObjective(
  clientId: string,
  input: Partial<Omit<Objective, 'id' | 'client_id' | 'created_at' | 'updated_at'>>,
): Promise<{ id: string } | { error: string }> {
  await requireAuth();
  const { data, error } = await sb()
    .from('portal_objectives')
    .insert({ ...input, client_id: clientId })
    .select('id')
    .single();
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return { id: data.id as string };
}

export async function updateObjective(
  id: string,
  clientId: string,
  input: Partial<Objective>,
): Promise<{ error?: string }> {
  await requireAuth();
  const { error } = await sb()
    .from('portal_objectives')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('client_id', clientId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return {};
}

export async function deleteObjective(id: string, clientId: string): Promise<{ error?: string }> {
  await requireAuth();
  const { error } = await sb()
    .from('portal_objectives')
    .delete()
    .eq('id', id)
    .eq('client_id', clientId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return {};
}

// ── Events ───────────────────────────────────────────────────

export async function createEvent(
  clientId: string,
  input: Partial<Omit<PortalEvent, 'id' | 'client_id' | 'created_at' | 'updated_at'>>,
): Promise<{ id: string } | { error: string }> {
  await requireAuth();
  const { data, error } = await sb()
    .from('portal_events')
    .insert({ ...input, client_id: clientId })
    .select('id')
    .single();
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return { id: data.id as string };
}

export async function updateEvent(
  id: string,
  clientId: string,
  input: Partial<PortalEvent>,
): Promise<{ error?: string }> {
  await requireAuth();
  const { error } = await sb()
    .from('portal_events')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('client_id', clientId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return {};
}

export async function deleteEvent(id: string, clientId: string): Promise<{ error?: string }> {
  await requireAuth();
  const { error } = await sb()
    .from('portal_events')
    .delete()
    .eq('id', id)
    .eq('client_id', clientId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return {};
}

// ── Social posts ─────────────────────────────────────────────

export async function createSocialPost(
  clientId: string,
  input: Partial<Omit<SocialPost, 'id' | 'client_id' | 'created_at' | 'updated_at'>>,
): Promise<{ id: string } | { error: string }> {
  await requireAuth();
  const { data, error } = await sb()
    .from('portal_social_posts')
    .insert({ ...input, client_id: clientId })
    .select('id')
    .single();
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return { id: data.id as string };
}

export async function updateSocialPost(
  id: string,
  clientId: string,
  input: Partial<SocialPost>,
): Promise<{ error?: string }> {
  await requireAuth();
  const { error } = await sb()
    .from('portal_social_posts')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('client_id', clientId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return {};
}

export async function deleteSocialPost(id: string, clientId: string): Promise<{ error?: string }> {
  await requireAuth();
  const { error } = await sb()
    .from('portal_social_posts')
    .delete()
    .eq('id', id)
    .eq('client_id', clientId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return {};
}

// ── Editorial ────────────────────────────────────────────────

export async function createEditorialItem(
  clientId: string,
  input: Partial<Omit<EditorialItem, 'id' | 'client_id' | 'created_at' | 'updated_at'>>,
): Promise<{ id: string } | { error: string }> {
  await requireAuth();
  const { data, error } = await sb()
    .from('portal_editorial')
    .insert({ ...input, client_id: clientId })
    .select('id')
    .single();
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return { id: data.id as string };
}

export async function updateEditorialItem(
  id: string,
  clientId: string,
  input: Partial<EditorialItem>,
): Promise<{ error?: string }> {
  await requireAuth();
  const { error } = await sb()
    .from('portal_editorial')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('client_id', clientId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return {};
}

export async function deleteEditorialItem(id: string, clientId: string): Promise<{ error?: string }> {
  await requireAuth();
  const { error } = await sb()
    .from('portal_editorial')
    .delete()
    .eq('id', id)
    .eq('client_id', clientId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return {};
}

// ── Ad Accounts ──────────────────────────────────────────────

export async function createAdAccount(
  clientId: string,
  input: Partial<Omit<AdAccount, 'id' | 'client_id' | 'created_at' | 'updated_at'>>,
): Promise<{ id: string } | { error: string }> {
  await requireAuth();
  const { data, error } = await sb()
    .from('portal_ad_accounts')
    .insert({ ...input, client_id: clientId })
    .select('id')
    .single();
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return { id: data.id as string };
}

export async function updateAdAccount(
  id: string,
  clientId: string,
  input: Partial<AdAccount>,
): Promise<{ error?: string }> {
  await requireAuth();
  const { error } = await sb()
    .from('portal_ad_accounts')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('client_id', clientId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return {};
}

export async function deleteAdAccount(id: string, clientId: string): Promise<{ error?: string }> {
  await requireAuth();
  const { error } = await sb()
    .from('portal_ad_accounts')
    .delete()
    .eq('id', id)
    .eq('client_id', clientId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return {};
}

// ── Tools ────────────────────────────────────────────────────

export async function createTool(
  clientId: string,
  input: Partial<Omit<Tool, 'id' | 'client_id' | 'created_at' | 'updated_at'>>,
): Promise<{ id: string } | { error: string }> {
  await requireAuth();
  const { data, error } = await sb()
    .from('portal_tools')
    .insert({ ...input, client_id: clientId })
    .select('id')
    .single();
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return { id: data.id as string };
}

export async function updateTool(
  id: string,
  clientId: string,
  input: Partial<Tool>,
): Promise<{ error?: string }> {
  await requireAuth();
  const { error } = await sb()
    .from('portal_tools')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('client_id', clientId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return {};
}

export async function deleteTool(id: string, clientId: string): Promise<{ error?: string }> {
  await requireAuth();
  const { error } = await sb()
    .from('portal_tools')
    .delete()
    .eq('id', id)
    .eq('client_id', clientId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return {};
}

// ── Portal client auth helpers ────────────────────────────────

export async function createClientUser(input: {
  auth_user_id: string;
  client_id: string;
  email: string;
  nombre?: string;
  rol?: 'viewer' | 'editor';
}): Promise<{ error?: string }> {
  await requireAuth(); // admin only — requireAuth ya verifica admin_users
  const { error } = await sb().from('portal_client_users').insert(input);
  if (error) return { error: error.message };
  return {};
}

export async function getClientUsers(clientId: string) {
  await requireAuth();
  const { data } = await sb()
    .from('portal_client_users')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at');
  return data ?? [];
}

// ── Tasks ────────────────────────────────────────────────────

export async function createTask(
  clientId: string,
  input: Partial<Omit<PortalTask, 'id' | 'client_id' | 'created_at' | 'updated_at'>>,
): Promise<{ id: string } | { error: string }> {
  await requireClientAccess(clientId);
  const { data, error } = await sb()
    .from('portal_tasks')
    .insert({ ...input, client_id: clientId })
    .select('id')
    .single();
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return { id: data.id as string };
}

export async function updateTask(
  id: string,
  clientId: string,
  input: Partial<PortalTask>,
): Promise<{ error?: string }> {
  await requireClientAccess(clientId);
  const { error } = await sb()
    .from('portal_tasks')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('client_id', clientId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return {};
}

export async function deleteTask(id: string, clientId: string): Promise<{ error?: string }> {
  await requireClientAccess(clientId);
  const { error } = await sb()
    .from('portal_tasks')
    .delete()
    .eq('id', id)
    .eq('client_id', clientId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return {};
}

// ── Field Defs ───────────────────────────────────────────────

export async function createFieldDef(
  clientId: string,
  input: { name: string; entity_type: EntityType; field_type: FieldType; options?: string[]; position?: number },
): Promise<{ id: string } | { error: string }> {
  await requireClientAccess(clientId);
  const { data, error } = await sb()
    .from('portal_field_defs')
    .insert({ ...input, client_id: clientId, options: input.options ?? [] })
    .select('id')
    .single();
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return { id: data.id as string };
}

export async function updateFieldDef(
  id: string,
  clientId: string,
  input: Partial<Pick<PortalFieldDef, 'name' | 'field_type' | 'options' | 'position'>>,
): Promise<{ error?: string }> {
  await requireClientAccess(clientId);
  const { error } = await sb()
    .from('portal_field_defs')
    .update(input)
    .eq('id', id)
    .eq('client_id', clientId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return {};
}

export async function deleteFieldDef(id: string, clientId: string): Promise<{ error?: string }> {
  await requireClientAccess(clientId);
  const { error } = await sb()
    .from('portal_field_defs')
    .delete()
    .eq('id', id)
    .eq('client_id', clientId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clientes/${clientId}`);
  return {};
}
