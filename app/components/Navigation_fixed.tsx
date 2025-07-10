'use client'

import Link from 'next/link'

// Professional Navigation Component with Dropdowns
export default function ProfessionalNavigation() {
  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      padding: '12px 20px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <Link href="/" style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textDecoration: 'none'
        }}>
          🚛 FleetFlow
        </Link>
        
        <div style={{ 
          display: 'flex', 
          gap: '5px', 
          alignItems: 'center'
        }}>
          {/* Operations Dropdown - Blue */}
          <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
            <button style={{
              background: 'linear-gradient(145deg, #2196F3, #1976D2)',
              color: 'white',
              padding: '10px 18px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            onMouseEnter={(e) => {
              const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
              if (dropdown) dropdown.style.display = 'block';
            }}>
              🚛 Operations ▼
            </button>
            <div style={{
              display: 'none',
              position: 'absolute',
              background: 'white',
              minWidth: '200px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              borderRadius: '12px',
              padding: '12px 0',
              top: '100%',
              left: 0,
              border: '1px solid rgba(0,0,0,0.1)',
              zIndex: 1001
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.display = 'block';
            }}>
              <Link href="/dispatch/login" style={{ display: 'block', padding: '10px 20px', color: '#2196F3', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                🚛 Dispatch Central
              </Link>
              <Link href="/drivers" style={{ display: 'block', padding: '10px 20px', color: '#2196F3', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                👤 Driver Management
              </Link>
              <div style={{ borderLeft: '3px solid #2196F3', paddingLeft: '17px', margin: '5px 0' }}>
                <Link href="/drivers#live-tracking" style={{ display: 'block', padding: '8px 20px', color: '#1565C0', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '500', fontStyle: 'italic' }}>
                  🗺️ Live Load Tracking
                </Link>
              </div>
              <Link href="/vehicles" style={{ display: 'block', padding: '10px 20px', color: '#2196F3', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                🚛 Vehicle Fleet
              </Link>
              <Link href="/maintenance" style={{ display: 'block', padding: '10px 20px', color: '#2196F3', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                🔧 Maintenance
              </Link>
            </div>
          </div>

          {/* Customers Dropdown - Green */}
          <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
            <button style={{
              background: 'linear-gradient(145deg, #10B981, #059669)',
              color: 'white',
              padding: '10px 18px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            onMouseEnter={(e) => {
              const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
              if (dropdown) dropdown.style.display = 'block';
            }}>
              👥 Customers ▼
            </button>
            <div style={{
              display: 'none',
              position: 'absolute',
              background: 'white',
              minWidth: '200px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              borderRadius: '12px',
              padding: '12px 0',
              top: '100%',
              left: 0,
              border: '1px solid rgba(0,0,0,0.1)',
              zIndex: 1001
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.display = 'block';
            }}>
              <Link href="/customers" style={{ display: 'block', padding: '10px 20px', color: '#10B981', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                📋 Customer List
              </Link>
              <Link href="/quotes" style={{ display: 'block', padding: '10px 20px', color: '#10B981', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                💰 Quotes
              </Link>
              <Link href="/contracts" style={{ display: 'block', padding: '10px 20px', color: '#10B981', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                📑 Contracts
              </Link>
              <Link href="/invoices" style={{ display: 'block', padding: '10px 20px', color: '#10B981', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                💵 Invoices
              </Link>
            </div>
          </div>

          {/* Admin Dropdown - Purple */}
          <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
            <button style={{
              background: 'linear-gradient(145deg, #8B5CF6, #7C3AED)',
              color: 'white',
              padding: '10px 18px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            onMouseEnter={(e) => {
              const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
              if (dropdown) dropdown.style.display = 'block';
            }}>
              ⚙️ Admin ▼
            </button>
            <div style={{
              display: 'none',
              position: 'absolute',
              background: 'white',
              minWidth: '200px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              borderRadius: '12px',
              padding: '12px 0',
              top: '100%',
              left: 0,
              border: '1px solid rgba(0,0,0,0.1)',
              zIndex: 1001
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.display = 'block';
            }}>
              <Link href="/admin/users" style={{ display: 'block', padding: '10px 20px', color: '#8B5CF6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                👥 User Management
              </Link>
              <Link href="/admin/settings" style={{ display: 'block', padding: '10px 20px', color: '#8B5CF6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                ⚙️ System Settings
              </Link>
              <Link href="/admin/logs" style={{ display: 'block', padding: '10px 20px', color: '#8B5CF6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                📊 System Logs
              </Link>
              <Link href="/admin/backups" style={{ display: 'block', padding: '10px 20px', color: '#8B5CF6', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                💾 Backups
              </Link>
            </div>
          </div>

          {/* Help Button - Orange */}
          <Link href="/help" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'linear-gradient(145deg, #F97316, #EA580C)',
              color: 'white',
              padding: '10px 18px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              🔍 Help
            </button>
          </Link>

          {/* User Profile Icon */}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #0EA5E9, #2DD4BF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginLeft: '10px',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)'
          }}>
            A
          </div>
        </div>
      </div>
    </nav>
  );
}
