// ============================================================================
// FLEETFLOW CRM PAGE - TENANT-AWARE CRM SYSTEM
// ============================================================================

'use client';

import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CRMDashboard from '../components/CRMDashboard';

export default function CRMPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [tenantId, setTenantId] = useState<string>('');
  const [action, setAction] = useState<string>('');
  const [leadId, setLeadId] = useState<string>('');

  useEffect(() => {
    // Get tenant context from session (user's organization)
    if (session?.user?.organizationId) {
      setTenantId(session.user.organizationId);
      console.log(
        '🏢 CRM: Using organization from session:',
        session.user.organizationId
      );
    } else {
      // Fallback for demo/development
      setTenantId('org-depointe-001');
      console.log('⚠️ CRM: No organization in session, using fallback');
    }

    // Get action and lead ID from URL params
    const urlAction = searchParams.get('action');
    const urlLeadId = searchParams.get('id');

    if (urlAction) setAction(urlAction);
    if (urlLeadId) setLeadId(urlLeadId);
  }, [session, searchParams]);

  if (!tenantId) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='text-gray-600'>Loading CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <CRMDashboard tenantId={tenantId} action={action} leadId={leadId} />
    </div>
  );
}
