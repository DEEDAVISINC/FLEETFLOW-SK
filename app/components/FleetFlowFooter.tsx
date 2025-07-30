'use client';

interface FleetFlowFooterProps {
  variant?: 'dark' | 'light' | 'transparent';
  showLogo?: boolean;
  showLinks?: boolean;
}

export default function FleetFlowFooter({
  variant = 'transparent',
  showLogo = true,
  showLinks = true,
}: FleetFlowFooterProps) {
  const getFooterStyles = () => {
    switch (variant) {
      case 'dark':
        return {
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        };
      case 'light':
        return {
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          color: '#334155',
          border: '1px solid rgba(0, 0, 0, 0.1)',
        };
      default:
        return {
          background: 'rgba(255, 255, 255, 0.1)',
          color: 'inherit',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
        };
    }
  };

  return (
    <footer
      style={{
        ...getFooterStyles(),
        padding: '20px',
        borderRadius: '15px',
        marginTop: '40px',
      }}
    >
      <div className='mx-auto max-w-7xl'>
        <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
          {showLogo && (
            <div className='flex items-center gap-3'>
              <img
                src='/images/new fleetflow logo.png'
                alt='FleetFlow Logo'
                style={{
                  width: '28px',
                  height: '28px',
                  objectFit: 'contain',
                }}
                onError={(e) => {
                  e.currentTarget.src = '/images/fleet-flow-logo.png';
                }}
              />
              <div>
                <h3 className='mb-0 text-lg font-bold'>FleetFlow™</h3>
                <p className='mb-0 text-sm opacity-80'>
                  Transportation Management System
                </p>
              </div>
            </div>
          )}

          <div className='flex flex-col items-center gap-6 md:flex-row'>
            {showLinks && (
              <div className='flex flex-wrap justify-center gap-4 text-sm'>
                <a
                  href='/dot-compliance'
                  className='transition-opacity hover:opacity-80'
                >
                  DOT Compliance
                </a>
                <a href='/ai' className='transition-opacity hover:opacity-80'>
                  AI Dashboard
                </a>
                <a
                  href='/dispatch'
                  className='transition-opacity hover:opacity-80'
                >
                  Dispatch
                </a>
                <a
                  href='/documentation'
                  className='transition-opacity hover:opacity-80'
                >
                  Documentation
                </a>
              </div>
            )}

            <div className='text-center text-sm opacity-80'>
              <p className='mb-1'>© 2025 FleetFlow™</p>
              <p className='mb-0'>Complete TMS + DOT Compliance Platform</p>
            </div>
          </div>
        </div>

        <div className='border-opacity-20 mt-4 border-t pt-4 text-center text-xs opacity-70'>
          <p className='mb-0'>
            🚛 Fleet Management • 🛡️ DOT Compliance • 🤖 AI Automation • 📊
            Analytics
          </p>
        </div>
      </div>
    </footer>
  );
}
