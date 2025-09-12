'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import EmailSignatureBuilder from '../components/EmailSignatureBuilder';
import { emailSignatureIntegration } from '../services/EmailSignatureIntegration';
import {
  EmailSignature,
  fleetFlowSignatureManager,
} from '../services/FleetFlowSignatureManager';

// Mobile optimization styles - EXACTLY matching billing-invoices page
const mobileStyles = `
  @media (max-width: 768px) {
    .financial-grid {
      grid-template-columns: 1fr !important;
      gap: 12px !important;
    }
    .financial-card {
      padding: 16px !important;
      margin-bottom: 12px !important;
    }
    .financial-table {
      font-size: 0.8rem !important;
      overflow-x: auto !important;
    }
    .financial-filters {
      flex-direction: column !important;
      gap: 8px !important;
    }
    .financial-tabs {
      flex-wrap: wrap !important;
      gap: 4px !important;
    }
    .financial-tab {
      padding: 8px 12px !important;
      font-size: 0.8rem !important;
    }
    .chart-container {
      width: 100% !important;
      overflow-x: auto !important;
    }
  }
  @media (max-width: 480px) {
    .financial-header {
      font-size: 1.2rem !important;
    }
    .financial-subtitle {
      font-size: 0.9rem !important;
    }
    .performance-metric {
      font-size: 0.8rem !important;
    }
  }
`;

// Inject mobile styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = mobileStyles;
  document.head.appendChild(styleSheet);
}

