'use client';

import { useState } from 'react';
import EDIService from '../services/EDIService';

export default function ShipperIdentifierDemo() {
  const [companyName, setCompanyName] = useState('Walmart Distribution');
  const [transactionType, setTransactionType] = useState('load tender');
  const [commodityName, setCommodityName] = useState('electronics');
  const [generatedId, setGeneratedId] = useState<any>(null);
  const [parsedId, setParsedId] = useState<any>(null);
  const [testIdentifier, setTestIdentifier] = useState(
    'WMT-204-070-001-20250115'
  );

  const generateIdentifier = () => {
    const transactionCode = EDIService.getTransactionCode(transactionType);
    const commodityCode = EDIService.getCommodityCode(commodityName);

    const identifier = EDIService.generateShipperIdentifier(
      companyName,
      transactionCode,
      commodityCode
    );

    setGeneratedId(identifier);
  };

  const parseIdentifier = () => {
    const parsed = EDIService.parseShipperIdentifier(testIdentifier);
    setParsedId(parsed);
  };

  const validateIdentifier = () => {
    const isValid = EDIService.validateShipperIdentifier(testIdentifier);
    alert(`Identifier "${testIdentifier}" is ${isValid ? 'VALID' : 'INVALID'}`);
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

  const sampleTransactions = [
    'load tender',
    'quote',
    'status',
    'invoice',
    'manifest',
    'response',
  ];

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, #1e40af 0%, #3730a3 25%, #7c3aed 50%, #a855f7 75%, #ec4899 100%)',
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
            🏷️ Shipper Identifier System
          </h1>
          <p
            style={{
              fontSize: '22px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0 0 16px 0',
              fontWeight: '500',
            }}
          >
            EDI Transaction Codes + Commodity Codes + Company Initials
          </p>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: 0,
            }}
          >
            Format: {`{COMPANY}-{TRANSACTION}-{COMMODITY}-{SEQUENCE}-{DATE}`}
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
              🔧 Generate Shipper ID
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
                {sampleTransactions.map((transaction) => (
                  <option key={transaction} value={transaction}>
                    {transaction}
                  </option>
                ))}
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

            <button
              onClick={generateIdentifier}
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
                transition: 'all 0.3s ease',
              }}
            >
              🚀 Generate Shipper ID
            </button>
          </div>

          {/* Parser Section */}
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
              🔍 Parse Shipper ID
            </h2>

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
                Shipper Identifier
              </label>
              <input
                type='text'
                value={testIdentifier}
                onChange={(e) => setTestIdentifier(e.target.value)}
                placeholder='Enter shipper ID (e.g., WMT-204-070-001-20250115)'
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '16px',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '24px',
              }}
            >
              <button
                onClick={parseIdentifier}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                🔍 Parse
              </button>
              <button
                onClick={validateIdentifier}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                ✅ Validate
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {(generatedId || parsedId) && (
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
                  generatedId && parsedId ? '1fr 1fr' : '1fr',
                gap: '24px',
              }}
            >
              {/* Generated ID Results */}
              {generatedId && (
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
                    🆔 Generated Shipper ID
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
                      {generatedId.fullId}
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
                        {generatedId.breakdown.company}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                        Transaction:
                      </span>
                      <div style={{ color: 'white', fontWeight: '600' }}>
                        {generatedId.breakdown.transaction}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                        Commodity:
                      </span>
                      <div style={{ color: 'white', fontWeight: '600' }}>
                        {generatedId.breakdown.commodity}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                        Sequence:
                      </span>
                      <div style={{ color: 'white', fontWeight: '600' }}>
                        {generatedId.breakdown.sequence}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                        Date:
                      </span>
                      <div style={{ color: 'white', fontWeight: '600' }}>
                        {generatedId.breakdown.date}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                        Valid:
                      </span>
                      <div
                        style={{
                          color: generatedId.isValid ? '#10b981' : '#ef4444',
                          fontWeight: '600',
                        }}
                      >
                        {generatedId.isValid ? '✅ Yes' : '❌ No'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Parsed ID Results */}
              {parsedId && (
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
                    🔍 Parsed Shipper ID
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
                      {parsedId.fullId}
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
                        {parsedId.breakdown.company}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                        Transaction:
                      </span>
                      <div style={{ color: 'white', fontWeight: '600' }}>
                        {parsedId.breakdown.transaction}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                        Commodity:
                      </span>
                      <div style={{ color: 'white', fontWeight: '600' }}>
                        {parsedId.breakdown.commodity}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                        Sequence:
                      </span>
                      <div style={{ color: 'white', fontWeight: '600' }}>
                        {parsedId.breakdown.sequence}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                        Date:
                      </span>
                      <div style={{ color: 'white', fontWeight: '600' }}>
                        {parsedId.breakdown.date}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#fbbf24', fontSize: '12px' }}>
                        Valid:
                      </span>
                      <div
                        style={{
                          color: parsedId.isValid ? '#10b981' : '#ef4444',
                          fontWeight: '600',
                        }}
                      >
                        {parsedId.isValid ? '✅ Yes' : '❌ No'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
            📚 Shipper ID System Overview
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '32px',
            }}
          >
            {/* Format Breakdown */}
            <div>
              <h3
                style={{
                  color: '#fbbf24',
                  marginBottom: '16px',
                  fontSize: '20px',
                }}
              >
                🏗️ Identifier Format
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
                  <span style={{ color: '#fbbf24' }}>-</span>
                  <span style={{ color: '#3b82f6' }}>204</span>
                  <span style={{ color: '#fbbf24' }}>-</span>
                  <span style={{ color: '#ec4899' }}>070</span>
                  <span style={{ color: '#fbbf24' }}>-</span>
                  <span style={{ color: '#8b5cf6' }}>001</span>
                  <span style={{ color: '#fbbf24' }}>-</span>
                  <span style={{ color: '#06b6d4' }}>20250115</span>
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  Company | Transaction | Commodity | Sequence | Date
                </div>
              </div>
            </div>

            {/* Transaction Codes */}
            <div>
              <h3
                style={{
                  color: '#fbbf24',
                  marginBottom: '16px',
                  fontSize: '20px',
                }}
              >
                🔄 EDI Transaction Codes
              </h3>
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  padding: '16px',
                  fontSize: '14px',
                  color: 'white',
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#3b82f6' }}>204</span> - Load Tender
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#3b82f6' }}>210</span> - Freight
                  Invoice
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#3b82f6' }}>214</span> - Shipment
                  Status
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#3b82f6' }}>856</span> - Ship Manifest
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#3b82f6' }}>990</span> - Tender
                  Response
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
