'use client';

import { usePathname } from 'next/navigation';
import ClientLayout from './ClientLayout';

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const pathname = usePathname();
  
  // ONLY bypass ClientLayout for homepage - keep it for all other pages
  if (pathname === '/') {
    console.log('🏠 HOMEPAGE: Bypassing ClientLayout to avoid auth interference');
    return <>{children}</>;
  }
  
  // All other pages use normal ClientLayout with full functionality
  console.log(`📄 PAGE ${pathname}: Using ClientLayout with authentication and navigation`);
  return <ClientLayout>{children}</ClientLayout>;
}
