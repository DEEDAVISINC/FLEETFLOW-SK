'use client';

import React, { ReactNode } from 'react';
import {
  useDeviceDetectionSSR,
  useIsMobileOrTablet,
} from '../hooks/useDeviceDetection';

interface SmartRouterProps {
  mobileComponent: React.ComponentType<any>;
  desktopComponent: React.ComponentType<any>;
  loadingComponent?: React.ComponentType<any>;
  forceMode?: 'mobile' | 'desktop';
  mobileBreakpoint?: number;
  props?: any;
}

/**
 * Loading component shown during device detection
 */
const DefaultLoadingComponent: React.FC = () => (
  <div className='flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900'>
    <div className='text-center'>
      <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent'></div>
      <p className='text-white/80'>Loading FleetFlow...</p>
    </div>
  </div>
);

/**
 * Smart Router Component
 * Automatically renders mobile or desktop version based on device detection
 */
export const SmartRouter: React.FC<SmartRouterProps> = ({
  mobileComponent: MobileComponent,
  desktopComponent: DesktopComponent,
  loadingComponent: LoadingComponent = DefaultLoadingComponent,
  forceMode,
  props = {},
}) => {
  const { isMobile, isTablet, isHydrated } = useDeviceDetectionSSR();

  // Show loading during hydration to prevent layout shift
  if (!isHydrated) {
    return <LoadingComponent />;
  }

  // Force a specific mode if requested (useful for testing/demos)
  if (forceMode) {
    return forceMode === 'mobile' ? (
      <MobileComponent {...props} />
    ) : (
      <DesktopComponent {...props} />
    );
  }

  // Use mobile version for phones and tablets
  const shouldUseMobile = isMobile || isTablet;

  return shouldUseMobile ? (
    <MobileComponent {...props} />
  ) : (
    <DesktopComponent {...props} />
  );
};

/**
 * Higher-order component version of SmartRouter
 */
export const withSmartRouting = <P extends object>(
  MobileComponent: React.ComponentType<P>,
  DesktopComponent: React.ComponentType<P>,
  options?: {
    LoadingComponent?: React.ComponentType<any>;
    forceMode?: 'mobile' | 'desktop';
  }
) => {
  return (props: P) => (
    <SmartRouter
      mobileComponent={MobileComponent}
      desktopComponent={DesktopComponent}
      loadingComponent={options?.LoadingComponent}
      forceMode={options?.forceMode}
      props={props}
    />
  );
};

/**
 * Smart Router Hook - for use within components
 */
export const useSmartRouter = (options?: {
  forceMode?: 'mobile' | 'desktop';
}) => {
  const isMobileOrTablet = useIsMobileOrTablet();
  const { isHydrated } = useDeviceDetectionSSR();

  const shouldUseMobile =
    options?.forceMode === 'mobile' ||
    (options?.forceMode !== 'desktop' && isMobileOrTablet);

  return {
    shouldUseMobile,
    isHydrated,
    renderComponent: <T extends {}>(
      MobileComponent: React.ComponentType<T>,
      DesktopComponent: React.ComponentType<T>,
      props: T
    ) => {
      if (!isHydrated) {
        return <DefaultLoadingComponent />;
      }
      return shouldUseMobile ? (
        <MobileComponent {...props} />
      ) : (
        <DesktopComponent {...props} />
      );
    },
  };
};

/**
 * Responsive wrapper that shows different content based on screen size
 */
interface ResponsiveWrapperProps {
  mobile?: ReactNode;
  tablet?: ReactNode;
  desktop?: ReactNode;
  children?: ReactNode;
}

export const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  mobile,
  tablet,
  desktop,
  children,
}) => {
  const { isMobile, isTablet, isDesktop, isHydrated } = useDeviceDetectionSSR();

  if (!isHydrated) {
    return <DefaultLoadingComponent />;
  }

  if (isMobile && mobile) return <>{mobile}</>;
  if (isTablet && tablet) return <>{tablet}</>;
  if (isDesktop && desktop) return <>{desktop}</>;

  // Fallback to children or default order
  return <>{children || desktop || tablet || mobile}</>;
};

/**
 * Device-specific CSS classes helper
 */
export const useDeviceClasses = () => {
  const { isMobile, isTablet, isDesktop } = useDeviceDetectionSSR();

  return {
    mobile: isMobile ? 'mobile-device' : '',
    tablet: isTablet ? 'tablet-device' : '',
    desktop: isDesktop ? 'desktop-device' : '',
    touchDevice: isMobile || isTablet ? 'touch-device' : 'no-touch-device',
  };
};

export default SmartRouter;
