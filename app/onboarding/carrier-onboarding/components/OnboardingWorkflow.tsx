'use client';

import React, { useState } from 'react';
import {
  OnboardingRecord as IntegrationRecord,
  onboardingIntegration,
} from '../../../services/onboarding-integration';
import { AgreementSigning } from './AgreementSigning';
import { DocumentUploadEnhanced } from './DocumentUploadEnhanced';
import { FMCSAVerification } from './FMCSAVerification';
import { FactoringSetup } from './FactoringSetup';
import { FleetGuardSecurityAnalysis } from './FleetGuardSecurityAnalysis';
import { PortalSetup } from './PortalSetup';
import { TravelLimitsCommodities } from './TravelLimitsCommodities';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  icon: string;
}

interface OnboardingWorkflowProps {
  onComplete: (data: OnboardingRecord) => void;
  onCancel: () => void;
}

interface OnboardingRecord {
  carrierId: string;
  startDate: string;
  completionDate: string;
  status: string;
  steps: Record<string, any>;
  summary: {
    carrierInfo?: any;
    documentsUploaded: number;
    factoringEnabled: boolean;
    agreementsSigned: number;
    portalEnabled: boolean;
    portalUsers: number;
  };
}

export const OnboardingWorkflow: React.FC<OnboardingWorkflowProps> = ({
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [workflowData, setWorkflowData] = useState<Record<string, any>>({});

  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'verification',
      title: 'FMCSA Verification',
      description: 'Verify carrier information and safety rating',
      completed: false,
      current: true,
      icon: '📊',
    },
    {
      id: 'fleetguard',
      title: 'FleetGuard AI Security Analysis',
      description: 'Comprehensive fraud detection and carrier risk assessment',
      completed: false,
      current: false,
      icon: '🛡️',
    },
    {
      id: 'limits',
      title: 'Travel Limits & Commodities',
      description:
        'Configure carrier travel restrictions and approved commodities',
      completed: false,
      current: false,
      icon: '🗺️',
    },
    {
      id: 'documents',
      title: 'Document Upload & Verification',
      description:
        'Automated upload, verification, and processing of required documents',
      completed: false,
      current: false,
      icon: '📄',
    },
    {
      id: 'factoring',
      title: 'Factoring Setup',
      description: 'Configure factoring company and payment terms',
      completed: false,
      current: false,
      icon: '🏦',
    },
    {
      id: 'agreements',
      title: 'Agreement Signing',
      description: 'Review and sign broker-carrier agreements',
      completed: false,
      current: false,
      icon: '📝',
    },
    {
      id: 'portal',
      title: 'Portal Access',
      description: 'Setup driver management portal access and permissions',
      completed: false,
      current: false,
      icon: '👤',
    },
  ]);

  const updateStep = (stepIndex: number, completed: boolean) => {
    setSteps((prev) =>
      prev.map((step, index) => ({
        ...step,
        completed:
          index < stepIndex ? true : index === stepIndex ? completed : false,
        current: index === stepIndex,
      }))
    );
  };

  const handleStepComplete = (stepData: any) => {
    setWorkflowData((prev: Record<string, any>) => ({
      ...prev,
      [steps[currentStep].id]: stepData,
    }));
    updateStep(currentStep, true);

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      updateStep(currentStep + 1, false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      updateStep(currentStep + 1, false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      updateStep(currentStep - 1, false);
    }
  };

  const handleWorkflowComplete = async (finalData: any) => {
    const completeData = {
      ...workflowData,
      [steps[currentStep].id]: finalData,
    };
    updateStep(currentStep, true);

    // Create comprehensive onboarding record
    const onboardingRecord: IntegrationRecord = {
      carrierId: `carrier_${Date.now()}`,
      startDate: new Date().toISOString(),
      completionDate: new Date().toISOString(),
      status: 'completed',
      steps: completeData,
      summary: {
        carrierInfo: completeData.verification,
        documentsUploaded:
          completeData.documents?.filter((d: any) => d.uploaded).length || 0,
        factoringEnabled:
          completeData.factoring?.selectedCompany ||
          completeData.factoring?.customCompany,
        agreementsSigned:
          completeData.agreements?.filter((a: any) => a.signed).length || 0,
        portalEnabled: completeData.portal?.portalEnabled || false,
        portalUsers: completeData.portal?.users?.length || 0,
      },
    };

    // Integrate with carrier and driver portals
    try {
      const integrationResult =
        await onboardingIntegration.completeOnboarding(onboardingRecord);

      if (integrationResult.success) {
        console.log('✅ Integration successful:', integrationResult.message);
        console.log(
          '📋 Carrier Profile Created:',
          integrationResult.carrierProfile
        );
        console.log(
          '👥 Driver Profiles Created:',
          integrationResult.driverProfiles
        );

        // Pass the integration result to the parent component
        onComplete({
          ...onboardingRecord,
          integrationResult,
        });
      } else {
        console.error('❌ Integration failed:', integrationResult.message);
        onComplete(onboardingRecord);
      }
    } catch (error) {
      console.error('❌ Integration error:', error);
      onComplete(onboardingRecord);
    }
  };

  const getStepComponent = () => {
    switch (currentStep) {
      case 0:
        return (
          <FMCSAVerification
            onDataVerified={(data) => handleStepComplete(data)}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <FleetGuardSecurityAnalysis
            onAnalysisComplete={(data) => handleStepComplete(data)}
            onNext={handleNext}
            onBack={handleBack}
            carrierData={workflowData.verification}
          />
        );
      case 2:
        return (
          <TravelLimitsCommodities
            onDataConfigured={(data) => handleStepComplete(data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <DocumentUploadEnhanced
            onDocumentUploaded={(doc: any) => {
              // Update workflow data with document info
              const currentDocs = workflowData.documents || [];
              setWorkflowData((prev: Record<string, any>) => ({
                ...prev,
                documents: [...currentDocs, doc],
              }));
            }}
            onNext={handleNext}
            onBack={handleBack}
            carrierData={workflowData.verification}
          />
        );
      case 4:
        return (
          <FactoringSetup
            onFactoringSetup={(data) => handleStepComplete(data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <AgreementSigning
            onAgreementsSigned={(agreements) => handleStepComplete(agreements)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 6:
        return (
          <PortalSetup
            onPortalSetup={(data) => handleStepComplete(data)}
            onComplete={(data: any) => handleWorkflowComplete(data)}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  const completedSteps = steps.filter((step) => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '8px',
              }}
            >
              🚛 Carrier Onboarding Workflow
            </h1>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '1.1rem',
                margin: 0,
              }}
            >
              Complete carrier verification, documentation, and setup process
            </p>
          </div>
          <button
            onClick={onCancel}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            ✕ Cancel
          </button>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <span style={{ color: 'white', fontWeight: 'bold' }}>
              Overall Progress
            </span>
            <span style={{ color: 'white', fontWeight: 'bold' }}>
              {completedSteps}/{totalSteps} Steps ({progressPercentage}%)
            </span>
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              height: '12px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                height: '100%',
                width: `${progressPercentage}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Step Navigation */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
            gap: '12px',
            marginTop: '20px',
          }}
        >
          {steps.map((step, index) => (
            <div
              key={step.id}
              style={{
                background: step.completed
                  ? 'rgba(16, 185, 129, 0.3)'
                  : step.current
                    ? 'rgba(59, 130, 246, 0.3)'
                    : 'rgba(255, 255, 255, 0.1)',
                border: `2px solid ${
                  step.completed
                    ? 'rgba(16, 185, 129, 0.5)'
                    : step.current
                      ? 'rgba(59, 130, 246, 0.5)'
                      : 'rgba(255, 255, 255, 0.2)'
                }`,
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                {step.completed ? '✅' : step.icon}
              </div>
              <div
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  marginBottom: '4px',
                }}
              >
                {step.title}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.8rem',
                  lineHeight: '1.3',
                }}
              >
                {step.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div>{getStepComponent()}</div>

      {/* Debug Panel (for development) */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            maxWidth: '300px',
            zIndex: 1000,
          }}
        >
          <div>
            <strong>Debug Info:</strong>
          </div>
          <div>
            Current Step: {currentStep + 1}/{steps.length}
          </div>
          <div>Step ID: {steps[currentStep]?.id}</div>
          <div>Completed: {completedSteps}</div>
          <div>Data Keys: {Object.keys(workflowData).join(', ')}</div>
        </div>
      )}
    </div>
  );
};
