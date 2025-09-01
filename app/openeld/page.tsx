'use client';

export default function OpenELDPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        padding: '80px 20px 20px 20px',
      }}
    >
      <main style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '40px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 16px 0',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            📱 FleetFlow OpenELD
          </h1>
          <p
            style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0 0 24px 0',
              fontWeight: '400',
            }}
          >
            Open Source Electronic Logging Device System
          </p>

          {/* Simple badges */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#10b981',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                border: '1px solid rgba(34, 197, 94, 0.3)',
              }}
            >
              FMCSA Certified
            </span>
            <span
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#3b82f6',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              Open Source
            </span>
            <span
              style={{
                background: 'rgba(236, 72, 153, 0.2)',
                color: '#ec4899',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                border: '1px solid rgba(236, 72, 153, 0.3)',
              }}
            >
              AI Enhanced
            </span>
          </div>
        </div>

        {/* ELD Overview */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 20px 0',
            }}
          >
            Electronic Logging Device (ELD) Requirements
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: '1.6',
              marginBottom: '20px',
            }}
          >
            Electronic Logging Devices (ELDs) are mandatory for commercial motor
            vehicles under the FMCSA ELD Rule (49 CFR Part 395). OpenELD
            provides full compliance with federal regulations while integrating
            seamlessly with FleetFlow operations.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            <div>
              <h3
                style={{
                  color: '#10b981',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                }}
              >
                FMCSA Compliance Requirements
              </h3>
              <ul
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  paddingLeft: '20px',
                }}
              >
                <li>Automatically record driving time</li>
                <li>Monitor engine status and vehicle movement</li>
                <li>Record duty status changes</li>
                <li>Maintain accurate location information</li>
                <li>Provide driver authentication</li>
                <li>Transfer data to authorized personnel</li>
                <li>Support roadside inspections</li>
              </ul>
            </div>

            <div>
              <h3
                style={{
                  color: '#3b82f6',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                }}
              >
                Hours of Service (HOS) Monitoring
              </h3>
              <ul
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  paddingLeft: '20px',
                }}
              >
                <li>11-hour driving limit enforcement</li>
                <li>14-hour on-duty limit tracking</li>
                <li>70-hour/8-day cycle management</li>
                <li>30-minute break requirement monitoring</li>
                <li>10-hour off-duty requirement verification</li>
                <li>Split sleeper berth calculations</li>
                <li>Automatic violation alerts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 20px 0',
            }}
          >
            OpenELD Technical Specifications
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            <div>
              <h3
                style={{
                  color: '#14b8a6',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                }}
              >
                Data Recording Capabilities
              </h3>
              <ul
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  paddingLeft: '20px',
                }}
              >
                <li>Real-time GPS location tracking (± 1 mile accuracy)</li>
                <li>Engine data integration (RPM, speed, odometer)</li>
                <li>Driver identification and authentication</li>
                <li>Duty status event logging</li>
                <li>Vehicle diagnostic information</li>
                <li>Malfunction and data diagnostic events</li>
                <li>Unidentified driving records</li>
              </ul>
            </div>

            <div>
              <h3
                style={{
                  color: '#f59e0b',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                }}
              >
                System Requirements
              </h3>
              <ul
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  paddingLeft: '20px',
                }}
              >
                <li>ECM/Engine connection via J1939 data bus</li>
                <li>GPS receiver for location services</li>
                <li>Display screen for driver interaction</li>
                <li>Data transfer capabilities (USB, wireless, email)</li>
                <li>Minimum 6 months data storage</li>
                <li>Backup power supply</li>
                <li>FMCSA certification ID display</li>
              </ul>
            </div>

            <div>
              <h3
                style={{
                  color: '#8b5cf6',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                }}
              >
                FleetFlow Integration Features
              </h3>
              <ul
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  paddingLeft: '20px',
                }}
              >
                <li>Direct integration with dispatch system</li>
                <li>Flowter AI predictive analytics</li>
                <li>Real-time compliance monitoring</li>
                <li>Automated DOT reporting</li>
                <li>Fleet management dashboard integration</li>
                <li>Driver performance analytics</li>
                <li>Maintenance scheduling integration</li>
              </ul>
            </div>
          </div>
        </div>

        {/* DOT Inspection Process Flow */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 12px 0',
              }}
            >
              📋 DOT Inspection Process Flow
            </h2>
            <p
              style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: '0',
                fontWeight: '500',
              }}
            >
              From roadside stop to cleared inspection in 4 simple steps
            </p>
          </div>

          {/* Timeline Flow */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'row',
              gap: '20px',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {/* Step 1: Inspector Arrives */}
            <div
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                borderRadius: '16px',
                padding: '24px',
                color: 'white',
                textAlign: 'center',
                minWidth: '200px',
                flex: 1,
                maxWidth: '220px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  fontSize: '24px',
                }}
              >
                🚔
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  display: 'inline-block',
                }}
              >
                STEP 1
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}
              >
                Inspector Arrives
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  margin: 0,
                  opacity: 0.9,
                  lineHeight: '1.4',
                }}
              >
                DOT officer initiates roadside inspection
              </p>
            </div>

            {/* Arrow */}
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '24px',
                margin: '0 8px',
                minWidth: '30px',
                textAlign: 'center',
              }}
            >
              →
            </div>

            {/* Step 2: Data Access */}
            <div
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '16px',
                padding: '24px',
                color: 'white',
                textAlign: 'center',
                minWidth: '200px',
                flex: 1,
                maxWidth: '220px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  fontSize: '24px',
                }}
              >
                📱
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  display: 'inline-block',
                }}
              >
                STEP 2
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}
              >
                Data Access
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  margin: 0,
                  opacity: 0.9,
                  lineHeight: '1.4',
                }}
              >
                Instant ELD data transfer via USB/wireless
              </p>
            </div>

            {/* Arrow */}
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '24px',
                margin: '0 8px',
                minWidth: '30px',
                textAlign: 'center',
              }}
            >
              →
            </div>

            {/* Step 3: Compliance Check */}
            <div
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                borderRadius: '16px',
                padding: '24px',
                color: 'white',
                textAlign: 'center',
                minWidth: '200px',
                flex: 1,
                maxWidth: '220px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  fontSize: '24px',
                }}
              >
                🔍
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  display: 'inline-block',
                }}
              >
                STEP 3
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}
              >
                Compliance Check
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  margin: 0,
                  opacity: 0.9,
                  lineHeight: '1.4',
                }}
              >
                Inspector reviews HOS records & logs
              </p>
            </div>

            {/* Arrow */}
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '24px',
                margin: '0 8px',
                minWidth: '30px',
                textAlign: 'center',
              }}
            >
              →
            </div>

            {/* Step 4: Complete */}
            <div
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '16px',
                padding: '24px',
                color: 'white',
                textAlign: 'center',
                minWidth: '200px',
                flex: 1,
                maxWidth: '220px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  fontSize: '24px',
                }}
              >
                ✅
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  display: 'inline-block',
                }}
              >
                STEP 4
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}
              >
                Complete
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  margin: 0,
                  opacity: 0.9,
                  lineHeight: '1.4',
                }}
              >
                Inspection cleared, driver continues
              </p>
            </div>
          </div>

          {/* Key Benefits */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '16px',
              padding: '32px',
              marginTop: '32px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              textAlign: 'center',
            }}
          >
            <h3
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 24px 0',
              }}
            >
              🚀 Why This Process Works Every Time
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: '8px',
              }}
            >
              <div style={{ textAlign: 'center', padding: '8px' }}>
                <div style={{ fontSize: '16px', marginBottom: '4px' }}>⚡</div>
                <h4
                  style={{
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    margin: '0 0 2px 0',
                  }}
                >
                  2-Min Avg
                </h4>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '9px',
                    margin: 0,
                  }}
                >
                  Data transfer
                </p>
              </div>

              <div style={{ textAlign: 'center', padding: '8px' }}>
                <div style={{ fontSize: '16px', marginBottom: '4px' }}>📊</div>
                <h4
                  style={{
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    margin: '0 0 2px 0',
                  }}
                >
                  8 Days
                </h4>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '9px',
                    margin: 0,
                  }}
                >
                  Records ready
                </p>
              </div>

              <div style={{ textAlign: 'center', padding: '8px' }}>
                <div style={{ fontSize: '16px', marginBottom: '4px' }}>🎯</div>
                <h4
                  style={{
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    margin: '0 0 2px 0',
                  }}
                >
                  100%
                </h4>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '9px',
                    margin: 0,
                  }}
                >
                  Compliant
                </p>
              </div>

              <div style={{ textAlign: 'center', padding: '8px' }}>
                <div style={{ fontSize: '16px', marginBottom: '4px' }}>🛡️</div>
                <h4
                  style={{
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    margin: '0 0 2px 0',
                  }}
                >
                  Zero
                </h4>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '9px',
                    margin: 0,
                  }}
                >
                  Issues
                </p>
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #059669, #047857)',
                borderRadius: '12px',
                padding: '20px',
                marginTop: '24px',
                color: 'white',
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>🏆</div>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: 0,
                }}
              >
                ""The smoothest ELD inspection process we've ever
                experienced.""
              </p>
              <p
                style={{
                  fontSize: '14px',
                  margin: '4px 0 0 0',
                  opacity: 0.8,
                }}
              >
                - DOT Inspector, Region 5
              </p>
            </div>
          </div>
        </div>

        {/* Implementation & Support */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 20px 0',
            }}
          >
            OpenELD Implementation & Advantages
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
            }}
          >
            <div
              style={{
                padding: '20px',
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(34, 197, 94, 0.2)',
              }}
            >
              <h3
                style={{
                  color: '#10b981',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}
              >
                Zero Licensing Costs
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                No monthly subscription fees, per-device charges, or hidden
                costs. Open source solution with enterprise support.
              </p>
            </div>

            <div
              style={{
                padding: '20px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <h3
                style={{
                  color: '#3b82f6',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}
              >
                No Vendor Lock-in
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                Full control of your compliance data. Export capabilities to any
                format. Switch providers without data loss.
              </p>
            </div>

            <div
              style={{
                padding: '20px',
                background: 'rgba(236, 72, 153, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(236, 72, 153, 0.2)',
              }}
            >
              <h3
                style={{
                  color: '#ec4899',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}
              >
                AI-Enhanced Analytics
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                Flowter AI provides predictive compliance monitoring and
                violation prevention with machine learning insights.
              </p>
            </div>

            <div
              style={{
                padding: '20px',
                background: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(245, 158, 11, 0.2)',
              }}
            >
              <h3
                style={{
                  color: '#f59e0b',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}
              >
                Integrated System
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                Seamless integration with FleetFlow dispatch, tracking, and
                fleet management operations.
              </p>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 16px 0',
            }}
          >
            OpenELD Implementation
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: '0 0 32px 0',
              maxWidth: '700px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.6',
            }}
          >
            OpenELD is integrated directly into FleetFlow's platform,
            providing FMCSA-compliant electronic logging without additional
            hardware or subscription costs. Enable ELD compliance through your
            FleetFlow settings or contact support for implementation assistance.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#3b82f6',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              View Documentation
            </button>
            <button
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Contact Support
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
