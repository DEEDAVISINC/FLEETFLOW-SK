'use client';

import { useState, useEffect } from 'react';

interface RegistrationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  timeline: string;
  cost: string;
  contact?: string;
  nextAction: string;
}

export default function PortRegistrationDashboard() {
  const [registrationSteps, setRegistrationSteps] = useState<RegistrationStep[]>([
    {
      id: 'dot_number',
      title: 'DOT Number Registration',
      description: 'Federal DOT number required for all port access',
      status: 'pending',
      priority: 'urgent',
      timeline: '3-5 business days',
      cost: 'FREE',
      contact: 'https://www.fmcsa.dot.gov/registration',
      nextAction: 'Complete Form MCSA-1 online application'
    },
    {
      id: 'commercial_insurance',
      title: 'Commercial Insurance ($2M+)',
      description: 'Comprehensive commercial coverage required',
      status: 'pending',
      priority: 'urgent',
      timeline: '1-2 weeks',
      cost: '$8,000-$15,000/year',
      contact: 'CRC Insurance: (800) 229-2712',
      nextAction: 'Get quotes from 3 specialized brokers'
    },
    {
      id: 'mc_number',
      title: 'MC Number Application',
      description: 'Motor Carrier authority for freight brokerage',
      status: 'pending',
      priority: 'high',
      timeline: '10-15 business days',
      cost: '$300 + $75,000 bond',
      contact: 'FMCSA OP-1 Application',
      nextAction: 'Submit OP-1 form with surety bond'
    },
    {
      id: 'scac_code',
      title: 'SCAC Code Registration',
      description: 'Standard Carrier Alpha Code',
      status: 'pending',
      priority: 'high',
      timeline: '2-3 business days',
      cost: '$75/year',
      contact: 'https://www.nmfta.org/scac/',
      nextAction: 'Choose 4-letter code and submit application'
    },
    {
      id: 'twic_cards',
      title: 'TWIC Card Applications',
      description: 'Transportation Worker ID for port access',
      status: 'pending',
      priority: 'high',
      timeline: '6-8 weeks',
      cost: '$125.25 per person',
      contact: 'https://universalenroll.dhs.gov/',
      nextAction: 'Schedule appointments for key personnel'
    }
  ]);

  const [selectedPort, setSelectedPort] = useState('USLAX');
  const [estimatedCompletion, setEstimatedCompletion] = useState('');

  const ports = [
    { code: 'USLAX', name: 'Port of Los Angeles', priority: 1, revenue: '$150K-$300K' },
    { code: 'USNYK', name: 'Port of NY/NJ', priority: 2, revenue: '$120K-$250K' },
    { code: 'USSAV', name: 'Port of Savannah', priority: 3, revenue: '$80K-$180K' },
    { code: 'USLGB', name: 'Port of Long Beach', priority: 4, revenue: '$100K-$200K' },
    { code: 'USSEA', name: 'Port of Seattle', priority: 5, revenue: '$60K-$120K' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#f59e0b';
      case 'blocked': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#ca8a04';
      default: return '#65a30d';
    }
  };

  const updateStepStatus = (stepId: string, newStatus: 'pending' | 'in_progress' | 'completed' | 'blocked') => {
    setRegistrationSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, status: newStatus } : step
      )
    );
  };

  const completedSteps = registrationSteps.filter(step => step.status === 'completed').length;
  const totalSteps = registrationSteps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  useEffect(() => {
    // Calculate estimated completion based on current progress
    const urgentIncomplete = registrationSteps.filter(s => s.priority === 'urgent' && s.status !== 'completed').length;
    const highIncomplete = registrationSteps.filter(s => s.priority === 'high' && s.status !== 'completed').length;
    
    let weeks = 0;
    if (urgentIncomplete > 0) weeks += 2;
    if (highIncomplete > 0) weeks += 3;
    
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + (weeks * 7));
    setEstimatedCompletion(targetDate.toLocaleDateString());
  }, [registrationSteps]);

  return (
    <div style={{
      padding: '32px',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🏗️ Port Authority Registration Dashboard
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}>
          Track your progress toward direct port API access
        </p>
      </div>

      {/* Progress Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'rgba(59, 130, 246, 0.2)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}>
          <div style={{ fontSize: '14px', color: '#60a5fa', marginBottom: '8px' }}>Overall Progress</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
            {completedSteps}/{totalSteps}
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercentage}%`,
              height: '100%',
              background: '#3b82f6',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        <div style={{
          background: 'rgba(16, 185, 129, 0.2)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <div style={{ fontSize: '14px', color: '#34d399', marginBottom: '8px' }}>Estimated Completion</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
            {estimatedCompletion}
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Based on current progress
          </div>
        </div>

        <div style={{
          background: 'rgba(245, 158, 11, 0.2)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid rgba(245, 158, 11, 0.3)'
        }}>
          <div style={{ fontSize: '14px', color: '#fbbf24', marginBottom: '8px' }}>Total Investment</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
            ~$16K
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Setup costs + first year
          </div>
        </div>

        <div style={{
          background: 'rgba(139, 92, 246, 0.2)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid rgba(139, 92, 246, 0.3)'
        }}>
          <div style={{ fontSize: '14px', color: '#a78bfa', marginBottom: '8px' }}>Expected ROI</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
            $575K/year
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
            3,600% annual return
          </div>
        </div>
      </div>

      {/* Registration Steps */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: 'white'
        }}>
          📋 Registration Steps
        </h2>

        <div style={{ display: 'grid', gap: '16px' }}>
          {registrationSteps.map((step) => (
            <div key={step.id} style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
              {/* Status Indicator */}
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: getStatusColor(step.status),
                flexShrink: 0
              }} />

              {/* Step Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                    {step.title}
                  </h3>
                  <span style={{
                    background: `${getPriorityColor(step.priority)}20`,
                    color: getPriorityColor(step.priority),
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    textTransform: 'uppercase'
                  }}>
                    {step.priority}
                  </span>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 12px 0' }}>
                  {step.description}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '14px' }}>
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Timeline: </span>
                    <span style={{ color: 'white' }}>{step.timeline}</span>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Cost: </span>
                    <span style={{ color: 'white' }}>{step.cost}</span>
                  </div>
                  {step.contact && (
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Contact: </span>
                      <span style={{ color: '#60a5fa' }}>{step.contact}</span>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                  <strong style={{ color: '#60a5fa' }}>Next Action: </strong>
                  <span style={{ color: 'white' }}>{step.nextAction}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                {step.status !== 'completed' && (
                  <button
                    onClick={() => updateStepStatus(step.id, step.status === 'in_progress' ? 'completed' : 'in_progress')}
                    style={{
                      background: step.status === 'in_progress' ? '#10b981' : '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {step.status === 'in_progress' ? 'Mark Complete' : 'Start Task'}
                  </button>
                )}
                {step.status === 'completed' && (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#34d399',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    textAlign: 'center'
                  }}>
                    ✅ Completed
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Port Priority List */}
      <div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: 'white'
        }}>
          🎯 Port Priority Strategy
        </h2>

        <div style={{ display: 'grid', gap: '12px' }}>
          {ports.map((port) => (
            <div key={port.code} style={{
              background: selectedPort === port.code ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: selectedPort === port.code ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            onClick={() => setSelectedPort(port.code)}
            onMouseEnter={(e) => {
              if (selectedPort !== port.code) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedPort !== port.code) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }
            }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{
                    background: port.priority <= 2 ? 'rgba(220, 38, 38, 0.2)' : port.priority <= 4 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                    color: port.priority <= 2 ? '#fca5a5' : port.priority <= 4 ? '#fbbf24' : '#4ade80',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    Priority {port.priority}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                    {port.name}
                  </h3>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                  Expected Revenue: {port.revenue} annually
                </p>
              </div>
              <div style={{ fontSize: '24px' }}>
                {port.priority === 1 ? '🥇' : port.priority === 2 ? '🥈' : port.priority <= 4 ? '🥉' : '⭐'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}