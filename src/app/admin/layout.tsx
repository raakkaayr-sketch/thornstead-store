import type { Metadata } from 'next';
import { AdminShell } from '@/components/admin/admin-shell';
import { isAdminAuthenticated } from '@/lib/admin-session';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Verwaltung',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return (
      <div className="flex min-h-screen items-center bg-muted/40 px-4 py-12">
        {children}
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
