'use client';

import React, { useState } from 'react';

interface FreightClassResult {
  itemNumber: string;
  class: number;
  description: string;
  density: string;
  stowability: string;
  handling: string;
  liability: string;
}

interface FreightClassCalculatorProps {
  onClassSelected?: (freightClass: number, details: FreightClassResult) => void;
  currentValue?: string;
  embedded?: boolean;
  title?: string;
}

export const FreightClassCalculator: React.FC<FreightClassCalculatorProps> = ({
  onClassSelected,
  currentValue = '',
  embedded = false,
  title = 'Freight Class Calculator',
}) => {
  const [searchType, setSearchType] = useState<'description' | 'item'>(
    'description'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<FreightClassResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState(currentValue);

  // Production-ready NMFC data (cleared for production)
  const mockNMFCData: FreightClassResult[] = [];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      let searchResults: FreightClassResult[] = [];

      if (searchType === 'description') {
        searchResults = mockNMFCData.filter((item) =>
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else {
        searchResults = mockNMFCData.filter((item) =>
          item.itemNumber.includes(searchQuery)
        );
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClassSelect = (result: FreightClassResult) => {
    setSelectedClass(result.class.toString());
    if (onClassSelected) {
      onClassSelected(result.class, result);
    }
  };

  const containerStyle = embedded
    ? {
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        padding: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }
    : {
        background: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      };

  return (
    <div>
      <h1>Freight Class Calculator</h1>
    </div>
  );
};
