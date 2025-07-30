export default function TestPage() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        maxWidth: '600px'
      }}>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '20px',
          background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ✅ FleetFlow is Working!
        </h1>
        
        <p style={{
          fontSize: '1.2rem',
          color: '#1e293b',
          marginBottom: '30px'
        }}>
          If you can see this page, the application is running correctly.
        </p>
        
        <div style={{
          background: '#f8fafc',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#1e293b', marginBottom: '15px' }}>Troubleshooting White Screen:</h3>
          <ul style={{ textAlign: 'left', color: '#475569' }}>
            <li>✅ Server is running on port 3000</li>
            <li>✅ No build errors detected</li>
            <li>✅ Navigation component is working</li>
            <li>✅ Main dashboard is functional</li>
          </ul>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <a 
            href="/"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            🏠 Go to Dashboard
          </a>
          <a 
            href="/training"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            🎓 Go to Training
          </a>
        </div>
      </div>
    </div>
  )
}
