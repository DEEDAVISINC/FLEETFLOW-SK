'use client';

import { useState } from 'react';

export default function InsurancePartnershipsPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    mcNumber: '',
    dotNumber: '',
    yearsInBusiness: '',
    vehicleCount: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    driverCount: '',
    coverageTypes: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCoverageToggle = (coverageType: string) => {
    setFormData((prev) => ({
      ...prev,
      coverageTypes: prev.coverageTypes.includes(coverageType)
        ? prev.coverageTypes.filter((type) => type !== coverageType)
        : [...prev.coverageTypes, coverageType],
    }));
  };

  const handleSubmitQuoteRequest = async () => {
    if (isSubmitting) return;

    // Basic validation
    if (
      !formData.companyName ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone
    ) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.coverageTypes.length === 0) {
      alert('Please select at least one coverage type');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const submissionId = `INS-${Date.now()}`;
      const submissionData = {
        submissionId,
        companyName: formData.companyName,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        mcNumber: formData.mcNumber,
        dotNumber: formData.dotNumber,
        vehicleCount: parseInt(formData.vehicleCount) || 0,
        driverCount: parseInt(formData.driverCount) || 0,
        yearsInBusiness: formData.yearsInBusiness,
        coverageTypes: formData.coverageTypes,
        partnersContacted: 3, // CoverDash, Tivly, Insurify
        partnerNames: ['CoverDash', 'Tivly Affiliate', 'Insurify Partnership'],
        estimatedResponse: '24-48 hours',
        submittedAt: new Date().toISOString(),
      };

      // Send via universal email API
      const response = await fetch('/api/email/universal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'insurance_confirmation',
          recipient: {
            email: formData.email,
            name: `${formData.firstName} ${formData.lastName}`,
          },
          data: submissionData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          companyName: '',
          mcNumber: '',
          dotNumber: '',
          yearsInBusiness: '',
          vehicleCount: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          driverCount: '',
          coverageTypes: [],
        });
      } else {
        throw new Error(result.error || 'Failed to submit quote request');
      }
    } catch (error) {
      console.error('Quote submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const coverageOptions = [
    {
      id: 'commercial_auto',
      name: 'Commercial Auto',
      description: 'Required for all commercial vehicles',
    },
    {
      id: 'general_liability',
      name: 'General Liability',
      description: 'Protects against third-party claims',
    },
    {
      id: 'workers_comp',
      name: 'Workers Compensation',
      description: 'Required for employees in most states',
    },
    {
      id: 'cargo',
      name: 'Cargo Insurance',
      description: 'Protects freight being transported',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        padding: '60px 16px 16px 16px',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '12px',
              padding: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <span style={{ fontSize: '32px' }}>🛡️</span>
          </div>
          <h1
            style={{
              color: 'white',
              margin: 0,
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '8px',
            }}
          >
            FleetFlow Insurance Referral Partners
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              margin: 0,
              fontSize: '18px',
            }}
          >
            We connect you with licensed insurance providers - FleetFlow earns
            referral commissions
          </p>
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginTop: '16px',
              textAlign: 'left',
            }}
          >
            <p
              style={{
                color: '#10b981',
                fontSize: '14px',
                margin: 0,
                fontWeight: '600',
              }}
            >
              ⚠️ Important: FleetFlow operates as a referral partner only. We do
              not sell insurance directly. All insurance policies are provided
              by licensed insurance carriers through our partner network.
            </p>
          </div>
        </div>

        {/* Quote Request Form */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '32px',
              marginBottom: '32px',
            }}
          >
            {/* Business Information */}
            <div>
              <h3
                style={{
                  color: 'white',
                  margin: '0 0 20px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                📋 Business Information
              </h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                <input
                  type='text'
                  placeholder='Company Name *'
                  value={formData.companyName}
                  onChange={(e) =>
                    handleInputChange('companyName', e.target.value)
                  }
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '14px',
                    color: 'white',
                    fontSize: '16px',
                  }}
                />
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                  }}
                >
                  <input
                    type='text'
                    placeholder='MC Number'
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '14px',
                      color: 'white',
                      fontSize: '16px',
                    }}
                  />
                  <input
                    type='text'
                    placeholder='DOT Number'
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '14px',
                      color: 'white',
                      fontSize: '16px',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                  }}
                >
                  <select
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '14px',
                      color: 'white',
                      fontSize: '16px',
                    }}
                  >
                    <option value=''>Years in Business</option>
                    <option value='1-2'>1-2 years</option>
                    <option value='3-5'>3-5 years</option>
                    <option value='6-10'>6-10 years</option>
                    <option value='10+'>10+ years</option>
                  </select>
                  <input
                    type='number'
                    placeholder='Number of Vehicles'
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '14px',
                      color: 'white',
                      fontSize: '16px',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3
                style={{
                  color: 'white',
                  margin: '0 0 20px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                📞 Contact Information
              </h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                  }}
                >
                  <input
                    type='text'
                    placeholder='First Name *'
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange('firstName', e.target.value)
                    }
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '14px',
                      color: 'white',
                      fontSize: '16px',
                    }}
                  />
                  <input
                    type='text'
                    placeholder='Last Name *'
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange('lastName', e.target.value)
                    }
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '14px',
                      color: 'white',
                      fontSize: '16px',
                    }}
                  />
                </div>
                <input
                  type='email'
                  placeholder='Email Address *'
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '14px',
                    color: 'white',
                    fontSize: '16px',
                  }}
                />
                <input
                  type='tel'
                  placeholder='Phone Number *'
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '14px',
                    color: 'white',
                    fontSize: '16px',
                  }}
                />
                <input
                  type='number'
                  placeholder='Number of Drivers'
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '14px',
                    color: 'white',
                    fontSize: '16px',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Insurance Types */}
          <div style={{ marginBottom: '32px' }}>
            <h3
              style={{
                color: 'white',
                margin: '0 0 20px 0',
                fontSize: '18px',
                fontWeight: '600',
              }}
            >
              🛡️ What Insurance Do You Need?
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
              }}
            >
              {[
                {
                  id: 'commercial_auto',
                  label: 'Commercial Auto Insurance',
                  icon: '🚛',
                  desc: 'Required liability and physical damage coverage',
                },
                {
                  id: 'general_liability',
                  label: 'General Liability Insurance',
                  icon: '🛡️',
                  desc: 'Protects your business from third-party claims',
                },
                {
                  id: 'workers_comp',
                  label: 'Workers Compensation',
                  icon: '👥',
                  desc: 'Coverage for employee injuries and illnesses',
                },
                {
                  id: 'cargo',
                  label: 'Cargo Insurance',
                  icon: '📦',
                  desc: 'Protects freight and cargo you transport',
                },
                {
                  id: 'garage_liability',
                  label: 'Garage Liability',
                  icon: '🏢',
                  desc: 'Coverage for your business premises',
                },
                {
                  id: 'cyber_liability',
                  label: 'Cyber Liability',
                  icon: '💻',
                  desc: 'Protection against data breaches and cyber attacks',
                },
              ].map((coverage) => (
                <label
                  key={coverage.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.05)';
                  }}
                >
                  <input
                    type='checkbox'
                    style={{ width: '18px', height: '18px', marginTop: '2px' }}
                  />
                  <span style={{ fontSize: '24px' }}>{coverage.icon}</span>
                  <div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      {coverage.label}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                        lineHeight: '1.4',
                      }}
                    >
                      {coverage.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleSubmitQuoteRequest}
              disabled={isSubmitting}
              style={{
                background: isSubmitting
                  ? 'linear-gradient(135deg, #6b7280, #4b5563)'
                  : submitStatus === 'success'
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : submitStatus === 'error'
                      ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
                      : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '20px 60px',
                borderRadius: '12px',
                fontSize: '20px',
                fontWeight: '700',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                transition: 'all 0.3s ease',
                opacity: isSubmitting ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 32px rgba(16, 185, 129, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 24px rgba(16, 185, 129, 0.4)';
                }
              }}
            >
              {isSubmitting
                ? '⏳ Submitting Request...'
                : submitStatus === 'success'
                  ? '✅ Request Submitted!'
                  : submitStatus === 'error'
                    ? '❌ Try Again'
                    : '🚀 Get My Insurance Quotes Now'}
            </button>

            {submitStatus === 'success' && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '16px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  color: '#10b981',
                  textAlign: 'center',
                }}
              >
                ✅ <strong>Success!</strong> Your quote request has been
                submitted. Check your email for confirmation and expect calls
                from our insurance partners within 24-48 hours.
              </div>
            )}

            {submitStatus === 'error' && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '16px',
                  background: 'rgba(220, 38, 38, 0.1)',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  borderRadius: '8px',
                  color: '#dc2626',
                  textAlign: 'center',
                }}
              >
                ❌ <strong>Error:</strong> There was a problem submitting your
                request. Please try again or call (833) 386-3509 for assistance.
              </div>
            )}
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '16px',
                marginTop: '16px',
                marginBottom: 0,
              }}
            >
              Free referral to licensed insurance providers • No obligation •
              FleetFlow earns commission on completed policies
            </p>
          </div>
        </div>

        {/* Partner Network Section */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              color: 'white',
              margin: '0 0 24px 0',
              fontSize: '24px',
              fontWeight: '700',
            }}
          >
            🤝 Our Insurance Partner Network
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '24px',
            }}
          >
            {[
              {
                name: 'CoverDash',
                desc: 'Single-line NPM integration for embedded insurance quotes',
                commission: 'Revenue share program',
                icon: '💻',
              },
              {
                name: 'Tivly Affiliate',
                desc: '$300-$2,000+ commissions per policy without selling insurance',
                commission: 'High commission rates',
                icon: '💰',
              },
              {
                name: 'Insurify Partnership',
                desc: '120+ carriers with technology integration platform',
                commission: 'Technology integration commissions',
                icon: '🌐',
              },
            ].map((partner, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                  {partner.icon}
                </div>
                <h4
                  style={{
                    color: 'white',
                    margin: '0 0 8px 0',
                    fontSize: '18px',
                    fontWeight: '600',
                  }}
                >
                  {partner.name}
                </h4>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    margin: '0 0 8px 0',
                    lineHeight: '1.4',
                  }}
                >
                  {partner.desc}
                </p>
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    color: '#10b981',
                    fontWeight: '600',
                  }}
                >
                  {partner.commission}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'left',
            }}
          >
            <p
              style={{
                color: '#3b82f6',
                fontSize: '14px',
                margin: 0,
                fontWeight: '600',
              }}
            >
              💡 How It Works: FleetFlow connects you with our licensed
              insurance partner network. When you complete a policy through our
              referrals, we earn a commission while you get competitive rates
              from A-rated carriers. This referral model allows us to offer this
              service at no cost to you.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {[
            {
              icon: '💰',
              title: 'Save Money',
              desc: 'Compare quotes from multiple A-rated carriers to find the best rates for your business',
            },
            {
              icon: '⚡',
              title: 'Fast & Simple',
              desc: 'Get competitive quotes in 24-48 hours with our simple process',
            },
            {
              icon: '🎯',
              title: 'Trucking Specialists',
              desc: 'Work with insurance experts who understand the transportation industry',
            },
            {
              icon: '🛡️',
              title: 'Full Coverage',
              desc: 'From commercial auto to cargo insurance, we help you get complete protection',
            },
          ].map((benefit, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                {benefit.icon}
              </div>
              <h4
                style={{
                  color: 'white',
                  margin: '0 0 12px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                {benefit.title}
              </h4>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  margin: 0,
                  lineHeight: '1.5',
                }}
              >
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
