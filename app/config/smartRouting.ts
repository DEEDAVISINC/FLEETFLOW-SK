/**
 * Smart Routing Configuration for FleetFlow
 * Maps each page to its mobile and desktop versions
 */

export interface RouteConfig {
  mobile: string;
  desktop: string;
  name: string;
  description: string;
}

export const SMART_ROUTES: Record<string, RouteConfig> = {
  // Driver OTR Flow Portal
  'drivers-portal': {
    mobile: '/app/drivers/portal/page-mobile.tsx',
    desktop: '/app/drivers/portal/page_new.tsx',
    name: 'Driver OTR Flow Portal',
    description: 'Over The Road driver management and operations',
  },

  // Landing Page
  landing: {
    mobile: '/app/components/FleetFlowLandingPage-mobile.tsx',
    desktop: '/app/components/FleetFlowLandingPage.tsx',
    name: 'FleetFlow Landing Page',
    description: 'Main marketing and onboarding page',
  },

  // Freight Network (Carrier Network)
  'freight-network': {
    mobile: '/app/freight-network/page-mobile.tsx',
    desktop: '/app/freight-network/page.tsx', // Original version
    name: 'Freight Network',
    description: 'Carrier operations and network management',
  },

  // FleetFlow University
  university: {
    mobile: '/app/university/page-mobile.tsx',
    desktop: '/app/university/page.tsx', // Original version
    name: 'FleetFlow University',
    description: 'Training and certification platform',
  },

  // User Profile
  'user-profile': {
    mobile: '/app/user-profile/page-mobile.tsx',
    desktop: '/app/user-profile/page.tsx', // Original version
    name: 'User Profile',
    description: 'Account management and settings',
  },
} as const;

/**
 * Device Detection Configuration
 */
export const DEVICE_CONFIG = {
  // Breakpoints (in pixels)
  breakpoints: {
    mobile: 768, // 0-767px = mobile
    tablet: 1024, // 768-1023px = tablet
    desktop: 1024, // 1024px+ = desktop
  },

  // Which devices should use mobile version
  useMobileFor: ['mobile', 'tablet'] as const,

  // User agent patterns for mobile detection
  mobileUserAgents: [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /IEMobile/i,
    /Opera Mini/i,
  ],
} as const;
