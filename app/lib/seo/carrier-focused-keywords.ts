// Comprehensive Carrier & Driver SEO Keywords - FREE DRIVER OTR FLOW
export const carrierFocusedKeywords = {
  // FREE Driver OTR Flow Keywords
  freeDriverFlow: [
    'free driver app',
    'free OTR app',
    'free trucking app for drivers',
    'free driver portal',
    'free carrier app',
    'free owner operator app',
    'free driver OTR flow',
    'free trucking software for drivers',
    'free driver management app',
    'free load tracking for drivers',
    'free driver communication app',
    'free trucking app download',
    'no cost driver app',
    'free mobile app for truckers',
    'free driver workflow app',
  ],

  // Carrier Types & Equipment
  carrierEquipment: [
    'dry van carriers',
    'reefer carriers',
    'flatbed carriers',
    'step deck carriers',
    'lowboy carriers',
    'tanker carriers',
    'heavy haul carriers',
    'oversized load carriers',
    'car hauler carriers',
    'container carriers',
    'LTL carriers',
    'expedited carriers',
    'specialized carriers',
    'hazmat carriers',
    'livestock carriers',
    'bulk carriers',
    'pneumatic carriers',
    'curtain side carriers',
    'conestoga carriers',
    'removable gooseneck carriers',
  ],

  // Owner Operator Focused
  ownerOperator: [
    'owner operator software',
    'owner operator management',
    'owner operator dispatch',
    'owner operator load board',
    'owner operator truck management',
    'single truck operator',
    'independent truck driver',
    'owner operator business tools',
    'owner operator fleet management',
    'small fleet owner operator',
    'owner operator accounting',
    'owner operator compliance',
    'owner operator fuel management',
    'owner operator route planning',
  ],

  // Carrier Services
  carrierServices: [
    'carrier load matching',
    'carrier dispatch services',
    'carrier management platform',
    'carrier onboarding platform',
    'carrier qualification system',
    'carrier performance tracking',
    'carrier payment processing',
    'carrier document management',
    'carrier compliance tracking',
    'carrier rate negotiation',
    'carrier network access',
    'carrier portal software',
    'carrier relationship management',
    'carrier capacity planning',
  ],

  // Dispatch Agencies
  dispatchAgencies: [
    'dispatch agency software',
    'dispatch service providers',
    'trucking dispatch companies',
    'freight dispatch agencies',
    'dispatch agency management',
    'dispatch service platform',
    'dispatch agency tools',
    'third party dispatch',
    'dispatch company software',
    'dispatch agency dashboard',
    'dispatch service management',
    'dispatch agency operations',
    'independent dispatch services',
    'dispatch agency CRM',
  ],

  // Driver-Specific Features
  driverFeatures: [
    'driver mobile app',
    'driver communication platform',
    'driver workflow management',
    'driver document capture',
    'driver log management',
    'driver performance tracking',
    'driver settlement processing',
    'driver load assignment',
    'driver route optimization',
    'driver expense management',
    'driver fuel card integration',
    'driver safety monitoring',
    'driver training platform',
    'driver onboarding system',
  ],

  // Equipment Management
  equipmentManagement: [
    'truck fleet management',
    'trailer management system',
    'equipment tracking software',
    'asset management platform',
    'maintenance scheduling',
    'equipment utilization tracking',
    'fleet asset optimization',
    'equipment compliance tracking',
    'preventive maintenance software',
    'equipment inspection management',
    'fleet maintenance platform',
    'equipment lifecycle management',
  ],
};

// Long-tail keywords for carriers
export const carrierLongTailKeywords = [
  'free app for owner operator drivers',
  'best free trucking app for drivers',
  'free driver portal for carriers',
  'owner operator management software free',
  'free OTR driver workflow app',
  'dispatch services for owner operators',
  'carrier onboarding for small fleets',
  'free mobile app for independent drivers',
  'owner operator business management tools',
  'dispatch agency software for small companies',
  'carrier management for dispatch agencies',
  'free driver communication platform',
  'owner operator load board access',
  'dispatch services for specialized equipment',
  'carrier portal for equipment owners',
];

// Equipment-specific keywords
export const equipmentSpecificKeywords = {
  dryVan: [
    'dry van carrier management',
    'dry van load matching',
    'dry van dispatch software',
    'dry van carrier network',
  ],

  reefer: [
    'refrigerated carrier management',
    'reefer load dispatch',
    'temperature controlled transport',
    'cold chain carrier network',
  ],

  flatbed: [
    'flatbed carrier dispatch',
    'flatbed load management',
    'flatbed carrier network',
    'open deck carrier services',
  ],

  heavyHaul: [
    'heavy haul dispatch',
    'oversized load carriers',
    'heavy haul permit management',
    'specialized transport carriers',
  ],

  tanker: [
    'liquid bulk carriers',
    'tanker dispatch software',
    'hazmat carrier management',
    'bulk transport network',
  ],
};

// Dispatch agency specific keywords
export const dispatchAgencyKeywords = [
  'dispatch agency management software',
  'third party dispatch services',
  'dispatch company CRM',
  'dispatch agency client management',
  'dispatch service billing software',
  'dispatch agency operations platform',
  'independent dispatcher tools',
  'dispatch agency load board',
  'dispatch service provider software',
  'dispatch agency workflow management',
  'dispatch company dashboard',
  'dispatch agency carrier management',
  'dispatch service automation',
  'dispatch agency performance tracking',
];

// Combine all carrier keywords
export const getAllCarrierKeywords = (): string[] => {
  const allKeywords: string[] = [];

  Object.values(carrierFocusedKeywords).forEach((keywordArray) => {
    allKeywords.push(...keywordArray);
  });

  Object.values(equipmentSpecificKeywords).forEach((keywordArray) => {
    allKeywords.push(...keywordArray);
  });

  allKeywords.push(...carrierLongTailKeywords);
  allKeywords.push(...dispatchAgencyKeywords);

  return [...new Set(allKeywords)]; // Remove duplicates
};
