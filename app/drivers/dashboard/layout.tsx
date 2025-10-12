'use client';

// Server component with dynamic rendering
export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh' }}>
      <main style={{ paddingTop: '120px' }}>{children}</main>
    </div>
  );
}
