'use client'

export default function NavigationTestPage() {
  return (
    <div style={{
      paddingTop: '80px', // Account for fixed navigation
      padding: '80px 20px 20px',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '30px',
          background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '2.5rem',
          fontWeight: 'bold'
        }}>
          🧪 Navigation Test Page
        </h1>

        <div style={{
          background: '#f8fafc',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <h2 style={{ color: '#1e293b', marginBottom: '15px' }}>Testing Instructions:</h2>
          <ol style={{ color: '#475569', lineHeight: '1.6' }}>
            <li><strong>Operations Dropdown:</strong> Click "🚛 OPERATIONS ▼" - should show Dispatch Central and Broker Box</li>
            <li><strong>Driver Management Dropdown:</strong> Click "🚛 DRIVER MANAGEMENT ▼" - should show Driver Management, Driver Dashboard, and Live Load Tracking</li>
            <li><strong>FleetFlow Dropdown:</strong> Click "🚛 FLEETFLOW ▼" - should show Route Optimization, Freight Quoting, and Fleet Management</li>
            <li><strong>Resources Dropdown:</strong> Click "📚 RESOURCES ▼" - should show Document Generation, Resource Library, Safety Resources, Documentation Hub, and Training</li>
            <li><strong>Click Outside:</strong> Open any dropdown, then click elsewhere - dropdown should close</li>
            <li><strong>Click Link:</strong> Click any link in dropdown - should navigate and close dropdown</li>
          </ol>
        </div>

        <div style={{
          background: '#e0f2fe',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #0ea5e9'
        }}>
          <h3 style={{ color: '#0369a1', marginBottom: '10px' }}>✅ Expected Behavior:</h3>
          <ul style={{ color: '#0c4a6e', lineHeight: '1.6' }}>
            <li>Dropdowns open and close on button clicks</li>
            <li>Only one dropdown open at a time</li>
            <li>Clicking outside closes any open dropdown</li>
            <li>Clicking dropdown links navigates and closes dropdown</li>
            <li>Smooth transitions and hover effects</li>
          </ul>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '30px'
        }}>
          <a 
            href="/"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
          >
            🏠 Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
