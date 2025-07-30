'use client';

import { useState } from 'react';
import EDIService from '../services/EDIService';

export default function PermanentShipperDemo() {
  const [companyName, setCompanyName] = useState('Walmart Distribution');
  const [transactionType, setTransactionType] = useState('load tender');
  const [commodityName, setCommodityName] = useState('electronics');
  const [generatedPermanentId, setGeneratedPermanentId] = useState<any>(null);
  const [loadIdWithPermanent, setLoadIdWithPermanent] = useState<any>(null);
  const [existingShippers, setExistingShippers] = useState<any[]>([]);

  const generatePermanentShipperId = () => {
    try {
      const transactionCode = EDIService.getTransactionCode(transactionType);
      const commodityCode = EDIService.getCommodityCode(commodityName);

      const permanentId = EDIService.generatePermanentShipperId(
        companyName,
        transactionCode,
        commodityCode,
        existingShippers
      );

      setGeneratedPermanentId(permanentId);

      // Add to existing shippers list
      setExistingShippers((prev) => [...prev, permanentId]);
    } catch (error) {
      alert(`Error generating permanent shipper ID: ${error.message}`);
    }
  };

  const generateLoadIdWithPermanent = () => {
    if (!generatedPermanentId) {
      alert('Please generate a permanent shipper ID first');
      return;
    }

    try {
      // Convert permanent ID to full shipper ID
      const fullShipperId = EDIService.permanentIdToShipperId(
        generatedPermanentId.id,
        generatedPermanentId.transactionCode,
        generatedPermanentId.commodityCode
      );

      // Generate load identifier using the permanent shipper ID
      const loadId = EDIService.generateLoadIdentifier(
        fullShipperId,
        'FTL',
        'DRY',
        'STD'
      );

      setLoadIdWithPermanent({
        permanentId: generatedPermanentId,
        fullShipperId,
        loadId,
      });
    } catch (error) {
      alert(`Error generating load ID: ${error.message}`);
    }
  };

  const clearShippers = () => {
    setExistingShippers([]);
    setGeneratedPermanentId(null);
    setLoadIdWithPermanent(null);
  };

  const sampleCompanies = [
    'Walmart Distribution',
    'Amazon Logistics',
    'Target Corporation',
    'Home Depot',
    'Costco Wholesale',
    "Lowe's Companies",
    'Best Buy',
    'Apple Inc',
    'Microsoft Corporation',
    'Tesla Motors',
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
    'appliances',
  ];

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, #7c3aed 0%, #6d28d9 25%, #5b21b6 50%, #4c1d95 75%, #2e1065 100%)',
        minHeight: '100vh',
        padding: '80px 20px 20px 20px',
      }}
    >
      <main
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '40px 32px',
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
            🏢 Permanent Shipper ID System
          </h1>
          <p
            style={{
              fontSize: '22px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0 0 16px 0',
              fontWeight: '500',
            }}
          >
            Generate Unique Shipper IDs When Adding to System
          </p>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: 0,
            }}
          >
            Permanent IDs: WMT001, AMZ002, TGT003 | Used in Load IDs:
            WMT-204-070-FTL-DRY-STD-001-20250115
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
          }}
        >
          {/* Generator Section */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '24px',
              }}
            >
              🔧 Generate Permanent Shipper ID
            </h2>

            {/* Company Name */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  color: '#fbbf24',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Company Name
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
                  fontSize: '16px',
                }}
              >
                {sampleCompanies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>

            {/* Transaction Type */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  color: '#fbbf24',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
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
                  fontSize: '16px',
                }}
              >
                <option value='load tender'>Load Tender</option>
                <option value='quote'>Quote</option>
                <option value='status'>Status Update</option>
                <option value='invoice'>Invoice</option>
                <option value='manifest'>Manifest</option>
              </select>
            </div>

            {/* Commodity */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  color: '#fbbf24',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
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
                  fontSize: '16px',
                }}
              >
                {sampleCommodities.map((commodity) => (
                  <option key={commodity} value={commodity}>
                    {commodity}
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
              }}
            >
              <button
                onClick={generatePermanentShipperId}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                🏢 Generate Permanent ID
              </button>
              <button
                onClick={clearShippers}
                style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                🗑️ Clear
              </button>
            </div>
          </div>

          {/* Load ID Generator */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '24px',
              }}
            >
              🚛 Generate Load ID with Priority
            </h2>

            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '24px',
                fontSize: '14px',
              }}
            >
              Generate a load identifier using the permanent shipper ID with
              priority rate key
            </p>

            <button
              onClick={generateLoadIdWithPermanent}
              disabled={!generatedPermanentId}
              style={{
                width: '100%',
                padding: '16px',
                background: generatedPermanentId
                  ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                  : 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: generatedPermanentId ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
              }}
            >
              🚀 Generate Load ID with Priority
            </button>
          </div>
        </div>

        {/* Results Section */}
        {(generatedPermanentId || loadIdWithPermanent) && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              marginTop: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '24px',
              }}
            >
              📊 Results
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  generatedPermanentId && loadIdWithPermanent
                    ? '1fr 1fr'
                    : '1fr',
                gap: '24px',
              }}
            >
              {/* Permanent Shipper ID Results */}
              {generatedPermanentId && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                  }}
                >
                  <h3
                    style={{
                      color: '#10b981',
                      marginBottom: '16px',
                      fontSize: '20px',
                    }}
                  >
                    🏢 Permanent Shipper ID
                  </h3>

                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#fbbf24',
                        fontFamily: 'monospace',
                      }}
                    >
                      {generatedPermanentId.id}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                        Company:
                      </span>
                      <div style={{ color: 'white', fontWeight: '600' }}>
                        {generatedPermanentId.companyName}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                        Initials:
                      </span>
                      <div style={{ color: 'white', fontWeight: '600' }}>
                        {generatedPermanentId.companyInitials}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                        Transaction:
                      </span>
                      <div style={{ color: 'white', fontWeight: '600' }}>
                        {generatedPermanentId.transactionCode}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                        Commodity:
                      </span>
                      <div style={{ color: 'white', fontWeight: '600' }}>
                        {generatedPermanentId.commodityCode}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                        Created:
                      </span>
                      <div style={{ color: 'white', fontWeight: '600' }}>
                        {new Date(
                          generatedPermanentId.createdAt
                        ).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                        Active:
                      </span>
                      <div
                        style={{
                          color: generatedPermanentId.isActive
                            ? '#10b981'
                            : '#ef4444',
                          fontWeight: '600',
                        }}
                      >
                        {generatedPermanentId.isActive ? '✅ Yes' : '❌ No'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Load ID with Priority Results */}
              {loadIdWithPermanent && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                  }}
                >
                  <h3
                    style={{
                      color: '#3b82f6',
                      marginBottom: '16px',
                      fontSize: '20px',
                    }}
                  >
                    🚛 Load ID with Priority
                  </h3>

                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#fbbf24',
                        fontFamily: 'monospace',
                        wordBreak: 'break-all',
                      }}
                    >
                      {loadIdWithPermanent.loadId.fullId}
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#3b82f6',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      Shipper ID (First 9 characters):
                    </div>
                    <div
                      style={{
                        fontSize: '16px',
                        color: 'white',
                        fontFamily: 'monospace',
                      }}
                    >
                      {loadIdWithPermanent.fullShipperId}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                        Load Type:
                      </span>
                      <div style={{ color: 'white', fontWeight: '600' }}>
                        {loadIdWithPermanent.loadId.breakdown.loadType}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                        Equipment:
                      </span>
                      <div style={{ color: 'white', fontWeight: '600' }}>
                        {loadIdWithPermanent.loadId.breakdown.equipment}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                        Priority:
                      </span>
                      <div style={{ color: 'white', fontWeight: '600' }}>
                        {loadIdWithPermanent.loadId.breakdown.priority}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                        Sequence:
                      </span>
                      <div style={{ color: 'white', fontWeight: '600' }}>
                        {loadIdWithPermanent.loadId.breakdown.sequence}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Existing Shippers Section */}
        {existingShippers.length > 0 && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              marginTop: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '24px',
              }}
            >
              📋 Existing Shippers ({existingShippers.length})
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              {existingShippers.map((shipper, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#fbbf24',
                      fontFamily: 'monospace',
                      marginBottom: '8px',
                    }}
                  >
                    {shipper.id}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'white',
                      marginBottom: '4px',
                    }}
                  >
                    {shipper.companyName}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    {shipper.transactionCode}-{shipper.commodityCode}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Information Section */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginTop: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '24px',
            }}
          >
            📚 Permanent Shipper ID System Overview
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '32px',
            }}
          >
            {/* Permanent ID Format */}
            <div>
              <h3
                style={{
                  color: '#fbbf24',
                  marginBottom: '16px',
                  fontSize: '20px',
                }}
              >
                🏢 Permanent ID Format
              </h3>
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  padding: '16px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  color: 'white',
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#10b981' }}>WMT</span>
                  <span style={{ color: '#fbbf24' }}>001</span>
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  Company Initials | Sequence Number
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#10b981',
                    marginTop: '8px',
                  }}
                >
                  Examples: WMT001, AMZ002, TGT003
                </div>
              </div>
            </div>

            {/* Load ID with Priority */}
            <div>
              <h3
                style={{
                  color: '#fbbf24',
                  marginBottom: '16px',
                  fontSize: '20px',
                }}
              >
                🚛 Load ID with Priority
              </h3>
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  padding: '16px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  color: 'white',
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#10b981' }}>WMT-204-070</span>
                  <span style={{ color: '#fbbf24' }}>-</span>
                  <span style={{ color: '#3b82f6' }}>FTL</span>
                  <span style={{ color: '#fbbf24' }}>-</span>
                  <span style={{ color: '#ec4899' }}>DRY</span>
                  <span style={{ color: '#fbbf24' }}>-</span>
                  <span style={{ color: '#8b5cf6' }}>STD</span>
                  <span style={{ color: '#fbbf24' }}>-</span>
                  <span style={{ color: '#06b6d4' }}>001</span>
                  <span style={{ color: '#fbbf24' }}>-</span>
                  <span style={{ color: '#f59e0b' }}>20250115</span>
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  Shipper ID | Load Type | Equipment | Priority | Sequence |
                  Date
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
