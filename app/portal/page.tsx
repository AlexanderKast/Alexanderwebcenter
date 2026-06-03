import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase/server';
import { createSupabaseServiceRole } from '@/lib/supabase/server';

export default async function PortalIndexPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/portal/login');
  }

  // Buscar el cliente asociado a este usuario
  const service = createSupabaseServiceRole();
  const { data: clientUser } = await service
    .from('portal_client_users')
    .select('client_id, portal_clients(slug)')
    .eq('auth_user_id', user.id)
    .eq('activo', true)
    .single();

  if (!clientUser) {
    // Usuario autenticado pero sin cliente asignado
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-center">
        <div>
          <p className="text-white/50 text-sm">
            Tu cuenta aún no tiene un tablero asignado.
          </p>
          <p className="text-white/30 text-xs mt-2">
            Contacta a Alexander en{' '}
            <a href="mailto:founder@kreoon.com" className="text-[#D4AF37]/60 hover:text-[#D4AF37]">
              founder@kreoon.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  const portalClients = (clientUser as unknown as { portal_clients: { slug: string } | { slug: string }[] | null }).portal_clients;
  const slug = Array.isArray(portalClients) ? portalClients[0]?.slug : portalClients?.slug;
  if (slug) {
    redirect(`/portal/${slug}`);
  }

  redirect('/portal/login');
}
