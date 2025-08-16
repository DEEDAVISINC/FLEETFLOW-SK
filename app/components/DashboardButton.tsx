'use client';

import Link from 'next/link';

interface DashboardButtonProps {
  position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'inline';
  variant?: 'default' | 'compact' | 'floating';
  showText?: boolean;
}

export default function DashboardButton({
  position = 'top-right',
  variant = 'default',
  showText = true,
}: DashboardButtonProps) {
  const getPositionStyles = () => {
    if (position === 'inline') {
      return {};
    }

    const baseStyles = {
      position: 'fixed' as const,
      zIndex: 1000,
    };

    switch (position) {
      case 'top-left':
        return { ...baseStyles, top: '20px', left: '20px' };
      case 'top-right':
        return { ...baseStyles, top: '20px', right: '20px' };
      case 'bottom-left':
        return { ...baseStyles, bottom: '20px', left: '20px' };
      case 'bottom-right':
        return { ...baseStyles, bottom: '20px', right: '20px' };
      default:
        return { ...baseStyles, top: '20px', right: '20px' };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          padding: '8px 12px',
          fontSize: '12px',
          borderRadius: '6px',
        };
      case 'floating':
        return {
          padding: '12px 16px',
          fontSize: '14px',
          borderRadius: '50px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        };
      default:
        return {
          padding: '10px 16px',
          fontSize: '14px',
          borderRadius: '8px',
        };
    }
  };

  return (
    <Link
      href='/'
      style={{
        ...getPositionStyles(),
        background: 'linear-gradient(135deg, #374151, #1f2937)',
        color: 'white',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        textDecoration: 'none',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        ...getVariantStyles(),
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.background =
          'linear-gradient(135deg, #4b5563, #374151)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.background =
          'linear-gradient(135deg, #374151, #1f2937)';
      }}
    >
      🏠 {showText && 'Dashboard'}
    </Link>
  );
}