// Performance metrics component - EXACTLY matching billing-invoices page
const PerformanceMetrics = ({ title, metrics, color }) => (
  <div
    style={{
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '20px',
      border: `1px solid ${color}30`,
      borderLeft: `4px solid ${color}`,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    }}
  >
    <h4
      style={{
        color: color,
        margin: '0 0 16px 0',
        fontSize: '1.1rem',
        fontWeight: '600',
      }}
    >
      {title}
    </h4>
    {metrics.map((metric, index) => (
      <div
        key={index}
        style={{
          marginBottom: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
          {metric.label}
        </span>
        <span style={{ color: 'white', fontWeight: '600', fontSize: '1rem' }}>
          {metric.value}
        </span>
      </div>
    ))}
  </div>
);

// Notification component - EXACTLY matching billing-invoices page
const NotificationBell = ({ notifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        style={{
          background:
            notifications.length > 0 ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '1.2rem',
          position: 'relative',
        }}
      >
        🔔
        {notifications.length > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {notifications.length}
          </span>
        )}
      </button>

      {showNotifications && (
        <div
          style={{
            position: 'fixed',
            top: '100px',
            right: '20px',
            width: '300px',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            zIndex: 99999,
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h4 style={{ color: 'white', margin: '0', fontSize: '1rem' }}>
              Notifications
            </h4>
          </div>
          {notifications.map((notification, index) => (
            <div
              key={index}
              style={{
                padding: '12px 16px',
                borderBottom:
                  index < notifications.length - 1
                    ? '1px solid rgba(255, 255, 255, 0.05)'
                    : 'none',
              }}
            >
              <div
                style={{
                  color: notification.type === 'alert' ? '#ef4444' : '#22c55e',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                }}
              >
                {notification.title}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.8rem',
                  marginTop: '4px',
                }}
              >
                {notification.message}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '0.7rem',
                  marginTop: '4px',
                }}
              >
                {notification.time}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function EmailSignaturesPage() {
  const [activeTab, setActiveTab] = useState('builder');
  const [signatures, setSignatures] = useState<EmailSignature[]>([]);
  const [selectedSignature, setSelectedSignature] =
    useState<EmailSignature | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalSignatures: 0,
    aiStaffSignatures: 0,
    departmentSignatures: 0,
    customSignatures: 0,
  });

  // Mock notifications - EXACTLY matching billing-invoices page
  const [notifications] = useState([
    {
      type: 'alert',
      title: 'Signature Template Alert',
      message: 'AI Staff signatures need updating for compliance',
      time: '2 hours ago',
    },
    {
      type: 'success',
      title: 'New Signature Created',
      message: 'Department signature for Operations successfully created',
      time: '4 hours ago',
    },
    {
      type: 'info',
      title: 'Integration Complete',
      message: 'Email signatures now integrated with SendGrid',
      time: '1 day ago',
    },
  ]);

  const handlePlanChange = async (planId: string) => {
    setSelectedPlan(planId);
  };

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadSignatures();
    loadStats();
  }, []);

  const loadSignatures = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from a database
      // For now, we'll simulate with cached signatures
      await emailSignatureIntegration.initialize();

      // Get all cached signatures (this would be replaced with API call)
      const mockSignatures: EmailSignature[] = [
        {
          id: 'ai-staff-resse-bell',
          name: 'Resse A. Bell AI Signature',
          type: 'ai_staff',
          department: 'financial',
          aiStaffId: 'resse-bell',
          fullName: 'Resse A. Bell',
          title: 'AI Financial Specialist',
          department_name: 'Financial Services',
          email: 'accounting@fleetflowapp.com',
          phone: '(555) 123-4567',
          companyName: 'DEPOINTE AI',
          companyLogo: '/assets/depointe-logo.png',
          website: 'https://fleetflowapp.com',
          socialLinks: [
            {
              platform: 'linkedin',
              url: 'https://linkedin.com/company/fleetflow',
              displayIcon: true,
            },
          ],
          customLinks: [
            {
              label: 'Schedule Meeting',
              url: 'https://fleetflowapp.com/schedule/resse-bell',
              icon: 'calendar',
            },
          ],
          template: {
            id: 'ai-staff-branded',
            name: 'AI Staff Branded',
            layout: 'horizontal',
            photoPosition: 'left',
            socialPosition: 'bottom',
          },
          branding: {
            primaryColor: '#2563eb',
            secondaryColor: '#1e40af',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            logoSize: 'medium',
            showCompanyLogo: true,
            showPersonalPhoto: false,
          },
          ctaButton: {
            text: 'Get Quote',
            url: 'https://fleetflowapp.com/quote',
            backgroundColor: '#2563eb',
            textColor: '#ffffff',
            borderRadius: 6,
          },
          disclaimers: [
            'This email was sent by DEPOINTE AI on behalf of FleetFlow TMS.',
            'All communications are monitored for quality assurance.',
          ],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      setSignatures(mockSignatures);
    } catch (error) {
      console.error('Error loading signatures:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = () => {
    const stats = emailSignatureIntegration.getSignatureStats();
    setStats(stats);
  };

  const handleSaveSignature = (signature: EmailSignature) => {
    setSignatures((prev) => {
      const existing = prev.find((s) => s.id === signature.id);
      if (existing) {
        return prev.map((s) => (s.id === signature.id ? signature : s));
      } else {
        return [...prev, signature];
      }
    });

    // Update cache
    emailSignatureIntegration.updateSignatureCache(signature.id, signature);
    loadStats();
  };

  const handleDeleteSignature = (signatureId: string) => {
    if (confirm('Are you sure you want to delete this signature?')) {
      setSignatures((prev) => prev.filter((s) => s.id !== signatureId));
      emailSignatureIntegration.removeSignatureFromCache(signatureId);
      loadStats();
    }
  };

  const handleEditSignature = (signature: EmailSignature) => {
    setSelectedSignature(signature);
    setActiveTab('builder');
  };

  const generatePreviewHTML = (signature: EmailSignature): string => {
    try {
      return fleetFlowSignatureManager.generateSignatureHTML(signature.id);
    } catch (error) {
      return `
        <div style="font-family: Inter, sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="color: ${signature.branding.primaryColor}; font-weight: bold; margin-bottom: 5px;">
            ${signature.fullName}
          </div>
          <div style="color: #666; margin-bottom: 3px;">${signature.title}</div>
          <div style="color: #666; margin-bottom: 8px;">${signature.department_name}</div>
          <div style="margin-bottom: 3px;">
            📧 <a href="mailto:${signature.email}" style="color: ${signature.branding.primaryColor}; text-decoration: none;">
              ${signature.email}
            </a>
          </div>
          ${signature.phone ? `<div style="margin-bottom: 3px;">📞 ${signature.phone}</div>` : ''}
        </div>
      `;
    }
  };

  return (
    <div
      style={{
        padding: '40px',
        paddingTop: '100px',
        background: `
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.04) 0%, transparent 50%)
      `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        minHeight: '100vh',
        color: '#ffffff',
        position: 'relative',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
      }}
    >
      {/* Professional Header - EXACTLY matching billing-invoices page */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 10000,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 10px 0',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              📧 FleetFlow Internal Email Signature Center
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
              }}
            >
              Internal email signature management for FleetFlow TMS •
              Intra-office use only • {currentTime?.toLocaleString() || '--'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <NotificationBell notifications={notifications} />
            <Link href='/' style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                🏠 Dashboard
              </button>
            </Link>
            <button
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                transition: 'all 0.3s ease',
              }}
            >
              📋 Request Support
            </button>
          </div>
        </div>
      </div>

      {/* Executive KPIs - EXACT FleetFlow Style */}
      {/* Performance Metrics - EXACTLY matching billing-invoices page */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        <PerformanceMetrics
          title='📧 Signature Overview'
          metrics={[
            {
              label: 'Total Signatures',
              value: stats.totalSignatures.toString(),
            },
            {
              label: 'Active Signatures',
              value: signatures.filter((s) => s.isActive).length.toString(),
            },
            { label: 'AI Staff', value: stats.aiStaffSignatures.toString() },
          ]}
          color='#3b82f6'
        />

        <PerformanceMetrics
          title='🔗 Integration Status'
          metrics={[
            { label: 'SendGrid Ready', value: '✅ Connected' },
            { label: 'AI Email Systems', value: '✅ Integrated' },
            { label: 'BOL Email System', value: '🔄 Pending' },
          ]}
          color='#10b981'
        />

        <PerformanceMetrics
          title='🎨 Template Usage'
          metrics={[
            {
              label: 'Horizontal Layout',
              value: signatures
                .filter((s) => s.template.layout === 'horizontal')
                .length.toString(),
            },
            {
              label: 'Vertical Layout',
              value: signatures
                .filter((s) => s.template.layout === 'vertical')
                .length.toString(),
            },
            {
              label: 'Card Layout',
              value: signatures
                .filter((s) => s.template.layout === 'card')
                .length.toString(),
            },
          ]}
          color='#8b5cf6'
        />

        <PerformanceMetrics
          title='📈 Performance'
          metrics={[
            { label: 'Monthly Growth', value: '+12%' },
            { label: 'Avg. Response Time', value: '2.3s' },
            { label: 'Uptime', value: '99.9%' },
          ]}
          color='#f59e0b'
        />
      </div>

      {/* Quick Links - EXACT FleetFlow Style */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '30px',
        }}
      >
        {[
          {
            id: 'builder',
            label: '🎨 Signature Builder',
            bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', // Professional blue
            color: 'white',
          },
          {
            id: 'management',
            label: '📋 Manage Signatures',
            bg: 'linear-gradient(135deg, #f7c52d, #f4a832)', // DRIVER MANAGEMENT yellow
            color: '#2d3748',
          },
          {
            id: 'analytics',
            label: '📊 Analytics & Stats',
            bg: 'linear-gradient(135deg, #6366f1, #4f46e5)', // ANALYTICS purple
            color: 'white',
          },
        ].map((link, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(link.id as any)}
            style={{
              background: link.bg,
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              boxShadow:
                activeTab === link.id
                  ? '0 8px 25px rgba(0, 0, 0, 0.2)'
                  : '0 4px 6px rgba(0, 0, 0, 0.1)',
              border:
                activeTab === link.id
                  ? '2px solid rgba(255, 255, 255, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
              transform: activeTab === link.id ? 'translateY(-5px)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== link.id) {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow =
                  '0 6px 15px rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== link.id) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 6px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
              {link.label.split(' ')[0]}
            </div>
            <div
              style={{
                fontSize: '1rem',
                fontWeight: '700',
                color: link.color,
              }}
            >
              {link.label.substring(link.label.indexOf(' ') + 1)}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area - EXACTLY matching billing-invoices page */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Builder Tab - EXACTLY matching billing-invoices page */}
        {activeTab === 'builder' && (
          <div>
            <div
              style={{
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h2
                style={{
                  color: 'white',
                  margin: '0 0 20px 0',
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                🎨 Professional Signature Builder
              </h2>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() =>
                    emailSignatureIntegration.refreshSignatureCache()
                  }
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#6b7280',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  🔄 Refresh Templates
                </button>
              </div>
            </div>

            {/* Create Your Professional Signature - EXACTLY matching billing-invoices page */}
            <div
              style={{
                marginBottom: '32px',
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              }}
            >
              <h3
                style={{
                  color: '#3b82f6',
                  margin: '0 0 16px 0',
                  fontSize: '1.3rem',
                }}
              >
                📝 Create Your Professional Signature
              </h3>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <EmailSignatureBuilder
                  onSave={handleSaveSignature}
                  initialSignature={selectedSignature || undefined}
                />
              </div>
            </div>

            {/* Internal Department Options - FleetFlow Style */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {[
                {
                  id: 'executive',
                  name: 'Executive Leadership',
                  features: [
                    'FleetFlow CEO/Founder Branding',
                    'Executive Contact Information',
                    'Company Leadership Template',
                    'Priority Support',
                  ],
                  department: 'Executive',
                },
                {
                  id: 'operations',
                  name: 'Operations Department',
                  features: [
                    'FleetFlow Operations Branding',
                    'Logistics & Dispatch Info',
                    'Operations Team Template',
                    'Process Documentation',
                  ],
                  department: 'Operations',
                },
                {
                  id: 'sales',
                  name: 'Sales & Marketing',
                  features: [
                    'FleetFlow Sales Branding',
                    'Client Acquisition Focus',
                    'Sales Team Template',
                    'Lead Generation Tools',
                  ],
                  department: 'Sales',
                },
              ].map((option, index) => (
                <div
                  key={option.id}
                  onClick={() => handlePlanChange(option.id)}
                  style={{
                    background:
                      index === 0
                        ? 'rgba(59, 130, 246, 0.2)'
                        : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border:
                      index === 0
                        ? '1px solid rgba(59, 130, 246, 0.3)'
                        : '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {index === 0 && (
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        marginBottom: '15px',
                        display: 'inline-block',
                      }}
                    >
                      👑 EXECUTIVE
                    </div>
                  )}
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '10px',
                    }}
                  >
                    {option.name}
                  </h3>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#10b981',
                      marginBottom: '10px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        display: 'block',
                        marginBottom: '4px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        textTransform: 'uppercase',
                      }}
                    >
                      Department
                    </span>
                    {option.department}
                  </div>
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: '0 0 15px 0',
                      textAlign: 'left',
                    }}
                  >
                    {option.features.slice(0, 4).map((feature, idx) => (
                      <li
                        key={idx}
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '6px',
                          paddingLeft: '15px',
                          position: 'relative',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            left: 0,
                            color: '#10b981',
                            fontWeight: '600',
                          }}
                        >
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                    {option.features.length > 4 && (
                      <li
                        style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontStyle: 'italic',
                          textAlign: 'center',
                        }}
                      >
                        +{option.features.length - 4} more features
                      </li>
                    )}
                  </ul>
                  <button
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      background:
                        index === 0
                          ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                          : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      textTransform: 'uppercase',
                    }}
                  >
                    {selectedPlan === option.id
                      ? '✓ Selected'
                      : 'Select Department'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Management Tab - EXACTLY matching billing-invoices page */}
        {activeTab === 'management' && (
          <div>
            <div
              style={{
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h2
                style={{
                  color: 'white',
                  margin: '0 0 20px 0',
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                📋 Signature Management Center
              </h2>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    setSelectedSignature(null);
                    setActiveTab('builder');
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#f59e0b',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  ➕ Create New Signature
                </button>
                <button
                  onClick={() =>
                    emailSignatureIntegration.refreshSignatureCache()
                  }
                  style={{
                    background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  🔄 Refresh Cache
                </button>
              </div>
            </div>

            {/* Statistics Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: '25px',
              }}
            >
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📧</div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#3b82f6',
                    marginBottom: '5px',
                  }}
                >
                  {stats.totalSignatures}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  Total Signatures
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🤖</div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#10b981',
                    marginBottom: '5px',
                  }}
                >
                  {stats.aiStaffSignatures}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  AI Staff
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(139, 92, 246, 0.2)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏢</div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#8b5cf6',
                    marginBottom: '5px',
                  }}
                >
                  {stats.departmentSignatures}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  Departments
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#f59e0b',
                    marginBottom: '5px',
                  }}
                >
                  {signatures.filter((s) => s.isActive).length}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  Active
                </div>
              </div>
            </div>

            {/* Signatures Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {isLoading ? (
                <div
                  style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '40px',
                  }}
                >
                  <div
                    style={{
                      animation: 'spin 1s linear infinite',
                      border: '4px solid rgba(255,255,255,0.3)',
                      borderTop: '4px solid #3b82f6',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      margin: '0 auto 16px',
                    }}
                   />
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Loading signatures...
                  </div>
                </div>
              ) : signatures.length === 0 ? (
                <div
                  style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '40px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                    📧
                  </div>
                  <h3 style={{ color: 'white', marginBottom: '8px' }}>
                    No signatures created yet
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '20px',
                    }}
                  >
                    Create your first professional signature to get started
                  </p>
                  <button
                    onClick={() => {
                      setSelectedSignature(null);
                      setActiveTab('builder');
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                    }}
                  >
                    Create Your First Signature
                  </button>
                </div>
              ) : (
                signatures.map((signature) => (
                  <div
                    key={signature.id}
                    style={{
                      background:
                        signature.type === 'ai_staff'
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      border:
                        signature.type === 'ai_staff'
                          ? '1px solid rgba(59, 130, 246, 0.3)'
                          : '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {signature.type === 'ai_staff' && (
                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          marginBottom: '15px',
                          display: 'inline-block',
                        }}
                      >
                        🤖 DEPOINTE AI
                      </div>
                    )}

                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '10px',
                      }}
                    >
                      {signature.name}
                    </h3>

                    <div style={{ marginBottom: '15px' }}>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '3px',
                        }}
                      >
                        <strong>{signature.fullName}</strong> •{' '}
                        {signature.title}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        {signature.email}
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '15px',
                        fontSize: '11px',
                      }}
                      dangerouslySetInnerHTML={{
                        __html: generatePreviewHTML(signature),
                      }}
                    />

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEditSignature(signature)}
                        style={{
                          flex: 1,
                          background:
                            'linear-gradient(135deg, #3b82f6, #2563eb)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px',
                          fontSize: '11px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => {
                          const html = generatePreviewHTML(signature);
                          navigator.clipboard.writeText(html);
                          alert('Signature HTML copied to clipboard!');
                        }}
                        style={{
                          flex: 1,
                          background:
                            'linear-gradient(135deg, #6b7280, #4b5563)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px',
                          fontSize: '11px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        📋 Copy
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#ffffff',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                📊 Signature Analytics Dashboard
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                marginBottom: '25px',
              }}
            >
              {/* Usage Statistics */}
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '15px',
                  }}
                >
                  📊 Usage Statistics
                </h3>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                  }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Total Signatures:
                  </span>
                  <span style={{ color: 'white', fontWeight: '600' }}>
                    {stats.totalSignatures}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                  }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Active:
                  </span>
                  <span style={{ color: '#10b981', fontWeight: '600' }}>
                    {signatures.filter((s) => s.isActive).length}
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    AI Staff:
                  </span>
                  <span style={{ color: '#3b82f6', fontWeight: '600' }}>
                    {stats.aiStaffSignatures}
                  </span>
                </div>
              </div>

              {/* Template Usage */}
              <div
                style={{
                  background: 'rgba(139, 92, 246, 0.2)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                }}
              >
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '15px',
                  }}
                >
                  🎨 Template Usage
                </h3>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                  }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Horizontal:
                  </span>
                  <span style={{ color: 'white', fontWeight: '600' }}>
                    {
                      signatures.filter(
                        (s) => s.template.layout === 'horizontal'
                      ).length
                    }
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                  }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Vertical:
                  </span>
                  <span style={{ color: 'white', fontWeight: '600' }}>
                    {
                      signatures.filter((s) => s.template.layout === 'vertical')
                        .length
                    }
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Card:
                  </span>
                  <span style={{ color: 'white', fontWeight: '600' }}>
                    {
                      signatures.filter((s) => s.template.layout === 'card')
                        .length
                    }
                  </span>
                </div>
              </div>

              {/* Integration Status */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '15px',
                  }}
                >
                  🔗 Integration Status
                </h3>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ color: '#10b981', fontSize: '16px' }}>✅</span>
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    SendGrid Integration
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ color: '#10b981', fontSize: '16px' }}>✅</span>
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    AI Email Systems
                  </span>
                </div>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span style={{ color: '#f59e0b', fontSize: '16px' }}>🔄</span>
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    BOL Email System
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '15px',
                }}
              >
                📈 Recent Activity
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Signature System Initialized
                  </span>
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '12px',
                    }}
                  >
                    Just now
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    AI Staff Signatures Generated
                  </span>
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '12px',
                    }}
                  >
                    Just now
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Email Integration Configured
                  </span>
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '12px',
                    }}
                  >
                    Just now
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#ffffff',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                📊 Signature Analytics Dashboard
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                marginBottom: '25px',
              }}
            >
              {/* Usage Statistics */}
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '15px',
                  }}
                >
                  📊 Usage Statistics
                </h3>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                  }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Total Signatures:
                  </span>
                  <span style={{ color: 'white', fontWeight: '600' }}>
                    {stats.totalSignatures}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                  }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Active:
                  </span>
                  <span style={{ color: '#10b981', fontWeight: '600' }}>
                    {signatures.filter((s) => s.isActive).length}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    AI Staff:
                  </span>
                  <span style={{ color: '#3b82f6', fontWeight: '600' }}>
                    {stats.aiStaffSignatures}
                  </span>
                </div>
              </div>

              {/* Template Usage */}
              <div
                style={{
                  background: 'rgba(139, 92, 246, 0.2)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                }}
              >
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '15px',
                  }}
                >
                  🎨 Template Usage
                </h3>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                  }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Horizontal:
                  </span>
                  <span style={{ color: 'white', fontWeight: '600' }}>
                    {
                      signatures.filter(
                        (s) => s.template.layout === 'horizontal'
                      ).length
                    }
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                  }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Vertical:
                  </span>
                  <span style={{ color: 'white', fontWeight: '600' }}>
                    {
                      signatures.filter((s) => s.template.layout === 'vertical')
                        .length
                    }
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Card:
                  </span>
                  <span style={{ color: 'white', fontWeight: '600' }}>
                    {
                      signatures.filter((s) => s.template.layout === 'card')
                        .length
                    }
                  </span>
                </div>
              </div>

              {/* Integration Status */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '15px',
                  }}
                >
                  🔗 Integration Status
                </h3>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ color: '#10b981', fontSize: '16px' }}>✅</span>
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    SendGrid Integration
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ color: '#10b981', fontSize: '16px' }}>✅</span>
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    AI Email Systems
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ color: '#f59e0b', fontSize: '16px' }}>🔄</span>
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    BOL Email System
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '15px',
                }}
              >
                📈 Recent Activity
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Signature System Initialized
                  </span>
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '12px',
                    }}
                  >
                    Just now
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    AI Staff Signatures Generated
                  </span>
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '12px',
                    }}
                  >
                    Just now
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Email Integration Configured
                  </span>
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '12px',
                    }}
                  >
                    Just now
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
