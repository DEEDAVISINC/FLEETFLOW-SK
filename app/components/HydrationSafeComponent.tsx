'use client';

import { useEffect, useState } from 'react';

interface HydrationSafeComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function HydrationSafeComponent({
  children,
  fallback = null,
}: HydrationSafeComponentProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
