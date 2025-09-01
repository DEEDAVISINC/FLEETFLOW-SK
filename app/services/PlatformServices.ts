/**
 * FLEETFLOW PLATFORM SERVICES
 * Core service offerings integrated into all lead generation and marketing strategies
 */

export interface PlatformService {
  id: string;
  name: string;
  tagline: string;
  description: string;
  benefits: string[];
  useCases: string[];
  pricing: string;
  targetAudience: string[];
}

export const PLATFORM_SERVICES: PlatformService[] = [
  {
    id: 'go_with_the_flow',
    name: 'GO WITH THE FLOW',
    tagline: 'Instant Carrier Matching & Booking',
    description:
      'Our revolutionary instant matching system connects shippers with available carriers in real-time. Get quotes and book shipments instantly without the wait times of traditional brokerage.',
    benefits: [
      'Instant carrier availability checks',
      'Real-time load matching',
      'Immediate booking confirmation',
      '24/7 automated matching',
      'Reduced booking time from hours to minutes',
      'Higher booking success rates',
    ],
    useCases: [
      'Time-sensitive shipments',
      'Emergency freight needs',
      'Last-minute capacity requirements',
      'Healthcare and medical supplies',
      'Perishable goods transportation',
      'Express delivery requirements',
    ],
    pricing: 'Included in all freight brokerage services',
    targetAudience: [
      'Shippers needing immediate solutions',
      'E-commerce businesses',
      'Healthcare providers',
      'Manufacturers with urgent needs',
      'Retailers with seasonal rushes',
      'Any business requiring fast freight solutions',
    ],
  },
  {
    id: 'marketplace_bidding',
    name: 'MARKETPLACE BIDDING',
    tagline: 'Competitive Carrier Auction System',
    description:
      'Access our competitive marketplace where multiple carriers bid on your loads, ensuring you get the best possible rates and service levels through transparent competition.',
    benefits: [
      'Multiple carrier quotes simultaneously',
      'Transparent competitive pricing',
      'Best rate guarantee',
      'Quality carrier selection',
      'Real-time bidding updates',
      'Cost savings through competition',
    ],
    useCases: [
      'Cost-sensitive shipments',
      'High-volume freight',
      'Enterprise-level shipping',
      'Regular route optimization',
      'Spot market opportunities',
      'Bulk transportation needs',
    ],
    pricing: 'Commission-based on negotiated rates',
    targetAudience: [
      'Cost-conscious shippers',
      'High-volume shippers',
      'Enterprise corporations',
      'Regular shippers seeking optimization',
      'Businesses with predictable freight needs',
      'Companies wanting competitive pricing',
    ],
  },
];

export const SERVICE_FEATURES = {
  goWithTheFlow: {
    instantMatching: 'Real-time carrier availability matching',
    automatedBooking: 'Automated load booking and confirmation',
    predictiveRouting: 'AI-powered optimal route selection',
    capacityAlerts: 'Proactive capacity availability notifications',
    emergencyResponse: '24/7 emergency freight coordination',
  },
  marketplaceBidding: {
    multiCarrierQuotes: 'Simultaneous quotes from qualified carriers',
    transparentPricing: 'Clear pricing and service level visibility',
    qualityAssurance: 'Carrier performance and safety verification',
    contractNegotiation: 'Automated contract and rate negotiation',
    performanceTracking: 'Real-time shipment tracking and updates',
  },
};

export const MARKETING_MESSAGES = {
  combinedPitch:
    'Experience the power of GO WITH THE FLOW instant matching and MARKETPLACE BIDDING competitive pricing - the ultimate freight solution for modern businesses.',
  goWithTheFlowHook:
    'Need freight booked NOW? GO WITH THE FLOW delivers instant carrier matching and immediate booking confirmation.',
  marketplaceBiddingHook:
    'Want the best rates? MARKETPLACE BIDDING pits carriers against each other to secure you the most competitive pricing.',
  healthcarePitch:
    'Critical medical shipments require instant solutions. GO WITH THE FLOW ensures your healthcare freight gets matched and booked immediately.',
  ecommercePitch:
    'Seasonal rushes demand speed. GO WITH THE FLOW instant matching + MARKETPLACE BIDDING competitive pricing = maximum e-commerce success.',
  enterprisePitch:
    'Large corporations deserve enterprise solutions. MARKETPLACE BIDDING delivers competitive pricing at scale with GO WITH THE FLOW instant execution.',
};

export const SALES_SCRIPTS = {
  initialPitch:
    'Our platform offers two revolutionary services that transform freight logistics: GO WITH THE FLOW for instant carrier matching and MARKETPLACE BIDDING for competitive pricing. Which would best serve your shipping needs?',
  objectionHandler:
    'While traditional brokerage can take hours or days, GO WITH THE FLOW delivers instant matching and MARKETPLACE BIDDING ensures competitive pricing - saving you time and money.',
  closingQuestion:
    'Would you like to experience GO WITH THE FLOW instant matching on your next shipment, or would MARKETPLACE BIDDING competitive pricing better serve your cost optimization goals?',
};
