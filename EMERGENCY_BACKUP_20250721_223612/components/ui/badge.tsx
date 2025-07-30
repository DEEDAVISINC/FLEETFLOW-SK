import React from 'react';

interface BadgeProps {
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({ 
  className = '', 
  children, 
  variant = 'default',
  onClick
}) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors';
  
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    outline: 'border border-gray-200 text-gray-700',
    destructive: 'bg-red-100 text-red-800'
  };

  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
    >
      {children}
    </Component>
  );
}; 