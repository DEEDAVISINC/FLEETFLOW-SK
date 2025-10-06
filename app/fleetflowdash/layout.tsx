'use client';

export default function FleetFlowDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh' }}>
      <main style={{ paddingTop: '64px' }}>{children}</main>
    </div>
  );
}
