'use client';

import React, { useEffect, useState } from 'react';
import {
  GeneratedLoadIdentifiers,
  LoadIdentificationData,
  LoadIdentificationService,
} from '../services/LoadIdentificationService';

interface ComprehensiveLoadFormProps {
  onLoadCreated?: (loadData: any) => void;
  onCancel?: () => void;
}

interface LoadFormData {
  // Basic Load Information
  origin: string;
  destination: string;
  pickupDate: string;
  pickupTime: string;
  deliveryDate: string;
  deliveryTime: string;

  // Load Details
  equipment: string;
  loadType: 'FTL' | 'LTL' | 'Partial' | 'Expedited' | 'Hazmat';
  commodity: string;
  weight: string;
  weightClass: 'Light' | 'Medium' | 'Heavy' | 'Overweight';
  pieces: string;
  rate: number;
  distance: string;

  // Special Requirements
  isHazmat: boolean;
  isExpedited: boolean;
  isRefrigerated: boolean;
  isOversized: boolean;

  // Shipper Information
  shipperName: string;
  shipperCode: string;
  shipperAddress: string;
  shipperCity: string;
  shipperState: string;
  shipperZip: string;
  shipperPhone: string;
  shipperContact: string;

  // Vendor Information
  vendorCode: string;
  vendorName: string;

  // Consignee Information
  consigneeName: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeState: string;
  consigneeZip: string;
  consigneePhone: string;
  consigneeContact: string;

  // Additional Information
  specialInstructions: string;
  customerReference: string;
  poNumber: string;
  appointmentRequired: boolean;
  appointmentTime: string;

  // Broker Information (Interoffice)
  brokerInitials: string;
  brokerName: string;
  brokerCode: string;
  brokerMC: string;
  brokerDOT: string;
}

