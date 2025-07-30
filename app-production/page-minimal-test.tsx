'use client'

export default function HomePage() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '80px 20px 20px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#1f2937',
          margin: '0 0 20px 0'
        }}>
          🚛 FleetFlow TMS
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#6b7280',
          margin: 0
        }}>
          Testing minimal page - checking for runtime errors...
        </p>
      </div>
    </div>
  )
}
