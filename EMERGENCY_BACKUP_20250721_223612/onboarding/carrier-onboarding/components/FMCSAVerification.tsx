'use client';

import React, { useState } from 'react';
import { fmcsaService, FMCSACarrierData, FMCSASearchResult } from '../services/FMCSAService';

interface FMCSAVerificationProps {
  onDataVerified: (data: FMCSACarrierData) => void;
  onNext: () => void;
}

export const FMCSAVerification: React.FC<FMCSAVerificationProps> = ({ onDataVerified, onNext }) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchType, setSearchType] = useState<'DOT' | 'MC' | 'NAME'>('DOT');
  const [loading, setLoading] = useState(false);
  const [verificationData, setVerificationData] = useState<FMCSACarrierData | null>(null);
  const [searchResult, setSearchResult] = useState<FMCSASearchResult | null>(null);
  const [error, setError] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setError(`Please enter a ${searchType} number`);
      return;
    }

    setLoading(true);
    setError('');
    setVerificationData(null);
    setValidationResult(null);

    try {
      let result: FMCSASearchResult;
      
      switch (searchType) {
        case 'DOT':
          result = await fmcsaService.searchByDOT(searchInput);
          break;
        case 'MC':
          result = await fmcsaService.searchByMC(searchInput);
          break;
        case 'NAME':
          const nameResults = await fmcsaService.searchByName(searchInput);
          result = nameResults.length > 0 ? nameResults[0] : { 
            success: false, 
            error: 'No carriers found with that name', 
            searchTime: 0, 
            dataSource: 'MOCK' 
          };
          break;
        default:
          throw new Error('Invalid search type');
      }

      setSearchResult(result);

      if (result.success && result.data) {
        setVerificationData(result.data);
        onDataVerified(result.data);

        // Validate carrier for onboarding
        const validation = fmcsaService.constructor.validateForOnboarding(result.data);
        setValidationResult(validation);
      } else {
        setError(result.error || 'Carrier not found');
      }
    } catch (err) {
      setError('Failed to search FMCSA database. Please try again.');
      console.error('FMCSA search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSafetyRatingIcon = (rating: string) => {
    switch (rating) {
      case 'SATISFACTORY': return '✅';
      case 'CONDITIONAL': return '⚠️';
      case 'UNSATISFACTORY': return '❌';
      case 'NOT_RATED': return '❓';
      default: return '❓';
    }
  };

  const getSafetyRatingColor = (rating: string) => {
    switch (rating) {
      case 'SATISFACTORY': return '#10b981';
      case 'CONDITIONAL': return '#f59e0b';
      case 'UNSATISFACTORY': return '#ef4444';
      case 'NOT_RATED': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getOperatingStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '✅';
      case 'OUT_OF_SERVICE': return '🚫';
      case 'NOT_AUTHORIZED': return '❌';
      default: return '❓';
    }
  };

  // Get test DOT numbers for demo
  const testDOTNumbers = fmcsaService.getTestDOTNumbers();

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '32px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: 'white', 
          marginBottom: '12px' 
        }}>
          📊 FMCSA Carrier Verification
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
          Search and verify carrier information from the FMCSA database
        </p>
      </div>

      {!verificationData ? (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Search Type Selection */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              color: 'white', 
              fontWeight: 'bold', 
              marginBottom: '12px' 
            }}>
              Search Method
            </label>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              {(['DOT', 'MC', 'NAME'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSearchType(type)}
                  style={{
                    background: searchType === type 
                      ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: `1px solid ${searchType === type ? '#3b82f6' : 'rgba(255, 255, 255, 0.3)'}`,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {type} {type === 'DOT' ? 'Number' : type === 'MC' ? 'Number' : 'Search'}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              color: 'white', 
              fontWeight: 'bold', 
              marginBottom: '8px' 
            }}>
              Enter {searchType === 'NAME' ? 'Company Name' : `${searchType} Number`}
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={
                  searchType === 'DOT' ? 'Enter DOT number (e.g., 123456)' :
                  searchType === 'MC' ? 'Enter MC number (e.g., MC-123456)' :
                  'Enter company name'
                }
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1rem'
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                style={{
                  background: loading ? '#6b7280' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '120px'
                }}
              >
                {loading ? '🔄 Searching...' : '🔍 Search'}
              </button>
            </div>
          </div>

          {/* Demo DOT Numbers */}
          {searchType === 'DOT' && (
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', margin: '0 0 8px 0' }}>
                💡 <strong>Demo DOT Numbers:</strong> Try these sample numbers to see carrier data
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {testDOTNumbers.map((dotNumber) => (
                  <button
                    key={dotNumber}
                    onClick={() => setSearchInput(dotNumber)}
                    style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid rgba(59, 130, 246, 0.5)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {dotNumber}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Result Info */}
          {searchResult && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              Search completed in {searchResult.searchTime}ms • Data source: {searchResult.dataSource}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              borderRadius: '8px',
              padding: '12px',
              color: '#fef2f2',
              textAlign: 'center'
            }}>
              ❌ {error}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div style={{
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✅</div>
            <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
              Carrier Verified Successfully
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h4 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>
                📋 Company Information
              </h4>
              <div style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.6' }}>
                <div><strong>Legal Name:</strong> {verificationData.legalName}</div>
                {verificationData.dbaName && <div><strong>DBA:</strong> {verificationData.dbaName}</div>}
                <div><strong>DOT:</strong> {verificationData.dotNumber}</div>
                <div><strong>MC:</strong> {verificationData.mcNumber}</div>
                <div><strong>Phone:</strong> {verificationData.phone}</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h4 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>
                🛡️ Safety & Authority
              </h4>
              <div style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong>Safety Rating:</strong> 
                  {getStatusIcon(verificationData.safetyRating)} {verificationData.safetyRating}
                </div>
                <div><strong>Authority:</strong> {verificationData.operatingAuthority}</div>
                <div><strong>Power Units:</strong> {verificationData.powerUnits}</div>
                <div><strong>Drivers:</strong> {verificationData.drivers}</div>
                <div><strong>Last Update:</strong> {verificationData.lastUpdate}</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h4 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>
                🚛 Equipment Types
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {verificationData.equipmentTypes.map((type, index) => (
                  <span
                    key={index}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h4 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>
                📍 Addresses
              </h4>
              <div style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.6' }}>
                <div><strong>Physical:</strong></div>
                <div style={{ marginBottom: '12px', paddingLeft: '8px' }}>{verificationData.physicalAddress}</div>
                <div><strong>Mailing:</strong></div>
                <div style={{ paddingLeft: '8px' }}>{verificationData.mailingAddress}</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={onNext}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
              }}
              onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'translateY(0)'}
            >
              ✅ Continue to Document Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
