import React, { useEffect, useRef, useState } from 'react';

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  maxWidth?: number;
  theme?:
    | 'default'
    | 'dispatch'
    | 'driver'
    | 'broker'
    | 'success'
    | 'warning'
    | 'error';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 500,
  maxWidth = 250,
  theme = 'default',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  const showWithDelay = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => setShowTooltip(true), 50);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowTooltip(false);
    setTimeout(() => setIsVisible(false), 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getThemeClasses = () => {
    switch (theme) {
      case 'dispatch':
        return 'bg-blue-900 text-blue-100 border-blue-700';
      case 'driver':
        return 'bg-amber-900 text-amber-100 border-amber-700';
      case 'broker':
        return 'bg-orange-900 text-orange-100 border-orange-700';
      case 'success':
        return 'bg-green-900 text-green-100 border-green-700';
      case 'warning':
        return 'bg-yellow-900 text-yellow-100 border-yellow-700';
      case 'error':
        return 'bg-red-900 text-red-100 border-red-700';
      default:
        return 'bg-gray-900 text-gray-100 border-gray-700';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default: // top
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    const baseArrow = 'absolute w-0 h-0';
    switch (position) {
      case 'bottom':
        return `${baseArrow} top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900`;
      case 'left':
        return `${baseArrow} top-1/2 right-0 transform translate-x-full -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900`;
      case 'right':
        return `${baseArrow} top-1/2 left-0 transform -translate-x-full -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900`;
      default: // top
        return `${baseArrow} bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900`;
    }
  };

  return (
    <div
      ref={containerRef}
      className='relative inline-block'
      onMouseEnter={showWithDelay}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          className={`pointer-events-none absolute z-50 rounded-md border px-3 py-2 text-xs font-medium shadow-lg transition-all duration-150 ease-in-out ${getThemeClasses()} ${getPositionClasses()} ${showTooltip ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} `}
          style={{ maxWidth: `${maxWidth}px` }}
        >
          {content}
          <div className={getArrowClasses()} />
        </div>
      )}
    </div>
  );
};

// Quick tooltip for simple text
export const QuickTooltip: React.FC<{
  text: string;
  children: React.ReactNode;
  theme?: string;
}> = ({ text, children, theme = 'default' }) => (
  <Tooltip content={text} theme={theme as any} delay={300} maxWidth={200}>
    {children}
  </Tooltip>
);

// Info icon with tooltip
export const InfoTooltip: React.FC<{
  content: string | React.ReactNode;
  theme?: string;
}> = ({ content, theme = 'default' }) => (
  <Tooltip content={content} theme={theme as any} position='top' delay={200}>
    <svg
      className='ml-1 inline-block h-4 w-4 cursor-help text-gray-400 hover:text-gray-600'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      />
    </svg>
  </Tooltip>
);
