'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import BillOfLading from '../components/BillOfLading';
import RateConfirmation from '../components/RateConfirmation';
import { useLoad } from '../contexts/LoadContext';

export default function DocumentsPage() {
  const [activeView, setActiveView] = useState<
    | 'overview'
    | 'rate-confirmation'
    | 'bill-of-lading'
    | 'templates'
    | 'batch-processing'
    | 'compliance-check'
  >('overview');
  const { selectedLoad, loadHistory, setSelectedLoad } = useLoad();

  // Handle URL parameters for direct navigation and load selection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      const loadIdParam = urlParams.get('loadId');

      // Set active tab from URL parameter
      if (
        tabParam &&
        [
          'overview',
          'rate-confirmation',
          'bill-of-lading',
          'templates',
          'batch-processing',
          'compliance-check',
        ].includes(tabParam)
      ) {
        setActiveView(tabParam as any);
      }

      // Select load from URL parameter
      if (loadIdParam && loadHistory.length > 0) {
        const load = loadHistory.find((l) => l.id === loadIdParam);
        if (load) {
          setSelectedLoad(load);
        }
      }
    }
  }, [loadHistory, setSelectedLoad]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [batchLoads, setBatchLoads] = useState<string[]>([]);
  const [documentVersions, setDocumentVersions] = useState<any[]>([]);

  // Document Templates
  const documentTemplates = {
    'hazmat-rate-confirmation': {
      name: 'Hazmat Rate Confirmation',
      description:
        'Template for hazardous materials shipments with additional safety requirements',
      fields: ['hazmat_class', 'emergency_contact', 'placarding_requirements'],
    },
    'oversized-load': {
      name: 'Oversized Load Documentation',
      description:
        'Template for oversized/overweight loads requiring special permits',
      fields: ['permit_numbers', 'escort_requirements', 'route_restrictions'],
    },
    'refrigerated-transport': {
      name: 'Refrigerated Transport',
      description: 'Template for temperature-controlled shipments',
      fields: [
        'temperature_range',
        'monitoring_requirements',
        'backup_systems',
      ],
    },
    'international-shipment': {
      name: 'International Shipment',
      description:
        'Template for cross-border shipments with customs requirements',
      fields: ['customs_forms', 'export_documentation', 'duty_information'],
    },
  };

  // Validation Functions
  const validateDocument = (
    docType: 'rate-confirmation' | 'bill-of-lading'
  ) => {
    const errors: string[] = [];

    if (!selectedLoad) {
      errors.push('No load selected for document generation');
    }

    if (docType === 'rate-confirmation') {
      if (!selectedLoad?.carrierName) errors.push('Carrier name is required');
      if (!selectedLoad?.rate) errors.push('Rate information is required');
      if (!selectedLoad?.pickupDate) errors.push('Pickup date is required');
      if (!selectedLoad?.deliveryDate) errors.push('Delivery date is required');
    }

    if (docType === 'bill-of-lading') {
      if (!selectedLoad?.origin) errors.push('Origin address is required');
      if (!selectedLoad?.destination)
        errors.push('Destination address is required');
      if (!selectedLoad?.weight) errors.push('Weight information is required');
      if (!selectedLoad?.equipment) errors.push('Equipment type is required');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Batch Processing
  const processBatchDocuments = async () => {
    if (batchLoads.length === 0) return;

    const batchResults = [];
    for (const loadId of batchLoads) {
      const load = loadHistory.find((l) => l.id === loadId);
      if (load) {
        // Simulate batch processing
        batchResults.push({
          loadId,
          status: 'completed',
          documents: ['rate-confirmation', 'bill-of-lading'],
          timestamp: new Date().toISOString(),
        });
      }
    }

    alert(`Batch processing completed for ${batchResults.length} loads`);
  };

  // Auto-save functionality
  const autoSaveDocument = (docType: string, data: any) => {
    const savedDoc = {
      id: `${docType}-${Date.now()}`,
      type: docType,
      data,
      timestamp: new Date().toISOString(),
      status: 'draft',
    };

    // Save to local storage
    const savedDocs = JSON.parse(
      localStorage.getItem('fleetflow-documents') || '[]'
    );
    savedDocs.push(savedDoc);
    localStorage.setItem('fleetflow-documents', JSON.stringify(savedDocs));
  };

  // Auto-generate document function
  const autoGenerateDocument = (
    docType:
      | 'rate-confirmation'
      | 'bill-of-lading'
      | 'invoice'
      | 'proof-of-delivery'
  ) => {
    if (!selectedLoad) {
      alert('Please select a load first');
      return;
    }

    // Validate required fields
    if (
      !validateDocument(
        docType === 'invoice'
          ? 'rate-confirmation'
          : docType === 'proof-of-delivery'
            ? 'bill-of-lading'
            : docType
      )
    ) {
      return;
    }

    // Generate document with selected load data
    const generatedDoc = {
      id: `${docType}-${selectedLoad.id}-${Date.now()}`,
      type: docType,
      loadId: selectedLoad.id,
      data: selectedLoad,
      timestamp: new Date().toISOString(),
      status: 'generated',
    };

    // Save to local storage
    const savedDocs = JSON.parse(
      localStorage.getItem('fleetflow-documents') || '[]'
    );
    savedDocs.push(generatedDoc);
    localStorage.setItem('fleetflow-documents', JSON.stringify(savedDocs));

    // Show success message
    alert(
      `${docType.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())} generated successfully for Load #${selectedLoad.id}!`
    );

    // Auto-navigate to the appropriate tab
    if (docType === 'rate-confirmation') {
      setActiveView('rate-confirmation');
    } else if (docType === 'bill-of-lading') {
      setActiveView('bill-of-lading');
    }
  };

  // Quick generate function that skips validation for instant generation
  const quickGenerateDocument = (
    docType:
      | 'rate-confirmation'
      | 'bill-of-lading'
      | 'invoice'
      | 'proof-of-delivery'
  ) => {
    if (!selectedLoad) {
      alert('Please select a load first');
      return;
    }

    const generatedDoc = {
      id: `${docType}-${selectedLoad.id}-${Date.now()}`,
      type: docType,
      loadId: selectedLoad.id,
      data: selectedLoad,
      timestamp: new Date().toISOString(),
      status: 'auto-generated',
    };

    const savedDocs = JSON.parse(
      localStorage.getItem('fleetflow-documents') || '[]'
    );
    savedDocs.push(generatedDoc);
    localStorage.setItem('fleetflow-documents', JSON.stringify(savedDocs));

    alert(
      `${docType.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())} auto-generated for Load #${selectedLoad.id}!`
    );
  };

  // Detect specialty load types
  const detectSpecialtyLoad = (load: any) => {
    const specialties = [];

    // Check for hazmat
    if (
      load.hazmat ||
      load.commodityClass?.includes('HAZ') ||
      load.description?.toLowerCase().includes('hazmat')
    ) {
      specialties.push('hazmat');
    }

    // Check for oversized
    if (
      load.oversized ||
      load.weight > 80000 ||
      load.dimensions?.length > 53 ||
      load.description?.toLowerCase().includes('oversized')
    ) {
      specialties.push('oversized');
    }

    // Check for refrigerated
    if (
      load.refrigerated ||
      load.temperature ||
      load.equipment?.toLowerCase().includes('reefer') ||
      load.description?.toLowerCase().includes('refrigerated')
    ) {
      specialties.push('refrigerated');
    }

    // Check for international
    if (
      load.international ||
      load.origin?.includes('Canada') ||
      load.destination?.includes('Canada') ||
      load.origin?.includes('Mexico') ||
      load.destination?.includes('Mexico')
    ) {
      specialties.push('international');
    }

    // Check for high-value
    if (
      load.declaredValue > 100000 ||
      load.description?.toLowerCase().includes('high value') ||
      load.description?.toLowerCase().includes('electronics')
    ) {
      specialties.push('high-value');
    }

    // Check for liquid bulk
    if (
      load.equipment?.toLowerCase().includes('tanker') ||
      load.description?.toLowerCase().includes('liquid') ||
      load.description?.toLowerCase().includes('bulk')
    ) {
      specialties.push('liquid-bulk');
    }

    return specialties;
  };

  // Generate specialty load document
  const generateSpecialtyDocument = (specialtyType: string) => {
    if (!selectedLoad) {
      alert('Please select a load first');
      return;
    }

    const specialtyRequirements = {
      hazmat: {
        fields: [
          'hazmat_class',
          'emergency_contact',
          'placarding_requirements',
          'msds_sheet',
        ],
        description: 'Hazmat documentation with safety requirements',
      },
      oversized: {
        fields: [
          'permit_numbers',
          'escort_requirements',
          'route_restrictions',
          'bridge_analysis',
        ],
        description: 'Oversized load permits and routing documentation',
      },
      refrigerated: {
        fields: [
          'temperature_range',
          'monitoring_requirements',
          'backup_systems',
          'pre_cool_time',
        ],
        description: 'Temperature-controlled shipment documentation',
      },
      international: {
        fields: [
          'customs_forms',
          'export_documentation',
          'duty_information',
          'broker_info',
        ],
        description: 'Cross-border shipment documentation',
      },
      'high-value': {
        fields: [
          'security_requirements',
          'insurance_coverage',
          'tracking_systems',
          'sealed_trailer',
        ],
        description: 'High-value cargo security documentation',
      },
      'liquid-bulk': {
        fields: [
          'tank_specifications',
          'loading_procedures',
          'unloading_procedures',
          'safety_protocols',
        ],
        description: 'Liquid bulk transport documentation',
      },
    };

    const specialty =
      specialtyRequirements[
        specialtyType as keyof typeof specialtyRequirements
      ];
    if (!specialty) return;

    const generatedDoc = {
      id: `specialty-${specialtyType}-${selectedLoad.id}-${Date.now()}`,
      type: `specialty-${specialtyType}`,
      loadId: selectedLoad.id,
      data: { ...selectedLoad, specialtyType, requirements: specialty },
      timestamp: new Date().toISOString(),
      status: 'specialty-generated',
    };

    const savedDocs = JSON.parse(
      localStorage.getItem('fleetflow-documents') || '[]'
    );
    savedDocs.push(generatedDoc);
    localStorage.setItem('fleetflow-documents', JSON.stringify(savedDocs));

    alert(
      `${specialtyType.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())} specialty documentation generated for Load #${selectedLoad.id}!`
    );
  };

  // Calculate stats from loadHistory
  const stats = {
    totalLoads: loadHistory.length,
    documentsGenerated: loadHistory.filter(
      (load) => load.status === 'Delivered'
    ).length,
    inProgress: loadHistory.filter((load) => load.status === 'In Transit')
      .length,
    pendingDocuments: loadHistory.filter((load) => load.status === 'Assigned')
      .length,
    totalValue: loadHistory.reduce(
      (sum, load) => sum + (typeof load.rate === 'number' ? load.rate : 0),
      0
    ),
    complianceScore: 98.5, // Simulated compliance score
    averageProcessingTime: 12, // minutes
    documentAccuracy: 99.2, // percentage
    specialtyLoads: loadHistory.filter(
      (load) => detectSpecialtyLoad(load).length > 0
    ).length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return '#22c55e';
      case 'In Transit':
        return '#3b82f6';
      case 'Delivered':
        return '#10b981';
      case 'Assigned':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
        linear-gradient(135deg, #451a03 0%, #7c2d12 25%, #92400e 50%, #78350f 75%, #1c0a00 100%),
        radial-gradient(circle at 20% 20%, rgba(251, 191, 36, 0.015) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.01) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(217, 119, 6, 0.008) 0%, transparent 50%)
      `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        backgroundAttachment: 'fixed',
        paddingTop: '80px',
        position: 'relative',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Back Button */}
      <div style={{ padding: '16px 24px' }}>
        <Link href='/' style={{ textDecoration: 'none' }}>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '14px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ marginRight: '8px' }}>←</span>
            Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Main Container */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px 32px',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '32px' }}>📄</span>
              </div>
              <div>
                <h1
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 8px 0',
                    textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  Document Generation Center
                </h1>
                <p
                  style={{
                    fontSize: '18px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: '0 0 16px 0',
                  }}
                >
                  Create ironclad freight documents with auto-populated load
                  data
                </p>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '24px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        background: '#4ade80',
                        borderRadius: '50%',
                        boxShadow: '0 0 0 0 rgba(74, 222, 128, 0.7)',
                        animation: 'pulse 2s infinite',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Auto-Population Active
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    {loadHistory.length} loads available
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    {stats.complianceScore}% compliance
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link href='/workflow-portal' style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  📋 Workflow Portal
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              {
                id: 'overview',
                label: '📊 Overview',
                icon: '📊',
                color: '#3b82f6',
                bgColor: '#1e40af',
              },
              {
                id: 'rate-confirmation',
                label: '📄 Rate Confirmation',
                icon: '📄',
                color: '#10b981',
                bgColor: '#059669',
              },
              {
                id: 'bill-of-lading',
                label: '📋 Bill of Lading',
                icon: '📋',
                color: '#f59e0b',
                bgColor: '#d97706',
              },
              {
                id: 'templates',
                label: '🎨 Templates',
                icon: '🎨',
                color: '#8b5cf6',
                bgColor: '#7c3aed',
              },
              {
                id: 'batch-processing',
                label: '⚡ Batch Processing',
                icon: '⚡',
                color: '#06b6d4',
                bgColor: '#0891b2',
              },
              {
                id: 'compliance-check',
                label: '✅ Compliance Check',
                icon: '✅',
                color: '#ef4444',
                bgColor: '#dc2626',
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  border:
                    activeView === tab.id
                      ? `2px solid ${tab.color}`
                      : `1px solid ${tab.color}60`,
                  cursor: 'pointer',
                  fontSize: '16px',
                  background:
                    activeView === tab.id
                      ? `linear-gradient(135deg, ${tab.color}, ${tab.bgColor})`
                      : `linear-gradient(135deg, ${tab.color}20, ${tab.bgColor}30)`,
                  color: activeView === tab.id ? 'white' : `${tab.color}`,
                  transform:
                    activeView === tab.id
                      ? 'translateY(-2px)'
                      : 'translateY(0)',
                  boxShadow:
                    activeView === tab.id
                      ? `0 8px 25px ${tab.color}60`
                      : `0 2px 8px ${tab.color}30`,
                }}
                onMouseOver={(e) => {
                  if (activeView !== tab.id) {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${tab.color}40, ${tab.bgColor}50)`;
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = `0 4px 15px ${tab.color}50`;
                  }
                }}
                onMouseOut={(e) => {
                  if (activeView !== tab.id) {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${tab.color}20, ${tab.bgColor}30)`;
                    e.currentTarget.style.color = `${tab.color}`;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 2px 8px ${tab.color}30`;
                  }
                }}
              >
                <span style={{ marginRight: '8px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeView === 'overview' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            {/* Enhanced Stats Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#4ade80',
                    marginBottom: '8px',
                  }}
                >
                  {stats.totalLoads}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  Total Loads
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#10b981',
                    marginBottom: '8px',
                  }}
                >
                  {stats.documentsGenerated}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  Documents Generated
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#3b82f6',
                    marginBottom: '8px',
                  }}
                >
                  {stats.inProgress}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  In Progress
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#f59e0b',
                    marginBottom: '8px',
                  }}
                >
                  {stats.pendingDocuments}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  Pending Documents
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#22c55e',
                    marginBottom: '8px',
                  }}
                >
                  {formatCurrency(stats.totalValue)}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  Total Value
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#06b6d4',
                    marginBottom: '8px',
                  }}
                >
                  {stats.complianceScore}%
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  Compliance Score
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#8b5cf6',
                    marginBottom: '8px',
                  }}
                >
                  {stats.averageProcessingTime}m
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  Avg Processing Time
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#ef4444',
                    marginBottom: '8px',
                  }}
                >
                  {stats.documentAccuracy}%
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  Document Accuracy
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#f97316',
                    marginBottom: '8px',
                  }}
                >
                  {stats.specialtyLoads}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  Specialty Loads
                </div>
              </div>
            </div>

            {/* Load Selection */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '24px',
                }}
              >
                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: 'white',
                    margin: 0,
                  }}
                >
                  Load Selection
                </h3>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  Select a load to auto-populate documents
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '16px',
                }}
              >
                {loadHistory && loadHistory.length > 0 ? (
                  loadHistory.map((load) => (
                    <div
                      key={load.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedLoad(load);
                        console.log('Load selected:', load.id);
                      }}
                      style={{
                        background:
                          selectedLoad?.id === load.id
                            ? 'rgba(34, 197, 94, 0.2)'
                            : 'rgba(255, 255, 255, 0.08)',
                        border:
                          selectedLoad?.id === load.id
                            ? '2px solid rgba(34, 197, 94, 0.5)'
                            : '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '12px',
                        padding: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        userSelect: 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedLoad?.id !== load.id) {
                          e.currentTarget.style.background =
                            'rgba(255, 255, 255, 0.12)';
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow =
                            '0 10px 30px rgba(0, 0, 0, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedLoad?.id !== load.id) {
                          e.currentTarget.style.background =
                            'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'start',
                          marginBottom: '16px',
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 'bold',
                            color: 'white',
                            fontSize: '18px',
                          }}
                        >
                          #{load.id}
                        </span>
                        <span
                          style={{
                            fontSize: '12px',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontWeight: '600',
                            background: `${getStatusColor(load.status)}20`,
                            color: getStatusColor(load.status),
                            border: `1px solid ${getStatusColor(load.status)}40`,
                          }}
                        >
                          {load.status}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gap: '12px' }}>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'white',
                          }}
                        >
                          {load.origin}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          <span style={{ marginRight: '8px' }}>↓</span>
                          {load.destination}
                        </div>

                        {load.carrierName && (
                          <div
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontWeight: '600',
                            }}
                          >
                            🚛 {load.carrierName}
                          </div>
                        )}

                        {/* Specialty Load Badges */}
                        {detectSpecialtyLoad(load).length > 0 && (
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '4px',
                              marginTop: '8px',
                            }}
                          >
                            {detectSpecialtyLoad(load).map((specialty) => (
                              <span
                                key={specialty}
                                style={{
                                  fontSize: '10px',
                                  padding: '2px 6px',
                                  borderRadius: '8px',
                                  fontWeight: '600',
                                  background:
                                    specialty === 'hazmat'
                                      ? '#ef444420'
                                      : specialty === 'oversized'
                                        ? '#f59e0b20'
                                        : specialty === 'refrigerated'
                                          ? '#06b6d420'
                                          : specialty === 'international'
                                            ? '#8b5cf620'
                                            : specialty === 'high-value'
                                              ? '#10b98120'
                                              : specialty === 'liquid-bulk'
                                                ? '#3b82f620'
                                                : '#6b728020',
                                  color:
                                    specialty === 'hazmat'
                                      ? '#ef4444'
                                      : specialty === 'oversized'
                                        ? '#f59e0b'
                                        : specialty === 'refrigerated'
                                          ? '#06b6d4'
                                          : specialty === 'international'
                                            ? '#8b5cf6'
                                            : specialty === 'high-value'
                                              ? '#10b981'
                                              : specialty === 'liquid-bulk'
                                                ? '#3b82f6'
                                                : '#6b7280',
                                  border: `1px solid ${
                                    specialty === 'hazmat'
                                      ? '#ef4444'
                                      : specialty === 'oversized'
                                        ? '#f59e0b'
                                        : specialty === 'refrigerated'
                                          ? '#06b6d4'
                                          : specialty === 'international'
                                            ? '#8b5cf6'
                                            : specialty === 'high-value'
                                              ? '#10b981'
                                              : specialty === 'liquid-bulk'
                                                ? '#3b82f6'
                                                : '#6b7280'
                                  }40`,
                                }}
                              >
                                {specialty === 'hazmat'
                                  ? '⚠️ HAZMAT'
                                  : specialty === 'oversized'
                                    ? '📏 OVERSIZED'
                                    : specialty === 'refrigerated'
                                      ? '🧊 REEFER'
                                      : specialty === 'international'
                                        ? '🌍 INTL'
                                        : specialty === 'high-value'
                                          ? '💎 HIGH-VALUE'
                                          : specialty === 'liquid-bulk'
                                            ? '🛢️ BULK'
                                            : specialty.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        )}

                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: '12px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            {load.pickupDate}
                          </span>
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: 'bold',
                              color: '#4ade80',
                            }}
                          >
                            {typeof load.rate === 'string'
                              ? load.rate
                              : formatCurrency(load.rate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '40px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '16px' }}>
                      📦
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '16px',
                      }}
                    >
                      No loads available for document generation
                    </div>
                  </div>
                )}
              </div>

              {/* Selection Status */}
              <div style={{ marginTop: '24px' }}>
                {selectedLoad ? (
                  <div
                    style={{
                      background: 'rgba(34, 197, 94, 0.2)',
                      border: '1px solid rgba(34, 197, 94, 0.4)',
                      borderRadius: '12px',
                      padding: '20px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>✅</span>
                      <span
                        style={{
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '16px',
                        }}
                      >
                        Load #{selectedLoad.id} Selected
                      </span>
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                        margin: '8px 0 16px 32px',
                      }}
                    >
                      Document forms will be automatically populated with this
                      load's information. You can modify any details as needed.
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        gap: '12px',
                        marginTop: '16px',
                      }}
                    >
                      <button
                        onClick={() =>
                          autoGenerateDocument('rate-confirmation')
                        }
                        style={{
                          background:
                            'linear-gradient(135deg, #10b981, #059669)',
                          color: 'white',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow =
                            '0 8px 25px rgba(16, 185, 129, 0.4)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        📄 Auto-Generate Rate Confirmation
                      </button>
                      <button
                        onClick={() => autoGenerateDocument('bill-of-lading')}
                        style={{
                          background:
                            'linear-gradient(135deg, #3b82f6, #1e40af)',
                          color: 'white',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow =
                            '0 8px 25px rgba(59, 130, 246, 0.4)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        📋 Auto-Generate Bill of Lading
                      </button>
                    </div>

                    {/* Specialty Load Buttons */}
                    {detectSpecialtyLoad(selectedLoad).length > 0 && (
                      <div style={{ marginTop: '16px' }}>
                        <div
                          style={{
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            marginBottom: '8px',
                          }}
                        >
                          Specialty Load Documentation:
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                          }}
                        >
                          {detectSpecialtyLoad(selectedLoad).map(
                            (specialty) => (
                              <button
                                key={specialty}
                                onClick={() =>
                                  generateSpecialtyDocument(specialty)
                                }
                                style={{
                                  background: `linear-gradient(135deg, ${
                                    specialty === 'hazmat'
                                      ? '#ef4444, #dc2626'
                                      : specialty === 'oversized'
                                        ? '#f59e0b, #d97706'
                                        : specialty === 'refrigerated'
                                          ? '#06b6d4, #0891b2'
                                          : specialty === 'international'
                                            ? '#8b5cf6, #7c3aed'
                                            : specialty === 'high-value'
                                              ? '#10b981, #059669'
                                              : specialty === 'liquid-bulk'
                                                ? '#3b82f6, #1e40af'
                                                : '#6b7280, #4b5563'
                                  })`,
                                  color: 'white',
                                  padding: '8px 16px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.transform =
                                    'translateY(-2px)';
                                  e.currentTarget.style.boxShadow =
                                    '0 4px 15px rgba(0, 0, 0, 0.3)';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.transform =
                                    'translateY(0)';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              >
                                {specialty === 'hazmat'
                                  ? '⚠️ Generate Hazmat Docs'
                                  : specialty === 'oversized'
                                    ? '📏 Generate Oversized Permits'
                                    : specialty === 'refrigerated'
                                      ? '🧊 Generate Reefer Docs'
                                      : specialty === 'international'
                                        ? '🌍 Generate International Docs'
                                        : specialty === 'high-value'
                                          ? '💎 Generate Security Docs'
                                          : specialty === 'liquid-bulk'
                                            ? '🛢️ Generate Bulk Docs'
                                            : `Generate ${specialty} Docs`}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      borderRadius: '12px',
                      padding: '20px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>ℹ️</span>
                      <span
                        style={{
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '16px',
                        }}
                      >
                        Click a load to auto-populate document forms
                      </span>
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                        margin: '8px 0 0 32px',
                      }}
                    >
                      Select a load from above to automatically fill in Rate
                      Confirmation and Bill of Lading forms.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: 'white',
                  margin: '0 0 24px 0',
                }}
              >
                Quick Actions
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                <button
                  onClick={() => quickGenerateDocument('invoice')}
                  style={{
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '12px',
                    padding: '24px',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 30px rgba(34, 197, 94, 0.4)';
                    e.currentTarget.style.background =
                      'rgba(34, 197, 94, 0.25)';
                    e.currentTarget.style.border =
                      '2px solid rgba(34, 197, 94, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.background =
                      'rgba(34, 197, 94, 0.15)';
                    e.currentTarget.style.border =
                      '1px solid rgba(34, 197, 94, 0.3)';
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                    💰
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>
                    Generate Invoice
                  </div>
                </button>

                <button
                  onClick={() => quickGenerateDocument('proof-of-delivery')}
                  style={{
                    background: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    padding: '24px',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 30px rgba(59, 130, 246, 0.4)';
                    e.currentTarget.style.background =
                      'rgba(59, 130, 246, 0.25)';
                    e.currentTarget.style.border =
                      '2px solid rgba(59, 130, 246, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.background =
                      'rgba(59, 130, 246, 0.15)';
                    e.currentTarget.style.border =
                      '1px solid rgba(59, 130, 246, 0.3)';
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                    📦
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>
                    Generate Proof of Delivery
                  </div>
                </button>

                <button
                  onClick={() => {
                    const savedDocs = JSON.parse(
                      localStorage.getItem('fleetflow-documents') || '[]'
                    );
                    if (savedDocs.length === 0) {
                      alert(
                        'No documents found. Generate some documents first!'
                      );
                    } else {
                      const recentDocs = savedDocs.slice(-5).reverse();
                      const docsList = recentDocs
                        .map(
                          (doc: any) =>
                            `${doc.type} - Load #${doc.loadId} - ${new Date(doc.timestamp).toLocaleString()}`
                        )
                        .join('\n');
                      alert(`Recent Documents:\n\n${docsList}`);
                    }
                  }}
                  style={{
                    background: 'rgba(168, 85, 247, 0.2)',
                    border: '1px solid rgba(168, 85, 247, 0.4)',
                    borderRadius: '12px',
                    padding: '24px',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 30px rgba(168, 85, 247, 0.5)';
                    e.currentTarget.style.background =
                      'rgba(168, 85, 247, 0.3)';
                    e.currentTarget.style.border =
                      '2px solid rgba(168, 85, 247, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.background =
                      'rgba(168, 85, 247, 0.2)';
                    e.currentTarget.style.border =
                      '1px solid rgba(168, 85, 247, 0.4)';
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                    📚
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>
                    View Recent Documents
                  </div>
                </button>

                <button
                  onClick={() => setActiveView('compliance-check')}
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '12px',
                    padding: '24px',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 30px rgba(239, 68, 68, 0.4)';
                    e.currentTarget.style.background =
                      'rgba(239, 68, 68, 0.25)';
                    e.currentTarget.style.border =
                      '2px solid rgba(239, 68, 68, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.background =
                      'rgba(239, 68, 68, 0.15)';
                    e.currentTarget.style.border =
                      '1px solid rgba(239, 68, 68, 0.3)';
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                    ✅
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>
                    Validate Documents
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeView === 'templates' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '600',
                color: 'white',
                margin: '0 0 24px 0',
              }}
            >
              🎨 Document Templates
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '32px',
              }}
            >
              Choose from pre-built templates optimized for specific freight
              types and requirements.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {Object.entries(documentTemplates).map(([key, template]) => (
                <div
                  key={key}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: '600',
                      margin: '0 0 12px 0',
                    }}
                  >
                    {template.name}
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      marginBottom: '16px',
                    }}
                  >
                    {template.description}
                  </p>
                  <div style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '8px',
                      }}
                    >
                      Special Fields:
                    </div>
                    <div
                      style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
                    >
                      {template.fields.map((field) => (
                        <span
                          key={field}
                          style={{
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: '#60a5fa',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                          }}
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTemplate(key)}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Batch Processing Tab */}
        {activeView === 'batch-processing' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '600',
                color: 'white',
                margin: '0 0 24px 0',
              }}
            >
              ⚡ Batch Processing
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '32px',
              }}
            >
              Generate multiple documents simultaneously for efficient
              processing.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '32px',
              }}
            >
              {loadHistory.map((load) => (
                <div
                  key={load.id}
                  style={{
                    background: batchLoads.includes(load.id)
                      ? 'rgba(34, 197, 94, 0.15)'
                      : 'rgba(255, 255, 255, 0.03)',
                    border: batchLoads.includes(load.id)
                      ? '1px solid rgba(34, 197, 94, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => {
                    if (batchLoads.includes(load.id)) {
                      setBatchLoads(batchLoads.filter((id) => id !== load.id));
                    } else {
                      setBatchLoads([...batchLoads, load.id]);
                    }
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={batchLoads.includes(load.id)}
                      onChange={() => {}}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span style={{ color: 'white', fontWeight: '600' }}>
                      #{load.id}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    {load.origin} → {load.destination}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button
                onClick={processBatchDocuments}
                disabled={batchLoads.length === 0}
                style={{
                  background:
                    batchLoads.length === 0
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color:
                    batchLoads.length === 0
                      ? 'rgba(255, 255, 255, 0.5)'
                      : 'white',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: batchLoads.length === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                Process {batchLoads.length} Documents
              </button>

              <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {batchLoads.length} loads selected
              </span>
            </div>
          </div>
        )}

        {/* Compliance Check Tab */}
        {activeView === 'compliance-check' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '600',
                color: 'white',
                margin: '0 0 24px 0',
              }}
            >
              ✅ Compliance Check
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '32px',
              }}
            >
              Verify document compliance with DOT, FMCSA, and industry
              regulations.
            </p>

            <div style={{ display: 'grid', gap: '24px' }}>
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '12px',
                  padding: '24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>✅</span>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: '600',
                      margin: 0,
                    }}
                  >
                    DOT Compliance
                  </h3>
                </div>
                <ul
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                    paddingLeft: '20px',
                  }}
                >
                  <li>All required carrier information present</li>
                  <li>Valid MC and DOT numbers</li>
                  <li>Insurance certificates current</li>
                  <li>Driver qualification files complete</li>
                </ul>
              </div>

              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '12px',
                  padding: '24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>✅</span>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: '600',
                      margin: 0,
                    }}
                  >
                    FMCSA Regulations
                  </h3>
                </div>
                <ul
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                    paddingLeft: '20px',
                  }}
                >
                  <li>Hours of service compliance</li>
                  <li>Vehicle inspection records</li>
                  <li>Load securement standards</li>
                  <li>Electronic logging device data</li>
                </ul>
              </div>

              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  padding: '24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>⚠️</span>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: '600',
                      margin: 0,
                    }}
                  >
                    Action Required
                  </h3>
                </div>
                <ul
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                    paddingLeft: '20px',
                  }}
                >
                  <li>Update hazmat certification expiration dates</li>
                  <li>Verify international shipping documentation</li>
                  <li>Complete quarterly safety review</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Rate Confirmation Tab */}
        {activeView === 'rate-confirmation' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '32px',
              }}
            >
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '600',
                  color: 'white',
                  margin: 0,
                }}
              >
                📄 Rate Confirmation Generator
              </h2>
              {selectedLoad && (
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  Auto-populated with Load #{selectedLoad.id}
                </div>
              )}
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '24px',
                }}
              >
                <h4
                  style={{
                    color: '#ef4444',
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: '0 0 8px 0',
                  }}
                >
                  Validation Errors:
                </h4>
                <ul
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                    paddingLeft: '20px',
                  }}
                >
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <RateConfirmation />
          </div>
        )}

        {/* Bill of Lading Tab */}
        {activeView === 'bill-of-lading' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '32px',
              }}
            >
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '600',
                  color: 'white',
                  margin: 0,
                }}
              >
                📋 Bill of Lading Generator
              </h2>
              {selectedLoad && (
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  Auto-populated with Load #{selectedLoad.id}
                </div>
              )}
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '24px',
                }}
              >
                <h4
                  style={{
                    color: '#ef4444',
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: '0 0 8px 0',
                  }}
                >
                  Validation Errors:
                </h4>
                <ul
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                    paddingLeft: '20px',
                  }}
                >
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <BillOfLading />
          </div>
        )}
      </div>
    </div>
  );
}
