'use client';

import { useEffect, useState } from 'react';

interface SafeOrganizationSwitcherProps {
  fallback?: React.ReactNode;
}

export default function SafeOrganizationSwitcher({ fallback }: SafeOrganizationSwitcherProps) {
  const [OrganizationSwitcher, setOrganizationSwitcher] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrganizationSwitcher = async () => {
      try {
        const { default: OrgSwitcher } = await import('./OrganizationSwitcher');
        setOrganizationSwitcher(() => OrgSwitcher);
      } catch (err: any) {
        console.warn('OrganizationSwitcher failed to load:', err?.message || err);
        setError(err?.message || 'Failed to load organization switcher');
      }
    };

    loadOrganizationSwitcher();
  }, []);

  if (error || !OrganizationSwitcher) {
    return fallback || (
      <div style={{
        padding: '8px 12px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '6px',
        color: 'white',
        fontSize: '14px'
      }}>
        FleetFlow
      </div>
    );
  }

  try {
    return <OrganizationSwitcher />;
  } catch (err: any) {
    console.warn('OrganizationSwitcher render error:', err?.message || err);
    return fallback || (
      <div style={{
        padding: '8px 12px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '6px',
        color: 'white',
        fontSize: '14px'
      }}>
        FleetFlow
      </div>
    );
  }
}
