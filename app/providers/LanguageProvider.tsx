/**
 * Global Language Provider for FleetFlow
 * Provides multi-language support across the entire application
 */

'use client';

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  SupportedLanguage,
  multiLanguageService,
} from '../services/MultiLanguageService';

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  translate: (key: string, variables?: Record<string, string>) => string;
  getSupportedLanguages: () => {
    code: SupportedLanguage;
    name: string;
    flag: string;
  }[];
  generateGreeting: (
    staffName: string,
    timeOfDay?: 'morning' | 'afternoon' | 'evening'
  ) => string;
  getFreightTerms: () => Record<string, string>;
  formatCurrency: (amount: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguageState] =
    useState<SupportedLanguage>('en');

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem(
      'fleetflow-language'
    ) as SupportedLanguage;
    if (
      savedLanguage &&
      multiLanguageService
        .getSupportedLanguages()
        .find((l) => l.code === savedLanguage)
    ) {
      setCurrentLanguageState(savedLanguage);
      multiLanguageService.setLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (language: SupportedLanguage) => {
    setCurrentLanguageState(language);
    multiLanguageService.setLanguage(language);
    localStorage.setItem('fleetflow-language', language);
  };

  const translate = (key: string, variables?: Record<string, string>) => {
    return multiLanguageService.translate(key, variables);
  };

  const getSupportedLanguages = () => {
    return multiLanguageService.getSupportedLanguages();
  };

  const generateGreeting = (
    staffName: string,
    timeOfDay: 'morning' | 'afternoon' | 'evening' = 'morning'
  ) => {
    return multiLanguageService.generateGreeting(staffName, timeOfDay);
  };

  const getFreightTerms = () => {
    return multiLanguageService.getFreightTerms();
  };

  const formatCurrency = (amount: number) => {
    return multiLanguageService.formatCurrency(amount);
  };

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    translate,
    getSupportedLanguages,
    generateGreeting,
    getFreightTerms,
    formatCurrency,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Export the provider for easy importing
export default LanguageProvider;
