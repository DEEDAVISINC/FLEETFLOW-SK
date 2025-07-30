'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paddingTop: '80px'
    }}>
      
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px 32px'
      }}>
        {/* Welcome Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '32px'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 12px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🚛 Welcome to FleetFlow
          </h1>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0
          }}>
            Your comprehensive fleet management solution
          </p>
        </div>

        {/* Quick Links Dashboard */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '48px'
        }}>
          
          {/* Dispatch Central */}
          <Link href="/dispatch" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100px',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15), 0 16px 32px rgba(59, 130, 246, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '32px' }}>🚛</div>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Dispatch Central</h3>
            </div>
          </Link>

          {/* Driver Management */}
          <Link href="/drivers" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #f7c52d, #f4a832)',
              borderRadius: '12px',
              padding: '20px',
              color: '#2d3748',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100px',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15), 0 16px 32px rgba(247, 197, 45, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '32px' }}>🚛</div>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Driver Management</h3>
            </div>
          </Link>

          {/* Fleet Management */}
          <Link href="/vehicles" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100px',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15), 0 16px 32px rgba(139, 92, 246, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '32px' }}>🚚</div>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Fleet Management</h3>
            </div>
          </Link>

          {/* Broker Box */}
          <Link href="/broker" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100px',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15), 0 16px 32px rgba(249, 115, 22, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '32px' }}>🏢</div>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Broker Box</h3>
            </div>
          </Link>

          {/* Route Optimization */}
          <Link href="/routes" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100px',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15), 0 16px 32px rgba(20, 184, 166, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '32px' }}>🗺️</div>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Route Optimization</h3>
            </div>
          </Link>

          {/* Analytics Dashboard */}
          <Link href="/analytics" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100px',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15), 0 16px 32px rgba(99, 102, 241, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '32px' }}>📊</div>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Analytics</h3>
            </div>
          </Link>

          {/* Freight Quoting */}
          <Link href="/quoting" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100px',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15), 0 16px 32px rgba(34, 197, 94, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '32px' }}>💰</div>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Freight Quoting</h3>
            </div>
          </Link>

          {/* Compliance */}
          <Link href="/compliance" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100px',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15), 0 16px 32px rgba(220, 38, 38, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '32px' }}>✅</div>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Compliance</h3>
            </div>
          </Link>

          {/* Maintenance */}
          <Link href="/maintenance" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100px',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15), 0 16px 32px rgba(6, 182, 212, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '32px' }}>🔧</div>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Maintenance</h3>
            </div>
          </Link>

          {/* Training */}
          <Link href="/training" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #8b4513, #654321)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100px',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15), 0 16px 32px rgba(139, 69, 19, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '32px' }}>🎓</div>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Training</h3>
            </div>
          </Link>

          {/* Notes (Yellowish Gold) - Moved to bottom */}
          <Link href="/notes" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100px',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15), 0 16px 32px rgba(245, 158, 11, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '32px' }}>📝</div>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Notes</h3>
            </div>
          </Link>

        </div>

        {/* Quick Stats Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Active Loads</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>24</p>
              </div>
              <div style={{ fontSize: '40px' }}>📦</div>
            </div>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Available Drivers</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', margin: 0 }}>8</p>
              </div>
              <div style={{ fontSize: '40px' }}>👨‍💼</div>
            </div>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Fleet Vehicles</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6', margin: 0 }}>32</p>
              </div>
              <div style={{ fontSize: '40px' }}>🚛</div>
            </div>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Revenue (MTD)</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#22c55e', margin: 0 }}>$145K</p>
              </div>
              <div style={{ fontSize: '40px' }}>💵</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