export default function ComprehensiveLoadForm({
  onLoadCreated,
  onCancel,
}: ComprehensiveLoadFormProps) {
  const [formData, setFormData] = useState<LoadFormData>({
    origin: '',
    destination: '',
    pickupDate: '',
    pickupTime: '',
    deliveryDate: '',
    deliveryTime: '',
    equipment: 'Dry Van',
    loadType: 'FTL',
    commodity: '',
    weight: '',
    weightClass: 'Medium',
    pieces: '',
    rate: 0,
    distance: '',
    isHazmat: false,
    isExpedited: false,
    isRefrigerated: false,
    isOversized: false,
    shipperName: '',
    shipperCode: '',
    shipperAddress: '',
    shipperCity: '',
    shipperState: '',
    shipperZip: '',
    shipperPhone: '',
    shipperContact: '',
    vendorCode: '',
    vendorName: '',
    consigneeName: '',
    consigneeAddress: '',
    consigneeCity: '',
    consigneeState: '',
    consigneeZip: '',
    consigneePhone: '',
    consigneeContact: '',
    specialInstructions: '',
    customerReference: '',
    poNumber: '',
    appointmentRequired: false,
    appointmentTime: '',
    brokerInitials: '',
    brokerName: '',
    brokerCode: '',
    brokerMC: '',
    brokerDOT: '',
  });

  const [generatedIdentifiers, setGeneratedIdentifiers] =
    useState<GeneratedLoadIdentifiers | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Auto-generate identifiers when key fields change
  useEffect(() => {
    if (
      formData.origin &&
      formData.destination &&
      formData.pickupDate &&
      formData.equipment &&
      formData.brokerInitials
    ) {
      const identificationData: LoadIdentificationData = {
        origin: formData.origin,
        destination: formData.destination,
        pickupDate: formData.pickupDate,
        equipment: formData.equipment,
        loadType: formData.loadType,
        brokerInitials: formData.brokerInitials,
        brokerCode: formData.brokerCode,
        shipperName: formData.shipperName,
        shipperCode: formData.shipperCode,
        vendorCode: formData.vendorCode,
        weight: formData.weight,
        weightClass: formData.weightClass,
        commodity: formData.commodity,
        rate: formData.rate,
        distance: formData.distance,
        isHazmat: formData.isHazmat,
        isExpedited: formData.isExpedited,
        isRefrigerated: formData.isRefrigerated,
        isOversized: formData.isOversized,
      };

      const identifiers =
        LoadIdentificationService.generateLoadIdentifiers(identificationData);
      setGeneratedIdentifiers(identifiers);
    }
  }, [
    formData.origin,
    formData.destination,
    formData.pickupDate,
    formData.equipment,
    formData.loadType,
    formData.brokerInitials,
    formData.brokerCode,
    formData.shipperName,
    formData.shipperCode,
    formData.vendorCode,
    formData.weight,
    formData.weightClass,
  ]);

  const handleInputChange = (
    field: keyof LoadFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    // Required fields validation
    if (!formData.origin) errors.push('Origin is required');
    if (!formData.destination) errors.push('Destination is required');
    if (!formData.pickupDate) errors.push('Pickup date is required');
    if (!formData.deliveryDate) errors.push('Delivery date is required');
    if (!formData.rate || formData.rate <= 0)
      errors.push('Rate must be greater than 0');
    if (!formData.commodity) errors.push('Commodity is required');
    if (!formData.weight) errors.push('Weight is required');
    if (!formData.shipperName) errors.push('Shipper name is required');
    if (!formData.consigneeName) errors.push('Consignee name is required');
    if (!formData.brokerInitials) errors.push('Broker initials are required');

    // Date validation
    const pickupDate = new Date(formData.pickupDate);
    const deliveryDate = new Date(formData.deliveryDate);
    if (deliveryDate <= pickupDate) {
      errors.push('Delivery date must be after pickup date');
    }

    // Broker initials validation
    if (formData.brokerInitials && formData.brokerInitials.length < 2) {
      errors.push('Broker initials must be at least 2 characters');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create load with comprehensive identifiers
      const loadData = {
        ...formData,
        id: generatedIdentifiers?.loadId || 'TEMP-ID',
        identifiers: generatedIdentifiers,
        status: 'Available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onLoadCreated?.(loadData);

      // Reset form
      setFormData({
        origin: '',
        destination: '',
        pickupDate: '',
        pickupTime: '',
        deliveryDate: '',
        deliveryTime: '',
        equipment: 'Dry Van',
        loadType: 'FTL',
        commodity: '',
        weight: '',
        weightClass: 'Medium',
        pieces: '',
        rate: 0,
        distance: '',
        isHazmat: false,
        isExpedited: false,
        isRefrigerated: false,
        isOversized: false,
        shipperName: '',
        shipperCode: '',
        shipperAddress: '',
        shipperCity: '',
        shipperState: '',
        shipperZip: '',
        shipperPhone: '',
        shipperContact: '',
        vendorCode: '',
        vendorName: '',
        consigneeName: '',
        consigneeAddress: '',
        consigneeCity: '',
        consigneeState: '',
        consigneeZip: '',
        consigneePhone: '',
        consigneeContact: '',
        specialInstructions: '',
        customerReference: '',
        poNumber: '',
        appointmentRequired: false,
        appointmentTime: '',
        brokerInitials: '',
        brokerName: '',
        brokerCode: '',
        brokerMC: '',
        brokerDOT: '',
      });

      setGeneratedIdentifiers(null);
      setPreviewMode(false);
    } catch (error) {
      console.error('Error creating load:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const equipmentOptions = [
    'Dry Van',
    'Refrigerated',
    'Reefer',
    'Flatbed',
    'Step Deck',
    'Lowboy',
    'Power Only',
    'Container',
    'Tanker',
    'Dump',
    'Auto Carrier',
    'Van',
    'Box Truck',
    'Straight Truck',
    'Bobtail',
  ];

  const loadTypeOptions = [
    { value: 'FTL', label: 'Full Truck Load (FTL)' },
    { value: 'LTL', label: 'Less Than Truck Load (LTL)' },
    { value: 'Partial', label: 'Partial Load' },
    { value: 'Expedited', label: 'Expedited' },
    { value: 'Hazmat', label: 'Hazmat' },
  ];

  const weightClassOptions = [
    { value: 'Light', label: 'Light (Under 20,000 lbs)' },
    { value: 'Medium', label: 'Medium (20,000 - 40,000 lbs)' },
    { value: 'Heavy', label: 'Heavy (40,000 - 60,000 lbs)' },
    { value: 'Overweight', label: 'Overweight (Over 60,000 lbs)' },
  ];

  const usStates = [
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

  if (previewMode && generatedIdentifiers) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '800px',
            maxHeight: '80vh',
            overflow: 'auto',
            width: '90%',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '24px',
              color: '#1a1a1a',
            }}
          >
            Load Identifiers Preview
          </h2>

          {/* Primary Load ID */}
          <div
            style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '2px solid #e9ecef',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '12px',
              }}
            >
              Primary Load ID
            </h3>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#007bff',
                fontFamily: 'monospace',
                backgroundColor: 'white',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
              }}
            >
              {generatedIdentifiers.loadId}
            </div>

            {/* ID Breakdown */}
            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#e9ecef',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#495057',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                  gap: '8px',
                }}
              >
                <div>
                  <strong>Date:</strong> {generatedIdentifiers.dateCode}
                </div>
                <div>
                  <strong>Route:</strong> {generatedIdentifiers.routeCode}
                </div>
                <div>
                  <strong>Shipper:</strong>{' '}
                  {generatedIdentifiers.loadId.split('-')[2]}
                </div>
                <div>
                  <strong>Equipment:</strong>{' '}
                  {generatedIdentifiers.equipmentCode}
                </div>
                <div>
                  <strong>Weight:</strong>{' '}
                  {generatedIdentifiers.weightClassCode}
                </div>
                <div>
                  <strong>Broker:</strong> {formData.brokerInitials}
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Identifiers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                backgroundColor: '#f8f9fa',
                padding: '16px',
                borderRadius: '8px',
              }}
            >
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6c757d',
                  marginBottom: '8px',
                }}
              >
                Short ID
              </h4>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '16px',
                  color: '#212529',
                }}
              >
                {generatedIdentifiers.shortId}
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#f8f9fa',
                padding: '16px',
                borderRadius: '8px',
              }}
            >
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6c757d',
                  marginBottom: '8px',
                }}
              >
                Tracking Number
              </h4>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '16px',
                  color: '#212529',
                }}
              >
                {generatedIdentifiers.trackingNumber}
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#f8f9fa',
                padding: '16px',
                borderRadius: '8px',
              }}
            >
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6c757d',
                  marginBottom: '8px',
                }}
              >
                BOL Number
              </h4>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '16px',
                  color: '#212529',
                }}
              >
                {generatedIdentifiers.bolNumber}
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#f8f9fa',
                padding: '16px',
                borderRadius: '8px',
              }}
            >
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6c757d',
                  marginBottom: '8px',
                }}
              >
                PRO Number
              </h4>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '16px',
                  color: '#212529',
                }}
              >
                {generatedIdentifiers.proNumber}
              </div>
            </div>
          </div>

          {/* Reference Numbers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                backgroundColor: '#e3f2fd',
                padding: '16px',
                borderRadius: '8px',
              }}
            >
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1565c0',
                  marginBottom: '8px',
                }}
              >
                Broker Reference
              </h4>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '16px',
                  color: '#212529',
                }}
              >
                {generatedIdentifiers.brokerReference}
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#e8f5e8',
                padding: '16px',
                borderRadius: '8px',
              }}
            >
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#2e7d32',
                  marginBottom: '8px',
                }}
              >
                Shipper Reference
              </h4>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '16px',
                  color: '#212529',
                }}
              >
                {generatedIdentifiers.shipperReference}
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#fff3e0',
                padding: '16px',
                borderRadius: '8px',
              }}
            >
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#f57c00',
                  marginBottom: '8px',
                }}
              >
                Vendor Reference
              </h4>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '16px',
                  color: '#212529',
                }}
              >
                {generatedIdentifiers.vendorReference}
              </div>
            </div>
          </div>

          {/* Weight Class Information */}
          <div
            style={{
              backgroundColor: '#fce4ec',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px',
            }}
          >
            <h4
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#c2185b',
                marginBottom: '8px',
              }}
            >
              Weight Classification
            </h4>
            <div style={{ color: '#212529' }}>
              <strong>Code:</strong> {generatedIdentifiers.weightClassCode} -{' '}
              {LoadIdentificationService.getWeightClassDescription(
                generatedIdentifiers.weightClassCode
              )}
            </div>
          </div>

          {/* Load Summary */}
          <div
            style={{
              backgroundColor: '#e9ecef',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '24px',
            }}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '12px',
              }}
            >
              Load Summary
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
              }}
            >
              <div>
                <strong>Route:</strong> {formData.origin} →{' '}
                {formData.destination}
              </div>
              <div>
                <strong>Equipment:</strong> {formData.equipment}
              </div>
              <div>
                <strong>Load Type:</strong> {formData.loadType}
              </div>
              <div>
                <strong>Weight Class:</strong> {formData.weightClass}
              </div>
              <div>
                <strong>Commodity:</strong> {formData.commodity}
              </div>
              <div>
                <strong>Weight:</strong> {formData.weight}
              </div>
              <div>
                <strong>Rate:</strong> ${formData.rate.toLocaleString()}
              </div>
              <div>
                <strong>Pickup Date:</strong> {formData.pickupDate}
              </div>
              <div>
                <strong>Delivery Date:</strong> {formData.deliveryDate}
              </div>
              <div>
                <strong>Shipper:</strong> {formData.shipperName}
              </div>
              <div>
                <strong>Broker:</strong> {formData.brokerInitials}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}
          >
            <button
              onClick={() => setPreviewMode(false)}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Back to Form
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              {isSubmitting ? 'Creating Load...' : 'Create Load'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Comprehensive Load Form</h1>
    </div>
  );
}
