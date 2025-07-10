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
  title = "Freight Class Calculator"
}) => {
  const [searchType, setSearchType] = useState<'description' | 'item'>('description');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<FreightClassResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState(currentValue);

  // Mock NMFC data for development
  const mockNMFCData: FreightClassResult[] = [
    {
      itemNumber: "50070",
      class: 60,
      description: "Machinery, NOI (Not Otherwise Indicated)",
      density: "15-22.5",
      stowability: "Normal",
      handling: "Average",
      liability: "Normal"
    },
    {
      itemNumber: "52640",
      class: 70,
      description: "Auto Parts, NOI",
      density: "12-15",
      stowability: "Normal", 
      handling: "Average",
      liability: "Normal"
    },
    {
      itemNumber: "56240",
      class: 85,
      description: "Furniture, NOI",
      density: "8-12",
      stowability: "Difficult",
      handling: "Average",
      liability: "Normal"
    },
    {
      itemNumber: "65120",
      class: 100,
      description: "Electronics, NOI",
      density: "6-8",
      stowability: "Normal",
      handling: "Careful",
      liability: "High"
    },
    {
      itemNumber: "32590",
      class: 175,
      description: "Clothing, NOI",
      density: "4-6",
      stowability: "Normal",
      handling: "Average",
      liability: "Normal"
    },
    {
      itemNumber: "16850",
      class: 250,
      description: "Bamboo Articles, NOI",
      density: "2-4",
      stowability: "Difficult",
      handling: "Average",
      liability: "Normal"
    },
    {
      itemNumber: "87310",
      class: 300,
      description: "Wood Articles, NOI",
      density: "1-2",
      stowability: "Difficult",
      handling: "Careful",
      liability: "Normal"
    },
    {
      itemNumber: "92360",
      class: 400,
      description: "Deer Antlers",
      density: "0.5-1",
      stowability: "Very Difficult",
      handling: "Very Careful",
      liability: "High"
    },
    {
      itemNumber: "13050",
      class: 500,
      description: "Gold Leaf",
      density: "Less than 1",
      stowability: "Very Difficult",
      handling: "Very Careful",
      liability: "Very High"
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let searchResults: FreightClassResult[] = [];
      
      if (searchType === 'description') {
        searchResults = mockNMFCData.filter(item =>
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else {
        searchResults = mockNMFCData.filter(item =>
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

  const containerStyle = embedded ? {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  } : {
    background: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ 
        color: 'white', 
        marginBottom: '16px', 
        fontSize: embedded ? '16px' : '18px',
        fontWeight: '600'
      }}>
        📦 {title}
      </h3>
      
      {/* Search Type Toggle */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <button
            onClick={() => setSearchType('description')}
            style={{
              padding: '8px 16px',
              background: searchType === 'description' 
                ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Search by Description
          </button>
          <button
            onClick={() => setSearchType('item')}
            style={{
              padding: '8px 16px',
              background: searchType === 'item' 
                ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Search by NMFC Item
          </button>
        </div>
        
        {/* Search Input */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchType === 'description' 
              ? "Enter commodity description (e.g., 'auto parts')" 
              : "Enter NMFC item number (e.g., '52640')"
            }
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px'
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !searchQuery.trim()}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              opacity: (isLoading || !searchQuery.trim()) ? 0.5 : 1
            }}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Current Selection */}
      {selectedClass && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid #10b981',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px'
        }}>
          <div style={{ color: '#10b981', fontWeight: '600', fontSize: '14px' }}>
            ✅ Selected Freight Class: {selectedClass}
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '16px'
        }}>
          <h4 style={{ color: 'white', marginBottom: '12px', fontSize: '14px' }}>
            Search Results ({results.length} found)
          </h4>
          <div style={{ display: 'grid', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
            {results.map((result, index) => (
              <div
                key={index}
                onClick={() => handleClassSelect(result)}
                style={{
                  background: selectedClass === result.class.toString() 
                    ? 'rgba(16, 185, 129, 0.2)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  border: selectedClass === result.class.toString() 
                    ? '1px solid #10b981' 
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (selectedClass !== result.class.toString()) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedClass !== result.class.toString()) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                <div style={{ 
                  color: selectedClass === result.class.toString() ? '#10b981' : 'white', 
                  fontWeight: '600', 
                  marginBottom: '4px',
                  fontSize: '14px'
                }}>
                  Item {result.itemNumber} - Class {result.class}
                </div>
                <div style={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  marginBottom: '4px',
                  fontSize: '13px'
                }}>
                  {result.description}
                </div>
                <div style={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: '12px'
                }}>
                  Density: {result.density} PCF | Handling: {result.handling} | Liability: {result.liability}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Class Reference */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        padding: '12px',
        marginTop: '16px'
      }}>
        <h4 style={{ color: 'white', marginBottom: '8px', fontSize: '14px' }}>
          Quick Freight Class Reference
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '6px' }}>
          {[50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500].map(classNum => (
            <button
              key={classNum}
              onClick={() => {
                setSelectedClass(classNum.toString());
                if (onClassSelected) {
                  const mockResult: FreightClassResult = {
                    itemNumber: 'Manual',
                    class: classNum,
                    description: `Class ${classNum} Commodity`,
                    density: 'Various',
                    stowability: 'Various',
                    handling: 'Various',
                    liability: 'Various'
                  };
                  onClassSelected(classNum, mockResult);
                }
              }}
              style={{
                padding: '6px',              background: selectedClass === classNum.toString() 
                ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {classNum}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FreightClassCalculator;
