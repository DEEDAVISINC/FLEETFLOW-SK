'use client';

import Link from 'next/link';

interface DocumentsPortalButtonProps {
  variant?: 'default' | 'small' | 'compact';
  className?: string;
  showText?: boolean;
}

export default function DocumentsPortalButton({
  variant = 'default',
  className = '',
  showText = true,
}: DocumentsPortalButtonProps) {
  const baseStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  const variantStyles = {
    default: {
      padding: '12px 20px',
      fontSize: '14px',
    },
    small: {
      padding: '8px 14px',
      fontSize: '13px',
    },
    compact: {
      padding: '6px 12px',
      fontSize: '12px',
    },
  };

  const hoverEffects = {
    onMouseOver: (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
      e.currentTarget.style.background =
        'linear-gradient(135deg, #dc2626, #b91c1c)';
    },
    onMouseOut: (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.background =
        'linear-gradient(135deg, #ef4444, #dc2626)';
    },
  };

  return (
    <Link
      href='/documents'
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        gap: showText ? '8px' : '0px',
      }}
      className={className}
      {...hoverEffects}
    >
      <span style={{ fontSize: '16px' }}>📄</span>
      {showText && <span>Documents</span>}
    </Link>
  );
}
