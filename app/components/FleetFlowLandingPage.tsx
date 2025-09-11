'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { FleetFlowAppVideo } from './FleetFlowAppVideo';
import Logo from './Logo';

interface DemoBookingForm {
  name: string;
  email: string;
  company: string;
  phone: string;
  fleetSize: string;
  message: string;
}

export default function FleetFlowLandingPage() {
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [demoForm, setDemoForm] = useState<DemoBookingForm>({
    name: '',
    email: '',
    company: '',
    phone: '',
    fleetSize: '',
    message: '',
  });

  // Add CSS animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.8; }
      }

      @keyframes shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
      }

      @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.2); }
        50% { box-shadow: 0 0 40px rgba(255,255,255,0.4); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.info('Demo booking submitted:', demoForm);
    alert(
      'Thank you! We will contact you within 24 hours to schedule your enterprise demo.'
    );
    setShowDemoForm(false);
    setDemoForm({
      name: '',
      email: '',
      company: '',
      phone: '',
      fleetSize: '',
      message: '',
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Fixed Header Bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'rgba(248, 250, 252, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Logo />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href='/go-with-the-flow'>
            <button
              style={{
                background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
                color: 'white',
                border: '2px solid #f4a832',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 0 8px rgba(244, 168, 50, 0.3)',
              }}
            >
              🌊 GO WITH THE FLOW
            </button>
          </Link>{' '}
          <Link href='/launchpad'>
            <button
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                border: '2px solid rgba(99, 102, 241, 0.8)',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 0 8px rgba(99, 102, 241, 0.3)',
              }}
            >
              🚀 LAUNCHPAD℠
            </button>
          </Link>{' '}
          <Link href='/fleetflowdash'>
            <button
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              FLEETFLOWDASH
            </button>
          </Link>
          <Link href='/auth/signin'>
            <button
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Sign In
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          paddingTop: '80px',
          padding: '80px 20px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Hero Section */}
        <header style={{ marginBottom: '50px', maxWidth: '800px' }}>
          <h1
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 'bold',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: '1.2',
            }}
          >
            The Salesforce of Transportation
          </h1>

          <p
            style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: '1.5',
              marginBottom: '24px',
            }}
          >
            Complete AI-powered transportation management platform serving
            everyone from individual drivers to Fortune 500 enterprises.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => setShowDemoForm(true)}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 3px 12px rgba(59,130,246,0.25)',
              }}
              aria-label='Book an enterprise demo of FleetFlow'
            >
              Book Enterprise Demo
            </button>
            <Link href='/auth/signin'>
              <button
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                }}
                aria-label='Sign in to your FleetFlow account'
              >
                Log In
              </button>
            </Link>
          </div>
        </header>

        {/* Autoplay App Screenshots Video */}
        <section aria-labelledby='app-demo-heading'>
          <h2 id='app-demo-heading' className='sr-only'>
            FleetFlow App Demo
          </h2>
          <FleetFlowAppVideo autoPlay={true} />
        </section>

        {/* Go With the Flow Section */}
        <section
          style={{ marginTop: '50px', marginBottom: '50px' }}
          aria-labelledby='marketplace-heading'
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(15px)',
              borderRadius: '20px',
              border: '2px solid #f4a832',
              padding: '35px',
              maxWidth: '1000px',
              margin: '0 auto',
              boxShadow: '0 8px 25px rgba(244, 168, 50, 0.3)',
            }}
          >
            <header style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h2
                id='marketplace-heading'
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  color: '#f4a832',
                  marginBottom: '15px',
                  textShadow: '0 0 15px rgba(244, 168, 50, 0.4)',
                }}
              >
                🌊 Go With the Flow
              </h2>
            </header>
            <p
              style={{
                fontSize: '1.3rem',
                color: 'white',
                lineHeight: '1.6',
                marginBottom: '25px',
                fontWeight: '500',
              }}
            >
              An advanced{' '}
              <strong style={{ color: '#f4a832' }}>instant marketplace</strong>{' '}
              - connecting shippers and drivers in real-time with AI-powered
              matching and dynamic pricing.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '25px',
              marginBottom: '30px',
            }}
          >
            {/* For Shippers */}
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.15)',
                borderRadius: '12px',
                padding: '25px',
                border: '1px solid rgba(59, 130, 246, 0.4)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                  📦
                </div>
                <h3
                  style={{
                    fontSize: '1.4rem',
                    color: '#3b82f6',
                    marginBottom: '15px',
                    fontWeight: '700',
                  }}
                >
                  For Shippers
                </h3>
              </div>
              <ul
                style={{
                  color: 'white',
                  fontSize: '1rem',
                  lineHeight: '1.5',
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                }}
              >
                <li
                  style={{
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: '#10b981', marginRight: '8px' }}>
                    ✓
                  </span>
                  Request trucks instantly - no waiting
                </li>
                <li
                  style={{
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: '#10b981', marginRight: '8px' }}>
                    ✓
                  </span>
                  AI-powered fair pricing
                </li>
                <li
                  style={{
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: '#10b981', marginRight: '8px' }}>
                    ✓
                  </span>
                  Real-time driver matching
                </li>
                <li
                  style={{
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: '#10b981', marginRight: '8px' }}>
                    ✓
                  </span>
                  Live GPS tracking & updates
                </li>
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>
                    ✓
                  </span>
                  No long-term contracts required
                </li>
              </ul>
            </div>

            {/* For Drivers */}
            <div
              style={{
                background: 'rgba(244, 168, 50, 0.15)',
                borderRadius: '12px',
                padding: '25px',
                border: '1px solid rgba(244, 168, 50, 0.4)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                  🚛
                </div>
                <h3
                  style={{
                    fontSize: '1.4rem',
                    color: '#f4a832',
                    marginBottom: '15px',
                    fontWeight: '700',
                  }}
                >
                  For Drivers
                </h3>
              </div>
              <ul
                style={{
                  color: 'white',
                  fontSize: '1rem',
                  lineHeight: '1.5',
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                }}
              >
                <li
                  style={{
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: '#10b981', marginRight: '8px' }}>
                    ✓
                  </span>
                  Go online/offline instantly
                </li>
                <li
                  style={{
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: '#10b981', marginRight: '8px' }}>
                    ✓
                  </span>
                  Find high-paying loads nearby
                </li>
                <li
                  style={{
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: '#10b981', marginRight: '8px' }}>
                    ✓
                  </span>
                  Competitive market rates
                </li>
                <li
                  style={{
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: '#10b981', marginRight: '8px' }}>
                    ✓
                  </span>
                  Fast payment processing
                </li>
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '8px' }}>
                    ✓
                  </span>
                  Build your reputation & earnings
                </li>
              </ul>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '25px',
                border: '1px solid rgba(16, 185, 129, 0.4)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.3rem',
                  color: '#10b981',
                  marginBottom: '10px',
                  fontWeight: '700',
                }}
              >
                🤖 Powered by Advanced AI
              </h3>
              <p
                style={{
                  color: 'white',
                  fontSize: '1rem',
                  lineHeight: '1.5',
                  margin: 0,
                }}
              >
                Our intelligent system analyzes market conditions, traffic
                patterns, fuel costs, and demand in real-time to provide optimal
                pricing and instant matching.
              </p>
            </div>

            {/* GO WITH THE FLOW Marketplace Subscription Section */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                borderRadius: '16px',
                padding: '40px',
                marginBottom: '40px',
                border: '1px solid rgba(244, 168, 50, 0.3)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2
                  style={{
                    fontSize: '2.2rem',
                    color: '#f4a832',
                    marginBottom: '15px',
                    fontWeight: '700',
                  }}
                >
                  🌊 GO WITH THE FLOW Marketplace
                </h2>
                <p
                  style={{
                    fontSize: '1.2rem',
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: '1.6',
                    marginBottom: '20px',
                  }}
                >
                  Start FREE, Scale with Premium Features
                </p>
                <p
                  style={{
                    fontSize: '1rem',
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: '1.5',
                  }}
                >
                  Carriers get FREE access • Shippers pay for premium
                  marketplace features
                </p>
              </div>

              {/* Subscription Tiers Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '20px',
                  marginBottom: '30px',
                }}
              >
                {/* Free Tier */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '12px',
                    padding: '25px',
                    border: '2px solid rgba(59, 130, 246, 0.3)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>
                    🎁
                  </div>
                  <h3
                    style={{
                      fontSize: '1.3rem',
                      color: '#3b82f6',
                      marginBottom: '10px',
                      fontWeight: '700',
                    }}
                  >
                    FREE-FLOW
                  </h3>
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: '#3b82f6',
                      marginBottom: '15px',
                    }}
                  >
                    $0/month
                  </div>
                  <ul
                    style={{
                      color: 'white',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      textAlign: 'left',
                    }}
                  >
                    <li style={{ marginBottom: '8px' }}>✅ 5 loads/month</li>
                    <li style={{ marginBottom: '8px' }}>
                      ✅ Basic load posting
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      ✅ Standard carrier access
                    </li>
                    <li style={{ marginBottom: '8px' }}>✅ Email support</li>
                    <li style={{ marginBottom: '8px' }}>
                      ❌ Premium dispatch services
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      ❌ Priority carrier matching
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      ❌ Load value cap: $750/load
                    </li>
                  </ul>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginTop: '15px',
                      width: '100%',
                    }}
                  >
                    Start FREE Trial
                  </button>
                </div>

                {/* Professional Tier */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '12px',
                    padding: '25px',
                    border: '2px solid rgba(16, 185, 129, 0.3)',
                    textAlign: 'center',
                    transform: 'scale(1.05)',
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>
                    🚀
                  </div>
                  <h3
                    style={{
                      fontSize: '1.3rem',
                      color: '#10b981',
                      marginBottom: '10px',
                      fontWeight: '700',
                    }}
                  >
                    PRO-FLOW
                  </h3>
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: '#10b981',
                      marginBottom: '15px',
                    }}
                  >
                    $349/month
                  </div>
                  <ul
                    style={{
                      color: 'white',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      textAlign: 'left',
                    }}
                  >
                    <li style={{ marginBottom: '8px' }}>
                      ✅ 25 loads/month included
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      ✅ Priority load promotion
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      ✅ Premium carrier access
                    </li>
                    <li style={{ marginBottom: '8px' }}>✅ Phone support</li>
                    <li style={{ marginBottom: '8px' }}>
                      ✅ Basic dispatch ($50/load)
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      ✅ Advanced analytics
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      ✅ No load value limits
                    </li>
                  </ul>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginTop: '15px',
                      width: '100%',
                    }}
                  >
                    Start Professional
                  </button>
                </div>

                {/* Enterprise Tier */}
                <div
                  style={{
                    background: 'rgba(244, 168, 50, 0.1)',
                    borderRadius: '12px',
                    padding: '25px',
                    border: '2px solid rgba(244, 168, 50, 0.3)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>
                    🏢
                  </div>
                  <h3
                    style={{
                      fontSize: '1.3rem',
                      color: '#f4a832',
                      marginBottom: '10px',
                      fontWeight: '700',
                    }}
                  >
                    FLOW ON THE GO
                  </h3>
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: '#f4a832',
                      marginBottom: '15px',
                    }}
                  >
                    $999/month
                  </div>
                  <ul
                    style={{
                      color: 'white',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      textAlign: 'left',
                    }}
                  >
                    <li style={{ marginBottom: '8px' }}>
                      ✅ 100 loads/month included
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      ✅ VIP load promotion
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      ✅ Elite carrier network
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      ✅ Dedicated account manager
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      ✅ Advanced dispatch ($100/load)
                    </li>
                    <li style={{ marginBottom: '8px' }}>✅ API integration</li>
                    <li style={{ marginBottom: '8px' }}>
                      ✅ White-glove service
                    </li>
                  </ul>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #f4a832, #d97706)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginTop: '15px',
                      width: '100%',
                    }}
                  >
                    Start Enterprise
                  </button>
                </div>
              </div>

              {/* Verification Notice */}
              <div
                style={{
                  marginTop: '20px',
                  padding: '15px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <p
                  style={{
                    color: 'white',
                    fontSize: '0.9rem',
                    lineHeight: '1.4',
                    margin: 0,
                    textAlign: 'center',
                  }}
                >
                  🔒 <strong>Business Verification Required:</strong> All
                  accounts require verified business credentials, insurance, and
                  compliance documentation for marketplace access.
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <Link href='/go-with-the-flow'>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
                    color: 'white',
                    border: '2px solid #f4a832',
                    padding: '15px 30px',
                    borderRadius: '10px',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 0 15px rgba(244, 168, 50, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow =
                      '0 0 20px rgba(244, 168, 50, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow =
                      '0 0 15px rgba(244, 168, 50, 0.4)';
                  }}
                >
                  🚀 Start Using Go With the Flow
                </button>
              </Link>

              <Link href='/launchpad'>
                <button
                  style={{
                    background:
                      'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                    color: 'white',
                    border: '2px solid rgba(59, 130, 246, 0.8)',
                    padding: '15px 30px',
                    borderRadius: '10px',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow =
                      '0 0 20px rgba(59, 130, 246, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow =
                      '0 0 15px rgba(59, 130, 246, 0.4)';
                  }}
                >
                  🎯 Explore LaunchPad℠
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Professional Subscription Section */}
        <div style={{ marginTop: '50px', marginBottom: '60px' }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(15px)',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '40px',
              maxWidth: '1200px',
              margin: '0 auto',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  background:
                    'linear-gradient(135deg, #3b82f6 0%, #14b8a6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '20px',
                }}
              >
                FleetFlow Solo Plans
              </h2>
              <p
                style={{
                  fontSize: '1.2rem',
                  color: 'rgba(255,255,255,0.8)',
                  lineHeight: '1.6',
                  marginBottom: '30px',
                }}
              >
                Individual plans for solo transportation professionals.
                <br />
                <strong style={{ color: '#fbbf24' }}>
                  Start your 14-day free trial
                </strong>{' '}
                - no credit card required.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '25px',
                marginBottom: '40px',
              }}
            >
              {/* FleetFlow University */}
              <div
                style={{
                  background: 'rgba(244, 168, 50, 0.1)',
                  borderRadius: '16px',
                  padding: '25px',
                  border: '2px solid rgba(244, 168, 50, 0.3)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>
                  🎓
                </div>
                <h3
                  style={{
                    fontSize: '1.3rem',
                    color: '#f4a832',
                    marginBottom: '10px',
                    fontWeight: '700',
                  }}
                >
                  Training Only
                </h3>
                <div
                  style={{
                    fontSize: '2.2rem',
                    color: 'white',
                    fontWeight: '800',
                    marginBottom: '15px',
                  }}
                >
                  $49
                  <span style={{ fontSize: '1rem', fontWeight: '500' }}>
                    /month
                  </span>
                </div>
                <ul
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.9rem',
                    listStyle: 'none',
                    padding: 0,
                    lineHeight: '1.8',
                  }}
                >
                  <li>✓ Complete training curriculum</li>
                  <li>✓ BOL/MBL/HBL documentation</li>
                  <li>✓ Warehouse operations training</li>
                  <li>✓ Certification programs</li>
                  <li>✓ Industry best practices</li>
                </ul>
              </div>

              {/* Professional Dispatcher */}
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '16px',
                  padding: '25px',
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>
                  📋
                </div>
                <h3
                  style={{
                    fontSize: '1.3rem',
                    color: '#3b82f6',
                    marginBottom: '10px',
                    fontWeight: '700',
                  }}
                >
                  Solo Dispatcher
                </h3>
                <div
                  style={{
                    fontSize: '1.8rem',
                    color: 'white',
                    fontWeight: '800',
                    marginBottom: '15px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.2rem',
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    Starting at
                  </span>
                  <br />
                  $79
                  <span style={{ fontSize: '1rem', fontWeight: '500' }}>
                    /month
                  </span>
                </div>
                <ul
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.9rem',
                    listStyle: 'none',
                    padding: 0,
                    lineHeight: '1.8',
                  }}
                >
                  <li>✓ Complete dispatch management</li>
                  <li>✓ Driver assignment & tracking</li>
                  <li>✓ Route optimization</li>
                  <li>✓ CRM integration</li>
                  <li>✓ Basic AI automation</li>
                  <li style={{ color: '#34d399', fontWeight: '600' }}>
                    ✓ 50 phone minutes included
                  </li>
                  <li style={{ color: '#34d399', fontWeight: '600' }}>
                    ✓ 25 SMS messages included
                  </li>
                </ul>
              </div>

              {/* Professional Brokerage - Most Popular */}
              <div
                style={{
                  background: 'rgba(249, 115, 22, 0.1)',
                  borderRadius: '16px',
                  padding: '25px',
                  border: '2px solid #f97316',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background:
                      'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    color: 'white',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                  }}
                >
                  ⭐ Most Popular
                </div>
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>
                  🏢
                </div>
                <h3
                  style={{
                    fontSize: '1.3rem',
                    color: '#f97316',
                    marginBottom: '10px',
                    fontWeight: '700',
                  }}
                >
                  Solo Broker
                </h3>
                <div
                  style={{
                    fontSize: '1.8rem',
                    color: 'white',
                    fontWeight: '800',
                    marginBottom: '15px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.2rem',
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    Starting at
                  </span>
                  <br />
                  $199
                  <span style={{ fontSize: '1rem', fontWeight: '500' }}>
                    /month
                  </span>
                </div>
                <ul
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.9rem',
                    listStyle: 'none',
                    padding: 0,
                    lineHeight: '1.8',
                  }}
                >
                  <li>✓ Advanced brokerage operations</li>
                  <li>✓ FreightFlow RFx platform</li>
                  <li>✓ Load & customer management</li>
                  <li>✓ Revenue analytics dashboard</li>
                  <li>✓ AI-powered optimization</li>
                  <li style={{ color: '#34d399', fontWeight: '600' }}>
                    ✓ 500 phone minutes included
                  </li>
                  <li style={{ color: '#34d399', fontWeight: '600' }}>
                    ✓ 200 SMS messages included
                  </li>
                  <li style={{ color: '#34d399', fontWeight: '600' }}>
                    ✓ Advanced call monitoring
                  </li>
                </ul>
              </div>

              {/* Solo Dispatcher Premium */}
              <div
                style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: '16px',
                  padding: '25px',
                  border: '2px solid rgba(99, 102, 241, 0.3)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>
                  👑
                </div>
                <h3
                  style={{
                    fontSize: '1.3rem',
                    color: '#6366f1',
                    marginBottom: '10px',
                    fontWeight: '700',
                  }}
                >
                  Solo Dispatcher Premium
                </h3>
                <div
                  style={{
                    fontSize: '1.6rem',
                    color: 'white',
                    fontWeight: '800',
                    marginBottom: '15px',
                  }}
                >
                  $199
                  <span style={{ fontSize: '1rem', fontWeight: '500' }}>
                    /month
                  </span>
                </div>
                <ul
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.9rem',
                    listStyle: 'none',
                    padding: 0,
                    lineHeight: '1.8',
                  }}
                >
                  <li>✓ Advanced dispatch management</li>
                  <li>✓ Multi-fleet coordination</li>
                  <li>✓ Advanced route optimization</li>
                  <li>✓ Performance analytics & reporting</li>
                  <li>✓ API access & webhooks</li>
                  <li>✓ Priority support</li>
                  <li>✓ Advanced driver management</li>
                  <li style={{ color: '#34d399', fontWeight: '600' }}>
                    ✓ Unlimited phone minutes
                  </li>
                  <li style={{ color: '#34d399', fontWeight: '600' }}>
                    ✓ Unlimited SMS messages
                  </li>
                  <li style={{ color: '#34d399', fontWeight: '600' }}>
                    ✓ Advanced call monitoring
                  </li>
                  <li>✓ 🤖 AI automation tools</li>
                </ul>
              </div>

              {/* Solo Broker Premium */}
              <div
                style={{
                  background: 'rgba(147, 51, 234, 0.1)',
                  borderRadius: '16px',
                  padding: '25px',
                  border: '2px solid rgba(147, 51, 234, 0.3)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>
                  🌟
                </div>
                <h3
                  style={{
                    fontSize: '1.3rem',
                    color: '#9333ea',
                    marginBottom: '10px',
                    fontWeight: '700',
                  }}
                >
                  Solo Broker Premium
                </h3>
                <div
                  style={{
                    fontSize: '1.6rem',
                    color: 'white',
                    fontWeight: '800',
                    marginBottom: '15px',
                  }}
                >
                  $599
                  <span style={{ fontSize: '1rem', fontWeight: '500' }}>
                    /month
                  </span>
                </div>
                <ul
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.9rem',
                    listStyle: 'none',
                    padding: 0,
                    lineHeight: '1.8',
                  }}
                >
                  <li>✓ Complete platform access</li>
                  <li>✓ FreightFlow RFx platform</li>
                  <li>✓ Advanced brokerage operations</li>
                  <li>✓ Enhanced carrier relationships</li>
                  <li>✓ Revenue analytics dashboard</li>
                  <li>✓ Advanced analytics & reporting</li>
                  <li>✓ API access & webhooks</li>
                  <li>✓ Multi-customer management</li>
                  <li style={{ color: '#34d399', fontWeight: '600' }}>
                    ✓ Unlimited phone minutes
                  </li>
                  <li style={{ color: '#34d399', fontWeight: '600' }}>
                    ✓ Unlimited SMS messages
                  </li>
                  <li style={{ color: '#34d399', fontWeight: '600' }}>
                    ✓ Advanced call monitoring
                  </li>
                  <li>✓ 🤖 AI automation tools</li>
                </ul>
              </div>
            </div>

            {/* Team Plans Section */}
            <div
              style={{
                textAlign: 'center',
                marginBottom: '40px',
                marginTop: '60px',
              }}
            >
              <h2
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  background:
                    'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '20px',
                }}
              >
                FleetFlow Team Plans
              </h2>
              <p
                style={{
                  fontSize: '1.2rem',
                  color: 'rgba(255,255,255,0.8)',
                  lineHeight: '1.6',
                  marginBottom: '30px',
                }}
              >
                Organization subscriptions for brokerage and dispatch teams.
                <br />
                <strong style={{ color: '#10b981' }}>
                  Save up to 76% compared to individual plans!
                </strong>
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '25px',
                marginBottom: '40px',
              }}
            >
              {/* Team Brokerage Starter */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '16px',
                  padding: '25px',
                  border: '2px solid rgba(16, 185, 129, 0.3)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>
                  🏢
                </div>
                <h3
                  style={{
                    fontSize: '1.3rem',
                    color: '#10b981',
                    marginBottom: '10px',
                    fontWeight: '700',
                  }}
                >
                  Team Brokerage Starter
                </h3>
                <div
                  style={{
                    fontSize: '1.8rem',
                    color: 'white',
                    fontWeight: '800',
                    marginBottom: '15px',
                  }}
                >
                  $299
                  <span style={{ fontSize: '1rem', fontWeight: '500' }}>
                    /month
                  </span>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    (up to 2 people)
                  </div>
                </div>
                <ul
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.9rem',
                    listStyle: 'none',
                    padding: 0,
                    lineHeight: '1.8',
                  }}
                >
                  <li>✓ Core brokerage tools</li>
                  <li>✓ Load management & posting</li>
                  <li>✓ Basic carrier database</li>
                  <li>✓ Standard reporting & analytics</li>
                  <li>✓ Up to 2 team members included</li>
                  <li>✓ Additional seats: $49/month each</li>
                  <li>✓ 📞 Phone add-on available</li>
                </ul>
              </div>

              {/* Team Brokerage Pro */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '16px',
                  padding: '25px',
                  border: '2px solid #10b981',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background:
                      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                  }}
                >
                  ⭐ Popular
                </div>
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>
                  🚀
                </div>
                <h3
                  style={{
                    fontSize: '1.3rem',
                    color: '#10b981',
                    marginBottom: '10px',
                    fontWeight: '700',
                  }}
                >
                  Team Brokerage Pro
                </h3>
                <div
                  style={{
                    fontSize: '1.8rem',
                    color: 'white',
                    fontWeight: '800',
                    marginBottom: '15px',
                  }}
                >
                  $499
                  <span style={{ fontSize: '1rem', fontWeight: '500' }}>
                    /month
                  </span>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    (up to 5 people)
                  </div>
                </div>
                <ul
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.9rem',
                    listStyle: 'none',
                    padding: 0,
                    lineHeight: '1.8',
                  }}
                >
                  <li>✓ Advanced brokerage operations</li>
                  <li>✓ Unlimited load management</li>
                  <li>✓ Enhanced carrier relationships</li>
                  <li>✓ Advanced analytics & reporting</li>
                  <li>✓ API access & integrations</li>
                  <li>✓ Up to 5 team members included</li>
                  <li>✓ Additional seats: $39/month each</li>
                  <li style={{ color: '#34d399', fontWeight: '600' }}>
                    ✓ 500 phone minutes included
                  </li>
                  <li style={{ color: '#34d399', fontWeight: '600' }}>
                    ✓ 200 SMS messages included
                  </li>
                </ul>
              </div>

              {/* Team Dispatch Starter */}
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '16px',
                  padding: '25px',
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>
                  📋
                </div>
                <h3
                  style={{
                    fontSize: '1.3rem',
                    color: '#3b82f6',
                    marginBottom: '10px',
                    fontWeight: '700',
                  }}
                >
                  Team Dispatch Starter
                </h3>
                <div
                  style={{
                    fontSize: '1.8rem',
                    color: 'white',
                    fontWeight: '800',
                    marginBottom: '15px',
                  }}
                >
                  $149
                  <span style={{ fontSize: '1rem', fontWeight: '500' }}>
                    /month
                  </span>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    (up to 2 people)
                  </div>
                </div>
                <ul
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.9rem',
                    listStyle: 'none',
                    padding: 0,
                    lineHeight: '1.8',
                  }}
                >
                  <li>✓ Core dispatch management</li>
                  <li>✓ Driver assignment & tracking</li>
                  <li>✓ Route optimization basics</li>
                  <li>✓ Basic reporting</li>
                  <li>✓ CRM integration</li>
                  <li>✓ Up to 2 team members included</li>
                  <li>✓ Additional seats: $39/month each</li>
                  <li>✓ 📞 Phone add-on available</li>
                </ul>
              </div>

              {/* Team Enterprise */}
              <div
                style={{
                  background: 'rgba(147, 51, 234, 0.1)',
                  borderRadius: '16px',
                  padding: '25px',
                  border: '2px solid rgba(147, 51, 234, 0.3)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>
                  👑
                </div>
                <h3
                  style={{
                    fontSize: '1.3rem',
                    color: '#9333ea',
                    marginBottom: '10px',
                    fontWeight: '700',
                  }}
                >
                  Team Enterprise
                </h3>
                <div
                  style={{
                    fontSize: '1.8rem',
                    color: 'white',
                    fontWeight: '800',
                    marginBottom: '15px',
                  }}
                >
                  $2,698
                  <span style={{ fontSize: '1rem', fontWeight: '500' }}>
                    /month
                  </span>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    (up to 10 people)
                  </div>
                </div>
                <ul
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.9rem',
                    listStyle: 'none',
                    padding: 0,
                    lineHeight: '1.8',
                  }}
                >
                  <li>✓ Complete platform access</li>
                  <li>✓ All premium features</li>
                  <li>✓ Dedicated account manager</li>
                  <li>✓ White-label options</li>
                  <li>✓ Up to 10 team members included</li>
                  <li>✓ Additional seats: $199/month each</li>
                  <li style={{ color: '#34d399', fontWeight: '600' }}>
                    ✓ Unlimited phone minutes
                  </li>
                  <li style={{ color: '#34d399', fontWeight: '600' }}>
                    ✓ Unlimited SMS messages
                  </li>
                </ul>
              </div>
            </div>

            {/* À La Carte Option */}
            <div
              style={{
                background: 'rgba(20, 184, 166, 0.1)',
                borderRadius: '16px',
                padding: '25px',
                border: '1px solid rgba(20, 184, 166, 0.3)',
                textAlign: 'center',
                marginBottom: '30px',
              }}
            >
              <h3
                style={{
                  fontSize: '1.4rem',
                  color: '#14b8a6',
                  marginBottom: '15px',
                  fontWeight: '700',
                }}
              >
                🎯 À La Carte Professional
              </h3>
              <p
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '1rem',
                  marginBottom: '20px',
                }}
              >
                <strong>Starting at $59/month</strong> for Base Platform + Add
                only the modules you need
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '12px',
                }}
              >
                {[
                  'Dispatch Management +$99',
                  'CRM Suite +$79',
                  'RFx Discovery +$149',
                  'AI Flow Basic +$99',
                  'Broker Operations +$199',
                  'Training +$49',
                  'Analytics +$89',
                  'Real-Time Tracking +$69',
                  'API Access +$149',
                ].map((module, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(20, 184, 166, 0.2)',
                      color: '#14b8a6',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                    }}
                  >
                    {module}
                  </div>
                ))}
              </div>
            </div>

            {/* Enterprise Solutions */}
            <div
              style={{
                background: 'rgba(168, 85, 247, 0.1)',
                borderRadius: '16px',
                padding: '25px',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                textAlign: 'center',
                marginBottom: '30px',
              }}
            >
              <h3
                style={{
                  fontSize: '1.4rem',
                  color: '#a855f7',
                  marginBottom: '15px',
                  fontWeight: '700',
                }}
              >
                🏢 Enterprise Solutions
              </h3>
              <p
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '1rem',
                  marginBottom: '15px',
                }}
              >
                <strong>$4,999 - $9,999+/month</strong> - Custom enterprise
                deployments
              </p>
              <ul
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '0.9rem',
                  listStyle: 'none',
                  padding: 0,
                  lineHeight: '1.8',
                  display: 'inline-block',
                  textAlign: 'left',
                }}
              >
                <li>✓ Dedicated account management</li>
                <li>✓ Custom integrations & workflows</li>
                <li>✓ White-label branding options</li>
                <li>✓ 24/7 priority support</li>
                <li>✓ On-premise deployment available</li>
                <li>✓ Multi-location & fleet management</li>
                <li>✓ Advanced compliance automation</li>
                <li>✓ Custom training programs</li>
              </ul>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link href='/auth/signup'>
                <button
                  style={{
                    background:
                      'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '15px 40px',
                    borderRadius: '12px',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                    transition: 'all 0.3s ease',
                    marginRight: '15px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 35px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(59, 130, 246, 0.3)';
                  }}
                >
                  🚀 Start Free Trial
                </button>
              </Link>
              <Link href='/plans'>
                <button
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '15px 40px',
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
                  💰 View All Plans
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* DEPOINTE AI Company Dashboard Section */}
        <div style={{ marginTop: '60px', marginBottom: '60px' }}>
          <div
            style={{
              background: 'rgba(139, 69, 19, 0.1)',
              backdropFilter: 'blur(15px)',
              borderRadius: '20px',
              border: '2px solid rgba(255, 215, 0, 0.3)',
              padding: '40px',
              maxWidth: '1200px',
              margin: '0 auto',
              boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2
                style={{
                  fontSize: '2.8rem',
                  fontWeight: '900',
                  color: '#ffd700',
                  marginBottom: '20px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                🤖 AI Company Staff powered by DEPOINTE AI™
              </h2>
              <p
                style={{
                  fontSize: '1.4rem',
                  color: 'rgba(255,255,255,0.9)',
                  lineHeight: '1.6',
                  marginBottom: '15px',
                  fontWeight: '600',
                }}
              >
                18 AI Staff Members Managing Your Entire Freight Brokerage -
                Coming Soon
              </p>
              <p
                style={{
                  fontSize: '1.1rem',
                  color: 'rgba(255,255,255,0.8)',
                  lineHeight: '1.5',
                  marginBottom: '30px',
                }}
              >
                Complete AI workforce with dedicated specialists for every
                aspect of your freight business
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '25px',
                  marginBottom: '40px',
                }}
              >
                {/* AI Staff Categories */}
                <div
                  style={{
                    background: 'rgba(255, 215, 0, 0.1)',
                    borderRadius: '16px',
                    padding: '25px',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.3rem',
                      color: '#ffd700',
                      marginBottom: '15px',
                      fontWeight: '700',
                    }}
                  >
                    💼 Operations Team
                  </h3>
                  <ul
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '0.95rem',
                      listStyle: 'none',
                      padding: 0,
                      lineHeight: '1.8',
                    }}
                  >
                    <li>• Logan (Logistics Coordinator)</li>
                    <li>• Miles (Dispatch Manager)</li>
                    <li>• Dee (Freight Brokerage)</li>
                    <li>• Will (Sales Director)</li>
                    <li>• Hunter (Recruiting)</li>
                  </ul>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 215, 0, 0.1)',
                    borderRadius: '16px',
                    padding: '25px',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.3rem',
                      color: '#ffd700',
                      marginBottom: '15px',
                      fontWeight: '700',
                    }}
                  >
                    🤝 Relationships Team
                  </h3>
                  <ul
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '0.95rem',
                      listStyle: 'none',
                      padding: 0,
                      lineHeight: '1.8',
                    }}
                  >
                    <li>• Brook R. (Brokerage Operations)</li>
                    <li>• Carrie R. (Carrier Relations)</li>
                    <li>• Shanell (Customer Service)</li>
                    <li>• Clarence (Claims & Insurance)</li>
                  </ul>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 215, 0, 0.1)',
                    borderRadius: '16px',
                    padding: '25px',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.3rem',
                      color: '#ffd700',
                      marginBottom: '15px',
                      fontWeight: '700',
                    }}
                  >
                    📊 Analytics & Compliance
                  </h3>
                  <ul
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '0.95rem',
                      listStyle: 'none',
                      padding: 0,
                      lineHeight: '1.8',
                    }}
                  >
                    <li>• Ana Lytics (Data Analysis)</li>
                    <li>• Kameelah (DOT Compliance)</li>
                    <li>• Regina (FMCSA Regulations)</li>
                    <li>• Resse A. Bell (Accounting)</li>
                    <li>• Dell (IT Support)</li>
                  </ul>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 215, 0, 0.1)',
                    borderRadius: '16px',
                    padding: '25px',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.3rem',
                      color: '#ffd700',
                      marginBottom: '15px',
                      fontWeight: '700',
                    }}
                  >
                    🎯 Business Development
                  </h3>
                  <ul
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '0.95rem',
                      listStyle: 'none',
                      padding: 0,
                      lineHeight: '1.8',
                    }}
                  >
                    <li>• Gary (General Lead Generation)</li>
                    <li>• Desiree (Desperate Prospects)</li>
                    <li>• Cliff (Desperate Prospects)</li>
                    <li>• Drew (Marketing)</li>
                    <li>• C. Allen Durr (Scheduling)</li>
                  </ul>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 215, 0, 0.05)',
                  borderRadius: '12px',
                  padding: '30px',
                  marginBottom: '30px',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '2rem',
                    color: '#ffd700',
                    marginBottom: '15px',
                    fontWeight: '800',
                  }}
                >
                  Starting at $4,999/month
                </h3>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '1rem',
                    marginBottom: '20px',
                  }}
                >
                  Complete AI workforce managing your freight brokerage
                  operations 24/7
                </p>
                <ul
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.95rem',
                    listStyle: 'none',
                    padding: 0,
                    lineHeight: '1.8',
                    textAlign: 'left',
                    display: 'inline-block',
                  }}
                >
                  <li>✓ 18 specialized AI staff members</li>
                  <li>✓ 24/7 automated operations</li>
                  <li>✓ Real-time task management</li>
                  <li>✓ Automated lead generation</li>
                  <li>✓ Compliance monitoring</li>
                  <li>✓ Customer relationship management</li>
                  <li>✓ Performance analytics & reporting</li>
                  <li>✓ Integration with all FleetFlow systems</li>
                  <li>✓ Up to 25 human users included</li>
                  <li>✓ Additional departments: $1,299/month (includes 1 AI staff)</li>
                  <li>✓ Individual AI specialists: $399/month each</li>
                  <li style={{ color: '#ff8c00', fontWeight: '600' }}>
                    🚀 Coming Soon
                  </li>
                </ul>
              </div>

              <div style={{ textAlign: 'center' }}>
                <Link href='/ai-company-dashboard'>
                  <button
                    style={{
                      background:
                        'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
                      color: '#1a1a1a',
                      border: 'none',
                      padding: '18px 45px',
                      borderRadius: '12px',
                      fontSize: '1.3rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
                      transition: 'all 0.3s ease',
                      marginRight: '15px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow =
                        '0 12px 35px rgba(255, 215, 0, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 25px rgba(255, 215, 0, 0.4)';
                    }}
                  >
                    🤖 View DEPOINTE AI Dashboard
                  </button>
                </Link>
                <Link href='/plans'>
                  <button
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      padding: '18px 45px',
                      borderRadius: '12px',
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,215,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255,255,255,0.1)';
                    }}
                  >
                    💼 Add to Enterprise Plan
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FleetFlow LaunchPad℠ Section */}
        <div style={{ marginTop: '60px', marginBottom: '60px' }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(15px)',
              borderRadius: '20px',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              padding: '40px',
              maxWidth: '1200px',
              margin: '0 auto',
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  background:
                    'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '20px',
                }}
              >
                🚀 FleetFlow LaunchPad℠
              </h2>
              <p
                style={{
                  fontSize: '1.3rem',
                  color: 'rgba(255,255,255,0.9)',
                  lineHeight: '1.6',
                  marginBottom: '15px',
                  fontWeight: '500',
                }}
              >
                Professional Transportation Business Launch Services
              </p>
              <p
                style={{
                  fontSize: '1.1rem',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: '1.5',
                  marginBottom: '30px',
                }}
              >
                Complete guidance for brokers and owner operators starting their
                transportation careers with our enterprise platform.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '30px',
                marginBottom: '40px',
              }}
            >
              {/* Broker Launch Program */}
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '16px',
                  padding: '30px',
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow =
                    '0 15px 35px rgba(59, 130, 246, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🤝</div>
                <h3
                  style={{
                    fontSize: '1.4rem',
                    color: '#3b82f6',
                    marginBottom: '15px',
                    fontWeight: '700',
                  }}
                >
                  Broker Launch Program
                </h3>
                <div
                  style={{
                    fontSize: '2.2rem',
                    color: 'white',
                    fontWeight: '800',
                    marginBottom: '15px',
                  }}
                >
                  $999
                </div>
                <ul
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.95rem',
                    listStyle: 'none',
                    padding: 0,
                    lineHeight: '1.8',
                    textAlign: 'left',
                    marginBottom: '20px',
                  }}
                >
                  <li>✓ MC Authority application assistance</li>
                  <li>✓ BMC-84 Bond setup guidance</li>
                  <li>✓ FleetFlow University℠ certification</li>
                  <li>✓ 60 days of weekly coaching calls</li>
                  <li>✓ 3 months FleetFlow Broker Elite FREE</li>
                  <li>✓ Complete business formation support</li>
                </ul>
                <Link href='/launchpad/broker'>
                  <button
                    style={{
                      background:
                        'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
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
                    Learn More →
                  </button>
                </Link>
              </div>

              {/* Owner Operator Launch Program */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '16px',
                  padding: '30px',
                  border: '2px solid rgba(16, 185, 129, 0.3)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow =
                    '0 15px 35px rgba(16, 185, 129, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🚛</div>
                <h3
                  style={{
                    fontSize: '1.4rem',
                    color: '#10b981',
                    marginBottom: '15px',
                    fontWeight: '700',
                  }}
                >
                  Owner Operator Success Program
                </h3>
                <div
                  style={{
                    fontSize: '2.2rem',
                    color: 'white',
                    fontWeight: '800',
                    marginBottom: '15px',
                  }}
                >
                  $699
                </div>
                <ul
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.95rem',
                    listStyle: 'none',
                    padding: 0,
                    lineHeight: '1.8',
                    textAlign: 'left',
                    marginBottom: '20px',
                  }}
                >
                  <li>✓ DOT registration assistance</li>
                  <li>✓ Authority & compliance setup</li>
                  <li>✓ FleetFlow University℠ training</li>
                  <li>✓ 45 days of bi-weekly coaching</li>
                  <li>✓ 3 months FleetFlow Dispatcher Pro FREE</li>
                  <li>✓ Complete insurance coordination</li>
                </ul>
                <Link href='/launchpad/owner-operator'>
                  <button
                    style={{
                      background:
                        'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
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
                    Learn More →
                  </button>
                </Link>
              </div>
            </div>

            {/* CTA Section */}
            <div style={{ textAlign: 'center' }}>
              <p
                style={{
                  fontSize: '1.1rem',
                  color: 'rgba(255,255,255,0.8)',
                  marginBottom: '25px',
                }}
              >
                <strong style={{ color: '#3b82f6' }}>
                  Ready to launch your transportation career?
                </strong>
                <br />
                Join hundreds of successful professionals who started with
                FleetFlow LaunchPad℠
              </p>
              <Link href='/launchpad'>
                <button
                  style={{
                    background:
                      'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 35px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(59, 130, 246, 0.3)';
                  }}
                >
                  🚀 Explore LaunchPad Services
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Who It's For Section */}
        <section
          style={{ marginBottom: '60px', maxWidth: '800px' }}
          aria-labelledby='audience-heading'
        >
          <h2
            id='audience-heading'
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
              fontWeight: 'bold',
              marginBottom: '24px',
              color: 'white',
            }}
          >
            Every Role, One Platform
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: '1.5',
              marginBottom: '24px',
            }}
          >
            One intelligent platform connecting every piece of your
            transportation operations - from solo drivers managing their first
            load to Fortune 500 enterprises orchestrating global supply chains.
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '15px',
            }}
          >
            {[
              {
                role: '👤 Individual Drivers',
                color: '#f4a832',
                shadowColor: 'rgba(244, 168, 50, 0.3)',
              }, // Driver Management
              {
                role: '🚛 Owner Operators',
                color: '#1e40af',
                shadowColor: 'rgba(30, 64, 175, 0.3)',
              }, // Dark Blue
              {
                role: '📋 Dispatchers',
                color: '#3b82f6',
                shadowColor: 'rgba(59, 130, 246, 0.3)',
              }, // Operations Blue
              {
                role: '🏢 Brokerages',
                color: '#f97316',
                shadowColor: 'rgba(249, 115, 22, 0.3)',
              }, // Orange
              {
                role: '🏭 3PL Companies',
                color: '#6366f1',
                shadowColor: 'rgba(99, 102, 241, 0.3)',
              }, // Analytics Purple
              {
                role: '🌟 Enterprise Fleets',
                color: '#14b8a6',
                shadowColor: 'rgba(20, 184, 166, 0.3)',
              }, // Teal
            ].map((item, index) => (
              <button
                key={index}
                style={{
                  background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 4px 12px ${item.shadowColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 20px ${item.shadowColor.replace('0.3', '0.4')}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${item.shadowColor}`;
                }}
                onClick={() => {
                  // Add click functionality if needed
                  console.info(`Selected role: ${item.role}`);
                }}
              >
                {item.role}
              </button>
            ))}
          </div>
        </section>

        {/* Platform Reliability & Trust */}
        <section
          style={{ textAlign: 'center', marginBottom: '60px' }}
          aria-labelledby='reliability-heading'
        >
          <h2
            id='reliability-heading'
            style={{
              fontSize: '2.2rem',
              fontWeight: '700',
              marginBottom: '40px',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
            }}
          >
            Platform Reliability & Trust
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '30px',
              maxWidth: '1200px',
              margin: '0 auto',
            }}
          >
            {/* KPI 1: System Uptime */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '16px',
                padding: '20px 16px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                transform: 'scale(1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow =
                  '0 20px 40px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  marginBottom: '12px',
                  filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))',
                }}
              >
                🚀
              </div>
              <div
                style={{
                  fontSize: '1.8rem',
                  fontWeight: '800',
                  color: '#3b82f6',
                  marginBottom: '8px',
                  textShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                }}
              >
                99.9%
              </div>
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#1e40af',
                  marginBottom: '6px',
                }}
              >
                System Uptime
              </div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#64748b',
                  lineHeight: '1.4',
                }}
              >
                Guaranteed platform availability
              </div>
            </div>

            {/* KPI 2: Active Companies */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '16px',
                padding: '20px 16px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                transform: 'scale(1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow =
                  '0 20px 40px rgba(16, 185, 129, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  marginBottom: '12px',
                  filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.5))',
                }}
              >
                🏢
              </div>
              <div
                style={{
                  fontSize: '1.8rem',
                  fontWeight: '800',
                  color: '#10b981',
                  marginBottom: '8px',
                  textShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
                }}
              >
                2,847+
              </div>
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#059669',
                  marginBottom: '6px',
                }}
              >
                Active Companies
              </div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#64748b',
                  lineHeight: '1.4',
                }}
              >
                Trusted by industry leaders
              </div>
            </div>

            {/* KPI 3: Response Time */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(147, 51, 234, 0.1))',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '16px',
                padding: '20px 16px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                transform: 'scale(1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow =
                  '0 20px 40px rgba(168, 85, 247, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  marginBottom: '12px',
                  filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.5))',
                }}
              >
                ⚡
              </div>
              <div
                style={{
                  fontSize: '1.8rem',
                  fontWeight: '800',
                  color: '#a855f7',
                  marginBottom: '8px',
                  textShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
                }}
              >
                &lt;50ms
              </div>
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#9333ea',
                  marginBottom: '6px',
                }}
              >
                Response Time
              </div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#64748b',
                  lineHeight: '1.4',
                }}
              >
                Lightning-fast performance
              </div>
            </div>

            {/* KPI 4: Support Coverage */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '16px',
                padding: '20px 16px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                transform: 'scale(1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow =
                  '0 20px 40px rgba(239, 68, 68, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  marginBottom: '12px',
                  filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.5))',
                }}
              >
                🛟
              </div>
              <div
                style={{
                  fontSize: '1.8rem',
                  fontWeight: '800',
                  color: '#ef4444',
                  marginBottom: '8px',
                  textShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
                }}
              >
                24/7
              </div>
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#dc2626',
                  marginBottom: '6px',
                }}
              >
                Support Coverage
              </div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#64748b',
                  lineHeight: '1.4',
                }}
              >
                Always here when you need us
              </div>
            </div>

            {/* KPI 5: Global Reach */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(14, 184, 166, 0.1), rgba(13, 148, 136, 0.1))',
                border: '1px solid rgba(14, 184, 166, 0.3)',
                borderRadius: '16px',
                padding: '20px 16px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                transform: 'scale(1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow =
                  '0 20px 40px rgba(14, 184, 166, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  marginBottom: '12px',
                  filter: 'drop-shadow(0 0 10px rgba(14, 184, 166, 0.5))',
                }}
              >
                🌍
              </div>
              <div
                style={{
                  fontSize: '1.8rem',
                  fontWeight: '800',
                  color: '#14b8a6',
                  marginBottom: '8px',
                  textShadow: '0 0 20px rgba(14, 184, 166, 0.5)',
                }}
              >
                150+
              </div>
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#0d9488',
                  marginBottom: '6px',
                }}
              >
                Countries Served
              </div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#64748b',
                  lineHeight: '1.4',
                }}
              >
                Global logistics network
              </div>
            </div>

            {/* KPI 6: Load Optimization */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1))',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '16px',
                padding: '20px 16px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                transform: 'scale(1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow =
                  '0 20px 40px rgba(34, 197, 94, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  marginBottom: '12px',
                  filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.5))',
                }}
              >
                📊
              </div>
              <div
                style={{
                  fontSize: '1.8rem',
                  fontWeight: '800',
                  color: '#22c55e',
                  marginBottom: '8px',
                  textShadow: '0 0 20px rgba(34, 197, 94, 0.5)',
                }}
              >
                25%+
              </div>
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#16a34a',
                  marginBottom: '6px',
                }}
              >
                Efficiency Gain
              </div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#64748b',
                  lineHeight: '1.4',
                }}
              >
                AI-powered route optimization
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Demo Booking Modal */}
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
            padding: '20px',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '16px',
              padding: '40px',
              maxWidth: '500px',
              width: '100%',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <h3
              style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                marginBottom: '20px',
                color: 'white',
                textAlign: 'center',
              }}
            >
              Book Your Enterprise Demo
            </h3>
            <form onSubmit={handleDemoSubmit}>
              {[
                { key: 'name', label: 'Full Name', type: 'text' },
                { key: 'email', label: 'Business Email', type: 'email' },
                { key: 'company', label: 'Company Name', type: 'text' },
                { key: 'phone', label: 'Phone Number', type: 'tel' },
                { key: 'fleetSize', label: 'Fleet Size', type: 'text' },
              ].map((field) => (
                <div key={field.key} style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: '500',
                    }}
                  >
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    required
                    value={demoForm[field.key as keyof DemoBookingForm]}
                    onChange={(e) =>
                      setDemoForm({
                        ...demoForm,
                        [field.key]: e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      background: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      fontSize: '1rem',
                    }}
                  />
                </div>
              ))}

              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: '500',
                  }}
                >
                  Additional Requirements
                </label>
                <textarea
                  value={demoForm.message}
                  onChange={(e) =>
                    setDemoForm({ ...demoForm, message: e.target.value })
                  }
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '1rem',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '15px',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  type='button'
                  onClick={() => setShowDemoForm(false)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  style={{
                    background:
                      'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Schedule Demo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
