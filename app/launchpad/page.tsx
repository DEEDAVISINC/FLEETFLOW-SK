'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import Logo from '../components/Logo';

interface DemoBookingForm {
  name: string;
  email: string;
  company: string;
  phone: string;
  programInterest: string;
  message: string;
}

export default function LaunchPadPage() {
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [demoForm, setDemoForm] = useState<DemoBookingForm>({
    name: '',
    email: '',
    company: '',
    phone: '',
    programInterest: '',
    message: '',
  });

  // Add CSS animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rocketLaunch {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(2deg); }
        100% { transform: translateY(0px) rotate(0deg); }
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.8; }
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
        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.2); }
        50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.4); }
      }

      .rocket-animation {
        animation: rocketLaunch 2s ease-in-out infinite;
      }

      .fade-in-up {
        animation: fadeInUp 0.8s ease-out;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.info('LaunchPad inquiry submitted:', demoForm);
    alert(
      'Thank you! We will contact you within 24 hours to discuss your LaunchPad options.'
    );
    setShowDemoForm(false);
    setDemoForm({
      name: '',
      email: '',
      company: '',
      phone: '',
      programInterest: '',
      message: '',
    });
  };

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
            'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse 4s ease-in-out infinite',
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
            'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse 3s ease-in-out infinite',
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
          background: '#ffffff',
          backdropFilter: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
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
            <Logo />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link
              href='/'
              style={{
                color: '#1f2937',
                textDecoration: 'none',
                fontWeight: '500',
              }}
            >
              ← Back to Home
            </Link>
            <button
              onClick={() => setShowDemoForm(true)}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
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
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Coming Soon Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 5000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '24px',
            padding: '60px',
            maxWidth: '600px',
            width: '90%',
            textAlign: 'center',
            border: '2px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            position: 'relative',
          }}
        >
          {/* Animated Rocket */}
          <div
            style={{
              fontSize: '6rem',
              marginBottom: '30px',
              animation: 'rocketLaunch 2s ease-in-out infinite',
            }}
          >
            🚀
          </div>

          {/* Coming Soon Title */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '20px',
              lineHeight: '1.1',
            }}
          >
            Coming Soon!
          </h1>

          {/* Subtitle */}
          <h2
            style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: 'white',
              marginBottom: '20px',
            }}
          >
            FleetFlow LaunchPad℠
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '30px',
              lineHeight: '1.6',
              maxWidth: '500px',
              margin: '0 auto 30px',
            }}
          >
            We're building something amazing! Our comprehensive transportation business launch platform is currently in development while we establish key partnerships and integrate essential APIs.
          </p>

          {/* Features Preview */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h3
              style={{
                color: '#3b82f6',
                marginBottom: '20px',
                fontSize: '1.4rem',
                fontWeight: '700',
              }}
            >
              🚀 What's Coming:
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                textAlign: 'left',
              }}
            >
              <div>
                <h4
                  style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}
                >
                  🤝 Broker Launch Program
                </h4>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.9rem',
                    lineHeight: '1.4',
                  }}
                >
                  Complete MC authority setup, bonding, and certification
                </p>
              </div>
              <div>
                <h4
                  style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}
                >
                  🚛 Owner Operator Program
                </h4>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.9rem',
                    lineHeight: '1.4',
                  }}
                >
                  DOT registration, insurance coordination, and training
                </p>
              </div>
              <div>
                <h4
                  style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}
                >
                  🎓 FleetFlow University℠
                </h4>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.9rem',
                    lineHeight: '1.4',
                  }}
                >
                  Professional certification and mentorship programs
                </p>
              </div>
              <div>
                <h4
                  style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}
                >
                  🏢 Business Formation
                </h4>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.9rem',
                    lineHeight: '1.4',
                  }}
                >
                  LLC setup, tax ID, legal guidance, and compliance
                </p>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '10px',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>⚡</span>
              <h4
                style={{
                  color: '#f59e0b',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  margin: 0,
                }}
              >
                Development in Progress
              </h4>
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.95rem',
                margin: 0,
                lineHeight: '1.5',
              }}
            >
              We're actively building partnerships with licensing authorities, insurance providers, and training institutions to deliver the most comprehensive launch platform in the transportation industry.
            </p>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              alignItems: 'center',
            }}
          >
            <button
              onClick={() => setShowDemoForm(true)}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease',
                minWidth: '200px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
              }}
            >
              📋 Get Notified When Live
            </button>

            <Link
              href='/'
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              ← Back to FleetFlow
            </Link>
          </div>

          {/* Progress Indicator */}
          <div
            style={{
              marginTop: '30px',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
              }}
            >
              <span
                style={{
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                }}
              >
                Development Progress
              </span>
              <span
                style={{
                  color: '#10b981',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                }}
              >
                65% Complete
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '65%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.8rem',
                marginTop: '10px',
                marginBottom: 0,
              }}
            >
              API integrations and partnerships in final development stages
            </p>
          </div>
        </div>
      </div>

      {/* Main Content (Hidden behind overlay) */}
      <div style={{ paddingTop: '80px', opacity: '0.1', pointerEvents: 'none' }}>
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
            className='rocket-animation'
            style={{ fontSize: '4rem', marginBottom: '20px' }}
          >
            🚀
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '900',
              background:
                'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '20px',
              lineHeight: '1.1',
            }}
          >
            FleetFlow LaunchPad℠
          </h1>
          <p
            style={{
              fontSize: '1.4rem',
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '15px',
              fontWeight: '500',
            }}
          >
            Your Complete Transportation Business Launch Platform
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
            From licensing to launching - comprehensive guidance for brokers and
            owner operators starting their transportation careers with
            professional support and enterprise tools.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '20px',
              marginBottom: '60px',
            }}
          >
            <Link href='#broker-program'>
              <button
                style={{
                  background:
                    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: '2px solid #3b82f6',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 35px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(59, 130, 246, 0.3)';
                }}
              >
                🤝 Broker Launch Program
              </button>
            </Link>
            <Link href='#owner-operator-program'>
              <button
                style={{
                  background:
                    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: '2px solid #10b981',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
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
                🚛 Owner Operator Program
              </button>
            </Link>
          </div>
        </div>

        {/* Program Comparison */}
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
              Choose Your Launch Path
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
              Two comprehensive programs designed for different transportation
              career paths
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '40px',
              }}
            >
              {/* Broker Program Card */}
              <div
                id='broker-program'
                className='fade-in-up'
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '20px',
                  padding: '40px',
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow =
                    '0 20px 40px rgba(59, 130, 246, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '15px' }}>
                    🤝
                  </div>
                  <h3
                    style={{
                      fontSize: '1.8rem',
                      color: '#3b82f6',
                      marginBottom: '10px',
                      fontWeight: '800',
                    }}
                  >
                    Broker Launch Program
                  </h3>
                  <div
                    style={{
                      fontSize: '3rem',
                      color: 'white',
                      fontWeight: '900',
                      marginBottom: '15px',
                    }}
                  >
                    $999
                  </div>
                  <p
                    style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}
                  >
                    One-time fee • Complete launch package
                  </p>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h4
                    style={{
                      color: '#3b82f6',
                      marginBottom: '15px',
                      fontWeight: '700',
                    }}
                  >
                    What's Included:
                  </h4>
                  <ul
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '1rem',
                      lineHeight: '1.8',
                      listStyle: 'none',
                      padding: 0,
                    }}
                  >
                    <li
                      style={{
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          color: '#10b981',
                          marginRight: '10px',
                          fontSize: '1.2rem',
                        }}
                      >
                        ✓
                      </span>
                      <span>
                        <strong>MC Authority Application:</strong> Complete
                        FMCSA filing assistance
                      </span>
                    </li>
                    <li
                      style={{
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          color: '#10b981',
                          marginRight: '10px',
                          fontSize: '1.2rem',
                        }}
                      >
                        ✓
                      </span>
                      <span>
                        <strong>BMC-84 Bond Setup:</strong> $75K surety bond
                        procurement guidance
                      </span>
                    </li>
                    <li
                      style={{
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          color: '#10b981',
                          marginRight: '10px',
                          fontSize: '1.2rem',
                        }}
                      >
                        ✓
                      </span>
                      <span>
                        <strong>FleetFlow University℠:</strong> 40-hour broker
                        certification program
                      </span>
                    </li>
                    <li
                      style={{
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          color: '#10b981',
                          marginRight: '10px',
                          fontSize: '1.2rem',
                        }}
                      >
                        ✓
                      </span>
                      <span>
                        <strong>60 Days Coaching:</strong> Weekly mentorship
                        calls with industry experts
                      </span>
                    </li>
                    <li
                      style={{
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          color: '#10b981',
                          marginRight: '10px',
                          fontSize: '1.2rem',
                        }}
                      >
                        ✓
                      </span>
                      <span>
                        <strong>Business Formation:</strong> LLC setup, tax ID,
                        and legal guidance
                      </span>
                    </li>
                    <li
                      style={{
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          color: '#10b981',
                          marginRight: '10px',
                          fontSize: '1.2rem',
                        }}
                      >
                        ✓
                      </span>
                      <span>
                        <strong>FleetFlow Broker Elite:</strong> 3 months FREE
                        platform access ($447 value)
                      </span>
                    </li>
                  </ul>
                </div>

                <Link href='/launchpad/broker'>
                  <button
                    style={{
                      background:
                        'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '16px 32px',
                      borderRadius: '12px',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      width: '100%',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    🚀 Launch My Broker Career
                  </button>
                </Link>
              </div>

              {/* Owner Operator Program Card */}
              <div
                id='owner-operator-program'
                className='fade-in-up'
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '20px',
                  padding: '40px',
                  border: '2px solid rgba(16, 185, 129, 0.3)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow =
                    '0 20px 40px rgba(16, 185, 129, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '15px' }}>
                    🚛
                  </div>
                  <h3
                    style={{
                      fontSize: '1.8rem',
                      color: '#10b981',
                      marginBottom: '10px',
                      fontWeight: '800',
                    }}
                  >
                    Owner Operator Success Program
                  </h3>
                  <div
                    style={{
                      fontSize: '3rem',
                      color: 'white',
                      fontWeight: '900',
                      marginBottom: '15px',
                    }}
                  >
                    $699
                  </div>
                  <p
                    style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}
                  >
                    One-time fee • Complete launch package
                  </p>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h4
                    style={{
                      color: '#10b981',
                      marginBottom: '15px',
                      fontWeight: '700',
                    }}
                  >
                    What's Included:
                  </h4>
                  <ul
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '1rem',
                      lineHeight: '1.8',
                      listStyle: 'none',
                      padding: 0,
                    }}
                  >
                    <li
                      style={{
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          color: '#10b981',
                          marginRight: '10px',
                          fontSize: '1.2rem',
                        }}
                      >
                        ✓
                      </span>
                      <span>
                        <strong>DOT Registration:</strong> Complete USDOT number
                        application
                      </span>
                    </li>
                    <li
                      style={{
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          color: '#10b981',
                          marginRight: '10px',
                          fontSize: '1.2rem',
                        }}
                      >
                        ✓
                      </span>
                      <span>
                        <strong>Authority Setup:</strong> MC authority filing
                        assistance
                      </span>
                    </li>
                    <li
                      style={{
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          color: '#10b981',
                          marginRight: '10px',
                          fontSize: '1.2rem',
                        }}
                      >
                        ✓
                      </span>
                      <span>
                        <strong>FleetFlow University℠:</strong> Owner operator
                        certification training
                      </span>
                    </li>
                    <li
                      style={{
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          color: '#10b981',
                          marginRight: '10px',
                          fontSize: '1.2rem',
                        }}
                      >
                        ✓
                      </span>
                      <span>
                        <strong>45 Days Coaching:</strong> Bi-weekly mentorship
                        with industry veterans
                      </span>
                    </li>
                    <li
                      style={{
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          color: '#10b981',
                          marginRight: '10px',
                          fontSize: '1.2rem',
                        }}
                      >
                        ✓
                      </span>
                      <span>
                        <strong>Insurance Coordination:</strong> Required
                        coverage setup assistance
                      </span>
                    </li>
                    <li
                      style={{
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          color: '#10b981',
                          marginRight: '10px',
                          fontSize: '1.2rem',
                        }}
                      >
                        ✓
                      </span>
                      <span>
                        <strong>FleetFlow Dispatcher Pro:</strong> 3 months FREE
                        platform access ($297 value)
                      </span>
                    </li>
                  </ul>
                </div>

                <Link href='/launchpad/owner-operator'>
                  <button
                    style={{
                      background:
                        'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '16px 32px',
                      borderRadius: '12px',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      width: '100%',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    🚀 Launch My Owner Operator Career
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Success Stories */}
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
              Success Stories
            </h2>
            <p
              style={{
                textAlign: 'center',
                fontSize: '1.2rem',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '50px',
              }}
            >
              Real professionals who launched successful transportation careers
              with LaunchPad
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '30px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '30px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>⭐</div>
                <h4
                  style={{
                    color: '#3b82f6',
                    marginBottom: '15px',
                    fontWeight: '700',
                  }}
                >
                  "From Zero to Licensed Broker in 30 Days"
                </h4>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    lineHeight: '1.6',
                    marginBottom: '15px',
                  }}
                >
                  "LaunchPad made the complex licensing process simple. I was up
                  and running with my MC authority faster than I ever imagined
                  possible."
                </p>
                <p style={{ color: '#10b981', fontWeight: '600' }}>
                  - Sarah M., Freight Broker
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '30px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🚛</div>
                <h4
                  style={{
                    color: '#10b981',
                    marginBottom: '15px',
                    fontWeight: '700',
                  }}
                >
                  "Professional Setup Saved Me Thousands"
                </h4>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    lineHeight: '1.6',
                    marginBottom: '15px',
                  }}
                >
                  "The coaching and guidance prevented costly mistakes. I had my
                  DOT number and insurance set up correctly the first time."
                </p>
                <p style={{ color: '#10b981', fontWeight: '600' }}>
                  - Mike R., Owner Operator
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '30px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🎓</div>
                <h4
                  style={{
                    color: '#f59e0b',
                    marginBottom: '15px',
                    fontWeight: '700',
                  }}
                >
                  "FleetFlow University Made All the Difference"
                </h4>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    lineHeight: '1.6',
                    marginBottom: '15px',
                  }}
                >
                  "The training was comprehensive and practical. I felt
                  confident handling loads and customers from day one thanks to
                  the LaunchPad program."
                </p>
                <p style={{ color: '#10b981', fontWeight: '600' }}>
                  - Jennifer L., Freight Broker
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
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
              Ready to Launch Your Transportation Career?
            </h2>
            <p
              style={{
                fontSize: '1.2rem',
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '30px',
                lineHeight: '1.6',
              }}
            >
              Join hundreds of successful transportation professionals who
              started their careers with FleetFlow LaunchPad℠. Get licensed,
              trained, and launched in record time.
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
                onClick={() => setShowDemoForm(true)}
                style={{
                  background:
                    'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '18px 36px',
                  borderRadius: '12px',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 35px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(59, 130, 246, 0.3)';
                }}
              >
                🚀 Get Started Today
              </button>
              <Link href='/university'>
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
                  🎓 Explore Training First
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Form Modal */}
      {showDemoForm && (
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
              border: '2px solid rgba(59, 130, 246, 0.3)',
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
              🚀 Launch Your Career Today
            </h3>
            <form onSubmit={handleDemoSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type='text'
                  placeholder='Your Name'
                  value={demoForm.name}
                  onChange={(e) =>
                    setDemoForm({ ...demoForm, name: e.target.value })
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
                  value={demoForm.email}
                  onChange={(e) =>
                    setDemoForm({ ...demoForm, email: e.target.value })
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
                  type='text'
                  placeholder='Company/Business Name'
                  value={demoForm.company}
                  onChange={(e) =>
                    setDemoForm({ ...demoForm, company: e.target.value })
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
                  type='tel'
                  placeholder='Phone Number'
                  value={demoForm.phone}
                  onChange={(e) =>
                    setDemoForm({ ...demoForm, phone: e.target.value })
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
                  value={demoForm.programInterest}
                  onChange={(e) =>
                    setDemoForm({
                      ...demoForm,
                      programInterest: e.target.value,
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
                >
                  <option value=''>Select Program Interest</option>
                  <option value='broker'>Broker Launch Program</option>
                  <option value='owner-operator'>
                    Owner Operator Success Program
                  </option>
                  <option value='both'>Both Programs</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <textarea
                  placeholder='Tell us about your background and goals...'
                  value={demoForm.message}
                  onChange={(e) =>
                    setDemoForm({ ...demoForm, message: e.target.value })
                  }
                  rows={4}
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
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type='submit'
                  style={{
                    flex: 1,
                    background:
                      'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  🚀 Start My Launch
                </button>
                <button
                  type='button'
                  onClick={() => setShowDemoForm(false)}
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
