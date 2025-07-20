'use client';

import React, { useState } from 'react';
import { checkPermission, getCurrentUser } from '../../config/access';

// Access Control Component
const AccessRestricted = () => (
  <div style={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  }}>
    <div style={{
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '40px 32px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      maxWidth: '400px',
      width: '100%'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔒</div>
      <h1 style={{ 
        fontSize: '1.8rem', 
        fontWeight: 'bold', 
        color: 'white', 
        marginBottom: '16px' 
      }}>Access Restricted</h1>
      <p style={{ 
        color: 'rgba(255, 255, 255, 0.8)', 
        marginBottom: '16px',
        lineHeight: '1.6'
      }}>
        You need carrier onboarding permissions to access this system.
      </p>
      <button 
        onClick={() => window.history.back()}
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
        onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'translateY(-2px)'}
        onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'translateY(0)'}
      >
        Go Back
      </button>
    </div>
  </div>
);

// Data Interfaces
interface Carrier {
  id: string;
  dotNumber: string;
  mcNumber: string;
  legalName: string;
  dbaName?: string;
  physicalAddress: string;
  phone: string;
  email: string;
  onboardingStatus: 'pending' | 'in_progress' | 'completed' | 'rejected';
  safetyRating: string;
  equipmentTypes: string[];
  factorCompany?: string;
  documentsComplete: boolean;
  agreementsSigned: boolean;
  portalSetup: boolean;
  dateStarted: string;
  estimatedCompletion?: string;
}

interface OnboardingTask {
  id: string;
  carrierId: string;
  taskType: string;
  taskDescription: string;
  required: boolean;
  completed: boolean;
  completedAt?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

interface FactoringCompany {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  isActive: boolean;
  website: string;
}

// Progress Card Component
const ProgressCard = ({ title, completed, total, icon, color }: { 
  title: string; 
  completed: number; 
  total: number; 
  icon: string; 
  color: string; 
}) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseOver={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
    onMouseOut={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ color: '#1f2937', fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>
          {icon} {title}
        </h3>
        <span style={{ 
          background: color, 
          color: 'white', 
          padding: '4px 8px', 
          borderRadius: '6px', 
          fontSize: '0.8rem',
          fontWeight: 'bold'
        }}>
          {completed}/{total}
        </span>
      </div>
      <div style={{
        background: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        height: '8px',
        overflow: 'hidden'
      }}>
        <div style={{
          background: color,
          height: '100%',
          width: `${percentage}%`,
          transition: 'width 0.3s ease'
        }} />
      </div>
      <div style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '8px' }}>
        {percentage}% Complete
      </div>
    </div>
  );
};

// Carrier Card Component
const CarrierCard = ({ carrier }: { carrier: Carrier }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#f59e0b';
      case 'pending': return '#6b7280';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in_progress': return '🔄';
      case 'pending': return '⏳';
      case 'rejected': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'all 0.2s ease'
    }}
    onMouseOver={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.15)'}
    onMouseOut={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
        <div>
          <h3 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', margin: 0, marginBottom: '4px' }}>
            {carrier.legalName}
          </h3>
          {carrier.dbaName && (
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', margin: 0, marginBottom: '4px' }}>
              DBA: {carrier.dbaName}
            </p>
          )}
          <div style={{ display: 'flex', gap: '12px', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)' }}>
            <span>DOT: {carrier.dotNumber}</span>
            <span>MC: {carrier.mcNumber}</span>
          </div>
        </div>
        <span style={{
          background: getStatusColor(carrier.onboardingStatus),
          color: 'white',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          textTransform: 'capitalize'
        }}>
          {getStatusIcon(carrier.onboardingStatus)} {carrier.onboardingStatus.replace('_', ' ')}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: carrier.documentsComplete ? '#10b981' : '#f59e0b', fontSize: '1.5rem' }}>
            {carrier.documentsComplete ? '📄✅' : '📄⏳'}
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem' }}>Documents</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: carrier.agreementsSigned ? '#10b981' : '#f59e0b', fontSize: '1.5rem' }}>
            {carrier.agreementsSigned ? '📝✅' : '📝⏳'}
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem' }}>Agreements</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: carrier.portalSetup ? '#10b981' : '#f59e0b', fontSize: '1.5rem' }}>
            {carrier.portalSetup ? '👤✅' : '👤⏳'}
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem' }}>Portal</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          flex: 1
        }}>
          View Details
        </button>
        <button style={{
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Message
        </button>
      </div>
    </div>
  );
};

