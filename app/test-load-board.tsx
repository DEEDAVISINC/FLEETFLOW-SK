'use client';

// Test page to isolate the load board section
export default function TestLoadBoard() {
  const loads = [
    {
      id: 'LD-2024-001',
      origin: 'Los Angeles, CA',
      destination: 'Chicago, IL',
      rate: '$3,450',
      miles: '2,015',
      pickup: 'Jan 15',
      status: 'Available',
      statusColor: '#22c55e',
      loadBoardNumber: '100001',
    },
    {
      id: 'LD-2024-002',
      origin: 'Houston, TX',
      destination: 'Atlanta, GA',
      rate: '$2,180',
      miles: '789',
      pickup: 'Jan 16',
      status: 'Assigned',
      statusColor: '#3b82f6',
      loadBoardNumber: '100002',
    },
    {
      id: 'LD-2024-003',
      origin: 'Phoenix, AZ',
      destination: 'Denver, CO',
      rate: '$1,950',
      miles: '602',
      pickup: 'Jan 17',
      status: 'Available',
      statusColor: '#22c55e',
      loadBoardNumber: '100003',
    },
  ];

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{ color: 'white', textAlign: 'center', marginBottom: '40px' }}
        >
          Load Board Test
        </h1>

        {/* General Load Board */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            📋 Available Loads - General Load Board
          </h2>

          {/* Load Board Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '90px 1fr 2fr 2fr 1fr 1fr 1fr 120px',
              gap: '12px',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              marginBottom: '16px',
              fontWeight: '600',
              fontSize: '14px',
              color: 'white',
            }}
          >
            <div>📞 Board #</div>
            <div>Load ID</div>
            <div>Origin</div>
            <div>Destination</div>
            <div>Rate</div>
            <div>Miles</div>
            <div>Pickup</div>
            <div>Status</div>
          </div>

          {/* Dynamic Load Board Rows */}
          {loads.map((load, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '90px 1fr 2fr 2fr 1fr 1fr 1fr 120px',
                gap: '12px',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                marginBottom: '8px',
                color: 'white',
                fontSize: '14px',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  fontWeight: '700',
                  color: '#10b981',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  textAlign: 'center',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '4px',
                  padding: '2px 4px',
                }}
              >
                {load.loadBoardNumber || '000000'}
              </div>
              <div style={{ fontWeight: '600' }}>{load.id}</div>
              <div>{load.origin}</div>
              <div>{load.destination}</div>
              <div style={{ fontWeight: '600', color: '#10b981' }}>
                {load.rate}
              </div>
              <div>{load.miles}</div>
              <div>{load.pickup}</div>
              <div>
                <span
                  style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: load.statusColor || '#10b981',
                    color: 'white',
                  }}
                >
                  {load.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
