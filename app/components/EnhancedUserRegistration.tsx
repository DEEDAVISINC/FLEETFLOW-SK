'use client';

import {
  AlertCircle,
  Building2,
  CheckCircle,
  Eye,
  EyeOff,
  User,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import EnhancedUserManagementService, {
  BusinessRegistrationData,
} from '../services/EnhancedUserManagementService';

interface EnhancedUserRegistrationProps {
  onRegistrationSuccess: (
    userId: string,
    userType: 'individual' | 'business_entity'
  ) => void;
  onCancel: () => void;
  availableParentCompanies?: { id: string; name: string; owner: string }[];
}

export default function EnhancedUserRegistration({
  onRegistrationSuccess,
  onCancel,
  availableParentCompanies = [],
}: EnhancedUserRegistrationProps) {
  const [registrationType, setRegistrationType] = useState<
    'individual' | 'business_entity'
  >('individual');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Individual user form data
  const [individualData, setIndividualData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Dispatch',
    position: '',
    parentCompanyId: '',
    territories: [] as string[],
    specializations: [] as string[],
    password: '',
    confirmPassword: '',
  });

  // Business entity form data
  const [businessData, setBusinessData] = useState<BusinessRegistrationData>({
    companyName: '',
    businessAddress: '',
    businessPhone: '',
    businessEmail: '',
    mcNumber: '',
    dotNumber: '',
    taxId: '',
    ownerFirstName: '',
    ownerLastName: '',
    ownerEmail: '',
    ownerPhone: '',
    position: 'Owner/Manager',
    territories: [],
    specializations: [],
    businessType: 'freight_brokerage',
    incorporationDate: '',
    password: '',
    confirmPassword: '',
  });

  const territories = [
    'Northeast',
    'Southeast',
    'Midwest',
    'Southwest',
    'West Coast',
    'Pacific Northwest',
    'Texas',
    'Florida',
    'California',
    'Local',
  ];

  const specializations = [
    'Dry Van',
    'Refrigerated',
    'Flatbed',
    'Step Deck',
    'Lowboy',
    'Tanker',
    'Auto Transport',
    'Heavy Haul',
    'Expedited',
    'LTL',
  ];

  const departments = [
    { code: 'DC', name: 'Dispatch', color: '#3b82f6' },
    { code: 'BB', name: 'Broker Agent', color: '#f97316' },
    { code: 'DM', name: 'Driver Management', color: '#f4a832' },
    { code: 'MGR', name: 'Management', color: '#9333ea' },
  ];

  const handleIndividualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Validate passwords match
      if (individualData.password !== individualData.confirmPassword) {
        setMessage({ type: 'error', text: 'Passwords do not match' });
        setLoading(false);
        return;
      }

      // For broker agents, require parent company
      if (
        individualData.department === 'Broker Agent' &&
        !individualData.parentCompanyId
      ) {
        setMessage({
          type: 'error',
          text: 'Broker agents must be assigned to a brokerage company',
        });
        setLoading(false);
        return;
      }

      const result =
        await EnhancedUserManagementService.createAgentUser(individualData);

      if (result.success && result.userId) {
        setMessage({ type: 'success', text: result.message });
        onRegistrationSuccess(result.userId, 'individual');
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Registration failed. Please try again.',
      });
    }

    setLoading(false);
  };

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const validation =
        EnhancedUserManagementService.validateBusinessRegistration(
          businessData
        );

      if (!validation.isValid) {
        setMessage({ type: 'error', text: validation.errors.join(', ') });
        setLoading(false);
        return;
      }

      const result =
        await EnhancedUserManagementService.createBusinessEntity(businessData);

      if (result.success && result.userId) {
        setMessage({ type: 'success', text: result.message });
        onRegistrationSuccess(result.userId, 'business_entity');
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Registration failed. Please try again.',
      });
    }

    setLoading(false);
  };

  const toggleArrayValue = (array: string[], value: string) => {
    return array.includes(value)
      ? array.filter((item) => item !== value)
      : [...array, value];
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: '30px',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px',
            }}
          >
            <Users size={28} style={{ color: 'white' }} />
          </div>
          <h2
            style={{
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              margin: '0 0 8px 0',
            }}
          >
            Add New User / Business Entity
          </h2>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              margin: 0,
            }}
          >
            Choose whether to add an individual user or register a business
            entity
          </p>
        </div>

        {/* Registration Type Selection */}
        <div style={{ marginBottom: '30px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '12px',
              fontWeight: '600',
              color: 'white',
              fontSize: '14px',
            }}
          >
            Registration Type
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <label
              style={{
                flex: 1,
                padding: '16px',
                border: `2px solid ${registrationType === 'individual' ? '#3b82f6' : 'rgba(255, 255, 255, 0.2)'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                background:
                  registrationType === 'individual'
                    ? 'rgba(59, 130, 246, 0.1)'
                    : 'rgba(255, 255, 255, 0.05)',
                transition: 'all 0.3s ease',
                textAlign: 'center',
              }}
            >
              <input
                type='radio'
                name='registrationType'
                value='individual'
                checked={registrationType === 'individual'}
                onChange={(e) =>
                  setRegistrationType(
                    e.target.value as 'individual' | 'business_entity'
                  )
                }
                style={{ display: 'none' }}
              />
              <User
                size={24}
                style={{ color: '#3b82f6', marginBottom: '8px' }}
              />
              <div
                style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}
              >
                Individual User
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}
              >
                Dispatcher, Agent, Driver, etc.
              </div>
            </label>

            <label
              style={{
                flex: 1,
                padding: '16px',
                border: `2px solid ${registrationType === 'business_entity' ? '#10b981' : 'rgba(255, 255, 255, 0.2)'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                background:
                  registrationType === 'business_entity'
                    ? 'rgba(16, 185, 129, 0.1)'
                    : 'rgba(255, 255, 255, 0.05)',
                transition: 'all 0.3s ease',
                textAlign: 'center',
              }}
            >
              <input
                type='radio'
                name='registrationType'
                value='business_entity'
                checked={registrationType === 'business_entity'}
                onChange={(e) =>
                  setRegistrationType(
                    e.target.value as 'individual' | 'business_entity'
                  )
                }
                style={{ display: 'none' }}
              />
              <Building2
                size={24}
                style={{ color: '#10b981', marginBottom: '8px' }}
              />
              <div
                style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}
              >
                Business Entity
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}
              >
                Freight Brokerage Company
              </div>
            </label>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background:
                message.type === 'success'
                  ? 'rgba(16, 185, 129, 0.1)'
                  : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
              color: message.type === 'success' ? '#10b981' : '#ef4444',
            }}
          >
            {message.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            {message.text}
          </div>
        )}

        {/* Individual User Form */}
        {registrationType === 'individual' && (
          <form onSubmit={handleIndividualSubmit}>
            {/* Personal Information */}
            <div style={{ marginBottom: '20px' }}>
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  marginBottom: '15px',
                }}
              >
                Personal Information
              </h3>
              <div
                style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}
              >
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    First Name *
                  </label>
                  <input
                    type='text'
                    required
                    value={individualData.firstName}
                    onChange={(e) =>
                      setIndividualData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Last Name *
                  </label>
                  <input
                    type='text'
                    required
                    value={individualData.lastName}
                    onChange={(e) =>
                      setIndividualData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>

              <div
                style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}
              >
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Email Address *
                  </label>
                  <input
                    type='email'
                    required
                    value={individualData.email}
                    onChange={(e) =>
                      setIndividualData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Phone Number
                  </label>
                  <input
                    type='tel'
                    value={individualData.phone}
                    onChange={(e) =>
                      setIndividualData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>

              <div
                style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}
              >
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Department *
                  </label>
                  <select
                    required
                    value={individualData.department}
                    onChange={(e) =>
                      setIndividualData((prev) => ({
                        ...prev,
                        department: e.target.value,
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  >
                    {departments.map((dept) => (
                      <option
                        key={dept.code}
                        value={dept.name}
                        style={{ background: '#1e293b', color: 'white' }}
                      >
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Position/Title
                  </label>
                  <input
                    type='text'
                    value={individualData.position}
                    onChange={(e) =>
                      setIndividualData((prev) => ({
                        ...prev,
                        position: e.target.value,
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>

              {/* Parent Company Selection for Broker Agents */}
              {individualData.department === 'Broker Agent' && (
                <div style={{ marginBottom: '15px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Parent Brokerage Company *
                  </label>
                  <select
                    required
                    value={individualData.parentCompanyId}
                    onChange={(e) =>
                      setIndividualData((prev) => ({
                        ...prev,
                        parentCompanyId: e.target.value,
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  >
                    <option
                      value=''
                      style={{ background: '#1e293b', color: 'white' }}
                    >
                      Select a brokerage company...
                    </option>
                    {availableParentCompanies.map((company) => (
                      <option
                        key={company.id}
                        value={company.id}
                        style={{ background: '#1e293b', color: 'white' }}
                      >
                        {company.name} ({company.owner})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Password Fields */}
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={individualData.password}
                      onChange={(e) =>
                        setIndividualData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      style={{
                        width: '100%',
                        padding: '10px 40px 10px 10px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.6)',
                        cursor: 'pointer',
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Confirm Password *
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={individualData.confirmPassword}
                    onChange={(e) =>
                      setIndividualData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                marginTop: '30px',
              }}
            >
              <button
                type='button'
                onClick={onCancel}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  background: loading
                    ? 'rgba(59, 130, 246, 0.5)'
                    : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                {loading ? 'Creating...' : 'Create Individual User'}
              </button>
            </div>
          </form>
        )}

        {/* Business Entity Form */}
        {registrationType === 'business_entity' && (
          <form onSubmit={handleBusinessSubmit}>
            {/* Company Information */}
            <div style={{ marginBottom: '20px' }}>
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  marginBottom: '15px',
                }}
              >
                Company Information
              </h3>

              <div style={{ marginBottom: '15px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '6px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '12px',
                  }}
                >
                  Company Name *
                </label>
                <input
                  type='text'
                  required
                  value={businessData.companyName}
                  onChange={(e) =>
                    setBusinessData((prev) => ({
                      ...prev,
                      companyName: e.target.value,
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                  placeholder='Smith Freight Brokerage LLC'
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '6px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '12px',
                  }}
                >
                  Business Address *
                </label>
                <input
                  type='text'
                  required
                  value={businessData.businessAddress}
                  onChange={(e) =>
                    setBusinessData((prev) => ({
                      ...prev,
                      businessAddress: e.target.value,
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                  placeholder='1234 Business Ave, City, State 12345'
                />
              </div>

              <div
                style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}
              >
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Business Phone *
                  </label>
                  <input
                    type='tel'
                    required
                    value={businessData.businessPhone}
                    onChange={(e) =>
                      setBusinessData((prev) => ({
                        ...prev,
                        businessPhone: e.target.value,
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Business Email *
                  </label>
                  <input
                    type='email'
                    required
                    value={businessData.businessEmail}
                    onChange={(e) =>
                      setBusinessData((prev) => ({
                        ...prev,
                        businessEmail: e.target.value,
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>

              <div
                style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}
              >
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    MC Number
                  </label>
                  <input
                    type='text'
                    value={businessData.mcNumber}
                    onChange={(e) =>
                      setBusinessData((prev) => ({
                        ...prev,
                        mcNumber: e.target.value,
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                    placeholder='MC-123456'
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    DOT Number
                  </label>
                  <input
                    type='text'
                    value={businessData.dotNumber}
                    onChange={(e) =>
                      setBusinessData((prev) => ({
                        ...prev,
                        dotNumber: e.target.value,
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                    placeholder='DOT-789012'
                  />
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div style={{ marginBottom: '20px' }}>
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  marginBottom: '15px',
                }}
              >
                Owner/Contact Information
              </h3>

              <div
                style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}
              >
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Owner First Name *
                  </label>
                  <input
                    type='text'
                    required
                    value={businessData.ownerFirstName}
                    onChange={(e) =>
                      setBusinessData((prev) => ({
                        ...prev,
                        ownerFirstName: e.target.value,
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Owner Last Name *
                  </label>
                  <input
                    type='text'
                    required
                    value={businessData.ownerLastName}
                    onChange={(e) =>
                      setBusinessData((prev) => ({
                        ...prev,
                        ownerLastName: e.target.value,
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>

              <div
                style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}
              >
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Owner Email *
                  </label>
                  <input
                    type='email'
                    required
                    value={businessData.ownerEmail}
                    onChange={(e) =>
                      setBusinessData((prev) => ({
                        ...prev,
                        ownerEmail: e.target.value,
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Owner Phone
                  </label>
                  <input
                    type='tel'
                    value={businessData.ownerPhone}
                    onChange={(e) =>
                      setBusinessData((prev) => ({
                        ...prev,
                        ownerPhone: e.target.value,
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={businessData.password}
                      onChange={(e) =>
                        setBusinessData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      style={{
                        width: '100%',
                        padding: '10px 40px 10px 10px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.6)',
                        cursor: 'pointer',
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Confirm Password *
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={businessData.confirmPassword}
                    onChange={(e) =>
                      setBusinessData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                marginTop: '30px',
              }}
            >
              <button
                type='button'
                onClick={onCancel}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  background: loading
                    ? 'rgba(16, 185, 129, 0.5)'
                    : 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                {loading ? 'Creating...' : 'Create Business Entity'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
