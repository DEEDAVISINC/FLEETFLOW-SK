'use client';

import React from 'react';
import Link from 'next/link';

interface UniversityNavigationProps {
  currentPage?: string;
}

export const UniversityNavigation: React.FC<UniversityNavigationProps> = ({
  currentPage = 'home'
}) => {
  const navigationItems = [
    {
      id: 'home',
      label: '🏠 Home',
      href: '/',
      description: 'FleetFlow Dashboard'
    },
    {
      id: 'university',
      label: '🎓 University',
      href: '/university',
      description: 'Training & Certification'
    },
    {
      id: 'onboarding',
      label: '🚚 Onboarding',
      href: '/onboarding/carrier-onboarding',
      description: 'Carrier Onboarding System'
    },
    {
      id: 'dispatch',
      label: '📋 Dispatch',
      href: '/dispatch',
      description: 'Load Management'
    }
  ];

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '16px',
      margin: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {navigationItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            style={{
              background: currentPage === item.id 
                ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
                : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '120px',
              border: currentPage === item.id 
                ? '2px solid rgba(59, 130, 246, 0.5)'
                : '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <div style={{ fontSize: '1.1rem', marginBottom: '4px' }}>
              {item.label}
            </div>
            <div style={{ 
              fontSize: '0.8rem', 
              opacity: 0.8,
              textAlign: 'center',
              lineHeight: '1.2'
            }}>
              {item.description}
            </div>
          </Link>
        ))}
      </div>

      {/* FleetFlow University Quick Access */}
      {currentPage !== 'university' && (
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          marginTop: '16px',
          paddingTop: '16px',
          textAlign: 'center'
        }}>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', marginBottom: '8px' }}>
            📚 Need training on the Carrier Onboard Workflow?
          </div>
          <Link
            href="/university/carrier-onboard-workflow"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
            }}
          >
            🎓 Start Training
          </Link>
        </div>
      )}
    </div>
  );
};
