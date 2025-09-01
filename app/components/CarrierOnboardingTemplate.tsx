'use client';

import { useState } from 'react';
import { Truck, FileText, Download, Copy, CheckCircle } from 'lucide-react';

interface CarrierData {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  mcNumber: string;
  dotNumber: string;
  businessType: string;
  equipment: {
    truckTypes: string[];
    trailerTypes: string[];
    capacity: string;
  };
  serviceArea: {
    states: string[];
    countries: string[];
    preferredLanes: string[];
  };
  insurance: {
    cargo: string;
    liability: string;
    workersComp: string;
    expirationDate: string;
  };
  compliance: {
    safetyRating: string;
    inspectionHistory: string;
    hazmatCertified: boolean;
    twicCard: boolean;
  };
  rates: {
    preferredRateStructure: string;
    minimumLoadValue: string;
    fuelSurcharge: string;
  };
  references: string;
}

interface CarrierOnboardingTemplateProps {
  companyName?: string;
  isCompact?: boolean;
}

export default function CarrierOnboardingTemplate({
  companyName = 'DEPOINTE/Freight 1st Direct',
  isCompact = false,
}: CarrierOnboardingTemplateProps) {
  const [formData, setFormData] = useState<CarrierData>({
    companyName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    mcNumber: '',
    dotNumber: '',
    businessType: '',
    equipment: {
      truckTypes: [],
      trailerTypes: [],
      capacity: '',
    },
    serviceArea: {
      states: [],
      countries: [],
      preferredLanes: [],
    },
    insurance: {
      cargo: '',
      liability: '',
      workersComp: '',
      expirationDate: '',
    },
    compliance: {
      safetyRating: '',
      inspectionHistory: '',
      hazmatCertified: false,
      twicCard: false,
    },
    rates: {
      preferredRateStructure: '',
      minimumLoadValue: '',
      fuelSurcharge: '',
    },
    references: '',
  });

  const [copied, setCopied] = useState(false);

  const generateEmailContent = () => {
    return `Subject: Carrier Partnership Opportunity - ${companyName}

Dear ${formData.contactName || '[Carrier Contact Name]'},

Thank you for your interest in partnering with ${companyName}. We are always looking for reliable carriers to join our network and would like to explore partnership opportunities with ${formData.companyName || '[Your Company Name]'}.

To ensure we can provide you with the best opportunities and properly integrate you into our load board system, we need to gather some essential information:

**Company Information:**
- Legal Company Name: ${formData.companyName || '[Company Name]'}
- MC Number: ${formData.mcNumber || '[MC Number]'}
- DOT Number: ${formData.dotNumber || '[DOT Number]'}
- Business Type: ${formData.businessType || '[Owner Operator, Small Fleet, Large Carrier, etc.]'}
- Contact Person: ${formData.contactName || '[Contact Name]'}
- Phone: ${formData.contactPhone || '[Phone Number]'}
- Email: ${formData.contactEmail || '[Email Address]'}

**Equipment & Capacity:**
- Truck Types: ${formData.equipment.truckTypes.length > 0 ? formData.equipment.truckTypes.join(', ') : '[Box truck, flatbed, reefer, etc.]'}
- Trailer Types: ${formData.equipment.trailerTypes.length > 0 ? formData.equipment.trailerTypes.join(', ') : '[Dry van, flatbed, refrigerated, etc.]'}
- Capacity: ${formData.equipment.capacity || '[Number of trucks available]'}

**Service Areas:**
- Primary Operating States: ${formData.serviceArea.states.length > 0 ? formData.serviceArea.states.join(', ') : '[States you primarily operate in]'}
- Countries Served: ${formData.serviceArea.countries.length > 0 ? formData.serviceArea.countries.join(', ') : '[US, Canada, Mexico, etc.]'}
- Preferred Lanes: ${formData.serviceArea.preferredLanes.length > 0 ? formData.serviceArea.preferredLanes.join(', ') : '[Your preferred routes/lanes]'}

**Insurance Information:**
- Cargo Insurance: ${formData.insurance.cargo || '[Coverage amount]'}
- General Liability: ${formData.insurance.liability || '[Coverage amount]'}
- Workers Compensation: ${formData.insurance.workersComp || '[Coverage amount]'}
- Expiration Date: ${formData.insurance.expirationDate || '[MM/YYYY]'}

**Compliance & Safety:**
- FMCSA Safety Rating: ${formData.compliance.safetyRating || '[Satisfactory, Conditional, Unsatisfactory]'}
- Recent Inspection History: ${formData.compliance.inspectionHistory || '[Summary of recent inspections]'}
- HAZMAT Certified: ${formData.compliance.hazmatCertified ? 'Yes' : 'No'}
- TWIC Card Holder: ${formData.compliance.twicCard ? 'Yes' : 'No'}

**Rate Preferences:**
- Preferred Rate Structure: ${formData.rates.preferredRateStructure || '[Per mile, flat rate, percentage of load value, etc.]'}
- Minimum Load Value: ${formData.rates.minimumLoadValue || '[Minimum load value you accept]'}
- Fuel Surcharge Policy: ${formData.rates.fuelSurcharge || '[Your fuel surcharge policy]'}

**References:**
${formData.references || '[Please provide 2-3 references from previous shippers or brokers]'}

Once we receive this information, we can:
- Set up your carrier profile in our load board system
- Provide you with direct access to available loads
- Establish your preferred rate structure
- Begin dispatching loads that match your equipment and service areas

We look forward to potentially working together and building a successful partnership.

Best regards,
[Your Name]
Carrier Relations Manager
${companyName}
[Your Phone Number]
[Your Email Address]`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateEmailContent());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadAsText = () => {
    const element = document.createElement('a');
    const file = new Blob([generateEmailContent()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `carrier-onboarding-${formData.companyName || 'template'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className='mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg'>
      {/* Header */}
      <div className='mb-6'>
        <div className='mb-4 flex items-center gap-3'>
          <Truck className='h-8 w-8 text-blue-600' />
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>
              Carrier Onboarding Template
            </h2>
            <p className='text-gray-600'>
              Professional carrier partnership questionnaire for freight brokerage operations
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3'>
          <button
            onClick={copyToClipboard}
            className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
          >
            {copied ? (
              <CheckCircle className='h-4 w-4' />
            ) : (
              <Copy className='h-4 w-4' />
            )}
            {copied ? 'Copied!' : 'Copy Email'}
          </button>
          <button
            onClick={downloadAsText}
            className='flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700'
          >
            <Download className='h-4 w-4' />
            Download
          </button>
        </div>
      </div>

      {/* Form */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Company Information */}
        <div className='space-y-4'>
          <h3 className='border-b pb-2 text-lg font-semibold text-gray-900'>
            Company Information
          </h3>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Company Name
            </label>
            <input
              type='text'
              value={formData.companyName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  companyName: e.target.value,
                }))
              }
              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              placeholder='ABC Transportation LLC'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              MC Number
            </label>
            <input
              type='text'
              value={formData.mcNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  mcNumber: e.target.value,
                }))
              }
              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              placeholder='MC-123456'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              DOT Number
            </label>
            <input
              type='text'
              value={formData.dotNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dotNumber: e.target.value,
                }))
              }
              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              placeholder='DOT-1234567'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Contact Name
            </label>
            <input
              type='text'
              value={formData.contactName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contactName: e.target.value,
                }))
              }
              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              placeholder='John Smith'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Contact Email
            </label>
            <input
              type='email'
              value={formData.contactEmail}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contactEmail: e.target.value,
                }))
              }
              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              placeholder='john@abc-transport.com'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Contact Phone
            </label>
            <input
              type='tel'
              value={formData.contactPhone}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contactPhone: e.target.value,
                }))
              }
              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              placeholder='(555) 123-4567'
            />
          </div>
        </div>

        {/* Equipment & Capacity */}
        <div className='space-y-4'>
          <h3 className='border-b pb-2 text-lg font-semibold text-gray-900'>
            Equipment & Capacity
          </h3>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Truck Types (select all that apply)
            </label>
            <div className='space-y-2'>
              {[
                'Box Truck',
                'Flatbed',
                'Reefer',
                'Dry Van',
                'Step Deck',
                'Double Drop',
                'Tanker',
                'Car Hauler',
              ].map((type) => (
                <label key={type} className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={formData.equipment.truckTypes.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData((prev) => ({
                          ...prev,
                          equipment: {
                            ...prev.equipment,
                            truckTypes: [...prev.equipment.truckTypes, type],
                          },
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          equipment: {
                            ...prev.equipment,
                            truckTypes: prev.equipment.truckTypes.filter(
                              (t) => t !== type
                            ),
                          },
                        }));
                      }
                    }}
                    className='mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500'
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Fleet Size
            </label>
            <input
              type='text'
              value={formData.equipment.capacity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  equipment: {
                    ...prev.equipment,
                    capacity: e.target.value,
                  },
                }))
              }
              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              placeholder='e.g., 5 trucks, 15 trailers'
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className='mt-8'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>
          Email Preview
        </h3>
        <div className='max-h-96 overflow-y-auto rounded-lg border bg-gray-50 p-4'>
          <pre className='whitespace-pre-wrap font-mono text-sm text-gray-800'>
            {generateEmailContent()}
          </pre>
        </div>
      </div>
    </div>
  );
}
