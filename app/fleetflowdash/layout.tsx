'use client';

import ProfessionalNavigation from '../components/Navigation';

export default function FleetFlowDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProfessionalNavigation />
      {children}
    </>
  );
}

