/**
 * Multi-Language Demo Component
 * Showcases the multi-language support across FleetFlow
 */

'use client';

import { useLanguage } from '../providers/LanguageProvider';

export default function MultiLanguageDemo() {
  const {
    currentLanguage,
    translate,
    generateGreeting,
    getFreightTerms,
    formatCurrency,
  } = useLanguage();

  const demoTerms = getFreightTerms();
  const demoPrice = 2500.75;

  return (
    <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-6'>
      <div className='mb-6 flex items-center gap-3'>
        <div className='rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-3'>
          🌍
        </div>
        <div>
          <h3 className='text-xl font-bold text-white'>Multi-Language Demo</h3>
          <p className='text-slate-400'>
            Current Language: {currentLanguage.toUpperCase()}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* UI Terms */}
        <div className='space-y-4'>
          <h4 className='mb-3 text-lg font-semibold text-white'>UI Terms</h4>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-slate-400'>Dashboard:</span>
              <span className='text-white'>{translate('dashboard')}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-slate-400'>Settings:</span>
              <span className='text-white'>{translate('settings')}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-slate-400'>Profile:</span>
              <span className='text-white'>{translate('profile')}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-slate-400'>Search:</span>
              <span className='text-white'>{translate('search')}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-slate-400'>Notifications:</span>
              <span className='text-white'>{translate('notifications')}</span>
            </div>
          </div>
        </div>

        {/* Freight Terms */}
        <div className='space-y-4'>
          <h4 className='mb-3 text-lg font-semibold text-white'>
            Freight Terms
          </h4>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-slate-400'>Freight:</span>
              <span className='text-white'>{demoTerms.freight}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-slate-400'>Carrier:</span>
              <span className='text-white'>{demoTerms.carrier}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-slate-400'>Shipper:</span>
              <span className='text-white'>{demoTerms.shipper}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-slate-400'>Load:</span>
              <span className='text-white'>{demoTerms.load}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-slate-400'>Rate:</span>
              <span className='text-white'>{demoTerms.rate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Messages */}
      <div className='mt-6 space-y-4'>
        <h4 className='text-lg font-semibold text-white'>Sample Messages</h4>

        <div className='rounded-lg bg-slate-700/30 p-4'>
          <p className='mb-2 text-sm text-slate-300'>
            <strong>Greeting:</strong> {generateGreeting('Alexis', 'morning')}
          </p>
          <p className='mb-2 text-sm text-slate-300'>
            <strong>Rate Confirmation:</strong> {translate('rateConfirmation')}
          </p>
          <p className='text-sm text-slate-300'>
            <strong>Price:</strong> {formatCurrency(demoPrice)}
          </p>
        </div>
      </div>

      {/* Language Features */}
      <div className='mt-6 grid grid-cols-2 gap-4 md:grid-cols-4'>
        <div className='text-center'>
          <div className='mb-2 text-2xl'>🇺🇸</div>
          <div className='text-xs text-slate-400'>English</div>
          <div className='text-xs text-green-400'>✓ Active</div>
        </div>
        <div className='text-center'>
          <div className='mb-2 text-2xl'>🇪🇸</div>
          <div className='text-xs text-slate-400'>Español</div>
          <div className='text-xs text-green-400'>✓ Available</div>
        </div>
        <div className='text-center'>
          <div className='mb-2 text-2xl'>🇫🇷</div>
          <div className='text-xs text-slate-400'>Français</div>
          <div className='text-xs text-green-400'>✓ Available</div>
        </div>
        <div className='text-center'>
          <div className='mb-2 text-2xl'>🇨🇳</div>
          <div className='text-xs text-slate-400'>中文</div>
          <div className='text-xs text-green-400'>✓ Available</div>
        </div>
      </div>

      <div className='mt-4 text-center'>
        <p className='text-xs text-slate-500'>
          🌍 Multi-language support is now available across all FleetFlow
          components
        </p>
      </div>
    </div>
  );
}
