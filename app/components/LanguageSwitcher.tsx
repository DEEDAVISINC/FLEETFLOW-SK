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
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, #0891b2, #0e7490)'
            : 'linear-gradient(135deg, #06b6d4, #0891b2)',
          color: 'white',
          padding: '8px 14px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <Globe style={{ width: '16px', height: '16px' }} />
        <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>
          {currentLangData?.flag}
        </span>
        <span
          className='hidden sm:inline'
          style={{
            fontSize: '0.85rem',
          }}
        >
          {currentLangData?.name}
        </span>
        <ChevronDown
          style={{
            width: '16px',
            height: '16px',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              inset: '0',
              zIndex: '40',
            }}
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div
            style={{
              position: 'absolute',
              right: '0',
              top: '100%',
              background: 'white',
              minWidth: '200px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              borderRadius: '12px',
              padding: '12px 0',
              border: '2px solid #06b6d4',
              zIndex: '50',
              marginTop: '4px',
            }}
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                style={{
                  display: 'flex',
                  width: '100%',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 20px',
                  color:
                    currentLanguage === language.code ? '#0891b2' : '#06b6d4',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor =
                    'rgba(6, 182, 212, 0.05)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor =
                    'transparent';
                }}
              >
                <span style={{ fontSize: '1rem' }}>{language.flag}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                  {language.name}
                </span>
                {currentLanguage === language.code && (
                  <div
                    style={{
                      marginLeft: 'auto',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#0891b2',
                    }}
                  />
                )}
              </button>
            ))}

            {/* Footer */}
            <div
              style={{
                padding: '12px 20px',
                borderTop: '1px solid rgba(6, 182, 212, 0.2)',
                background: 'rgba(6, 182, 212, 0.05)',
              }}
            >
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  color: '#0891b2',
                  fontWeight: '500',
                }}
              >
                🌍 Multi-language support across FleetFlow
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
