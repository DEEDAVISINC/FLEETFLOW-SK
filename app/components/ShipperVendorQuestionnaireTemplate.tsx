'use client';

import { CheckCircle, Copy, Download, FileText } from 'lucide-react';
import { useState } from 'react';

interface QuestionnaireData {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  projectDetails: string;
  locations: {
    states: string[];
    countries: string[];
    territories: string[];
    specificCities: string[];
  };
  transportationHubs: string[];
  proximityRequirements: string;
  productDetails: {
    dimensions: string;
    weight: string;
    specialHandling: string[];
    storageConditions: string[];
    specializedEquipment: string[];
  };
  volume: {
    palletsPerShipment: number;
    frequency: string;
    seasonalVariations: string;
    perLocation: boolean;
  };
  timeline: {
    startDate: string;
    contractDuration: string;
    rolloutType: 'phased' | 'simultaneous';
  };
  transportation: {
    inboundRequired: boolean;
    outboundRequired: boolean;
    vehicleTypes: string[];
  };
  additionalServices: {
    repackaging: string;
    kitting: string;
    labeling: string;
    inventoryManagement: string;
    packagingMaterials: string;
  };
  contractTerms: {
    performanceBonds: string;
    insuranceRequirements: string;
    complianceCertifications: string[];
  };
}

interface ShipperVendorQuestionnaireTemplateProps {
  companyName?: string;
  isCompact?: boolean;
}

