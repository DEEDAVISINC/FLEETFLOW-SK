'use client';

import React, { useState } from 'react';
import { checkPermission, getCurrentUser } from '../../config/access';

// Access Control Component
const AccessRestricted = () => (
  <div style={{
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
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
        color: 'rgba(255, 255, 255, 0.9)', 
        marginBottom: '16px',
        lineHeight: '1.6'
      }}>
        You need carrier onboarding permissions to access this system.
      </p>
      <button 
        onClick={() => window.history.back()}
        style={{
          background: 'linear-gradient(135deg, #059669, #047857)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
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
  advancePercentage: number;
  factorRate: number;
  services: string[];
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
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseOver={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
    onMouseOut={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>
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
        background: 'rgba(255, 255, 255, 0.2)',
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
      <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', marginTop: '8px' }}>
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
      dotNumber: '4567890',
      mcNumber: 'MC-765432',
      legalName: 'Mountain View Transport',
      physicalAddress: '789 Highway Blvd, Denver, CO 80202',
      phone: '(555) 456-7890',
      email: 'contact@mountainview.com',
      onboardingStatus: 'pending',
      safetyRating: 'Satisfactory',
      equipmentTypes: ['Dry Van'],
      documentsComplete: false,
      agreementsSigned: false,
      portalSetup: false,
      dateStarted: '2024-12-22'
    }
  ];

  // Mock data - Factoring Companies
  const factoringCompanies: FactoringCompany[] = [
    {
      id: 'factor-001',
      companyName: 'TBS Factoring Service',
      contactName: 'Sarah Johnson',
      phone: '(800) 207-7661',
      email: 'verification@tbsfactoring.com',
      advancePercentage: 90,
      factorRate: 3.5,
      services: ['Fuel Cards', 'Load Board Access', 'Credit Checks']
    },
    {
      id: 'factor-002',
      companyName: 'Apex Capital Corp',
      contactName: 'Mike Rodriguez',
      phone: '(800) 262-APEX',
      email: 'noa@apexcapitalcorp.com',
      advancePercentage: 95,
      factorRate: 2.8,
      services: ['Same Day Funding', 'Fuel Cards', 'Collections']
    },
    {
      id: 'factor-003',
      companyName: 'eCapital Commercial Finance',
      contactName: 'Lisa Chen',
      phone: '(800) 738-3003',
      email: 'operations@ecapital.com',
      advancePercentage: 92,
      factorRate: 3.2,
      services: ['Technology Platform', 'Fuel Cards', 'Credit Protection']
    }
  ];

  const totalCarriers = carriers.length;
  const completedCarriers = carriers.filter(c => c.onboardingStatus === 'completed').length;
  const inProgressCarriers = carriers.filter(c => c.onboardingStatus === 'in_progress').length;
  const pendingCarriers = carriers.filter(c => c.onboardingStatus === 'pending').length;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
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
            display: 'inline-block',
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}>
            👤 {user.name} • {user.role}
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
            {/* Progress Overview */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }}>
              <ProgressCard 
                title="Total Carriers"
                completed={completedCarriers}
                total={totalCarriers}
                icon="🚛"
                color="#10b981"
              />
              <ProgressCard 
                title="In Progress"
                completed={inProgressCarriers}
                total={totalCarriers}
                icon="🔄"
                color="#f59e0b"
              />
              <ProgressCard 
                title="Pending Review"
                completed={pendingCarriers}
                total={totalCarriers}
                icon="⏳"
                color="#6b7280"
              />
              <ProgressCard 
                title="Factor Companies"
                completed={factoringCompanies.length}
                total={factoringCompanies.length}
                icon="🏦"
                color="#3b82f6"
              />
            </div>

            {/* Quick Actions */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '24px',
                textAlign: 'center'
              }}>🚀 Quick Actions</h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px'
              }}>
                {[
                  { 
                    label: '➕ Start New Onboarding', 
                    color: '#10b981', 
                    desc: 'Begin comprehensive carrier verification workflow',
                    href: '/onboarding/carrier-onboarding/new'
                  },
                  { label: '📊 FMCSA Lookup', color: '#3b82f6', desc: 'Verify DOT information' },
                  { label: '🏦 Add Factor Company', color: '#8b5cf6', desc: 'Register new factoring partner' },
                  { label: '📄 Bulk Document Review', color: '#f59e0b', desc: 'Review pending documents' },
                  { label: '📝 Generate Agreements', color: '#ef4444', desc: 'Create carrier contracts' },
                  { label: '👤 Setup Driver Portal', color: '#059669', desc: 'Configure portal access' }
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (action.href) {
                        window.location.href = action.href;
                      }
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '0.9rem',
                      textAlign: 'left'
                    }}
                    onMouseOver={(e) => {
                      (e.target as HTMLElement).style.background = action.color;
                      (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.2)';
                      (e.target as HTMLElement).style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ fontSize: '1rem', marginBottom: '4px' }}>{action.label}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{action.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Carriers Tab */}
        {activeTab === 'carriers' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '20px'
          }}>
            {carriers.map((carrier) => (
              <CarrierCard key={carrier.id} carrier={carrier} />
            ))}
          </div>
        )}

        {/* Factoring Tab */}
        {activeTab === 'factoring' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                🏦 Factoring Companies
              </h3>
              <button style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                + Add Factor Company
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {factoringCompanies.map((company) => (
                <div key={company.id} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <h4 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '12px' }}>
                    {company.companyName}
                  </h4>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', marginBottom: '12px' }}>
                    <div>📞 {company.phone}</div>
                    <div>✉️ {company.email}</div>
                    <div>👤 {company.contactName}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                    <div style={{ color: 'white', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>
                        {company.advancePercentage}%
                      </div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Advance</div>
                    </div>
                    <div style={{ color: 'white', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                        {company.factorRate}%
                      </div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Rate</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Services: {company.services.join(', ')}
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
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>
              📄 Document Management Center
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '24px' }}>
              Centralized document review and management system
            </p>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '40px',
              fontSize: '4rem'
            }}>
              🚧
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '16px' }}>
              Document management system coming soon...
            </p>
          </div>
        )}

      </main>
    </div>
  );
}
