'use client';

import React, { useState } from 'react';

interface FactoringCompany {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  advancePercentage: number;
  factorRate: number;
  services: string[];
  verificationProcess: string;
  requiresNOA: boolean;
}

interface FactoringSetupData {
  selectedCompany?: FactoringCompany;
  customCompany?: FactoringCompany;
  advancePercentage: number;
  factorRate: number;
  noaDocumentId?: string;
  effectiveDate: string;
  paymentTerms: string;
  quickPayEnabled: boolean;
  quickPayRate?: number;
}

interface FactoringSetupProps {
  onFactoringSetup: (data: FactoringSetupData) => void;
  onNext: () => void;
  onBack: () => void;
}

export const FactoringSetup: React.FC<FactoringSetupProps> = ({
  onFactoringSetup,
  onNext,
  onBack,
}) => {
  const [setupType, setSetupType] = useState<'existing' | 'new' | 'none'>(
    'existing'
  );
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [factorData, setFactorData] = useState<FactoringSetupData>({
    advancePercentage: 90,
    factorRate: 3.5,
    effectiveDate: new Date().toISOString().split('T')[0],
    paymentTerms: '24_hours',
    quickPayEnabled: false,
  });
  const [customCompany, setCustomCompany] = useState<Partial<FactoringCompany>>(
    {
      companyName: '',
      contactName: '',
      phone: '',
      email: '',
      address: '',
      advancePercentage: 90,
      factorRate: 3.5,
      services: ['invoice_factoring'],
      requiresNOA: true,
    }
  );
  const [noaUploaded, setNoaUploaded] = useState(false);

  // Mock factoring companies
  const factoringCompanies: FactoringCompany[] = [
    {
      id: 'rts',
      companyName: 'RTS Financial',
      contactName: 'John Smith',
      phone: '(800) 123-4567',
      email: 'setup@rtsfinancial.com',
      address: '123 Finance Ave, Dallas, TX 75201',
      advancePercentage: 90,
      factorRate: 3.5,
      services: ['Invoice Factoring', 'Fuel Cards', 'Load Board Access'],
      verificationProcess: 'Standard 2-day verification',
      requiresNOA: true,
    },
    {
      id: 'triumph',
      companyName: 'Triumph Business Capital',
      contactName: 'Sarah Johnson',
      phone: '(800) 987-6543',
      email: 'newclients@triumphcapital.com',
      address: '456 Capital Blvd, Houston, TX 77001',
      advancePercentage: 95,
      factorRate: 2.9,
      services: [
        'Invoice Factoring',
        'Equipment Financing',
        'Credit Protection',
      ],
      verificationProcess: 'Same-day verification available',
      requiresNOA: true,
    },
    {
      id: 'apex',
      companyName: 'Apex Capital',
      contactName: 'Michael Brown',
      phone: '(800) 555-0123',
      email: 'onboarding@apexcapital.net',
      address: '789 Apex Way, Fort Worth, TX 76101',
      advancePercentage: 92,
      factorRate: 3.2,
      services: ['Invoice Factoring', 'QuickPay', 'Fuel Advances'],
      verificationProcess: '24-hour verification',
      requiresNOA: true,
    },
  ];

  const handleNoaUpload = async (file: File) => {
    // Simulate file upload
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setNoaUploaded(true);
    setFactorData((prev) => ({ ...prev, noaDocumentId: `noa_${Date.now()}` }));
  };

  const handleSubmit = () => {
    const finalData: FactoringSetupData = { ...factorData };

    if (setupType === 'existing' && selectedCompanyId) {
      const selectedCompany = factoringCompanies.find(
        (c) => c.id === selectedCompanyId
      );
      if (selectedCompany) {
        finalData.selectedCompany = selectedCompany;
        finalData.advancePercentage = selectedCompany.advancePercentage;
        finalData.factorRate = selectedCompany.factorRate;
      }
    } else if (setupType === 'new' && customCompany.companyName) {
      finalData.customCompany = customCompany as FactoringCompany;
    }

    onFactoringSetup(finalData);
    onNext();
  };

  const selectedCompany = factoringCompanies.find(
    (c) => c.id === selectedCompanyId
  );
  const canProceed =
    setupType === 'none' ||
    (setupType === 'existing' &&
      selectedCompanyId &&
      (!selectedCompany?.requiresNOA || noaUploaded)) ||
    (setupType === 'new' &&
      customCompany.companyName &&
      customCompany.contactName &&
      (!customCompany.requiresNOA || noaUploaded));

  return (
    <div>
      <h1>Factoring Setup</h1>
    </div>
  );
};
