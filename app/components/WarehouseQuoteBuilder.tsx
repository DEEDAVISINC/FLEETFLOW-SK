'use client';

import { useState } from 'react';
import {
  WarehouseQuoteRequest,
  warehousingService,
} from '../services/warehousing-service';

interface WarehouseQuoteBuilderProps {
  onQuoteGenerated?: (quotes: any[]) => void;
  onClose?: () => void;
  initialData?: any;
}

export default function WarehouseQuoteBuilder({
  onQuoteGenerated,
  onClose,
  initialData,
}: WarehouseQuoteBuilderProps) {
  const [formData, setFormData] = useState({
    serviceType: initialData?.equipmentType || 'Warehouse Storage',
    duration: 'long_term',
    volume: {
      pallets: 100,
      sqft: 5000,
      items: 1000,
      weight: 50000,
    },
    specialRequirements: [] as string[],
    location: {
      preferred: initialData?.destination || 'Atlanta, GA',
      alternatives: ['Dallas, TX', 'Chicago, IL'],
    },
    timeline: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    },
    contactInfo: {
      companyName: initialData?.companyName || '',
      contactName: initialData?.contactName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
    },
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const specialRequirementOptions = [
    'Climate Control Required',
    'Hazmat Storage Certified',
    'FDA Compliant Facility',
    'Security Clearance Required',
    'Cross-Docking Capabilities',
    'Rail Access Required',
    'Port Access Required',
    '24/7 Operations',
    'Automated Systems',
    'Returns Processing',
    'Kitting & Assembly',
    'Quality Control',
    'Pharmaceutical Grade',
    'Food Grade Facility',
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSpecialRequirementToggle = (requirement: string) => {
    setFormData((prev) => ({
      ...prev,
      specialRequirements: prev.specialRequirements.includes(requirement)
        ? prev.specialRequirements.filter((r) => r !== requirement)
        : [...prev.specialRequirements, requirement],
    }));
  };

  const generateQuotes = async () => {
    setIsGenerating(true);
    try {
      const request: WarehouseQuoteRequest = {
        serviceType: formData.serviceType,
        duration: formData.duration as any,
        volume: formData.volume,
        specialRequirements: formData.specialRequirements,
        location: formData.location,
        timeline: formData.timeline,
        contactInfo: formData.contactInfo,
      };

      const quotes = warehousingService.generateWarehouseQuote(request);

      // Convert to Go with the Flow format
      const formattedQuotes = quotes.map((quote) => ({
        id: quote.id,
        carrier: quote.warehouseName,
        rate: quote.pricing.totalEstimate,
        eta: quote.timeline.setupTime,
        confidence: quote.confidence,
        features: quote.features,
        reasoning: `${quote.serviceType} solution with ${quote.compliance.join(', ')} certifications`,
        warehouseDetails: quote,
      }));

      onQuoteGenerated?.(formattedQuotes);
    } catch (error) {
      console.error('Error generating warehouse quotes:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep1 = () => (
    <div>
      <h3
        style={{
          color: 'white',
          fontSize: '20px',
          fontWeight: '600',
          marginBottom: '20px',
        }}
      >
        🏭 Warehousing Service Details
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
        }}
      >
        <div>
          <label
            style={{
              display: 'block',
              color: 'white',
              marginBottom: '8px',
              fontWeight: '600',
            }}
          >
            Service Type
          </label>
          <select
            value={formData.serviceType}
            onChange={(e) => handleInputChange('serviceType', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
            }}
          >
            <option value='Warehouse Storage'>🏭 Warehouse Storage</option>
            <option value='Cross Docking'>📦 Cross Docking</option>
            <option value='Pick & Pack'>📋 Pick & Pack Services</option>
            <option value='Inventory Management'>
              📊 Inventory Management
            </option>
            <option value='Distribution Center'>🚚 Distribution Center</option>
            <option value='Fulfillment Services'>
              📮 Fulfillment Services
            </option>
            <option value='3PL Full Service'>🏢 3PL Full Service</option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: 'block',
              color: 'white',
              marginBottom: '8px',
              fontWeight: '600',
            }}
          >
            Duration
          </label>
          <select
            value={formData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
            }}
          >
            <option value='short_term'>Short Term (1-6 months)</option>
            <option value='long_term'>Long Term (6+ months)</option>
            <option value='seasonal'>Seasonal (3-4 months)</option>
            <option value='permanent'>Permanent Partnership</option>
          </select>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginTop: '20px',
        }}
      >
        <div>
          <label
            style={{
              display: 'block',
              color: 'white',
              marginBottom: '8px',
              fontWeight: '600',
            }}
          >
            Pallets Needed
          </label>
          <input
            type='number'
            value={formData.volume.pallets}
            onChange={(e) =>
              handleInputChange('volume.pallets', parseInt(e.target.value))
            }
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
            }}
            placeholder='100'
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              color: 'white',
              marginBottom: '8px',
              fontWeight: '600',
            }}
          >
            Square Feet
          </label>
          <input
            type='number'
            value={formData.volume.sqft}
            onChange={(e) =>
              handleInputChange('volume.sqft', parseInt(e.target.value))
            }
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
            }}
            placeholder='5000'
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              color: 'white',
              marginBottom: '8px',
              fontWeight: '600',
            }}
          >
            Total Weight (lbs)
          </label>
          <input
            type='number'
            value={formData.volume.weight}
            onChange={(e) =>
              handleInputChange('volume.weight', parseInt(e.target.value))
            }
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
            }}
            placeholder='50000'
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h3
        style={{
          color: 'white',
          fontSize: '20px',
          fontWeight: '600',
          marginBottom: '20px',
        }}
      >
        📋 Special Requirements
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '12px',
        }}
      >
        {specialRequirementOptions.map((requirement) => (
          <div
            key={requirement}
            onClick={() => handleSpecialRequirementToggle(requirement)}
            style={{
              background: formData.specialRequirements.includes(requirement)
                ? 'rgba(34, 197, 94, 0.2)'
                : 'rgba(255, 255, 255, 0.05)',
              border: formData.specialRequirements.includes(requirement)
                ? '1px solid #22c55e'
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: 'white',
              fontSize: '14px',
            }}
          >
            <span style={{ marginRight: '8px' }}>
              {formData.specialRequirements.includes(requirement) ? '✅' : '⬜'}
            </span>
            {requirement}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <label
          style={{
            display: 'block',
            color: 'white',
            marginBottom: '8px',
            fontWeight: '600',
          }}
        >
          Preferred Location
        </label>
        <input
          type='text'
          value={formData.location.preferred}
          onChange={(e) =>
            handleInputChange('location.preferred', e.target.value)
          }
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            fontSize: '14px',
          }}
          placeholder='City, State'
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h3
        style={{
          color: 'white',
          fontSize: '20px',
          fontWeight: '600',
          marginBottom: '20px',
        }}
      >
        📅 Timeline & Contact
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
        }}
      >
        <div>
          <label
            style={{
              display: 'block',
              color: 'white',
              marginBottom: '8px',
              fontWeight: '600',
            }}
          >
            Start Date
          </label>
          <input
            type='date'
            value={formData.timeline.startDate}
            onChange={(e) =>
              handleInputChange('timeline.startDate', e.target.value)
            }
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              color: 'white',
              marginBottom: '8px',
              fontWeight: '600',
            }}
          >
            End Date (Optional)
          </label>
          <input
            type='date'
            value={formData.timeline.endDate}
            onChange={(e) =>
              handleInputChange('timeline.endDate', e.target.value)
            }
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '20px',
        }}
      >
        <div>
          <label
            style={{
              display: 'block',
              color: 'white',
              marginBottom: '8px',
              fontWeight: '600',
            }}
          >
            Company Name
          </label>
          <input
            type='text'
            value={formData.contactInfo.companyName}
            onChange={(e) =>
              handleInputChange('contactInfo.companyName', e.target.value)
            }
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
            }}
            placeholder='Your Company Name'
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              color: 'white',
              marginBottom: '8px',
              fontWeight: '600',
            }}
          >
            Contact Name
          </label>
          <input
            type='text'
            value={formData.contactInfo.contactName}
            onChange={(e) =>
              handleInputChange('contactInfo.contactName', e.target.value)
            }
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
            }}
            placeholder='Your Name'
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              color: 'white',
              marginBottom: '8px',
              fontWeight: '600',
            }}
          >
            Email
          </label>
          <input
            type='email'
            value={formData.contactInfo.email}
            onChange={(e) =>
              handleInputChange('contactInfo.email', e.target.value)
            }
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
            }}
            placeholder='email@company.com'
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              color: 'white',
              marginBottom: '8px',
              fontWeight: '600',
            }}
          >
            Phone
          </label>
          <input
            type='tel'
            value={formData.contactInfo.phone}
            onChange={(e) =>
              handleInputChange('contactInfo.phone', e.target.value)
            }
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
            }}
            placeholder='(555) 123-4567'
          />
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          borderRadius: '16px',
          maxWidth: '800px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #059669, #10b981)',
            padding: '24px',
            borderRadius: '16px 16px 0 0',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h2
                style={{
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: '700',
                  margin: 0,
                }}
              >
                🏭 Warehousing & 3PL Quote Builder
              </h2>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  margin: '4px 0 0 0',
                }}
              >
                Get instant quotes for warehousing and 3PL services
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background:
                      activeStep >= step
                        ? '#10b981'
                        : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {step}
                </div>
                <span
                  style={{
                    color:
                      activeStep >= step
                        ? '#10b981'
                        : 'rgba(255, 255, 255, 0.6)',
                    fontSize: '14px',
                  }}
                >
                  {step === 1
                    ? 'Service Details'
                    : step === 2
                      ? 'Requirements'
                      : 'Timeline & Contact'}
                </span>
                {step < 3 && (
                  <div
                    style={{
                      width: '40px',
                      height: '2px',
                      background:
                        activeStep > step
                          ? '#10b981'
                          : 'rgba(255, 255, 255, 0.2)',
                      marginLeft: '8px',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div style={{ padding: '24px' }}>
          {activeStep === 1 && renderStep1()}
          {activeStep === 2 && renderStep2()}
          {activeStep === 3 && renderStep3()}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '20px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <button
            onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
            disabled={activeStep === 1}
            style={{
              background:
                activeStep === 1
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              padding: '12px 24px',
              color: activeStep === 1 ? 'rgba(255, 255, 255, 0.5)' : 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: activeStep === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            ← Previous
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            {activeStep < 3 ? (
              <button
                onClick={() => setActiveStep(activeStep + 1)}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={generateQuotes}
                disabled={isGenerating}
                style={{
                  background: isGenerating
                    ? 'rgba(59, 130, 246, 0.5)'
                    : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {isGenerating ? (
                  <>
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                      }}
                    />
                    Generating Quotes...
                  </>
                ) : (
                  <>🏭 Generate Warehouse Quotes</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
