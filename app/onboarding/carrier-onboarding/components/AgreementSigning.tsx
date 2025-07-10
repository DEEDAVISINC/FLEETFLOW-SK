'use client';

import React, { useState } from 'react';

interface Agreement {
  id: string;
  type: 'broker_carrier' | 'dispatcher_carrier';
  title: string;
  description: string;
  templateUrl?: string;
  required: boolean;
  signed: boolean;
  signedDate?: string;
  signerName?: string;
  signerIP?: string;
  documentUrl?: string;
}

interface AgreementSigningProps {
  onAgreementsSigned: (agreements: Agreement[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const AgreementSigning: React.FC<AgreementSigningProps> = ({ onAgreementsSigned, onNext, onBack }) => {
  const [agreements, setAgreements] = useState<Agreement[]>([
    {
      id: 'broker_carrier',
      type: 'broker_carrier',
      title: 'Broker-Carrier Transportation Agreement',
      description: 'Master agreement defining terms between broker and carrier for transportation services',
      required: true,
      signed: false
    },
    {
      id: 'dispatcher_carrier',
      type: 'dispatcher_carrier',
      title: 'Dispatcher-Carrier Service Agreement',
      description: 'Service level agreement for dispatch services, commission structure, and performance metrics',
      required: true,
      signed: false
    }
  ]);

  const [currentAgreement, setCurrentAgreement] = useState<Agreement | null>(null);
  const [signatureData, setSignatureData] = useState({
    signerName: '',
    signerTitle: '',
    agreementAccepted: false
  });
  const [signingInProgress, setSigningInProgress] = useState(false);

  const brokerCarrierTerms = [
    'Carrier liability and insurance requirements ($1M minimum)',
    'Payment terms and factoring arrangements',
    'Load acceptance and performance standards',
    'Cancellation and dispute resolution procedures',
    'Compliance with DOT and FMCSA regulations',
    'Equipment and driver qualification requirements'
  ];

  const dispatcherCarrierTerms = [
    'Dispatch service scope and communication protocols',
    'Commission structure and payment terms',
    'Load board access and booking procedures',
    'Performance metrics and quality standards',
    'Territory and equipment type preferences',
    'Technology requirements and training support'
  ];

  const handleViewAgreement = (agreement: Agreement) => {
    setCurrentAgreement(agreement);
    setSignatureData({
      signerName: '',
      signerTitle: '',
      agreementAccepted: false
    });
  };

  const handleSign = async () => {
    if (!currentAgreement || !signatureData.signerName || !signatureData.agreementAccepted) {
      return;
    }

    setSigningInProgress(true);

    try {
      // Simulate signing process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const updatedAgreements = agreements.map(agreement => {
        if (agreement.id === currentAgreement.id) {
          return {
            ...agreement,
            signed: true,
            signedDate: new Date().toISOString(),
            signerName: signatureData.signerName,
            signerIP: '192.168.1.100', // Mock IP
            documentUrl: `signed_${agreement.id}_${Date.now()}.pdf`
          };
        }
        return agreement;
      });

      setAgreements(updatedAgreements);
      setCurrentAgreement(null);
      onAgreementsSigned(updatedAgreements);
    } catch (error) {
      console.error('Signing failed:', error);
    } finally {
      setSigningInProgress(false);
    }
  };

  const allRequiredSigned = agreements.filter(a => a.required).every(a => a.signed);

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
          📝 Agreement Signing
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
          Review and electronically sign required agreements
        </p>
      </div>

      {!currentAgreement ? (
        <div>
          {/* Progress Overview */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '16px' }}>
              Agreement Status
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <div style={{
                background: allRequiredSigned ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                padding: '12px 20px'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
                  {agreements.filter(a => a.signed).length}/{agreements.filter(a => a.required).length}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                  Agreements Signed
                </div>
              </div>
            </div>
          </div>

          {/* Agreement List */}
          <div style={{ display: 'grid', gap: '20px', marginBottom: '32px' }}>
            {agreements.map((agreement) => (
              <div
                key={agreement.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: agreement.signed 
                    ? '2px solid rgba(16, 185, 129, 0.5)' 
                    : '2px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      color: 'white', 
                      fontSize: '1.2rem', 
                      fontWeight: 'bold', 
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      {agreement.signed ? '✅' : '📄'} {agreement.title}
                      {agreement.required && !agreement.signed && (
                        <span style={{ 
                          background: '#ef4444', 
                          color: 'white', 
                          padding: '2px 8px', 
                          borderRadius: '4px', 
                          fontSize: '0.7rem' 
                        }}>
                          REQUIRED
                        </span>
                      )}
                    </h4>
                    <p style={{ 
                      color: 'rgba(255, 255, 255, 0.8)', 
                      fontSize: '0.9rem', 
                      marginBottom: '16px',
                      lineHeight: '1.4'
                    }}>
                      {agreement.description}
                    </p>

                    {/* Key Terms Preview */}
                    <div style={{ marginBottom: '16px' }}>
                      <h5 style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold', marginBottom: '8px' }}>
                        Key Terms:
                      </h5>
                      <div style={{ display: 'grid', gap: '4px' }}>
                        {(agreement.type === 'broker_carrier' ? brokerCarrierTerms : dispatcherCarrierTerms)
                          .slice(0, 3)
                          .map((term, index) => (
                          <div
                            key={index}
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '0.8rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                          >
                            <span style={{ color: '#10b981' }}>•</span>
                            {term}
                          </div>
                        ))}
                        <div style={{ 
                          color: 'rgba(255, 255, 255, 0.6)', 
                          fontSize: '0.8rem', 
                          fontStyle: 'italic' 
                        }}>
                          ...and more
                        </div>
                      </div>
                    </div>

                    {agreement.signed && (
                      <div style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        border: '1px solid rgba(16, 185, 129, 0.5)',
                        borderRadius: '8px',
                        padding: '12px',
                        fontSize: '0.9rem'
                      }}>
                        <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '4px' }}>
                          ✅ Signed by {agreement.signerName}
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          Date: {new Date(agreement.signedDate!).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ marginLeft: '20px' }}>
                    {agreement.signed ? (
                      <button
                        style={{
                          background: 'rgba(59, 130, 246, 0.3)',
                          color: 'white',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          border: '1px solid rgba(59, 130, 246, 0.5)',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          // Mock download
                          console.log(`Downloading: ${agreement.documentUrl}`);
                        }}
                      >
                        📄 Download
                      </button>
                    ) : (
                      <button
                        onClick={() => handleViewAgreement(agreement)}
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                          color: 'white',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          border: 'none',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        📝 Review & Sign
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Agreement Review and Signing Interface
        <div>
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={() => setCurrentAgreement(null)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
            >
              ← Back to Agreement List
            </button>
            
            <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '12px' }}>
              {currentAgreement.title}
            </h3>
          </div>

          {/* Full Terms Display */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            maxHeight: '400px',
            overflowY: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>
              Agreement Terms and Conditions:
            </h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              {(currentAgreement.type === 'broker_carrier' ? brokerCarrierTerms : dispatcherCarrierTerms)
                .map((term, index) => (
                <div
                  key={index}
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '8px 0'
                  }}
                >
                  <span style={{ 
                    color: '#10b981', 
                    fontWeight: 'bold',
                    minWidth: '20px'
                  }}>
                    {index + 1}.
                  </span>
                  {term}
                </div>
              ))}
            </div>

            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              padding: '16px',
              marginTop: '20px'
            }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', margin: 0 }}>
                📄 <strong>Note:</strong> This is a simplified preview. The full legal agreement contains additional 
                terms, conditions, and compliance requirements. By signing, you acknowledge reading and agreeing 
                to all terms in the complete agreement.
              </p>
            </div>
          </div>

          {/* Signature Section */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <h4 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px' }}>
              Electronic Signature
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>
                  Full Name (as it appears on legal documents) *
                </label>
                <input
                  type="text"
                  value={signatureData.signerName}
                  onChange={(e) => setSignatureData(prev => ({ ...prev, signerName: e.target.value }))}
                  placeholder="Enter your full legal name"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>
                  Title/Position
                </label>
                <input
                  type="text"
                  value={signatureData.signerTitle}
                  onChange={(e) => setSignatureData(prev => ({ ...prev, signerTitle: e.target.value }))}
                  placeholder="e.g., Owner, President, etc."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                color: 'white',
                cursor: 'pointer',
                lineHeight: '1.5'
              }}>
                <input
                  type="checkbox"
                  checked={signatureData.agreementAccepted}
                  onChange={(e) => setSignatureData(prev => ({ ...prev, agreementAccepted: e.target.checked }))}
                  style={{ 
                    transform: 'scale(1.3)',
                    marginTop: '2px',
                    minWidth: '18px'
                  }}
                />
                <span>
                  I have read, understood, and agree to be bound by all terms and conditions in this agreement. 
                  I certify that I have the authority to sign this agreement on behalf of my company and that 
                  this electronic signature has the same legal effect as a handwritten signature.
                </span>
              </label>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                <div><strong>Signature Details:</strong></div>
                <div>Date: {new Date().toLocaleDateString()}</div>
                <div>Time: {new Date().toLocaleTimeString()}</div>
                <div>IP Address: 192.168.1.100 (for audit trail)</div>
              </div>
            </div>

            <button
              onClick={handleSign}
              disabled={!signatureData.signerName || !signatureData.agreementAccepted || signingInProgress}
              style={{
                background: (!signatureData.signerName || !signatureData.agreementAccepted || signingInProgress)
                  ? '#6b7280'
                  : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: (!signatureData.signerName || !signatureData.agreementAccepted || signingInProgress) 
                  ? 'not-allowed' 
                  : 'pointer',
                transition: 'all 0.2s ease',
                display: 'block',
                margin: '0 auto',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
              }}
            >
              {signingInProgress ? '✍️ Signing Agreement...' : '✍️ Sign Agreement Electronically'}
            </button>
          </div>
        </div>
      )}

      {/* Navigation (only show when not in signing mode) */}
      {!currentAgreement && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
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
            ← Back to Factoring
          </button>

          <div style={{ textAlign: 'center' }}>
            {!allRequiredSigned && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '8px',
                padding: '8px 16px',
                color: 'white',
                fontSize: '0.9rem'
              }}>
                Sign all required agreements to continue
              </div>
            )}
          </div>

          <button
            onClick={onNext}
            disabled={!allRequiredSigned}
            style={{
              background: allRequiredSigned 
                ? 'linear-gradient(135deg, #10b981, #059669)' 
                : '#6b7280',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              cursor: allRequiredSigned ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease'
            }}
          >
            Continue to Portal Setup →
          </button>
        </div>
      )}
    </div>
  );
};
