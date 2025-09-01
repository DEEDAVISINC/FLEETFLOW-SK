'use client';

import React, { useState } from 'react';

interface W9FormData {
  businessName: string;
  businessType: 'individual' | 'corporation' | 'partnership' | 'llc' | 'other';
  otherBusinessType?: string;
  disregardedEntity: boolean;
  disregardedEntityName?: string;
  exemptFromBackupWithholding: boolean;
  fatcaReporting: boolean;

  // Tax Classification
  taxClassification:
    | 'individual'
    | 'c_corp'
    | 's_corp'
    | 'partnership'
    | 'trust_estate'
    | 'llc'
    | 'other';
  llcTaxClassification?: 'c' | 's' | 'p' | 'disregarded';
  otherTaxClassification?: string;

  // Address
  address: string;
  city: string;
  state: string;
  zipCode: string;

  // Account Numbers (optional)
  accountNumbers?: string;

  // Taxpayer Identification
  tinType: 'ssn' | 'ein';
  ssn?: string;
  ein?: string;

  // Certification
  certified: boolean;
  signature: string;
  signatureDate: string;
}

interface W9FormProps {
  onFormCompleted: (formData: W9FormData) => void;
  onCancel: () => void;
  carrierInfo?: any;
}

export const W9Form: React.FC<W9FormProps> = ({
  onFormCompleted,
  onCancel,
  carrierInfo,
}) => {
  const [formData, setFormData] = useState<W9FormData>({
    businessName: carrierInfo?.legalName || '',
    businessType: 'llc',
    disregardedEntity: false,
    exemptFromBackupWithholding: false,
    fatcaReporting: false,
    taxClassification: 'llc',
    address: carrierInfo?.physicalAddress?.split(',')[0] || '',
    city: carrierInfo?.physicalAddress?.split(',')[1]?.trim() || '',
    state:
      carrierInfo?.physicalAddress?.split(',')[2]?.trim()?.split(' ')[0] || '',
    zipCode:
      carrierInfo?.physicalAddress?.split(',')[2]?.trim()?.split(' ')[1] || '',
    tinType: 'ein',
    certified: false,
    signature: '',
    signatureDate: new Date().toISOString().split('T')[0],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const businessTypes = [
    {
      value: 'individual',
      label: 'Individual/sole proprietor or single-member LLC',
    },
    { value: 'corporation', label: 'C Corporation' },
    { value: 'partnership', label: 'S Corporation' },
    { value: 'llc', label: 'Partnership' },
    { value: 'other', label: 'Limited liability company (LLC)' },
  ];

  const taxClassifications = [
    {
      value: 'individual',
      label: 'Individual/sole proprietor or single-member LLC',
    },
    { value: 'c_corp', label: 'C Corporation' },
    { value: 's_corp', label: 'S Corporation' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'trust_estate', label: 'Trust/estate' },
    { value: 'llc', label: 'Limited liability company' },
    { value: 'other', label: 'Other' },
  ];

  const llcClassifications = [
    { value: 'c', label: 'C Corporation' },
    { value: 's', label: 'S Corporation' },
    { value: 'p', label: 'Partnership' },
    { value: 'disregarded', label: 'Disregarded entity' },
  ];

  const states = [
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
  ];

  const updateFormData = (field: keyof W9FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.businessName.trim()) {
          newErrors.businessName = 'Business name is required';
        }
        if (!formData.businessType) {
          newErrors.businessType = 'Business type selection is required';
        }
        if (
          formData.businessType === 'other' &&
          !formData.otherBusinessType?.trim()
        ) {
          newErrors.otherBusinessType = 'Please specify the business type';
        }
        break;

      case 2:
        if (!formData.address.trim()) {
          newErrors.address = 'Address is required';
        }
        if (!formData.city.trim()) {
          newErrors.city = 'City is required';
        }
        if (!formData.state) {
          newErrors.state = 'State is required';
        }
        if (
          !formData.zipCode.trim() ||
          !/^\d{5}(-\d{4})?$/.test(formData.zipCode)
        ) {
          newErrors.zipCode =
            'Valid ZIP code is required (12345 or 12345-6789)';
        }
        break;

      case 3:
        if (formData.tinType === 'ssn') {
          if (!formData.ssn || !/^\d{3}-\d{2}-\d{4}$/.test(formData.ssn)) {
            newErrors.ssn = 'Valid SSN is required (XXX-XX-XXXX)';
          }
        } else {
          if (!formData.ein || !/^\d{2}-\d{7}$/.test(formData.ein)) {
            newErrors.ein = 'Valid EIN is required (XX-XXXXXXX)';
          }
        }
        break;

      case 4:
        if (!formData.certified) {
          newErrors.certified =
            'You must certify the accuracy of the information';
        }
        if (!formData.signature.trim()) {
          newErrors.signature = 'Digital signature is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        onFormCompleted(formData);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const formatSSN = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
  };

  const formatEIN = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}-${digits.slice(2, 9)}`;
  };

  const renderStep1 = () => (
    <div>
      <h3>Step 1: Business Information</h3>
    </div>
  );

  return (
    <div>
      <h1>W9 Form</h1>
      {renderStep1()}
    </div>
  );
};
