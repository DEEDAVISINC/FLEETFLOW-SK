'use client';

import { ExternalLink, HelpCircle, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface SmartTooltipProps {
  id: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  children: React.ReactNode;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark' | 'auto';
  interactive?: boolean;
  maxWidth?: number;
  disabled?: boolean;
  className?: string;
}

interface TooltipPortalProps {
  isVisible: boolean;
  position: { top: number; left: number };
  placement: 'top' | 'bottom' | 'left' | 'right';
  title: string;
  content: string;
  size: 'sm' | 'md' | 'lg';
  theme: 'light' | 'dark';
  interactive: boolean;
  maxWidth: number;
  onClose: () => void;
}

const TooltipPortal: React.FC<TooltipPortalProps> = ({
  isVisible,
  position,
  placement,
  title,
  content,
  size,
  theme,
  interactive,
  maxWidth,
  onClose,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible || !tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    const rect = tooltip.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Adjust position if tooltip goes off-screen
    let adjustedPosition = { ...position };

    if (rect.right > viewport.width) {
      adjustedPosition.left = viewport.width - rect.width - 10;
    }
    if (rect.bottom > viewport.height) {
      adjustedPosition.top = viewport.height - rect.height - 10;
    }
    if (adjustedPosition.left < 10) {
      adjustedPosition.left = 10;
    }
    if (adjustedPosition.top < 10) {
      adjustedPosition.top = 10;
    }

    tooltip.style.left = `${adjustedPosition.left}px`;
    tooltip.style.top = `${adjustedPosition.top}px`;
  }, [isVisible, position]);

  if (!isVisible) return null;

  const sizeClasses = {
    sm: 'text-xs p-2',
    md: 'text-sm p-3',
    lg: 'text-base p-4',
  };

  const themeClasses = {
    light: 'bg-white text-gray-900 border-gray-200 shadow-lg',
    dark: 'bg-gray-800 text-white border-gray-600 shadow-2xl',
  };

  return (
    <div
      ref={tooltipRef}
      className={`fixed z-[9999] rounded-lg border ${sizeClasses[size]} ${themeClasses[theme]} animate-in fade-in-0 zoom-in-95 duration-200`}
      style={{
        maxWidth: `${maxWidth}px`,
        left: position.left,
        top: position.top,
      }}
      role='tooltip'
    >
      {/* Arrow */}
      <div
        className={`absolute h-2 w-2 rotate-45 border ${
          placement === 'top'
            ? '-bottom-1 left-1/2 -translate-x-1/2 border-r-0 border-b-0'
            : placement === 'bottom'
              ? '-top-1 left-1/2 -translate-x-1/2 border-t-0 border-l-0'
              : placement === 'left'
                ? 'top-1/2 -right-1 -translate-y-1/2 border-t-0 border-r-0'
                : 'top-1/2 -left-1 -translate-y-1/2 border-b-0 border-l-0'
        } ${themeClasses[theme]}`}
      />

      {/* Header */}
      <div className='mb-2 flex items-center justify-between'>
        <h4 className='font-semibold'>{title}</h4>
        {interactive && (
          <button
            onClick={onClose}
            className={`rounded p-1 hover:opacity-70 ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className='h-3 w-3' />
          </button>
        )}
      </div>

      {/* Content */}
      <div
        className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Footer for interactive tooltips */}
      {interactive && (
        <div className='border-opacity-20 mt-3 flex items-center justify-between border-t pt-2'>
          <div className='flex items-center gap-2'>
            <kbd
              className={`rounded px-1.5 py-0.5 text-xs ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              ESC
            </kbd>
            <span className='text-xs opacity-70'>to close</span>
          </div>
          <button
            className={`text-xs hover:underline ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}
          >
            Learn more <ExternalLink className='ml-1 inline h-3 w-3' />
          </button>
        </div>
      )}
    </div>
  );
};

const SmartTooltip: React.FC<SmartTooltipProps> = ({
  id,
  title,
  content,
  position = 'auto',
  trigger = 'hover',
  delay = 500,
  children,
  showIcon = false,
  size = 'md',
  theme = 'auto',
  interactive = false,
  maxWidth = 320,
  disabled = false,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [tooltipPlacement, setTooltipPlacement] = useState<
    'top' | 'bottom' | 'left' | 'right'
  >('top');
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMouseOverTooltip = useRef(false);

  useEffect(() => {
    // Determine theme
    if (theme === 'auto') {
      const isDark =
        document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setCurrentTheme(isDark ? 'dark' : 'light');
    } else {
      setCurrentTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };

    if (interactive && isVisible) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [interactive, isVisible]);

  const calculatePosition = (triggerElement: HTMLElement) => {
    const rect = triggerElement.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let placement: 'top' | 'bottom' | 'left' | 'right' = 'top';
    let top = 0;
    let left = 0;

    if (position === 'auto') {
      // Determine best position based on available space
      const spaceTop = rect.top;
      const spaceBottom = viewport.height - rect.bottom;
      const spaceLeft = rect.left;
      const spaceRight = viewport.width - rect.right;

      if (spaceBottom > spaceTop && spaceBottom > 150) {
        placement = 'bottom';
      } else if (spaceTop > 150) {
        placement = 'top';
      } else if (spaceRight > spaceLeft && spaceRight > 200) {
        placement = 'right';
      } else {
        placement = 'left';
      }
    } else {
      placement = position;
    }

    // Calculate position based on placement
    switch (placement) {
      case 'top':
        top = rect.top - 10;
        left = rect.left + rect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + 10;
        left = rect.left + rect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - 10;
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + 10;
        break;
    }

    setTooltipPosition({ top, left });
    setTooltipPlacement(placement);
  };

  const showTooltip = () => {
    if (disabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(
      () => {
        if (triggerRef.current) {
          calculatePosition(triggerRef.current);
          setIsVisible(true);
        }
      },
      trigger === 'hover' ? delay : 0
    );
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // For interactive tooltips, delay hiding if mouse is over tooltip
    if (interactive && isMouseOverTooltip.current) {
      return;
    }

    setIsVisible(false);
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      showTooltip();
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      hideTooltip();
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      if (isVisible) {
        hideTooltip();
      } else {
        showTooltip();
      }
    }
  };

  const handleFocus = () => {
    if (trigger === 'focus') {
      showTooltip();
    }
  };

  const handleBlur = () => {
    if (trigger === 'focus') {
      hideTooltip();
    }
  };

  const handleTooltipMouseEnter = () => {
    if (interactive) {
      isMouseOverTooltip.current = true;
    }
  };

  const handleTooltipMouseLeave = () => {
    if (interactive) {
      isMouseOverTooltip.current = false;
      hideTooltip();
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={`inline-flex items-center gap-1 ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-tooltip={id}
        tabIndex={trigger === 'focus' ? 0 : undefined}
      >
        {children}
        {showIcon && (
          <HelpCircle
            className={`h-4 w-4 ${
              currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            } hover:opacity-70`}
          />
        )}
      </div>

      <div
        onMouseEnter={handleTooltipMouseEnter}
        onMouseLeave={handleTooltipMouseLeave}
      >
        <TooltipPortal
          isVisible={isVisible}
          position={tooltipPosition}
          placement={tooltipPlacement}
          title={title}
          content={content}
          size={size}
          theme={currentTheme}
          interactive={interactive}
          maxWidth={maxWidth}
          onClose={() => setIsVisible(false)}
        />
      </div>
    </>
  );
};

export default SmartTooltip;
