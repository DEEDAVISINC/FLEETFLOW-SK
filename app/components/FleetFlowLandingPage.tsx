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
    console.log('Demo booking submitted:', demoForm);
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
          </Link>          <Link href='/dashboard'>
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
              Dashboard
            </button>
          </Link>
          <Link href='/settings'>
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
              Settings
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
        <div style={{ marginBottom: '50px', maxWidth: '800px' }}>
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
            >
              Book Enterprise Demo
            </button>
            <Link href='/settings'>
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
              >
                Platform Access
              </button>
            </Link>
          </div>
        </div>

        {/* Autoplay App Screenshots Video */}
        <FleetFlowAppVideo />

        {/* Go With the Flow Section */}
        <div style={{ marginTop: '50px', marginBottom: '50px' }}>
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
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h2
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
              <p
                style={{
                  fontSize: '1.3rem',
                  color: 'white',
                  lineHeight: '1.6',
                  marginBottom: '25px',
                  fontWeight: '500',
                }}
              >
                An advanced <strong style={{ color: '#f4a832' }}>instant marketplace</strong> - connecting shippers and drivers in real-time with AI-powered matching and dynamic pricing.
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
                  <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📦</div>
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
                  <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                    Request trucks instantly - no waiting
                  </li>
                  <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                    AI-powered fair pricing
                  </li>
                  <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                    Real-time driver matching
                  </li>
                  <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                    Live GPS tracking & updates
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
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
                  <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🚛</div>
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
                  <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                    Go online/offline instantly
                  </li>
                  <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                    Find high-paying loads nearby
                  </li>
                  <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                    Competitive market rates
                  </li>
                  <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                    Fast payment processing
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
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
                  Our intelligent system analyzes market conditions, traffic patterns, fuel costs, and demand in real-time to provide optimal pricing and instant matching.
                </p>
              </div>

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
                    e.currentTarget.style.transform = 'scale(1.05)'
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(244, 168, 50, 0.6)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(244, 168, 50, 0.4)'
                  }}
                >
                  🚀 Start Using Go With the Flow
                </button>
              </Link>
            </div>
          </div>
        </div>
        {/* Who It's For Section */}
        <div style={{ marginBottom: '60px', maxWidth: '800px' }}>
          <h2
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
                  console.log(`Selected role: ${item.role}`);
                }}
              >
                {item.role}
              </button>
            ))}
          </div>
        </div>

        {/* Platform Reliability & Trust */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2
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
        </div>
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
