'use client';

import Link from 'next/link';
import React, { useState } from 'react';

interface EnrollmentForm {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  experience: string;
  goals: string;
  timeline: string;
  includeELDT: boolean;
}

export default function OwnerOperatorLaunchPage() {
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [enrollmentForm, setEnrollmentForm] = useState<EnrollmentForm>({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    experience: '',
    goals: '',
    timeline: '',
    includeELDT: false,
  });

  // Add CSS animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes truckDrive {
        0% { transform: translateX(0px) rotate(0deg); }
        50% { transform: translateX(10px) rotate(1deg); }
        100% { transform: translateX(0px) rotate(0deg); }
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.2); }
        50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.4); }
      }

      .truck-animation {
        animation: truckDrive 2s ease-in-out infinite;
      }

      .fade-in-up {
        animation: fadeInUp 0.8s ease-out;
      }

      .step-card {
        transition: all 0.3s ease;
      }

      .step-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 35px rgba(16, 185, 129, 0.2);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleEnrollmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.info('Owner operator enrollment submitted:', enrollmentForm);
    alert(
      'Thank you! We will contact you within 24 hours to begin your Owner Operator Success Program.'
    );
    setShowEnrollmentForm(false);
    setEnrollmentForm({
      name: '',
      email: '',
      phone: '',
      businessName: '',
      experience: '',
      goals: '',
      timeline: '',
      includeELDT: false,
    });
  };

  const programSteps = [
    {
      step: 1,
      title: 'Authority & Licensing Setup',
      description:
        'Complete DOT registration, authority applications, and legal requirements',
      icon: '📋',
      details: [
        'DOT number registration',
        'MC authority filing (if needed)',
        'UCR registration',
        'Business entity formation',
        'Insurance procurement guidance',
        'Safety compliance setup',
      ],
    },
    {
      step: 2,
      title: 'FleetFlow University℠ Training',
      description:
        'Comprehensive owner operator certification and operational training',
      icon: '🎓',
      details: [
        'Owner operator fundamentals',
        'Equipment and vehicle management',
        'Load acceptance and safety',
        'Rate negotiation basics',
        'ELD compliance and hours of service',
        'Business management essentials',
      ],
    },
    {
      step: 3,
      title: '45 Days Professional Coaching',
      description:
        'Bi-weekly mentorship with experienced owner operators and industry veterans',
      icon: '🚛',
      details: [
        'Personal coach assignment',
        'Bi-weekly strategy sessions',
        'Load selection guidance',
        'Customer relationship building',
        'Equipment maintenance advice',
        'Business optimization support',
      ],
    },
    {
      step: 4,
      title: 'Platform Launch & Operations',
      description:
        '3 months FREE FleetFlow Dispatcher Pro access and operational support',
      icon: '📱',
      details: [
        'Full platform access and training',
        'Load board integration',
        'GPS tracking and dispatch',
        'Customer communication tools',
        'Financial and mileage tracking',
        'Performance analytics',
      ],
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Effects */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '200px',
          height: '200px',
          background:
            'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'glow 4s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          width: '150px',
          height: '150px',
          background:
            'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'glow 3s ease-in-out infinite',
        }}
      />

      {/* Header */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'rgba(15, 15, 35, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
          padding: '12px 20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link href='/' style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#10b981',
                }}
              >
                ← FleetFlow
              </div>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link
              href='/launchpad'
              style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
              }}
            >
              ← Back to LaunchPad
            </Link>
            <button
              onClick={() => setShowEnrollmentForm(true)}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              🚀 Enroll Now
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ paddingTop: '80px' }}>
        {/* Hero Section */}
        <div
          style={{
            textAlign: 'center',
            padding: '80px 20px',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <div
            className='truck-animation'
            style={{ fontSize: '4rem', marginBottom: '20px' }}
          >
            🚛
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '900',
              background:
                'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '20px',
              lineHeight: '1.1',
            }}
          >
            Owner Operator Success Program
          </h1>
          <p
            style={{
              fontSize: '1.4rem',
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '15px',
              fontWeight: '500',
            }}
          >
            Your Complete Path to Owner Operator Success
          </p>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '700px',
              margin: '0 auto 40px',
              lineHeight: '1.6',
            }}
          >
            From licensing to launching - get everything you need to become a
            successful owner operator with our comprehensive 75-day program and
            3 months FREE FleetFlow platform access.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              marginBottom: '60px',
            }}
          >
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '16px',
                padding: '20px',
                border: '2px solid #10b981',
                display: 'inline-block',
              }}
            >
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '900',
                  color: 'white',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '20px',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '2rem',
                        color: 'white',
                        fontWeight: '900',
                      }}
                    >
                      $499
                    </div>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '0.8rem',
                      }}
                    >
                      Base Program
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      borderLeft: '2px solid rgba(255,255,255,0.3)',
                      paddingLeft: '20px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '2rem',
                        color: '#10b981',
                        fontWeight: '900',
                      }}
                    >
                      $799
                    </div>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '0.8rem',
                      }}
                    >
                      + ELDT Training ($350 value)
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                }}
              >
                Choose your program level • ELDT training optional for CDL
                licensing
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'inline-block',
              }}
            >
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '900',
                  color: '#10b981',
                }}
              >
                75 Days
              </div>
              <div
                style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}
              >
                To launch your business
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'inline-block',
              }}
            >
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '900',
                  color: '#f59e0b',
                }}
              >
                3 Months
              </div>
              <div
                style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}
              >
                FREE FleetFlow access ($297 value)
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowEnrollmentForm(true)}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              padding: '18px 36px',
              borderRadius: '12px',
              fontSize: '1.2rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow =
                '0 12px 35px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 8px 25px rgba(16, 185, 129, 0.3)';
            }}
          >
            🚀 Start My Owner Operator Journey
          </button>
        </div>

        {/* Program Steps */}
        <div style={{ padding: '60px 20px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2
              style={{
                textAlign: 'center',
                fontSize: '2.5rem',
                fontWeight: '800',
                color: 'white',
                marginBottom: '20px',
              }}
            >
              Your 75-Day Success Journey
            </h2>
            <p
              style={{
                textAlign: 'center',
                fontSize: '1.2rem',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '50px',
                maxWidth: '600px',
                margin: '0 auto 50px',
              }}
            >
              Step-by-step guidance from licensing to your first successful
              loads
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '30px',
              }}
            >
              {programSteps.map((step, index) => (
                <div
                  key={index}
                  className='step-card fade-in-up'
                  style={{
                    background: 'rgba(16, 185, 129, 0.05)',
                    borderRadius: '16px',
                    padding: '30px',
                    border: '2px solid rgba(16, 185, 129, 0.2)',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '-15px',
                      left: '20px',
                      background: '#10b981',
                      color: 'white',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    {step.step}
                  </div>

                  <div
                    style={{
                      fontSize: '3rem',
                      marginBottom: '15px',
                      marginTop: '10px',
                    }}
                  >
                    {step.icon}
                  </div>

                  <h3
                    style={{
                      fontSize: '1.4rem',
                      color: '#10b981',
                      marginBottom: '15px',
                      fontWeight: '700',
                    }}
                  >
                    {step.title}
                  </h3>

                  <p
                    style={{
                      color: 'rgba(255,255,255,0.8)',
                      lineHeight: '1.6',
                      marginBottom: '20px',
                    }}
                  >
                    {step.description}
                  </p>

                  <ul
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '0.9rem',
                      lineHeight: '1.8',
                      listStyle: 'none',
                      padding: 0,
                    }}
                  >
                    {step.details.map((detail, detailIndex) => (
                      <li
                        key={detailIndex}
                        style={{
                          marginBottom: '5px',
                          display: 'flex',
                          alignItems: 'flex-start',
                        }}
                      >
                        <span style={{ color: '#10b981', marginRight: '8px' }}>
                          •
                        </span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What's Included Detail */}
        <div
          style={{
            padding: '60px 20px',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2
              style={{
                textAlign: 'center',
                fontSize: '2.5rem',
                fontWeight: '800',
                color: 'white',
                marginBottom: '20px',
              }}
            >
              Everything You Need to Succeed
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '40px',
                marginTop: '40px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '30px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <h4
                  style={{
                    color: '#10b981',
                    marginBottom: '15px',
                    fontWeight: '700',
                  }}
                >
                  📋 Authority & Compliance
                </h4>
                <ul
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.95rem',
                    lineHeight: '1.8',
                    listStyle: 'none',
                    padding: 0,
                  }}
                >
                  <li>✓ DOT number registration</li>
                  <li>✓ MC authority filing assistance</li>
                  <li>✓ UCR registration support</li>
                  <li>✓ Business entity formation</li>
                  <li>✓ Insurance procurement guidance</li>
                  <li>✓ Safety compliance setup</li>
                </ul>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '30px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <h4
                  style={{
                    color: '#3b82f6',
                    marginBottom: '15px',
                    fontWeight: '700',
                  }}
                >
                  🎓 Professional Training
                </h4>
                <ul
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.95rem',
                    lineHeight: '1.8',
                    listStyle: 'none',
                    padding: 0,
                  }}
                >
                  <li>✓ Owner operator certification</li>
                  <li>✓ Equipment management training</li>
                  <li>✓ Load safety and acceptance</li>
                  <li>✓ ELD compliance and HOS</li>
                  <li>✓ Rate negotiation basics</li>
                  <li>✓ Business operations essentials</li>
                </ul>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '30px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <h4
                  style={{
                    color: '#f59e0b',
                    marginBottom: '15px',
                    fontWeight: '700',
                  }}
                >
                  🚛 Expert Coaching & Support
                </h4>
                <ul
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.95rem',
                    lineHeight: '1.8',
                    listStyle: 'none',
                    padding: 0,
                  }}
                >
                  <li>✓ Bi-weekly coaching calls</li>
                  <li>✓ Industry veteran mentorship</li>
                  <li>✓ Load selection guidance</li>
                  <li>✓ Equipment maintenance advice</li>
                  <li>✓ Customer relationship building</li>
                  <li>✓ Performance optimization</li>
                </ul>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '30px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <h4
                  style={{
                    color: '#8b5cf6',
                    marginBottom: '15px',
                    fontWeight: '700',
                  }}
                >
                  📱 Technology & Platform Access
                </h4>
                <ul
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.95rem',
                    lineHeight: '1.8',
                    listStyle: 'none',
                    padding: 0,
                  }}
                >
                  <li>✓ 3 months FREE FleetFlow Dispatcher Pro</li>
                  <li>✓ Advanced load board access</li>
                  <li>✓ GPS tracking and dispatch</li>
                  <li>✓ Customer communication tools</li>
                  <li>✓ Financial and mileage tracking</li>
                  <li>✓ Performance analytics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Success Metrics */}
        <div style={{ padding: '60px 20px' }}>
          <div
            style={{
              maxWidth: '1000px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: 'white',
                marginBottom: '20px',
              }}
            >
              Program Success Metrics
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '30px',
                marginTop: '40px',
              }}
            >
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '16px',
                  padding: '30px',
                  border: '2px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⚡</div>
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: '900',
                    color: '#10b981',
                  }}
                >
                  45 Days
                </div>
                <div
                  style={{ color: 'rgba(255,255,255,0.8)', marginTop: '5px' }}
                >
                  Average licensing time
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '16px',
                  padding: '30px',
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎯</div>
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: '900',
                    color: '#3b82f6',
                  }}
                >
                  92%
                </div>
                <div
                  style={{ color: 'rgba(255,255,255,0.8)', marginTop: '5px' }}
                >
                  First load success rate
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '16px',
                  padding: '30px',
                  border: '2px solid rgba(245, 158, 11, 0.3)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💰</div>
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: '900',
                    color: '#f59e0b',
                  }}
                >
                  $18K+
                </div>
                <div
                  style={{ color: 'rgba(255,255,255,0.8)', marginTop: '5px' }}
                >
                  Average first quarter revenue
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '16px',
                  padding: '30px',
                  border: '2px solid rgba(139, 92, 246, 0.3)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🚀</div>
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: '900',
                    color: '#8b5cf6',
                  }}
                >
                  75 Days
                </div>
                <div
                  style={{ color: 'rgba(255,255,255,0.8)', marginTop: '5px' }}
                >
                  Average time to profitable
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div
          style={{
            padding: '60px 20px',
            background:
              'linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #1e293b 100%)',
          }}
        >
          <div
            style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}
          >
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: 'white',
                marginBottom: '20px',
              }}
            >
              Ready to Become an Owner Operator?
            </h2>
            <p
              style={{
                fontSize: '1.2rem',
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '30px',
                lineHeight: '1.6',
              }}
            >
              Join hundreds of successful owner operators who started their
              careers with FleetFlow LaunchPad℠. Get licensed, equipped, and
              launched in just 75 days.
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '20px',
              }}
            >
              <button
                onClick={() => setShowEnrollmentForm(true)}
                style={{
                  background:
                    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '18px 36px',
                  borderRadius: '12px',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 35px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(16, 185, 129, 0.3)';
                }}
              >
                🚀 Start My Owner Operator Journey - $699
              </button>
              <Link href='/launchpad'>
                <button
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '18px 36px',
                    borderRadius: '12px',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }}
                >
                  ← Compare Programs
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Form Modal */}
      {showEnrollmentForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(5px)',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '40px',
              maxWidth: '500px',
              width: '90%',
              border: '2px solid rgba(16, 185, 129, 0.3)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            <h3
              style={{
                color: 'white',
                textAlign: 'center',
                marginBottom: '20px',
                fontSize: '1.8rem',
                fontWeight: '800',
              }}
            >
              🚀 Launch Your Owner Operator Career
            </h3>
            <form onSubmit={handleEnrollmentSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type='text'
                  placeholder='Full Name'
                  value={enrollmentForm.name}
                  onChange={(e) =>
                    setEnrollmentForm({
                      ...enrollmentForm,
                      name: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '16px',
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type='email'
                  placeholder='Email Address'
                  value={enrollmentForm.email}
                  onChange={(e) =>
                    setEnrollmentForm({
                      ...enrollmentForm,
                      email: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '16px',
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type='tel'
                  placeholder='Phone Number'
                  value={enrollmentForm.phone}
                  onChange={(e) =>
                    setEnrollmentForm({
                      ...enrollmentForm,
                      phone: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '16px',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type='text'
                  placeholder='Business Name (if applicable)'
                  value={enrollmentForm.businessName}
                  onChange={(e) =>
                    setEnrollmentForm({
                      ...enrollmentForm,
                      businessName: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '16px',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <select
                  value={enrollmentForm.experience}
                  onChange={(e) =>
                    setEnrollmentForm({
                      ...enrollmentForm,
                      experience: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '16px',
                  }}
                >
                  <option value=''>Select Your Experience Level</option>
                  <option value='beginner'>New to Transportation</option>
                  <option value='driver'>
                    Have CDL, New to Owner Operator
                  </option>
                  <option value='some'>Some Owner Operator Experience</option>
                  <option value='experienced'>
                    Experienced Owner Operator
                  </option>
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <textarea
                  placeholder='What are your goals as an owner operator?'
                  value={enrollmentForm.goals}
                  onChange={(e) =>
                    setEnrollmentForm({
                      ...enrollmentForm,
                      goals: e.target.value,
                    })
                  }
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '16px',
                    resize: 'vertical',
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <select
                  value={enrollmentForm.timeline}
                  onChange={(e) =>
                    setEnrollmentForm({
                      ...enrollmentForm,
                      timeline: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '16px',
                  }}
                >
                  <option value=''>When would you like to start?</option>
                  <option value='immediately'>Immediately</option>
                  <option value='within-month'>Within a month</option>
                  <option value='within-quarter'>Within 3 months</option>
                  <option value='exploring'>Just exploring options</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type='checkbox'
                    checked={enrollmentForm.includeELDT}
                    onChange={(e) =>
                      setEnrollmentForm({
                        ...enrollmentForm,
                        includeELDT: e.target.checked,
                      })
                    }
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: '#10b981',
                    }}
                  />
                  <span style={{ fontSize: '14px' }}>
                    <strong>Add ELDT Training (+$300)</strong> - CDL licensing
                    preparation and certification course
                  </span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type='submit'
                  style={{
                    flex: 1,
                    background:
                      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  🚀 Start My Journey
                </button>
                <button
                  type='button'
                  onClick={() => setShowEnrollmentForm(false)}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
