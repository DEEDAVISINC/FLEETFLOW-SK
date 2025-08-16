'use client';

// CRITICAL: Do NOT remove React import - required for JSX compilation
import { useState } from 'react';

// Sample business entity data
const mockUsers = [
  {
    id: 'FM-MGR-2023005',
    name: 'Frank Miller',
    email: 'frank.miller@fleetflow.com',
    department: 'Management',
    departmentCode: 'MGR',
    status: 'active',
  },
  {
    id: 'DD-FBB-2024092', // User identifier (person)
    name: 'Dee Davis',
    email: 'operations@samplefreight.com',
    department: 'Freight Brokerage',
    departmentCode: 'FBB',
    status: 'active',
    userType: 'business_entity',

    // Business entity information
    businessInfo: {
      companyId: 'FBB-987654', // Company identifier
      companyName: 'Sample Freight Brokerage LLC',
      businessAddress: '123 Business Park Dr, Atlanta, GA 30309',
      mcNumber: 'MC-987654',
      dotNumber: 'DOT-456789',
      businessPhone: '(555) 123-4567',
      businessEmail: 'operations@samplefreight.com',
      territories: ['Southeast', 'Midwest', 'Texas'],
      specializations: ['Dry Van', 'Refrigerated', 'Flatbed'],
      incorporationDate: '2024-03-15',
      taxId: 'EIN-12-3456789',
    },
  },
  {
    id: 'JL-BB-2024125',
    name: 'Jennifer Lopez',
    email: 'jennifer.lopez@samplefreight.com',
    department: 'Brokerage',
    departmentCode: 'BB',
    status: 'active',
    userType: 'individual',
    parentCompanyId: 'DD-FBB-2024092', // Linked to Sample Freight Brokerage
  },
];

