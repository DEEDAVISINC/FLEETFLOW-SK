'use client';

import Link from 'next/link';
import { useState } from 'react';
import OnboardingComplianceCheck from '../../components/OnboardingComplianceCheck';

export default function OnboardingComplianceDemo() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [carrierInfo, setCarrierInfo] = useState({
    companyName: '',
    dotNumber: '',
    carrierId: `carrier-${Date.now()}`, // Generate a dummy ID for demo
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });

  const [complianceResult, setComplianceResult] = useState<any>(null);

  const handleComplianceComplete = (result: any) => {
    setComplianceResult(result);

    // Automatically move to next step if approved
    if (result.status === 'approved') {
      setTimeout(() => {
        setStep((prevStep) => Math.min(prevStep + 1, totalSteps));
      }, 1500);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCarrierInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitCarrierInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2); // Move to compliance check step
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>
              Step 1: Carrier Information
            </h2>

            <form onSubmit={handleSubmitCarrierInfo}>
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                  }}
                >
                  Company Name
                </label>
                <input
                  type='text'
                  name='companyName'
                  value={carrierInfo.companyName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem',
                  }}
                  placeholder='Enter your company name'
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                  }}
                >
                  DOT Number
                </label>
                <input
                  type='text'
                  name='dotNumber'
                  value={carrierInfo.dotNumber}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem',
                  }}
                  placeholder='Enter your DOT number'
                />
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: '#6b7280',
                    marginTop: '4px',
                  }}
                >
                  Hint: Use DOT# ending in 7-9 for SATISFACTORY, 3-6 for
                  CONDITIONAL, 0 for UNSATISFACTORY
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                  }}
                >
                  Contact Name
                </label>
                <input
                  type='text'
                  name='contactName'
                  value={carrierInfo.contactName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem',
                  }}
                  placeholder='Enter contact name'
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                  }}
                >
                  Contact Email
                </label>
                <input
                  type='email'
                  name='contactEmail'
                  value={carrierInfo.contactEmail}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem',
                  }}
                  placeholder='Enter email address'
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                  }}
                >
                  Contact Phone
                </label>
                <input
                  type='tel'
                  name='contactPhone'
                  value={carrierInfo.contactPhone}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem',
                  }}
                  placeholder='Enter phone number'
                />
              </div>

              <button
                type='submit'
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Continue to Compliance Verification
              </button>
            </form>
          </div>
        );

      case 2:
        return (
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>
              Step 2: Compliance Verification
            </h2>

            <OnboardingComplianceCheck
              carrierId={carrierInfo.carrierId}
              dotNumber={carrierInfo.dotNumber}
              companyName={carrierInfo.companyName}
              onVerificationComplete={handleComplianceComplete}
              onboardingStep={step}
              totalSteps={totalSteps}
            />
          </div>
        );

      case 3:
        return (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>
              Step 3: Document Upload
            </h2>

            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '8px',
                padding: '24px',
                marginBottom: '24px',
              }}
            >
              <h3
                style={{
                  fontSize: '1.2rem',
                  marginTop: 0,
                  marginBottom: '16px',
                }}
              >
                Required Documents
              </h3>

              {[
                'Operating Authority',
                'Insurance Certificate',
                'W9',
                'Driver Qualification File',
              ].map((doc, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '12px',
                    padding: '12px',
                    background: 'white',
                    borderRadius: '6px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>{doc}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      PDF or image file (max 10MB)
                    </div>
                  </div>
                  <label
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                    }}
                  >
                    Upload File
                    <input type='file' style={{ display: 'none' }} />
                  </label>
                </div>
              ))}

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                  onClick={() => setStep(4)}
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Continue to Next Step
                </button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>
              Step 4: Agreement Signing
            </h2>

            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '8px',
                padding: '24px',
                marginBottom: '24px',
              }}
            >
              <h3
                style={{
                  fontSize: '1.2rem',
                  marginTop: 0,
                  marginBottom: '16px',
                }}
              >
                Carrier Agreement
              </h3>

              <div
                style={{
                  height: '300px',
                  overflowY: 'scroll',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '16px',
                  background: 'white',
                  marginBottom: '16px',
                  fontSize: '0.9rem',
                }}
              >
                <p>
                  <strong>CARRIER AGREEMENT</strong>
                </p>
                <p>
                  This Carrier Agreement (the "Agreement") is entered into by
                  and between FleetFlow ("Company") and the undersigned carrier
                  ("Carrier").
                </p>
                <p>
                  <strong>1. COMPLIANCE WITH REGULATIONS</strong>
                </p>
                <p>
                  Carrier agrees to comply with all applicable federal, state,
                  and local laws, rules, and regulations, including but not
                  limited to those administered by the DOT, FMCSA, and other
                  regulatory bodies.
                </p>
                <p>
                  <strong>2. INSURANCE REQUIREMENTS</strong>
                </p>
                <p>
                  Carrier shall maintain insurance coverage as required by
                  federal law for the protection of the public and cargo with
                  minimum limits as follows:
                </p>
                <ul>
                  <li>Public Liability: $1,000,000</li>
                  <li>Property Damage: $1,000,000</li>
                  <li>Cargo Insurance: $100,000</li>
                  <li>Workers Compensation: As required by law</li>
                </ul>
                <p>
                  <strong>3. COMPLIANCE MONITORING</strong>
                </p>
                <p>
                  Carrier agrees to ongoing compliance monitoring including
                  regular verification of authority status, insurance coverage,
                  and safety ratings. Carrier will be notified of any compliance
                  issues requiring immediate attention.
                </p>
                <p>
                  <strong>4. TERM AND TERMINATION</strong>
                </p>
                <p>
                  This Agreement shall remain in effect for one year and shall
                  automatically renew for successive one-year terms unless
                  terminated. Either party may terminate this Agreement upon
                  thirty (30) days written notice.
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '24px',
                }}
              >
                <input
                  type='checkbox'
                  id='agreement'
                  style={{ marginRight: '12px' }}
                />
                <label htmlFor='agreement'>
                  I have read and agree to the Carrier Agreement
                </label>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => setStep(5)}
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Sign Agreement & Continue
                </button>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div
            style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                background: '#22c55e',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '40px',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              ✓
            </div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>
              Onboarding Complete!
            </h2>
            <p
              style={{
                fontSize: '1.1rem',
                color: '#4b5563',
                marginBottom: '32px',
              }}
            >
              Welcome to FleetFlow, {carrierInfo.companyName}! Your account is
              now active.
            </p>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                Carrier ID
              </div>
              <div
                style={{
                  padding: '8px 16px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '6px',
                  display: 'inline-block',
                  fontFamily: 'monospace',
                  fontSize: '1.2rem',
                }}
              >
                {carrierInfo.carrierId}
              </div>
            </div>

            <div
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '8px',
                padding: '24px',
                marginBottom: '32px',
                textAlign: 'left',
              }}
            >
              <h3 style={{ margin: '0 0 16px 0' }}>Compliance Status</h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    Safety Rating
                  </div>
                  <div style={{ fontWeight: 'bold' }}>
                    {complianceResult?.verificationDetails?.safetyRating ||
                      'SATISFACTORY'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    Risk Level
                  </div>
                  <div
                    style={{
                      fontWeight: 'bold',
                      color:
                        complianceResult?.riskLevel === 'low'
                          ? '#22c55e'
                          : complianceResult?.riskLevel === 'medium'
                            ? '#f59e0b'
                            : '#ef4444',
                    }}
                  >
                    {complianceResult?.riskLevel?.toUpperCase() || 'LOW'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    Compliance Score
                  </div>
                  <div style={{ fontWeight: 'bold' }}>
                    {complianceResult?.score || '85'}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    Next Review
                  </div>
                  <div style={{ fontWeight: 'bold' }}>
                    {new Date(
                      Date.now() + 90 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}
            >
              <Link href='/carriers'>
                <button
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Go to Carrier Portal
                </button>
              </Link>
              <Link href='/carriers/compliance'>
                <button
                  style={{
                    background: 'rgba(220, 38, 38, 0.1)',
                    color: '#dc2626',
                    border: '1px solid #dc2626',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  View Compliance Dashboard
                </button>
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #a5f3fc 0%, #38bdf8 100%)',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            padding: '24px',
            color: 'white',
          }}
        >
          <div
            style={{
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Link
              href='/'
              style={{
                textDecoration: 'none',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ marginRight: '8px' }}>←</span> Back to Dashboard
            </Link>
          </div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              margin: '0 0 8px 0',
            }}
          >
            Carrier Onboarding & Compliance Verification
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.8, margin: 0 }}>
            Complete the onboarding process to access the FleetFlow carrier
            portal
          </p>
        </div>

        {/* Progress Steps */}
        <div
          style={{
            display: 'flex',
            padding: '24px',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          {[1, 2, 3, 4, 5].map((stepNumber) => (
            <div
              key={stepNumber}
              style={{
                flex: 1,
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background:
                    step >= stepNumber ? '#3b82f6' : 'rgba(209, 213, 219, 0.4)',
                  color: step >= stepNumber ? 'white' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                }}
              >
                {stepNumber}
              </div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: step >= stepNumber ? '#111827' : '#6b7280',
                  fontWeight: step === stepNumber ? 'bold' : 'normal',
                }}
              >
                {stepNumber === 1 && 'Company Info'}
                {stepNumber === 2 && 'Compliance Check'}
                {stepNumber === 3 && 'Documents'}
                {stepNumber === 4 && 'Agreement'}
                {stepNumber === 5 && 'Complete'}
              </div>

              {/* Connecting line */}
              {stepNumber < totalSteps && (
                <div
                  style={{
                    position: 'absolute',
                    top: '18px',
                    right: '0',
                    width: '50%',
                    height: '2px',
                    background:
                      step > stepNumber
                        ? '#3b82f6'
                        : 'rgba(209, 213, 219, 0.4)',
                  }}
                ></div>
              )}
              {stepNumber > 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '18px',
                    left: '0',
                    width: '50%',
                    height: '2px',
                    background:
                      step >= stepNumber
                        ? '#3b82f6'
                        : 'rgba(209, 213, 219, 0.4)',
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>

        <div style={{ padding: '32px' }}>{renderStep()}</div>
      </div>
    </div>
  );
}
