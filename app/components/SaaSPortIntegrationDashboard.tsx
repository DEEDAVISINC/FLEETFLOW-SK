'use client';

import { useEffect, useState } from 'react';

interface PlatformRequirement {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  timeline: string;
  cost: string;
  category: 'business' | 'technical' | 'compliance' | 'partnerships';
  nextAction: string;
}

interface PortPartnership {
  code: string;
  name: string;
  priority: number;
  status: 'not_started' | 'negotiating' | 'testing' | 'live';
  monthlyRevenue: string;
  tenantCount: number;
  apiCallsPerMonth: number;
}

export default function SaaSPortIntegrationDashboard() {
  const [platformRequirements, setPlatformRequirements] = useState<
    PlatformRequirement[]
  >([
    {
      id: 'business_entity',
      title: 'Business Entity Setup',
      description: 'Delaware C-Corp or California LLC for software platform',
      status: 'pending',
      priority: 'urgent',
      timeline: '1-2 weeks',
      cost: '$2,000-$5,000',
      category: 'business',
      nextAction: 'File Delaware C-Corp incorporation documents',
    },
    {
      id: 'professional_insurance',
      title: 'Professional Liability Insurance',
      description: '$5M+ coverage for software platform operations',
      status: 'pending',
      priority: 'urgent',
      timeline: '1-2 weeks',
      cost: '$15,000-$25,000/year',
      category: 'business',
      nextAction: 'Contact tech insurance brokers for quotes',
    },
    {
      id: 'soc2_compliance',
      title: 'SOC 2 Type II Certification',
      description: 'Required for enterprise customers and port partnerships',
      status: 'pending',
      priority: 'high',
      timeline: '6 months',
      cost: '$50,000-$100,000',
      category: 'compliance',
      nextAction: 'Engage SOC 2 auditing firm (Deloitte, PwC, EY)',
    },
    {
      id: 'api_platform',
      title: 'Multi-Tenant API Platform',
      description: 'Core platform for port authority API aggregation',
      status: 'in_progress',
      priority: 'urgent',
      timeline: '4-6 weeks',
      cost: '$25,000-$50,000',
      category: 'technical',
      nextAction: 'Complete tenant credential validation system',
    },
    {
      id: 'cloud_infrastructure',
      title: 'Enterprise Cloud Infrastructure',
      description: 'AWS/Azure setup with high availability and security',
      status: 'pending',
      priority: 'high',
      timeline: '2-3 weeks',
      cost: '$5,000-$15,000/month',
      category: 'technical',
      nextAction: 'Design multi-tenant architecture on AWS',
    },
  ]);

  const [portPartnerships, setPortPartnerships] = useState<PortPartnership[]>([
    {
      code: 'USLAX',
      name: 'Port of Los Angeles',
      priority: 1,
      status: 'not_started',
      monthlyRevenue: '$75K-$150K',
      tenantCount: 0,
      apiCallsPerMonth: 0,
    },
    {
      code: 'USNYK',
      name: 'Port of NY/NJ',
      priority: 2,
      status: 'not_started',
      monthlyRevenue: '$60K-$125K',
      tenantCount: 0,
      apiCallsPerMonth: 0,
    },
    {
      code: 'USSAV',
      name: 'Port of Savannah',
      priority: 3,
      status: 'not_started',
      monthlyRevenue: '$40K-$90K',
      tenantCount: 0,
      apiCallsPerMonth: 0,
    },
    {
      code: 'USLGB',
      name: 'Port of Long Beach',
      priority: 4,
      status: 'not_started',
      monthlyRevenue: '$50K-$100K',
      tenantCount: 0,
      apiCallsPerMonth: 0,
    },
    {
      code: 'USSEA',
      name: 'Port of Seattle',
      priority: 5,
      status: 'not_started',
      monthlyRevenue: '$30K-$60K',
      tenantCount: 0,
      apiCallsPerMonth: 0,
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [estimatedCompletion, setEstimatedCompletion] = useState('');
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [projectedRevenue, setProjectedRevenue] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'live':
        return '#10b981';
      case 'in_progress':
      case 'testing':
        return '#f59e0b';
      case 'blocked':
        return '#ef4444';
      case 'negotiating':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#dc2626';
      case 'high':
        return '#ea580c';
      case 'medium':
        return '#ca8a04';
      default:
        return '#65a30d';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business':
        return '#3b82f6';
      case 'technical':
        return '#10b981';
      case 'compliance':
        return '#f59e0b';
      case 'partnerships':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const updateRequirementStatus = (
    reqId: string,
    newStatus: 'pending' | 'in_progress' | 'completed' | 'blocked'
  ) => {
    setPlatformRequirements((prev) =>
      prev.map((req) =>
        req.id === reqId ? { ...req, status: newStatus } : req
      )
    );
  };

  const filteredRequirements =
    selectedCategory === 'all'
      ? platformRequirements
      : platformRequirements.filter((req) => req.category === selectedCategory);

  const completedRequirements = platformRequirements.filter(
    (req) => req.status === 'completed'
  ).length;
  const totalRequirements = platformRequirements.length;
  const progressPercentage = (completedRequirements / totalRequirements) * 100;

  const livePartnerships = portPartnerships.filter(
    (port) => port.status === 'live'
  ).length;
  const totalPartnerships = portPartnerships.length;

  useEffect(() => {
    // Calculate investment and revenue projections
    let investment = 100000; // Base platform development
    let monthlyRevenue = 0;

    portPartnerships.forEach((port) => {
      if (port.status === 'live') {
        const avgRevenue = parseInt(
          port.monthlyRevenue.split('-')[0].replace(/[^0-9]/g, '')
        );
        monthlyRevenue += avgRevenue;
      }
    });

    setTotalInvestment(investment);
    setProjectedRevenue(monthlyRevenue * 12);

    // Calculate estimated completion
    const urgentIncomplete = platformRequirements.filter(
      (req) => req.priority === 'urgent' && req.status !== 'completed'
    ).length;
    const highIncomplete = platformRequirements.filter(
      (req) => req.priority === 'high' && req.status !== 'completed'
    ).length;

    let weeks = 0;
    if (urgentIncomplete > 0) weeks += 6;
    if (highIncomplete > 0) weeks += 12;

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + weeks * 7);
    setEstimatedCompletion(targetDate.toLocaleDateString());
  }, [platformRequirements, portPartnerships]);

  return (
    <div
      style={{
        padding: '32px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        minHeight: '100vh',
        color: 'white',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          🚀 FleetFlow SaaS Port Integration Platform
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}>
          Multi-tenant software platform connecting trucking companies to port
          authorities
        </p>
      </div>

      {/* Key Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.2)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          }}
        >
          <div
            style={{ fontSize: '14px', color: '#60a5fa', marginBottom: '8px' }}
          >
            Platform Progress
          </div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}
          >
            {completedRequirements}/{totalRequirements}
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercentage}%`,
                height: '100%',
                background: '#3b82f6',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        <div
          style={{
            background: 'rgba(139, 92, 246, 0.2)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid rgba(139, 92, 246, 0.3)',
          }}
        >
          <div
            style={{ fontSize: '14px', color: '#a78bfa', marginBottom: '8px' }}
          >
            Port Partnerships
          </div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}
          >
            {livePartnerships}/{totalPartnerships}
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Live integrations
          </div>
        </div>

        <div
          style={{
            background: 'rgba(16, 185, 129, 0.2)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}
        >
          <div
            style={{ fontSize: '14px', color: '#34d399', marginBottom: '8px' }}
          >
            Projected Revenue
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}
          >
            ${projectedRevenue.toLocaleString()}/year
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
            From port integrations
          </div>
        </div>

        <div
          style={{
            background: 'rgba(245, 158, 11, 0.2)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
          }}
        >
          <div
            style={{ fontSize: '14px', color: '#fbbf24', marginBottom: '8px' }}
          >
            Platform Investment
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}
          >
            ${totalInvestment.toLocaleString()}
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Development + compliance
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {['all', 'business', 'technical', 'compliance', 'partnerships'].map(
            (category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  background:
                    selectedCategory === category
                      ? getCategoryColor(category)
                      : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s ease',
                }}
              >
                {category === 'all' ? 'All Requirements' : category}
              </button>
            )
          )}
        </div>
      </div>

      {/* Platform Requirements */}
      <div style={{ marginBottom: '32px' }}>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: 'white',
          }}
        >
          📋 Platform Requirements
        </h2>

        <div style={{ display: 'grid', gap: '16px' }}>
          {filteredRequirements.map((req) => (
            <div
              key={req.id}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              {/* Status Indicator */}
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: getStatusColor(req.status),
                  flexShrink: 0,
                }}
              />

              {/* Requirement Info */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px',
                  }}
                >
                  <h3
                    style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}
                  >
                    {req.title}
                  </h3>
                  <span
                    style={{
                      background: `${getPriorityColor(req.priority)}20`,
                      color: getPriorityColor(req.priority),
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                    }}
                  >
                    {req.priority}
                  </span>
                  <span
                    style={{
                      background: `${getCategoryColor(req.category)}20`,
                      color: getCategoryColor(req.category),
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      textTransform: 'capitalize',
                    }}
                  >
                    {req.category}
                  </span>
                </div>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: '0 0 12px 0',
                  }}
                >
                  {req.description}
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    fontSize: '14px',
                  }}
                >
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Timeline:{' '}
                    </span>
                    <span style={{ color: 'white' }}>{req.timeline}</span>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Cost:{' '}
                    </span>
                    <span style={{ color: 'white' }}>{req.cost}</span>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                  }}
                >
                  <strong style={{ color: '#60a5fa' }}>Next Action: </strong>
                  <span style={{ color: 'white' }}>{req.nextAction}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}
              >
                {req.status !== 'completed' && (
                  <button
                    onClick={() =>
                      updateRequirementStatus(
                        req.id,
                        req.status === 'in_progress'
                          ? 'completed'
                          : 'in_progress'
                      )
                    }
                    style={{
                      background:
                        req.status === 'in_progress' ? '#10b981' : '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {req.status === 'in_progress'
                      ? 'Mark Complete'
                      : 'Start Task'}
                  </button>
                )}
                {req.status === 'completed' && (
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34d399',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      textAlign: 'center',
                    }}
                  >
                    ✅ Completed
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Port Partnerships */}
      <div>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: 'white',
          }}
        >
          🏗️ Port Authority Partnerships
        </h2>

        <div style={{ display: 'grid', gap: '12px' }}>
          {portPartnerships.map((port) => (
            <div
              key={port.code}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: getStatusColor(port.status),
                    }}
                  />
                  <span
                    style={{
                      background:
                        port.priority <= 2
                          ? 'rgba(220, 38, 38, 0.2)'
                          : port.priority <= 4
                            ? 'rgba(245, 158, 11, 0.2)'
                            : 'rgba(34, 197, 94, 0.2)',
                      color:
                        port.priority <= 2
                          ? '#fca5a5'
                          : port.priority <= 4
                            ? '#fbbf24'
                            : '#4ade80',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    Priority {port.priority}
                  </span>
                  <h3
                    style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}
                  >
                    {port.name}
                  </h3>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '16px',
                    fontSize: '14px',
                  }}
                >
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Status:{' '}
                    </span>
                    <span
                      style={{ color: 'white', textTransform: 'capitalize' }}
                    >
                      {port.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Revenue:{' '}
                    </span>
                    <span style={{ color: 'white' }}>
                      {port.monthlyRevenue}/month
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Tenants:{' '}
                    </span>
                    <span style={{ color: 'white' }}>{port.tenantCount}</span>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      API Calls:{' '}
                    </span>
                    <span style={{ color: 'white' }}>
                      {port.apiCallsPerMonth.toLocaleString()}/month
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '24px' }}>
                {port.priority === 1
                  ? '🥇'
                  : port.priority === 2
                    ? '🥈'
                    : port.priority <= 4
                      ? '🥉'
                      : '⭐'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
