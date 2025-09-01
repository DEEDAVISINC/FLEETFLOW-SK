'use client';

import { useState } from 'react';
import ContractorOnboardingService, {
  ContractorData,
  OnboardingSession,
} from '../services/ContractorOnboardingService';

const ContractorOnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<Partial<ContractorData>>(
    {}
  );
  const [session, setSession] = useState<OnboardingSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for different steps
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
  });

  const [experienceInfo, setExperienceInfo] = useState({
    role: 'dispatcher' as ContractorData['role'],
    experience: '',
    references: [] as any[],
    certifications: [] as string[],
    availableHours: '',
    preferredRegions: [] as string[],
  });

  const [bankingInfo, setBankingInfo] = useState({
    accountType: '',
    routingNumber: '',
    accountNumber: '',
    bankName: '',
  });

  const [taxInfo, setTaxInfo] = useState({
    ssn: '',
    taxId: '',
    businessType: 'individual' as const,
    businessName: '',
  });

  const steps = [
    {
      id: 'personal_info',
      title: 'Personal Information',
      description: 'Basic contact and personal details',
      icon: '👤',
    },
    {
      id: 'experience',
      title: 'Experience & Role',
      description: 'Transportation experience and desired role',
      icon: '🚛',
    },
    {
      id: 'banking',
      title: 'Banking Information',
      description: 'Payment and banking details',
      icon: '🏦',
    },
    {
      id: 'tax_info',
      title: 'Tax Information',
      description: 'Tax identification and business details',
      icon: '📋',
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Review all information and submit',
      icon: '✅',
    },
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const contractorData: ContractorData = {
        id: `CTR-${Date.now()}`,
        ...personalInfo,
        ...experienceInfo,
        bankingInfo,
        taxInfo,
      };

      const newSession =
        await ContractorOnboardingService.createOnboardingSession(
          contractorData
        );
      setSession(newSession);

      // Redirect to onboarding dashboard
      window.location.href = '/contractor-onboarding/dashboard';
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalInfoStep = () => (
    <div>
      <h2>Personal Information</h2>
    </div>
  );

  return (
    <div>
      <h1>Contractor Onboarding</h1>
      {renderPersonalInfoStep()}
    </div>
  );
};
