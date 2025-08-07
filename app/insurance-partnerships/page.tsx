'use client';

export default function InsurancePartnershipsPage() {
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
            Get Commercial Insurance Quotes
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              margin: 0,
              fontSize: '18px',
            }}
          >
            Compare quotes from multiple A-rated insurance carriers
          </p>
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
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '20px 60px',
                borderRadius: '12px',
                fontSize: '20px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 12px 32px rgba(16, 185, 129, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 8px 24px rgba(16, 185, 129, 0.4)';
              }}
            >
              🚀 Get My Insurance Quotes Now
            </button>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '16px',
                marginTop: '16px',
                marginBottom: 0,
              }}
            >
              Free quotes from multiple carriers • No obligation • 24-48 hour
              response
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
              desc: 'Get competitive quotes in 24-48 hours with our streamlined process',
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