export default function ShipperVendorQuestionnaireTemplate({
  companyName = 'DEE DAVIS INC',
  isCompact = false,
}: ShipperVendorQuestionnaireTemplateProps) {
  const [formData, setFormData] = useState<QuestionnaireData>({
    companyName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    projectDetails: '',
    locations: {
      states: [],
      countries: [],
      territories: [],
      specificCities: [],
    },
    transportationHubs: [],
    proximityRequirements: '',
    productDetails: {
      dimensions: '',
      weight: '',
      specialHandling: [],
      storageConditions: [],
      specializedEquipment: [],
    },
    volume: {
      palletsPerShipment: 0,
      frequency: '',
      seasonalVariations: '',
      perLocation: true,
    },
    timeline: {
      startDate: '',
      contractDuration: '',
      rolloutType: 'phased',
    },
    transportation: {
      inboundRequired: true,
      outboundRequired: true,
      vehicleTypes: [],
    },
    additionalServices: {
      repackaging: '',
      kitting: '',
      labeling: '',
      inventoryManagement: '',
      packagingMaterials: '',
    },
    contractTerms: {
      performanceBonds: '',
      insuranceRequirements: '',
      complianceCertifications: [],
    },
  });

  const [copied, setCopied] = useState(false);

  const generateEmailContent = () => {
    return `Subject: Comprehensive Logistics Proposal Request - DEPOINTE/Freight 1st Direct

Dear ${formData.contactName || '[Contact Name]'},

Thank you for considering DEPOINTE/Freight 1st Direct for your warehouse storage and transportation needs. We appreciate the opportunity to provide a quotation for ${formData.companyName || '[Company Name]'}${formData.projectDetails ? ` ${formData.projectDetails}` : ''} and would be pleased to develop a comprehensive proposal for your long-term partnership.

To ensure we provide you with the most accurate and competitive quotation, we need to gather some additional details:

**Location Specifications:**

- Could you please provide specific states, provinces, or regions within the US, Canada, Mexico, or other countries where you need service${formData.locations.states.length > 0 || formData.locations.countries.length > 0 ? ` (${[...formData.locations.states, ...formData.locations.countries].join(', ')})` : ''}?
${formData.locations.territories.length > 0 ? `- Territories/Islands: ${formData.locations.territories.join(', ')}\n` : ''}
${formData.locations.specificCities.length > 0 ? `- Specific cities or metropolitan areas: ${formData.locations.specificCities.join(', ')}\n` : ''}
- Do you require facilities near specific transportation hubs (airports, ports, major highways, border crossings)${formData.transportationHubs.length > 0 ? ` (${formData.transportationHubs.join(', ')})` : ''}?
- What is your preferred proximity to your project sites or customer locations?${formData.proximityRequirements ? ` (${formData.proximityRequirements})` : ''}

**Product Details:**

- What are the typical dimensions and weight ranges for your pallets?${formData.productDetails.dimensions ? ` (${formData.productDetails.dimensions})` : ''}
- Do any products require special handling${formData.productDetails.specialHandling.length > 0 ? ` (${formData.productDetails.specialHandling.join(', ')})` : ' (hazardous materials, temperature-controlled storage, security requirements)'}?
- Are there any products requiring specialized storage conditions${formData.productDetails.storageConditions.length > 0 ? ` (${formData.productDetails.storageConditions.join(', ')})` : ''} or equipment${formData.productDetails.specializedEquipment.length > 0 ? ` (${formData.productDetails.specializedEquipment.join(', ')})` : ''}?

**Volume and Frequency:**

- What are your typical pallet volumes per shipment${formData.volume.palletsPerShipment > 0 ? ` (${formData.volume.palletsPerShipment} pallets)` : ''}?
- What is your expected shipment frequency${formData.volume.frequency ? ` (${formData.volume.frequency})` : ' (daily, weekly, monthly, etc.)'}?
- Are these volumes per location or total across all locations?
${formData.volume.seasonalVariations ? `- Do you anticipate seasonal fluctuations in volume? (${formData.volume.seasonalVariations})\n` : '- Do you anticipate seasonal fluctuations in volume?\n'}

**Timeline Requirements:**

${formData.timeline.startDate ? `- When do you need these services to begin? (${formData.timeline.startDate})\n` : '- When do you need these services to begin?\n'}
${formData.timeline.contractDuration ? `- What is your expected contract duration for this long-term partnership? (${formData.timeline.contractDuration})\n` : '- What is your expected contract duration for this long-term partnership?\n'}
- Do you require a ${formData.timeline.rolloutType} rollout across locations or simultaneous implementation?

**Transportation Services:**

${formData.transportation.inboundRequired ? '- ✅ Do you require inbound transportation services from suppliers to our facilities?\n' : '- Do you require inbound transportation services from suppliers to our facilities?\n'}
${formData.transportation.outboundRequired ? '- ✅ Do you need outbound transportation to job sites or customer locations?\n' : '- Do you need outbound transportation to job sites or customer locations?\n'}
- What types of delivery vehicles do you typically require${formData.transportation.vehicleTypes.length > 0 ? ` (${formData.transportation.vehicleTypes.join(', ')})` : ' (box trucks, flatbeds, etc.)'}?

**Additional Services:**

${formData.additionalServices.repackaging ? `- For repackaging/repalletizing services, what specific requirements do you have? (${formData.additionalServices.repackaging})\n` : '- For repackaging/repalletizing services, what specific requirements do you have?\n'}
${formData.additionalServices.kitting ? `- Do you need any kitting, labeling, or inventory management services? (${formData.additionalServices.kitting})\n` : '- Do you need any kitting, labeling, or inventory management services?\n'}
${formData.additionalServices.labeling ? `- Labeling requirements: (${formData.additionalServices.labeling})\n` : ''}
${formData.additionalServices.inventoryManagement ? `- Inventory management needs: (${formData.additionalServices.inventoryManagement})\n` : ''}
${formData.additionalServices.packagingMaterials ? `- Would you require any special packaging materials or supplies? (${formData.additionalServices.packagingMaterials})\n` : '- Would you require any special packaging materials or supplies?\n'}

**Contract Terms:**

${formData.contractTerms.performanceBonds ? `- Do you require any performance bonds or insurance coverage specifications? (${formData.contractTerms.performanceBonds})\n` : '- Do you require any performance bonds or insurance coverage specifications?\n'}
- Are there any compliance certifications required for your industry?${formData.contractTerms.complianceCertifications.length > 0 ? ` (${formData.contractTerms.complianceCertifications.join(', ')})` : ''}

Once we receive this information, we will prepare a detailed proposal including all requested rate structures, service options, and terms. We are committed to providing competitive pricing and exceptional service to support ${formData.companyName || '[Company Name]'} growth and operational efficiency.

We look forward to your response and the opportunity to discuss how DEPOINTE/Freight 1st Direct can best serve your logistics needs.

Best regards,
[Your Name]
[Your Position]
DEPOINTE/Freight 1st Direct
${formData.contactPhone || '[Phone Number]'}
${formData.contactEmail || '[Email Address]'}`;
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
    element.download = `shipper-questionnaire-${formData.companyName || 'template'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className='mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg'>
      {/* Header */}
      <div className='mb-6'>
        <div className='mb-4 flex items-center gap-3'>
          <FileText className='h-8 w-8 text-blue-600' />
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>
              Shipper/Vendor Questionnaire Template
            </h2>
            <p className='text-gray-600'>
              Generate professional questionnaires for potential logistics
              partners
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
        {/* Contact Information */}
        <div className='space-y-4'>
          <h3 className='border-b pb-2 text-lg font-semibold text-gray-900'>
            Contact Information
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
              placeholder='Cupertino Electric'
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
              placeholder='john@cupertinoelectric.com'
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

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Project Details
            </label>
            <input
              type='text'
              value={formData.projectDetails}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  projectDetails: e.target.value,
                }))
              }
              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              placeholder='multi-location requirements'
            />
          </div>
        </div>

        {/* Volume Information */}
        <div className='space-y-4'>
          <h3 className='border-b pb-2 text-lg font-semibold text-gray-900'>
            Volume & Timeline
          </h3>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Typical Pallets per Shipment
            </label>
            <input
              type='number'
              value={formData.volume.palletsPerShipment || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  volume: {
                    ...prev.volume,
                    palletsPerShipment: parseInt(e.target.value) || 0,
                  },
                }))
              }
              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              placeholder='e.g., 50'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Expected Shipment Frequency
            </label>
            <input
              type='text'
              value={formData.volume.frequency}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  volume: { ...prev.volume, frequency: e.target.value },
                }))
              }
              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              placeholder='e.g., daily, weekly, bi-weekly, monthly'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Seasonal Variations
            </label>
            <input
              type='text'
              value={formData.volume.seasonalVariations}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  volume: {
                    ...prev.volume,
                    seasonalVariations: e.target.value,
                  },
                }))
              }
              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              placeholder='Peak during summer months'
            />
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              id='perLocation'
              checked={formData.volume.perLocation}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  volume: { ...prev.volume, perLocation: e.target.checked },
                }))
              }
              className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
            />
            <label htmlFor='perLocation' className='ml-2 text-sm text-gray-700'>
              Per location (vs total across all locations)
            </label>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className='mt-8'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>
          Email Preview
        </h3>
        <div className='max-h-96 overflow-y-auto rounded-lg border bg-gray-50 p-4'>
          <pre className='font-mono text-sm whitespace-pre-wrap text-gray-800'>
            {generateEmailContent()}
          </pre>
        </div>
      </div>
    </div>
  );
}
