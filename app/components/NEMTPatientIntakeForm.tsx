'use client';

import { useState } from 'react';

export interface PatientFormData {
  // Personal Information
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  ssn: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  
  // Contact Information
  phone: string;
  alternatePhone: string;
  email: string;
  preferredContactMethod: 'phone' | 'email' | 'sms';
  
  // Address
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  
  // Medicaid Information
  medicaidId: string;
  medicaidState: string;
  mco: string;
  mcoMemberId: string;
  eligibilityStartDate: string;
  eligibilityEndDate: string;
  primaryDiagnosis: string;
  secondaryDiagnosis: string;
  
  // Medical Needs & Accommodations
  wheelchairAccessible: boolean;
  wheelchairType: 'manual' | 'power' | 'none';
  oxygenRequired: boolean;
  oxygenFlow: string;
  walkerRequired: boolean;
  serviceAnimal: boolean;
  serviceAnimalType: string;
  stretcher: boolean;
  bariatric: boolean;
  bariatricWeight: string;
  cognitiveImpairment: boolean;
  behavioralIssues: boolean;
  otherAccommodations: string;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  emergencyContactAddress: string;
  
  // Healthcare Providers
  primaryCarePhysician: string;
  primaryCarePhone: string;
  primaryCareAddress: string;
  
  // Consent & Authorization
  hipaaConsent: boolean;
  treatmentConsent: boolean;
  billingAuthorization: boolean;
  releaseOfInformation: boolean;
  signatureName: string;
  signatureDate: string;
}

interface NEMTPatientIntakeFormProps {
  onSubmit: (data: PatientFormData) => void;
  onCancel: () => void;
  existingData?: Partial<PatientFormData>;
}