export default function UserManagementBusiness() {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const currentUser = mockUsers[currentUserIndex];

  const nextUser = () => {
    setCurrentUserIndex((prev) => (prev + 1) % mockUsers.length);
  };

  const prevUser = () => {
    setCurrentUserIndex(
      (prev) => (prev - 1 + mockUsers.length) % mockUsers.length
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        padding: '60px 16px 16px 16px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1
            style={{
              color: 'white',
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '16px',
            }}
          >
            🏢 User Management Portal
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
            Business Entity & Individual User Management System
          </p>
        </div>

        {/* User Navigation */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            onClick={prevUser}
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#60a5fa',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            ← Previous User
          </button>

          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'white', margin: '0', fontSize: '24px' }}>
              {currentUser.name}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', margin: '4px 0 0 0' }}>
              {currentUser.id} • {currentUser.department}
            </p>
          </div>

          <button
            onClick={nextUser}
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#60a5fa',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Next User →
          </button>
        </div>

        {/* User Details */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '12px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Account Details Header */}
          <h3
            style={{
              color: 'white',
              marginBottom: '20px',
              fontSize: '20px',
            }}
          >
            {currentUser.departmentCode === 'FBB'
              ? '🏢 Owner Details (BUSINESS ENTITY)'
              : '👤 Account Details'}
          </h3>

          {/* Basic User Info */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '30px',
            }}
          >
            <div>
              <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Name:</strong>
              <p style={{ color: 'white', margin: '4px 0' }}>
                {currentUser.name}
              </p>
            </div>
            <div>
              <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Email:</strong>
              <p style={{ color: 'white', margin: '4px 0' }}>
                {currentUser.email}
              </p>
            </div>
            <div>
              <strong style={{ color: 'rgba(255,255,255,0.8)' }}>
                Department:
              </strong>
              <p style={{ color: 'white', margin: '4px 0' }}>
                {currentUser.department}
              </p>
            </div>
            <div>
              <strong style={{ color: 'rgba(255,255,255,0.8)' }}>
                Status:
              </strong>
              <span
                style={{
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.2)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              >
                {currentUser.status}
              </span>
            </div>
          </div>

          {/* Business Entity Information - Only for FBB users */}
          {currentUser.departmentCode === 'FBB' && currentUser.businessInfo && (
            <>
              {/* Company Information */}
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <h4
                  style={{
                    color: 'white',
                    marginBottom: '16px',
                    fontSize: '18px',
                  }}
                >
                  🏢 Company Information
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                  }}
                >
                  <div>
                    <strong style={{ color: 'rgba(255,255,255,0.8)' }}>
                      Company Name:
                    </strong>
                    <p style={{ color: 'white', margin: '4px 0' }}>
                      {currentUser.businessInfo.companyName}
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: 'rgba(255,255,255,0.8)' }}>
                      Company ID:
                    </strong>
                    <p style={{ color: '#f59e0b', margin: '4px 0' }}>
                      {currentUser.businessInfo.companyId}
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: 'rgba(255,255,255,0.8)' }}>
                      MC Number:
                    </strong>
                    <p style={{ color: '#10b981', margin: '4px 0' }}>
                      {currentUser.businessInfo.mcNumber}
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: 'rgba(255,255,255,0.8)' }}>
                      DOT Number:
                    </strong>
                    <p style={{ color: '#3b82f6', margin: '4px 0' }}>
                      {currentUser.businessInfo.dotNumber}
                    </p>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong style={{ color: 'rgba(255,255,255,0.8)' }}>
                      Business Address:
                    </strong>
                    <p style={{ color: 'white', margin: '4px 0' }}>
                      {currentUser.businessInfo.businessAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Operations */}
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <h4
                  style={{
                    color: 'white',
                    marginBottom: '16px',
                    fontSize: '18px',
                  }}
                >
                  🎯 Business Operations
                </h4>
                <div style={{ marginBottom: '16px' }}>
                  <strong style={{ color: 'rgba(255,255,255,0.8)' }}>
                    Service Territories:
                  </strong>
                  <div
                    style={{ display: 'flex', gap: '8px', marginTop: '8px' }}
                  >
                    {currentUser.businessInfo.territories.map(
                      (territory, index) => (
                        <span
                          key={index}
                          style={{
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: '#60a5fa',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                          }}
                        >
                          {territory}
                        </span>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <strong style={{ color: 'rgba(255,255,255,0.8)' }}>
                    Specializations:
                  </strong>
                  <div
                    style={{ display: 'flex', gap: '8px', marginTop: '8px' }}
                  >
                    {currentUser.businessInfo.specializations.map(
                      (spec, index) => (
                        <span
                          key={index}
                          style={{
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#34d399',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                          }}
                        >
                          {spec}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Agent Management */}
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <h4
                  style={{
                    color: 'white',
                    marginBottom: '16px',
                    fontSize: '18px',
                  }}
                >
                  👥 Agent Management
                </h4>
                <div>
                  <strong style={{ color: 'rgba(255,255,255,0.8)' }}>
                    Broker Agents Under This Company:
                  </strong>
                  <div style={{ marginTop: '8px' }}>
                    {(() => {
                      const childAgents = mockUsers.filter(
                        (user) =>
                          user.departmentCode === 'BB' &&
                          user.parentCompanyId === currentUser.id
                      );

                      if (childAgents.length === 0) {
                        return (
                          <p
                            style={{
                              color: 'rgba(255,255,255,0.6)',
                              fontStyle: 'italic',
                            }}
                          >
                            No broker agents assigned yet
                          </p>
                        );
                      }

                      return childAgents.map((agent, index) => (
                        <div
                          key={index}
                          style={{
                            background: 'rgba(249, 115, 22, 0.2)',
                            color: '#fb923c',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            marginBottom: '8px',
                            display: 'inline-block',
                            marginRight: '8px',
                          }}
                        >
                          👤 {agent.name} ({agent.id})
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Parent Company Info for BB agents */}
          {currentUser.departmentCode === 'BB' &&
            currentUser.parentCompanyId && (
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <h4
                  style={{
                    color: 'white',
                    marginBottom: '16px',
                    fontSize: '18px',
                  }}
                >
                  🏢 Parent Brokerage Company
                </h4>
                {(() => {
                  const parentCompany = mockUsers.find(
                    (user) => user.id === currentUser.parentCompanyId
                  );
                  if (parentCompany && parentCompany.businessInfo) {
                    return (
                      <div>
                        <p style={{ color: 'white', margin: '4px 0' }}>
                          <strong style={{ color: 'rgba(255,255,255,0.8)' }}>
                            Company:
                          </strong>{' '}
                          {parentCompany.businessInfo.companyName}
                        </p>
                        <p style={{ color: 'white', margin: '4px 0' }}>
                          <strong style={{ color: 'rgba(255,255,255,0.8)' }}>
                            Owner:
                          </strong>{' '}
                          {parentCompany.name}
                        </p>
                        <p style={{ color: 'white', margin: '4px 0' }}>
                          <strong style={{ color: 'rgba(255,255,255,0.8)' }}>
                            Company ID:
                          </strong>{' '}
                          {parentCompany.businessInfo.companyId}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                      Parent company information not found
                    </p>
                  );
                })()}
              </div>
            )}
        </div>

        {/* Status Footer */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '40px',
            padding: '20px',
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}
        >
          <p
            style={{
              color: '#34d399',
              margin: '0',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            ✅ Business Entity Management System Active
          </p>
          <p
            style={{
              color: 'rgba(255,255,255,0.8)',
              margin: '4px 0 0 0',
              fontSize: '14px',
            }}
          >
            Company information positioned before onboarding • Hierarchy system
            operational
          </p>
        </div>
      </div>
    </div>
  );
}
