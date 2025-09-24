'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../config/access';

export default function DocumentationPage() {
  // LOCAL ADMIN ACCESS - Always allow access for local development
  const { user } = getCurrentUser();
  const hasManagementAccess = true; // Local admin always has access

  const [selectedDoc, setSelectedDoc] = useState('user-guide');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    // Local admin access - always allow
    setIsLoading(false);
  }, []);

  // Show loading state initially
  if (isLoading) {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '40px',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>📚</div>
          <p>Loading Documentation...</p>
        </div>
      </div>
    );
  }

  // Local admin - always has access, no need for access denied check

  const documents = [
    {
      id: 'user-guide',
      title: '📖 User Guide',
      description: 'Complete step-by-step guide for all users',
      file: 'USER_GUIDE.md',
      category: 'Training',
    },
    {
      id: 'business-plan',
      title: '💼 Comprehensive Business Plan',
      description:
        'Complete business strategy, market analysis, financial projections, and investment roadmap',
      file: 'COMPREHENSIVE_BUSINESS_PLAN.md',
      category: 'Business',
    },
    {
      id: 'executive-summary',
      title: '📊 Executive Summary',
      description: 'Business overview and investment opportunity summary',
      file: 'EXECUTIVE_SUMMARY.md',
      category: 'Business',
    },
    {
      id: 'ai-guide',
      title: '🤖 AI Implementation Guide',
      description:
        'AI features, automation documentation, and machine learning capabilities',
      file: 'AI_IMPLEMENTATION_GUIDE.md',
      category: 'Technical',
    },
    {
      id: 'quick-reference',
      title: '📋 Quick Reference Cards',
      description: 'Quick start guides and checklists for different roles',
      file: 'QUICK_REFERENCE_CARDS.md',
      category: 'Reference',
    },
    {
      id: 'training-checklists',
      title: '✅ Training Checklists',
      description:
        'Training materials, certification requirements, and progress tracking',
      file: 'TRAINING_CHECKLISTS.md',
      category: 'Training',
    },
    {
      id: 'technical-architecture',
      title: '🏗️ Technical Architecture',
      description:
        'System architecture, API documentation, and technical specifications',
      file: 'TECHNICAL_ARCHITECTURE.md',
      category: 'Technical',
    },
    {
      id: 'compliance-guide',
      title: '⚖️ DOT Compliance Guide',
      description:
        'Complete DOT compliance procedures, forms, and regulatory requirements',
      file: 'DOT_COMPLIANCE_GUIDE.md',
      category: 'Reference',
    },
    {
      id: 'implementation-guide',
      title: '🚀 Implementation Guide',
      description: 'Step-by-step implementation process and best practices',
      file: 'IMPLEMENTATION_GUIDE.md',
      category: 'Technical',
    },
    {
      id: 'marketing-strategy',
      title: '📈 Marketing Strategy',
      description:
        'Comprehensive marketing plan, customer acquisition, and growth strategy',
      file: 'MARKETING_PLAN.md',
      category: 'Business',
    },
  ];

  const categories = ['All', 'Business', 'Training', 'Technical', 'Reference'];
  const filteredDocs = documents.filter(
    (doc) => selectedCategory === 'All' || doc.category === selectedCategory
  );

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          padding: '20px',
          color: 'white',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          {/* Back Navigation */}
          <div style={{ marginBottom: '20px' }}>
            <Link
              href='/fleetflowdash'
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                textDecoration: 'none',
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
              }}
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* Main Container */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '30px',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            {/* Header */}
            <div
              style={{
                textAlign: 'center',
                marginBottom: '40px',
              }}
            >
              <h1
                style={{
                  fontSize: '3rem',
                  margin: '0 0 15px 0',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                📚 FleetFlow Documentation
              </h1>
              <p
                style={{
                  fontSize: '1.2rem',
                  margin: '0 0 10px 0',
                  opacity: 0.9,
                }}
              >
                Comprehensive guides, references, and training materials
              </p>
              <div
                style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  background: 'rgba(76, 175, 80, 0.3)',
                  border: '1px solid rgba(76, 175, 80, 0.5)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  color: '#4CAF50',
                  fontWeight: '500',
                }}
              >
                🔐 Management Access | Role:{' '}
                {user?.role?.toUpperCase() || 'LOCAL ADMIN'}
              </div>
            </div>

            {/* Category Filter */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                marginBottom: '30px',
                flexWrap: 'wrap',
              }}
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    background:
                      selectedCategory === category
                        ? 'rgba(255, 255, 255, 0.3)'
                        : 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Documents Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '20px',
                marginBottom: '40px',
              }}
            >
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '25px',
                    borderRadius: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: '600',
                      marginBottom: '10px',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                    }}
                  >
                    {doc.title}
                  </div>
                  <div
                    style={{
                      fontSize: '1rem',
                      opacity: 0.9,
                      marginBottom: '15px',
                      lineHeight: '1.5',
                    }}
                  >
                    {doc.description}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.8rem',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                      }}
                    >
                      {doc.category}
                    </span>
                    <Link href={`/documentation/${doc.id}`}>
                      <button
                        style={{
                          background: 'rgba(33, 150, 243, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        📄 View
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Download & Export Options */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '30px',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                textAlign: 'center',
              }}
            >
              <h3
                style={{
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  margin: '0 0 20px 0',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                📥 Export Options for Presentations
              </h3>
              <p
                style={{
                  fontSize: '1.1rem',
                  margin: '0 0 30px 0',
                  opacity: 0.9,
                  lineHeight: '1.6',
                }}
              >
                Download documentation in various formats for presentations,
                training, or offline access
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
                  style={{
                    background: 'rgba(244, 67, 54, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px rgba(244, 67, 54, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  📄 Export as PDF
                </button>
                <button
                  style={{
                    background: 'rgba(76, 175, 80, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  📊 PowerPoint Format
                </button>
                <button
                  style={{
                    background: 'rgba(156, 39, 176, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px rgba(156, 39, 176, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  📱 Mobile-Friendly
                </button>
              </div>

              <div
                style={{
                  marginTop: '20px',
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <p
                  style={{
                    fontSize: '0.9rem',
                    margin: 0,
                    opacity: 0.8,
                  }}
                >
                  💡 <strong>Pro Tip:</strong> For presentations, start with the
                  Executive Summary, then use Quick Reference Cards for hands-on
                  demonstrations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
