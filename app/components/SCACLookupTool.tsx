'use client';

import React, { useState } from 'react';
import { nmftaService, SCACRecord, SCACValidationResult, NMFCRecord } from '../services/NMFTAService';

const SCACLookupTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scac' | 'nmfc' | 'freight-class'>('scac');
  const [scacCode, setSCACCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [scacResults, setSCACResults] = useState<SCACRecord[]>([]);
  const [scacValidation, setSCACValidation] = useState<SCACValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  // NMFC states
  const [nmfcItemNumber, setNMFCItemNumber] = useState('');
  const [nmfcDescription, setNMFCDescription] = useState('');
  const [nmfcResults, setNMFCResults] = useState<NMFCRecord[]>([]);
  
  // Freight class calculator states
  const [commodity, setCommodity] = useState({
    description: '',
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
    value: 0,
    packagingType: ''
  });
  const [freightClassResult, setFreightClassResult] = useState<any>(null);

  const handleSCACLookup = async () => {
    if (!scacCode.trim()) return;
    
    setLoading(true);
    try {
      const [record, validation] = await Promise.all([
        nmftaService.lookupSCAC(scacCode),
        nmftaService.validateSCAC(scacCode)
      ]);
      
      setSCACResults(record ? [record] : []);
      setSCACValidation(validation);
    } catch (error) {
      console.error('Error looking up SCAC:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySearch = async () => {
    if (!companyName.trim()) return;
    
    setLoading(true);
    try {
      const results = await nmftaService.searchSCACByCompany(companyName);
      setSCACResults(results);
      setSCACValidation(null);
    } catch (error) {
      console.error('Error searching company:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNMFCLookup = async () => {
    if (!nmfcItemNumber.trim()) return;
    
    setLoading(true);
    try {
      const result = await nmftaService.lookupNMFC(nmfcItemNumber);
      setNMFCResults(result.record ? [result.record] : []);
    } catch (error) {
      console.error('Error looking up NMFC:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNMFCSearch = async () => {
    if (!nmfcDescription.trim()) return;
    
    setLoading(true);
    try {
      const results = await nmftaService.searchNMFCByDescription(nmfcDescription);
      setNMFCResults(results);
    } catch (error) {
      console.error('Error searching NMFC:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFreightClassCalculation = async () => {
    if (!commodity.description || !commodity.weight || !commodity.dimensions.length) return;
    
    setLoading(true);
    try {
      const result = await nmftaService.calculateFreightClass(commodity);
      setFreightClassResult(result);
    } catch (error) {
      console.error('Error calculating freight class:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSCACTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* SCAC Code Lookup */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.12)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: 'white', 
          margin: '0 0 16px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🔍 SCAC Code Lookup
        </h3>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <input
            type="text""
            placeholder="Enter SCAC code (e.g., FLTF)""
            value={scacCode}
            onChange={(e) => setSCACCode(e.target.value.toUpperCase())}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '16px'
            }}
            maxLength={4}
          />
          <button
            onClick={handleSCACLookup}
            disabled={loading || !scacCode.trim()}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: loading ? '#666' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Looking up...' : 'Lookup'}
          </button>
        </div>

        {scacValidation && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '8px',
            background: scacValidation.isValid 
              ? 'rgba(34, 197, 94, 0.2)' 
              : 'rgba(239, 68, 68, 0.2)',
            border: `1px solid ${scacValidation.isValid ? '#22c55e' : '#ef4444'}`,
            marginBottom: '16px'
          }}>
            <div style={{ 
              fontWeight: '600', 
              color: scacValidation.isValid ? '#22c55e' : '#ef4444',
              marginBottom: '8px'
            }}>
              {scacValidation.isValid ? '✅ Valid SCAC Code' : '❌ Invalid SCAC Code'}
            </div>
            {scacValidation.errors.map((error, index) => (
              <div key={index} style={{ color: '#ef4444', fontSize: '14px' }}>• {error}</div>
            ))}
            {scacValidation.warnings.map((warning, index) => (
              <div key={index} style={{ color: '#f59e0b', fontSize: '14px' }}>⚠️ {warning}</div>
            ))}
          </div>
        )}
      </div>

      {/* Company Name Search */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.12)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: 'white', 
          margin: '0 0 16px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🏢 Search by Company Name
        </h3>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <input
            type="text""
            placeholder="Enter company name""
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '16px'
            }}
          />
          <button
            onClick={handleCompanySearch}
            disabled={loading || !companyName.trim()}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: loading ? '#666' : 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Results */}
      {scacResults.length > 0 && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: 'white', 
            margin: '0 0 16px 0' 
          }}>
            📋 Results ({scacResults.length})
          </h3>
          
          {scacResults.map((record, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: 'white' }}>
                    {record.scacCode}
                  </div>
                  <div style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.9)' }}>
                    {record.companyName}
                  </div>
                </div>
                <div style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: record.status === 'ACTIVE' ? '#22c55e' : '#ef4444',
                  color: 'white'
                }}>
                  {record.status}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                <div><strong>Address:</strong> {record.address.street}, {record.address.city}, {record.address.state} {record.address.zipCode}</div>
                <div><strong>Carrier Type:</strong> {record.carrierType.replace('_', ' ')}</div>
                {record.dotNumber && <div><strong>DOT:</strong> {record.dotNumber}</div>}
                {record.mcNumber && <div><strong>MC:</strong> {record.mcNumber}</div>}
                <div><strong>Expires:</strong> {record.expirationDate.toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderNMFCTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* NMFC Item Lookup */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.12)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: 'white', 
          margin: '0 0 16px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📦 NMFC Item Lookup
        </h3>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <input
            type="text""
            placeholder="Enter NMFC item number (e.g., 100920)""
            value={nmfcItemNumber}
            onChange={(e) => setNMFCItemNumber(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '16px'
            }}
          />
          <button
            onClick={handleNMFCLookup}
            disabled={loading || !nmfcItemNumber.trim()}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: loading ? '#666' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: 'white',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Looking up...' : 'Lookup'}
          </button>
        </div>
      </div>

      {/* NMFC Description Search */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.12)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: 'white', 
          margin: '0 0 16px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🔍 Search by Description
        </h3>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <input
            type="text""
            placeholder="Enter commodity description""
            value={nmfcDescription}
            onChange={(e) => setNMFCDescription(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '16px'
            }}
          />
          <button
            onClick={handleNMFCSearch}
            disabled={loading || !nmfcDescription.trim()}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: loading ? '#666' : 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* NMFC Results */}
      {nmfcResults.length > 0 && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: 'white', 
            margin: '0 0 16px 0' 
          }}>
            📋 NMFC Results ({nmfcResults.length})
          </h3>
          
          {nmfcResults.map((record, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: 'white' }}>
                    NMFC {record.itemNumber}
                  </div>
                  <div style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.9)' }}>
                    {record.description}
                  </div>
                </div>
                <div style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white'
                }}>
                  Class {record.class}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                <div><strong>Density:</strong> {record.density} PCF</div>
                <div><strong>Stowability:</strong> {record.stowability}</div>
                <div><strong>Handling:</strong> {record.handling}</div>
                <div><strong>Liability:</strong> {record.liability}</div>
                <div><strong>Hazardous:</strong> {record.hazardous ? 'Yes' : 'No'}</div>
                <div><strong>Effective:</strong> {record.effectiveDate.toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
      paddingTop: '80px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '32px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: 'white',
            margin: '0 0 16px 0'
          }}>
            🏛️ NMFTA Integration
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: '0'
          }}>
            SCAC Code Lookup • NMFC Classification • Freight Class Calculator
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          justifyContent: 'center'
        }}>
          {(['scac', 'nmfc', 'freight-class'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === tab 
                  ? 'rgba(255, 255, 255, 0.25)' 
                  : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
            >
              {tab === 'scac' && '🏷️ SCAC Codes'}
              {tab === 'nmfc' && '📦 NMFC Lookup'}
              {tab === 'freight-class' && '⚖️ Freight Class'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'scac' && renderSCACTab()}
        {activeTab === 'nmfc' && renderNMFCTab()}
        {activeTab === 'freight-class' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              color: 'white', 
              margin: '0 0 16px 0',
              textAlign: 'center'
            }}>
              ⚖️ Freight Class Calculator Coming Soon
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', margin: '0' }}>
              Calculate freight class based on commodity density, stowability, handling, and liability.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SCACLookupTool;
