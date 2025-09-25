'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import CarrierInvitationService from '../services/CarrierInvitationService';

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';

function CarrierLandingContent() {
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

  // Invitation form state
  const [inviteForm, setInviteForm] = useState({
    companyName: '',
    email: '',
    mcNumber: '',
  });

  // Invitation analytics state (cleared for production)
  const [inviteStats, setInviteStats] = useState({
    sentToday: 0,
    opened: 0,
    started: 0,
    completed: 0,
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

  // Load invitation analytics
  useEffect(() => {
    const loadInvitationAnalytics = async () => {
      try {
        const invitationService = CarrierInvitationService.getInstance();
        const analytics = await invitationService.getInvitationAnalytics();

        setInviteStats({
          sentToday: analytics.totalSent,
          opened: analytics.totalOpened,
          started: analytics.totalStarted,
          completed: analytics.totalCompleted,
        });
      } catch (error) {
        console.error('Error loading invitation analytics:', error);
        // Keep default values if error
      }
    };

    loadInvitationAnalytics();
  }, []);

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

  const handleSendInvitation = async () => {
    if (!inviteForm.companyName || !inviteForm.email) {
      alert('Please fill in Company Name and Email Address');
      return;
    }

    try {
      const invitationService = CarrierInvitationService.getInstance();
      const invitation = await invitationService.createInvitation({
        targetCarrier: {
          companyName: inviteForm.companyName,
          email: inviteForm.email,
          mcNumber: inviteForm.mcNumber || undefined,
        },
        inviterName: 'FleetFlow Team',
        message: `Join the FleetFlow Driver Network and access premium loads, instant settlements, and professional carrier services.`,
      });

      if (invitation) {
        await invitationService.sendInvitation(invitation.id);
        alert(`Invitation sent successfully to ${inviteForm.email}!`);

        // Update stats
        setInviteStats((prev) => ({
          ...prev,
          sentToday: prev.sentToday + 1,
        }));

        // Clear form
        setInviteForm({
          companyName: '',
          email: '',
          mcNumber: '',
        });
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation. Please try again.');
    }
  };

  const handleGenerateLink = () => {
    if (!inviteForm.companyName) {
      alert('Please fill in Company Name to generate an invitation link');
      return;
    }

    try {
      const invitationService = CarrierInvitationService.getInstance();
      const baseUrl = window.location.origin;

      // Generate shareable link with pre-filled data
      const params = new URLSearchParams();
      params.set('carrier', encodeURIComponent(inviteForm.companyName));
      if (inviteForm.mcNumber) params.set('mc', inviteForm.mcNumber);
      params.set('inviter', encodeURIComponent('FleetFlow Team'));

      const inviteUrl = `${baseUrl}/carrier-landing?${params.toString()}`;

      navigator.clipboard
        .writeText(inviteUrl)
        .then(() => {
          alert(
            `Invitation link copied to clipboard!\n\nShare this link: ${inviteUrl}`
          );

          // Update stats
          setInviteStats((prev) => ({
            ...prev,
            sentToday: prev.sentToday + 1,
          }));
        })
        .catch(() => {
          // Fallback for browsers that don't support clipboard API
          prompt('Copy this invitation link:', inviteUrl);
        });
    } catch (error) {
      console.error('Error generating link:', error);
      alert('Failed to generate invitation link. Please try again.');
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
        fontFamily:
          '""Inter"", system-ui, -apple-system, ""Segoe UI"", sans-serif',
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
        @keyframes logoSlide {
          0% {
            transform: translateX(-120px);
            opacity: 0.7;
          }
          25% {
            transform: translateX(-40px);
            opacity: 1;
          }
          50% {
            transform: translateX(0px);
            opacity: 1;
          }
          75% {
            transform: translateX(40px);
            opacity: 1;
          }
          100% {
            transform: translateX(120px);
            opacity: 0.7;
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
            {/* Full-width white bar with FleetFlow logo */}
            <div
              style={{
                width: '100vw',
                height: '80px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                margin: '0 0 30px 0',
                marginLeft: 'calc(-50vw + 50%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                borderBottom: '3px solid #14b8a6',
              }}
            >
              {/* FleetFlow Logo */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src='/images/fleetflow logo tms.jpg'
                  alt='FleetFlow Logo'
                  width={300}
                  height={50}
                  style={{
                    height: '50px',
                    width: 'auto',
                    maxWidth: '300px',
                    objectFit: 'contain',
                    animation: 'logoSlide 6s ease-in-out infinite',
                    transformOrigin: 'center',
                  }}
                />
                {/* Fallback text logo */}
                <div
                  style={{
                    display: 'none',
                    fontSize: '2.2rem',
                    fontWeight: '900',
                    background:
                      'linear-gradient(135deg, #14b8a6, #3b82f6, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-1px',
                    lineHeight: '1',
                    animation: 'logoSlide 6s ease-in-out infinite',
                    transformOrigin: 'center',
                  }}
                >
                  FleetFlow
                </div>
              </div>
            </div>
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
                  { icon: '🏆', title: 'Premium Rates', value: 'TBD' },
                  { icon: '⚡', title: 'Priority Access', value: 'TBD' },
                  { icon: '💎', title: 'Exclusive Loads', value: 'TBD' },
                  { icon: '🤝', title: 'Dedicated Support', value: 'TBD' },
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
                  background:
                    'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 0.6))',
                  color: 'white',
                  border: '2px solid rgba(245, 158, 11, 0.6)',
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
                  e.currentTarget.style.borderColor = '#f59e0b';
                  e.currentTarget.style.boxShadow =
                    '0 15px 40px rgba(245, 158, 11, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.6)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Carrier Invitation Management */}
      <section
        style={{
          padding: '20px 20px',
          background: 'rgba(255, 255, 255, 0.03)',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'white',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            📧 Carrier Invitation Hub
          </h2>

          {/* Quick Invite Form */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(15px)',
              borderRadius: '16px',
              padding: '25px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              marginBottom: '20px',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '15px',
              }}
            >
              Quick Carrier Invitation
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: '15px',
              }}
            >
              <input
                type='text'
                placeholder='Company Name'
                value={inviteForm.companyName}
                onChange={(e) =>
                  setInviteForm((prev) => ({
                    ...prev,
                    companyName: e.target.value,
                  }))
                }
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '0.9rem',
                }}
              />
              <input
                type='email'
                placeholder='Email Address'
                value={inviteForm.email}
                onChange={(e) =>
                  setInviteForm((prev) => ({ ...prev, email: e.target.value }))
                }
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '0.9rem',
                }}
              />
              <input
                type='text'
                placeholder='MC Number (Optional)'
                value={inviteForm.mcNumber}
                onChange={(e) =>
                  setInviteForm((prev) => ({
                    ...prev,
                    mcNumber: e.target.value,
                  }))
                }
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '0.9rem',
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={handleSendInvitation}
                style={{
                  background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 15px rgba(20, 184, 166, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                📧 Send Email Invitation
              </button>
              <button
                onClick={handleGenerateLink}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                🔗 Generate Link
              </button>
            </div>
          </div>

          {/* Invitation Analytics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '15px',
            }}
          >
            {[
              {
                label: 'Sent Today',
                value: inviteStats.sentToday.toString(),
                color: '#14b8a6',
                icon: '📧',
              },
              {
                label: 'Opened',
                value: inviteStats.opened.toString(),
                color: '#3b82f6',
                icon: '👁️',
              },
              {
                label: 'Started',
                value: inviteStats.started.toString(),
                color: '#f59e0b',
                icon: '🚀',
              },
              {
                label: 'Completed',
                value: inviteStats.completed.toString(),
                color: '#10b981',
                icon: '✅',
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                style={{
                  background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}05)`,
                  border: `1px solid ${stat.color}40`,
                  borderRadius: '12px',
                  padding: '15px',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>
                  {stat.icon}
                </div>
                <div
                  style={{
                    color: stat.color,
                    fontSize: '1.2rem',
                    fontWeight: '800',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
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
                  (833) 386-3509
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

export default function CarrierLandingPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
        </div>
      }
    >
      <CarrierLandingContent />
    </Suspense>
  );
}
