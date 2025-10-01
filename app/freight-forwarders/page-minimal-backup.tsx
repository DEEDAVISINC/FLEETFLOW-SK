'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FreightForwarderDashboardGuide from '../components/FreightForwarderDashboardGuide';
import ShipmentConsolidationDashboard from '../components/ShipmentConsolidationDashboard';

export default function FreightForwardersPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('dashboard');

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '30px', paddingTop: '100px', color: 'white' }}>
      <FreightForwarderDashboardGuide onStepClick={setSelectedTab} />
      <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>🚢 Freight Forwarding Center</h1>
        <ShipmentConsolidationDashboard />
      </div>
    </div>
  );
}
