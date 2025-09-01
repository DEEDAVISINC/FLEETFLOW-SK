'use client';

import GoWithFlowPanel from '../components/GoWithFlowPanel';

export default function GoWithFlowDemo() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
        padding: '60px 16px 16px 16px',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          <h1
            style={{
              color: 'white',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              margin: '0 0 16px 0',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            🌊 Go with the Flow - Automated System Demo
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1.2rem',
              margin: 0,
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            Automated load-to-driver matching system where BOL workflows start
            automatically upon driver acceptance
          </p>
        </div>

        {/* Key Features Banner */}
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.2)',
            border: '2px solid rgba(59, 130, 246, 0.5)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              color: '#60a5fa',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: '0 0 16px 0',
            }}
          >
            🤖 Automated Workflow Features
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginTop: '20px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: '12px',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚡</div>
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.1rem',
                  margin: '0 0 8px 0',
                }}
              >
                Instant Match
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                Driver accepts → BOL workflow auto-starts → Driver OTR Flow
                updated
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: '12px',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🤖</div>
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.1rem',
                  margin: '0 0 8px 0',
                }}
              >
                Auto-Match
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                AI finds best driver matches → Auto-assigns → Workflows flow
                automatically
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: '12px',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📋</div>
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.1rem',
                  margin: '0 0 8px 0',
                }}
              >
                BOL Auto-Start
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                BOL process starts regardless of acceptance method → No manual
                intervention
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: '12px',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🚛</div>
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.1rem',
                  margin: '0 0 8px 0',
                }}
              >
                Driver Portal Sync
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                Loads appear on Driver OTR Flow → Accept from portal → Same
                automation
              </p>
            </div>
          </div>
        </div>

        {/* Go with the Flow Panel */}
        <GoWithFlowPanel />

        {/* Instructions */}
        <div
          style={{
            background: 'rgba(139, 92, 246, 0.2)',
            border: '2px solid rgba(139, 92, 246, 0.5)',
            borderRadius: '16px',
            padding: '24px',
            marginTop: '32px',
          }}
        >
          <h3
            style={{
              color: '#a78bfa',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              margin: '0 0 16px 0',
            }}
          >
            📖 How to Test the Automated System
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            <div>
              <h4 style={{ color: 'white', margin: '0 0 12px 0' }}>
                1. ⚡ Instant Match Demo
              </h4>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                Click ""⚡ Instant Match"" on any urgent load. Watch the
                real-time activity feed show: AI matching → Driver acceptance →
                BOL workflow auto-start → Driver portal update
              </p>
            </div>

            <div>
              <h4 style={{ color: 'white', margin: '0 0 12px 0' }}>
                2. 🤖 Auto-Match System
              </h4>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                Click ""🚛 Trigger Auto-Match Demo"" to see the system
                automatically find and assign multiple urgent loads to drivers
                with full workflow automation.
              </p>
            </div>

            <div>
              <h4 style={{ color: 'white', margin: '0 0 12px 0' }}>
                3. 🚛 Driver Portal Access
              </h4>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                Click ""🚛 Driver OTR Flow Portal"" to see where drivers
                would accept loads from their loadboard, triggering the same
                automated BOL workflow.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Dispatch */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '40px',
          }}
        >
          <a href='/dispatch' style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                border: '2px solid white',
                padding: '15px 30px',
                borderRadius: '15px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
              }}
            >
              ← Back to Dispatch Central
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
