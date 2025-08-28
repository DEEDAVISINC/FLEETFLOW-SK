'use client';

import dynamic from 'next/dynamic';
import { SmartRouter } from './SmartRouter';

// Dynamic imports to prevent hydration issues
const FleetFlowLandingPageMobile = dynamic(
  () => import('./FleetFlowLandingPage-mobile'),
  {
    ssr: false,
    loading: () => (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
        <div className='text-center'>
          <div className='mb-6 text-7xl'>🚀</div>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent'></div>
          <h2 className='mb-2 text-2xl font-bold text-white'>FleetFlow</h2>
          <p className='text-white/80'>The Salesforce of Transportation</p>
        </div>
      </div>
    ),
  }
);

const FleetFlowLandingPageDesktop = dynamic(
  () => import('./FleetFlowLandingPage'),
  {
    ssr: false,
    loading: () => (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
        <div className='text-center'>
          <div className='mb-6 text-7xl'>🚀</div>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent'></div>
          <h2 className='mb-2 text-2xl font-bold text-white'>FleetFlow</h2>
          <p className='text-white/80'>The Salesforce of Transportation</p>
        </div>
      </div>
    ),
  }
);

/**
 * Smart FleetFlow Landing Page
 * Automatically serves mobile-optimized version on phones/tablets
 * and desktop version on larger screens
 */
export default function FleetFlowLandingPageSmart() {
  return (
    <SmartRouter
      mobileComponent={FleetFlowLandingPageMobile}
      desktopComponent={FleetFlowLandingPageDesktop}
    />
  );
}
