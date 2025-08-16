'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
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
        console.log(`Invitation ${ref} marked as opened`);
      }
    }
  }, [searchParams]);

  const handleStartOnboarding = () => {
    // Track that the invitation process was started
    if (invitationData.ref) {
      const invitationService = CarrierInvitationService.getInstance();
      invitationService.updateInvitationStatus(invitationData.ref, 'started');
      console.log(`Invitation ${invitationData.ref} marked as started`);
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
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)',
        minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          padding: '120px 20px 80px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Effects */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 20%, rgba(20, 184, 166, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
            `,
            zIndex: 1,
          }}
        />
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto' }}>
          {/* FleetFlow Logo/Brand */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚛</div>
            <h1
              style={{
                fontSize: '4rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '16px',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                background: 'linear-gradient(135deg, #14b8a6, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              FleetFlow
            </h1>
            <div
              style={{
                fontSize: '1.8rem',
                fontWeight: '600',
                color: '#14b8a6',
                marginBottom: '24px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              }}
            >
              Driver OTR Flow Portal
            </div>
          </div>

          {/* Invitation-Specific Welcome */}
          {(invitationData.inviter || invitationData.carrier) && (
            <div
              style={{
                background: 'rgba(20, 184, 166, 0.15)',
                border: '2px solid rgba(20, 184, 166, 0.3)',
                borderRadius: '20px',
                padding: '30px',
                marginBottom: '40px',
                backdropFilter: 'blur(10px)',
              }}
            >
              {invitationData.inviter && (
                <p
                  style={{
                    color: '#14b8a6',
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    marginBottom: '12px',
                  }}
                >
                  🎉 You're Personally Invited by {decodeURIComponent(invitationData.inviter)}!
                </p>
              )}
              {invitationData.carrier && (
                <p
                  style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    marginBottom: '12px',
                  }}
                >
                  Welcome {decodeURIComponent(invitationData.carrier)} to the FleetFlow Network
                </p>
              )}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {invitationData.mc && (
                  <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>
                    <strong>MC:</strong> {invitationData.mc}
                  </span>
                )}
                {invitationData.dot && (
                  <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>
                    <strong>DOT:</strong> {invitationData.dot}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Main Value Proposition */}
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '24px',
              lineHeight: '1.2',
            }}
          >
            The Future of Transportation Operations
          </h2>
          <p
            style={{
              fontSize: '1.3rem',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '40px',
              lineHeight: '1.6',
              maxWidth: '800px',
              margin: '0 auto 40px',
            }}
          >
            Join thousands of carriers using FleetFlow's Driver OTR Flow Portal - the complete mobile-first platform 
            for managing your transportation business operations, load assignments, and driver workflows.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleStartOnboarding}
              style={{
                background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                color: 'white',
                border: 'none',
                padding: '20px 40px',
                borderRadius: '16px',
                fontSize: '1.2rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '220px',
                boxShadow: '0 8px 25px rgba(20, 184, 166, 0.3)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(20, 184, 166, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(20, 184, 166, 0.3)';
              }}
            >
              🚀 Join FleetFlow Now
            </button>
            
            <button
              onClick={handleContactUs}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                padding: '20px 40px',
                borderRadius: '16px',
                fontSize: '1.2rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '220px',
                backdropFilter: 'blur(10px)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              💬 Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Driver OTR Flow Portal Features */}
      <section
        style={{
          padding: '80px 20px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            🚛 Driver OTR Flow Portal
          </h2>
          <p
            style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.7)',
              textAlign: 'center',
              marginBottom: '60px',
              maxWidth: '600px',
              margin: '0 auto 60px',
            }}
          >
            Your complete mobile operations hub - manage loads, documents, communications, and business operations all in one place.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '30px',
            }}
          >
            {[
              {
                icon: '📱',
                title: 'Mobile Driver Workflow',
                description: 'Complete mobile-first experience for drivers with real-time load updates, GPS tracking, and instant communication.',
                benefits: ['Real-time load assignments', 'GPS route optimization', 'Instant broker communication', 'Mobile document capture']
              },
              {
                icon: '📄',
                title: 'Digital Document Management',
                description: 'Paperless BOL processing, digital signatures, and automated document workflows for maximum efficiency.',
                benefits: ['Electronic BOL processing', 'Digital signatures', 'Automated compliance docs', 'Cloud document storage']
              },
              {
                icon: '🤝',
                title: 'Professional Broker Network',
                description: 'Connect with vetted brokers, access premium loads, and build long-term profitable relationships.',
                benefits: ['Vetted broker partnerships', 'Premium load access', 'Guaranteed payment terms', 'Performance-based rates']
              },
              {
                icon: '💰',
                title: 'Automated Settlement',
                description: 'Fast payment processing, factoring integration, and transparent rate calculations with instant settlements.',
                benefits: ['Quick pay options', 'Factoring integration', 'Transparent billing', 'Performance bonuses']
              },
              {
                icon: '📊',
                title: 'Performance Analytics',
                description: 'Comprehensive dashboard with performance metrics, route optimization, and business intelligence.',
                benefits: ['Performance dashboards', 'Route optimization', 'Fuel efficiency tracking', 'Revenue analytics']
              },
              {
                icon: '🛡️',
                title: 'Compliance Management',
                description: 'Automated DOT compliance, FMCSA integration, and regulatory monitoring to keep you compliant.',
                benefits: ['DOT compliance tracking', 'FMCSA integration', 'Automated alerts', 'Inspection management']
              },
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '24px',
                  padding: '40px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{feature.icon}</div>
                <h3
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '16px',
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    marginBottom: '20px',
                  }}
                >
                  {feature.description}
                </p>
                <ul style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', lineHeight: '1.8' }}>
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#14b8a6' }}>✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Go With The Flow Section */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px',
            }}
          >
            ⚡ Go With The Flow
          </h2>
          <p
            style={{
              fontSize: '1.3rem',
              color: '#14b8a6',
              fontWeight: '600',
              marginBottom: '40px',
            }}
          >
            Become a Preferred Carrier Partner
          </p>

          <div
            style={{
              background: 'rgba(20, 184, 166, 0.1)',
              backdropFilter: 'blur(15px)',
              borderRadius: '30px',
              padding: '60px',
              border: '2px solid rgba(20, 184, 166, 0.3)',
              margin: '40px auto',
              maxWidth: '900px',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '30px' }}>🌊</div>
            <h3
              style={{
                fontSize: '2.2rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '24px',
              }}
            >
              Join Our Elite Carrier Network
            </h3>
            <p
              style={{
                fontSize: '1.2rem',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: '1.7',
                marginBottom: '40px',
              }}
            >
              Go With The Flow represents our premium carrier partnership program. Access exclusive loads, 
              priority dispatch, enhanced rates, and VIP support. We're looking for professional carriers 
              who share our commitment to excellence and reliability.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '30px',
                marginBottom: '40px',
              }}
            >
              {[
                { icon: '🏆', title: 'Premium Rates', desc: 'Access to highest-paying loads' },
                { icon: '⚡', title: 'Priority Dispatch', desc: 'First access to premium opportunities' },
                { icon: '🤝', title: 'Dedicated Support', desc: '24/7 VIP carrier support team' },
                { icon: '💎', title: 'Exclusive Access', desc: 'Special contracts and partnerships' },
              ].map((benefit, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{benefit.icon}</div>
                  <h4
                    style={{
                      color: '#14b8a6',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                    }}
                  >
                    {benefit.title}
                  </h4>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem' }}>
                    {benefit.desc}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '30px',
                margin: '30px 0',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                }}
              >
                📋 Qualification Requirements:
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  textAlign: 'left',
                }}
              >
                {[
                  '✓ Valid MC & DOT numbers',
                  '✓ $1M+ liability insurance',
                  '✓ Clean safety rating',
                  '✓ 2+ years experience',
                  '✓ Professional equipment',
                  '✓ Excellent track record',
                ].map((requirement, idx) => (
                  <div key={idx} style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem' }}>
                    {requirement}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartOnboarding}
              style={{
                background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                color: 'white',
                border: 'none',
                padding: '18px 36px',
                borderRadius: '14px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(20, 184, 166, 0.3)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(20, 184, 166, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(20, 184, 166, 0.3)';
              }}
            >
              🌊 Apply for Go With The Flow
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Overview */}
      <section
        style={{
          padding: '80px 20px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '60px',
            }}
          >
            🎯 Why Choose FleetFlow?
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px',
            }}
          >
            {[
              {
                icon: '🚀',
                title: 'Advanced Technology',
                description: 'Cutting-edge platform with AI-powered route optimization, predictive maintenance, and smart load matching.',
                stats: '99.9% Uptime • Real-time Updates • Mobile-first Design'
              },
              {
                icon: '💼',
                title: 'Proven Results',
                description: 'Join thousands of successful carriers who have increased their revenue and operational efficiency with FleetFlow.',
                stats: '25% Average Revenue Increase • 40% Faster Settlements • 95% Satisfaction Rate'
              },
              {
                icon: '🛡️',
                title: 'Trusted Platform',
                description: 'Bank-level security, FMCSA compliance, and comprehensive insurance coverage to protect your business.',
                stats: 'SOC 2 Certified • FMCSA Integrated • $5M+ Protected Annually'
              },
              {
                icon: '📈',
                title: 'Growth Opportunities',
                description: 'Scale your business with access to premium loads, factoring services, and business development resources.',
                stats: '500+ Active Brokers • $2B+ Annual Volume • National Coverage'
              },
            ].map((benefit, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '24px',
                  padding: '40px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textAlign: 'left',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{benefit.icon}</div>
                <h3
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '16px',
                  }}
                >
                  {benefit.title}
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    marginBottom: '20px',
                  }}
                >
                  {benefit.description}
                </p>
                <div
                  style={{
                    background: 'rgba(20, 184, 166, 0.2)',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    color: '#14b8a6',
                    fontWeight: '600',
                  }}
                >
                  {benefit.stats}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px',
            }}
          >
            📞 Ready to Get Started?
          </h2>
          <p
            style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '40px',
              lineHeight: '1.6',
            }}
          >
            Join the FleetFlow network today and start experiencing the future of transportation operations. 
            Our team is ready to help you get onboarded and maximize your success.
          </p>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(15px)',
              borderRadius: '24px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '30px',
                marginBottom: '30px',
              }}
            >
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📞</div>
                <h4 style={{ color: '#14b8a6', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>
                  Phone Support
                </h4>
                <p style={{ color: 'white', fontSize: '1rem' }}>1-800-FLEET-FLOW</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Available 24/7</p>
              </div>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✉️</div>
                <h4 style={{ color: '#14b8a6', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>
                  Email Support
                </h4>
                <p style={{ color: 'white', fontSize: '1rem' }}>carriers@fleetflow.com</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Response within 2 hours</p>
              </div>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>💬</div>
                <h4 style={{ color: '#14b8a6', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>
                  Live Chat
                </h4>
                <p style={{ color: 'white', fontSize: '1rem' }}>Available on portal</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Instant responses</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleStartOnboarding}
                style={{
                  background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                  color: 'white',
                  border: 'none',
                  padding: '18px 36px',
                  borderRadius: '14px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '200px',
                  boxShadow: '0 8px 25px rgba(20, 184, 166, 0.3)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(20, 184, 166, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(20, 184, 166, 0.3)';
                }}
              >
                🚀 Start Onboarding
              </button>
              
              <button
                onClick={() => window.open('tel:1-800-353-3835', '_self')}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  padding: '18px 36px',
                  borderRadius: '14px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '200px',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                📞 Call Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          padding: '40px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🚛</div>
          <h3
            style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '12px',
            }}
          >
            FleetFlow
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem', marginBottom: '20px' }}>
            The Future of Transportation Operations
          </p>
          <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>
            © 2024 FleetFlow. All rights reserved. | Privacy Policy | Terms of Service
          </div>
        </div>
      </footer>
    </div>
  );
}
