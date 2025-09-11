'use client';

import { useState } from 'react';

interface BusinessVerificationData {
  // Legal Business Information
  businessName: string;
  businessType: string;
  ein: string;
  stateOfIncorporation: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  // Identity Verification
  contactName: string;
  contactTitle: string;
  phone: string;
  email: string;

  // Financial Information
  bankName: string;
  accountType: string;

  // Business Documentation
  businessLicense: File | null;
  insuranceCertificate: File | null;
  taxDocument: File | null;

  // References
  reference1: {
    name: string;
    company: string;
    phone: string;
    email: string;
  };
  reference2: {
    name: string;
    company: string;
    phone: string;
    email: string;
  };
  reference3: {
    name: string;
    company: string;
    phone: string;
    email: string;
  };
}

interface BusinessVerificationFormProps {
  onSubmit: (data: BusinessVerificationData) => void;
  onCancel?: () => void;
  initialData?: Partial<BusinessVerificationData>;
}

export default function BusinessVerificationForm({
  onSubmit,
  onCancel,
  initialData = {},
}: BusinessVerificationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BusinessVerificationData>({
    businessName: initialData.businessName || '',
    businessType: initialData.businessType || '',
    ein: initialData.ein || '',
    stateOfIncorporation: initialData.stateOfIncorporation || '',
    businessAddress: {
      street: initialData.businessAddress?.street || '',
      city: initialData.businessAddress?.city || '',
      state: initialData.businessAddress?.state || '',
      zipCode: initialData.businessAddress?.zipCode || '',
      country: initialData.businessAddress?.country || 'US',
    },
    contactName: initialData.contactName || '',
    contactTitle: initialData.contactTitle || '',
    phone: initialData.phone || '',
    email: initialData.email || '',
    bankName: initialData.bankName || '',
    accountType: initialData.accountType || '',
    businessLicense: null,
    insuranceCertificate: null,
    taxDocument: null,
    reference1: {
      name: initialData.reference1?.name || '',
      company: initialData.reference1?.company || '',
      phone: initialData.reference1?.phone || '',
      email: initialData.reference1?.email || '',
    },
    reference2: {
      name: initialData.reference2?.name || '',
      company: initialData.reference2?.company || '',
      phone: initialData.reference2?.phone || '',
      email: initialData.reference2?.email || '',
    },
    reference3: {
      name: initialData.reference3?.name || '',
      company: initialData.reference3?.company || '',
      phone: initialData.reference3?.phone || '',
      email: initialData.reference3?.email || '',
    },
  });

  const [errors, setErrors] = useState<Partial<BusinessVerificationData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 4;

  const validateStep = (step: number): boolean => {
    const newErrors: any = {};

    switch (step) {
      case 1: // Business Information
        if (!formData.businessName.trim())
          newErrors.businessName = 'Business name is required';
        if (!formData.businessType)
          newErrors.businessType = 'Business type is required';
        if (!formData.ein.trim()) newErrors.ein = 'EIN is required';
        if (!formData.businessAddress.street.trim())
          newErrors.businessAddress = {
            ...newErrors.businessAddress,
            street: 'Street address is required',
          };
        if (!formData.businessAddress.city.trim())
          newErrors.businessAddress = {
            ...newErrors.businessAddress,
            city: 'City is required',
          };
        if (!formData.businessAddress.state)
          newErrors.businessAddress = {
            ...newErrors.businessAddress,
            state: 'State is required',
          };
        if (!formData.businessAddress.zipCode.trim())
          newErrors.businessAddress = {
            ...newErrors.businessAddress,
            zipCode: 'ZIP code is required',
          };
        break;

      case 2: // Identity & Contact
        if (!formData.contactName.trim())
          newErrors.contactName = 'Contact name is required';
        if (!formData.contactTitle.trim())
          newErrors.contactTitle = 'Contact title is required';
        if (!formData.phone.trim())
          newErrors.phone = 'Phone number is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!/\S+@\S+\.\S+/.test(formData.email))
          newErrors.email = 'Email format is invalid';
        break;

      case 3: // Financial & Documents
        if (!formData.bankName.trim())
          newErrors.bankName = 'Bank name is required';
        if (!formData.accountType)
          newErrors.accountType = 'Account type is required';
        if (!formData.businessLicense)
          newErrors.businessLicense = 'Business license is required';
        if (!formData.insuranceCertificate)
          newErrors.insuranceCertificate = 'Insurance certificate is required';
        break;

      case 4: // References
        if (
          !formData.reference1.name.trim() ||
          !formData.reference1.company.trim() ||
          !formData.reference1.phone.trim() ||
          !formData.reference1.email.trim()
        ) {
          newErrors.reference1 = 'All reference 1 fields are required';
        }
        if (
          !formData.reference2.name.trim() ||
          !formData.reference2.company.trim() ||
          !formData.reference2.phone.trim() ||
          !formData.reference2.email.trim()
        ) {
          newErrors.reference2 = 'All reference 2 fields are required';
        }
        if (
          !formData.reference3.name.trim() ||
          !formData.reference3.company.trim() ||
          !formData.reference3.phone.trim() ||
          !formData.reference3.email.trim()
        ) {
          newErrors.reference3 = 'All reference 3 fields are required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Verification submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof BusinessVerificationData] as any),
        [field]: value,
      },
    }));
  };

  const updateReference = (
    refNumber: 1 | 2 | 3,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [`reference${refNumber}`]: {
        ...(prev[
          `reference${refNumber}` as keyof BusinessVerificationData
        ] as any),
        [field]: value,
      },
    }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    updateFormData(field, file);
  };

  return (
    <div className='verification-form-container'>
      {/* Progress Indicator */}
      <div className='progress-container'>
        <div className='progress-steps'>
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`progress-step ${step <= currentStep ? 'completed' : ''} ${step === currentStep ? 'active' : ''}`}
            >
              <div className='step-number'>{step}</div>
              <div className='step-label'>
                {step === 1 && 'Business Info'}
                {step === 2 && 'Identity'}
                {step === 3 && 'Documents'}
                {step === 4 && 'References'}
              </div>
            </div>
          ))}
        </div>
        <div className='progress-bar'>
          <div
            className='progress-fill'
            style={{
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            }}
           />
        </div>
      </div>

      {/* Form Content */}
      <div className='form-content'>
        {/* Step 1: Business Information */}
        {currentStep === 1 && (
          <div className='form-step'>
            <h3>Business Information</h3>
            <p>Please provide your legal business details.</p>

            <div className='form-grid'>
              <div className='form-group'>
                <label htmlFor='businessName'>Legal Business Name *</label>
                <input
                  type='text'
                  id='businessName'
                  value={formData.businessName}
                  onChange={(e) =>
                    updateFormData('businessName', e.target.value)
                  }
                  className={errors.businessName ? 'error' : ''}
                />
                {errors.businessName && (
                  <span className='error-message'>{errors.businessName}</span>
                )}
              </div>

              <div className='form-group'>
                <label htmlFor='businessType'>Business Type *</label>
                <select
                  id='businessType'
                  value={formData.businessType}
                  onChange={(e) =>
                    updateFormData('businessType', e.target.value)
                  }
                  className={errors.businessType ? 'error' : ''}
                >
                  <option value=''>Select business type</option>
                  <option value='llc'>LLC</option>
                  <option value='corporation'>Corporation</option>
                  <option value='partnership'>Partnership</option>
                  <option value='sole-proprietorship'>
                    Sole Proprietorship
                  </option>
                  <option value='other'>Other</option>
                </select>
                {errors.businessType && (
                  <span className='error-message'>{errors.businessType}</span>
                )}
              </div>

              <div className='form-group'>
                <label htmlFor='ein'>
                  Employer Identification Number (EIN) *
                </label>
                <input
                  type='text'
                  id='ein'
                  value={formData.ein}
                  onChange={(e) => updateFormData('ein', e.target.value)}
                  placeholder='XX-XXXXXXX'
                  className={errors.ein ? 'error' : ''}
                />
                {errors.ein && (
                  <span className='error-message'>{errors.ein}</span>
                )}
              </div>

              <div className='form-group'>
                <label htmlFor='stateOfIncorporation'>
                  State of Incorporation
                </label>
                <select
                  id='stateOfIncorporation'
                  value={formData.stateOfIncorporation}
                  onChange={(e) =>
                    updateFormData('stateOfIncorporation', e.target.value)
                  }
                >
                  <option value=''>Select state</option>
                  {[
                    'AL',
                    'AK',
                    'AZ',
                    'AR',
                    'CA',
                    'CO',
                    'CT',
                    'DE',
                    'FL',
                    'GA',
                    'HI',
                    'ID',
                    'IL',
                    'IN',
                    'IA',
                    'KS',
                    'KY',
                    'LA',
                    'ME',
                    'MD',
                    'MA',
                    'MI',
                    'MN',
                    'MS',
                    'MO',
                    'MT',
                    'NE',
                    'NV',
                    'NH',
                    'NJ',
                    'NM',
                    'NY',
                    'NC',
                    'ND',
                    'OH',
                    'OK',
                    'OR',
                    'PA',
                    'RI',
                    'SC',
                    'SD',
                    'TN',
                    'TX',
                    'UT',
                    'VT',
                    'VA',
                    'WA',
                    'WV',
                    'WI',
                    'WY',
                  ].map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='address-section'>
              <h4>Business Address</h4>
              <div className='form-grid'>
                <div className='form-group full-width'>
                  <label htmlFor='street'>Street Address *</label>
                  <input
                    type='text'
                    id='street'
                    value={formData.businessAddress.street}
                    onChange={(e) =>
                      updateNestedField(
                        'businessAddress',
                        'street',
                        e.target.value
                      )
                    }
                    className={errors.businessAddress?.street ? 'error' : ''}
                  />
                  {errors.businessAddress?.street && (
                    <span className='error-message'>
                      {errors.businessAddress.street}
                    </span>
                  )}
                </div>

                <div className='form-group'>
                  <label htmlFor='city'>City *</label>
                  <input
                    type='text'
                    id='city'
                    value={formData.businessAddress.city}
                    onChange={(e) =>
                      updateNestedField(
                        'businessAddress',
                        'city',
                        e.target.value
                      )
                    }
                    className={errors.businessAddress?.city ? 'error' : ''}
                  />
                  {errors.businessAddress?.city && (
                    <span className='error-message'>
                      {errors.businessAddress.city}
                    </span>
                  )}
                </div>

                <div className='form-group'>
                  <label htmlFor='state'>State *</label>
                  <select
                    id='state'
                    value={formData.businessAddress.state}
                    onChange={(e) =>
                      updateNestedField(
                        'businessAddress',
                        'state',
                        e.target.value
                      )
                    }
                    className={errors.businessAddress?.state ? 'error' : ''}
                  >
                    <option value=''>Select state</option>
                    {[
                      'AL',
                      'AK',
                      'AZ',
                      'AR',
                      'CA',
                      'CO',
                      'CT',
                      'DE',
                      'FL',
                      'GA',
                      'HI',
                      'ID',
                      'IL',
                      'IN',
                      'IA',
                      'KS',
                      'KY',
                      'LA',
                      'ME',
                      'MD',
                      'MA',
                      'MI',
                      'MN',
                      'MS',
                      'MO',
                      'MT',
                      'NE',
                      'NV',
                      'NH',
                      'NJ',
                      'NM',
                      'NY',
                      'NC',
                      'ND',
                      'OH',
                      'OK',
                      'OR',
                      'PA',
                      'RI',
                      'SC',
                      'SD',
                      'TN',
                      'TX',
                      'UT',
                      'VT',
                      'VA',
                      'WA',
                      'WV',
                      'WI',
                      'WY',
                    ].map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.businessAddress?.state && (
                    <span className='error-message'>
                      {errors.businessAddress.state}
                    </span>
                  )}
                </div>

                <div className='form-group'>
                  <label htmlFor='zipCode'>ZIP Code *</label>
                  <input
                    type='text'
                    id='zipCode'
                    value={formData.businessAddress.zipCode}
                    onChange={(e) =>
                      updateNestedField(
                        'businessAddress',
                        'zipCode',
                        e.target.value
                      )
                    }
                    className={errors.businessAddress?.zipCode ? 'error' : ''}
                  />
                  {errors.businessAddress?.zipCode && (
                    <span className='error-message'>
                      {errors.businessAddress.zipCode}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Identity & Contact */}
        {currentStep === 2 && (
          <div className='form-step'>
            <h3>Identity & Contact Information</h3>
            <p>Please provide details for the primary business contact.</p>

            <div className='form-grid'>
              <div className='form-group'>
                <label htmlFor='contactName'>Full Name *</label>
                <input
                  type='text'
                  id='contactName'
                  value={formData.contactName}
                  onChange={(e) =>
                    updateFormData('contactName', e.target.value)
                  }
                  className={errors.contactName ? 'error' : ''}
                />
                {errors.contactName && (
                  <span className='error-message'>{errors.contactName}</span>
                )}
              </div>

              <div className='form-group'>
                <label htmlFor='contactTitle'>Job Title *</label>
                <input
                  type='text'
                  id='contactTitle'
                  value={formData.contactTitle}
                  onChange={(e) =>
                    updateFormData('contactTitle', e.target.value)
                  }
                  placeholder='e.g., Owner, CEO, Operations Manager'
                  className={errors.contactTitle ? 'error' : ''}
                />
                {errors.contactTitle && (
                  <span className='error-message'>{errors.contactTitle}</span>
                )}
              </div>

              <div className='form-group'>
                <label htmlFor='phone'>Business Phone *</label>
                <input
                  type='tel'
                  id='phone'
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder='(555) 123-4567'
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && (
                  <span className='error-message'>{errors.phone}</span>
                )}
              </div>

              <div className='form-group'>
                <label htmlFor='email'>Business Email *</label>
                <input
                  type='email'
                  id='email'
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && (
                  <span className='error-message'>{errors.email}</span>
                )}
              </div>
            </div>

            <div className='identity-notice'>
              <div className='notice-icon'>📷</div>
              <div className='notice-content'>
                <h4>Identity Verification Required</h4>
                <p>
                  You will be prompted to upload a government-issued ID and
                  provide a live selfie for facial recognition verification.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Financial & Documents */}
        {currentStep === 3 && (
          <div className='form-step'>
            <h3>Financial Information & Documents</h3>
            <p>
              Please provide banking details and upload required business
              documents.
            </p>

            <div className='form-grid'>
              <div className='form-group'>
                <label htmlFor='bankName'>Bank Name *</label>
                <input
                  type='text'
                  id='bankName'
                  value={formData.bankName}
                  onChange={(e) => updateFormData('bankName', e.target.value)}
                  className={errors.bankName ? 'error' : ''}
                />
                {errors.bankName && (
                  <span className='error-message'>{errors.bankName}</span>
                )}
              </div>

              <div className='form-group'>
                <label htmlFor='accountType'>Account Type *</label>
                <select
                  id='accountType'
                  value={formData.accountType}
                  onChange={(e) =>
                    updateFormData('accountType', e.target.value)
                  }
                  className={errors.accountType ? 'error' : ''}
                >
                  <option value=''>Select account type</option>
                  <option value='checking'>Business Checking</option>
                  <option value='savings'>Business Savings</option>
                </select>
                {errors.accountType && (
                  <span className='error-message'>{errors.accountType}</span>
                )}
              </div>
            </div>

            <div className='documents-section'>
              <h4>Required Documents</h4>
              <div className='document-uploads'>
                <div className='document-group'>
                  <label>Business License *</label>
                  <div className='file-upload'>
                    <input
                      type='file'
                      accept='.pdf,.jpg,.jpeg,.png'
                      onChange={(e) =>
                        handleFileUpload(
                          'businessLicense',
                          e.target.files?.[0] || null
                        )
                      }
                      className={errors.businessLicense ? 'error' : ''}
                    />
                    <div className='upload-placeholder'>
                      {formData.businessLicense ? (
                        <span>✓ {formData.businessLicense.name}</span>
                      ) : (
                        <span>Click to upload business license</span>
                      )}
                    </div>
                  </div>
                  {errors.businessLicense && (
                    <span className='error-message'>
                      {errors.businessLicense}
                    </span>
                  )}
                </div>

                <div className='document-group'>
                  <label>Insurance Certificate *</label>
                  <div className='file-upload'>
                    <input
                      type='file'
                      accept='.pdf,.jpg,.jpeg,.png'
                      onChange={(e) =>
                        handleFileUpload(
                          'insuranceCertificate',
                          e.target.files?.[0] || null
                        )
                      }
                      className={errors.insuranceCertificate ? 'error' : ''}
                    />
                    <div className='upload-placeholder'>
                      {formData.insuranceCertificate ? (
                        <span>✓ {formData.insuranceCertificate.name}</span>
                      ) : (
                        <span>Click to upload insurance certificate</span>
                      )}
                    </div>
                  </div>
                  {errors.insuranceCertificate && (
                    <span className='error-message'>
                      {errors.insuranceCertificate}
                    </span>
                  )}
                </div>

                <div className='document-group'>
                  <label>Tax Document (EIN Confirmation)</label>
                  <div className='file-upload'>
                    <input
                      type='file'
                      accept='.pdf,.jpg,.jpeg,.png'
                      onChange={(e) =>
                        handleFileUpload(
                          'taxDocument',
                          e.target.files?.[0] || null
                        )
                      }
                    />
                    <div className='upload-placeholder'>
                      {formData.taxDocument ? (
                        <span>✓ {formData.taxDocument.name}</span>
                      ) : (
                        <span>Click to upload tax document (optional)</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: References */}
        {currentStep === 4 && (
          <div className='form-step'>
            <h3>Business References</h3>
            <p>
              Please provide 3 business references who can verify your company's
              legitimacy and operations.
            </p>

            {[1, 2, 3].map((refNum) => (
              <div key={refNum} className='reference-section'>
                <h4>Reference {refNum} *</h4>
                <div className='form-grid'>
                  <div className='form-group'>
                    <label htmlFor={`ref${refNum}Name`}>Full Name</label>
                    <input
                      type='text'
                      id={`ref${refNum}Name`}
                      value={
                        formData[
                          `reference${refNum}` as keyof BusinessVerificationData
                        ].name
                      }
                      onChange={(e) =>
                        updateReference(
                          refNum as 1 | 2 | 3,
                          'name',
                          e.target.value
                        )
                      }
                      className={
                        errors[`reference${refNum}` as keyof typeof errors]
                          ? 'error'
                          : ''
                      }
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor={`ref${refNum}Company`}>Company</label>
                    <input
                      type='text'
                      id={`ref${refNum}Company`}
                      value={
                        formData[
                          `reference${refNum}` as keyof BusinessVerificationData
                        ].company
                      }
                      onChange={(e) =>
                        updateReference(
                          refNum as 1 | 2 | 3,
                          'company',
                          e.target.value
                        )
                      }
                      className={
                        errors[`reference${refNum}` as keyof typeof errors]
                          ? 'error'
                          : ''
                      }
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor={`ref${refNum}Phone`}>Phone Number</label>
                    <input
                      type='tel'
                      id={`ref${refNum}Phone`}
                      value={
                        formData[
                          `reference${refNum}` as keyof BusinessVerificationData
                        ].phone
                      }
                      onChange={(e) =>
                        updateReference(
                          refNum as 1 | 2 | 3,
                          'phone',
                          e.target.value
                        )
                      }
                      className={
                        errors[`reference${refNum}` as keyof typeof errors]
                          ? 'error'
                          : ''
                      }
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor={`ref${refNum}Email`}>Email Address</label>
                    <input
                      type='email'
                      id={`ref${refNum}Email`}
                      value={
                        formData[
                          `reference${refNum}` as keyof BusinessVerificationData
                        ].email
                      }
                      onChange={(e) =>
                        updateReference(
                          refNum as 1 | 2 | 3,
                          'email',
                          e.target.value
                        )
                      }
                      className={
                        errors[`reference${refNum}` as keyof typeof errors]
                          ? 'error'
                          : ''
                      }
                    />
                  </div>
                </div>
                {errors[`reference${refNum}` as keyof typeof errors] && (
                  <div className='error-message'>
                    {errors[`reference${refNum}` as keyof typeof errors]}
                  </div>
                )}
              </div>
            ))}

            <div className='reference-notice'>
              <div className='notice-icon'>📞</div>
              <div className='notice-content'>
                <h4>Reference Verification</h4>
                <p>
                  We may contact these references to verify your business
                  information and operations.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className='form-navigation'>
        <button
          type='button'
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className='nav-btn previous'
        >
          Previous
        </button>

        <div className='step-indicator'>
          Step {currentStep} of {totalSteps}
        </div>

        {currentStep < totalSteps ? (
          <button type='button' onClick={handleNext} className='nav-btn next'>
            Next
          </button>
        ) : (
          <button
            type='button'
            onClick={handleSubmit}
            disabled={isSubmitting}
            className='nav-btn submit'
          >
            {isSubmitting ? 'Submitting...' : 'Submit Verification'}
          </button>
        )}
      </div>

      <style jsx>{`
        .verification-form-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .progress-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 24px;
        }

        .progress-steps {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: 0.6;
        }

        .progress-step.completed {
          opacity: 1;
        }

        .progress-step.active {
          opacity: 1;
        }

        .progress-step.completed .step-number {
          background: #10b981;
        }

        .progress-step.active .step-number {
          background: #f4a832;
          animation: pulse 2s infinite;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .step-label {
          font-size: 0.9rem;
          text-align: center;
          font-weight: 600;
        }

        .progress-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #f4a832;
          transition: width 0.3s ease;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .form-content {
          padding: 32px;
        }

        .form-step h3 {
          color: #1e293b;
          margin-bottom: 8px;
          font-size: 1.5rem;
        }

        .form-step > p {
          color: #64748b;
          margin-bottom: 24px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group select {
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-group input.error,
        .form-group select.error {
          border-color: #ef4444;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.8rem;
          margin-top: 4px;
        }

        .address-section {
          margin-top: 24px;
        }

        .address-section h4 {
          color: #1e293b;
          margin-bottom: 16px;
          font-size: 1.1rem;
        }

        .documents-section h4 {
          color: #1e293b;
          margin-bottom: 16px;
          font-size: 1.1rem;
        }

        .document-uploads {
          display: grid;
          gap: 16px;
        }

        .document-group {
          display: flex;
          flex-direction: column;
        }

        .file-upload {
          position: relative;
        }

        .file-upload input[type='file'] {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .upload-placeholder {
          padding: 16px;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          text-align: center;
          color: #6b7280;
          transition: border-color 0.3s ease;
        }

        .file-upload:hover .upload-placeholder {
          border-color: #3b82f6;
        }

        .reference-section {
          margin-bottom: 32px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .reference-section h4 {
          color: #1e293b;
          margin-bottom: 16px;
        }

        .identity-notice,
        .reference-notice {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          padding: 16px;
          margin-top: 24px;
        }

        .notice-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .notice-content h4 {
          color: #1e293b;
          margin: 0 0 8px 0;
          font-size: 1rem;
        }

        .notice-content p {
          margin: 0;
          color: #64748b;
          font-size: 0.9rem;
        }

        .form-navigation {
          padding: 24px 32px;
          background: #f8fafc;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .nav-btn.previous {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .nav-btn.previous:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .nav-btn.next {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
        }

        .nav-btn.next:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .nav-btn.submit {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
        }

        .nav-btn.submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .step-indicator {
          font-weight: 600;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .verification-form-container {
            margin: 16px;
            border-radius: 12px;
          }

          .progress-steps {
            flex-wrap: wrap;
            gap: 12px;
          }

          .form-content {
            padding: 24px 20px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-navigation {
            padding: 20px;
            flex-direction: column;
            gap: 16px;
          }

          .nav-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
