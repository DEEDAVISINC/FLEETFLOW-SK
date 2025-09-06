/**
 * Language Switcher Component for FleetFlow
 * Global language selection across the entire application
 */

'use client';

import { ChevronDown, Globe } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../providers/LanguageProvider';

export default function LanguageSwitcher() {
  const { currentLanguage, setLanguage, getSupportedLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = getSupportedLanguages();
  const currentLangData = languages.find(
    (lang) => lang.code === currentLanguage
  );

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode as any);
    setIsOpen(false);
  };

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-white transition-colors hover:bg-white/20'
      >
        <Globe className='h-4 w-4' />
        <span className='text-sm font-medium'>{currentLangData?.flag}</span>
        <span className='hidden text-sm sm:inline'>
          {currentLangData?.name}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 z-40'
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className='absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg'>
            <div className='py-1'>
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-gray-50 ${
                    currentLanguage === language.code
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700'
                  }`}
                >
                  <span className='text-lg'>{language.flag}</span>
                  <span className='text-sm font-medium'>{language.name}</span>
                  {currentLanguage === language.code && (
                    <div className='ml-auto h-2 w-2 rounded-full bg-blue-600' />
                  )}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className='border-t border-gray-200 bg-gray-50 px-4 py-2'>
              <p className='text-center text-xs text-gray-500'>
                🌍 Multi-language support across FleetFlow
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
