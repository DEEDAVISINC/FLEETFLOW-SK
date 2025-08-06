'use client'

export default function SimpleDashboard() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #0891b2 100%)',
      minHeight: '100vh',
      padding: '20px',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '50px 20px' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold',
          margin: '0 0 20px 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🚛 FleetFlow Dashboard
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
          Professional Fleet Management System
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          maxWidth: '800px',
          margin: '40px auto',
          padding: '0 20px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🚛</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>Dispatch Central</h3>
            <p style={{ margin: 0, opacity: 0.8 }}>Load Management</p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🚚</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>Carrier Portal</h3>
            <p style={{ margin: 0, opacity: 0.8 }}>Driver Access</p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>💵</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>Quoting</h3>
            <p style={{ margin: 0, opacity: 0.8 }}>Rate Calculator</p>
          </div>
        </div>
        
        <div style={{
          marginTop: '50px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{ margin: '0 0 15px 0', fontSize: '1.5rem' }}>System Status</h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              backgroundColor: '#10B981', 
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }} />
            <span>All Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  )
}
