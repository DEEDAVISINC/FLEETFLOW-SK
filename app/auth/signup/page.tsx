'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Logo from '../../components/Logo';

interface RegistrationForm {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;

  // Company Information
  companyName: string;
  position: string;
  department: string;

  // Subscription Preferences
  selectedPlan: string;
  agreeToTerms: boolean;
  agreeToMarketing: boolean;

  // Payment Information (Step 5)
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  billingName: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZip: string;

  // Profile Completion (Step 6)
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  emergencyContactAltPhone: string;
  workLocation: string;
  timezone: string;
  theme: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  loadAlerts: boolean;
  bio: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<RegistrationForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    companyName: '',
    position: '',
    department: '',
    selectedPlan: 'dispatcher-pro',
    agreeToTerms: false,
    agreeToMarketing: false,
    // Payment Information
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    billingName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    // Profile Completion
    emergencyContactName: '',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '',
    emergencyContactAltPhone: '',
    workLocation: 'Main Office',
    timezone: 'America/New_York',
    theme: 'dark',
    emailNotifications: true,
    smsNotifications: true,
    loadAlerts: true,
    bio: '',
  });

  const updateFormData = (field: keyof RegistrationForm, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(''); // Clear errors when user types
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.email) {
          setError('Please fill in all personal information fields');
          return false;
        }
        if (!formData.email.includes('@')) {
          setError('Please enter a valid email address');
          return false;
        }
        break;
      case 2:
        if (!formData.password || formData.password.length < 8) {
          setError('Password must be at least 8 characters long');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        break;
      case 3:
        if (!formData.companyName || !formData.position) {
          setError('Please fill in company information');
          return false;
        }
        break;
      case 4:
        if (!formData.agreeToTerms) {
          setError('You must agree to the Terms of Service to continue');
          return false;
        }
        break;
      case 5:
        if (!formData.cardNumber || formData.cardNumber.length < 13) {
          setError('Please enter a valid credit card number');
          return false;
        }
        if (!formData.expiryMonth || !formData.expiryYear) {
          setError('Please enter card expiration date');
          return false;
        }
        if (!formData.cvc || formData.cvc.length < 3) {
          setError('Please enter card security code');
          return false;
        }
        if (
          !formData.billingName ||
          !formData.billingAddress ||
          !formData.billingZip
        ) {
          setError('Please complete billing address information');
          return false;
        }
        break;
      case 6:
        if (!formData.emergencyContactName || !formData.emergencyContactPhone) {
          setError('Please provide emergency contact information');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep(6)) return;

    setIsLoading(true);
    setError('');

    try {
      // Step 1: Verify payment method with Square
      const paymentResponse = await fetch('/api/auth/verify-payment-square', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          expiryMonth: formData.expiryMonth,
          expiryYear: formData.expiryYear,
          cvc: formData.cvc,
          billingName: formData.billingName,
          billingAddress: formData.billingAddress,
          billingCity: formData.billingCity,
          billingState: formData.billingState,
          billingZip: formData.billingZip,
        }),
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentResult.message || 'Payment verification failed');
      }

      // Step 2: Create complete user account
      const response = await fetch('/api/auth/register-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: `${formData.firstName} ${formData.lastName}`,
          paymentMethodId: paymentResult.paymentMethodId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      // Success! Redirect to trial confirmation
      router.push(
        '/auth/trial-activated?email=' + encodeURIComponent(formData.email)
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const availablePlans = [
    {
      id: 'university-access',
      name: 'FleetFlow University℠',
      price: '$49/month',
      description: 'Professional training and certification',
      icon: '🎓',
      popular: false,
    },
    {
      id: 'dispatcher-pro',
      name: 'Professional Dispatcher',
      price: '$79/month',
      description: 'Complete dispatch management + phone',
      icon: '📋',
      popular: true,
    },
    {
      id: 'broker-elite',
      name: 'Professional Brokerage',
      price: '$199/month',
      description: 'Advanced brokerage operations + phone',
      icon: '🏢',
      popular: false,
    },
    {
      id: 'enterprise-module',
      name: 'Enterprise Professional',
      price: '$2,698/month',
      description: 'Complete platform access + unlimited phone',
      icon: '🌟',
      popular: false,
    },
  ];

  const departments = [
    'Dispatch',
    'Brokerage',
    'Driver Management',
    'Executive Management',
    'Safety & Compliance',
    'Operations',
    'Customer Service',
    'Sales & Marketing',
    'Other',
  ];

  const relations = ['Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Other'];
  const locations = [
    'Main Office',
    'Remote',
    'Branch Office',
    'Field Office',
    'Other',
  ];
  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  ];
  const states = [
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
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) =>
    (currentYear + i).toString()
  );

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <style jsx>{`
        @keyframes logoZoom {
          0%,
          100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.1);
          }
          50% {
            transform: scale(1.05);
          }
          75% {
            transform: scale(1.15);
          }
        }
      `}</style>
      <div
        style={{
          maxWidth: '600px',
          width: '100%',
          background: 'white',
          borderRadius: '20px',
          border: '1px solid #e5e7eb',
          padding: '40px',
          boxShadow:
            '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href='/' style={{ textDecoration: 'none' }}>
            <div
              style={{
                margin: '0 auto 30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'logoZoom 4s ease-in-out infinite',
              }}
            >
              <Logo size='large' variant='gradient' />
            </div>
          </Link>
          <h1
            style={{
              fontSize: '2.2rem',
              fontWeight: '800',
              color: '#1f2937',
              marginBottom: '8px',
              textAlign: 'center',
            }}
          >
            Start Your Free Trial
          </h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              14 Days Free
            </div>
            <div
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Secure
            </div>
            <div
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Cancel Anytime
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '40px',
            gap: '8px',
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              style={{
                width: '28px',
                height: '6px',
                borderRadius: '3px',
                background:
                  step <= currentStep
                    ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                    : '#e5e7eb',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              textAlign: 'center',
              color: '#dc2626',
            }}
          >
            {error}
          </div>
        )}

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '24px',
                textAlign: 'center',
                color: '#1f2937',
              }}
            >
              Let&apos;s get to know you
            </h2>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '10px',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    First Name
                  </label>
                  <input
                    type='text'
                    value={formData.firstName}
                    onChange={(e) =>
                      updateFormData('firstName', e.target.value)
                    }
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: '2px solid #e5e7eb',
                      background: '#f9fafb',
                      color: '#1f2937',
                      fontSize: '16px',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow =
                        '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      e.target.style.background = 'white';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                      e.target.style.background = '#f9fafb';
                    }}
                    placeholder='Enter your first name'
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '10px',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Last Name
                  </label>
                  <input
                    type='text'
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: '2px solid #e5e7eb',
                      background: '#f9fafb',
                      color: '#1f2937',
                      fontSize: '16px',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow =
                        '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      e.target.style.background = 'white';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                      e.target.style.background = '#f9fafb';
                    }}
                    placeholder='Enter your last name'
                  />
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: '500',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Email Address
                </label>
                <input
                  type='email'
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    background: '#f9fafb',
                    color: '#1f2937',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    fontSize: '16px',
                  }}
                  placeholder='you@yourcompany.com'
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: '500',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Phone Number (Optional)
                </label>
                <input
                  type='tel'
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    background: '#f9fafb',
                    color: '#1f2937',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    fontSize: '16px',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow =
                      '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    e.target.style.background = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#f9fafb';
                  }}
                  placeholder='(555) 123-4567'
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Password Setup */}
        {currentStep === 2 && (
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              Create your password
            </h2>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: '500',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Password
                </label>
                <input
                  type='password'
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    background: '#f9fafb',
                    color: '#1f2937',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    fontSize: '16px',
                  }}
                  placeholder='Create a strong password'
                />
                <p
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginTop: '4px',
                  }}
                >
                  Minimum 8 characters
                </p>
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: '500',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Confirm Password
                </label>
                <input
                  type='password'
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    updateFormData('confirmPassword', e.target.value)
                  }
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    background: '#f9fafb',
                    color: '#1f2937',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    fontSize: '16px',
                  }}
                  placeholder='Confirm your password'
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Company Information */}
        {currentStep === 3 && (
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              Tell us about your work
            </h2>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: '500',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Company Name
                </label>
                <input
                  type='text'
                  value={formData.companyName}
                  onChange={(e) =>
                    updateFormData('companyName', e.target.value)
                  }
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    background: '#f9fafb',
                    color: '#1f2937',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    fontSize: '16px',
                  }}
                  placeholder='Your company name'
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: '500',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Your Position/Title
                </label>
                <input
                  type='text'
                  value={formData.position}
                  onChange={(e) => updateFormData('position', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    background: '#f9fafb',
                    color: '#1f2937',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    fontSize: '16px',
                  }}
                  placeholder='e.g., Dispatcher, Owner-Operator, Broker'
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: '500',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => updateFormData('department', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    background: '#f9fafb',
                    color: '#1f2937',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    fontSize: '16px',
                  }}
                >
                  <option
                    value=''
                    style={{ background: '#1a1a2e', color: 'white' }}
                  >
                    Select your department
                  </option>
                  {departments.map((dept) => (
                    <option
                      key={dept}
                      value={dept}
                      style={{ background: '#1a1a2e', color: 'white' }}
                    >
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Plan Selection & Terms */}
        {currentStep === 4 && (
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              Choose your plan
            </h2>
            <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
              {availablePlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => updateFormData('selectedPlan', plan.id)}
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    border: `2px solid ${
                      formData.selectedPlan === plan.id
                        ? '#3b82f6'
                        : 'rgba(255, 255, 255, 0.2)'
                    }`,
                    background:
                      formData.selectedPlan === plan.id
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                  }}
                >
                  {plan.popular && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '16px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      🔥 POPULAR
                    </div>
                  )}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    <div style={{ fontSize: '32px' }}>{plan.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <h3
                          style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            margin: 0,
                          }}
                        >
                          {plan.name}
                        </h3>
                        <div
                          style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            color: '#3b82f6',
                          }}
                        >
                          {plan.price}
                        </div>
                      </div>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                          margin: '4px 0 0',
                        }}
                      >
                        {plan.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Terms and Marketing */}
            <div style={{ display: 'grid', gap: '16px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type='checkbox'
                  checked={formData.agreeToTerms}
                  onChange={(e) =>
                    updateFormData('agreeToTerms', e.target.checked)
                  }
                  style={{ marginTop: '4px' }}
                />
                <span style={{ fontSize: '14px', lineHeight: '1.5' }}>
                  I agree to the{' '}
                  <Link
                    href='/terms'
                    style={{ color: '#3b82f6', textDecoration: 'underline' }}
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href='/privacy'
                    style={{ color: '#3b82f6', textDecoration: 'underline' }}
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type='checkbox'
                  checked={formData.agreeToMarketing}
                  onChange={(e) =>
                    updateFormData('agreeToMarketing', e.target.checked)
                  }
                  style={{ marginTop: '4px' }}
                />
                <span
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  I&apos;d like to receive updates about FleetFlow features and
                  transportation industry news
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Step 5: Square Payment Verification */}
        {currentStep === 5 && (
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              Secure your trial
            </h2>
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '14px', color: '#60a5fa', margin: 0 }}>
                🔒 We&apos;ll securely verify your card details. You won&apos;t
                be charged until your 14-day free trial ends.
              </p>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              {/* Card Information */}
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: '500',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Card Number
                </label>
                <input
                  type='text'
                  value={formData.cardNumber}
                  onChange={(e) =>
                    updateFormData(
                      'cardNumber',
                      formatCardNumber(e.target.value)
                    )
                  }
                  maxLength={19}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    background: '#f9fafb',
                    color: '#1f2937',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    fontSize: '16px',
                  }}
                  placeholder='1234 5678 9012 3456'
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '16px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '10px',
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Month
                  </label>
                  <select
                    value={formData.expiryMonth}
                    onChange={(e) =>
                      updateFormData('expiryMonth', e.target.value)
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '16px',
                    }}
                  >
                    <option
                      value=''
                      style={{ background: '#1a1a2e', color: 'white' }}
                    >
                      MM
                    </option>
                    {Array.from({ length: 12 }, (_, i) =>
                      (i + 1).toString().padStart(2, '0')
                    ).map((month) => (
                      <option
                        key={month}
                        value={month}
                        style={{ background: '#1a1a2e', color: 'white' }}
                      >
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '10px',
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Year
                  </label>
                  <select
                    value={formData.expiryYear}
                    onChange={(e) =>
                      updateFormData('expiryYear', e.target.value)
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '16px',
                    }}
                  >
                    <option
                      value=''
                      style={{ background: '#1a1a2e', color: 'white' }}
                    >
                      YYYY
                    </option>
                    {years.map((year) => (
                      <option
                        key={year}
                        value={year}
                        style={{ background: '#1a1a2e', color: 'white' }}
                      >
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '10px',
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    CVC
                  </label>
                  <input
                    type='text'
                    value={formData.cvc}
                    onChange={(e) =>
                      updateFormData(
                        'cvc',
                        e.target.value.replace(/\D/g, '').slice(0, 4)
                      )
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '16px',
                    }}
                    placeholder='123'
                    maxLength={4}
                  />
                </div>
              </div>

              {/* Billing Address */}
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: '500',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Name on Card
                </label>
                <input
                  type='text'
                  value={formData.billingName}
                  onChange={(e) =>
                    updateFormData('billingName', e.target.value)
                  }
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    background: '#f9fafb',
                    color: '#1f2937',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    fontSize: '16px',
                  }}
                  placeholder='John Doe'
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: '500',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Billing Address
                </label>
                <input
                  type='text'
                  value={formData.billingAddress}
                  onChange={(e) =>
                    updateFormData('billingAddress', e.target.value)
                  }
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    background: '#f9fafb',
                    color: '#1f2937',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    fontSize: '16px',
                  }}
                  placeholder='123 Main St'
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr',
                  gap: '16px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '10px',
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    City
                  </label>
                  <input
                    type='text'
                    value={formData.billingCity}
                    onChange={(e) =>
                      updateFormData('billingCity', e.target.value)
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '16px',
                    }}
                    placeholder='Atlanta'
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '10px',
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    State
                  </label>
                  <select
                    value={formData.billingState}
                    onChange={(e) =>
                      updateFormData('billingState', e.target.value)
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '16px',
                    }}
                  >
                    <option
                      value=''
                      style={{ background: '#1a1a2e', color: 'white' }}
                    >
                      State
                    </option>
                    {states.map((state) => (
                      <option
                        key={state}
                        value={state}
                        style={{ background: '#1a1a2e', color: 'white' }}
                      >
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '10px',
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    ZIP
                  </label>
                  <input
                    type='text'
                    value={formData.billingZip}
                    onChange={(e) =>
                      updateFormData(
                        'billingZip',
                        e.target.value.replace(/\D/g, '').slice(0, 5)
                      )
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '16px',
                    }}
                    placeholder='30309'
                    maxLength={5}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Complete Profile */}
        {currentStep === 6 && (
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              Complete your profile
            </h2>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '14px', color: '#10b981', margin: 0 }}>
                🎉 Almost done! Just a few more details to personalize your
                FleetFlow experience.
              </p>
            </div>

            <div style={{ display: 'grid', gap: '24px' }}>
              {/* Emergency Contact Section */}
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#ef4444',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  🚨 Emergency Contact
                </h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '10px',
                          fontWeight: '500',
                          color: '#374151',
                          fontSize: '14px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Full Name
                      </label>
                      <input
                        type='text'
                        value={formData.emergencyContactName}
                        onChange={(e) =>
                          updateFormData('emergencyContactName', e.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '16px',
                        }}
                        placeholder='Emergency contact name'
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '10px',
                          fontWeight: '500',
                          color: '#374151',
                          fontSize: '14px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Relation
                      </label>
                      <select
                        value={formData.emergencyContactRelation}
                        onChange={(e) =>
                          updateFormData(
                            'emergencyContactRelation',
                            e.target.value
                          )
                        }
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '16px',
                        }}
                      >
                        {relations.map((relation) => (
                          <option
                            key={relation}
                            value={relation}
                            style={{ background: '#1a1a2e', color: 'white' }}
                          >
                            {relation}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '10px',
                          fontWeight: '500',
                          color: '#374151',
                          fontSize: '14px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Phone Number
                      </label>
                      <input
                        type='tel'
                        value={formData.emergencyContactPhone}
                        onChange={(e) =>
                          updateFormData(
                            'emergencyContactPhone',
                            e.target.value
                          )
                        }
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '16px',
                        }}
                        placeholder='(555) 123-4567'
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '10px',
                          fontWeight: '500',
                          color: '#374151',
                          fontSize: '14px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Alt Phone (Optional)
                      </label>
                      <input
                        type='tel'
                        value={formData.emergencyContactAltPhone}
                        onChange={(e) =>
                          updateFormData(
                            'emergencyContactAltPhone',
                            e.target.value
                          )
                        }
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '16px',
                        }}
                        placeholder='(555) 987-6543'
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Location & Preferences */}
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#3b82f6',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  🏢 Work & Preferences
                </h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '10px',
                          fontWeight: '500',
                          color: '#374151',
                          fontSize: '14px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Work Location
                      </label>
                      <select
                        value={formData.workLocation}
                        onChange={(e) =>
                          updateFormData('workLocation', e.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '16px',
                        }}
                      >
                        {locations.map((location) => (
                          <option
                            key={location}
                            value={location}
                            style={{ background: '#1a1a2e', color: 'white' }}
                          >
                            {location}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '10px',
                          fontWeight: '500',
                          color: '#374151',
                          fontSize: '14px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Timezone
                      </label>
                      <select
                        value={formData.timezone}
                        onChange={(e) =>
                          updateFormData('timezone', e.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '16px',
                        }}
                      >
                        {timezones.map((tz) => (
                          <option
                            key={tz.value}
                            value={tz.value}
                            style={{ background: '#1a1a2e', color: 'white' }}
                          >
                            {tz.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 2fr',
                      gap: '16px',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '10px',
                          fontWeight: '500',
                          color: '#374151',
                          fontSize: '14px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Theme
                      </label>
                      <select
                        value={formData.theme}
                        onChange={(e) =>
                          updateFormData('theme', e.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '16px',
                        }}
                      >
                        <option
                          value='dark'
                          style={{ background: '#1a1a2e', color: 'white' }}
                        >
                          🌙 Dark Theme
                        </option>
                        <option
                          value='light'
                          style={{ background: '#1a1a2e', color: 'white' }}
                        >
                          ☀️ Light Theme
                        </option>
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '10px',
                          fontWeight: '500',
                          color: '#374151',
                          fontSize: '14px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Notifications
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          gap: '20px',
                          alignItems: 'center',
                        }}
                      >
                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                          }}
                        >
                          <input
                            type='checkbox'
                            checked={formData.emailNotifications}
                            onChange={(e) =>
                              updateFormData(
                                'emailNotifications',
                                e.target.checked
                              )
                            }
                          />
                          📧 Email
                        </label>
                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                          }}
                        >
                          <input
                            type='checkbox'
                            checked={formData.smsNotifications}
                            onChange={(e) =>
                              updateFormData(
                                'smsNotifications',
                                e.target.checked
                              )
                            }
                          />
                          📱 SMS
                        </label>
                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                          }}
                        >
                          <input
                            type='checkbox'
                            checked={formData.loadAlerts}
                            onChange={(e) =>
                              updateFormData('loadAlerts', e.target.checked)
                            }
                          />
                          🚛 Load Alerts
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div
                style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#a855f7',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  👤 About You (Optional)
                </h3>
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '10px',
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Professional Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => updateFormData('bio', e.target.value)}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '16px',
                      resize: 'vertical',
                    }}
                    placeholder='Tell us about your experience in transportation and logistics...'
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '40px',
            gap: '16px',
          }}
        >
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              style={{
                padding: '14px 28px',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                background: '#f9fafb',
                color: '#374151',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#e5e7eb';
                e.target.style.borderColor = '#d1d5db';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#f9fafb';
                e.target.style.borderColor = '#e5e7eb';
              }}
            >
              Back
            </button>
          )}

          <div style={{ flex: 1 }} />

          {currentStep < 6 ? (
            <button
              onClick={handleNext}
              style={{
                padding: '14px 36px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.25)',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow =
                  '0 8px 25px 0 rgba(59, 130, 246, 0.35)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow =
                  '0 4px 14px 0 rgba(59, 130, 246, 0.25)';
              }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                padding: '12px 32px',
                borderRadius: '8px',
                border: 'none',
                background: isLoading
                  ? 'rgba(107, 114, 128, 0.5)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Securing Trial...' : 'Activate Free Trial 🚀'}
            </button>
          )}
        </div>

        {/* Security & Sign In Link */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          {currentStep === 5 && (
            <div
              style={{
                marginBottom: '16px',
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              🔒 Your payment information is secure and encrypted
            </div>
          )}
          <p style={{ color: '#6b7280' }}>
            Already have an account?{' '}
            <Link
              href='/auth/signin'
              style={{
                color: '#3b82f6',
                textDecoration: 'underline',
                fontWeight: '600',
                transition: 'color 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.target.style.color = '#1d4ed8';
              }}
              onMouseOut={(e) => {
                e.target.style.color = '#3b82f6';
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
