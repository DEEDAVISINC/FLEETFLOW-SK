'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import CarrierComplianceDashboard from '../../components/CarrierComplianceDashboard';

export default function CarrierCompliancePage() {
  const [carrierId, setCarrierId] = useState<string>('');
  const [dotNumber, setDotNumber] = useState<string>('');
  const [carrierName, setCarrierName] = useState<string>('');

  useEffect(() => {
    // In a real app, this would fetch from authentication context
    // For now, we'll use a mock carrier
    const mockCarrierData = {
      carrierId: 'CARR-123456',
      dotNumber: '123456',
      companyName: 'FleetFlow Carrier Inc.',
    };

    setCarrierId(mockCarrierData.carrierId);
    setDotNumber(mockCarrierData.dotNumber);
    setCarrierName(mockCarrierData.companyName);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
        padding: '24px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Back button */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            href='/carriers'
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'white',
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '8px',
              fontSize: '0.875rem',
            }}
          >
            <span style={{ marginRight: '8px' }}>←</span> Back to Portal
          </Link>
        </div>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <div>
            <h1
              style={{
                margin: '0 0 8px 0',
                color: 'white',
                fontSize: '2rem',
              }}
            >
              DOT Compliance Center
            </h1>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {carrierName} • DOT# {dotNumber}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: 'white',
              fontSize: '0.875rem',
            }}
          >
            Last Refreshed: {new Date().toLocaleString()}
          </div>
        </div>

        {/* Main dashboard */}
        {carrierId && dotNumber && (
          <CarrierComplianceDashboard
            carrierId={carrierId}
            dotNumber={dotNumber}
          />
        )}

        {/* Additional compliance resources */}
        <div
          style={{
            marginTop: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}
        >
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '16px',
              color: 'white',
            }}
          >
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.125rem' }}>
              📚 Compliance Resources
            </h3>
            <ul
              style={{
                margin: 0,
                padding: '0 0 0 16px',
                listStyle: 'none',
              }}
            >
              <li style={{ marginBottom: '8px' }}>
                <a
                  href='#'
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'white',
                      marginRight: '8px',
                    }}
                  />
                  DOT Compliance Guide
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a
                  href='#'
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'white',
                      marginRight: '8px',
                    }}
                  ></span>
                  ELD Compliance Training
                </a>
              </li>
              <li>
                <a
                  href='#'
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'white',
                      marginRight: '8px',
                    }}
                  ></span>
                  Hours of Service Regulations
                </a>
              </li>
            </ul>
          </div>

          <div
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '16px',
              color: 'white',
            }}
          >
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.125rem' }}>
              📋 Document Templates
            </h3>
            <ul
              style={{
                margin: 0,
                padding: '0 0 0 16px',
                listStyle: 'none',
              }}
            >
              <li style={{ marginBottom: '8px' }}>
                <a
                  href='#'
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'white',
                      marginRight: '8px',
                    }}
                  ></span>
                  Driver Qualification File
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a
                  href='#'
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'white',
                      marginRight: '8px',
                    }}
                  ></span>
                  Vehicle Inspection Reports
                </a>
              </li>
              <li>
                <a
                  href='#'
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'white',
                      marginRight: '8px',
                    }}
                  ></span>
                  Accident Report Forms
                </a>
              </li>
            </ul>
          </div>

          <div
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '16px',
              color: 'white',
            }}
          >
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.125rem' }}>
              🧑‍🔧 Support Resources
            </h3>
            <ul
              style={{
                margin: 0,
                padding: '0 0 0 16px',
                listStyle: 'none',
              }}
            >
              <li style={{ marginBottom: '8px' }}>
                <a
                  href='#'
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'white',
                      marginRight: '8px',
                    }}
                  ></span>
                  Contact Compliance Officer
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a
                  href='#'
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'white',
                      marginRight: '8px',
                    }}
                  ></span>
                  Schedule Compliance Review
                </a>
              </li>
              <li>
                <a
                  href='#'
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'white',
                      marginRight: '8px',
                    }}
                  ></span>
                  Request Document Assistance
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
