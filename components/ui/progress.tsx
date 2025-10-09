'use client';

import React from 'react';

interface ProgressProps {
  value?: number;
  className?: string;
  max?: number;
}

export const Progress: React.FC<ProgressProps> = ({
  value = 0,
  className = '',
  max = 100,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`h-2 w-full rounded-full bg-gray-200 ${className}`}>
      <div
        className='h-2 rounded-full bg-blue-600 transition-all duration-300 ease-in-out'
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default Progress;
