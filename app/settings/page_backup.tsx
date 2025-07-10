'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paddingTop: '80px'
    }}>
      <div style={{ padding: '24px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '16px'
          }}>
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px 32px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '32px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '32px'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 12px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            ⚙️ System Settings
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0
          }}>
            Manage users, permissions, and system configuration
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px 16px 0 0',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '0 24px'
        }}>
          <nav style={{ display: 'flex', gap: '32px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <button
              onClick={() => setActiveTab('users')}
              style={{
                padding: '16px 0',
                borderBottom: activeTab === 'users' ? '2px solid white' : '2px solid transparent',
                fontWeight: '600',
                fontSize: '14px',
                color: activeTab === 'users' ? 'white' : 'rgba(255, 255, 255, 0.7)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              style={{
                padding: '16px 0',
                borderBottom: activeTab === 'permissions' ? '2px solid white' : '2px solid transparent',
                fontWeight: '600',
                fontSize: '14px',
                color: activeTab === 'permissions' ? 'white' : 'rgba(255, 255, 255, 0.7)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Permissions
            </button>
            <button
              onClick={() => setActiveTab('general')}
              style={{
                padding: '16px 0',
                borderBottom: activeTab === 'general' ? '2px solid white' : '2px solid transparent',
                fontWeight: '600',
                fontSize: '14px',
                color: activeTab === 'general' ? 'white' : 'rgba(255, 255, 255, 0.7)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              General Settings
            </button>
          </nav>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '0 0 16px 16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '24px',
          minHeight: '400px'
        }}>
          {activeTab === 'users' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 24px 0' }}>
                User Management
              </h2>
              <p style={{ color: '#6b7280' }}>
                Manage user accounts, roles, and permissions.
              </p>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 24px 0' }}>
                System Permissions
              </h2>
              <p style={{ color: '#6b7280' }}>
                Configure system-wide permissions and access controls.
              </p>
            </div>
          )}

          {activeTab === 'general' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 24px 0' }}>
                General Settings
              </h2>
              <p style={{ color: '#6b7280' }}>
                Configure general system settings and preferences.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
