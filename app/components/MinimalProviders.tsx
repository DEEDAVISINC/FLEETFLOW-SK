'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, createContext, useContext } from 'react';
import LanguageProvider from '../providers/LanguageProvider';

// Minimal Organization Context for public pages
interface MinimalOrganizationContextType {
  currentOrganization: null;
  userOrganizations: [];
  setCurrentOrganization: () => void;
  switchOrganization: () => Promise<boolean>;
  userRole: '';
  userPermissions: [];
  isLoading: false;
  refreshOrganizations: () => Promise<void>;
}

const MinimalOrganizationContext =
  createContext<MinimalOrganizationContextType>({
    currentOrganization: null,
    userOrganizations: [],
    setCurrentOrganization: () => {},
    switchOrganization: async () => false,
    userRole: '',
    userPermissions: [],
    isLoading: false,
    refreshOrganizations: async () => {},
  });

function MinimalOrganizationProvider({ children }: { children: ReactNode }) {
  return (
    <MinimalOrganizationContext.Provider
      value={{
        currentOrganization: null,
        userOrganizations: [],
        setCurrentOrganization: () => {},
        switchOrganization: async () => false,
        userRole: '',
        userPermissions: [],
        isLoading: false,
        refreshOrganizations: async () => {},
      }}
    >
      {children}
    </MinimalOrganizationContext.Provider>
  );
}

// Export the minimal organization hook for compatibility
export function useOrganization() {
  const context = useContext(MinimalOrganizationContext);
  if (context === undefined) {
    console.warn(
      'useOrganization called outside MinimalOrganizationProvider - using defaults'
    );
    return {
      currentOrganization: null,
      userOrganizations: [],
      setCurrentOrganization: () => {},
      switchOrganization: async () => false,
      userRole: '',
      userPermissions: [],
      isLoading: false,
      refreshOrganizations: async () => {},
    };
  }
  return context;
}

interface MinimalProvidersProps {
  children: ReactNode;
}

export function MinimalProviders({ children }: MinimalProvidersProps) {
  console.log('🔧 MINIMAL PROVIDERS LOADING - WITH SAFE ORGANIZATION CONTEXT');
  return (
    <SessionProvider>
      <MinimalOrganizationProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </MinimalOrganizationProvider>
    </SessionProvider>
  );
}

export default MinimalProviders;
