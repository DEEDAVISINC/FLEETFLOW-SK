'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CarrierInvitationService from '../services/CarrierInvitationService';

export default function CarrierLandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [invitationData, setInvitationData] = useState({
    ref: '',
    carrier: '',
    mc: '',
    dot: '',
    email: '',
    inviter: '',
  });

  // Check for invitation parameters
  useEffect(() => {
    if (!searchParams) return;

    const ref = searchParams.get('ref');
    const carrier = searchParams.get('carrier');
    const mc = searchParams.get('mc');
    const dot = searchParams.get('dot');
    const email = searchParams.get('email');
    const inviter = searchParams.get('inviter');

    if (ref || carrier || mc || dot || inviter) {
      setInvitationData({
        ref: ref || '',
        carrier: carrier || '',
        mc: mc || '',
        dot: dot || '',
        email: email || '',
        inviter: inviter || '',
      });

      // Track that the invitation was opened
      if (ref) {
        const invitationService = CarrierInvitationService.getInstance();
        invitationService.updateInvitationStatus(ref, 'opened');
        console.info(`Invitation ${ref} marked as opened`);
      }
    }
  }, [searchParams]);

  const handleStartOnboarding = () => {
    // Track that the invitation process was started
    if (invitationData.ref) {
      const invitationService = CarrierInvitationService.getInstance();
      invitationService.updateInvitationStatus(invitationData.ref, 'started');
      console.info(`Invitation ${invitationData.ref} marked as started`);
    }

    // Build the onboarding URL with pre-filled data
    const params = new URLSearchParams();
    if (invitationData.carrier) params.set('company', invitationData.carrier);
    if (invitationData.mc) params.set('mc', invitationData.mc);
    if (invitationData.dot) params.set('dot', invitationData.dot);
    if (invitationData.email) params.set('email', invitationData.email);
    if (invitationData.ref) params.set('invitationRef', invitationData.ref);

    const onboardingUrl = `/onboarding/carrier-onboarding/new?${params.toString()}`;
    router.push(onboardingUrl);
  };

  const handleContactUs = () => {
    // Scroll to contact section or open contact form
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        background: `
          linear-gradient(135deg, #000000 0%, #0a0a23 25%, #1a1a3e 50%, #0a0a23 75%, #000000 100%),
          radial-gradient(circle at 20% 20%, rgba(20, 184, 166, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
        `,
        minHeight: '100vh',
        fontFamily: '""Inter"", system-ui, -apple-system, ""Segoe UI"", sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating Animation Elements */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(45deg, transparent 49%, rgba(20, 184, 166, 0.03) 50%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, rgba(59, 130, 246, 0.03) 50%, transparent 51%)
          `,
          backgroundSize: '60px 60px',
          animation: 'float 20s linear infinite',
          zIndex: 1,
        }}
      />

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateX(-100px);
          }
          100% {
            transform: translateX(100px);
          }
        }
        @keyframes glow {
          0%,
          100% {
            text-shadow: 0 0 20px rgba(20, 184, 166, 0.5);
          }
          50% {
            text-shadow:
              0 0 40px rgba(20, 184, 166, 0.8),
              0 0 60px rgba(59, 130, 246, 0.3);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            box-shadow: 0 0 30px rgba(20, 184, 166, 0.3);
          }
          50% {
            box-shadow:
              0 0 50px rgba(20, 184, 166, 0.6),
              0 0 80px rgba(59, 130, 246, 0.2);
          }
        }
      `}</style>
      {/* Hero Section */}
      <section
        style={{
          padding: '30px 20px 20px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Clean Header */}
          <div style={{ marginBottom: '20px' }}>
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                marginBottom: '10px',
                background:
                  'linear-gradient(135deg, #14b8a6 0%, #3b82f6 50%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-1px',
              }}
            >
              FleetFlow
            </h1>
            <div
              style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#14b8a6',
                marginBottom: '10px',
              }}
            >
              Carrier Network Platform
            </div>
          </div>

          {/* Invitation Welcome - Compact */}
          {(invitationData.inviter || invitationData.carrier) && (
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(59, 130, 246, 0.1))',
                border: '1px solid rgba(20, 184, 166, 0.4)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '25px',
                backdropFilter: 'blur(15px)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            >
              {invitationData.inviter && (
                <div
                  style={{
                    color: '#14b8a6',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    marginBottom: '8px',
                  }}
                >
                  🎉 EXCLUSIVE INVITATION from{' '}
                  {decodeURIComponent(invitationData.inviter)}
                </div>
              )}
              {invitationData.carrier && (
                <div
                  style={{
                    color: 'white',
                    fontSize: '1rem',
                    marginBottom: '8px',
                  }}
                >
                  Welcome {decodeURIComponent(invitationData.carrier)}
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  gap: '15px',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                }}
              >
                {invitationData.mc && (
                  <span style={{ color: '#14b8a6' }}>
                    MC: {invitationData.mc}
                  </span>
                )}
                {invitationData.dot && (
                  <span style={{ color: '#14b8a6' }}>
                    DOT: {invitationData.dot}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Compact Value Proposition */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '20px',
            }}
          >
            {/* White bar above header */}
            <div
              style={{
                width: '80px',
                height: '4px',
                background: 'white',
                margin: '0 auto 20px auto',
                borderRadius: '2px',
                boxShadow: '0 2px 10px rgba(255, 255, 255, 0.3)',
              }}
            />
            <h2
              style={{
                fontSize: '1.8rem',
                fontWeight: '800',
                color: 'white',
                marginBottom: '15px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              }}
            >
              JOIN THE DRIVER FLOW
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '15px',
                lineHeight: '1.4',
              }}
            >
              Find loads, manage your fleet, and get paid fast. Everything you
              need to run your trucking business.
            </p>

            {/* Colorful Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '15px',
                marginBottom: '20px',
              }}
            >
              {[
                {
                  label: 'Active Carriers',
                  value: '12K+',
                  color: '#14b8a6',
                  bg: 'linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(20, 184, 166, 0.05))',
                  border: '1px solid rgba(20, 184, 166, 0.3)',
                },
                {
                  label: 'Loads Posted',
                  value: '50K+',
                  color: '#3b82f6',
                  bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05))',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                },
                {
                  label: 'User Rating',
                  value: '4.8/5',
                  color: '#f59e0b',
                  bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05))',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  style={{
                    textAlign: 'center',
                    background: stat.bg,
                    border: stat.border,
                    borderRadius: '12px',
                    padding: '15px 10px',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform =
                      'translateY(-2px) scale(1.05)';
                    e.currentTarget.style.boxShadow = `0 8px 25px ${stat.color}40`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      color: stat.color,
                      fontSize: '1.3rem',
                      fontWeight: '800',
                      marginBottom: '5px',
                      textShadow: `0 0 10px ${stat.color}40`,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Premium CTA Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={handleStartOnboarding}
                style={{
                  background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  animation: 'pulse 3s ease-in-out infinite',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform =
                    'translateY(-2px) scale(1.05)';
                  e.currentTarget.style.boxShadow =
                    '0 15px 40px rgba(20, 184, 166, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Join Now
              </button>

              <button
                onClick={handleContactUs}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Platform Features */}
      <section
        style={{
          padding: '20px 20px',
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              color: 'white',
              textAlign: 'center',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Platform Features
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
            }}
          >
            {[
              {
                icon: '📱',
                title: 'AI Mobile Operations',
                desc: 'Real-time load management & GPS optimization',
                color: '#ec4899',
                borderColor: 'rgba(236, 72, 153, 0.4)',
                bgColor:
                  'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(236, 72, 153, 0.02))',
              },
              {
                icon: '💰',
                title: 'Instant Settlements',
                desc: 'Same-day payments & automated billing',
                color: '#10b981',
                borderColor: 'rgba(16, 185, 129, 0.4)',
                bgColor:
                  'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.02))',
              },
              {
                icon: '🌐',
                title: 'Broker Network',
                desc: '50K+ verified carriers & premium loads',
                color: '#f97316',
                borderColor: 'rgba(249, 115, 22, 0.4)',
                bgColor:
                  'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(249, 115, 22, 0.02))',
              },
              {
                icon: '🛡️',
                title: 'Compliance Suite',
                desc: 'DOT/FMCSA integration & automated alerts',
                color: '#ef4444',
                borderColor: 'rgba(239, 68, 68, 0.4)',
                bgColor:
                  'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.02))',
              },
              {
                icon: '📊',
                title: 'Business Intelligence',
                desc: 'Advanced analytics & performance tracking',
                color: '#06b6d4',
                borderColor: 'rgba(6, 182, 212, 0.4)',
                bgColor:
                  'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.02))',
              },
              {
                icon: '🚀',
                title: 'Go With The Flow',
                desc: 'Elite carrier partnership program',
                color: 'white',
                borderColor: 'rgba(245, 158, 11, 0.6)',
                hoverBorderColor: '#f59e0b',
                bgColor:
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.1))',
              },
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  background: feature.bgColor,
                  backdropFilter: 'blur(15px)',
                  borderRadius: '16px',
                  padding: '25px',
                  border: `2px solid ${feature.borderColor}`,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform =
                    'translateY(-5px) scale(1.03)';
                  e.currentTarget.style.borderColor =
                    feature.hoverBorderColor || feature.color;
                  e.currentTarget.style.boxShadow = `0 12px 35px ${feature.hoverBorderColor || feature.color}40`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.borderColor = feature.borderColor;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: feature.color,
                    marginBottom: '8px',
                    textShadow: `0 0 10px ${feature.color}30`,
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.85rem',
                    lineHeight: '1.4',
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Go With The Flow - Premium Elite Program */}
      <section style={{ padding: '20px 20px' }}>
        <div
          style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}
        >
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(20, 184, 166, 0.15), rgba(139, 92, 246, 0.1))',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '25px',
              border: '1px solid rgba(20, 184, 166, 0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(45deg, transparent 49%, rgba(20, 184, 166, 0.05) 50%, transparent 51%)',
                backgroundSize: '20px 20px',
                animation: 'float 15s linear infinite',
              }}
            />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '10px',
                }}
              >
                Go With The Flow
              </h2>
              <div
                style={{
                  fontSize: '1rem',
                  color: '#14b8a6',
                  fontWeight: '700',
                  marginBottom: '20px',
                }}
              >
                ELITE CARRIER PARTNERSHIP
              </div>

              <p
                style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '25px',
                  lineHeight: '1.5',
                }}
              >
                Premium partnership program for top-tier carriers. Exclusive
                loads, priority dispatch, enhanced rates, and VIP support for
                carriers who share our commitment to excellence.
              </p>

              {/* Elite Benefits - Compact Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '20px',
                  marginBottom: '25px',
                }}
              >
                {[
                  { icon: '🏆', title: 'Premium Rates', value: '+30%' },
                  { icon: '⚡', title: 'Priority Access', value: '24/7' },
                  { icon: '💎', title: 'Exclusive Loads', value: 'VIP' },
                  { icon: '🤝', title: 'Dedicated Support', value: 'Elite' },
                ].map((benefit, idx) => (
                  <div key={idx} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '5px' }}>
                      {benefit.icon}
                    </div>
                    <div
                      style={{
                        color: '#14b8a6',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                      }}
                    >
                      {benefit.title}
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '1.1rem',
                        fontWeight: '900',
                      }}
                    >
                      {benefit.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Requirements - Compact */}
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '12px',
                  padding: '15px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    marginBottom: '10px',
                  }}
                >
                  ELITE QUALIFICATIONS:
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.8)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    justifyContent: 'center',
                  }}
                >
                  <span>✓ MC/DOT Authority</span>
                  <span>✓ $1M+ Insurance</span>
                  <span>✓ Clean Safety Rating</span>
                  <span>✓ 2+ Years Experience</span>
                </div>
              </div>

              <button
                onClick={handleStartOnboarding}
                style={{
                  background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',

                  transition: 'all 0.3s ease',
                  animation: 'pulse 3s ease-in-out infinite',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform =
                    'translateY(-2px) scale(1.05)';
                  e.currentTarget.style.boxShadow =
                    '0 15px 40px rgba(20, 184, 166, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final Contact & Action */}
      <section id='contact-section' style={{ padding: '20px 20px' }}>
        <div
          style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}
        >
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h2
              style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '10px',
              }}
            >
              Join FleetFlow Network
            </h2>

            <p
              style={{
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '20px',
                lineHeight: '1.4',
              }}
            >
              Get started with FleetFlow. Our team is ready to help onboard your
              fleet.
            </p>

            {/* Compact Contact Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px',
                marginBottom: '25px',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    color: '#14b8a6',
                    fontSize: '1.5rem',
                    marginBottom: '5px',
                  }}
                >
                  📞
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                  }}
                >
                  1-800-FLEET-FLOW
                </div>
                <div
                  style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}
                >
                  24/7 Support
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    color: '#14b8a6',
                    fontSize: '1.5rem',
                    marginBottom: '5px',
                  }}
                >
                  ✉️
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                  }}
                >
                  carriers@fleetflowapp.com
                </div>
                <div
                  style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}
                >
                  2hr Response
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    color: '#14b8a6',
                    fontSize: '1.5rem',
                    marginBottom: '5px',
                  }}
                >
                  💬
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                  }}
                >
                  Live Chat
                </div>
                <div
                  style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}
                >
                  Instant
                </div>
              </div>
            </div>

            {/* Final CTAs */}
            <div
              style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={handleStartOnboarding}
                style={{
                  background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',

                  transition: 'all 0.3s ease',
                  animation: 'pulse 3s ease-in-out infinite',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform =
                    'translateY(-2px) scale(1.05)';
                  e.currentTarget.style.boxShadow =
                    '0 15px 40px rgba(20, 184, 166, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Get Started
              </button>

              <button
                onClick={() => window.open('tel:1-800-353-3835', '_self')}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',

                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Call Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer
        style={{
          background: 'rgba(0, 0, 0, 0.5)',
          padding: '20px',
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
          © 2024 FleetFlow. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
