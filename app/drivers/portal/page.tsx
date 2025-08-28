'use client';

import dynamic from 'next/dynamic';
import { SmartRouter } from '../../components/SmartRouter';

// Dynamic imports to prevent hydration issues
const DriversPortalMobile = dynamic(() => import('./page-mobile'), {
  ssr: false,
  loading: () => (
    <div className='flex h-screen items-center justify-center bg-gradient-to-br from-yellow-400 to-amber-500'>
      <div className='text-center'>
        <div className='mb-4 text-6xl'>🚛</div>
        <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent'></div>
        <p className='font-semibold text-white'>Loading Driver Portal...</p>
      </div>
    </div>
  ),
});

const DriversPortalDesktop = dynamic(() => import('./page_new'), {
  ssr: false,
  loading: () => (
    <div className='flex h-screen items-center justify-center bg-gradient-to-br from-yellow-400 to-amber-500'>
      <div className='text-center'>
        <div className='mb-4 text-6xl'>🚛</div>
        <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent'></div>
        <p className='font-semibold text-white'>Loading Driver Portal...</p>
      </div>
    </div>
  ),
});

/**
 * Smart Driver OTR Flow Portal
 * Automatically serves mobile-optimized version on phones/tablets
 * and desktop version on larger screens
 */
export default function DriversPortalSmartRouter() {
  return (
    <SmartRouter
      mobileComponent={DriversPortalMobile}
      desktopComponent={DriversPortalDesktop}
    />
  );
}
