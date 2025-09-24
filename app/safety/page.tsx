'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SafetyResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    'general' | 'drivers' | 'equipment' | 'compliance'
  >('general');

  // General Safety Resources
  const generalSafety = [
    {
      name: 'OSHA Trucking Safety',
      description:
        'Occupational Safety and Health Administration trucking industry guidelines',
      website: 'https://osha.gov/trucking',
      category: 'Regulations',
    },
    {
      name: 'FMCSA Safety Management',
      description:
        'Federal Motor Carrier Safety Administration safety management systems',
      website: 'https://fmcsa.dot.gov/safety',
      category: 'Federal',
    },
    {
      name: 'American Trucking Safety',
      description:
        'ATA safety programs and best practices for commercial motor vehicles',
      website: 'https://truckingsafety.org',
      category: 'Industry',
    },
    {
      name: 'National Safety Council',
      description: 'Commercial driving safety resources and training materials',
      website: 'https://nsc.org/road/commercial-vehicles',
      category: 'Training',
    },
  ];

  // Driver Safety Resources
  const driverSafety = [
    {
      name: 'Hours of Service Rules',
      description:
        'Complete guide to HOS regulations and electronic logging devices',
      website: 'https://fmcsa.dot.gov/regulations/hours-service',
      category: 'HOS',
    },
    {
      name: 'Smith System Training',
      description:
        'Professional driver safety training and defensive driving techniques',
      website: 'https://smithsystem.com',
      category: 'Training',
    },
    {
      name: 'Driver Qualification Files',
      description:
        'Maintaining proper driver qualification and medical records',
      website: 'https://fmcsa.dot.gov/regulations/driver-requirements',
      category: 'Qualification',
    },
    {
      name: 'Distracted Driving Prevention',
      description:
        'Resources for preventing distracted driving and mobile device policies',
      website: 'https://distraction.gov/commercial-drivers',
      category: 'Prevention',
    },
  ];

  // Equipment Safety Resources
  const equipmentSafety = [
    {
      name: 'Vehicle Inspection Programs',
      description:
        'Pre-trip, en-route, and post-trip inspection requirements and checklists',
      website: 'https://fmcsa.dot.gov/regulations/vehicle-inspection',
      category: 'Inspection',
    },
    {
      name: 'Brake Safety Standards',
      description:
        'Commercial vehicle brake system maintenance and safety standards',
      website: 'https://fmcsa.dot.gov/regulations/brake-systems',
      category: 'Brakes',
    },
    {
      name: 'Cargo Securement Rules',
      description: 'Proper cargo loading, securing, and weight distribution',
      website: 'https://fmcsa.dot.gov/regulations/cargo-securement',
      category: 'Cargo',
    },
    {
      name: 'Tire Safety Guidelines',
      description:
        'Commercial tire maintenance, inspection, and replacement guidelines',
      website: 'https://tiresafetygroup.com',
      category: 'Tires',
    },
  ];

  // Compliance Safety Resources
  const complianceSafety = [
    {
      name: 'Safety Management Systems',
      description: 'Implementing comprehensive safety management programs',
      website: 'https://fmcsa.dot.gov/safety/safety-management',
      category: 'Management',
    },
    {
      name: 'CSA Safety Scores',
      description:
        'Compliance, Safety, Accountability program and scoring system',
      website: 'https://ai.fmcsa.dot.gov/sms',
      category: 'Scoring',
    },
    {
      name: 'Safety Audit Prep',
      description: 'Preparing for DOT safety audits and compliance reviews',
      website: 'https://fmcsa.dot.gov/safety/audits',
      category: 'Audits',
    },
    {
      name: 'Drug & Alcohol Testing',
      description: 'DOT drug and alcohol testing requirements and procedures',
      website: 'https://fmcsa.dot.gov/regulations/drug-alcohol-testing',
      category: 'Testing',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)',
        paddingTop: '80px',
      }}
    >
      {/* Back Button */}
      <div style={{ padding: '24px' }}>
        <Link href='/fleetflowdash' style={{ textDecoration: 'none' }}>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '16px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Main Content Container */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px 80px 24px',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '40px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              marginBottom: '32px',
            }}
          >
            <h1
              style={{
                fontSize: '48px',
                fontWeight: '700',
                background: 'linear-gradient(45deg, #ffffff, #fef2f2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '0 0 16px 0',
              }}
            >
              🦺 Safety Resources
            </h1>
            <p
              style={{
                fontSize: '20px',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: '0',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto',
                lineHeight: '1.6',
              }}
            >
              Comprehensive safety resources, regulations, and best practices
              for transportation professionals
            </p>
          </div>

          {/* Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['general', 'drivers', 'equipment', 'compliance'] as const).map(
                (category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      border: 'none',
                      cursor: 'pointer',
                      background:
                        selectedCategory === category
                          ? 'rgba(255, 255, 255, 0.25)'
                          : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      fontSize: '14px',
                    }}
                  >
                    {category === 'general' && '🛡️ General Safety'}
                    {category === 'drivers' && '👤 Driver Safety'}
                    {category === 'equipment' && '🚛 Equipment Safety'}
                    {category === 'compliance' && '📋 Compliance'}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Emergency Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            color: 'white',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={{ fontSize: '32px' }}>🚨</div>
            <div>
              <h2
                style={{
                  margin: '0 0 8px 0',
                  fontSize: '20px',
                  fontWeight: '700',
                }}
              >
                Emergency Resources
              </h2>
              <p style={{ margin: '0', opacity: '0.9' }}>
                For immediate safety emergencies: Call 911 | DOT Emergency
                Hotline: 1-800-424-9153
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gap: '20px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            }}
          >
            {(selectedCategory === 'general'
              ? generalSafety
              : selectedCategory === 'drivers'
                ? driverSafety
                : selectedCategory === 'equipment'
                  ? equipmentSafety
                  : complianceSafety
            ).map((resource, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background =
                    'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 40px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px',
                  }}
                >
                  <h3
                    style={{
                      margin: '0',
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: '700',
                    }}
                  >
                    {resource.name}
                  </h3>
                  <span
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    {resource.category}
                  </span>
                </div>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: '0 0 16px 0',
                    lineHeight: '1.5',
                    fontSize: '14px',
                  }}
                >
                  {resource.description}
                </p>
                <a
                  href={resource.website}
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'inline-block',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  Visit Resource →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
