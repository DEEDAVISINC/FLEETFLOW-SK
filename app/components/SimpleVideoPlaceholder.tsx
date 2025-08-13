'use client';

export function SimpleVideoPlaceholder() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '900px',
        height: '500px',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        background:
          'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.8)',
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎥</div>
        <h3
          style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#3b82f6' }}
        >
          FleetFlow Platform Demo
        </h3>
        <p style={{ fontSize: '1rem', marginBottom: '20px' }}>
          Complete transportation management platform
        </p>
        <div
          style={{
            background: 'rgba(59,130,246,0.2)',
            padding: '10px 20px',
            borderRadius: '20px',
            display: 'inline-block',
            fontSize: '0.9rem',
          }}
        >
          🚛 AI-Powered • 📊 Real-Time • 💰 Enterprise-Ready
        </div>
      </div>
    </div>
  );
}

