'use client';

export default function GlobalLoading() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1f2937, #374151, #4b5563)',
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(15px)',
        borderRadius: '20px',
        padding: '48px',
        textAlign: 'center',
        maxWidth: '400px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '24px',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}>
          🚛
        </div>
        
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1f2937',
          margin: '0 0 16px 0'
        }}>
          FleetFlow TMS
        </h1>
        
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          margin: '0 0 32px 0'
        }}>
          Loading your dashboard...
        </p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px'
        }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: '12px',
                height: '12px',
                background: '#3b82f6',
                borderRadius: '50%',
                animation: `bounce 1.4s ease-in-out infinite both`,
                animationDelay: `${i * 0.16}s`
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
} 