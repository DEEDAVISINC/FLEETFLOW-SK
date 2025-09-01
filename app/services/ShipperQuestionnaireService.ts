// Shipper/Vendor Questionnaire Service for DEPOINTE AI Dashboard
// Professional questionnaire templates for logistics information gathering

interface ShipperQuestionnaireData {
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

export class ShipperQuestionnaireService {
  static generateQuestionnaireEmail(data: ShipperQuestionnaireData): string {
    return `Subject: Comprehensive Logistics Proposal Request - DEPOINTE/Freight 1st Direct

Dear ${data.contactName || '[Contact Name]'},

Thank you for considering DEPOINTE/Freight 1st Direct for your warehouse storage and transportation needs. We appreciate the opportunity to provide a quotation for ${data.companyName || '[Company Name]'}${data.projectDetails ? ` ${data.projectDetails}` : ''} and would be pleased to develop a comprehensive proposal for your long-term partnership.

To ensure we provide you with the most accurate and competitive quotation, we need to gather some additional details:

**Location Specifications:**

- Could you please provide specific states, provinces, or regions within the US, Canada, Mexico, or other countries where you need service${data.locations.states.length > 0 || data.locations.countries.length > 0 ? ` (${[...data.locations.states, ...data.locations.countries].join(', ')})` : ''}?
${data.locations.territories.length > 0 ? `- Territories/Islands: ${data.locations.territories.join(', ')}\n` : ''}
${data.locations.specificCities.length > 0 ? `- Specific cities or metropolitan areas: ${data.locations.specificCities.join(', ')}\n` : ''}
- Do you require facilities near specific transportation hubs (airports, ports, major highways, border crossings)${data.transportationHubs.length > 0 ? ` (${data.transportationHubs.join(', ')})` : ''}?
- What is your preferred proximity to your project sites or customer locations?${data.proximityRequirements ? ` (${data.proximityRequirements})` : ''}

**Product Details:**

- What are the typical dimensions and weight ranges for your pallets?${data.productDetails.dimensions ? ` (${data.productDetails.dimensions})` : ''}
- Do any products require special handling${data.productDetails.specialHandling.length > 0 ? ` (${data.productDetails.specialHandling.join(', ')})` : ' (hazardous materials, temperature-controlled storage, security requirements)'}?
- Are there any products requiring specialized storage conditions${data.productDetails.storageConditions.length > 0 ? ` (${data.productDetails.storageConditions.join(', ')})` : ''} or equipment${data.productDetails.specializedEquipment.length > 0 ? ` (${data.productDetails.specializedEquipment.join(', ')})` : ''}?

**Volume and Frequency:**

- What are your typical pallet volumes per shipment${data.volume.palletsPerShipment > 0 ? ` (${data.volume.palletsPerShipment} pallets)` : ''}?
- What is your expected shipment frequency${data.volume.frequency ? ` (${data.volume.frequency})` : ' (daily, weekly, monthly, etc.)'}?
- Are these volumes per location or total across all locations?
${data.volume.seasonalVariations ? `- Do you anticipate seasonal fluctuations in volume? (${data.volume.seasonalVariations})\n` : '- Do you anticipate seasonal fluctuations in volume?\n'}

**Timeline Requirements:**

${data.timeline.startDate ? `- When do you need these services to begin? (${data.timeline.startDate})\n` : '- When do you need these services to begin?\n'}
${data.timeline.contractDuration ? `- What is your expected contract duration for this long-term partnership? (${data.timeline.contractDuration})\n` : '- What is your expected contract duration for this long-term partnership?\n'}
- Do you require a ${data.timeline.rolloutType} rollout across locations or simultaneous implementation?

**Transportation Services:**

${data.transportation.inboundRequired ? '- ✅ Do you require inbound transportation services from suppliers to our facilities?\n' : '- Do you require inbound transportation services from suppliers to our facilities?\n'}
${data.transportation.outboundRequired ? '- ✅ Do you need outbound transportation to job sites or customer locations?\n' : '- Do you need outbound transportation to job sites or customer locations?\n'}
- What types of delivery vehicles do you typically require${data.transportation.vehicleTypes.length > 0 ? ` (${data.transportation.vehicleTypes.join(', ')})` : ' (box trucks, flatbeds, etc.)'}?

**Additional Services:**

${data.additionalServices.repackaging ? `- For repackaging/repalletizing services, what specific requirements do you have? (${data.additionalServices.repackaging})\n` : '- For repackaging/repalletizing services, what specific requirements do you have?\n'}
${data.additionalServices.kitting ? `- Do you need any kitting, labeling, or inventory management services? (${data.additionalServices.kitting})\n` : '- Do you need any kitting, labeling, or inventory management services?\n'}
${data.additionalServices.labeling ? `- Labeling requirements: (${data.additionalServices.labeling})\n` : ''}
${data.additionalServices.inventoryManagement ? `- Inventory management needs: (${data.additionalServices.inventoryManagement})\n` : ''}
${data.additionalServices.packagingMaterials ? `- Would you require any special packaging materials or supplies? (${data.additionalServices.packagingMaterials})\n` : '- Would you require any special packaging materials or supplies?\n'}

**Contract Terms:**

${data.contractTerms.performanceBonds ? `- Do you require any performance bonds or insurance coverage specifications? (${data.contractTerms.performanceBonds})\n` : '- Do you require any performance bonds or insurance coverage specifications?\n'}
- Are there any compliance certifications required for your industry?${data.contractTerms.complianceCertifications.length > 0 ? ` (${data.contractTerms.complianceCertifications.join(', ')})` : ''}

Once we receive this information, we will prepare a detailed proposal including all requested rate structures, service options, and terms. We are committed to providing competitive pricing and exceptional service to support ${data.companyName || '[Company Name]'} growth and operational efficiency.

We look forward to your response and the opportunity to discuss how DEPOINTE/Freight 1st Direct can best serve your logistics needs.

Best regards,
[Your Name]
[Your Position]
DEPOINTE/Freight 1st Direct
${data.contactPhone || '[Phone Number]'}
${data.contactEmail || '[Email Address]'}`;
  }

  static getDefaultQuestionnaireData(): ShipperQuestionnaireData {
    return {
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
    };
  }

  static validateQuestionnaireData(data: ShipperQuestionnaireData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.companyName?.trim()) {
      errors.push('Company name is required');
    }

    if (!data.contactName?.trim()) {
      errors.push('Contact name is required');
    }

    if (!data.contactEmail?.trim()) {
      errors.push('Contact email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
      errors.push('Invalid email format');
    }

    if (data.volume.palletsPerShipment <= 0) {
      errors.push('Pallets per shipment must be greater than 0');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static getQuestionnaireTemplateMetadata() {
    return {
      id: 'shipper_questionnaire',
      name: 'Shipper/Vendor Questionnaire',
      description:
        'Professional questionnaire template for DEPOINTE/Freight 1st Direct - gathering logistics requirements from potential shippers and vendors across all 50 US states, Canada, Mexico, Puerto Rico, and international locations',
      category: 'Questionnaire',
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      author: 'DEPOINTE AI System',
      tags: [
        'questionnaire',
        'shipper',
        'vendor',
        'logistics',
        'warehousing',
        'transportation',
      ],
      sections: [
        'Contact Information',
        'Location Specifications',
        'Product Details',
        'Volume and Frequency',
        'Timeline Requirements',
        'Transportation Services',
        'Additional Services',
        'Contract Terms',
      ],
    };
  }
}

export type { ShipperQuestionnaireData };
