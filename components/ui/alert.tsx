import React from 'react';

interface AlertProps {
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'warning' | 'success';
}

interface AlertDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ 
  className = '', 
  children, 
  variant = 'default' 
}) => {
  const baseClasses = 'relative w-full rounded-lg border p-4';
  
  const variantClasses = {
    default: 'border-gray-200 bg-white text-gray-900',
    destructive: 'border-red-200 bg-red-50 text-red-900',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-900',
    success: 'border-green-200 bg-green-50 text-green-900'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const AlertDescription: React.FC<AlertDescriptionProps> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div className={`text-sm ${className}`}>
      {children}
    </div>
  );
}; 