'use client';

import React, { useRef, useState } from 'react';

interface Contract {
  id: string;
  clientName: string;
  brokerName: string;
  effectiveDate: string;
  expirationDate: string;
  commissionRate: number;
  contractValue: number;
  status:
    | 'draft'
    | 'sent_to_client'
    | 'with_client'
    | 'client_completed'
    | 'returned_to_broker'
    | 'fully_executed';
  warehouseServices: {
    storage: boolean;
    crossDocking: boolean;
    inventory: boolean;
    fulfillment: boolean;
    customsHandling: boolean;
  };
  termsConditions: string;
  specialProvisions: string;
  signatureData?: string;
  clientSignature?: string;
  brokerSignature?: string;
  createdAt: string;
  lastModified: string;
}

interface Load {
  id: string;
  origin: string;
  destination: string;
  weight: string;
  rate: number;
  status: string;
  pickupDate: string;
  deliveryDate: string;
}

export default function ContractManagement() {
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: 'CTR-001',
      clientName: 'ABC Logistics Inc.',
      brokerName: 'FleetFlow Transportation',
      effectiveDate: '2024-01-01',
      expirationDate: '2024-12-31',
      commissionRate: 15,
      contractValue: 250000,
      status: 'fully_executed',
      warehouseServices: {
        storage: true,
        crossDocking: true,
        inventory: false,
        fulfillment: true,
        customsHandling: false,
      },
      termsConditions:
        'Standard transportation brokerage terms apply. Payment due within 30 days of invoice.',
      specialProvisions: 'Expedited service available with 24-hour notice.',
      createdAt: '2024-01-01T10:00:00Z',
      lastModified: '2024-01-15T14:30:00Z',
    },
  ]);

  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<
    'details' | 'signatures' | 'comments' | 'notifications'
  >('details');
  const [showContractList, setShowContractList] = useState(true);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [contractStatus, setContractStatus] =
    useState<Contract['status']>('draft');

  // Form states
  const [clientName, setClientName] = useState('');
  const [brokerName, setBrokerName] = useState('FleetFlow Transportation');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [commissionRate, setCommissionRate] = useState(15);
  const [contractValue, setContractValue] = useState(0);
  const [termsConditions, setTermsConditions] = useState('');
  const [specialProvisions, setSpecialProvisions] = useState('');
  const [warehouseServices, setWarehouseServices] = useState({
    storage: false,
    crossDocking: false,
    inventory: false,
    fulfillment: false,
    customsHandling: false,
  });

  // Signature states
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState<string>('');

  // Mock loads data
  const [loads] = useState<Load[]>([
    {
      id: 'FL-2024-001',
      origin: 'Los Angeles, CA',
      destination: 'Phoenix, AZ',
      weight: '45,000 lbs',
      rate: 2500,
      status: 'In Transit',
      pickupDate: '2024-01-20',
      deliveryDate: '2024-01-22',
    },
    {
      id: 'FL-2024-002',
      origin: 'Chicago, IL',
      destination: 'Detroit, MI',
      weight: '38,000 lbs',
      rate: 1800,
      status: 'Delivered',
      pickupDate: '2024-01-18',
      deliveryDate: '2024-01-19',
    },
  ]);

  // Calculate financial metrics
  const calculateBrokerCommission = (value: number, rate: number) => {
    return (value * rate) / 100;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTotalContractValue = () => {
    return (
      contractValue + calculateBrokerCommission(contractValue, commissionRate)
    );
  };

  // Signature handling
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureData(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignatureData('');
      }
    }
  };

  // Contract actions
  const handleSaveContract = () => {
    const newContract: Contract = {
      id: `CTR-${String(contracts.length + 1).padStart(3, '0')}`,
      clientName,
      brokerName,
      effectiveDate,
      expirationDate,
      commissionRate,
      contractValue,
      status: contractStatus,
      warehouseServices,
      termsConditions,
      specialProvisions,
      signatureData,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    setContracts([...contracts, newContract]);
    setIsCreatingNew(false);
    resetForm();
  };

  const resetForm = () => {
    setClientName('');
    setBrokerName('FleetFlow Transportation');
    setEffectiveDate('');
    setExpirationDate('');
    setCommissionRate(15);
    setContractValue(0);
    setTermsConditions('');
    setSpecialProvisions('');
    setWarehouseServices({
      storage: false,
      crossDocking: false,
      inventory: false,
      fulfillment: false,
      customsHandling: false,
    });
    setSignatureData('');
    clearSignature();
  };

  const handleExportContract = () => {
    const contractData = {
      clientName,
      brokerName,
      effectiveDate,
      expirationDate,
      commissionRate,
      contractValue,
      warehouseServices,
      termsConditions,
      specialProvisions,
    };

    const contractHtml = `
      <html>
        <head>
          <title>Transportation Broker Contract</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .signature-section { margin-top: 50px; }
          </style>
        </head>
        <body>
          <div class=""header"">
            <h1>Transportation Broker Contract Agreement</h1>
          </div>
          <div class=""section"">
            <h3>Contract Details</h3>
            <p><strong>Client:</strong> ${contractData.clientName}</p>
            <p><strong>Broker:</strong> ${contractData.brokerName}</p>
            <p><strong>Effective Date:</strong> ${contractData.effectiveDate}</p>
            <p><strong>Expiration Date:</strong> ${contractData.expirationDate}</p>
            <p><strong>Commission Rate:</strong> ${contractData.commissionRate}%</p>
            <p><strong>Contract Value:</strong> ${formatCurrency(contractData.contractValue)}</p>
          </div>
          <div class=""section"">
            <h3>Warehousing Services</h3>
            <ul>
              ${contractData.warehouseServices.storage ? '<li>Storage Services</li>' : ''}
              ${contractData.warehouseServices.crossDocking ? '<li>Cross-Docking</li>' : ''}
              ${contractData.warehouseServices.inventory ? '<li>Inventory Management</li>' : ''}
              ${contractData.warehouseServices.fulfillment ? '<li>Order Fulfillment</li>' : ''}
              ${contractData.warehouseServices.customsHandling ? '<li>Customs Handling</li>' : ''}
            </ul>
          </div>
          <div class=""section"">
            <h3>Terms and Conditions</h3>
            <p>${contractData.termsConditions}</p>
          </div>
          <div class=""section"">
            <h3>Special Provisions</h3>
            <p>${contractData.specialProvisions}</p>
          </div>
          <div class=""signature-section"">
            <p>Client Signature: ___________________________ Date: ___________</p>
            <br>
            <p>Broker Signature: ___________________________ Date: ___________</p>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([contractHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contract-${clientName.replace(/\s+/g, '-').toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = () => {
    switch (contractStatus) {
      case 'draft':
        return (
          <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>📝</span>
        );
      case 'sent_to_client':
        return (
          <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>📤</span>
        );
      case 'with_client':
        return (
          <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>👤</span>
        );
      case 'client_completed':
        return (
          <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>✅</span>
        );
      case 'returned_to_broker':
        return (
          <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>🔄</span>
        );
      case 'fully_executed':
        return (
          <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>🎉</span>
        );
      default:
        return (
          <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>📝</span>
        );
    }
  };

  const getStatusText = () => {
    switch (contractStatus) {
      case 'draft':
        return 'Draft - Broker Preparing';
      case 'sent_to_client':
        return 'Sent to Client';
      case 'with_client':
        return 'With Client for Review';
      case 'client_completed':
        return 'Client Completed - Awaiting Broker';
      case 'returned_to_broker':
        return 'Returned to Broker';
      case 'fully_executed':
        return 'Fully Executed';
      default:
        return 'Draft';
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)',
        backgroundSize: '100% 100%',
        padding: '40px',
        paddingTop: '100px',
        color: '#ffffff',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Back Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <button
              onClick={() => window.history.back()}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '12px 20px',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ marginRight: '8px', fontSize: '1.1rem' }}>←</span>
              Back
            </button>
          </div>

          {/* Main Header Content */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h1
                style={{
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#ffffff',
                }}
              >
                <span style={{ marginRight: '12px', fontSize: '2rem' }}>
                  📑
                </span>
                Transportation Broker Contract Management
              </h1>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {getStatusIcon()}
                  <span
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: '500',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    {getStatusText()}
                  </span>
                </div>
                <div
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  {contracts.length} Active Contracts
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowContractList(!showContractList)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ marginRight: '8px', fontSize: '1.1rem' }}>
                  📊
                </span>
                {showContractList ? 'Hide' : 'Show'} Contract List
              </button>

              <button
                onClick={() => setIsCreatingNew(!isCreatingNew)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(34, 197, 94, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(34, 197, 94, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(34, 197, 94, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ marginRight: '8px', fontSize: '1.1rem' }}>
                  📄
                </span>
                New Contract
              </button>

              <button
                onClick={handleSaveContract}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(59, 130, 246, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ marginRight: '8px', fontSize: '1.1rem' }}>
                  💼
                </span>
                Save Contract
              </button>

              <button
                onClick={handleExportContract}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(168, 85, 247, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(168, 85, 247, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(168, 85, 247, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ marginRight: '8px', fontSize: '1.1rem' }}>
                  📤
                </span>
                Export
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `CTR-${String(contracts.length + 1).padStart(3, '0')}`
                  );
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(245, 158, 11, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ marginRight: '8px', fontSize: '1.1rem' }}>
                  📄
                </span>
                Copy ID
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '32px',
            marginBottom: '32px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '16px',
          }}
        >
          {[
            { id: 'details', label: 'Contract Details', icon: '📋' },
            { id: 'signatures', label: 'Signatures', icon: '✒️' },
            { id: 'comments', label: 'Comments', icon: '📝' },
            { id: 'notifications', label: 'Notifications', icon: '⚠️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 20px',
                background:
                  activeTab === tab.id
                    ? 'rgba(59, 130, 246, 0.3)'
                    : 'rgba(255, 255, 255, 0.05)',
                border:
                  activeTab === tab.id
                    ? '1px solid rgba(59, 130, 246, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color:
                  activeTab === tab.id ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background =
                    'rgba(255, 255, 255, 0.05)';
                }
              }}
            >
              <span style={{ marginRight: '8px', fontSize: '1.1rem' }}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ display: 'flex', gap: '32px' }}>
          {/* Contract List */}
          {showContractList && (
            <div
              style={{
                flex: '0 0 350px',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                maxHeight: '600px',
                overflowY: 'auto',
              }}
            >
              <h3
                style={{
                  margin: '0 0 20px 0',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>
                  📋
                </span>
                Active Contracts
              </h3>
              {contracts.map((contract) => (
                <div
                  key={contract.id}
                  onClick={() => setSelectedContract(contract)}
                  style={{
                    padding: '16px',
                    background:
                      selectedContract?.id === contract.id
                        ? 'rgba(59, 130, 246, 0.2)'
                        : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    cursor: 'pointer',
                    border:
                      selectedContract?.id === contract.id
                        ? '1px solid rgba(59, 130, 246, 0.3)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedContract?.id !== contract.id) {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedContract?.id !== contract.id) {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                >
                  <div
                    style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    {contract.id}
                  </div>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '4px',
                    }}
                  >
                    {contract.clientName}
                  </div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    {formatCurrency(contract.contractValue)} •{' '}
                    {contract.commissionRate}%
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Main Content */}
          <div style={{ flex: 1 }}>
            {activeTab === 'details' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                {/* Contract Information */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 20px 0',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ marginRight: '12px', fontSize: '1.5rem' }}>
                      📋
                    </span>
                    Contract Information
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '20px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                        }}
                      >
                        Contract ID
                      </label>
                      <input
                        type='text'
                        value={`CTR-${String(contracts.length + 1).padStart(3, '0')}`}
                        readOnly
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          borderRadius: '8px',
                          color: '#374151',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                        }}
                      >
                        Status
                      </label>
                      <select
                        value={contractStatus}
                        onChange={(e) =>
                          setContractStatus(
                            e.target.value as Contract['status']
                          )
                        }
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          borderRadius: '8px',
                          color: '#374151',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      >
                        <option value='draft'>Draft</option>
                        <option value='sent_to_client'>Sent to Client</option>
                        <option value='with_client'>With Client</option>
                        <option value='client_completed'>
                          Client Completed
                        </option>
                        <option value='returned_to_broker'>
                          Returned to Broker
                        </option>
                        <option value='fully_executed'>Fully Executed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Client/Shipper Information */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 20px 0',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ marginRight: '8px', fontSize: '1.3rem' }}>
                      🏢
                    </span>
                    Client/Shipper Information
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '20px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                        }}
                      >
                        Client Name
                      </label>
                      <input
                        type='text'
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder='Enter client company name'
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          borderRadius: '8px',
                          color: '#374151',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                        }}
                      >
                        Broker Name
                      </label>
                      <input
                        type='text'
                        value={brokerName}
                        onChange={(e) => setBrokerName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          borderRadius: '8px',
                          color: '#374151',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Contract Dates */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 20px 0',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ marginRight: '12px', fontSize: '1.5rem' }}>
                      🗓️
                    </span>
                    Contract Dates
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '20px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                        }}
                      >
                        Effective Date
                      </label>
                      <input
                        type='date'
                        value={effectiveDate}
                        onChange={(e) => setEffectiveDate(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          borderRadius: '8px',
                          color: '#374151',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                        }}
                      >
                        Expiration Date
                      </label>
                      <input
                        type='date'
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          borderRadius: '8px',
                          color: '#374151',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Financial Terms */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 20px 0',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ marginRight: '12px', fontSize: '1.5rem' }}>
                      💵
                    </span>
                    Financial Terms
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '20px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                        }}
                      >
                        Contract Value
                      </label>
                      <input
                        type='number'
                        value={contractValue}
                        onChange={(e) =>
                          setContractValue(parseFloat(e.target.value) || 0)
                        }
                        placeholder='0'
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          borderRadius: '8px',
                          color: '#374151',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                        }}
                      >
                        Commission Rate (%)
                      </label>
                      <input
                        type='number'
                        value={commissionRate}
                        onChange={(e) =>
                          setCommissionRate(parseFloat(e.target.value) || 0)
                        }
                        min='0'
                        max='100'
                        step='0.1'
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          borderRadius: '8px',
                          color: '#374151',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Financial Summary */}
                  <div
                    style={{
                      marginTop: '20px',
                      padding: '16px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '16px',
                        textAlign: 'center',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginBottom: '4px',
                          }}
                        >
                          Contract Value
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                          {formatCurrency(contractValue)}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginBottom: '4px',
                          }}
                        >
                          Broker Commission
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                          {formatCurrency(
                            calculateBrokerCommission(
                              contractValue,
                              commissionRate
                            )
                          )}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginBottom: '4px',
                          }}
                        >
                          Total Value
                        </div>
                        <div
                          style={{
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            color: '#22c55e',
                          }}
                        >
                          {formatCurrency(getTotalContractValue())}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warehousing Services */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 20px 0',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ marginRight: '12px', fontSize: '1.5rem' }}>
                      🏢
                    </span>
                    Warehousing Services
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    {Object.entries(warehouseServices).map(([key, value]) => (
                      <label
                        key={key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          padding: '12px',
                          background: value
                            ? 'rgba(34, 197, 94, 0.1)'
                            : 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          border: value
                            ? '1px solid rgba(34, 197, 94, 0.3)'
                            : '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <input
                          type='checkbox'
                          checked={value}
                          onChange={(e) =>
                            setWarehouseServices({
                              ...warehouseServices,
                              [key]: e.target.checked,
                            })
                          }
                          style={{
                            marginRight: '8px',
                            width: '16px',
                            height: '16px',
                          }}
                        />
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                          {key.charAt(0).toUpperCase() +
                            key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 20px 0',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ marginRight: '12px', fontSize: '1.5rem' }}>
                      📝
                    </span>
                    Terms and Conditions
                  </h3>
                  <textarea
                    value={termsConditions}
                    onChange={(e) => setTermsConditions(e.target.value)}
                    placeholder='Enter contract terms and conditions...'
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      borderRadius: '8px',
                      color: '#374151',
                      fontSize: '0.9rem',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* Special Provisions */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 20px 0',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ marginRight: '12px', fontSize: '1.5rem' }}>
                      ⚡
                    </span>
                    Special Provisions
                  </h3>
                  <textarea
                    value={specialProvisions}
                    onChange={(e) => setSpecialProvisions(e.target.value)}
                    placeholder='Enter any special provisions or amendments...'
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      borderRadius: '8px',
                      color: '#374151',
                      fontSize: '0.9rem',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* Contract Actions */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 20px 0',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ marginRight: '12px', fontSize: '1.5rem' }}>
                      ⚡
                    </span>
                    Contract Actions
                  </h3>
                  <div
                    style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
                  >
                    <button
                      onClick={() => setContractStatus('sent_to_client')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 20px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'rgba(59, 130, 246, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'rgba(59, 130, 246, 0.2)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <span style={{ marginRight: '8px', fontSize: '1.1rem' }}>
                        📮
                      </span>
                      Send to Client
                    </button>

                    <button
                      onClick={() => setContractStatus('fully_executed')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 20px',
                        background: 'rgba(34, 197, 94, 0.2)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'rgba(34, 197, 94, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'rgba(34, 197, 94, 0.2)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <span style={{ marginRight: '8px', fontSize: '1.1rem' }}>
                        ✅
                      </span>
                      Mark as Executed
                    </button>

                    <button
                      onClick={() => setContractStatus('draft')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 20px',
                        background: 'rgba(156, 163, 175, 0.2)',
                        border: '1px solid rgba(156, 163, 175, 0.3)',
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'rgba(156, 163, 175, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'rgba(156, 163, 175, 0.2)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <span style={{ marginRight: '8px', fontSize: '1.1rem' }}>
                        📝
                      </span>
                      Reset to Draft
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'signatures' && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 20px 0',
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ marginRight: '12px', fontSize: '1.5rem' }}>
                    ✒️
                  </span>
                  Digital Signatures
                </h3>

                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '12px',
                      fontSize: '1rem',
                      fontWeight: '500',
                    }}
                  >
                    Broker Signature
                  </label>
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={200}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    style={{
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      cursor: 'crosshair',
                      display: 'block',
                      marginBottom: '12px',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={clearSignature}
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Clear Signature
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    padding: '16px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)' }}>
                    Draw your signature in the box above. This will be saved
                    with the contract for digital execution.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'comments' && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 20px 0',
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ marginRight: '12px', fontSize: '1.5rem' }}>
                    📝
                  </span>
                  Contract Comments
                </h3>
                <div
                  style={{
                    padding: '16px',
                    background: 'rgba(156, 163, 175, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(156, 163, 175, 0.2)',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)' }}>
                    No comments yet. Comments and notes will appear here.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 20px 0',
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ marginRight: '12px', fontSize: '1.5rem' }}>
                    ⚠️
                  </span>
                  Contract Notifications
                </h3>
                <div
                  style={{
                    padding: '16px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                  }}
                >
                  <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)' }}>
                    Contract notifications and alerts will be displayed here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
