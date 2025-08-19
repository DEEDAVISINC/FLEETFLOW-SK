'use client';

import { useEffect, useState } from 'react';

interface ComplianceFilterProps {
  onFilterChange: (filter: ComplianceFilterOptions) => void;
  initialFilter?: ComplianceFilterOptions;
  compact?: boolean;
}

export interface ComplianceFilterOptions {
  minSafetyScore?: number;
  maxRiskLevel?: 'low' | 'medium' | 'high';
  requireValidAuthority?: boolean;
  requireValidInsurance?: boolean;
  excludeConditionalRatings?: boolean;
  excludeUnratedCarriers?: boolean;
}

const ComplianceLoadFilter: React.FC<ComplianceFilterProps> = ({
  onFilterChange,
  initialFilter,
  compact = false,
}) => {
  const [filter, setFilter] = useState<ComplianceFilterOptions>(
    initialFilter || {}
  );

  useEffect(() => {
    if (initialFilter) {
      setFilter(initialFilter);
    }
  }, [initialFilter]);

  const handleChange = (key: keyof ComplianceFilterOptions, value: any) => {
    const newFilter = { ...filter, [key]: value };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  // Function to handle checkbox changes
  const handleCheckboxChange = (key: keyof ComplianceFilterOptions) => {
    handleChange(key, !filter[key]);
  };

  // Compact version (for inline filtering in load boards)
  if (compact) {
    return (
      <div
        style={{
          background: 'rgba(220, 38, 38, 0.1)',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div
            style={{
              fontWeight: 'bold',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              marginRight: '4px',
            }}
          >
            <span
              style={{
                color: '#dc2626',
                marginRight: '6px',
                fontSize: '1.1rem',
              }}
            >
              🛡️
            </span>
            Compliance Filters:
          </div>

          <select
            value={filter.maxRiskLevel || ''}
            onChange={(e) =>
              handleChange('maxRiskLevel', e.target.value || undefined)
            }
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '0.85rem',
              backgroundColor: 'white',
            }}
          >
            <option value=''>All Risk Levels</option>
            <option value='low'>Low Risk Only</option>
            <option value='medium'>Low/Medium Risk</option>
          </select>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <input
              type='checkbox'
              checked={filter.requireValidInsurance || false}
              onChange={() => handleCheckboxChange('requireValidInsurance')}
              style={{ marginRight: '6px' }}
            />
            Valid Insurance
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <input
              type='checkbox'
              checked={filter.requireValidAuthority || false}
              onChange={() => handleCheckboxChange('requireValidAuthority')}
              style={{ marginRight: '6px' }}
            />
            Valid Authority
          </label>
        </div>
      </div>
    );
  }

  // Full version (for dedicated filtering pages)
  return (
    <div
      style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: '16px',
          fontSize: '1.25rem',
          color: '#111827',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span style={{ color: '#dc2626', marginRight: '8px' }}>🛡️</span>
        Compliance Filters
      </h3>

      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            color: '#4b5563',
            fontSize: '0.875rem',
            fontWeight: '500',
          }}
        >
          Minimum Safety Score
        </label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type='range'
            min='0'
            max='100'
            step='5'
            value={filter.minSafetyScore || 0}
            onChange={(e) =>
              handleChange('minSafetyScore', parseInt(e.target.value))
            }
            style={{ flex: 1, marginRight: '12px' }}
          />
          <span
            style={{
              minWidth: '40px',
              textAlign: 'center',
              fontWeight: 'bold',
              color:
                filter.minSafetyScore && filter.minSafetyScore > 0
                  ? '#111827'
                  : '#9CA3AF',
            }}
          >
            {filter.minSafetyScore || 'Any'}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            color: '#4b5563',
            fontSize: '0.875rem',
            fontWeight: '500',
          }}
        >
          Maximum Risk Level
        </label>
        <select
          value={filter.maxRiskLevel || ''}
          onChange={(e) =>
            handleChange('maxRiskLevel', e.target.value || undefined)
          }
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            fontSize: '1rem',
          }}
        >
          <option value=''>All Risk Levels</option>
          <option value='low'>Low Risk Only</option>
          <option value='medium'>Low/Medium Risk</option>
          <option value='high'>Any Risk Level</option>
        </select>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            color: '#111827',
            cursor: 'pointer',
          }}
        >
          <input
            type='checkbox'
            checked={filter.requireValidAuthority || false}
            onChange={() => handleCheckboxChange('requireValidAuthority')}
            style={{ marginRight: '8px' }}
          />
          Require Valid Authority
        </label>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            color: '#111827',
            cursor: 'pointer',
          }}
        >
          <input
            type='checkbox'
            checked={filter.requireValidInsurance || false}
            onChange={() => handleCheckboxChange('requireValidInsurance')}
            style={{ marginRight: '8px' }}
          />
          Require Valid Insurance
        </label>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            color: '#111827',
            cursor: 'pointer',
          }}
        >
          <input
            type='checkbox'
            checked={filter.excludeConditionalRatings || false}
            onChange={() => handleCheckboxChange('excludeConditionalRatings')}
            style={{ marginRight: '8px' }}
          />
          Exclude Conditional Ratings
        </label>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            color: '#111827',
            cursor: 'pointer',
          }}
        >
          <input
            type='checkbox'
            checked={filter.excludeUnratedCarriers || false}
            onChange={() => handleCheckboxChange('excludeUnratedCarriers')}
            style={{ marginRight: '8px' }}
          />
          Exclude Unrated Carriers
        </label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={() => {
            const emptyFilter = {};
            setFilter(emptyFilter);
            onFilterChange(emptyFilter);
          }}
          style={{
            padding: '10px 16px',
            background: '#f3f4f6',
            color: '#4b5563',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          Reset Filters
        </button>

        <button
          onClick={() => onFilterChange(filter)}
          style={{
            padding: '10px 16px',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ComplianceLoadFilter;
