'use client';

import { useState } from 'react';
import { getTenantContext, switchTenant } from '../utils/tenant-utils';

export default function TenantSwitcher() {
  const { tenantId, tenantInfo, userTenant } = getTenantContext();
  const [showDropdown, setShowDropdown] = useState(false);

  // Mock available tenants for user (in production, fetch from API)
  const availableTenants = [
    { id: 'acme-logistics', name: 'Acme Logistics Inc', plan: 'Professional' },
    { id: 'beta-transport', name: 'Beta Transport LLC', plan: 'Enterprise' },
    { id: 'gamma-freight', name: 'Gamma Freight Solutions', plan: 'Basic' },
  ];

  const handleTenantSwitch = (newTenantId: string) => {
    if (newTenantId !== tenantId) {
      if (
        confirm(
          `Switch to ${availableTenants.find((t) => t.id === newTenantId)?.name}? This will reload the page.`
        )
      ) {
        switchTenant(newTenantId);
      }
    }
    setShowDropdown(false);
  };

  if (!tenantId || !tenantInfo) {
    return (
      <div
        style={{
          padding: '8px 12px',
          background: '#fee2e2',
          color: '#dc2626',
          borderRadius: '8px',
          fontSize: '12px',
        }}
      >
        ⚠️ No Tenant
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          backdropFilter: 'blur(10px)',
        }}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: tenantInfo.status === 'active' ? '#10b981' : '#ef4444',
          }}
        ></div>
        <div>
          <div style={{ fontWeight: '500' }}>{tenantInfo.name}</div>
          <div style={{ fontSize: '11px', opacity: 0.8 }}>
            {tenantInfo.plan}
          </div>
        </div>
        <div
          style={{
            transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          ↓
        </div>
      </button>

      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          {availableTenants.map((tenant) => (
            <button
              key={tenant.id}
              onClick={() => handleTenantSwitch(tenant.id)}
              style={{
                width: '100%',
                padding: '12px',
                background: tenant.id === tenantId ? '#f3f4f6' : 'white',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                borderBottom: '1px solid #f3f4f6',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = '#f9fafb')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  tenant.id === tenantId ? '#f3f4f6' : 'white')
              }
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: tenant.id === tenantId ? '#3b82f6' : '#d1d5db',
                  }}
                ></div>
                <div>
                  <div
                    style={{
                      fontWeight: '500',
                      color: '#1f2937',
                      fontSize: '14px',
                    }}
                  >
                    {tenant.name}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#6b7280',
                    }}
                  >
                    {tenant.plan} Plan
                  </div>
                </div>
                {tenant.id === tenantId && (
                  <div
                    style={{
                      marginLeft: 'auto',
                      fontSize: '12px',
                      color: '#10b981',
                      fontWeight: '500',
                    }}
                  >
                    ✓ Current
                  </div>
                )}
              </div>
            </button>
          ))}

          <div
            style={{
              padding: '8px 12px',
              background: '#f9fafb',
              borderTop: '1px solid #e5e7eb',
              fontSize: '11px',
              color: '#6b7280',
              textAlign: 'center',
            }}
          >
            Multi-Tenant Mode Active
          </div>
        </div>
      )}
    </div>
  );
}
































