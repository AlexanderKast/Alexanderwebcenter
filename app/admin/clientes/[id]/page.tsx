import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireAuth } from '@/lib/auth';
import { getClientDashboardData } from '@/lib/portal/actions';
import { ClientDashboard } from '@/components/portal/ClientDashboard';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  try {
    const data = await getClientDashboardData(id);
    return { title: `${data.client.nombre} · Clientes · Admin` };
  } catch {
    return { title: 'Cliente · Admin' };
  }
}

export default async function AdminClientePage({ params }: Props) {
  await requireAuth();
  const { id } = await params;

  let data;
  try {
    data = await getClientDashboardData(id);
  } catch {
    notFound();
  }

  if (!data?.client) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/clientes"
          className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Todos los clientes
        </Link>
      </div>

      <ClientDashboard data={data} canEdit={true} />
    </div>
  );
}
