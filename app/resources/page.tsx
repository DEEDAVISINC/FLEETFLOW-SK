'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Resource {
  name: string;
  description: string;
  website: string;
  category: string;
  type?: string;
  features?: string[];
  contact?: string;
  tags?: string[];
}

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    'drivers' | 'dispatch' | 'broker' | 'heavyhaul' | 'factoring'
  >('drivers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // All Resources Data
  const allResources: Record<string, Resource[]> = {
    drivers: [
      // Trucker Hotels & Lodging
      {
        name: 'TA Travel Centers',
        description:
          'Nationwide truck stops with hotels, parking, and amenities',
        website: 'https://ta-petro.com',
        category: 'Hotels & Lodging',
        features: [
          'Truck Parking',
          'Shower Facilities',
          'Restaurants',
          'Fuel',
          'Maintenance',
        ],
        tags: ['parking', 'hotels', 'fuel', 'maintenance'],
      },
      {
        name: 'Pilot Flying J',
        description: 'Premier truck stop chain with comprehensive services',
        website: 'https://pilotflyingj.com',
        category: 'Hotels & Lodging',
        features: [
          'myRewards Program',
          'Reserve Parking',
          'Showers',
          'Laundry',
          'CAT Scales',
        ],
        tags: ['parking', 'rewards', 'fuel', 'scales'],
      },
      {
        name: 'Loves Travel Stops',
        description: 'Family-owned travel stops with trucker amenities',
        website: 'https://loves.com',
        category: 'Hotels & Lodging',
        features: [
          'Truck Parking',
          'Fresh Food',
          'Showers',
          'Dog Parks',
          'WiFi',
        ],
        tags: ['parking', 'food', 'pet-friendly', 'wifi'],
      },
      {
        name: 'Motel 6',
        description: 'Budget-friendly motels with truck parking',
        website: 'https://motel6.com',
        category: 'Hotels & Lodging',
        features: ['Truck Parking', 'Pet Friendly', 'WiFi', 'Easy Access'],
        tags: ['budget', 'parking', 'pet-friendly', 'wifi'],
      },
      {
        name: 'Red Roof Inn',
        description: 'Extended truck parking and driver discounts',
        website: 'https://redroof.com',
        category: 'Hotels & Lodging',
        features: [
          'Truck Parking',
          'Driver Rates',
          'Pet Friendly',
          'Continental Breakfast',
        ],
        tags: ['parking', 'discounts', 'breakfast', 'pet-friendly'],
      },
      {
        name: 'La Quinta Inn & Suites',
        description: 'Truck-friendly accommodations with driver amenities',
        website: 'https://lq.com',
        category: 'Hotels & Lodging',
        features: ['Truck Parking', 'Free WiFi', 'Pet Friendly', 'Breakfast'],
        tags: ['parking', 'wifi', 'breakfast', 'pet-friendly'],
      },
      {
        name: 'Days Inn',
        description: 'Affordable lodging with truck parking availability',
        website: 'https://daysinn.com',
        category: 'Hotels & Lodging',
        features: ['Truck Parking', 'Continental Breakfast', 'WiFi', 'Pool'],
        tags: ['budget', 'parking', 'breakfast', 'wifi'],
      },

      // Parking & Navigation
      {
        name: 'Trucker Path App',
        description: 'Find truck stops, parking, and amenities nationwide',
        website: 'https://truckerpath.com',
        category: 'Parking & Navigation',
        type: 'Mobile App',
        tags: ['app', 'parking', 'navigation', 'amenities'],
      },
      {
        name: 'Park My Truck',
        description: 'Real-time truck parking availability tracker',
        website: 'https://parkmytruck.com',
        category: 'Parking & Navigation',
        type: 'Web Platform',
        tags: ['parking', 'real-time', 'availability'],
      },
      {
        name: 'Truck Smart Parking',
        description: 'Verified safe parking locations for professional drivers',
        website: 'https://trucksmartparking.com',
        category: 'Parking & Navigation',
        type: 'Directory',
        tags: ['parking', 'safety', 'verified'],
      },
      {
        name: 'Truck Stop Guide',
        description: 'Comprehensive directory of truck stops and services',
        website: 'https://truckstopguide.com',
        category: 'Parking & Navigation',
        type: 'Directory',
        tags: ['directory', 'truck-stops', 'services'],
      },
      {
        name: 'Garmin Truck GPS',
        description:
          'GPS navigation designed specifically for commercial trucks',
        website: 'https://garmin.com',
        category: 'Parking & Navigation',
        type: 'Hardware',
        tags: ['gps', 'navigation', 'commercial', 'routing'],
      },

      // Training & Certification
      {
        name: 'ELDT CDL Training Program',
        description:
          "Required ELDT theory course for Class A Commercial Driver's License permit test. FMCSA approved Entry-Level Driver Training curriculum.",
        website: 'mailto:admin@fleetflow.com?subject=CDL Training Inquiry',
        category: 'Training & Certification',
        contact: 'Contact Admin for Enrollment',
        tags: ['cdl', 'training', 'eldt', 'fmcsa'],
      },
      {
        name: 'HIPAA Compliance Training',
        description:
          'Essential certification for drivers transporting medical and pharmaceutical freight. Opens premium opportunities in medical transport.',
        website: 'https://nalearning.org/hipaa/deedav1sinc',
        category: 'Training & Certification',
        contact: 'Enroll Now',
        tags: ['hipaa', 'medical', 'pharmaceutical', 'certification'],
      },
      {
        name: 'Bloodborne Pathogens Certification',
        description:
          'Critical safety training for drivers handling medical waste, laboratory specimens, and biohazardous materials.',
        website: 'https://nalearning.org/pathogens/deedav1sinc',
        category: 'Training & Certification',
        contact: 'Enroll Now',
        tags: ['bloodborne', 'medical', 'safety', 'certification'],
      },
      {
        name: 'Hazmat Certification',
        description:
          'Required certification for transporting hazardous materials',
        website: 'https://www.tsa.gov/for-industry/hazmat',
        category: 'Training & Certification',
        tags: ['hazmat', 'certification', 'dangerous-goods'],
      },
      {
        name: 'Defensive Driving Course',
        description:
          'Professional defensive driving training for commercial drivers',
        website: 'https://www.nsc.org/safety-training/defensive-driving',
        category: 'Training & Certification',
        tags: ['defensive-driving', 'safety', 'training'],
      },

      // Load Boards & Job Platforms
      {
        name: 'DAT Load Board',
        description: 'Premium load matching platform for owner-operators',
        website: 'https://dat.com',
        category: 'Load Boards',
        tags: ['load-board', 'freight', 'owner-operator'],
      },
      {
        name: 'Truckstop.com Load Board',
        description: 'One of the largest load boards in North America',
        website: 'https://truckstop.com',
        category: 'Load Boards',
        tags: ['load-board', 'freight', 'marketplace'],
      },
      {
        name: 'Uber Freight',
        description:
          'Digital freight marketplace connecting shippers and carriers',
        website: 'https://uberfreight.com',
        category: 'Load Boards',
        tags: ['digital', 'marketplace', 'freight'],
      },
      {
        name: 'Convoy',
        description: 'Digital freight network with transparent pricing',
        website: 'https://convoy.com',
        category: 'Load Boards',
        tags: ['digital', 'transparent', 'freight'],
      },
      {
        name: 'FreightWaves',
        description: 'Freight market intelligence and load board platform',
        website: 'https://freightwaves.com',
        category: 'Load Boards',
        tags: ['intelligence', 'market', 'freight'],
      },

      // Permits & Licensing
      {
        name: 'IRP (International Registration Plan)',
        description:
          'Base state registration and apportioned plates for interstate commercial vehicles',
        website: 'https://www.irponline.org',
        category: 'Permits & Licensing',
        tags: ['irp', 'registration', 'interstate', 'plates'],
      },
      {
        name: 'IFTA (International Fuel Tax Agreement)',
        description:
          'Fuel tax reporting and licensing for commercial motor vehicles',
        website: 'https://www.iftach.org',
        category: 'Permits & Licensing',
        tags: ['ifta', 'fuel-tax', 'reporting', 'compliance'],
      },
      {
        name: 'UCR (Unified Carrier Registration)',
        description:
          'Annual registration and fee system for interstate motor carriers',
        website: 'https://www.ucr.in.gov',
        category: 'Permits & Licensing',
        tags: ['ucr', 'carrier-registration', 'annual', 'interstate'],
      },
      {
        name: 'USDOT Number Registration',
        description:
          'Required federal registration for commercial motor vehicles',
        website: 'https://www.fmcsa.dot.gov/registration',
        category: 'Permits & Licensing',
        tags: ['usdot', 'federal', 'registration', 'commercial'],
      },
      {
        name: 'MC Authority (Operating Authority)',
        description:
          'Interstate transportation authority for freight and passenger carriers',
        website:
          'https://www.fmcsa.dot.gov/registration/get-mc-number-authority',
        category: 'Permits & Licensing',
        tags: ['mc-authority', 'operating-authority', 'freight', 'interstate'],
      },
      {
        name: 'Oversize/Overweight Permits',
        description:
          'State-specific permits for loads exceeding legal size and weight limits',
        website: 'https://www.heavyhaulinfo.com/permits',
        category: 'Permits & Licensing',
        tags: ['oversize', 'overweight', 'permits', 'state-specific'],
      },
      {
        name: 'Trip Permits',
        description:
          'Temporary permits for vehicles without proper registration in specific states',
        website: 'https://www.aamva.org/trip-permits',
        category: 'Permits & Licensing',
        tags: ['trip-permits', 'temporary', 'state-specific', 'unregistered'],
      },
      {
        name: 'Hazmat Endorsement',
        description:
          'TSA background check and endorsement for hazardous materials transport',
        website: 'https://www.tsa.gov/for-industry/hazmat-endorsement',
        category: 'Permits & Licensing',
        tags: ['hazmat', 'tsa', 'endorsement', 'background-check'],
      },
      {
        name: 'Border Crossing Permits',
        description:
          'FAST, TWIC, and other border crossing credentials for US/Canada/Mexico',
        website: 'https://www.cbp.gov/travel/trusted-traveler-programs',
        category: 'Permits & Licensing',
        tags: ['border-crossing', 'fast', 'twic', 'customs'],
      },
      {
        name: 'Permit Processing Services',
        description:
          'Third-party services for permit applications and renewals',
        website: 'https://www.permitservice.com',
        category: 'Permits & Licensing',
        tags: ['permit-processing', 'third-party', 'applications', 'renewals'],
      },

      // Emergency & Roadside Assistance
      {
        name: 'TA Petro Roadside Assistance',
        description:
          'Professional roadside assistance service request form for breakdowns, tire service, and emergency repairs',
        website:
          'https://www.access-billing-services.com/loyalty/servicerequest.aspx',
        category: 'Emergency & Roadside',
        features: [
          'Breakdown Service',
          'Tire Service',
          'Emergency Repairs',
          'Company/Driver Billing Options',
          'Location-Based Service',
          'Email Updates',
        ],
        contact: 'Online Service Request',
        tags: ['roadside-assistance', 'breakdown', 'tire-service', 'emergency'],
      },
      {
        name: 'TA Travel Centers Emergency Services',
        description:
          'Comprehensive emergency roadside assistance through TA Travel Centers network',
        website: 'https://ta-petro.com',
        category: 'Emergency & Roadside',
        features: [
          'Nationwide Coverage',
          '24/7 Service',
          'Mobile Repair Units',
          'Tire Services',
          'Fuel Delivery',
        ],
        tags: ['emergency', 'roadside', 'nationwide', '24-7'],
      },

      // Support & Services
      {
        name: 'OOIDA',
        description:
          'Owner-Operator Independent Drivers Association - advocacy and support',
        website: 'https://ooida.com',
        category: 'Support & Services',
        tags: ['advocacy', 'owner-operator', 'support'],
      },
      {
        name: 'FMCSA',
        description:
          'Federal Motor Carrier Safety Administration - regulations and compliance',
        website: 'https://fmcsa.dot.gov',
        category: 'Support & Services',
        tags: ['regulations', 'compliance', 'government'],
      },
      {
        name: 'ATRI',
        description:
          'American Transportation Research Institute - industry research',
        website: 'https://truckingresearch.org',
        category: 'Support & Services',
        tags: ['research', 'industry', 'data'],
      },
      {
        name: 'Truckers Against Trafficking',
        description:
          'Training truckers to recognize and report human trafficking',
        website: 'https://truckersagainsttrafficking.org',
        category: 'Support & Services',
        tags: ['safety', 'training', 'social-impact'],
      },
      {
        name: 'Driver Retention Hub',
        description:
          'Comprehensive driver retention strategies and best practices toolkit',
        website: 'https://driverretentionhub.com',
        category: 'Support & Services',
        features: [
          'Retention Analytics',
          'Exit Interview Tools',
          'Best Practices Library',
          'Benchmarking',
        ],
        tags: ['retention', 'hr', 'analytics', 'best-practices'],
      },
      {
        name: 'Fleet Performance Pro',
        description:
          'Advanced driver performance management and tracking platform',
        website: 'https://fleetperformancepro.com',
        category: 'Support & Services',
        features: [
          'Performance Metrics',
          'Driver Scorecards',
          'Behavioral Analytics',
          'Coaching Tools',
        ],
        tags: ['performance', 'tracking', 'metrics', 'coaching'],
      },
      {
        name: 'TruckComm Central',
        description:
          'Dispatcher-driver communication protocols and training platform',
        website: 'https://truckcommcentral.com',
        category: 'Support & Services',
        features: [
          'Communication Templates',
          'Protocol Training',
          'Message Standards',
          'Best Practices',
        ],
        tags: ['communication', 'protocols', 'training', 'dispatcher'],
      },
      {
        name: 'Driver Incentive Manager',
        description:
          'Comprehensive bonus management and incentive program platform',
        website: 'https://driverincentivemanager.com',
        category: 'Support & Services',
        features: [
          'Bonus Tracking',
          'Incentive Programs',
          'Performance Rewards',
          'Automated Payouts',
        ],
        tags: ['incentives', 'bonuses', 'rewards', 'management'],
      },

      // Financial Services
      {
        name: 'TAFS',
        description:
          'Transportation Alliance Financial Services - trucking-focused banking',
        website: 'https://tafs.com',
        category: 'Financial Services',
        tags: ['banking', 'financial', 'trucking'],
      },
      {
        name: 'TruckLoanCenter',
        description: 'Specialized financing for commercial truck purchases',
        website: 'https://truckloancenter.com',
        category: 'Financial Services',
        tags: ['financing', 'truck-loans', 'equipment'],
      },
      {
        name: 'Apex Fuel Cards',
        description: 'Fuel card programs with discounts and reporting',
        website: 'https://apexfuelcards.com',
        category: 'Financial Services',
        tags: ['fuel-cards', 'discounts', 'reporting'],
      },

      // Factoring & Invoice Services
      {
        name: 'TBS Factoring',
        description:
          'Leading transportation factoring company with competitive rates and same-day funding',
        website: 'https://tbsfactoring.com',
        category: 'Factoring & Invoice Services',
        features: [
          'Same-Day Funding',
          'Fuel Card Programs',
          'Online Account Management',
          'Non-Recourse Factoring',
          'No Long-Term Contracts',
        ],
        contact: 'Get Quote',
        tags: ['factoring', 'same-day-funding', 'fuel-cards', 'non-recourse'],
      },
      {
        name: 'Apex Capital',
        description:
          'Truck factoring with fuel discounts and quick approval process',
        website: 'https://apexcapitalcorp.com',
        category: 'Factoring & Invoice Services',
        features: [
          '24-Hour Approval',
          'Fuel Discount Programs',
          'Load Board Access',
          'Mobile App',
          'Dedicated Account Manager',
        ],
        tags: ['factoring', 'fuel-discounts', 'quick-approval', 'mobile-app'],
      },
      {
        name: 'RTS Financial Services',
        description:
          'Comprehensive factoring solutions with integrated fuel card and business tools',
        website: 'https://rtsfinancial.com',
        category: 'Factoring & Invoice Services',
        features: [
          'Integrated Fuel Cards',
          'Business Credit Building',
          'Online Portal',
          'Load Advance Options',
          'Insurance Programs',
        ],
        tags: ['factoring', 'fuel-cards', 'credit-building', 'insurance'],
      },
      {
        name: 'OTR Capital',
        description:
          'Over-the-road factoring specialists with personalized service',
        website: 'https://otrcapital.com',
        category: 'Factoring & Invoice Services',
        features: [
          'Personal Account Managers',
          'Quick Pay Options',
          'Fuel Programs',
          'Load Board Partnerships',
          '24/7 Customer Service',
        ],
        tags: ['factoring', 'personal-service', 'quick-pay', 'fuel-programs'],
      },
      {
        name: 'Bay View Funding',
        description:
          'Transportation factoring with focus on owner-operators and small fleets',
        website: 'https://bayviewfunding.com',
        category: 'Factoring & Invoice Services',
        features: [
          'Owner-Operator Focus',
          'Competitive Rates',
          'Fast Approval',
          'Fuel Card Integration',
          'No Hidden Fees',
        ],
        tags: ['factoring', 'owner-operator', 'competitive-rates', 'no-fees'],
      },
      {
        name: 'Interstate Capital',
        description:
          'Factoring and business solutions for trucking companies of all sizes',
        website: 'https://interstatecapital.com',
        category: 'Factoring & Invoice Services',
        features: [
          'Fleet Solutions',
          'Business Consulting',
          'Fuel Programs',
          'Equipment Financing',
          'Credit Protection',
        ],
        tags: [
          'factoring',
          'fleet-solutions',
          'consulting',
          'equipment-financing',
        ],
      },
      {
        name: 'Riviera Finance',
        description:
          'Invoice factoring with emphasis on cash-flow solutions and customer service',
        website: 'https://rivierafinance.com',
        category: 'Factoring & Invoice Services',
        features: [
          'Cash Flow Solutions',
          'Customer Service Focus',
          'Online Account Access',
          'Same-Day Processing',
          'Credit Checking',
        ],
        tags: ['factoring', 'cash-flow', 'customer-service', 'same-day'],
      },
      {
        name: 'Quick Pay Factoring Solutions',
        description:
          'Specialized quick-pay and same-day funding services for urgent cash flow needs',
        website: 'https://quickpayfactoring.com',
        category: 'Factoring & Invoice Services',
        features: [
          'Same-Day Funding',
          'Quick Pay Specialists',
          'Emergency Funding',
          'Mobile Deposits',
          'Instant Notifications',
        ],
        contact: 'Emergency Funding Available',
        tags: ['quick-pay', 'same-day', 'emergency-funding', 'mobile'],
      },
      {
        name: 'Non-Recourse Factoring Hub',
        description:
          'Directory and comparison tool for non-recourse factoring services',
        website: 'https://nonrecoursefactoring.com',
        category: 'Factoring & Invoice Services',
        features: [
          'Non-Recourse Options',
          'Rate Comparison',
          'Service Reviews',
          'Educational Resources',
          'Company Matching',
        ],
        contact: 'Compare Services',
        tags: ['non-recourse', 'comparison', 'reviews', 'education'],
      },
      {
        name: 'Factoring Rate Calculator',
        description:
          'Free tools to calculate and compare factoring rates and costs',
        website: 'https://factoringcalculator.com',
        category: 'Factoring & Invoice Services',
        features: [
          'Rate Calculator',
          'Cost Comparison',
          'ROI Analysis',
          'Service Comparison',
          'Educational Guides',
        ],
        contact: 'Free Tools',
        tags: ['calculator', 'comparison', 'roi-analysis', 'free-tools'],
      },

      // Cross-Border & Customs Resources for Drivers
      {
        name: 'FAST Program (Free and Secure Trade)',
        description:
          'Expedited border crossing program for commercial drivers on US-Canada routes',
        website: 'https://www.cbp.gov/travel/trusted-traveler-programs/fast',
        category: 'Cross-Border Operations',
        features: [
          'Expedited Processing',
          'Dedicated Lanes',
          'Background Check Required',
          'US-Canada Operations',
        ],
        tags: ['fast', 'border-crossing', 'canada', 'expedited'],
      },
      {
        name: 'TWIC Card (Transportation Worker ID)',
        description:
          'Required identification for drivers accessing secure maritime facilities and ports',
        website: 'https://www.tsa.gov/for-industry/twic',
        category: 'Cross-Border Operations',
        features: [
          'Port Access',
          'Maritime Facilities',
          'Background Check',
          'Biometric ID',
        ],
        tags: ['twic', 'port-access', 'maritime', 'tsa'],
      },
      {
        name: 'Cross-Border Documentation Guide',
        description:
          'Essential documentation requirements for drivers on international routes',
        website: 'https://usacustomsclearance.com/',
        category: 'Cross-Border Operations',
        features: [
          'Documentation Checklist',
          'Border Requirements',
          'Driver Responsibilities',
          'Customs Procedures',
        ],
        contact: 'Free Resources Available',
        tags: [
          'documentation',
          'international',
          'border-requirements',
          'customs',
        ],
      },
    ],

    dispatch: [
      // Transportation Management Systems
      {
        name: 'McLeod Software',
        description: 'Comprehensive transportation management system',
        website: 'https://mcleodsoft.com',
        category: 'TMS',
        tags: ['tms', 'dispatch', 'management'],
      },
      {
        name: 'Sylectus',
        description: 'Real-time dispatch and tracking platform',
        website: 'https://sylectus.com',
        category: 'TMS',
        tags: ['dispatch', 'tracking', 'real-time'],
      },
      {
        name: 'TMW Systems',
        description: 'Enterprise transportation management solutions',
        website: 'https://tmwsystems.com',
        category: 'TMS',
        tags: ['enterprise', 'tms', 'solutions'],
      },
      {
        name: 'PCS Software',
        description:
          'Trucking software solutions for dispatch and fleet management',
        website: 'https://pcssoftware.com',
        category: 'TMS',
        tags: ['dispatch', 'fleet', 'trucking'],
      },
      {
        name: 'Tailwind',
        description: 'Modern TMS designed for trucking companies',
        website: 'https://tailwindapp.com',
        category: 'TMS',
        tags: ['modern', 'trucking', 'cloud'],
      },

      // Load Boards & Freight Matching
      {
        name: 'LoadDex',
        description: 'Load board and freight matching system',
        website: 'https://loaddex.com',
        category: 'Load Boards',
        tags: ['load-board', 'freight', 'matching'],
      },
      {
        name: 'Central Dispatch',
        description: 'Auto transport load board and dispatch system',
        website: 'https://centraldispatch.com',
        category: 'Load Boards',
        tags: ['auto-transport', 'dispatch', 'load-board'],
      },
      {
        name: 'NextLoad',
        description: 'Digital freight marketplace with automated matching',
        website: 'https://nextload.com',
        category: 'Load Boards',
        tags: ['digital', 'automated', 'freight'],
      },

      // Communication & Tracking
      {
        name: 'Omnitracs',
        description: 'Fleet management and driver communication platform',
        website: 'https://omnitracs.com',
        category: 'Communication',
        tags: ['fleet', 'communication', 'tracking'],
      },
      {
        name: 'Samsara',
        description: 'Connected fleet platform with real-time tracking',
        website: 'https://samsara.com',
        category: 'Communication',
        tags: ['connected', 'tracking', 'iot'],
      },
      {
        name: 'Geotab',
        description: 'GPS fleet tracking and telematics solutions',
        website: 'https://geotab.com',
        category: 'Communication',
        tags: ['gps', 'telematics', 'fleet'],
      },
      {
        name: 'Verizon Connect',
        description: 'Fleet management and mobile workforce solutions',
        website: 'https://verizonconnect.com',
        category: 'Communication',
        tags: ['fleet', 'mobile', 'workforce'],
      },
      {
        name: 'Dispatch Communication Hub',
        description:
          'Standardized communication protocols for dispatcher-driver interactions',
        website: 'https://dispatchcommhub.com',
        category: 'Communication',
        features: [
          'Protocol Templates',
          'Message Standards',
          'Communication Training',
          'Best Practices',
        ],
        tags: ['communication', 'protocols', 'standards', 'training'],
      },
      {
        name: 'Driver Performance Analytics',
        description:
          'Comprehensive driver performance tracking and management for dispatchers',
        website: 'https://driverperformanceanalytics.com',
        category: 'Communication',
        features: [
          'Performance Dashboards',
          'Driver Scorecards',
          'Communication Logs',
          'Coaching Tools',
        ],
        tags: ['performance', 'analytics', 'tracking', 'coaching'],
      },

      // Analytics & Reporting
      {
        name: 'Tableau',
        description: 'Business intelligence and analytics platform',
        website: 'https://tableau.com',
        category: 'Analytics',
        tags: ['analytics', 'business-intelligence', 'reporting'],
      },
      {
        name: 'PowerBI',
        description: 'Microsoft business analytics and reporting tools',
        website: 'https://powerbi.microsoft.com',
        category: 'Analytics',
        tags: ['analytics', 'microsoft', 'reporting'],
      },
      {
        name: 'FreightWaves SONAR',
        description: 'Freight market intelligence and analytics platform',
        website: 'https://sonar.freightwaves.com',
        category: 'Analytics',
        tags: ['freight', 'intelligence', 'market'],
      },

      // Permits & Compliance
      {
        name: 'Permit Matrix',
        description:
          'Permit requirement matrix and compliance tracking for dispatchers',
        website: 'https://permitmatrix.com',
        category: 'Permits & Compliance',
        tags: ['permit-matrix', 'requirements', 'compliance', 'dispatch'],
      },
      {
        name: 'Route Compliance Check',
        description:
          'Automated route compliance checking for permit requirements',
        website: 'https://routecompliance.com',
        category: 'Permits & Compliance',
        tags: [
          'route-compliance',
          'automated',
          'permit-requirements',
          'checking',
        ],
      },
      {
        name: 'Dispatch Permit Manager',
        description:
          'Permit management system integrated with dispatch operations',
        website: 'https://dispatchpermitmanager.com',
        category: 'Permits & Compliance',
        tags: ['dispatch', 'permit-management', 'integrated', 'operations'],
      },
      {
        name: 'State Permit Database',
        description:
          'Comprehensive database of state permit requirements and restrictions',
        website: 'https://statepermitdb.com',
        category: 'Permits & Compliance',
        tags: ['state-permits', 'database', 'requirements', 'restrictions'],
      },

      // International Dispatch & Customs Coordination
      {
        name: 'International Freight Dispatch Support',
        description:
          'Dispatch coordination for international freight with customs clearance integration',
        website: 'https://usacustomsclearance.com/',
        category: 'International Operations',
        features: [
          'Customs Documentation Coordination',
          'Import Timeline Management',
          'PGA Requirements Tracking',
          'Border Crossing Scheduling',
        ],
        contact: 'Call: 855-912-0406',
        tags: [
          'international-dispatch',
          'customs-coordination',
          'import-timeline',
          'border-crossing',
        ],
      },
      {
        name: 'Import Documentation Management',
        description:
          'Streamlined import document management for dispatch operations',
        website: 'https://usacustomsclearance.com/',
        category: 'International Operations',
        features: [
          'Document Tracking',
          'Customs Forms Management',
          'PGA Coordination',
          'Compliance Monitoring',
        ],
        tags: [
          'document-management',
          'customs-forms',
          'pga',
          'compliance-tracking',
        ],
      },
      {
        name: 'Cross-Border Load Planning',
        description:
          'Specialized load planning for international freight with customs considerations',
        website: 'https://usacustomsclearance.com/',
        category: 'International Operations',
        features: [
          'Customs Clearance Integration',
          'Border Delay Planning',
          'Documentation Requirements',
          'Multi-Modal Coordination',
        ],
        tags: [
          'load-planning',
          'cross-border',
          'customs-integration',
          'multi-modal',
        ],
      },

      // Factoring & Invoice Services
      {
        name: 'Dispatch Factoring Solutions',
        description:
          'Factoring services optimized for dispatch operations and cash flow management',
        website: 'https://dispatchfactoring.com',
        category: 'Factoring & Invoice Services',
        features: [
          'Dispatch Integration',
          'Load-Based Funding',
          'Carrier Payment Management',
          'Cash Flow Optimization',
          'Real-Time Reporting',
        ],
        tags: [
          'dispatch-factoring',
          'load-funding',
          'carrier-payments',
          'cash-flow',
        ],
      },
      {
        name: 'Fleet Cash Flow Management',
        description:
          'Comprehensive cash flow solutions for fleet dispatch operations',
        website: 'https://fleetcashflow.com',
        category: 'Factoring & Invoice Services',
        features: [
          'Fleet-Wide Factoring',
          'Driver Payment Solutions',
          'Fuel Card Integration',
          'Expense Management',
          'Financial Reporting',
        ],
        tags: [
          'fleet-cash-flow',
          'driver-payments',
          'fuel-integration',
          'expense-management',
        ],
      },
      {
        name: 'Dispatch Payment Automation',
        description:
          'Automated payment processing and factoring for dispatch operations',
        website: 'https://dispatchpayments.com',
        category: 'Factoring & Invoice Services',
        features: [
          'Automated Payments',
          'Load Completion Funding',
          'Driver Settlement',
          'Invoice Processing',
          'Payment Tracking',
        ],
        tags: [
          'payment-automation',
          'load-funding',
          'driver-settlement',
          'invoice-processing',
        ],
      },
    ],

    broker: [
      // Verification & Compliance
      {
        name: 'Carrier411',
        description: 'Carrier verification and monitoring platform',
        website: 'https://carrier411.com',
        category: 'Verification',
        tags: ['verification', 'monitoring', 'compliance'],
      },
      {
        name: 'SAFER',
        description: 'FMCSA Safety and Fitness Electronic Records system',
        website: 'https://safer.fmcsa.dot.gov',
        category: 'Verification',
        tags: ['safety', 'fmcsa', 'records'],
      },
      {
        name: 'Highway',
        description: 'Carrier onboarding and compliance management',
        website: 'https://highway.com',
        category: 'Verification',
        tags: ['onboarding', 'compliance', 'carrier'],
      },
      {
        name: 'VisTracks',
        description: 'Real-time carrier monitoring and compliance tracking',
        website: 'https://vistracks.com',
        category: 'Verification',
        tags: ['monitoring', 'compliance', 'real-time'],
      },

      // Risk Management
      {
        name: 'RMIS',
        description: 'Risk Management Information System for freight brokers',
        website: 'https://rmis.com',
        category: 'Risk Management',
        tags: ['risk', 'management', 'broker'],
      },
      {
        name: 'SambaSafety',
        description: 'Driver monitoring and risk management platform',
        website: 'https://sambasafety.com',
        category: 'Risk Management',
        tags: ['driver', 'monitoring', 'risk'],
      },
      {
        name: 'TruckInsight',
        description: 'Carrier safety and compliance monitoring',
        website: 'https://truckinsight.com',
        category: 'Risk Management',
        tags: ['safety', 'compliance', 'carrier'],
      },

      // Broker TMS
      {
        name: 'FreightPath',
        description: 'Modern TMS built for freight brokers',
        website: 'https://freightpath.com',
        category: 'TMS',
        tags: ['tms', 'broker', 'modern'],
      },
      {
        name: 'Loadsmart',
        description: 'AI-powered freight brokerage platform',
        website: 'https://loadsmart.com',
        category: 'TMS',
        tags: ['ai', 'brokerage', 'automation'],
      },
      {
        name: 'Truckstop.com Broker',
        description: 'Comprehensive broker platform with load board access',
        website: 'https://truckstop.com',
        category: 'TMS',
        tags: ['broker', 'load-board', 'platform'],
      },
      {
        name: 'TruckingOffice',
        description: 'Complete trucking management software for brokers',
        website: 'https://truckingoffice.com',
        category: 'TMS',
        tags: ['management', 'broker', 'software'],
      },

      // Insurance & Legal
      {
        name: 'Progressive Commercial',
        description: 'Commercial trucking insurance solutions',
        website: 'https://progressivecommercial.com',
        category: 'Insurance',
        tags: ['insurance', 'commercial', 'trucking'],
      },
      {
        name: 'Great West Casualty',
        description: 'Specialized trucking insurance and risk management',
        website: 'https://gwccnet.com',
        category: 'Insurance',
        tags: ['insurance', 'risk', 'trucking'],
      },
      {
        name: 'TransGuard',
        description: 'Freight broker insurance and bonding services',
        website: 'https://transguard.net',
        category: 'Insurance',
        tags: ['insurance', 'bonding', 'broker'],
      },

      // Permits & Compliance
      {
        name: 'Permit Central',
        description:
          'Comprehensive permit management and compliance tracking for brokers',
        website: 'https://permitcentral.com',
        category: 'Permits & Compliance',
        tags: ['permit-management', 'compliance', 'tracking', 'broker'],
      },
      {
        name: 'Compliance.ai',
        description: 'AI-powered compliance monitoring and permit verification',
        website: 'https://compliance.ai',
        category: 'Permits & Compliance',
        tags: ['ai', 'compliance', 'monitoring', 'verification'],
      },
      {
        name: 'Permit Tracker Pro',
        description: 'Real-time permit status tracking and renewal alerts',
        website: 'https://permittrackerpro.com',
        category: 'Permits & Compliance',
        tags: ['permit-tracking', 'renewal', 'alerts', 'status'],
      },
      {
        name: 'DOT Compliance Suite',
        description:
          'Complete DOT compliance management and permit coordination',
        website: 'https://dotcompliancesuite.com',
        category: 'Permits & Compliance',
        tags: ['dot-compliance', 'management', 'coordination', 'permits'],
      },

      // Credit & Financial Services
      {
        name: 'Ansonia Credit Data',
        description: 'Transportation credit reporting and monitoring',
        website: 'https://ansoniacredit.com',
        category: 'Financial Services',
        tags: ['credit', 'reporting', 'transportation'],
      },
      {
        name: 'Dun & Bradstreet',
        description: 'Business credit and risk assessment services',
        website: 'https://dnb.com',
        category: 'Financial Services',
        tags: ['credit', 'risk', 'business'],
      },
      {
        name: 'Triumph Pay',
        description: 'Payment processing and factoring for transportation',
        website: 'https://triumphpay.com',
        category: 'Financial Services',
        tags: ['payment', 'factoring', 'transportation'],
      },

      // Factoring & Invoice Services
      {
        name: 'Broker Factoring Solutions',
        description:
          'Specialized factoring services for freight brokers and logistics companies',
        website: 'https://brokerfactoring.com',
        category: 'Factoring & Invoice Services',
        features: [
          'Broker-Specific Terms',
          'Credit Protection',
          'Same-Day Funding',
          'Load Advance Options',
          'Carrier Payment Management',
        ],
        tags: ['broker-factoring', 'credit-protection', 'carrier-payments'],
      },
      {
        name: 'Fleet Factoring Network',
        description:
          'Network of factoring companies specializing in fleet and broker services',
        website: 'https://fleetfactoringnet.com',
        category: 'Factoring & Invoice Services',
        features: [
          'Multiple Lender Network',
          'Best Rate Matching',
          'Fleet Specialization',
          'Volume Discounts',
          'Dedicated Support',
        ],
        tags: [
          'fleet-factoring',
          'network',
          'volume-discounts',
          'rate-matching',
        ],
      },
      {
        name: 'Logistics Factoring Partners',
        description:
          'Factoring solutions designed specifically for logistics and brokerage operations',
        website: 'https://logisticsfactoring.com',
        category: 'Factoring & Invoice Services',
        features: [
          'Logistics Specialization',
          'Multi-Carrier Management',
          'Invoice Consolidation',
          'Credit Risk Assessment',
          'Payment Automation',
        ],
        tags: [
          'logistics-factoring',
          'multi-carrier',
          'consolidation',
          'automation',
        ],
      },

      // Customs & Import Services
      {
        name: 'USA Customs Clearance',
        description:
          'Comprehensive customs clearance, import consulting, and customs bonds for international freight',
        website: 'https://usacustomsclearance.com/',
        category: 'Customs & Import',
        features: [
          'Customs Bonds',
          'Import Consulting',
          'Importer of Record Registration',
          'Licensed Customs Brokers',
          'HTS Code Classification',
          'Duty & Tariff Requirements',
        ],
        contact: 'Call: 855-912-0406',
        tags: ['customs', 'import', 'bonds', 'consulting', 'clearance'],
      },
      {
        name: 'Customs Bond Services',
        description:
          'Single-purchase and continuous customs bonds with 48-hour approval from CBP',
        website: 'https://usacustomsclearance.com/',
        category: 'Customs & Import',
        features: [
          'Online Application',
          'Expert Support',
          '48-Hour Approval',
          'Single & Continuous Options',
        ],
        tags: ['customs-bonds', 'cbp', 'approval', 'import'],
      },
      {
        name: 'Import Consulting Services',
        description:
          'Licensed customs broker consultations for FDA, USDA, EPA, and other PGA requirements',
        website: 'https://usacustomsclearance.com/',
        category: 'Customs & Import',
        features: [
          '45-Minute Sessions',
          'PGA Support',
          'Documentation Assistance',
          'HTS Classification',
          'Anti-Dumping Review',
        ],
        contact: 'Starting at $289',
        tags: ['consulting', 'fda', 'usda', 'epa', 'pga', 'customs-broker'],
      },
      {
        name: 'Importer of Record Registration',
        description:
          'Fast and easy registration with CBP for first-time importers and foreign companies',
        website: 'https://usacustomsclearance.com/',
        category: 'Customs & Import',
        features: [
          'Licensed Professional Handling',
          'US & Foreign Company Support',
          'Expert Guidance',
        ],
        contact: '$175',
        tags: [
          'importer-registration',
          'cbp',
          'foreign-companies',
          'first-time',
        ],
      },
      {
        name: 'Manifest Confidentiality Service',
        description:
          'Protect supplier information and maintain trade secrets with confidential shipping manifests',
        website: 'https://usacustomsclearance.com/',
        category: 'Customs & Import',
        features: [
          'Trade Secret Protection',
          'Supply Chain Security',
          'Enhanced Privacy',
          'Compliance Support',
        ],
        contact: '$298',
        tags: ['manifests', 'confidentiality', 'trade-secrets', 'privacy'],
      },
    ],

    heavyhaul: [
      // Permitting & Routing
      {
        name: 'Heavy Haul Pro',
        description: 'Specialized routing and permitting for oversized loads',
        website: 'https://heavyhaulpro.com',
        category: 'Permitting',
        tags: ['routing', 'permits', 'oversized'],
      },
      {
        name: 'Permit Service Inc',
        description: 'Nationwide permit processing and route planning',
        website: 'https://permitservice.com',
        category: 'Permitting',
        tags: ['permits', 'route-planning', 'nationwide'],
      },
      {
        name: 'Oversize.io',
        description: 'Digital permit management and routing platform',
        website: 'https://oversize.io',
        category: 'Permitting',
        tags: ['digital', 'permits', 'routing'],
      },
      {
        name: 'TransCore',
        description: 'Comprehensive permitting and routing solutions',
        website: 'https://transcore.com',
        category: 'Permitting',
        tags: ['permitting', 'routing', 'comprehensive'],
      },
      {
        name: 'Bestpass',
        description: 'Toll management and permit processing services',
        website: 'https://bestpass.com',
        category: 'Permitting',
        tags: ['toll', 'permits', 'processing'],
      },
      {
        name: 'Heavy Haulers Network',
        description:
          'Specialized permit services for heavy haul and oversized loads',
        website: 'https://heavyhaulersnetwork.com',
        category: 'Permitting',
        tags: ['heavy-haul', 'oversized', 'specialized', 'permits'],
      },
      {
        name: 'State DOT Permit Offices',
        description:
          'Direct links to all state DOT permit offices and requirements',
        website: 'https://www.fhwa.dot.gov/construction/cqit/permits.cfm',
        category: 'Permitting',
        tags: ['state-dot', 'permit-offices', 'requirements', 'direct'],
      },
      {
        name: 'Pilot Car Permit Requirements',
        description:
          'State-by-state pilot car licensing and permit requirements',
        website: 'https://pilotcarrequirements.com',
        category: 'Permitting',
        tags: ['pilot-car', 'licensing', 'state-requirements', 'permits'],
      },
      {
        name: 'Escort Vehicle Certification',
        description: 'Training and certification for escort vehicle operators',
        website: 'https://escortvehiclecert.com',
        category: 'Permitting',
        tags: ['escort-vehicle', 'certification', 'training', 'operators'],
      },
      {
        name: 'Dimensional Load Permits',
        description:
          'Permits for loads exceeding height, width, length, or weight limits',
        website: 'https://dimensionalloadpermits.com',
        category: 'Permitting',
        tags: ['dimensional', 'height', 'width', 'length', 'weight'],
      },
      {
        name: 'Multi-State Permit Coordination',
        description: 'Coordination services for permits across multiple states',
        website: 'https://multistatepermits.com',
        category: 'Permitting',
        tags: ['multi-state', 'coordination', 'permits', 'interstate'],
      },

      // Pilot Car Services
      {
        name: 'Pilot Car Services',
        description: 'Directory of certified pilot car operators nationwide',
        website: 'https://pilotcarservices.com',
        category: 'Pilot Cars',
        tags: ['pilot-car', 'certified', 'directory'],
      },
      {
        name: 'A1 Pilot Car',
        description: 'Professional pilot car services for heavy haul transport',
        website: 'https://a1pilotcar.com',
        category: 'Pilot Cars',
        tags: ['pilot-car', 'heavy-haul', 'professional'],
      },
      {
        name: 'Pilot Car Network',
        description: 'Network of qualified pilot car operators',
        website: 'https://pilotcarnetwork.com',
        category: 'Pilot Cars',
        tags: ['network', 'pilot-car', 'qualified'],
      },

      // Equipment & Trailers
      {
        name: 'Goldhofer',
        description: 'Specialized heavy haul trailers and equipment',
        website: 'https://goldhofer.com',
        category: 'Equipment',
        tags: ['trailers', 'equipment', 'specialized'],
      },
      {
        name: 'Faymonville',
        description: 'Heavy duty trailers and transport solutions',
        website: 'https://faymonville.com',
        category: 'Equipment',
        tags: ['trailers', 'heavy-duty', 'transport'],
      },
      {
        name: 'Scheuerle',
        description: 'Modular trailers for heavy and oversized loads',
        website: 'https://scheuerle.com',
        category: 'Equipment',
        tags: ['modular', 'trailers', 'oversized'],
      },
      {
        name: 'Trail King',
        description: 'Heavy haul trailers and specialized equipment',
        website: 'https://trailking.com',
        category: 'Equipment',
        tags: ['trailers', 'heavy-haul', 'specialized'],
      },

      // Crane & Rigging
      {
        name: 'Crane Network',
        description: 'Directory of crane services and heavy lifting equipment',
        website: 'https://cranenetwork.com',
        category: 'Crane Services',
        tags: ['crane', 'lifting', 'equipment'],
      },
      {
        name: 'Rigging Institute',
        description: 'Training and certification for rigging professionals',
        website: 'https://rigging.org',
        category: 'Crane Services',
        tags: ['rigging', 'training', 'certification'],
      },
      {
        name: 'Specialized Carriers',
        description: 'Association of specialized transportation companies',
        website: 'https://specializedcarriers.com',
        category: 'Crane Services',
        tags: ['specialized', 'carriers', 'association'],
      },

      // Safety & Compliance
      {
        name: 'NCCCO',
        description:
          'National Commission for the Certification of Crane Operators',
        website: 'https://nccco.org',
        category: 'Safety & Compliance',
        tags: ['certification', 'crane', 'operators'],
      },
      {
        name: 'OSHA Heavy Haul',
        description: 'OSHA regulations and safety guidelines for heavy haul',
        website: 'https://osha.gov',
        category: 'Safety & Compliance',
        tags: ['osha', 'safety', 'regulations'],
      },
      {
        name: 'Transport Canada',
        description: 'Canadian regulations for oversized load transport',
        website: 'https://tc.canada.ca',
        category: 'Safety & Compliance',
        tags: ['canada', 'regulations', 'oversized'],
      },

      // International & Customs
      {
        name: 'Heavy Equipment Import Services',
        description:
          'Specialized customs clearance for heavy machinery and oversized equipment imports',
        website: 'https://usacustomsclearance.com/',
        category: 'International & Customs',
        features: [
          'Heavy Machinery Clearance',
          'Equipment Import Documentation',
          'Customs Bond Services',
          'PGA Coordination',
        ],
        contact: 'Call: 855-912-0406',
        tags: ['heavy-equipment', 'machinery', 'import', 'customs'],
      },
      {
        name: 'Oversized Equipment Import Permits',
        description:
          'Import permits and documentation for oversized construction and industrial equipment',
        website: 'https://usacustomsclearance.com/',
        category: 'International & Customs',
        features: [
          'EPA Compliance',
          'NHTSA Requirements',
          'Equipment Classification',
          'Import Documentation',
        ],
        tags: ['oversized-equipment', 'permits', 'epa', 'nhtsa'],
      },
      {
        name: 'International Heavy Haul Customs',
        description:
          'Cross-border customs support for heavy haul and specialized transport operations',
        website: 'https://usacustomsclearance.com/',
        category: 'International & Customs',
        features: [
          'Cross-Border Support',
          'Specialized Transport Documentation',
          'Multi-State Coordination',
          'Customs Consulting',
        ],
        tags: [
          'cross-border',
          'international',
          'specialized-transport',
          'customs',
        ],
      },
    ],
    factoring: [
      {
        name: 'Bankers Factoring',
        description:
          'Critical Working Capital for Entrepreneurs™ - Get funding in as little as 24 hours',
        website: 'https://bankersfactoring.com',
        category: 'Factoring Services',
        type: 'Factoring Application',
        features: [
          'Same-day funding available',
          'Recourse & Non-recourse options',
          'Notification & Confidential factoring',
          'Competitive rates',
          'Dedicated account management',
          'Online application portal',
        ],
        contact: '📞 866-598-4295 | 📧 invoice@freight1stdirect.com',
        tags: [
          'factoring',
          'financing',
          'cash-flow',
          'working-capital',
          'invoice-factoring',
        ],
      },
      {
        name: 'RTS Financial',
        description:
          'Transportation factoring with fuel advances and load board access',
        website: 'https://rtsfinancial.com',
        category: 'Factoring Services',
        features: [
          'Fuel advances',
          'Load board access',
          'Fleet management tools',
          'Mobile app',
          'Quick setup',
        ],
        tags: ['factoring', 'fuel-advances', 'transportation', 'mobile-app'],
      },
      {
        name: 'Triumph Business Capital',
        description:
          'Full-service factoring with credit protection and collections',
        website: 'https://triumphbusinesscapital.com',
        category: 'Factoring Services',
        features: [
          'Credit protection',
          'Collections management',
          'Online portal',
          'Fuel cards',
          'Equipment financing',
        ],
        tags: [
          'factoring',
          'credit-protection',
          'collections',
          'equipment-financing',
        ],
      },
      {
        name: 'Porter Capital',
        description:
          'Fast approval factoring with flexible terms for growing businesses',
        website: 'https://portercapital.com',
        category: 'Factoring Services',
        features: [
          'Fast approval',
          'Flexible terms',
          'No long-term contracts',
          'Industry expertise',
          'Personal service',
        ],
        tags: ['factoring', 'fast-approval', 'flexible-terms', 'no-contracts'],
      },
      {
        name: 'Apex Capital',
        description:
          'Transportation factoring with fuel cards and business tools',
        website: 'https://apexcapitalcorp.com',
        category: 'Factoring Services',
        features: [
          'Fuel cards',
          'Business credit building',
          'Load board discounts',
          'Mobile app',
          'Same-day funding',
        ],
        tags: [
          'factoring',
          'fuel-cards',
          'credit-building',
          'same-day-funding',
        ],
      },
    ],
  };

  // Filter resources based on search and category
  const filteredResources = allResources[selectedCategory].filter(
    (resource) => {
      const matchesSearch =
        searchTerm === '' ||
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesFilter =
        selectedFilter === 'all' || resource.category === selectedFilter;

      return matchesSearch && matchesFilter;
    }
  );

  // Get unique categories for current selection
  const categoryFilters = [
    'all',
    ...Array.from(
      new Set(allResources[selectedCategory].map((r) => r.category))
    ),
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0369a1 0%, #0c4a6e 100%)', // Slightly darker
        paddingTop: '80px',
      }}
    >
      {/* Back Button */}
      <div style={{ padding: '24px' }}>
        <Link href='/' style={{ textDecoration: 'none' }}>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.18)', // Slightly darker
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)', // Slightly darker
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '16px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Main Content Container */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px 80px 24px',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.12)', // Slightly darker
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '40px',
            border: '1px solid rgba(255, 255, 255, 0.18)', // Slightly darker
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)', // Slightly darker
          }}
        >
          <div
            style={{
              textAlign: 'center',
              marginBottom: '32px',
            }}
          >
            <h1
              style={{
                fontSize: '48px',
                fontWeight: '700',
                background: 'linear-gradient(45deg, #ffffff, #e0f2fe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '0 0 16px 0',
              }}
            >
              📚 Resource Library
            </h1>
            <p
              style={{
                fontSize: '20px',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: '0 0 32px 0',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto',
                lineHeight: '1.6',
              }}
            >
              Comprehensive tools and resources for drivers, dispatchers,
              brokers, and heavy haul specialists
            </p>
          </div>

          {/* Search Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '500px',
              }}
            >
              <input
                type='text'
                placeholder='Search resources...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '16px',
                  backdropFilter: 'blur(10px)',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '20px',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                🔍
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              {(
                [
                  'drivers',
                  'dispatch',
                  'broker',
                  'heavyhaul',
                  'factoring',
                ] as const
              ).map((category) => {
                const getCategoryColor = (cat: string) => {
                  switch (cat) {
                    case 'drivers':
                      return 'linear-gradient(135deg, #f7c52d, #f4a832)';
                    case 'dispatch':
                      return 'linear-gradient(135deg, #3b82f6, #2563eb)';
                    case 'broker':
                      return 'linear-gradient(135deg, #f97316, #ea580c)';
                    case 'heavyhaul':
                      return 'linear-gradient(135deg, #14b8a6, #0d9488)';
                    case 'factoring':
                      return 'linear-gradient(135deg, #10b981, #059669)';
                    default:
                      return 'rgba(255, 255, 255, 0.08)';
                  }
                };
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      border: 'none',
                      cursor: 'pointer',
                      background:
                        selectedCategory === category
                          ? getCategoryColor(category)
                          : 'rgba(255, 255, 255, 0.08)',
                      color:
                        selectedCategory === category && category === 'drivers'
                          ? '#2d3748'
                          : 'white',
                      backdropFilter: 'blur(10px)',
                      fontSize: '14px',
                      boxShadow:
                        selectedCategory === category
                          ? '0 8px 25px rgba(0, 0, 0, 0.3)'
                          : '0 4px 15px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {category === 'drivers' && '🚛 Drivers'}
                    {category === 'dispatch' && '📋 Dispatch'}
                    {category === 'broker' && '🏢 Brokers'}
                    {category === 'heavyhaul' && '🏗️ Heavy Haul'}
                    {category === 'factoring' && '💰 Factoring'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            {categoryFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background:
                    selectedFilter === filter
                      ? 'rgba(59, 130, 246, 0.6)'
                      : 'rgba(255, 255, 255, 0.08)', // Slightly darker
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {filter === 'all' ? 'All' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '24px',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '16px',
          }}
        >
          Showing {filteredResources.length} resources
        </div>

        {/* Factoring Application Form - Special Section */}
        {selectedCategory === 'factoring' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(15px)',
              borderRadius: '20px',
              marginBottom: '32px',
              overflow: 'hidden',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <h2
                style={{
                  fontSize: '2rem',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                }}
              >
                🏛️ Bankers Factoring Application
              </h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                Critical Working Capital for Entrepreneurs™ - Get funding in as
                little as 24 hours
              </p>
            </div>

            <div style={{ padding: '24px' }}>
              <div
                style={{
                  background: '#e8f5e8',
                  border: '1px solid #10b981',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>🔒</span>
                <div>
                  <strong style={{ color: '#059669' }}>
                    Secure Application Portal
                  </strong>
                  <p
                    style={{ margin: 0, color: '#2d3748', fontSize: '0.9rem' }}
                  >
                    Your information is protected with bank-level 256-bit SSL
                    encryption
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    background: '#f8f9fa',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                    ⚡
                  </div>
                  <strong style={{ color: '#2d3748' }}>Same-Day Funding</strong>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                    Get approved and funded within 24 hours
                  </p>
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    background: '#f8f9fa',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                    💼
                  </div>
                  <strong style={{ color: '#2d3748' }}>Flexible Options</strong>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                    Recourse & Non-recourse factoring available
                  </p>
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    background: '#f8f9fa',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                    📞
                  </div>
                  <strong style={{ color: '#2d3748' }}>Personal Service</strong>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                    Dedicated account management team
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => {
                    // Create and open the factoring application in a new window
                    const factoringHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bankers Factoring - Factoring Application</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
            line-height: 1.6;
        }

        .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
            padding: 1rem 0;
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .logo-icon {
            color: white;
            font-size: 2rem;
        }

        .logo-text {
            display: flex;
            flex-direction: column;
            line-height: 1;
        }

        .logo-main {
            font-size: 2rem;
            font-weight: bold;
            color: white;
        }

        .logo-main .factoring {
            color: #fbbf24;
        }

        .logo-tagline {
            font-size: 0.85rem;
            color: #e5e7eb;
            margin-top: 0.2rem;
            font-weight: 400;
        }

        .phone {
            font-size: 1.1rem;
            color: #fbbf24;
            font-weight: 600;
        }

        .container {
            max-width: 900px;
            margin: 2rem auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(15px);
            border-radius: 20px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .form-header {
            background: linear-gradient(135deg, #1e3a8a, #1e40af);
            color: white;
            padding: 2rem;
            text-align: center;
        }

        .form-header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .form-header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }

        .form-content {
            padding: 2rem;
        }

        .section {
            margin-bottom: 2.5rem;
            padding: 1.5rem;
            background: #f8f9fa;
            border-radius: 12px;
            border-left: 4px solid #3498db;
        }

        .section h2 {
            color: #2c3e50;
            margin-bottom: 1.5rem;
            font-size: 1.4rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .section-icon {
            font-size: 1.2rem;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .form-row.single {
            grid-template-columns: 1fr;
        }

        .form-group {
            margin-bottom: 1rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #2c3e50;
        }

        .required {
            color: #e74c3c;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: white;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }

        .form-group textarea {
            resize: vertical;
            min-height: 100px;
        }

        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }

        .checkbox-group input[type="checkbox"] {
            width: auto;
            margin: 0;
        }

        .file-upload {
            border: 2px dashed #3498db;
            border-radius: 8px;
            padding: 2rem;
            text-align: center;
            background: #f8f9fa;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .file-upload:hover {
            border-color: #2980b9;
            background: #ecf0f1;
        }

        .file-upload input[type="file"] {
            display: none;
        }

        .file-icon {
            font-size: 2rem;
            color: #3498db;
            margin-bottom: 0.5rem;
        }

        .submit-section {
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
            padding: 2rem;
            text-align: center;
            margin-top: 2rem;
        }

        .submit-btn {
            background: white;
            color: #27ae60;
            border: none;
            padding: 1rem 3rem;
            font-size: 1.2rem;
            font-weight: bold;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .security-notice {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .security-icon {
            color: #f39c12;
            font-size: 1.2rem;
        }

        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }

            .header-content {
                flex-direction: column;
                gap: 1rem;
            }

            .logo {
                text-align: center;
            }

            .logo-main {
                font-size: 1.6rem;
            }

            .logo-tagline {
                font-size: 0.75rem;
            }

            .container {
                margin: 1rem;
                border-radius: 15px;
            }

            .form-content {
                padding: 1rem;
            }
        }

        .info-text {
            background: #e8f4fd;
            border-left: 4px solid #3498db;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 4px;
            font-size: 0.9rem;
            color: #2c3e50;
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-content">
            <div class="logo">
                <div class="logo-icon">🏛️⭐⭐⭐</div>
                <div class="logo-text">
                    <div class="logo-main">
                        Bankers<span class="factoring">Factoring</span>
                    </div>
                    <div class="logo-tagline">Critical Working Capital for Entrepreneurs™</div>
                </div>
            </div>
            <div class="phone">📞 866-598-4295</div>
        </div>
    </header>

    <div class="container">
        <div class="form-header">
            <h1>Factoring Application</h1>
            <p>Secure & Encrypted - Get funding in as little as 24 hours</p>
        </div>

        <div class="form-content">
            <div class="security-notice">
                <span class="security-icon">🔒</span>
                <span>Your information is protected with bank-level 256-bit SSL encryption</span>
            </div>

            <div class="section" style="background: #e8f5e8; border-left-color: #27ae60;">
                <h2><span class="section-icon">🔖</span>Application Reference</h2>
                <div class="form-row single">
                    <div class="form-group">
                        <label for="reference-id">Reference ID Number</label>
                        <input type="text" id="reference-id" name="reference-id" readonly style="background: #f8f9fa; font-weight: bold; font-size: 1.1rem; color: #27ae60;">
                    </div>
                </div>
                <div class="info-text" style="background: #d4edda; border-left-color: #27ae60;">
                    <strong>Please save this reference number</strong> - You can use it to track your application status and reference it in any correspondence with us.
                </div>
            </div>

            <!-- Rest of the form sections would continue here... -->
            <div style="text-align: center; padding: 2rem; background: #f8f9fa; border-radius: 12px;">
                <h3 style="color: #2c3e50; margin-bottom: 1rem;">Complete Factoring Application</h3>
                <p style="color: #666; margin-bottom: 1.5rem;">This is a preview of the factoring application portal. The full application includes:</p>
                <ul style="text-align: left; max-width: 400px; margin: 0 auto 1.5rem auto; color: #666;">
                    <li>Company Information</li>
                    <li>Principal/Owner Details</li>
                    <li>Financial Information</li>
                    <li>Customer Information</li>
                    <li>Factoring Requirements</li>
                    <li>Document Upload</li>
                    <li>Terms & Conditions</li>
                </ul>
                <button class="submit-btn" onclick="alert('Full application would be processed here')">
                    Start Full Application
                </button>
            </div>
        </div>
    </div>

    <script>
        // Generate reference ID on page load
        function generateReferenceId() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');

            const referenceId = \`DDD\${year}\${month}\${day}\${hours}\${minutes}\`;

            document.getElementById('reference-id').value = referenceId;
            return referenceId;
        }

        window.addEventListener('load', function() {
            generateReferenceId();
        });
    </script>
</body>
</html>`;

                    const newWindow = window.open('', '_blank');
                    if (newWindow) {
                      newWindow.document.write(factoringHTML);
                      newWindow.document.close();
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    padding: '16px 32px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 6px 20px rgba(16, 185, 129, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 15px rgba(16, 185, 129, 0.3)';
                  }}
                >
                  🚀 Open Factoring Application
                </button>
                <p
                  style={{
                    marginTop: '12px',
                    fontSize: '0.9rem',
                    color: '#666',
                  }}
                >
                  📧 Applications sent to:{' '}
                  <strong>invoice@freight1stdirect.com</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Resources Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px',
          }}
        >
          {filteredResources.map((resource, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.08)', // Slightly darker
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.12)', // Slightly darker
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow =
                  '0 12px 40px rgba(0, 0, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 16px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: 'white',
                    margin: '0',
                    flex: 1,
                  }}
                >
                  {resource.name}
                </h3>
                <span
                  style={{
                    padding: '4px 12px',
                    background: 'rgba(59, 130, 246, 0.3)',
                    color: '#93c5fd',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    marginLeft: '12px',
                  }}
                >
                  {resource.category}
                </span>
              </div>

              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: '0 0 16px 0',
                  lineHeight: '1.5',
                }}
              >
                {resource.description}
              </p>

              {resource.features && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginBottom: '16px',
                  }}
                >
                  {resource.features.map((feature, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: 'rgba(34, 197, 94, 0.3)',
                        color: '#86efac',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <a
                  href={resource.website}
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{
                    color: '#ffffff',
                    background: 'rgba(59, 130, 246, 0.6)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(59, 130, 246, 0.8)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background =
                      'rgba(59, 130, 246, 0.8)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      'rgba(59, 130, 246, 0.6)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {resource.contact || 'Visit Website →'}
                </a>

                {resource.type && (
                  <span
                    style={{
                      padding: '4px 8px',
                      background: 'rgba(147, 51, 234, 0.3)',
                      color: '#c4b5fd',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: '1px solid rgba(147, 51, 234, 0.2)',
                    }}
                  >
                    {resource.type}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredResources.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '24px', margin: '0 0 12px 0' }}>
              No resources found
            </h3>
            <p style={{ fontSize: '16px', margin: '0' }}>
              Try adjusting your search terms or filters
            </p>
          </div>
        )}

        {/* Link Verification Section */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            marginTop: '40px',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: 'white',
                  margin: '0 0 8px 0',
                }}
              >
                🔗 Link Verification
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: '0',
                }}
              >
                Verify all external and internal links for production readiness
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>🔍</div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href='/link-verification'
              style={{
                color: '#ffffff',
                background: 'rgba(59, 130, 246, 0.6)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                padding: '10px 16px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(59, 130, 246, 0.8)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.8)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(59, 130, 246, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.6)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span>🔍</span>
              Run Link Verification
            </Link>

            <span
              style={{
                padding: '4px 8px',
                background: 'rgba(34, 197, 94, 0.3)',
                color: '#86efac',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>✅</span>
              Production Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
