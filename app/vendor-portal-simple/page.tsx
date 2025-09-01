'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function VendorPortalSimple() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  // Simple navigation tabs
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'loads', label: 'My Loads' },
    { id: 'documents', label: 'Documents' },
    { id: 'profile', label: 'Profile' },
  ];

  // Super simple reload approach - guarantee scroll to top
  const handleTabClick = (tabId: string) => {
    console.info('Tab clicked:', tabId);
    setActiveTab(tabId);

    // Force page reload - simplest guaranteed solution
    window.location.reload();
  };

  return (
    <div
      style={{
        background: '#f0f4f8',
        minHeight: '100vh',
        padding: '100px 20px 20px 20px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Simple Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #022c22 0%, #044e46 100%)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '15px 20px',
          color: 'white',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Vendor Portal</h1>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '20px' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              style={{
                background: 'transparent',
                color: activeTab === tab.id ? '#4ade80' : 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ marginTop: '20px' }}>
        {activeTab === 'dashboard' && (
          <div>
            <h2>Dashboard Content</h2>
            <p>This is the dashboard content.</p>
            <div
              style={{
                height: '1500px',
                background: '#e2e8f0',
                padding: '20px',
                marginTop: '20px',
              }}
            >
              <p>Scroll area to test scrolling behavior</p>
            </div>
          </div>
        )}

        {activeTab === 'loads' && (
          <div>
            <h2>My Loads Content</h2>
            <p>This is the loads content.</p>
            <div
              style={{
                height: '1500px',
                background: '#e2e8f0',
                padding: '20px',
                marginTop: '20px',
              }}
            >
              <p>Scroll area to test scrolling behavior</p>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <h2>Documents Content</h2>
            <p>This is the documents content.</p>
            <div
              style={{
                height: '1500px',
                background: '#e2e8f0',
                padding: '20px',
                marginTop: '20px',
              }}
            >
              <p>Scroll area to test scrolling behavior</p>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h2>Profile Content</h2>
            <p>This is the profile content.</p>
            <div
              style={{
                height: '1500px',
                background: '#e2e8f0',
                padding: '20px',
                marginTop: '20px',
              }}
            >
              <p>Scroll area to test scrolling behavior</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
