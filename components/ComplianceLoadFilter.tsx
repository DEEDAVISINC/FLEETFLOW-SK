'use client';

import { useState } from 'react';

export interface ComplianceFilterOptions {
  minSafetyScore?: number;
  maxRiskLevel?: 'low' | 'medium' | 'high';
  requireValidAuthority?: boolean;
  requireValidInsurance?: boolean;
  excludeConditionalRatings?: boolean;
  excludeUnratedCarriers?: boolean;
}

interface ComplianceLoadFilterProps {
  onFilterChange: (filter: ComplianceFilterOptions) => void;
  initialFilter: ComplianceFilterOptions;
  compact?: boolean;
}

export default function ComplianceLoadFilter({
  onFilterChange,
  initialFilter,
  compact = false,
}: ComplianceLoadFilterProps) {
  const [filter, setFilter] = useState<ComplianceFilterOptions>(initialFilter);

  const handleChange = (newFilter: ComplianceFilterOptions) => {
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  return (
    <div className='mb-4 rounded-lg bg-white/10 p-4 backdrop-blur-md'>
      <h3 className='mb-2 font-semibold text-white'>Compliance Filters</h3>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <p className='mb-1 text-sm text-white'>Basic Safety Controls</p>
          <div className='flex gap-2'>
            <button
              className='rounded-full bg-blue-600 px-3 py-1 text-xs text-white'
              onClick={() => handleChange({ ...filter, minSafetyScore: 80 })}
            >
              Safety Score &gt; 80
            </button>
            <button
              className='rounded-full bg-yellow-500 px-3 py-1 text-xs text-white'
              onClick={() =>
                handleChange({ ...filter, maxRiskLevel: 'medium' })
              }
            >
              Medium Risk Max
            </button>
          </div>
        </div>
        <div>
          <p className='mb-1 text-sm text-white'>Quick Reset</p>
          <button
            className='rounded-full bg-gray-600 px-3 py-1 text-xs text-white'
            onClick={() => handleChange({})}
          >
            Reset All Filters
          </button>
        </div>
      </div>
    </div>
  );
}
