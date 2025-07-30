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
}: any) => (
  <div>
    <h3>Document Generation Step</h3>
    <p>This would generate contracts.</p>
    <button onClick={() => onComplete({ documents: 'generated' })}>
      Complete
    </button>
  </div>
);

const ContractSigningStep = ({
  contractorData,
  workflowData,
  onComplete,
  onCancel,
}: any) => (
  <div>
    <h3>Contract Signing Step</h3>
    <p>This would handle contract signing.</p>
    <button onClick={() => onComplete({ contract: 'signed' })}>Complete</button>
  </div>
);

const NDASigningStep = ({
  contractorData,
  workflowData,
  onComplete,
  onCancel,
}: any) => (
  <div>
    <h3>NDA Signing Step</h3>
    <p>This would handle NDA signing.</p>
    <button onClick={() => onComplete({ nda: 'signed' })}>Complete</button>
  </div>
);

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