export default function NEMTPatientIntakeForm({
  onSubmit,
  onCancel,
  existingData,
}: NEMTPatientIntakeFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    ssn: '',
    gender: 'prefer-not-to-say',
    phone: '',
    alternatePhone: '',
    email: '',
    preferredContactMethod: 'phone',
    street: '',
    apt: '',
    city: '',
    state: 'MI',
    zip: '',
    county: '',
    medicaidId: '',
    medicaidState: 'MI',
    mco: '',
    mcoMemberId: '',
    eligibilityStartDate: '',
    eligibilityEndDate: '',
    primaryDiagnosis: '',
    secondaryDiagnosis: '',
    wheelchairAccessible: false,
    wheelchairType: 'none',
    oxygenRequired: false,
    oxygenFlow: '',
    walkerRequired: false,
    serviceAnimal: false,
    serviceAnimalType: '',
    stretcher: false,
    bariatric: false,
    bariatricWeight: '',
    cognitiveImpairment: false,
    behavioralIssues: false,
    otherAccommodations: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    emergencyContactAddress: '',
    primaryCarePhysician: '',
    primaryCarePhone: '',
    primaryCareAddress: '',
    hipaaConsent: false,
    treatmentConsent: false,
    billingAuthorization: false,
    releaseOfInformation: false,
    signatureName: '',
    signatureDate: new Date().toISOString().split('T')[0],
    ...existingData,
  });

  const totalSteps = 6;

  const handleInputChange = (field: keyof PatientFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.medicaidId) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          border: '2px solid rgba(16, 185, 129, 0.3)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <div>
            <h2
              style={{
                color: 'white',
                fontSize: '1.8rem',
                fontWeight: '700',
                margin: 0,
              }}
            >
              🏥 NEMT Patient Intake Form
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                margin: '8px 0 0 0',
              }}
            >
              HIPAA-Compliant Patient Registration | DEE DAVIS INC dba DEPOINTE
            </p>
          </div>
          <button
            onClick={onCancel}
            style={{
              color: 'white',
              fontSize: '1.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            {[
              'Personal Info',
              'Contact',
              'Medicaid',
              'Medical Needs',
              'Emergency',
              'Consent',
            ].map((label, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  color:
                    currentStep >= index + 1
                      ? '#10b981'
                      : 'rgba(255, 255, 255, 0.4)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                }}
              >
                {label}
              </div>
            ))}
          </div>
          <div
            style={{
              height: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(currentStep / totalSteps) * 100}%`,
                background: 'linear-gradient(90deg, #10b981, #059669)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div>
            <h3 style={{ color: '#10b981', marginBottom: '20px' }}>
              Step 1: Personal Information
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              <FormField
                label="First Name *"
                value={formData.firstName}
                onChange={(v) => handleInputChange('firstName', v)}
                required
              />
              <FormField
                label="Middle Name"
                value={formData.middleName}
                onChange={(v) => handleInputChange('middleName', v)}
              />
              <FormField
                label="Last Name *"
                value={formData.lastName}
                onChange={(v) => handleInputChange('lastName', v)}
                required
              />
              <FormField
                label="Date of Birth *"
                type="date"
                value={formData.dateOfBirth}
                onChange={(v) => handleInputChange('dateOfBirth', v)}
                required
              />
              <FormField
                label="SSN (Last 4 digits)"
                value={formData.ssn}
                onChange={(v) => handleInputChange('ssn', v)}
                placeholder="XXXX"
                maxLength={4}
              />
              <FormSelect
                label="Gender"
                value={formData.gender}
                onChange={(v) => handleInputChange('gender', v)}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
                ]}
              />
            </div>
          </div>
        )}

        {/* Step 2: Contact Information */}
        {currentStep === 2 && (
          <div>
            <h3 style={{ color: '#10b981', marginBottom: '20px' }}>
              Step 2: Contact Information
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              <FormField
                label="Primary Phone *"
                type="tel"
                value={formData.phone}
                onChange={(v) => handleInputChange('phone', v)}
                placeholder="(313) 555-0100"
                required
              />
              <FormField
                label="Alternate Phone"
                type="tel"
                value={formData.alternatePhone}
                onChange={(v) => handleInputChange('alternatePhone', v)}
                placeholder="(313) 555-0101"
              />
              <FormField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(v) => handleInputChange('email', v)}
                placeholder="patient@email.com"
                fullWidth
              />
              <FormSelect
                label="Preferred Contact Method"
                value={formData.preferredContactMethod}
                onChange={(v) => handleInputChange('preferredContactMethod', v)}
                options={[
                  { value: 'phone', label: 'Phone Call' },
                  { value: 'sms', label: 'Text Message (SMS)' },
                  { value: 'email', label: 'Email' },
                ]}
              />
              <FormField
                label="Street Address *"
                value={formData.street}
                onChange={(v) => handleInputChange('street', v)}
                placeholder="123 Main St"
                fullWidth
                required
              />
              <FormField
                label="Apt/Unit"
                value={formData.apt}
                onChange={(v) => handleInputChange('apt', v)}
                placeholder="Apt 2B"
              />
              <FormField
                label="City *"
                value={formData.city}
                onChange={(v) => handleInputChange('city', v)}
                placeholder="Detroit"
                required
              />
              <FormSelect
                label="State *"
                value={formData.state}
                onChange={(v) => handleInputChange('state', v)}
                options={[
                  { value: 'MI', label: 'Michigan' },
                  { value: 'MD', label: 'Maryland' },
                  { value: 'OH', label: 'Ohio' },
                  { value: 'IN', label: 'Indiana' },
                ]}
                required
              />
              <FormField
                label="ZIP Code *"
                value={formData.zip}
                onChange={(v) => handleInputChange('zip', v)}
                placeholder="48201"
                maxLength={5}
                required
              />
              <FormField
                label="County"
                value={formData.county}
                onChange={(v) => handleInputChange('county', v)}
                placeholder="Wayne County"
              />
            </div>
          </div>
        )}

        {/* Step 3: Medicaid Information */}
        {currentStep === 3 && (
          <div>
            <h3 style={{ color: '#10b981', marginBottom: '20px' }}>
              Step 3: Medicaid Information
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              <FormField
                label="Medicaid ID Number *"
                value={formData.medicaidId}
                onChange={(v) => handleInputChange('medicaidId', v)}
                placeholder="MI-12345678"
                required
              />
              <FormSelect
                label="Medicaid State *"
                value={formData.medicaidState}
                onChange={(v) => handleInputChange('medicaidState', v)}
                options={[
                  { value: 'MI', label: 'Michigan' },
                  { value: 'MD', label: 'Maryland' },
                ]}
                required
              />
              <FormSelect
                label="Managed Care Organization (MCO) *"
                value={formData.mco}
                onChange={(v) => handleInputChange('mco', v)}
                options={
                  formData.medicaidState === 'MI'
                    ? [
                        { value: '', label: 'Select MCO' },
                        { value: 'meridian', label: 'Meridian Health Plan' },
                        { value: 'molina', label: 'Molina Healthcare' },
                        {
                          value: 'united',
                          label: 'UnitedHealthcare Community Plan',
                        },
                        { value: 'hap', label: 'HAP Midwest' },
                        { value: 'total', label: 'Total Health Care' },
                      ]
                    : [
                        { value: '', label: 'Select MCO' },
                        { value: 'united-md', label: 'UnitedHealthcare Maryland' },
                        { value: 'amerigroup', label: 'Amerigroup Maryland' },
                        { value: 'cigna', label: 'Cigna Maryland' },
                        { value: 'kaiser', label: 'Kaiser Permanente' },
                        { value: 'molina-md', label: 'Molina Healthcare Maryland' },
                      ]
                }
                required
              />
              <FormField
                label="MCO Member ID"
                value={formData.mcoMemberId}
                onChange={(v) => handleInputChange('mcoMemberId', v)}
                placeholder="MCO-987654"
              />
              <FormField
                label="Eligibility Start Date"
                type="date"
                value={formData.eligibilityStartDate}
                onChange={(v) => handleInputChange('eligibilityStartDate', v)}
              />
              <FormField
                label="Eligibility End Date"
                type="date"
                value={formData.eligibilityEndDate}
                onChange={(v) => handleInputChange('eligibilityEndDate', v)}
              />
              <FormField
                label="Primary Diagnosis"
                value={formData.primaryDiagnosis}
                onChange={(v) => handleInputChange('primaryDiagnosis', v)}
                placeholder="e.g., End-Stage Renal Disease"
                fullWidth
              />
              <FormField
                label="Secondary Diagnosis"
                value={formData.secondaryDiagnosis}
                onChange={(v) => handleInputChange('secondaryDiagnosis', v)}
                placeholder="e.g., Diabetes Type 2"
                fullWidth
              />
            </div>
          </div>
        )}

        {/* Step 4: Medical Needs & Accommodations */}
        {currentStep === 4 && (
          <div>
            <h3 style={{ color: '#10b981', marginBottom: '20px' }}>
              Step 4: Medical Needs & Transportation Accommodations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <CheckboxField
                label="Wheelchair Accessible Vehicle Required"
                checked={formData.wheelchairAccessible}
                onChange={(v) => handleInputChange('wheelchairAccessible', v)}
              />
              {formData.wheelchairAccessible && (
                <FormSelect
                  label="Wheelchair Type"
                  value={formData.wheelchairType}
                  onChange={(v) => handleInputChange('wheelchairType', v)}
                  options={[
                    { value: 'manual', label: 'Manual Wheelchair' },
                    { value: 'power', label: 'Power/Electric Wheelchair' },
                  ]}
                />
              )}
              
              <CheckboxField
                label="Oxygen Required"
                checked={formData.oxygenRequired}
                onChange={(v) => handleInputChange('oxygenRequired', v)}
              />
              {formData.oxygenRequired && (
                <FormField
                  label="Oxygen Flow Rate (LPM)"
                  value={formData.oxygenFlow}
                  onChange={(v) => handleInputChange('oxygenFlow', v)}
                  placeholder="e.g., 2 LPM"
                />
              )}
              
              <CheckboxField
                label="Walker Required"
                checked={formData.walkerRequired}
                onChange={(v) => handleInputChange('walkerRequired', v)}
              />
              
              <CheckboxField
                label="Service Animal"
                checked={formData.serviceAnimal}
                onChange={(v) => handleInputChange('serviceAnimal', v)}
              />
              {formData.serviceAnimal && (
                <FormField
                  label="Service Animal Type"
                  value={formData.serviceAnimalType}
                  onChange={(v) => handleInputChange('serviceAnimalType', v)}
                  placeholder="e.g., Guide Dog, Emotional Support"
                />
              )}
              
              <CheckboxField
                label="Stretcher/Gurney Required"
                checked={formData.stretcher}
                onChange={(v) => handleInputChange('stretcher', v)}
              />
              
              <CheckboxField
                label="Bariatric (Weight >350 lbs)"
                checked={formData.bariatric}
                onChange={(v) => handleInputChange('bariatric', v)}
              />
              {formData.bariatric && (
                <FormField
                  label="Patient Weight (lbs)"
                  value={formData.bariatricWeight}
                  onChange={(v) => handleInputChange('bariatricWeight', v)}
                  placeholder="e.g., 400"
                />
              )}
              
              <CheckboxField
                label="Cognitive Impairment (Dementia, Alzheimer's)"
                checked={formData.cognitiveImpairment}
                onChange={(v) => handleInputChange('cognitiveImpairment', v)}
              />
              
              <CheckboxField
                label="Behavioral/Psychiatric Issues"
                checked={formData.behavioralIssues}
                onChange={(v) => handleInputChange('behavioralIssues', v)}
              />
              
              <FormField
                label="Other Accommodations/Special Instructions"
                value={formData.otherAccommodations}
                onChange={(v) => handleInputChange('otherAccommodations', v)}
                placeholder="Any other medical needs or special instructions..."
                multiline
                fullWidth
              />
            </div>
          </div>
        )}

        {/* Step 5: Emergency Contact & Healthcare Providers */}
        {currentStep === 5 && (
          <div>
            <h3 style={{ color: '#10b981', marginBottom: '20px' }}>
              Step 5: Emergency Contact & Healthcare Providers
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  gridColumn: '1 / -1',
                  marginBottom: '8px',
                }}
              >
                Emergency Contact
              </h4>
              <FormField
                label="Emergency Contact Name *"
                value={formData.emergencyContactName}
                onChange={(v) => handleInputChange('emergencyContactName', v)}
                placeholder="Jane Smith"
                required
              />
              <FormField
                label="Relationship *"
                value={formData.emergencyContactRelationship}
                onChange={(v) =>
                  handleInputChange('emergencyContactRelationship', v)
                }
                placeholder="Spouse, Daughter, etc."
                required
              />
              <FormField
                label="Emergency Contact Phone *"
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={(v) => handleInputChange('emergencyContactPhone', v)}
                placeholder="(313) 555-0102"
                required
              />
              <FormField
                label="Emergency Contact Address"
                value={formData.emergencyContactAddress}
                onChange={(v) => handleInputChange('emergencyContactAddress', v)}
                placeholder="123 Emergency St, Detroit, MI"
                fullWidth
              />
              
              <h4
                style={{
                  color: 'white',
                  gridColumn: '1 / -1',
                  marginTop: '20px',
                  marginBottom: '8px',
                }}
              >
                Primary Care Provider
              </h4>
              <FormField
                label="Primary Care Physician"
                value={formData.primaryCarePhysician}
                onChange={(v) => handleInputChange('primaryCarePhysician', v)}
                placeholder="Dr. Sarah Johnson"
              />
              <FormField
                label="PCP Phone"
                type="tel"
                value={formData.primaryCarePhone}
                onChange={(v) => handleInputChange('primaryCarePhone', v)}
                placeholder="(313) 555-0200"
              />
              <FormField
                label="PCP Address"
                value={formData.primaryCareAddress}
                onChange={(v) => handleInputChange('primaryCareAddress', v)}
                placeholder="456 Medical Center Dr"
                fullWidth
              />
            </div>
          </div>
        )}

        {/* Step 6: Consent & Authorization */}
        {currentStep === 6 && (
          <div>
            <h3 style={{ color: '#10b981', marginBottom: '20px' }}>
              Step 6: Consent & Authorization
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '8px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                }}
              >
                <strong style={{ color: '#f59e0b' }}>
                  Important: HIPAA & Consent Requirements
                </strong>
                <p style={{ margin: '8px 0 0 0' }}>
                  By checking the boxes below, you authorize DEE DAVIS INC dba
                  DEPOINTE to provide non-emergency medical transportation
                  services, submit claims to your Medicaid MCO, and share necessary
                  medical information with healthcare providers and drivers.
                </p>
              </div>
              
              <CheckboxField
                label="HIPAA Privacy Notice: I acknowledge that I have received and reviewed the HIPAA Privacy Notice and understand my rights regarding protected health information (PHI)."
                checked={formData.hipaaConsent}
                onChange={(v) => handleInputChange('hipaaConsent', v)}
                required
              />
              
              <CheckboxField
                label="Transportation Services Consent: I consent to receive NEMT services from DEPOINTE and understand that rides will be provided via Uber Health or other transportation partners."
                checked={formData.treatmentConsent}
                onChange={(v) => handleInputChange('treatmentConsent', v)}
                required
              />
              
              <CheckboxField
                label="Billing Authorization: I authorize DEPOINTE to submit claims to my Medicaid MCO on my behalf and to receive payment directly."
                checked={formData.billingAuthorization}
                onChange={(v) => handleInputChange('billingAuthorization', v)}
                required
              />
              
              <CheckboxField
                label="Release of Information: I authorize DEPOINTE to share necessary medical and transportation information with healthcare providers, drivers, and my MCO for coordination of care."
                checked={formData.releaseOfInformation}
                onChange={(v) => handleInputChange('releaseOfInformation', v)}
                required
              />
              
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginTop: '20px',
                }}
              >
                <FormField
                  label="Patient/Guardian Signature (Type Full Name) *"
                  value={formData.signatureName}
                  onChange={(v) => handleInputChange('signatureName', v)}
                  placeholder="John Smith"
                  required
                />
                <FormField
                  label="Date *"
                  type="date"
                  value={formData.signatureDate}
                  onChange={(v) => handleInputChange('signatureDate', v)}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(148, 163, 184, 0.2)',
          }}
        >
          <button
            onClick={currentStep === 1 ? onCancel : handleBack}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '12px 24px',
              color: '#ef4444',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {currentStep === 1 ? 'Cancel' : '← Back'}
          </button>
          
          <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
            Step {currentStep} of {totalSteps}
          </div>
          
          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 32px',
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              ✓ Submit Patient Intake
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Components
function FormField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  fullWidth = false,
  multiline = false,
  maxLength,
}: any) {
  const style = {
    gridColumn: fullWidth ? '1 / -1' : 'auto',
  };

  return (
    <div style={style}>
      <label
        style={{
          display: 'block',
          color: 'white',
          fontSize: '0.85rem',
          fontWeight: '600',
          marginBottom: '6px',
        }}
      >
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={4}
          style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: '6px',
            color: 'white',
            fontSize: '0.9rem',
            resize: 'vertical',
          }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: '6px',
            color: 'white',
            fontSize: '0.9rem',
          }}
        />
      )}
    </div>
  );
}

function FormSelect({ label, value, onChange, options, required = false }: any) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          color: 'white',
          fontSize: '0.85rem',
          fontWeight: '600',
          marginBottom: '6px',
        }}
      >
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          borderRadius: '6px',
          color: 'white',
          fontSize: '0.9rem',
        }}
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value} style={{ background: '#1e293b' }}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxField({ label, checked, onChange, required = false }: any) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        cursor: 'pointer',
        padding: '12px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '6px',
        border: '1px solid rgba(148, 163, 184, 0.2)',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          marginTop: '4px',
          width: '18px',
          height: '18px',
          cursor: 'pointer',
        }}
      />
      <span
        style={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '0.9rem',
          lineHeight: '1.5',
        }}
      >
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </span>
    </label>
  );
}
