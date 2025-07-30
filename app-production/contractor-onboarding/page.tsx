'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ContractorOnboardingService, { 
  ContractorData, 
  OnboardingSession, 
  OnboardingStep, 
  DocumentRequirement 
} from '../services/ContractorOnboardingService'

const ContractorOnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [onboardingData, setOnboardingData] = useState<Partial<ContractorData>>({})
  const [session, setSession] = useState<OnboardingSession | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state for different steps
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  })

  const [experienceInfo, setExperienceInfo] = useState({
    role: 'dispatcher' as ContractorData['role'],
    experience: '',
    references: [] as any[],
    certifications: [] as string[],
    availableHours: '',
    preferredRegions: [] as string[]
  })

  const [bankingInfo, setBankingInfo] = useState({
    accountType: '',
    routingNumber: '',
    accountNumber: '',
    bankName: ''
  })

  const [taxInfo, setTaxInfo] = useState({
    ssn: '',
    taxId: '',
    businessType: 'individual' as const,
    businessName: ''
  })

  const steps = [
    {
      id: 'personal_info',
      title: 'Personal Information',
      description: 'Basic contact and personal details',
      icon: '👤'
    },
    {
      id: 'experience',
      title: 'Experience & Role',
      description: 'Transportation experience and desired role',
      icon: '🚛'
    },
    {
      id: 'banking',
      title: 'Banking Information',
      description: 'Payment and banking details',
      icon: '🏦'
    },
    {
      id: 'tax_info',
      title: 'Tax Information',
      description: 'Tax identification and business details',
      icon: '📋'
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Review all information and submit',
      icon: '✅'
    }
  ]

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      await handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const contractorData: ContractorData = {
        id: `CTR-${Date.now()}`,
        ...personalInfo,
        ...experienceInfo,
        bankingInfo,
        taxInfo
      }

      const newSession = await ContractorOnboardingService.createOnboardingSession(contractorData)
      setSession(newSession)
      
      // Redirect to onboarding dashboard
      window.location.href = '/contractor-onboarding/dashboard'
    } catch (err: any) {
      setError(err.message || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  const renderPersonalInfoStep = () => (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>Personal Information</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px', 
        marginBottom: '20px' 
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            First Name *
          </label>
          <input
            type="text"
            value={personalInfo.firstName}
            onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px'
            }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Last Name *
          </label>
          <input
            type="text"
            value={personalInfo.lastName}
            onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px'
            }}
            required
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
          Email Address *
        </label>
        <input
          type="email"
          value={personalInfo.email}
          onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '16px'
          }}
          required
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
          Phone Number *
        </label>
        <input
          type="tel"
          value={personalInfo.phone}
          onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '16px'
          }}
          required
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
          Address *
        </label>
        <textarea
          value={personalInfo.address}
          onChange={(e) => setPersonalInfo({...personalInfo, address: e.target.value})}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '16px',
            minHeight: '80px'
          }}
          required
        />
      </div>

      <div style={{ 
        background: '#f8fafc', 
        padding: '20px', 
        borderRadius: '8px', 
        border: '1px solid #e2e8f0' 
      }}>
        <h3 style={{ color: '#1f2937', marginBottom: '15px' }}>Emergency Contact</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
              Name *
            </label>
            <input
              type="text"
              value={personalInfo.emergencyContact.name}
              onChange={(e) => setPersonalInfo({
                ...personalInfo,
                emergencyContact: {...personalInfo.emergencyContact, name: e.target.value}
              })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
              Phone *
            </label>
            <input
              type="tel"
              value={personalInfo.emergencyContact.phone}
              onChange={(e) => setPersonalInfo({
                ...personalInfo,
                emergencyContact: {...personalInfo.emergencyContact, phone: e.target.value}
              })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
              required
            />
          </div>
        </div>
        
        <div style={{ marginTop: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Relationship *
          </label>
          <input
            type="text"
            value={personalInfo.emergencyContact.relationship}
            onChange={(e) => setPersonalInfo({
              ...personalInfo,
              emergencyContact: {...personalInfo.emergencyContact, relationship: e.target.value}
            })}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px'
            }}
            placeholder="e.g., Spouse, Parent, Sibling"
            required
          />
        </div>
      </div>
    </div>
  )

  const renderExperienceStep = () => (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>Experience & Role</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
          Desired Role *
        </label>
        <select
          value={experienceInfo.role}
          onChange={(e) => setExperienceInfo({...experienceInfo, role: e.target.value as ContractorData['role']})}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '16px'
          }}
          required
        >
          <option value="dispatcher">Dispatcher</option>
          <option value="broker_agent">Broker Agent</option>
          <option value="both">Both Dispatcher & Broker Agent</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
          Transportation Experience *
        </label>
        <textarea
          value={experienceInfo.experience}
          onChange={(e) => setExperienceInfo({...experienceInfo, experience: e.target.value})}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '16px',
            minHeight: '120px'
          }}
          placeholder="Describe your experience in transportation, logistics, or freight brokerage..."
          required
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
          Available Hours *
        </label>
        <select
          value={experienceInfo.availableHours}
          onChange={(e) => setExperienceInfo({...experienceInfo, availableHours: e.target.value})}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '16px'
          }}
          required
        >
          <option value="">Select availability</option>
          <option value="full_time">Full Time (40+ hours/week)</option>
          <option value="part_time">Part Time (20-39 hours/week)</option>
          <option value="flexible">Flexible Schedule</option>
          <option value="weekends">Weekends Only</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
          Preferred Regions
        </label>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '10px' 
        }}>
          {['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West', 'National'].map(region => (
            <label key={region} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={experienceInfo.preferredRegions.includes(region)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setExperienceInfo({
                      ...experienceInfo,
                      preferredRegions: [...experienceInfo.preferredRegions, region]
                    })
                  } else {
                    setExperienceInfo({
                      ...experienceInfo,
                      preferredRegions: experienceInfo.preferredRegions.filter(r => r !== region)
                    })
                  }
                }}
                style={{ width: '18px', height: '18px' }}
              />
              {region}
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const renderBankingStep = () => (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>Banking Information</h2>
      
      <div style={{ 
        background: '#fef3c7', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '1px solid #fbbf24'
      }}>
        <p style={{ margin: 0, color: '#92400e' }}>
          🔒 Your banking information is encrypted and secure. This is used for payment processing only.
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
          Account Type *
        </label>
        <select
          value={bankingInfo.accountType}
          onChange={(e) => setBankingInfo({...bankingInfo, accountType: e.target.value})}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '16px'
          }}
          required
        >
          <option value="">Select account type</option>
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
          <option value="business">Business</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
          Bank Name *
        </label>
        <input
          type="text"
          value={bankingInfo.bankName}
          onChange={(e) => setBankingInfo({...bankingInfo, bankName: e.target.value})}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '16px'
          }}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Routing Number *
          </label>
          <input
            type="text"
            value={bankingInfo.routingNumber}
            onChange={(e) => setBankingInfo({...bankingInfo, routingNumber: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px'
            }}
            placeholder="9 digits"
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Account Number *
          </label>
          <input
            type="text"
            value={bankingInfo.accountNumber}
            onChange={(e) => setBankingInfo({...bankingInfo, accountNumber: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px'
            }}
            required
          />
        </div>
      </div>
    </div>
  )

  const renderTaxInfoStep = () => (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>Tax Information</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
          Business Type *
        </label>
        <select
          value={taxInfo.businessType}
          onChange={(e) => setTaxInfo({...taxInfo, businessType: e.target.value as any})}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '16px'
          }}
          required
        >
          <option value="individual">Individual</option>
          <option value="llc">LLC</option>
          <option value="corporation">Corporation</option>
        </select>
      </div>

      {taxInfo.businessType !== 'individual' && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Business Name *
          </label>
          <input
            type="text"
            value={taxInfo.businessName}
            onChange={(e) => setTaxInfo({...taxInfo, businessName: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px'
            }}
            required
          />
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
          Social Security Number *
        </label>
        <input
          type="text"
          value={taxInfo.ssn}
          onChange={(e) => setTaxInfo({...taxInfo, ssn: e.target.value})}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '16px'
          }}
          placeholder="XXX-XX-XXXX"
          required
        />
      </div>

      {taxInfo.businessType !== 'individual' && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Tax ID (EIN)
          </label>
          <input
            type="text"
            value={taxInfo.taxId}
            onChange={(e) => setTaxInfo({...taxInfo, taxId: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px'
            }}
            placeholder="XX-XXXXXXX"
          />
        </div>
      )}
    </div>
  )

  const renderReviewStep = () => (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>Review Your Information</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ color: '#1f2937', marginBottom: '15px' }}>Personal Information</h3>
          <p><strong>Name:</strong> {personalInfo.firstName} {personalInfo.lastName}</p>
          <p><strong>Email:</strong> {personalInfo.email}</p>
          <p><strong>Phone:</strong> {personalInfo.phone}</p>
          <p><strong>Address:</strong> {personalInfo.address}</p>
          <p><strong>Emergency Contact:</strong> {personalInfo.emergencyContact.name} ({personalInfo.emergencyContact.relationship})</p>
        </div>
        
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ color: '#1f2937', marginBottom: '15px' }}>Role & Experience</h3>
          <p><strong>Role:</strong> {experienceInfo.role.replace('_', ' ')}</p>
          <p><strong>Availability:</strong> {experienceInfo.availableHours}</p>
          <p><strong>Regions:</strong> {experienceInfo.preferredRegions.join(', ')}</p>
        </div>
      </div>

      <div style={{ 
        background: '#f0f9ff', 
        padding: '20px', 
        borderRadius: '8px', 
        marginTop: '20px',
        border: '1px solid #bae6fd'
      }}>
        <h3 style={{ color: '#1f2937', marginBottom: '15px' }}>Next Steps</h3>
        <p>After submitting your application, you will:</p>
        <ul style={{ marginLeft: '20px' }}>
          <li>Receive a confirmation email</li>
          <li>Complete background check process</li>
          <li>Review and sign contractor agreement</li>
          <li>Complete required training modules</li>
          <li>Set up system access</li>
        </ul>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalInfoStep()
      case 1:
        return renderExperienceStep()
      case 2:
        return renderBankingStep()
      case 3:
        return renderTaxInfoStep()
      case 4:
        return renderReviewStep()
      default:
        return null
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ 
              color: 'white', 
              fontSize: '32px', 
              marginBottom: '10px',
              fontWeight: 'bold'
            }}>
              🚛 FleetFlow Transportation
            </h1>
          </Link>
          <h2 style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            fontSize: '24px',
            fontWeight: 'normal'
          }}>
            Independent Contractor Application
          </h2>
        </div>

        {/* Progress Bar */}
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '12px',
          marginBottom: '30px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            {steps.map((step, index) => (
              <div
                key={step.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: index <= currentStep ? 1 : 0.5,
                  transition: 'opacity 0.3s'
                }}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: index <= currentStep ? '#10b981' : '#e5e7eb',
                  color: index <= currentStep ? 'white' : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  marginBottom: '10px',
                  transition: 'all 0.3s'
                }}>
                  {index < currentStep ? '✓' : step.icon}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontWeight: '600', 
                    fontSize: '14px',
                    color: index <= currentStep ? '#1f2937' : '#6b7280'
                  }}>
                    {step.title}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#6b7280',
                    marginTop: '4px'
                  }}>
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ 
            width: '100%', 
            height: '6px', 
            background: '#e5e7eb', 
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #10b981, #059669)',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>

        {/* Main Content */}
        <div style={{ 
          background: 'white', 
          padding: '40px', 
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px'
        }}>
          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #fca5a5'
            }}>
              {error}
            </div>
          )}
          
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            style={{
              background: currentStep === 0 ? '#e5e7eb' : '#6b7280',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Previous
          </button>

          <div style={{ color: '#6b7280', fontSize: '14px' }}>
            Step {currentStep + 1} of {steps.length}
          </div>

          <button
            onClick={handleNext}
            disabled={loading}
            style={{
              background: loading ? '#6b7280' : (currentStep === steps.length - 1 ? '#10b981' : '#3b82f6'),
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {loading ? 'Processing...' : (currentStep === steps.length - 1 ? 'Submit Application' : 'Next')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContractorOnboardingPage 