'use client';

import { useState } from 'react';

export const CarrierDocumentsChecklist = () => {
  const [activeCategory, setActiveCategory] = useState<string>('required-docs');

  const documentCategories = {
    'required-docs': {
      title: 'Required Carrier Onboarding Documents',
      icon: '📋',
      color: '#ef4444',
      documents: [
        {
          name: 'MC Authority (Motor Carrier Authority)',
          description:
            'FMCSA operating authority number - must be active and in good standing',
          required: true,
          notes: 'Verify status at safer.fmcsa.dot.gov',
        },
        {
          name: 'DOT Number',
          description: 'Department of Transportation identification number',
          required: true,
          notes: 'Must match MC authority and be current',
        },
        {
          name: 'Certificate of Insurance',
          description:
            'Proof of liability, cargo, and physical damage coverage',
          required: true,
          notes: 'Minimum $1M liability, $100K cargo typical',
        },
        {
          name: 'W-9 Tax Form',
          description: 'Request for Taxpayer Identification Number',
          required: true,
          notes: 'Required for 1099 reporting at year-end',
        },
        {
          name: 'Signed Carrier Agreement',
          description:
            'Master service agreement outlining terms and conditions',
          required: true,
          notes: 'Must be executed before first load',
        },
      ],
    },
    'verification-docs': {
      title: 'Verification & Compliance Documents',
      icon: '✅',
      color: '#10b981',
      documents: [
        {
          name: 'Safety Rating Verification',
          description: 'FMCSA safety rating and CSA scores',
          required: true,
          notes: 'No ""Unsatisfactory"" rating, check CSA percentiles',
        },
        {
          name: 'Equipment List & Photos',
          description:
            'List of tractors, trailers with photos and specifications',
          required: false,
          notes: 'Helpful for load matching and capacity planning',
        },
        {
          name: 'Driver Qualification Files',
          description: 'CDL copies, medical certificates, drug test results',
          required: true,
          notes: 'Required for each driver operating under authority',
        },
        {
          name: 'Vehicle Registration',
          description: 'Current registration for all power units',
          required: true,
          notes: 'Must be current and match DOT records',
        },
        {
          name: 'IRP (International Registration Plan)',
          description: 'Interstate registration for multi-state operations',
          required: true,
          notes: 'Required for interstate commerce',
        },
      ],
    },
    'operational-docs': {
      title: 'Operational Documents',
      icon: '🚛',
      color: '#3b82f6',
      documents: [
        {
          name: 'Rate Confirmation Template',
          description: 'Standard format for load confirmations',
          required: false,
          notes: 'Streamlines booking process',
        },
        {
          name: 'Factoring Company Information',
          description: 'Details if carrier uses factoring services',
          required: false,
          notes: 'Affects payment processing and terms',
        },
        {
          name: 'Emergency Contact Information',
          description: 'After-hours contact numbers and procedures',
          required: true,
          notes: 'Critical for load tracking and emergencies',
        },
        {
          name: 'Preferred Lanes & Equipment',
          description: 'Carrier preferences for routing and load types',
          required: false,
          notes: 'Improves load matching efficiency',
        },
        {
          name: 'Banking Information (ACH)',
          description: 'Account details for electronic payments',
          required: false,
          notes: 'Speeds up payment processing',
        },
      ],
    },
    'renewal-tracking': {
      title: 'Document Renewal Tracking',
      icon: '📅',
      color: '#f59e0b',
      documents: [
        {
          name: 'Insurance Renewal Dates',
          description: 'Track expiration dates for all insurance policies',
          required: true,
          notes: 'Set 30-day renewal reminders',
        },
        {
          name: 'Authority Renewal',
          description: 'MC Authority biennial renewal requirements',
          required: true,
          notes: 'Due every 2 years, $300 fee',
        },
        {
          name: 'DOT Biennial Update',
          description: 'Required DOT information update every 2 years',
          required: true,
          notes: 'Must be completed to maintain authority',
        },
        {
          name: 'Drug & Alcohol Program',
          description: 'Consortium enrollment and testing compliance',
          required: true,
          notes: 'Required for all CDL drivers',
        },
        {
          name: 'Annual Vehicle Inspections',
          description: 'DOT annual inspection certificates',
          required: true,
          notes: 'Required for all commercial vehicles',
        },
      ],
    },
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '24px',
        margin: '24px 0',
      }}
    >
      <h3
        style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#ffffff',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span>📋</span>
        Carrier Onboarding Documents Checklist
      </h3>

      {/* Category Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '24px',
        }}
      >
        {Object.entries(documentCategories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background:
                activeCategory === key
                  ? `linear-gradient(135deg, ${category.color}, ${category.color}dd)`
                  : 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{category.icon}</span>
            {category.title}
          </button>
        ))}
      </div>

      {/* Active Category Content */}
      <div
        style={{
          background: `rgba(${
            activeCategory === 'required-docs'
              ? '239, 68, 68'
              : activeCategory === 'verification-docs'
                ? '16, 185, 129'
                : activeCategory === 'operational-docs'
                  ? '59, 130, 246'
                  : '245, 158, 11'
          }, 0.1)`,
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid rgba(${
            activeCategory === 'required-docs'
              ? '239, 68, 68'
              : activeCategory === 'verification-docs'
                ? '16, 185, 129'
                : activeCategory === 'operational-docs'
                  ? '59, 130, 246'
                  : '245, 158, 11'
          }, 0.2)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <span style={{ fontSize: '24px' }}>
            {
              documentCategories[
                activeCategory as keyof typeof documentCategories
              ].icon
            }
          </span>
          <h4
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#ffffff',
              margin: 0,
            }}
          >
            {
              documentCategories[
                activeCategory as keyof typeof documentCategories
              ].title
            }
          </h4>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          {documentCategories[
            activeCategory as keyof typeof documentCategories
          ].documents.map((doc, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px',
                }}
              >
                <h5
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#ffffff',
                    margin: 0,
                  }}
                >
                  {doc.name}
                </h5>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: doc.required
                      ? 'rgba(239, 68, 68, 0.3)'
                      : 'rgba(156, 163, 175, 0.3)',
                    color: '#ffffff',
                  }}
                >
                  {doc.required ? 'REQUIRED' : 'OPTIONAL'}
                </span>
              </div>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '8px',
                  lineHeight: '1.4',
                }}
              >
                {doc.description}
              </p>
              {doc.notes && (
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontStyle: 'italic',
                    padding: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '6px',
                  }}
                >
                  💡 {doc.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Reference */}
      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          background: 'rgba(168, 85, 247, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(168, 85, 247, 0.2)',
        }}
      >
        <h5
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>⚡</span>
          Quick Reference Links
        </h5>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
            <strong>FMCSA SAFER:</strong> safer.fmcsa.dot.gov
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
            <strong>CSA Scores:</strong> ai.fmcsa.dot.gov
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
            <strong>Insurance Verification:</strong> Direct with carrier's
            insurance company
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
            <strong>Authority Renewal:</strong> $300 biennial fee
          </div>
        </div>
      </div>
    </div>
  );
};
