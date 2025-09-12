'use client';

import { usePathname } from 'next/navigation';
import ClientLayout from './ClientLayout';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();

  // For root page, render children directly without ClientLayout
  if (pathname === '/') {
    return <>{children}</>;
  }

  // For all other pages, use ClientLayout
  return <ClientLayout>{children}</ClientLayout>;
}
