'use client';

import { useEffect, useState } from 'react';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  orientation: 'portrait' | 'landscape';
  userAgent: string;
  touchSupport: boolean;
}

const BREAKPOINTS = {
  mobile: 768, // Below 768px = mobile
  tablet: 1024, // 768px to 1024px = tablet
  desktop: 1024, // Above 1024px = desktop
} as const;

/**
 * Custom hook for comprehensive device detection
 * Detects mobile, tablet, desktop based on screen size and user agent
 */
export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 1920,
    screenHeight: 1080,
    deviceType: 'desktop',
    orientation: 'landscape',
    userAgent: '',
    touchSupport: false,
  });

  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const userAgent = navigator.userAgent || '';

      // User Agent based detection (more reliable for actual mobile devices)
      const isMobileUA =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent
        );
      const isTabletUA =
        /iPad|Android(?=.*Mobile)/i.test(userAgent) ||
        (width >= BREAKPOINTS.mobile &&
          width < BREAKPOINTS.desktop &&
          isMobileUA);

      // Screen size based detection
      const isMobileScreen = width < BREAKPOINTS.mobile;
      const isTabletScreen =
        width >= BREAKPOINTS.mobile && width < BREAKPOINTS.desktop;
      const isDesktopScreen = width >= BREAKPOINTS.desktop;

      // Combine both methods for more accurate detection
      const isMobile = isMobileScreen || (isMobileUA && !isTabletUA);
      const isTablet = isTabletScreen || isTabletUA;
      const isDesktop = !isMobile && !isTablet;

      // Determine device type
      let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      if (isMobile) deviceType = 'mobile';
      else if (isTablet) deviceType = 'tablet';

      // Detect touch support
      const touchSupport =
        'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Determine orientation
      const orientation = height > width ? 'portrait' : 'landscape';

      const newDeviceInfo: DeviceInfo = {
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        screenHeight: height,
        deviceType,
        orientation,
        userAgent,
        touchSupport,
      };

      setDeviceInfo(newDeviceInfo);
    };

    // Initial detection
    detectDevice();

    // Listen for window resize
    const handleResize = () => {
      detectDevice();
    };

    // Listen for orientation change
    const handleOrientationChange = () => {
      // Small delay to ensure dimensions are updated
      setTimeout(detectDevice, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return deviceInfo;
};

/**
 * Hook for simple mobile detection (most common use case)
 */
export const useIsMobile = (): boolean => {
  const { isMobile } = useDeviceDetection();
  return isMobile;
};

/**
 * Hook for mobile OR tablet detection (useful for touch interfaces)
 */
export const useIsMobileOrTablet = (): boolean => {
  const { isMobile, isTablet } = useDeviceDetection();
  return isMobile || isTablet;
};

/**
 * Server-side safe device detection for Next.js
 * Returns false during SSR, actual value after hydration
 */
export const useDeviceDetectionSSR = (): DeviceInfo & {
  isHydrated: boolean;
} => {
  const [isHydrated, setIsHydrated] = useState(false);
  const deviceInfo = useDeviceDetection();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return {
    ...deviceInfo,
    isHydrated,
  };
};

/**
 * Utility function for device detection in non-hook contexts
 */
export const detectDeviceFromUserAgent = (
  userAgent: string,
  screenWidth?: number
): DeviceInfo['deviceType'] => {
  const isMobileUA =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );
  const isTabletUA = /iPad|Android(?=.*Mobile)/i.test(userAgent);

  if (screenWidth) {
    if (screenWidth < BREAKPOINTS.mobile) return 'mobile';
    if (screenWidth < BREAKPOINTS.desktop && (isMobileUA || isTabletUA))
      return 'tablet';
    return 'desktop';
  }

  if (isMobileUA && !isTabletUA) return 'mobile';
  if (isTabletUA) return 'tablet';
  return 'desktop';
};

export { BREAKPOINTS };
