'use client';

interface FleetFlowFooterProps {
  variant?: 'dark' | 'light' | 'transparent';
  showLogo?: boolean;
  showLinks?: boolean;
}

export default function FleetFlowFooter({
  variant = 'transparent',
  showLogo = true,
  showLinks = false,
}: FleetFlowFooterProps) {
  return (
    <footer
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '18px 30px',
        marginBottom: '30px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
      }}
    >
      <div className='mx-auto max-w-7xl'>
        <div className='flex items-center justify-between'>
          {showLogo && (
            <div className='flex items-center gap-3'>
              <img
                src='/images/fleetflow logo tms.jpg'
                alt='FleetFlow Logo'
                style={{
                  width: '28px',
                  height: '28px',
                  objectFit: 'contain',
                }}
                onError={(e) => {
                  e.currentTarget.src = '/images/fleetflow logo tms.jpg';
                }}
              />
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#ffffff',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                }}
              >
                FleetFlow™
              </span>
            </div>
          )}

          <div
            style={{
              fontSize: '14px',
              color: '#ffffff',
              opacity: 0.9,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            }}
          >
            © 2025 Transportation Management System
          </div>
        </div>
      </div>
    </footer>
  );
}
