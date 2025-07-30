'use client';

import { useState } from 'react';
import EDIService from '../services/EDIService';

export default function LoadIdentifierDemo() {
  const [companyName, setCompanyName] = useState('Walmart Distribution');
  const [transactionType, setTransactionType] = useState('load tender');
  const [commodityName, setCommodityName] = useState('electronics');
  const [loadType, setLoadType] = useState('FTL');
  const [equipmentType, setEquipmentType] = useState('dry van');
  const [generatedLoadId, setGeneratedLoadId] = useState<any>(null);
  const [parsedLoadId, setParsedLoadId] = useState<any>(null);
  const [testLoadIdentifier, setTestLoadIdentifier] = useState('WMT-204-070-FTL-DRY-001-20250115');
  const [brokerName, setBrokerName] = useState('FleetFlow Management');
  const [dispatcherName, setDispatcherName] = useState('Sarah Johnson');
  const [loadBoardNumber, setLoadBoardNumber] = useState<any>(null);

  const generateLoadIdentifier = () => {
    try {
      // First generate the shipper identifier
      const transactionCode = EDIService.getTransactionCode(transactionType);
      const commodityCode = EDIService.getCommodityCode(commodityName);

      const shipperId = EDIService.generateShipperIdentifier(
        companyName,
        transactionCode,
        commodityCode
      );

      // Then generate the load identifier using the shipper ID
      const loadTypeCode = EDIService.getLoadTypeCode(loadType);
      const equipmentCode = EDIService.getEquipmentTypeCode(equipmentType);

      const loadId = EDIService.generateLoadIdentifier(
        shipperId.fullId,
        loadTypeCode,
        equipmentCode
      );

      setGeneratedLoadId({
        shipperId: shipperId,
        loadId: loadId
      });
    } catch (error) {
      alert(`Error generating load identifier: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const parseLoadIdentifier = () => {
    const parsed = EDIService.parseLoadIdentifier(testLoadIdentifier);
    setParsedLoadId(parsed);
  };

  const validateLoadIdentifier = () => {
    const isValid = EDIService.validateLoadIdentifier(testLoadIdentifier);
    alert(`Load Identifier "${testLoadIdentifier}" is ${isValid ? 'VALID' : 'INVALID'}`);
  };

  const extractShipperId = () => {
    const shipperId = EDIService.extractShipperIdFromLoadId(testLoadIdentifier);
    if (shipperId) {
      alert(`Shipper ID extracted: ${shipperId}`);
    } else {
      alert('Could not extract shipper ID from load identifier');
    }
  };

  const generateLoadBoardNumber = () => {
    try {
      // Generate load board number using the new function
      const loadBoardId = EDIService.generateLoadBoardId({
        brokerName: brokerName,
        shipperInfo: {
          companyName: companyName,
          permanentId: undefined
        },
        dispatcherName: dispatcherName,
        loadType: loadType,
        equipment: equipmentType
      });

      setLoadBoardNumber(loadBoardId);
    } catch (error) {
      alert(`Error generating load board number: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const sampleCompanies = [
    'Walmart Distribution',
    'Amazon Logistics',
    'Target Corporation',
    'Home Depot',
    'Costco Wholesale',
    'Lowe\'s Companies',
    'Best Buy',
    'Apple Inc',
    'Microsoft Corporation',
    'Tesla Motors'
  ];

  const sampleCommodities = [
    'electronics',
    'auto parts',
    'food',
    'clothing',
    'furniture',
    'steel',
    'machinery',
    'chemicals',
    'beverages',
    'appliances'
  ];

  const sampleLoadTypes = [
    'FTL',
    'LTL',
    'EXP',
    'HOT',
    'INT',
    'PAR',
    'TEA',
    'SOL'
  ];

  const sampleEquipmentTypes = [
    'dry van',
    'reefer',
    'flatbed',
    'step deck',
    'power only',
    'container',
    'tanker',
    'lowboy',
    'conestoga',
    'box truck'
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #059669 0%, #047857 25%, #065f46 50%, #064e3b 75%, #022c22 100%)',
      minHeight: '100vh',
      padding: '80px 20px 20px 20px'
    }}>
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '40px 32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 16px 0',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            🚛 Load Identifier System
          </h1>
          <p style={{
            fontSize: '22px',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: '0 0 16px 0',
            fontWeight: '500'
          }}>
            Rate Cons & Bills of Lading - First 9 Characters = Shipper ID
          </p>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: 0
          }}>
            Format: {`{SHIPPER_ID}-{LOAD_TYPE}-{EQUIPMENT}-{SEQUENCE}-{DATE}`}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px'
        }}>
          {/* Generator Section */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '24px'
            }}>
              🔧 Generate Load ID
            </h2>

            {/* Company Name */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#fbbf24',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Shipper Company
              </label>
              <select
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '16px'
                }}
              >
                {sampleCompanies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>

            {/* Transaction Type */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#fbbf24',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Transaction Type
              </label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '16px'
                }}
              >
                <option value="load tender">Load Tender</option>
                <option value="quote">Quote</option>
                <option value="status">Status Update</option>
                <option value="invoice">Invoice</option>
                <option value="manifest">Manifest</option>
              </select>
            </div>

            {/* Commodity */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#fbbf24',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Commodity
              </label>
              <select
                value={commodityName}
                onChange={(e) => setCommodityName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '16px'
                }}
              >
                {sampleCommodities.map(commodity => (
                  <option key={commodity} value={commodity}>{commodity}</option>
                ))}
              </select>
            </div>

            {/* Load Type */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#fbbf24',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Load Type
              </label>
              <select
                value={loadType}
                onChange={(e) => setLoadType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '16px'
                }}
              >
                {sampleLoadTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Equipment Type */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: '#fbbf24',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Equipment Type
              </label>
              <select
                value={equipmentType}
                onChange={(e) => setEquipmentType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '16px'
                }}
              >
                {sampleEquipmentTypes.map(equipment => (
                  <option key={equipment} value={equipment}>{equipment}</option>
                ))}
              </select>
            </div>

            <button
              onClick={generateLoadIdentifier}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🚀 Generate Load ID
            </button>
          </div>

          {/* Parser Section */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '24px'
            }}>
              🔍 Parse Load ID
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#fbbf24',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Load Identifier
              </label>
              <input
                type="text"
                value={testLoadIdentifier}
                onChange={(e) => setTestLoadIdentifier(e.target.value)}
                placeholder="Enter load ID (e.g., WMT-204-070-FTL-DRY-001-20250115)"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <button
                onClick={parseLoadIdentifier}
                style={{
                  padding: '12px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🔍 Parse
              </button>
              <button
                onClick={validateLoadIdentifier}
                style={{
                  padding: '12px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✅ Validate
              </button>
            </div>

            <button
              onClick={extractShipperId}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🏷️ Extract Shipper ID
            </button>
          </div>
        </div>

        {/* Results Section */}
        {(generatedLoadId || parsedLoadId) && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginTop: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '24px'
            }}>
              📊 Results
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: generatedLoadId && parsedLoadId ? '1fr 1fr' : '1fr',
              gap: '24px'
            }}>
              {/* Generated Load ID Results */}
              {generatedLoadId && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px'
                }}>
                  <h3 style={{
                    color: '#10b981',
                    marginBottom: '16px',
                    fontSize: '20px'
                  }}>
                    🆔 Generated Load ID
                  </h3>

                  <div style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#fbbf24',
                      fontFamily: 'monospace',
                      wordBreak: 'break-all'
                    }}>
                      {generatedLoadId.loadId.fullId}
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      color: '#10b981',
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}>
                      Shipper ID (First 9 characters):
                    </div>
                    <div style={{
                      fontSize: '16px',
                      color: 'white',
                      fontFamily: 'monospace'
                    }}>
                      {generatedLoadId.shipperId.fullId}
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px'
                  }}>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>Load Type:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{generatedLoadId.loadId.breakdown.loadType}</div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>Equipment:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{generatedLoadId.loadId.breakdown.equipment}</div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>Sequence:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{generatedLoadId.loadId.breakdown.sequence}</div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>Date:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{generatedLoadId.loadId.breakdown.date}</div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>Valid:</span>
                      <div style={{ color: generatedLoadId.loadId.isValid ? '#10b981' : '#ef4444', fontWeight: '600' }}>
                        {generatedLoadId.loadId.isValid ? '✅ Yes' : '❌ No'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Parsed Load ID Results */}
              {parsedLoadId && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px'
                }}>
                  <h3 style={{
                    color: '#3b82f6',
                    marginBottom: '16px',
                    fontSize: '20px'
                  }}>
                    🔍 Parsed Load ID
                  </h3>

                  <div style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#fbbf24',
                      fontFamily: 'monospace',
                      wordBreak: 'break-all'
                    }}>
                      {parsedLoadId.fullId}
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      color: '#3b82f6',
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}>
                      Shipper ID Extracted:
                    </div>
                    <div style={{
                      fontSize: '16px',
                      color: 'white',
                      fontFamily: 'monospace'
                    }}>
                      {parsedLoadId.shipperId}
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px'
                  }}>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>Load Type:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{parsedLoadId.breakdown.loadType}</div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>Equipment:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{parsedLoadId.breakdown.equipment}</div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>Sequence:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{parsedLoadId.breakdown.sequence}</div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>Date:</span>
                      <div style={{ color: 'white', fontWeight: '600' }}>{parsedLoadId.breakdown.date}</div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>Valid:</span>
                      <div style={{ color: parsedLoadId.isValid ? '#10b981' : '#ef4444', fontWeight: '600' }}>
                        {parsedLoadId.isValid ? '✅ Yes' : '❌ No'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Load Board Number Generation for Phone Communication */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            📞 Load Board Number Generator
          </h2>

          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            Generate simple 6-digit load board numbers for easy phone communication
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '24px'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '8px'
              }}>
                Broker Name
              </label>
              <select
                value={brokerName}
                onChange={(e) => setBrokerName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '16px'
                }}
              >
                <option value="FleetFlow Management">FleetFlow Management (Code: 1)</option>
                <option value="Express Logistics">Express Logistics (Code: 2)</option>
                <option value="Reliable Freight">Reliable Freight (Code: 3)</option>
                <option value="Quick Haul Inc">Quick Haul Inc (Code: 4)</option>
                <option value="Mountain View Transport">Mountain View Transport (Code: 5)</option>
                <option value="ABC Transport LLC">ABC Transport LLC (Code: 6)</option>
                <option value="Premium Carriers">Premium Carriers (Code: 7)</option>
                <option value="Swift Delivery">Swift Delivery (Code: 8)</option>
                <option value="Elite Logistics">Elite Logistics (Code: 9)</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '8px'
              }}>
                Dispatcher Name
              </label>
              <input
                type="text"
                value={dispatcherName}
                onChange={(e) => setDispatcherName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '16px'
                }}
                placeholder="Sarah Johnson"
              />
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            <button
              onClick={generateLoadBoardNumber}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }}
            >
              📞 Generate Load Board Number
            </button>
          </div>

          {loadBoardNumber && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                📞 Load Board Number Generated
              </h3>

              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#10b981',
                  marginBottom: '8px',
                  fontFamily: 'monospace'
                }}>
                  {loadBoardNumber.loadBoardNumber}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                  Easy to communicate over the phone - just 6 digits!
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                    Broker Code
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>
                    {loadBoardNumber.breakdown.brokerCode}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                    {loadBoardNumber.breakdown.brokerName}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                    Sequence
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>
                    {loadBoardNumber.breakdown.sequence}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                    Load number
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                    Shipper
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>
                    {loadBoardNumber.breakdown.shipperName}
                  </div>
                </div>

                {loadBoardNumber.breakdown.dispatcherName && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '12px'
                  }}>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                      Dispatcher
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>
                      {loadBoardNumber.breakdown.dispatcherName}
                    </div>
                  </div>
                )}
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.2)',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#10b981',
                  marginBottom: '8px'
                }}>
                  🏷️ Full Load Identifier (System Use)
                </h4>
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all'
                }}>
                  {loadBoardNumber.fullLoadId}
                </div>
              </div>

              <div style={{
                background: 'rgba(59, 130, 246, 0.2)',
                borderRadius: '8px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#3b82f6',
                  marginBottom: '8px'
                }}>
                  📞 Phone Communication Example
                </h4>
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontStyle: 'italic'
                }}>
                  <strong>Carrier:</strong> "Hi, I'm calling about load board number {loadBoardNumber.loadBoardNumber}"<br/>
                  <strong>Dispatcher:</strong> "Yes, that's load board number {loadBoardNumber.loadBoardNumber} for {loadBoardNumber.breakdown.shipperName}, assigned to {loadBoardNumber.breakdown.dispatcherName}"
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Information Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          marginTop: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '24px'
          }}>
            📚 Load ID System Overview
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px'
          }}>
            {/* Format Breakdown */}
            <div>
              <h3 style={{
                color: '#fbbf24',
                marginBottom: '16px',
                fontSize: '20px'
              }}>
                🏗️ Load ID Format
              </h3>
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                padding: '16px',
                fontFamily: 'monospace',
                fontSize: '14px',
                color: 'white'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#10b981' }}>WMT-204-070</span>
                  <span style={{ color: '#fbbf24' }}>-</span>
                  <span style={{ color: '#3b82f6' }}>FTL</span>
                  <span style={{ color: '#fbbf24' }}>-</span>
                  <span style={{ color: '#ec4899' }}>DRY</span>
                  <span style={{ color: '#fbbf24' }}>-</span>
                  <span style={{ color: '#8b5cf6' }}>001</span>
                  <span style={{ color: '#fbbf24' }}>-</span>
                  <span style={{ color: '#06b6d4' }}>20250115</span>
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  Shipper ID | Load Type | Equipment | Sequence | Date
                </div>
                <div style={{ fontSize: '12px', color: '#10b981', marginTop: '8px' }}>
                  First 9 characters = Shipper Identifier
                </div>
              </div>
            </div>

            {/* Load Types */}
            <div>
              <h3 style={{
                color: '#fbbf24',
                marginBottom: '16px',
                fontSize: '20px'
              }}>
                🚛 Load Types
              </h3>
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '14px',
                color: 'white'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#3b82f6' }}>FTL</span> - Full Truckload
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#3b82f6' }}>LTL</span> - Less Than Truckload
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#3b82f6' }}>EXP</span> - Expedited
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#3b82f6' }}>HOT</span> - Hot Shot
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#3b82f6' }}>INT</span> - Intermodal
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
