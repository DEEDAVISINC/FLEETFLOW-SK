'use client';

import dynamic from 'next/dynamic';
import { SmartRouter } from '../components/SmartRouter';

// Dynamic imports to prevent hydration issues
const FreightNetworkPageMobile = dynamic(() => import('./page-mobile'), {
  ssr: false,
  loading: () => (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700'>
      <div className='text-center'>
        <div className='mb-6 text-6xl'>🚚</div>
        <div className='mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent' />
        <h2 className='mb-2 text-xl font-bold text-white'>Freight Network</h2>
        <p className='text-white/80'>Loading carrier operations...</p>
      </div>
    </div>
  ),
});

const FreightNetworkPageDesktop = dynamic(() => import('./page-mobile'), {
  ssr: false,
  loading: () => (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700'>
      <div className='text-center'>
        <div className='mb-6 text-6xl'>🚚</div>
        <div className='mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent' />
        <h2 className='mb-2 text-xl font-bold text-white'>Freight Network</h2>
        <p className='text-white/80'>Loading carrier operations...</p>
      </div>
    </div>
  ),
});

/**
 * Smart Freight Network Page
 * Automatically serves mobile-optimized version on phones/tablets
 * and desktop version on larger screens
 */
export default function FreightNetworkPageSmart() {
  return (
    <SmartRouter
      mobileComponent={FreightNetworkPageMobile}
      desktopComponent={FreightNetworkPageDesktop}
    />
  );
}
