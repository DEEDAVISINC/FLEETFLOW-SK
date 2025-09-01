'use client';

export default function SimpleDebugPage() {
  return (
    <div
      style={{
        background: '#667eea',
        minHeight: '100vh',
        padding: '80px 20px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{ color: '#1e293b', fontSize: '2.5rem', marginBottom: '20px' }}
        >
          🚛 FleetFlow Debug Test
        </h1>

        <p
          style={{ fontSize: '1.2rem', color: '#475569', marginBottom: '30px' }}
        >
          This is a minimal page to test if React is rendering properly.
        </p>

        <div
          style={{
            background: '#f1f5f9',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '30px',
          }}
        >
          <h3 style={{ color: '#1e293b', marginBottom: '15px' }}>
            Debug Status:
          </h3>
          <p style={{ color: '#059669', fontWeight: 'bold' }}>
            ✅ React is rendering correctly
          </p>
          <p style={{ color: '#059669', fontWeight: 'bold' }}>
            ✅ CSS styles are loading
          </p>
          <p style={{ color: '#059669', fontWeight: 'bold' }}>
            ✅ No JavaScript errors
          </p>
        </div>

        <button
          onClick={() => alert('JavaScript is working!')}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Test JavaScript
        </button>

        <a
          href='/'
          style={{
            background: '#10b981',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '1rem',
          }}
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
