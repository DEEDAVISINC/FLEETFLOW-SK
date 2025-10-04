'use client';

import dynamic from 'next/dynamic';

// Import Navigation dynamically to avoid SSR issues
const ProfessionalNavigation = dynamic(
  () => import('../components/Navigation'),
  { ssr: false }
);

export default function FleetFlowDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh' }}>
      <ProfessionalNavigation />
      <main style={{ paddingTop: '70px' }}>{children}</main>
    </div>
  );
}
