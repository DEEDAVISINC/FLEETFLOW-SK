'use client';

export default function TestDrivers() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #2563eb, #1d4ed8, #1e40af)',
      padding: '80px 20px 20px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '12px',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            👥 DRIVER MANAGEMENT - TEST
          </h1>
          <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.9)' }}>
            This is a test to verify the styling is working
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {[
            { label: 'Total Drivers', value: 6, color: '#3b82f6', icon: '👥' },
            { label: 'Available', value: 1, color: '#10b981', icon: '✅' },
            { label: 'Driving', value: 2, color: '#f59e0b', icon: '🚛' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                background: stat.color,
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '12px'
              }}>
                <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>
                  {stat.icon}
                </div>
                <div>{stat.value}</div>
              </div>
              <div style={{ color: '#374151', fontSize: '14px', fontWeight: '600' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#1f2937', marginBottom: '16px' }}>
            ✅ STYLING TEST SUCCESSFUL
          </h2>
          <p style={{ color: '#6b7280' }}>
            If you can see this with a blue gradient background and white cards, 
            the styling system is working correctly.
          </p>
        </div>
      </div>
    </div>
  );
}
