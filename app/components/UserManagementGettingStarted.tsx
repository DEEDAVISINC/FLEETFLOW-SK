'use client';

import { useEffect, useState } from 'react';

interface GettingStartedStep {
  id: string;
  icon: string;
  title: string;
  description: string;
  section?: string;
}

interface UserManagementGettingStartedProps {
  onStepClick: (stepId: string, section?: string) => void;
}

export default function UserManagementGettingStarted({
  onStepClick,
}: UserManagementGettingStartedProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Check localStorage on mount
  useEffect(() => {
    const dismissed = localStorage.getItem(
      'user-management-getting-started-dismissed'
    );
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  // Keyboard shortcut for showing guide (Ctrl+Shift+U for User Management)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'U') {
        e.preventDefault();
        setIsDismissed(false);
        setIsExpanded(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const steps: GettingStartedStep[] = [
    {
      id: 'user-search',
      icon: '🔍',
      title: 'User Search & Filtering',
      description:
        'Search and filter users by name, email, department, or role',
      section: 'search',
    },
    {
      id: 'user-profiles',
      icon: '👤',
      title: 'User Profile Management',
      description:
        'View and manage detailed user profiles, contact info, and status',
      section: 'profiles',
    },
    {
      id: 'permissions',
      icon: '🔐',
      title: 'Permission Management',
      description:
        'Configure granular permissions for different system modules and sections',
      section: 'permissions',
    },
    {
      id: 'training',
      icon: '🎓',
      title: 'Training Assignment',
      description:
        'Assign role-based training modules and track completion status',
      section: 'training',
    },
    {
      id: 'onboarding',
      icon: '📋',
      title: 'Contractor Onboarding',
      description: 'Manage contractor onboarding workflow and document signing',
      section: 'onboarding',
    },
    {
      id: 'compliance',
      icon: '✅',
      title: 'Compliance & Security',
      description: 'Monitor user compliance status and security clearances',
      section: 'compliance',
    },
  ];

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('user-management-getting-started-dismissed', 'true');
  };

  const handleShowAgain = () => {
    setIsDismissed(false);
    setIsExpanded(true);
    localStorage.removeItem('user-management-getting-started-dismissed');
  };

  const handleStepClick = (step: GettingStartedStep) => {
    setCurrentStep(steps.findIndex((s) => s.id === step.id));
    onStepClick(step.id, step.section);
  };

  if (isDismissed) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '100px',
          right: '20px',
          zIndex: 1000,
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '12px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
          fontSize: '0.9rem',
          fontWeight: '600',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.2s ease',
        }}
        onClick={handleShowAgain}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow =
            '0 6px 25px rgba(16, 185, 129, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow =
            '0 4px 20px rgba(16, 185, 129, 0.4)';
        }}
      >
        👥 User Management Guide
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '100px',
        right: isExpanded ? '20px' : '20px',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        width: isExpanded ? '380px' : '60px',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          padding: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: isExpanded ? '16px 16px 0 0' : '16px',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>👥</span>
          {isExpanded && (
            <div>
              <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                User Management Guide
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                6 Steps to Success
              </div>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.8rem',
              }}
            >
              ✕
            </button>
          )}
          <span
            style={{
              fontSize: '0.8rem',
              transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            ▼
          </span>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div style={{ padding: '16px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div
              style={{
                fontSize: '0.9rem',
                color: '#666',
                marginBottom: '12px',
              }}
            >
              Master user management with these essential steps:
            </div>

            {/* Steps */}
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  onClick={() => handleStepClick(step)}
                  style={{
                    background:
                      currentStep === index
                        ? 'linear-gradient(135deg, #10b98122, #05966922)'
                        : 'rgba(0, 0, 0, 0.02)',
                    border:
                      currentStep === index
                        ? '2px solid #10b981'
                        : '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                  onMouseEnter={(e) => {
                    if (currentStep !== index) {
                      e.currentTarget.style.background =
                        'rgba(16, 185, 129, 0.1)';
                      e.currentTarget.style.borderColor =
                        'rgba(16, 185, 129, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentStep !== index) {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                    }
                  }}
                >
                  <div style={{ fontSize: '1.2rem' }}>{step.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#333',
                      }}
                    >
                      {step.title}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#666',
                        lineHeight: '1.3',
                      }}
                    >
                      {step.description}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: '#10b981',
                      fontWeight: '600',
                    }}
                  >
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tips */}
          <div
            style={{
              background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
              border: '1px solid #10b981',
              borderRadius: '8px',
              padding: '12px',
              marginTop: '16px',
            }}
          >
            <div
              style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#166534',
                marginBottom: '8px',
              }}
            >
              💡 User Management Pro Tips
            </div>
            <ul
              style={{
                fontSize: '0.8rem',
                color: '#374151',
                margin: 0,
                paddingLeft: '16px',
              }}
            >
              <li>Use search filters to quickly find specific users</li>
              <li>Configure permissions based on job roles</li>
              <li>Assign training modules automatically by department</li>
              <li>Monitor contractor onboarding completion</li>
            </ul>
          </div>

          {/* Keyboard shortcut */}
          <div
            style={{
              fontSize: '0.7rem',
              color: '#666',
              textAlign: 'center',
              marginTop: '12px',
              paddingTop: '8px',
              borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            }}
          >
            Press{' '}
            <kbd
              style={{
                background: '#f3f4f6',
                padding: '2px 4px',
                borderRadius: '3px',
                fontSize: '0.7rem',
              }}
            >
              Ctrl+Shift+U
            </kbd>{' '}
            to show this guide anytime
          </div>
        </div>
      )}
    </div>
  );
}
