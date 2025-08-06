'use client';

import Image from 'next/image';
import { useState } from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'light' | 'dark' | 'gradient';
  showText?: boolean;
}

export default function Logo({
  size = 'medium',
  variant = 'gradient',
  showText = false,
}: LogoProps) {
  const [imageError, setImageError] = useState(false);
  const [useCustomLogo] = useState(true);

  console.log('FleetFlowLogo render:', { useCustomLogo, imageError, size });
  const sizes = {
    small: { width: 32, height: 32, text: 'text-sm' },
    medium: { width: 40, height: 40, text: 'text-base' },
    large: { width: 56, height: 56, text: 'text-lg' },
  };

  const currentSize = sizes[size];

  const logoColors = {
    light: 'text-white',
    dark: 'text-gray-900',
    gradient:
      'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent',
  };

  return (
    <div className='flex w-auto items-center' style={{ maxWidth: '320px' }}>
      {/* Custom Logo Image or Icon */}
      {useCustomLogo && !imageError ? (
        <div
          style={{
            width: '280px',
            height: '56px',
            position: 'relative',
          }}
        >
          <Image
            src='/images/fleetflow logo tms.jpg?v=13'
            alt='FleetFlow Logo'
            width={280}
            height={56}
            onError={() => setImageError(true)}
            priority
            style={{
              width: '280px',
              height: '56px',
              objectFit: 'contain',
            }}
          />
        </div>
      ) : (
        /* Fallback Icon */
        <div
          className={`relative ${
            size === 'large'
              ? 'h-14 w-56'
              : size === 'medium'
                ? 'h-12 w-48'
                : 'h-10 w-40'
          }`}
        >
          <div className='flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg'>
            <div className='text-3xl font-bold text-white'>🚛</div>
          </div>
        </div>
      )}
    </div>
  );
}
