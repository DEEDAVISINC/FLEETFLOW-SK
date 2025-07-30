// Tooltip content definitions for FleetFlow
export const tooltipContent = {
  // Dispatch Central
  dispatch: {
    loadStatus: {
      'In Transit': 'Load is currently being transported by the assigned carrier',
      'Delivered': 'Load has been successfully delivered to destination',
      'POD Pending': 'Proof of Delivery documentation is being processed',
      'Available': 'Load is ready for carrier assignment',
      'Assigned': 'Load has been assigned to a carrier but not yet picked up',
      'Picked Up': 'Load has been collected from origin and is in transit'
    },
    rateCalculation: 'Dispatch fee (10%) is automatically calculated from the total load rate',
    aiMatch: 'AI matching score based on carrier reliability, location, and capacity',
    priority: {
      'Hot': 'Urgent load requiring immediate attention',
      'Rush': 'High priority load with tight timeline',
      'Standard': 'Normal priority load with standard timeline'
    },
    carrierScore: 'Reliability rating based on on-time delivery, safety record, and communication'
  },

  // Driver Management
  driver: {
    dotCompliance: {
      'green': 'Driver is fully compliant with all DOT regulations',
      'yellow': 'Driver has minor compliance issues requiring attention',
      'red': 'Driver has serious compliance violations - immediate action required'
    },
    hosViolations: 'Hours of Service violations based on federal driving time regulations',
    backgroundCheck: 'Background verification status including MVR and criminal history',
    medicalCert: 'DOT medical certificate expiration and renewal status',
    licenseStatus: 'CDL license validity and endorsement verification'
  },

  // Broker Operations
  broker: {
    marginAnalysis: 'Profit margin calculation between shipper rate and carrier cost',
    loadBoards: 'Available freight from multiple load board sources',
    carrierNetwork: 'Verified carrier database with performance metrics',
    quoteGeneration: 'Automated freight quote generation with market rates',
    negotiation: 'Tools for rate negotiation and contract management'
  },

  // Billing & Accounting
  billing: {
    invoiceStatus: {
      'Draft': 'Invoice is being prepared but not yet sent',
      'Sent': 'Invoice has been sent to customer',
      'Paid': 'Invoice has been paid in full',
      'Overdue': 'Invoice payment is past due date',
      'Disputed': 'Invoice is under dispute resolution'
    },
    paymentTerms: 'Standard payment terms (e.g., Net 30, Quick Pay)',
    factoring: 'Invoice factoring options for immediate cash flow',
    collections: 'Automated collection process for overdue invoices'
  },

  // Training Modules
  training: {
    compliance: 'Mandatory training for DOT compliance and safety regulations',
    brokerCert: 'Broker certification and continuing education requirements',
    safetyTraining: 'Safety protocols and best practices for operations',
    systemTraining: 'FleetFlow system training and feature updates'
  },

  // Load Tracking
  tracking: {
    gpsLocation: 'Real-time GPS location of load in transit',
    estimatedArrival: 'Calculated arrival time based on current location and traffic',
    milestones: 'Key checkpoints in the load journey (pickup, delivery, etc.)',
    exceptions: 'Delays, route changes, or other disruptions to original plan'
  },

  // Carrier Verification
  verification: {
    insurance: 'Carrier insurance coverage verification and expiration dates',
    saferScore: 'FMCSA SAFER system safety rating',
    authorityStatus: 'Operating authority verification with FMCSA',
    creditCheck: 'Financial stability and credit rating assessment'
  }
};

// Helper function to get tooltip content
export const getTooltipContent = (section: string, key: string, subKey?: string) => {
  const content = tooltipContent[section as keyof typeof tooltipContent];
  if (!content) return '';
  
  if (subKey) {
    return (content as any)[key]?.[subKey] || '';
  }
  
  return (content as any)[key] || '';
}; 