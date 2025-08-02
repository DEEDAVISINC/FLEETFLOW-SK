'use client';

export default function EnhancedDriverPortal() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f7c52d, #f4a832)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          padding: '40px 32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚛</div>
        <h1
          style={{ color: '#2d3748', fontSize: '1.8rem', marginBottom: '16px' }}
        >
          Enhanced Driver Portal
        </h1>
        <p style={{ color: 'rgba(45, 55, 72, 0.7)', marginBottom: '24px' }}>
          This page is temporarily under maintenance. Please check back later.
        </p>
        <button
          onClick={() => window.history.back()}
          style={{
            background: 'linear-gradient(135deg, #f7c52d, #f4a832)',
            color: '#2d3748',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
