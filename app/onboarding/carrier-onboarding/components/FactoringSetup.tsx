'use client';

import React, { useState } from 'react';

interface FactoringCompany {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  advancePercentage: number;
  factorRate: number;
  services: string[];
  verificationProcess: string;
  requiresNOA: boolean;
}

interface FactoringSetupData {
  selectedCompany?: FactoringCompany;
  customCompany?: FactoringCompany;
  advancePercentage: number;
  factorRate: number;
  noaDocumentId?: string;
  effectiveDate: string;
  paymentTerms: string;
  quickPayEnabled: boolean;
  quickPayRate?: number;
}

interface FactoringSetupProps {
  onFactoringSetup: (data: FactoringSetupData) => void;
  onNext: () => void;
  onBack: () => void;
}

export const FactoringSetup: React.FC<FactoringSetupProps> = ({ onFactoringSetup, onNext, onBack }) => {
  const [setupType, setSetupType] = useState<'existing' | 'new' | 'none'>('existing');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [factorData, setFactorData] = useState<FactoringSetupData>({
    advancePercentage: 90,
    factorRate: 3.5,
    effectiveDate: new Date().toISOString().split('T')[0],
    paymentTerms: '24_hours',
    quickPayEnabled: false
  });
  const [customCompany, setCustomCompany] = useState<Partial<FactoringCompany>>({
    companyName: '',
    contactName: '',
    phone: '',
    email: '',
    address: '',
    advancePercentage: 90,
    factorRate: 3.5,
    services: ['invoice_factoring'],
    requiresNOA: true
  });
  const [noaUploaded, setNoaUploaded] = useState(false);

  // Mock factoring companies
  const factoringCompanies: FactoringCompany[] = [
    {
      id: 'rts',
      companyName: 'RTS Financial',
      contactName: 'John Smith',
      phone: '(800) 123-4567',
      email: 'setup@rtsfinancial.com',
      address: '123 Finance Ave, Dallas, TX 75201',
      advancePercentage: 90,
      factorRate: 3.5,
      services: ['Invoice Factoring', 'Fuel Cards', 'Load Board Access'],
      verificationProcess: 'Standard 2-day verification',
      requiresNOA: true
    },
    {
      id: 'triumph',
      companyName: 'Triumph Business Capital',
      contactName: 'Sarah Johnson',
      phone: '(800) 987-6543',
      email: 'newclients@triumphcapital.com',
      address: '456 Capital Blvd, Houston, TX 77001',
      advancePercentage: 95,
      factorRate: 2.9,
      services: ['Invoice Factoring', 'Equipment Financing', 'Credit Protection'],
      verificationProcess: 'Same-day verification available',
      requiresNOA: true
    },
    {
      id: 'apex',
      companyName: 'Apex Capital',
      contactName: 'Michael Brown',
      phone: '(800) 555-0123',
      email: 'onboarding@apexcapital.net',
      address: '789 Apex Way, Fort Worth, TX 76101',
      advancePercentage: 92,
      factorRate: 3.2,
      services: ['Invoice Factoring', 'QuickPay', 'Fuel Advances'],
      verificationProcess: '24-hour verification',
      requiresNOA: true
    }
  ];

  const handleNoaUpload = async (file: File) => {
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    setNoaUploaded(true);
    setFactorData(prev => ({ ...prev, noaDocumentId: `noa_${Date.now()}` }));
  };

  const handleSubmit = () => {
    const finalData: FactoringSetupData = { ...factorData };

    if (setupType === 'existing' && selectedCompanyId) {
      const selectedCompany = factoringCompanies.find(c => c.id === selectedCompanyId);
      if (selectedCompany) {
        finalData.selectedCompany = selectedCompany;
        finalData.advancePercentage = selectedCompany.advancePercentage;
        finalData.factorRate = selectedCompany.factorRate;
      }
    } else if (setupType === 'new' && customCompany.companyName) {
      finalData.customCompany = customCompany as FactoringCompany;
    }

    onFactoringSetup(finalData);
    onNext();
  };

  const selectedCompany = factoringCompanies.find(c => c.id === selectedCompanyId);
  const canProceed = setupType === 'none' || 
    (setupType === 'existing' && selectedCompanyId && (!selectedCompany?.requiresNOA || noaUploaded)) ||
    (setupType === 'new' && customCompany.companyName && customCompany.contactName && (!customCompany.requiresNOA || noaUploaded));

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
          🏦 Factoring Setup
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
          Configure factoring company relationship and payment terms
        </p>
      </div>

      {/* Setup Type Selection */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '16px' }}>
          Choose Factoring Option
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {[
            { 
              type: 'existing' as const, 
              title: '🏦 Existing Partner', 
              description: 'Select from our verified factoring partners',
              color: '#3b82f6'
            },
            { 
              type: 'new' as const, 
              title: '➕ New Company', 
              description: 'Add a new factoring company',
              color: '#10b981'
            },
            { 
              type: 'none' as const, 
              title: '🚫 No Factoring', 
              description: 'Skip factoring setup for now',
              color: '#6b7280'
            }
          ].map((option) => (
            <button
              key={option.type}
              onClick={() => setSetupType(option.type)}
              style={{
                background: setupType === option.type 
                  ? option.color 
                  : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                padding: '20px',
                borderRadius: '12px',
                border: `2px solid ${setupType === option.type ? option.color : 'rgba(255, 255, 255, 0.2)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
            >
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>
                {option.title}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                {option.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Existing Partner Selection */}
      {setupType === 'existing' && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '16px' }}>
            Select Factoring Partner
          </h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {factoringCompanies.map((company) => (
              <div
                key={company.id}
                onClick={() => setSelectedCompanyId(company.id)}
                style={{
                  background: selectedCompanyId === company.id 
                    ? 'rgba(59, 130, 246, 0.3)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: `2px solid ${selectedCompanyId === company.id ? '#3b82f6' : 'rgba(255, 255, 255, 0.2)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px' }}>
                  <div>
                    <h4 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px' }}>
                      {company.companyName}
                    </h4>
                    <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', marginBottom: '8px' }}>
                      <div>👤 {company.contactName}</div>
                      <div>📞 {company.phone}</div>
                      <div>✉️ {company.email}</div>
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                      {company.verificationProcess}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ color: 'white', textAlign: 'center', marginBottom: '12px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                        {company.advancePercentage}%
                      </div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Advance Rate</div>
                    </div>
                    <div style={{ color: 'white', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                        {company.factorRate}%
                      </div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Factor Rate</div>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ color: 'white', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '8px' }}>
                      Services:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {company.services.map((service, index) => (
                        <span
                          key={index}
                          style={{
                            background: 'rgba(16, 185, 129, 0.3)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            textAlign: 'center'
                          }}
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Company Form */}
      {setupType === 'new' && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '16px' }}>
            Add New Factoring Company
          </h3>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>
                  Company Name *
                </label>
                <input
                  type="text"
                  value={customCompany.companyName}
                  onChange={(e) => setCustomCompany(prev => ({ ...prev, companyName: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>
                  Contact Name *
                </label>
                <input
                  type="text"
                  value={customCompany.contactName}
                  onChange={(e) => setCustomCompany(prev => ({ ...prev, contactName: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={customCompany.phone}
                  onChange={(e) => setCustomCompany(prev => ({ ...prev, phone: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={customCompany.email}
                  onChange={(e) => setCustomCompany(prev => ({ ...prev, email: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                />
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>
                  Address
                </label>
                <input
                  type="text"
                  value={customCompany.address}
                  onChange={(e) => setCustomCompany(prev => ({ ...prev, address: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NOA Upload (if required) */}
      {(setupType !== 'none' && ((setupType === 'existing' && selectedCompany?.requiresNOA) || (setupType === 'new' && customCompany.requiresNOA))) && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '16px' }}>
            📄 Notice of Assignment (NOA)
          </h3>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>
              Upload the Notice of Assignment document from your factoring company
            </p>
            
            {!noaUploaded ? (
              <div>
                <input
                  type="file"
                  id="noa-upload"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleNoaUpload(file);
                    }
                  }}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="noa-upload"
                  style={{
                    display: 'block',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    padding: '16px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease'
                  }}
                >
                  📤 Upload NOA Document
                </label>
              </div>
            ) : (
              <div style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.5)',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
                <div style={{ color: 'white', fontWeight: 'bold' }}>
                  NOA Document Uploaded Successfully
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Terms (if factoring enabled) */}
      {setupType !== 'none' && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '16px' }}>
            💰 Payment Terms
          </h3>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>
                  Effective Date
                </label>
                <input
                  type="date"
                  value={factorData.effectiveDate}
                  onChange={(e) => setFactorData(prev => ({ ...prev, effectiveDate: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>
                  Payment Terms
                </label>
                <select
                  value={factorData.paymentTerms}
                  onChange={(e) => setFactorData(prev => ({ ...prev, paymentTerms: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                >
                  <option value="24_hours">24 Hours</option>
                  <option value="same_day">Same Day</option>
                  <option value="next_day">Next Business Day</option>
                  <option value="2_days">2 Business Days</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontWeight: 'bold' }}>
                  <input
                    type="checkbox"
                    checked={factorData.quickPayEnabled}
                    onChange={(e) => setFactorData(prev => ({ ...prev, quickPayEnabled: e.target.checked }))}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  Enable QuickPay
                </label>
                {factorData.quickPayEnabled && (
                  <input
                    type="number"
                    placeholder="QuickPay Rate %"
                    value={factorData.quickPayRate || ''}
                    onChange={(e) => setFactorData(prev => ({ ...prev, quickPayRate: parseFloat(e.target.value) }))}
                    style={{
                      width: '100%',
                      marginTop: '8px',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          ← Back to Documents
        </button>

        <div style={{ textAlign: 'center' }}>
          {!canProceed && setupType !== 'none' && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              borderRadius: '8px',
              padding: '8px 16px',
              color: 'white',
              fontSize: '0.9rem'
            }}>
              Complete all required fields and upload NOA if needed
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canProceed}
          style={{
            background: canProceed 
              ? 'linear-gradient(135deg, #10b981, #059669)' 
              : '#6b7280',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 'bold',
            cursor: canProceed ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease'
          }}
        >
          Continue to Agreements →
        </button>
      </div>
    </div>
  );
};
