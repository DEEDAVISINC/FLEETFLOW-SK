import { generatePageMetadata } from './metadata';

// Equipment-Specific Landing Page SEO for Carriers
export const equipmentSpecificSEO = {
  // Driver OTR Flow - FREE App
  driverOTRFlow: generatePageMetadata({
    title: 'FREE Driver OTR Flow App - FleetFlow Mobile App for Drivers',
    description:
      'FREE mobile app for owner operators and drivers. Driver OTR Flow includes load tracking, communication tools, document capture, and workflow management. Download free today.',
    keywords: [
      'free driver app',
      'free OTR app',
      'free trucking app for drivers',
      'driver OTR flow',
      'free driver portal',
      'free carrier app',
      'free owner operator app',
      'free mobile app for truckers',
      'free driver workflow app',
    ],
    path: '/driver-otr-flow',
  }),

  // Owner Operators
  ownerOperators: generatePageMetadata({
    title: 'Owner Operator Software - FREE Driver App & Business Tools',
    description:
      'Complete owner operator management with FREE Driver OTR Flow app. Business tools for independent drivers, single truck operators, and small fleet owners.',
    keywords: [
      'owner operator software',
      'owner operator management',
      'free owner operator app',
      'single truck operator',
      'independent truck driver',
      'owner operator business tools',
      'owner operator dispatch',
    ],
    path: '/owner-operators',
  }),

  // Dry Van Carriers
  dryVanCarriers: generatePageMetadata({
    title: 'Dry Van Carrier Management - Load Matching & Dispatch',
    description:
      'Specialized tools for dry van carriers including load matching, route optimization, and carrier management. Connect with high-paying dry van loads.',
    keywords: [
      'dry van carriers',
      'dry van load matching',
      'dry van dispatch software',
      'dry van carrier network',
      'dry van freight management',
    ],
    path: '/carriers/dry-van',
  }),

  // Reefer Carriers
  reeferCarriers: generatePageMetadata({
    title: 'Refrigerated Carrier Management - Reefer Load Dispatch',
    description:
      'Temperature-controlled transportation management for reefer carriers. Cold chain logistics, temperature monitoring, and specialized reefer load matching.',
    keywords: [
      'reefer carriers',
      'refrigerated carrier management',
      'reefer load dispatch',
      'temperature controlled transport',
      'cold chain carrier network',
    ],
    path: '/carriers/reefer',
  }),

  // Flatbed Carriers
  flatbedCarriers: generatePageMetadata({
    title: 'Flatbed Carrier Dispatch - Open Deck Transportation',
    description:
      'Flatbed and open deck carrier management with specialized load matching, securement tracking, and flatbed-specific workflow tools.',
    keywords: [
      'flatbed carriers',
      'flatbed carrier dispatch',
      'flatbed load management',
      'open deck carrier services',
      'flatbed transportation',
    ],
    path: '/carriers/flatbed',
  }),

  // Heavy Haul Carriers
  heavyHaulCarriers: generatePageMetadata({
    title: 'Heavy Haul Dispatch - Oversized Load Management',
    description:
      'Specialized heavy haul and oversized load management. Permit tracking, escort coordination, and heavy haul carrier dispatch services.',
    keywords: [
      'heavy haul carriers',
      'heavy haul dispatch',
      'oversized load carriers',
      'heavy haul permit management',
      'specialized transport carriers',
    ],
    path: '/carriers/heavy-haul',
  }),

  // Tanker Carriers
  tankerCarriers: generatePageMetadata({
    title: 'Tanker Carrier Management - Liquid Bulk Transportation',
    description:
      'Liquid bulk and tanker carrier management with hazmat compliance, tank washing tracking, and specialized tanker dispatch services.',
    keywords: [
      'tanker carriers',
      'liquid bulk carriers',
      'tanker dispatch software',
      'hazmat carrier management',
      'bulk transport network',
    ],
    path: '/carriers/tanker',
  }),

  // Car Hauler Carriers
  carHaulerCarriers: generatePageMetadata({
    title: 'Car Hauler Dispatch - Auto Transport Management',
    description:
      'Specialized car hauler and auto transport management. Vehicle tracking, damage inspection, and automotive logistics dispatch.',
    keywords: [
      'car hauler carriers',
      'auto transport dispatch',
      'car hauler management',
      'automotive logistics',
      'vehicle transport carriers',
    ],
    path: '/carriers/car-hauler',
  }),

  // Step Deck Carriers
  stepDeckCarriers: generatePageMetadata({
    title: 'Step Deck Carrier Dispatch - Specialized Equipment',
    description:
      'Step deck and lowboy carrier management with height clearance tracking, specialized load matching, and equipment-specific tools.',
    keywords: [
      'step deck carriers',
      'lowboy carriers',
      'step deck dispatch',
      'specialized equipment carriers',
      'height restricted loads',
    ],
    path: '/carriers/step-deck',
  }),

  // Dispatch Agencies
  dispatchAgencies: generatePageMetadata({
    title: 'Dispatch Agency Software - Multi-Client Management Platform',
    description:
      'Complete dispatch agency management software for third-party dispatch services. Multi-client operations, billing integration, and agency-specific tools.',
    keywords: [
      'dispatch agency software',
      'dispatch service providers',
      'trucking dispatch companies',
      'freight dispatch agencies',
      'third party dispatch',
      'dispatch agency management',
    ],
    path: '/dispatch-agencies',
  }),

  // Expedited Carriers
  expeditedCarriers: generatePageMetadata({
    title: 'Expedited Carrier Dispatch - Time-Critical Freight',
    description:
      'Time-critical and expedited freight management for urgent shipments. Real-time tracking, priority dispatch, and expedited carrier network.',
    keywords: [
      'expedited carriers',
      'expedited freight dispatch',
      'time critical transport',
      'urgent freight carriers',
      'expedited logistics',
    ],
    path: '/carriers/expedited',
  }),

  // LTL Carriers
  ltlCarriers: generatePageMetadata({
    title: 'LTL Carrier Management - Less Than Truckload Dispatch',
    description:
      'Less than truckload (LTL) carrier management with consolidated load planning, terminal operations, and LTL network optimization.',
    keywords: [
      'LTL carriers',
      'less than truckload',
      'LTL dispatch software',
      'consolidated freight',
      'LTL network management',
    ],
    path: '/carriers/ltl',
  }),

  // Container Carriers
  containerCarriers: generatePageMetadata({
    title: 'Container Carrier Dispatch - Intermodal Transportation',
    description:
      'Container and intermodal carrier management with port operations, chassis tracking, and container dispatch optimization.',
    keywords: [
      'container carriers',
      'intermodal carriers',
      'container dispatch',
      'port operations',
      'chassis management',
    ],
    path: '/carriers/container',
  }),
};

// Generate equipment-specific sitemap entries
export const generateEquipmentSitemap = () => {
  const baseUrl = 'https://fleetflowapp.com';
  return Object.keys(equipmentSpecificSEO).map((equipment) => {
    const metadata =
      equipmentSpecificSEO[equipment as keyof typeof equipmentSpecificSEO];
    return {
      url: `${baseUrl}${metadata.path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: equipment === 'driverOTRFlow' ? 0.9 : 0.8,
    };
  });
};
