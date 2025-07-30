'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface VendorSession {
  shipperId: string;
  companyName: string;
  loginTime: string;
}

export default function VendorPortalTest() {
  const [session, setSession] = useState<VendorSession | null>(null);
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'loads' | 'documents' | 'profile'
  >('dashboard');

  const router = useRouter();

  // Debug: Log activeTab changes
  useEffect(() => {
    console.log('Active tab changed to:', activeTab);
  }, [activeTab]);

  // Force CSS reset for scrolling on component mount
  useEffect(() => {
    console.log('🎯 INITIALIZING SCROLL CSS RESET');

    // Reset any CSS that might prevent scrolling
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.height = 'auto';
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.body.style.scrollBehavior = 'auto';

    console.log('🎯 CSS RESET COMPLETE');
  }, []);

  // Check for session on mount
  useEffect(() => {
    const storedSession = localStorage.getItem('vendorSession');
    if (storedSession) {
      setSession(JSON.parse(storedSession));
    } else {
      router.push('/vendor-login');
    }
  }, [router]);

  // SIMPLE PAGE REFRESH: Most reliable way to get to top
  const scrollToTop = () => {
    console.log('🔄 FORCING PAGE REFRESH - Direct approach');
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem('vendorSession');
    router.push('/vendor-login');
  };

  if (!session) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, #022c22 0%, #032e2a 25%, #044e46 50%, #042f2e 75%, #0a1612 100%)',
          color: 'white',
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        background: `
          linear-gradient(135deg, #022c22 0%, #032e2a 25%, #044e46 50%, #042f2e 75%, #0a1612 100%),
          radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.04) 0%, transparent 50%)
        `,
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        padding: '100px 20px 20px 20px',
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'visible',
        width: '100%',
        scrollBehavior: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '20px 32px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1
            style={{
              color: 'white',
              fontSize: '1.8rem',
              fontWeight: '600',
              margin: 0,
            }}
          >
            🚛 FleetFlow Vendor Portal - TEST
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1rem',
              margin: '4px 0 0 0',
            }}
          >
            Welcome back, {session.companyName}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={scrollToTop}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            ⬆️ Top
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(220, 38, 38, 0.8)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          gap: '8px',
        }}
      >
        {[
          { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
          { id: 'loads', label: '📦 My Loads', icon: '📦' },
          { id: 'documents', label: '📄 Documents', icon: '📄' },
          { id: 'profile', label: '👤 Profile', icon: '👤' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              console.log('Tab clicked:', tab.id);
              setActiveTab(tab.id as any);
              scrollToTop();
            }}
            style={{
              background:
                activeTab === tab.id
                  ? 'rgba(255, 255, 255, 0.25)'
                  : 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              flex: 1,
            }}
            onMouseOver={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          minHeight: '400px',
        }}
      >
        <h2
          style={{ color: 'white', fontSize: '1.5rem', marginBottom: '16px' }}
        >
          {activeTab === 'dashboard' && '📊 Dashboard'}
          {activeTab === 'loads' && '📦 My Loads'}
          {activeTab === 'documents' && '📄 Documents'}
          {activeTab === 'profile' && '👤 Profile'}
        </h2>

        <p
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1rem',
            lineHeight: '1.6',
          }}
        >
          This is the {activeTab} section content. The scroll functionality
          should work when clicking tabs or the red button.
        </p>

        {/* Sample content for each tab */}
        <div style={{ marginTop: '24px' }}>
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              style={{
                padding: '16px',
                margin: '8px 0',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'white',
              }}
            >
              Sample {activeTab} content item #{i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Force scrollable content - ensures page has enough height to scroll */}
      <div style={{ height: '150vh', opacity: 0, pointerEvents: 'none' }}>
        {/* Invisible content to make page scrollable */}
      </div>
    </div>
  );
}
