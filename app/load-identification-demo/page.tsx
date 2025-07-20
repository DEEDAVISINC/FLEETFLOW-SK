'use client';

import React, { useState } from 'react';
import ComprehensiveLoadForm from '../components/ComprehensiveLoadForm';
import { LoadIdentificationService } from '../services/LoadIdentificationService';

export default function LoadIdentificationDemoPage() {
  const [showForm, setShowForm] = useState(false);
  const [recentLoads, setRecentLoads] = useState<any[]>([]);
  const [selectedLoad, setSelectedLoad] = useState<any>(null);

  const handleLoadCreated = (loadData: any) => {
    setRecentLoads(prev => [loadData, ...prev].slice(0, 10));
    setShowForm(false);
  };

  const exampleLoads = [
    {
      id: 'JD-25001-ATLMIA-WMT-DVFM-001',
      origin: 'Atlanta, GA',
      destination: 'Miami, FL',
      equipment: 'Dry Van',
      loadType: 'FTL',
      weightClass: 'Medium',
      rate: 2450,
      commodity: 'Electronics',
      weight: '45,000 lbs',
      pickupDate: '2025-01-01',
      shipperName: 'Walmart Distribution',
      brokerInitials: 'JD',
      brokerName: 'John Doe',
      identifiers: {
        loadId: 'JD-25001-ATLMIA-WMT-DVFM-001',
        shortId: 'JD-25001-ATLMIA-001',
        trackingNumber: 'TR4A8B9C2D',
        bolNumber: 'BOL20250101ABCD',
        proNumber: 'PROJD5678',
        routeCode: 'ATLMIA',
        equipmentCode: 'DV',
        weightClassCode: 'M',
        serviceCode: 'S',
        brokerReference: 'JD-A2B3C4',
        shipperReference: 'WMT-D5E6F7',
        vendorReference: 'WMT-G8H9I0'
      }
    },
    {
      id: 'SM-25002-CHIDFW-AMZ-RFH-002',
      origin: 'Chicago, IL',
      destination: 'Dallas, TX',
      equipment: 'Refrigerated',
      loadType: 'Expedited',
      weightClass: 'Heavy',
      rate: 3200,
      commodity: 'Food Products',
      weight: '55,000 lbs',
      pickupDate: '2025-01-02',
      shipperName: 'Amazon Fulfillment',
      brokerInitials: 'SM',
      brokerName: 'Sarah Miller',
      identifiers: {
        loadId: 'SM-25002-CHIDFW-AMZ-RFH-002',
        shortId: 'SM-25002-CHIDFW-002',
        trackingNumber: 'TR5B9C3E7F',
        bolNumber: 'BOL20250102EFGH',
        proNumber: 'PROSM9012',
        routeCode: 'CHIDFW',
        equipmentCode: 'RF',
        weightClassCode: 'H',
        serviceCode: 'E',
        brokerReference: 'SM-E7F8G9',
        shipperReference: 'AMZ-H0I1J2',
        vendorReference: 'AMZ-K3L4M5'
      }
    },
    {
      id: 'TC-25003-NYCSEA-HD-FBHO-003',
      origin: 'New York, NY',
      destination: 'Seattle, WA',
      equipment: 'Flatbed',
      loadType: 'Hazmat',
      weightClass: 'Overweight',
      rate: 4100,
      commodity: 'Construction Materials',
      weight: '65,000 lbs',
      pickupDate: '2025-01-03',
      shipperName: 'Home Depot Supply',
      brokerInitials: 'TC',
      brokerName: 'Tom Chen',
      identifiers: {
        loadId: 'TC-25003-NYCSEA-HD-FBHO-003',
        shortId: 'TC-25003-NYCSEA-003',
        trackingNumber: 'TR6C4D8A2B',
        bolNumber: 'BOL20250103IJKL',
        proNumber: 'PROTC3456',
        routeCode: 'NYCSEA',
        equipmentCode: 'FB',
        weightClassCode: 'O',
        serviceCode: 'H',
        brokerReference: 'TC-A2B3C4',
        shipperReference: 'HD-D5E6F7',
        vendorReference: 'HD-G8H9I0'
      }
    }
  ];

  const parseLoadIdComponents = (loadId: string) => {
    const parsed = LoadIdentificationService.parseLoadId(loadId);
    return {
      isValid: parsed.isValid,
      year: parsed.dateCode ? '20' + parsed.dateCode.substring(0, 2) : '',
      dayOfYear: parsed.dateCode ? parsed.dateCode.substring(2) : '',
      route: parsed.routeCode,
      shipper: parsed.shipperCode,
      equipment: parsed.equipmentCode,
      broker: parsed.brokerInitials,
      sequence: parsed.sequence
    };
  };

  if (showForm) {
    return (
      <ComprehensiveLoadForm
        onLoadCreated={handleLoadCreated}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(15px)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            🔢 Interoffice Load Identification System
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            Generate comprehensive load identifiers with broker initials, shipper codes, and weight classifications
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px'
          }}>
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #28a745, #20c997)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              🚛 Create New Load
            </button>
          </div>
        </div>

        {/* System Features */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(15px)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '24px'
          }}>
            🎯 Interoffice System Features
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>
                👤 Broker Identification
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.5' }}>
                Uses broker initials (JD, SM, TC) for interoffice load tracking and accountability
              </p>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>
                🏢 Shipper/Vendor Codes
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.5' }}>
                Includes shipper codes (WMT=Walmart, AMZ=Amazon, HD=Home Depot) for quick identification
              </p>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>
                ⚖️ Weight Classification
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.5' }}>
                Categorizes loads by weight class (L=Light, M=Medium, H=Heavy, O=Overweight)
              </p>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>
                📅 Date Encoding
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.5' }}>
                Uses YYDDD format (25001 = January 1st, 2025) for compact date representation
              </p>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>
                📍 Route Identification
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.5' }}>
                Combines origin and destination codes (ATLMIA = Atlanta to Miami)
              </p>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>
                🔗 Reference Numbers
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.5' }}>
                Generates BOL, PRO, tracking numbers, and broker/shipper references automatically
              </p>
            </div>
          </div>
        </div>

        {/* ID Format Explanation */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(15px)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '24px'
          }}>
            📋 Interoffice Load ID Format
          </h2>
          
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '24px'
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#2563eb',
              fontFamily: 'monospace',
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              JD-25001-ATLMIA-WMT-DVFM-001
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '16px',
              marginTop: '20px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffd700' }}>25001</div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>Jan 1, 2025</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffd700' }}>ATLMIA</div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>ATL→MIA</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffd700' }}>WMT</div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>Walmart</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffd700' }}>DVFM</div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>DV FTL Medium</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffd700' }}>JD</div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>John Doe</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffd700' }}>001</div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>Sequence</div>
              </div>
            </div>
          </div>
          
          {/* Weight Class Legend */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
              Weight Class Codes
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px'
            }}>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <span style={{ color: '#ffd700', fontWeight: 'bold' }}>L</span> - Light (Under 20,000 lbs)
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <span style={{ color: '#ffd700', fontWeight: 'bold' }}>M</span> - Medium (20,000 - 40,000 lbs)
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <span style={{ color: '#ffd700', fontWeight: 'bold' }}>H</span> - Heavy (40,000 - 60,000 lbs)
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <span style={{ color: '#ffd700', fontWeight: 'bold' }}>O</span> - Overweight (Over 60,000 lbs)
              </div>
            </div>
          </div>
        </div>

        {/* Example Loads */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(15px)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '24px'
          }}>
            📊 Example Interoffice Load Identifiers
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '24px'
          }}>
            {exampleLoads.map((load, index) => {
              const components = parseLoadIdComponents(load.id);
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '24px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onClick={() => setSelectedLoad(load)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#ffd700',
                    fontFamily: 'monospace',
                    marginBottom: '16px'
                  }}>
                    {load.id}
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '12px'
                  }}>
                    <div><strong>Route:</strong> {load.origin} → {load.destination}</div>
                    <div><strong>Equipment:</strong> {load.equipment}</div>
                    <div><strong>Weight Class:</strong> {load.weightClass}</div>
                    <div><strong>Rate:</strong> ${load.rate.toLocaleString()}</div>
                    <div><strong>Shipper:</strong> {load.shipperName}</div>
                    <div><strong>Broker:</strong> {load.brokerName} ({load.brokerInitials})</div>
                  </div>
                  
                  <div style={{
                    padding: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                      <div><strong>Tracking:</strong> {load.identifiers.trackingNumber}</div>
                      <div><strong>BOL:</strong> {load.identifiers.bolNumber}</div>
                      <div><strong>PRO:</strong> {load.identifiers.proNumber}</div>
                      <div><strong>Weight Code:</strong> {load.identifiers.weightClassCode}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Loads */}
        {recentLoads.length > 0 && (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(15px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '24px'
            }}>
              🕒 Recently Created Loads
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {recentLoads.map((load, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#ffd700',
                    fontFamily: 'monospace',
                    marginBottom: '12px'
                  }}>
                    {load.id}
                  </div>
                  
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '8px'
                  }}>
                    {load.origin} → {load.destination}
                  </div>
                  
                  <div style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '4px'
                  }}>
                    <div>{load.equipment} • {load.loadType}</div>
                    <div>{load.weightClass} • ${load.rate?.toLocaleString()}</div>
                    <div>Shipper: {load.shipperName}</div>
                    <div>Broker: {load.brokerInitials}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Load Details Modal */}
        {selectedLoad && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: 0
                }}>
                  Load Details
                </h2>
                <button
                  onClick={() => setSelectedLoad(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6c757d'
                  }}
                >
                  ×
                </button>
              </div>
              
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '24px'
              }}>
                <div style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#007bff',
                  fontFamily: 'monospace',
                  marginBottom: '8px'
                }}>
                  {selectedLoad.id}
                </div>
                <div style={{ fontSize: '16px', color: '#495057' }}>
                  {selectedLoad.origin} → {selectedLoad.destination}
                </div>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{
                  backgroundColor: '#e9ecef',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#6c757d',
                    marginBottom: '8px'
                  }}>
                    Short ID
                  </h4>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '16px',
                    color: '#212529'
                  }}>
                    {selectedLoad.identifiers.shortId}
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: '#e9ecef',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#6c757d',
                    marginBottom: '8px'
                  }}>
                    Tracking Number
                  </h4>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '16px',
                    color: '#212529'
                  }}>
                    {selectedLoad.identifiers.trackingNumber}
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: '#e9ecef',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#6c757d',
                    marginBottom: '8px'
                  }}>
                    BOL Number
                  </h4>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '16px',
                    color: '#212529'
                  }}>
                    {selectedLoad.identifiers.bolNumber}
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: '#e9ecef',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#6c757d',
                    marginBottom: '8px'
                  }}>
                    PRO Number
                  </h4>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '16px',
                    color: '#212529'
                  }}>
                    {selectedLoad.identifiers.proNumber}
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{
                  backgroundColor: '#e3f2fd',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1565c0',
                    marginBottom: '8px'
                  }}>
                    Broker Reference
                  </h4>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '16px',
                    color: '#212529'
                  }}>
                    {selectedLoad.identifiers.brokerReference}
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: '#e8f5e8',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#2e7d32',
                    marginBottom: '8px'
                  }}>
                    Shipper Reference
                  </h4>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '16px',
                    color: '#212529'
                  }}>
                    {selectedLoad.identifiers.shipperReference}
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: '#fff3e0',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#f57c00',
                    marginBottom: '8px'
                  }}>
                    Weight Class
                  </h4>
                  <div style={{
                    fontSize: '16px',
                    color: '#212529'
                  }}>
                    {selectedLoad.identifiers.weightClassCode} - {LoadIdentificationService.getWeightClassDescription(selectedLoad.identifiers.weightClassCode)}
                  </div>
                </div>
              </div>
              
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '12px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#495057',
                  marginBottom: '16px'
                }}>
                  Load Information
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  <div><strong>Equipment:</strong> {selectedLoad.equipment}</div>
                  <div><strong>Load Type:</strong> {selectedLoad.loadType}</div>
                  <div><strong>Weight Class:</strong> {selectedLoad.weightClass}</div>
                  <div><strong>Rate:</strong> ${selectedLoad.rate.toLocaleString()}</div>
                  <div><strong>Weight:</strong> {selectedLoad.weight}</div>
                  <div><strong>Commodity:</strong> {selectedLoad.commodity}</div>
                  <div><strong>Pickup Date:</strong> {selectedLoad.pickupDate}</div>
                  <div><strong>Shipper:</strong> {selectedLoad.shipperName}</div>
                  <div><strong>Broker:</strong> {selectedLoad.brokerName} ({selectedLoad.brokerInitials})</div>
                  <div><strong>Route Code:</strong> {selectedLoad.identifiers.routeCode}</div>
                  <div><strong>Equipment Code:</strong> {selectedLoad.identifiers.equipmentCode}</div>
                  <div><strong>Service Code:</strong> {selectedLoad.identifiers.serviceCode}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 