export default function CarrierOnboardingPage() {
  // Check access permission
  if (!checkPermission('canAccessCarrierOnboarding')) {
    return <AccessRestricted />;
  }

  const [activeTab, setActiveTab] = useState<'dashboard' | 'carriers' | 'factoring' | 'documents'>('dashboard');
  const { user } = getCurrentUser();

  // Mock data - Carriers in onboarding
  const carriers: Carrier[] = [
    {
      id: 'carrier-001',
      dotNumber: '3456789',
      mcNumber: 'MC-987654',
      legalName: 'Prime Logistics LLC',
      dbaName: 'Prime Transport',
      physicalAddress: '123 Freight St, Atlanta, GA 30309',
      phone: '(555) 123-4567',
      email: 'dispatch@primelogistics.com',
      onboardingStatus: 'in_progress',
      safetyRating: 'Satisfactory',
      equipmentTypes: ['Dry Van', 'Reefer'],
      factorCompany: 'TBS Factoring',
      documentsComplete: false,
      agreementsSigned: false,
      portalSetup: false,
      dateStarted: '2024-12-20',
      estimatedCompletion: '2025-01-03'
    },
    {
      id: 'carrier-002',
      dotNumber: '2345678',
      mcNumber: 'MC-876543',
      legalName: 'Swift Cargo Solutions Inc',
      physicalAddress: '456 Transport Ave, Dallas, TX 75201',
      phone: '(555) 987-6543',
      email: 'office@swiftcargo.com',
      onboardingStatus: 'completed',
      safetyRating: 'Satisfactory',
      equipmentTypes: ['Flatbed', 'Step Deck'],
      factorCompany: 'Apex Capital',
      documentsComplete: true,
      agreementsSigned: true,
      portalSetup: true,
      dateStarted: '2024-12-10',
      estimatedCompletion: '2024-12-24'
    },
    {
      id: 'carrier-003',
      dotNumber: '1234567',
      mcNumber: 'MC-765432',
      legalName: 'Express Freight Lines',
      physicalAddress: '789 Logistics Dr, Chicago, IL 60601',
      phone: '(555) 456-7890',
      email: 'ops@expressfreight.com',
      onboardingStatus: 'pending',
      safetyRating: 'Satisfactory',
      equipmentTypes: ['Dry Van', 'Flatbed'],
      factorCompany: 'RTS Financial',
      documentsComplete: false,
      agreementsSigned: false,
      portalSetup: false,
      dateStarted: '2024-12-22',
      estimatedCompletion: '2025-01-05'
    }
  ];

  // Mock data - Onboarding tasks
  const onboardingTasks: OnboardingTask[] = [
    {
      id: 'task-001',
      carrierId: 'carrier-001',
      taskType: 'document_upload',
      taskDescription: 'Upload Certificate of Insurance',
      required: true,
      completed: false,
      dueDate: '2024-12-28',
      priority: 'high'
    },
    {
      id: 'task-002',
      carrierId: 'carrier-001',
      taskType: 'agreement_signing',
      taskDescription: 'Sign Carrier Agreement',
      required: true,
      completed: false,
      dueDate: '2024-12-30',
      priority: 'medium'
    },
    {
      id: 'task-003',
      carrierId: 'carrier-003',
      taskType: 'fmcsa_verification',
      taskDescription: 'Complete FMCSA Verification',
      required: true,
      completed: false,
      dueDate: '2024-12-25',
      priority: 'high'
    }
  ];

  // Mock data - Factoring companies
  const factoringCompanies: FactoringCompany[] = [
    {
      id: 'factor-001',
      companyName: 'TBS Factoring',
      contactName: 'Sarah Johnson',
      phone: '(800) 555-0123',
      email: 'sarah@tbsfactoring.com',
      address: '123 Finance St, New York, NY 10001',
      isActive: true,
      website: 'www.tbsfactoring.com'
    },
    {
      id: 'factor-002',
      companyName: 'Apex Capital',
      contactName: 'Mike Davis',
      phone: '(800) 555-0234',
      email: 'mike@apexcapital.com',
      address: '456 Capital Ave, Fort Worth, TX 76102',
      isActive: true,
      website: 'www.apexcapital.com'
    },
    {
      id: 'factor-003',
      companyName: 'RTS Financial',
      contactName: 'Lisa Chen',
      phone: '(800) 555-0345',
      email: 'lisa@rtsfinancial.com',
      address: '789 Funding Blvd, Atlanta, GA 30309',
      isActive: true,
      website: 'www.rtsfinancial.com'
    }
  ];

  // Calculate stats
  const totalCarriers = carriers.length;
  const completedCarriers = carriers.filter(c => c.onboardingStatus === 'completed').length;
  const inProgressCarriers = carriers.filter(c => c.onboardingStatus === 'in_progress').length;
  const pendingCarriers = carriers.filter(c => c.onboardingStatus === 'pending').length;

  return (
    <div style={{
      background: 'radial-gradient(circle at 20% 50%, #667eea 0%, transparent 50%), radial-gradient(circle at 80% 20%, #764ba2 0%, transparent 50%), radial-gradient(circle at 40% 80%, #667eea 0%, transparent 50%), linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '80px 20px 20px 20px'
    }}>
      
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '40px 32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '8px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}>🚛 Carrier Onboarding Center</h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '16px',
            lineHeight: '1.6'
          }}>
            Streamlined carrier verification, documentation, and onboarding workflow
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              👤 {user.name} • {user.role}
            </div>
            <button
              onClick={() => window.open('/university/carrier-onboard-workflow', '_blank')}
              style={{
                background: 'rgba(16, 185, 129, 0.8)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => (e.target as HTMLElement).style.background = 'rgba(16, 185, 129, 1)'}
              onMouseOut={(e) => (e.target as HTMLElement).style.background = 'rgba(16, 185, 129, 0.8)'}
            >
              🎓 Training Available
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'dashboard', label: '📊 Dashboard', desc: 'Overview & Stats' },
            { id: 'carriers', label: '🚛 Carriers', desc: 'Active Onboarding' },
            { id: 'factoring', label: '🏦 Factoring', desc: 'Factor Companies' },
            { id: 'documents', label: '📄 Documents', desc: 'Document Center' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: activeTab === tab.id 
                  ? 'rgba(255, 255, 255, 0.3)' 
                  : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                border: activeTab === tab.id 
                  ? '2px solid rgba(255, 255, 255, 0.5)' 
                  : '1px solid rgba(255, 255, 255, 0.2)',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}
            >
              <div>{tab.label}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>
                {tab.desc}
              </div>
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 8px 0', fontWeight: '500' }}>
                      Total Carriers
                    </p>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', margin: '0 0 4px 0' }}>
                      {totalCarriers}
                    </p>
                    <p style={{ fontSize: '12px', color: '#4ade80', margin: 0 }}>
                      All registered
                    </p>
                  </div>
                  <div style={{ fontSize: '40px', opacity: 0.7 }}>🚛</div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 8px 0', fontWeight: '500' }}>
                      Completed
                    </p>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', margin: '0 0 4px 0' }}>
                      {completedCarriers}
                    </p>
                    <p style={{ fontSize: '12px', color: '#4ade80', margin: 0 }}>
                      Ready for operations
                    </p>
                  </div>
                  <div style={{ fontSize: '40px', opacity: 0.7 }}>✅</div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 8px 0', fontWeight: '500' }}>
                      In Progress
                    </p>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', margin: '0 0 4px 0' }}>
                      {inProgressCarriers}
                    </p>
                    <p style={{ fontSize: '12px', color: '#fbbf24', margin: 0 }}>
                      Active onboarding
                    </p>
                  </div>
                  <div style={{ fontSize: '40px', opacity: 0.7 }}>⏳</div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 8px 0', fontWeight: '500' }}>
                      Pending
                    </p>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', margin: '0 0 4px 0' }}>
                      {pendingCarriers}
                    </p>
                    <p style={{ fontSize: '12px', color: '#f87171', margin: 0 }}>
                      Awaiting start
                    </p>
                  </div>
                  <div style={{ fontSize: '40px', opacity: 0.7 }}>📋</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ 
                color: 'white', 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                🚀 Quick Actions
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px'
              }}>
                {[
                  { 
                    label: '➕ Start New Onboarding', 
                    color: 'linear-gradient(135deg, #14b8a6, #0d9488)', 
                    desc: 'Begin comprehensive carrier verification workflow',
                    action: 'navigate',
                    href: '/onboarding/carrier-onboarding/new'
                  },
                  { 
                    label: '📊 FMCSA Lookup', 
                    color: 'linear-gradient(135deg, #dc2626, #b91c1c)', 
                    desc: 'Verify DOT information',
                    action: 'fmcsa_lookup'
                  },
                  { 
                    label: '🏦 Add Factor Company', 
                    color: 'linear-gradient(135deg, #059669, #047857)', 
                    desc: 'Register new factoring partner',
                    action: 'add_factor'
                  },
                  { 
                    label: '📄 Bulk Document Review', 
                    color: 'linear-gradient(135deg, #f97316, #ea580c)', 
                    desc: 'Review pending documents',
                    action: 'document_review'
                  },
                  { 
                    label: '📝 Generate Agreements', 
                    color: 'linear-gradient(135deg, #6366f1, #4f46e5)', 
                    desc: 'Create carrier contracts',
                    action: 'generate_agreements'
                  },
                  { 
                    label: '👤 Setup Driver Portal', 
                    color: 'linear-gradient(135deg, #f7c52d, #f4a832)', 
                    desc: 'Configure portal access',
                    action: 'setup_portal'
                  }
                ].map((action, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (action.action === 'navigate' && action.href) {
                        window.open(action.href, '_blank');
                      } else {
                        alert(`${action.label} functionality coming soon...`);
                      }
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center'
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.2)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: action.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      margin: '0 auto 12px',
                      color: 'white'
                    }}>
                      {action.label.charAt(0)}
                    </div>
                    <h4 style={{ 
                      color: 'white', 
                      fontSize: '1.1rem', 
                      fontWeight: 'bold', 
                      marginBottom: '8px' 
                    }}>
                      {action.label}
                    </h4>
                    <p style={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      fontSize: '0.9rem', 
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      {action.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ 
                color: 'white', 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                📈 Recent Activity
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px'
              }}>
                {onboardingTasks.slice(0, 6).map((task) => {
                  const carrier = carriers.find(c => c.id === task.carrierId);
                  const priorityColor = task.priority === 'high' ? '#ef4444' : 
                                       task.priority === 'medium' ? '#f59e0b' : '#10b981';
                  
                  return (
                    <div 
                      key={task.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.15)';
                      }}
                      onMouseOut={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px'
                      }}>
                        <div>
                          <h4 style={{ 
                            color: 'white', 
                            fontSize: '1rem', 
                            fontWeight: 'bold', 
                            margin: '0 0 4px 0' 
                          }}>
                            {carrier?.legalName || 'Unknown Carrier'}
                          </h4>
                          <p style={{ 
                            color: 'rgba(255, 255, 255, 0.7)', 
                            fontSize: '0.8rem', 
                            margin: 0 
                          }}>
                            {task.taskDescription}
                          </p>
                        </div>
                        <div style={{
                          background: priorityColor,
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold'
                        }}>
                          {task.priority.toUpperCase()}
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.6)'
                      }}>
                        <span>Due: {task.dueDate}</span>
                        <span style={{
                          color: task.completed ? '#10b981' : '#f59e0b'
                        }}>
                          {task.completed ? '✅ Complete' : '⏳ Pending'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Carriers Tab */}
        {activeTab === 'carriers' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              color: 'white', 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              🚛 Active Carrier Onboarding
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {carriers.map((carrier) => {
                const statusColor = carrier.onboardingStatus === 'completed' ? '#10b981' : 
                                   carrier.onboardingStatus === 'in_progress' ? '#f59e0b' : '#ef4444';
                const statusIcon = carrier.onboardingStatus === 'completed' ? '✅' : 
                                  carrier.onboardingStatus === 'in_progress' ? '⏳' : '📋';
                
                return (
                  <div 
                    key={carrier.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    {/* Header */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px'
                    }}>
                      <div>
                        <h4 style={{ 
                          color: 'white', 
                          fontSize: '1.2rem', 
                          fontWeight: 'bold', 
                          margin: '0 0 4px 0' 
                        }}>
                          {carrier.legalName}
                        </h4>
                        <p style={{ 
                          color: 'rgba(255, 255, 255, 0.7)', 
                          fontSize: '0.9rem', 
                          margin: '0 0 8px 0' 
                        }}>
                          {carrier.mcNumber} • {carrier.dotNumber}
                        </p>
                      </div>
                      <div style={{
                        background: statusColor,
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {statusIcon} {carrier.onboardingStatus.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>

                    {/* Progress Indicators */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(2, 1fr)', 
                      gap: '8px', 
                      fontSize: '0.8rem', 
                      marginBottom: '16px' 
                    }}>
                      <div style={{ 
                        background: carrier.documentsComplete ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        color: carrier.documentsComplete ? '#10b981' : '#ef4444',
                        textAlign: 'center',
                        border: `1px solid ${carrier.documentsComplete ? '#10b981' : '#ef4444'}33`
                      }}>
                        {carrier.documentsComplete ? '✅' : '❌'} Documents
                      </div>
                      <div style={{ 
                        background: carrier.agreementsSigned ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        color: carrier.agreementsSigned ? '#10b981' : '#ef4444',
                        textAlign: 'center',
                        border: `1px solid ${carrier.agreementsSigned ? '#10b981' : '#ef4444'}33`
                      }}>
                        {carrier.agreementsSigned ? '✅' : '❌'} Agreements
                      </div>
                    </div>

                    {/* Details */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.8rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                      paddingTop: '16px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <span>Started: {carrier.dateStarted}</span>
                      <span>Safety: {carrier.safetyRating}</span>
                    </div>

                    {/* Equipment Types */}
                    <div style={{ marginTop: '12px' }}>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '4px'
                      }}>
                        {carrier.equipmentTypes.map((equipment, index) => (
                          <span 
                            key={index}
                            style={{
                              background: 'rgba(255, 255, 255, 0.2)',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {equipment}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '8px', 
                      marginTop: '16px' 
                    }}>
                      <button
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          flex: 1
                        }}
                        onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'translateY(0)'}
                        onClick={() => alert(`Viewing details for ${carrier.legalName}`)}
                      >
                        View Details
                      </button>
                      <button
                        style={{
                          background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          flex: 1
                        }}
                        onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'translateY(0)'}
                        onClick={() => alert(`Managing ${carrier.legalName}`)}
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Factoring Tab */}
        {activeTab === 'factoring' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              color: 'white', 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              🏦 Factoring Company Management
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {factoringCompanies.map((company) => (
                <div 
                  key={company.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <h4 style={{ 
                        color: 'white', 
                        fontSize: '1.2rem', 
                        fontWeight: 'bold', 
                        margin: '0 0 4px 0' 
                      }}>
                        {company.companyName}
                      </h4>
                      <p style={{ 
                        color: 'rgba(255, 255, 255, 0.7)', 
                        fontSize: '0.9rem', 
                        margin: '0 0 8px 0' 
                      }}>
                        Contact: {company.contactName}
                      </p>
                    </div>
                    <div style={{
                      background: company.isActive ? '#10b981' : '#ef4444',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {company.isActive ? '✅ Active' : '❌ Inactive'}
                    </div>
                  </div>

                  <div style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.9rem',
                    lineHeight: '1.4',
                    marginBottom: '16px'
                  }}>
                    <p style={{ margin: '0 0 4px 0' }}>📞 {company.phone}</p>
                    <p style={{ margin: '0 0 4px 0' }}>✉️ {company.email}</p>
                    <p style={{ margin: '0 0 4px 0' }}>🌐 {company.website}</p>
                    <p style={{ margin: '0 0 4px 0' }}>📍 {company.address}</p>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    gap: '8px' 
                  }}>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        flex: 1
                      }}
                      onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'translateY(-2px)'}
                      onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'translateY(0)'}
                      onClick={() => alert(`Editing ${company.companyName}`)}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        flex: 1
                      }}
                      onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'translateY(-2px)'}
                      onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'translateY(0)'}
                      onClick={() => alert(`Viewing details for ${company.companyName}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px'
            }}>
              <div>
                <h3 style={{ 
                  color: 'white', 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  marginBottom: '8px' 
                }}>
                  📄 Document Management Center
                </h3>
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  fontSize: '1rem',
                  margin: 0 
                }}>
                  Centralized document review, approval, and management system
                </p>
              </div>
              <div style={{
                display: 'flex',
                gap: '12px'
              }}>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'translateY(0)'}
                  onClick={() => alert('📤 Document upload functionality would open here')}
                >
                  📤 Upload Document
                </button>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'translateY(0)'}
                  onClick={() => alert('📊 Document analytics would open here')}
                >
                  📊 Analytics
                </button>
              </div>
            </div>

            {/* Document Statistics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              marginBottom: '32px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📁</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>247</div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>Total Documents</div>
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⏳</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>23</div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>Pending Review</div>
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>201</div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>Approved</div>
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>❌</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>23</div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>Rejected</div>
              </div>
            </div>

            {/* Document Categories */}
            <div style={{
              marginBottom: '32px'
            }}>
              <h4 style={{
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '16px'
              }}>
                📂 Document Categories
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px'
              }}>
                {[
                  { name: 'Insurance Documents', count: 45, icon: '🛡️', color: '#3b82f6' },
                  { name: 'Tax Forms', count: 38, icon: '📋', color: '#10b981' },
                  { name: 'Operating Authority', count: 32, icon: '📜', color: '#f59e0b' },
                  { name: 'Driver Licenses', count: 67, icon: '🆔', color: '#8b5cf6' },
                  { name: 'Equipment Photos', count: 54, icon: '📸', color: '#ef4444' },
                  { name: 'Maintenance Records', count: 11, icon: '🔧', color: '#059669' }
                ].map((category, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.15)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    }}
                    onClick={() => alert(`📂 Opening ${category.name} category with ${category.count} documents`)}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: category.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2rem'
                        }}>
                          {category.icon}
                        </div>
                        <div>
                          <div style={{
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: 'bold'
                          }}>
                            {category.name}
                          </div>
                          <div style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.8rem'
                          }}>
                            {category.count} documents
                          </div>
                        </div>
                      </div>
                      <div style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '1.2rem'
                      }}>
                        →
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Documents */}
            <div style={{
              marginBottom: '32px'
            }}>
              <h4 style={{
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '16px'
              }}>
                📋 Recent Documents
              </h4>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden'
              }}>
                {[
                  { 
                    name: 'Certificate of Insurance - Prime Logistics LLC', 
                    type: 'Insurance', 
                    status: 'Approved', 
                    date: '2024-12-20', 
                    size: '2.4 MB',
                    statusColor: '#10b981'
                  },
                  { 
                    name: 'W9 Tax Form - Swift Cargo Solutions', 
                    type: 'Tax', 
                    status: 'Pending Review', 
                    date: '2024-12-19', 
                    size: '1.8 MB',
                    statusColor: '#f59e0b'
                  },
                  { 
                    name: 'MC Authority Letter - Express Freight Lines', 
                    type: 'Authority', 
                    status: 'Approved', 
                    date: '2024-12-18', 
                    size: '1.2 MB',
                    statusColor: '#10b981'
                  },
                  { 
                    name: 'Driver License - John Smith', 
                    type: 'License', 
                    status: 'Rejected', 
                    date: '2024-12-17', 
                    size: '3.1 MB',
                    statusColor: '#ef4444'
                  },
                  { 
                    name: 'Equipment Photo - Truck #4567', 
                    type: 'Equipment', 
                    status: 'Approved', 
                    date: '2024-12-16', 
                    size: '5.7 MB',
                    statusColor: '#10b981'
                  }
                ].map((doc, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderBottom: index < 4 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                    onClick={() => alert(`📄 Opening document: ${doc.name}`)}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem'
                      }}>
                        📄
                      </div>
                      <div>
                        <div style={{
                          color: 'white',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          marginBottom: '4px'
                        }}>
                          {doc.name}
                        </div>
                        <div style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem'
                        }}>
                          {doc.type} • {doc.date} • {doc.size}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                      <div style={{
                        background: doc.statusColor,
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {doc.status}
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '8px'
                      }}>
                        <button
                          style={{
                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'translateY(-2px)'}
                          onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'translateY(0)'}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`📥 Downloading: ${doc.name}`);
                          }}
                        >
                          📥 Download
                        </button>
                        <button
                          style={{
                            background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'translateY(-2px)'}
                          onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'translateY(0)'}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`👁️ Viewing: ${doc.name}`);
                          }}
                        >
                          👁️ View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}