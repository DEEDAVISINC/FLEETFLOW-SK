'use client';

import { useState } from 'react';
import RateConfirmation from '../components/RateConfirmation';
import BillOfLading from '../components/BillOfLading';
import Logo from '../components/Logo';
import { useLoad } from '../contexts/LoadContext';
import Link from 'next/link';

export default function DocumentsPage() {
  const [activeDocument, setActiveDocument] = useState<'rate-confirmation' | 'bill-of-lading'>('rate-confirmation');
  const { selectedLoad, loadHistory, setSelectedLoad } = useLoad();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FF9800 0%, #E65100 100%)',
      paddingTop: '80px'
    }}>
      {/* Back Button */}
      <div style={{ padding: '24px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '16px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <span style={{ marginRight: '8px' }}>←</span>
            Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Main Container */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px 32px'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px'
              }}>
                <span style={{ fontSize: '32px' }}>📄</span>
              </div>
              <div>
                <h1 style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 8px 0',
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)'
                }}>
                  Document Generation
                </h1>
                <p style={{
                  fontSize: '18px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: '0 0 8px 0'
                }}>
                  Create ironclad freight documents with auto-populated load data
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      background: '#4ade80',
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite'
                    }}></div>
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                      Auto-Population Active
                    </span>
                  </div>
                  <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    {loadHistory.length} loads available
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['rate-confirmation', 'bill-of-lading'] as const).map((docType) => (
                <button
                  key={docType}
                  onClick={() => setActiveDocument(docType)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    cursor: 'pointer',
                    background: activeDocument === docType 
                      ? 'rgba(255, 255, 255, 0.25)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {docType === 'rate-confirmation' ? '📄 Rate Confirmation' : '📋 Bill of Lading'}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Load Selection Section */}
        {loadHistory.length > 0 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '600', color: 'white', margin: 0 }}>
                Recent Loads
              </h3>
              <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                {loadHistory.length} loads available
              </span>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              marginBottom: '24px'
            }}>
              {loadHistory.slice(0, 6).map((load) => (
                <div 
                  key={load.id}
                  style={{
                    background: selectedLoad?.id === load.id 
                      ? 'rgba(255, 255, 255, 0.25)' 
                      : 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: selectedLoad?.id === load.id 
                      ? '2px solid rgba(255, 255, 255, 0.5)' 
                      : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedLoad?.id === load.id 
                      ? '0 8px 32px rgba(0, 0, 0, 0.2)' 
                      : '0 4px 16px rgba(0, 0, 0, 0.1)'
                  }}
                  onClick={() => setSelectedLoad(load)}
                  onMouseOver={(e) => {
                    if (selectedLoad?.id !== load.id) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedLoad?.id !== load.id) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <span style={{ fontWeight: 'bold', color: 'white', fontSize: '18px' }}>#{load.id}</span>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontWeight: '600',
                      background: load.status === 'In Transit' ? 'rgba(59, 130, 246, 0.8)' :
                                 load.status === 'Delivered' ? 'rgba(34, 197, 94, 0.8)' :
                                 load.status === 'Assigned' ? 'rgba(251, 191, 36, 0.8)' :
                                 load.status === 'Available' ? 'rgba(156, 163, 175, 0.8)' :
                                 'rgba(147, 51, 234, 0.8)',
                      color: 'white'
                    }}>
                      {load.status}
                    </span>
                  </div>
                  
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>
                      {load.origin}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                      <span style={{ marginRight: '8px' }}>↓</span>
                      {load.destination}
                    </div>
                    
                    {load.carrierName && (
                      <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '600' }}>
                        🚛 {load.carrierName}
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                        {load.pickupDate}
                      </span>
                      {typeof load.rate === 'string' ? (
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#4ade80' }}>
                          {load.rate}
                        </span>
                      ) : (
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#4ade80' }}>
                          ${typeof load.rate === 'number' ? load.rate.toLocaleString() : '0'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedLoad ? (
              <div style={{
                background: 'rgba(34, 197, 94, 0.2)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>✅</span>
                  <span style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>
                    Load #{selectedLoad.id} Selected
                  </span>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', margin: '8px 0 0 32px' }}>
                  Document forms will be automatically populated with this load's information. You can modify any details as needed.
                </p>
              </div>
            ) : (
              <div style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>ℹ️</span>
                  <span style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>
                    Click a load to auto-populate document forms
                  </span>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', margin: '8px 0 0 32px' }}>
                  Select a load from above to automatically fill in Rate Confirmation and Bill of Lading forms.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Document Generator */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {activeDocument === 'rate-confirmation' && <RateConfirmation />}
          {activeDocument === 'bill-of-lading' && <BillOfLading />}
        </div>

        {/* Legal Notice */}
        <div style={{
          background: 'rgba(251, 191, 36, 0.2)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(251, 191, 36, 0.4)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{
              padding: '12px',
              background: 'rgba(251, 191, 36, 0.3)',
              borderRadius: '12px',
              flexShrink: 0
            }}>
              <span style={{ fontSize: '24px' }}>⚠️</span>
            </div>
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', color: 'white', margin: '0 0 12px 0' }}>
                Legal Notice
              </h4>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', margin: 0, lineHeight: '1.6' }}>
                These documents are generated for freight transportation purposes and contain legally binding terms. 
                Please ensure all information is accurate and complete before finalizing. FleetFlow recommends 
                consulting with legal counsel for specific freight contract requirements.
              </p>
            </div>
          </div>
        </div>

        {/* Integrated Workflow Navigation */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: 'white', fontSize: '24px', fontWeight: '600', marginBottom: '24px', textAlign: 'center' }}>
            🔗 Integrated Workflow Access
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px', marginBottom: '32px', textAlign: 'center' }}>
            Connect directly to dispatch, carrier, and broker systems for seamless document workflow
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {/* Dispatch Central */}
            <Link href="/dispatch" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚛</div>
                <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                  Dispatch Central
                </h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: 0 }}>
                  Load assignments & dispatch management
                </p>
              </div>
            </Link>

            {/* Broker Dashboard */}
            <Link href="/broker/dashboard" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏢</div>
                <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                  Broker Dashboard
                </h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: 0 }}>
                  Broker communications & load coordination
                </p>
              </div>
            </Link>

            {/* Driver Portal */}
            <Link href="/driver-portal" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>👨‍💼</div>
                <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                  Driver Portal
                </h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: 0 }}>
                  Document delivery & digital signatures
                </p>
              </div>
            </Link>

            {/* Carrier Management */}
            <Link href="/carriers" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚚</div>
                <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                  Carrier Management
                </h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: 0 }}>
                  Carrier-specific templates & branding
                </p>
              </div>
            </Link>

            {/* Individual Dispatch Portal */}
            <Link href="/workflow-portal" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                  Workflow Portal
                </h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: 0 }}>
                  Individual dispatcher workflows
                </p>
              </div>
            </Link>

            {/* Shipper Portal */}
            <Link href="/shipper-portal" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                  Shipper Portal
                </h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: 0 }}>
                  Shipper documentation & approvals
                </p>
              </div>
            </Link>

            {/* Training Center */}
            <Link href="/training" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(139, 92, 246, 0.3)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
                <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                  Training Center
                </h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: 0 }}>
                  Professional development & certification
                </p>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
