'use client';

import { useState } from 'react';
import { AIAgentSetup } from '../../../components/onboarding/AIAgentSetup';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  icon: string;
  optional?: boolean;
}

export interface ContractorOnboardingWorkflowProps {
  contractorData: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: 'dispatcher' | 'broker_agent' | 'both';
  };
  onComplete: (finalData: any) => void;
  onCancel: () => void;
}

export const ContractorOnboardingWorkflow: React.FC<
  ContractorOnboardingWorkflowProps
> = ({ contractorData, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [workflowData, setWorkflowData] = useState<Record<string, any>>({
    contractorInfo: contractorData,
  });

  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'personal_info',
      title: 'Personal Information',
      description: 'Complete personal and contact information',
      completed: false,
      current: true,
      icon: '👤',
    },
    {
      id: 'experience_verification',
      title: 'Experience Verification',
      description: 'Verify transportation industry experience',
      completed: false,
      current: false,
      icon: '📋',
    },
    {
      id: 'background_check',
      title: 'Background Check',
      description: 'Complete background verification process',
      completed: false,
      current: false,
      icon: '🔍',
    },
    {
      id: 'ai_agent_setup',
      title: 'AI Agent Setup',
      description: 'Configure your personal AI assistant (Optional)',
      completed: false,
      current: false,
      icon: '🤖',
      optional: true,
    },
    {
      id: 'document_generation',
      title: 'Document Generation',
      description: 'Generate contractor agreement and NDA',
      completed: false,
      current: false,
      icon: '📄',
    },
    {
      id: 'contract_signing',
      title: 'Contract Signing',
      description: 'Review and sign contractor agreement',
      completed: false,
      current: false,
      icon: '✍️',
    },
    {
      id: 'nda_signing',
      title: 'NDA Signing',
      description: 'Review and sign non-disclosure agreement',
      completed: false,
      current: false,
      icon: '🔒',
    },
    {
      id: 'insurance_verification',
      title: 'Insurance Verification',
      description: 'Verify required insurance coverage',
      completed: false,
      current: false,
      icon: '🛡️',
    },
    {
      id: 'training_completion',
      title: 'Training Completion',
      description: 'Complete required training modules',
      completed: false,
      current: false,
      icon: '🎓',
    },
    {
      id: 'system_setup',
      title: 'System Setup',
      description: 'Configure system access and permissions',
      completed: false,
      current: false,
      icon: '⚙️',
    },
    {
      id: 'final_approval',
      title: 'Final Approval',
      description: 'Final review and approval process',
      completed: false,
      current: false,
      icon: '✅',
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
    const currentStepId = steps[currentStep].id;
    setWorkflowData((prev) => ({
      ...prev,
      [currentStepId]: stepData,
    }));

    updateStep(currentStep, true);

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      updateStep(currentStep + 1, false);
    } else {
      // All steps completed
      const finalData = {
        ...workflowData,
        [currentStepId]: stepData,
        completedAt: new Date(),
      };
      onComplete(finalData);
    }
  };

  const handleStepSkip = () => {
    // Only allow skipping optional steps
    if (steps[currentStep].optional) {
      handleStepComplete({ skipped: true });
    }
  };

  const renderCurrentStep = () => {
    const currentStepData = steps[currentStep];

    switch (currentStepData.id) {
      case 'personal_info':
        return (
          <PersonalInfoStep
            contractorData={contractorData}
            onComplete={handleStepComplete}
            onCancel={onCancel}
          />
        );

      case 'experience_verification':
        return (
          <ExperienceVerificationStep
            contractorData={contractorData}
            role={contractorData.role}
            onComplete={handleStepComplete}
            onCancel={onCancel}
          />
        );

      case 'background_check':
        return (
          <BackgroundCheckStep
            contractorData={contractorData}
            onComplete={handleStepComplete}
            onCancel={onCancel}
          />
        );

      case 'ai_agent_setup':
        return (
          <AIAgentSetup
            contractorData={contractorData}
            onComplete={handleStepComplete}
            onSkip={handleStepSkip}
          />
        );

      case 'document_generation':
        return (
          <DocumentGenerationStep
            contractorData={contractorData}
            workflowData={workflowData}
            onComplete={handleStepComplete}
            onCancel={onCancel}
          />
        );

      case 'contract_signing':
        return (
          <ContractSigningStep
            contractorData={contractorData}
            workflowData={workflowData}
            onComplete={handleStepComplete}
            onCancel={onCancel}
          />
        );

      case 'nda_signing':
        return (
          <NDASigningStep
            contractorData={contractorData}
            workflowData={workflowData}
            onComplete={handleStepComplete}
            onCancel={onCancel}
          />
        );

      case 'insurance_verification':
        return (
          <InsuranceVerificationStep
            contractorData={contractorData}
            onComplete={handleStepComplete}
            onCancel={onCancel}
          />
        );

      case 'training_completion':
        return (
          <TrainingCompletionStep
            contractorData={contractorData}
            role={contractorData.role}
            onComplete={handleStepComplete}
            onCancel={onCancel}
          />
        );

      case 'system_setup':
        return (
          <SystemSetupStep
            contractorData={contractorData}
            workflowData={workflowData}
            onComplete={handleStepComplete}
            onCancel={onCancel}
          />
        );

      case 'final_approval':
        return (
          <FinalApprovalStep
            contractorData={contractorData}
            workflowData={workflowData}
            onComplete={handleStepComplete}
            onCancel={onCancel}
          />
        );

      default:
        return <div>Step not found</div>;
    }
  };

  const calculateProgress = () => {
    const completedSteps = steps.filter((step) => step.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
        linear-gradient(135deg, rgba(255, 20, 147, 0.15) 0%, rgba(236, 72, 153, 0.12) 25%, rgba(219, 39, 119, 0.10) 50%, rgba(190, 24, 93, 0.08) 100%),
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)
      `,
        paddingTop: '80px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px 32px',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <h1
            style={{
              color: '#d946ef',
              fontSize: '36px',
              fontWeight: 'bold',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            🚀 Independent Contractor Onboarding
            <span
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                background: 'rgba(217, 70, 239, 0.2)',
                color: '#d946ef',
                textTransform: 'uppercase',
              }}
            >
              {contractorData.role.replace('_', ' ')}
            </span>
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '18px',
              margin: '0 0 20px 0',
            }}
          >
            Welcome {contractorData.firstName}! Let's get you set up as an
            independent contractor.
          </p>

          {/* Progress Bar */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}
            >
              <span
                style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Overall Progress
              </span>
              <span
                style={{
                  color: '#d946ef',
                  fontSize: '14px',
                  fontWeight: '700',
                }}
              >
                {calculateProgress()}%
              </span>
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
                  width: `${calculateProgress()}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #d946ef, #c026d3)',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '350px 1fr',
            gap: '32px',
          }}
        >
          {/* Step Navigation */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              height: 'fit-content',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '20px',
              }}
            >
              Onboarding Steps
            </h3>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    background: step.current
                      ? 'rgba(217, 70, 239, 0.2)'
                      : step.completed
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: step.current
                      ? '1px solid #d946ef'
                      : step.completed
                        ? '1px solid #10b981'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Step Icon */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: step.completed
                        ? '#10b981'
                        : step.current
                          ? '#d946ef'
                          : 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      flexShrink: 0,
                    }}
                  >
                    {step.completed ? '✅' : step.icon}
                  </div>

                  {/* Step Content */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      {step.title}
                      {step.optional && (
                        <span
                          style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            background: 'rgba(245, 158, 11, 0.2)',
                            color: '#f59e0b',
                            fontWeight: '700',
                          }}
                        >
                          OPTIONAL
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                        lineHeight: '1.4',
                      }}
                    >
                      {step.description}
                    </div>
                  </div>

                  {/* Step Number */}
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: step.completed
                        ? '#10b981'
                        : step.current
                          ? '#d946ef'
                          : 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '700',
                    }}
                  >
                    {step.completed ? '✓' : index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              minHeight: '600px',
            }}
          >
            {/* Current Step Header */}
            <div
              style={{
                marginBottom: '32px',
                paddingBottom: '20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #d946ef, #c026d3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                  }}
                >
                  {steps[currentStep].icon}
                </div>

                <div>
                  <h2
                    style={{
                      color: 'white',
                      fontSize: '28px',
                      fontWeight: '700',
                      margin: '0 0 8px 0',
                    }}
                  >
                    {steps[currentStep].title}
                  </h2>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '16px',
                      margin: 0,
                    }}
                  >
                    {steps[currentStep].description}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                  }}
                >
                  Step {currentStep + 1} of {steps.length}
                </span>

                {steps[currentStep].optional && (
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      background: 'rgba(245, 158, 11, 0.2)',
                      color: '#f59e0b',
                      fontWeight: '600',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                    }}
                  >
                    🏃‍♂️ Can Skip This Step
                  </span>
                )}
              </div>
            </div>

            {/* Step Content */}
            <div>{renderCurrentStep()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual Step Components would be imported or defined here
const PersonalInfoStep = ({ contractorData, onComplete, onCancel }: any) => (
  <div>
    <h3>Personal Information Step</h3>
    <p>This would collect additional personal information.</p>
    <button onClick={() => onComplete({ personalInfo: 'completed' })}>
      Complete
    </button>
  </div>
);

const ExperienceVerificationStep = ({
  contractorData,
  role,
  onComplete,
  onCancel,
}: any) => (
  <div>
    <h3>Experience Verification Step</h3>
    <p>This would verify {role} experience.</p>
    <button onClick={() => onComplete({ experience: 'verified' })}>
      Complete
    </button>
  </div>
);

const BackgroundCheckStep = ({ contractorData, onComplete, onCancel }: any) => (
  <div>
    <h3>Background Check Step</h3>
    <p>This would initiate background check.</p>
    <button onClick={() => onComplete({ backgroundCheck: 'completed' })}>
      Complete
    </button>
  </div>
);

const DocumentGenerationStep = ({
  contractorData,
  workflowData,
  onComplete,
  onCancel,
}: any) => {
  const [loading, setLoading] = useState(false);
  const [generatedDocs, setGeneratedDocs] = useState<any>(null);

  const handleGenerateDocuments = async () => {
    setLoading(true);
    try {
      // Import document service
      const { documentService } = await import(
        '../../../services/document-service'
      );

      // Generate ICA using employee data (not carrier data!)
      const employeeData = {
        department:
          contractorData.role === 'dispatcher'
            ? 'Dispatch Operations'
            : contractorData.role === 'broker_agent'
              ? 'Brokerage Operations'
              : 'Operations',
        employeeId: `FF-${Date.now()}`,
        startDate: new Date().toLocaleDateString(),
        position: contractorData.role.replace('_', ' ').toUpperCase(),
        email: contractorData.email,
        phone: contractorData.phone,
      };

      const signerData = {
        signerName: `${contractorData.firstName} ${contractorData.lastName}`,
        signerTitle:
          contractorData.role === 'dispatcher'
            ? 'Freight Dispatcher'
            : contractorData.role === 'broker_agent'
              ? 'Freight Broker Agent'
              : 'Transportation Specialist',
        signerEmail: contractorData.email,
      };

      const icaDocument =
        documentService.generateIndependentContractorAgreement(
          employeeData,
          signerData
        );

      setGeneratedDocs({
        ica: icaDocument,
        employeeData,
        signerData,
      });

      onComplete({
        documents: 'generated',
        icaDocument,
        employeeData,
        signerData,
      });
    } catch (error) {
      console.error('Error generating documents:', error);
      alert('Error generating documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <h3
          style={{ color: '#d946ef', marginBottom: '16px', fontSize: '24px' }}
        >
          📄 Document Generation
        </h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '20px' }}>
          Generate your comprehensive{' '}
          <strong>Independent Contractor Agreement</strong> with NDA,
          non-compete, and confidentiality provisions specifically for FleetFlow
          employees.
        </p>

        <div
          style={{
            background: 'rgba(217, 70, 239, 0.1)',
            border: '1px solid rgba(217, 70, 239, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <h4 style={{ color: '#d946ef', margin: '0 0 12px 0' }}>
            📋 Employee Information
          </h4>
          <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            <p>
              <strong>Name:</strong> {contractorData.firstName}{' '}
              {contractorData.lastName}
            </p>
            <p>
              <strong>Role:</strong>{' '}
              {contractorData.role.replace('_', ' ').toUpperCase()}
            </p>
            <p>
              <strong>Email:</strong> {contractorData.email}
            </p>
            <p>
              <strong>Department:</strong>{' '}
              {contractorData.role === 'dispatcher'
                ? 'Dispatch Operations'
                : 'Brokerage Operations'}
            </p>
          </div>
        </div>
      </div>

      {generatedDocs && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <h4 style={{ color: '#10b981', margin: '0 0 12px 0' }}>
            ✅ Documents Generated Successfully!
          </h4>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Your Independent Contractor Agreement has been generated and is
            ready for review and signature.
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'transparent',
            color: 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          Cancel
        </button>

        <button
          onClick={handleGenerateDocuments}
          disabled={loading}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background: loading
              ? 'rgba(217, 70, 239, 0.5)'
              : 'linear-gradient(135deg, #d946ef, #c026d3)',
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {loading ? (
            <>🔄 Generating Documents...</>
          ) : (
            <>📄 Generate ICA Documents</>
          )}
        </button>
      </div>
    </div>
  );
};

const ContractSigningStep = ({
  contractorData,
  workflowData,
  onComplete,
  onCancel,
}: any) => {
  const [signature, setSignature] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showFullContract, setShowFullContract] = useState(false);
  const [loading, setLoading] = useState(false);

  const icaDocument = workflowData?.icaDocument;

  if (!icaDocument) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: '#ef4444', marginBottom: '20px' }}>
          ⚠️ No contract document found. Please go back to generate the
          documents first.
        </div>
        <button
          onClick={onCancel}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'transparent',
            color: 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleSignContract = async () => {
    if (!signature.trim() || !agreed) {
      alert('Please provide your signature and agree to the terms.');
      return;
    }

    setLoading(true);
    try {
      // Create signed contract record
      const signedContract = {
        ...icaDocument,
        signature: signature.trim(),
        signedDate: new Date().toISOString(),
        signedBy: `${contractorData.firstName} ${contractorData.lastName}`,
        ipAddress: 'localhost', // In production, get real IP
        userAgent: navigator.userAgent,
        agreed: true,
      };

      onComplete({
        contract: 'signed',
        signedContract,
        signatureData: {
          signature: signature.trim(),
          signedDate: new Date().toISOString(),
          agreed: true,
        },
      });
    } catch (error) {
      console.error('Error signing contract:', error);
      alert('Error signing contract. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <h3
          style={{ color: '#d946ef', marginBottom: '16px', fontSize: '24px' }}
        >
          ✍️ Independent Contractor Agreement Signing
        </h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '20px' }}>
          Please review your Independent Contractor Agreement with NDA and
          confidentiality provisions, then provide your digital signature to
          complete the process.
        </p>

        {/* Contract Preview */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            maxHeight: showFullContract ? 'none' : '400px',
            overflow: showFullContract ? 'visible' : 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h4 style={{ color: '#10b981', margin: 0 }}>📋 Contract Preview</h4>
            <button
              onClick={() => setShowFullContract(!showFullContract)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              {showFullContract ? 'Show Less' : 'Show Full Contract'}
            </button>
          </div>

          <div
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '14px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              position: 'relative',
            }}
          >
            {icaDocument.content}
            {!showFullContract && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '60px',
                  background:
                    'linear-gradient(transparent, rgba(17, 24, 39, 0.9))',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div
          style={{
            background: 'rgba(217, 70, 239, 0.1)',
            border: '1px solid rgba(217, 70, 239, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              cursor: 'pointer',
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <input
              type='checkbox'
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ marginTop: '2px' }}
            />
            <div>
              <strong style={{ color: '#d946ef' }}>
                I agree to the terms and conditions
              </strong>
              <p
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                By checking this box, I acknowledge that I have read,
                understood, and agree to be bound by all terms of this
                Independent Contractor Agreement, including the NDA,
                non-compete, and confidentiality provisions.
              </p>
            </div>
          </label>
        </div>

        {/* Digital Signature */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <label
            style={{
              display: 'block',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            Digital Signature *
          </label>
          <input
            type='text'
            placeholder={`Type your full name: ${contractorData.firstName} ${contractorData.lastName}`}
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              fontSize: '16px',
              fontFamily: 'cursive',
            }}
          />
          <p
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.6)',
              margin: '8px 0 0 0',
            }}
          >
            Your typed name will serve as your legal digital signature
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'transparent',
            color: 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          Cancel
        </button>

        <button
          onClick={handleSignContract}
          disabled={loading || !signature.trim() || !agreed}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background:
              loading || !signature.trim() || !agreed
                ? 'rgba(217, 70, 239, 0.3)'
                : 'linear-gradient(135deg, #d946ef, #c026d3)',
            color:
              loading || !signature.trim() || !agreed
                ? 'rgba(255, 255, 255, 0.5)'
                : 'white',
            cursor:
              loading || !signature.trim() || !agreed
                ? 'not-allowed'
                : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {loading ? <>🔄 Signing Contract...</> : <>✍️ Sign ICA Contract</>}
        </button>
      </div>
    </div>
  );
};

const NDASigningStep = ({
  contractorData,
  workflowData,
  onComplete,
  onCancel,
}: any) => {
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(false);

  const signedContract = workflowData?.signedContract;

  if (!signedContract) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: '#ef4444', marginBottom: '20px' }}>
          ⚠️ No signed contract found. Please complete the contract signing step
          first.
        </div>
        <button
          onClick={onCancel}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'transparent',
            color: 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleAcknowledgeNDA = async () => {
    if (!acknowledged) {
      alert('Please acknowledge the NDA provisions.');
      return;
    }

    setLoading(true);
    try {
      onComplete({
        nda: 'acknowledged',
        ndaAcknowledgment: {
          acknowledged: true,
          acknowledgedDate: new Date().toISOString(),
          acknowledgedBy: `${contractorData.firstName} ${contractorData.lastName}`,
          ipAddress: 'localhost', // In production, get real IP
        },
      });
    } catch (error) {
      console.error('Error acknowledging NDA:', error);
      alert('Error processing acknowledgment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <h3
          style={{ color: '#d946ef', marginBottom: '16px', fontSize: '24px' }}
        >
          🔒 NDA & Confidentiality Acknowledgment
        </h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '20px' }}>
          Your Independent Contractor Agreement includes comprehensive NDA and
          confidentiality provisions. Please acknowledge your understanding of
          these critical requirements.
        </p>

        {/* Contract Signed Confirmation */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <h4 style={{ color: '#10b981', margin: '0 0 8px 0' }}>
            ✅ ICA Contract Signed
          </h4>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0,
              fontSize: '14px',
            }}
          >
            Signed by: <strong>{signedContract.signedBy}</strong>
            <br />
            Date:{' '}
            <strong>
              {new Date(signedContract.signedDate).toLocaleDateString()}
            </strong>
          </p>
        </div>

        {/* NDA Key Provisions */}
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h4 style={{ color: '#ef4444', margin: '0 0 16px 0' }}>
            🚨 Critical NDA & Confidentiality Requirements
          </h4>

          <div
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '14px',
              lineHeight: '1.6',
            }}
          >
            <div style={{ marginBottom: '12px' }}>
              <strong style={{ color: '#ef4444' }}>
                📋 Confidential Information Includes:
              </strong>
              <ul
                style={{
                  margin: '4px 0 0 20px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                <li>
                  Customer lists, pricing, and proprietary business strategies
                </li>
                <li>
                  Load information, carrier relationships, and rate structures
                </li>
                <li>Proprietary software, systems, and trade secrets</li>
                <li>Financial information and business development plans</li>
              </ul>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <strong style={{ color: '#ef4444' }}>
                🚫 Non-Compete Restrictions:
              </strong>
              <ul
                style={{
                  margin: '4px 0 0 20px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                <li>12-month restriction on competing freight services</li>
                <li>Cannot solicit FleetFlow customers or carriers</li>
                <li>Cannot recruit FleetFlow employees or contractors</li>
              </ul>
            </div>

            <div>
              <strong style={{ color: '#ef4444' }}>
                ⚖️ Legal Consequences:
              </strong>
              <ul
                style={{
                  margin: '4px 0 0 20px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                <li>Immediate termination for violations</li>
                <li>Legal action and monetary damages</li>
                <li>Obligations survive contract termination</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Acknowledgment */}
        <div
          style={{
            background: 'rgba(217, 70, 239, 0.1)',
            border: '1px solid rgba(217, 70, 239, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              cursor: 'pointer',
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <input
              type='checkbox'
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              style={{ marginTop: '2px' }}
            />
            <div>
              <strong style={{ color: '#d946ef' }}>
                I acknowledge and understand the NDA provisions
              </strong>
              <p
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                By checking this box, I confirm that I have read, understood,
                and will strictly comply with all confidentiality,
                non-disclosure, and non-compete provisions outlined in my signed
                Independent Contractor Agreement. I understand the legal
                consequences of any violations.
              </p>
            </div>
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'transparent',
            color: 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          Cancel
        </button>

        <button
          onClick={handleAcknowledgeNDA}
          disabled={loading || !acknowledged}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background:
              loading || !acknowledged
                ? 'rgba(217, 70, 239, 0.3)'
                : 'linear-gradient(135deg, #d946ef, #c026d3)',
            color:
              loading || !acknowledged ? 'rgba(255, 255, 255, 0.5)' : 'white',
            cursor: loading || !acknowledged ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {loading ? <>🔄 Processing...</> : <>🔒 Acknowledge NDA</>}
        </button>
      </div>
    </div>
  );
};

const InsuranceVerificationStep = ({
  contractorData,
  onComplete,
  onCancel,
}: any) => (
  <div>
    <h3>Insurance Verification Step</h3>
    <p>This would verify insurance.</p>
    <button onClick={() => onComplete({ insurance: 'verified' })}>
      Complete
    </button>
  </div>
);

const TrainingCompletionStep = ({
  contractorData,
  role,
  onComplete,
  onCancel,
}: any) => (
  <div>
    <h3>Training Completion Step</h3>
    <p>This would handle {role} training.</p>
    <button onClick={() => onComplete({ training: 'completed' })}>
      Complete
    </button>
  </div>
);

const SystemSetupStep = ({
  contractorData,
  workflowData,
  onComplete,
  onCancel,
}: any) => (
  <div>
    <h3>System Setup Step</h3>
    <p>This would setup system access with AI agent if configured.</p>
    <button onClick={() => onComplete({ systemSetup: 'completed' })}>
      Complete
    </button>
  </div>
);

const FinalApprovalStep = ({
  contractorData,
  workflowData,
  onComplete,
  onCancel,
}: any) => (
  <div>
    <h3>Final Approval Step</h3>
    <p>This would handle final approval.</p>
    <button onClick={() => onComplete({ finalApproval: 'approved' })}>
      Complete
    </button>
  </div>
);

export default ContractorOnboardingWorkflow;
