'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  icon: string;
  keywords?: string[]; // Additional search terms
}

const searchData: SearchResult[] = [
  // Main Navigation
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Main FleetFlow dashboard',
    url: '/fleetflowdash',
    category: 'Navigation',
    icon: '🏠',
    keywords: ['home', 'main', 'overview'],
  },
  {
    id: 'dispatch',
    title: 'Dispatch Central',
    description: 'Load board, management & real-time tracking',
    url: '/dispatch',
    category: 'Navigation',
    icon: '🚛',
    keywords: [
      'loads',
      'tracking',
      'dispatch',
      'central',
      'load board',
      'board',
    ],
  },
  {
    id: 'broker-box',
    title: 'Broker Box',
    description: 'Broker agent login portal',
    url: '/broker',
    category: 'Navigation',
    icon: '�',
    keywords: ['broker', 'login', 'agent', 'portal'],
  },
  {
    id: 'quoting',
    title: 'Freight Quoting',
    description: 'Calculate freight quotes and rates',
    url: '/quoting',
    category: 'Navigation',
    icon: '�',
    keywords: ['quote', 'rate', 'price', 'calculate'],
  },
  {
    id: 'carriers',
    title: 'Carrier Portal',
    description: 'Driver & carrier load board',
    url: '/carriers',
    category: 'Navigation',
    icon: '�',
    keywords: ['carrier', 'driver', 'loads', 'freight', 'available'],
  },

  // Fleet Management
  {
    id: 'vehicles',
    title: 'Vehicles',
    description: 'Manage fleet vehicles and equipment',
    url: '/vehicles',
    category: 'Fleet',
    icon: '🚛',
    keywords: ['trucks', 'fleet', 'equipment', 'vehicles'],
  },
  {
    id: 'drivers',
    title: 'Drivers',
    description: 'Driver management and scheduling',
    url: '/drivers',
    category: 'Fleet',
    icon: '👥',
    keywords: ['drivers', 'staff', 'schedule', 'employees'],
  },
  {
    id: 'shippers',
    title: 'Shippers',
    description: 'Shipper and customer management',
    url: '/shippers',
    category: 'Fleet',
    icon: '🏢',
    keywords: ['customers', 'clients', 'shippers', 'companies'],
  },
  {
    id: 'routes',
    title: 'Routes',
    description: 'Route planning and optimization',
    url: '/routes',
    category: 'Fleet',
    icon: '🗺️',
    keywords: ['routes', 'planning', 'maps', 'navigation'],
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    description: 'Vehicle maintenance scheduling',
    url: '/maintenance',
    category: 'Fleet',
    icon: '🔧',
    keywords: ['maintenance', 'repair', 'service', 'schedule'],
  },

  // Management
  {
    id: 'financials',
    title: 'Financials',
    description: 'Financial reports and accounting',
    url: '/financials',
    category: 'Management',
    icon: '💰',
    keywords: ['money', 'finance', 'accounting', 'revenue'],
  },
  {
    id: 'ai-dashboard',
    title: 'AI Dashboard',
    description: 'AI automation and insights',
    url: '/ai',
    category: 'Management',
    icon: '🤖',
    keywords: ['ai', 'artificial intelligence', 'automation', 'smart'],
  },
  {
    id: 'broker-management',
    title: 'Broker Management',
    description: 'Manage brokers and dispatchers',
    url: '/broker-management',
    category: 'Management',
    icon: '🏢',
    keywords: ['brokers', 'dispatchers', 'assign', 'management'],
  },
  {
    id: 'carrier-verification',
    title: 'Carrier Verification',
    description: 'Look up and monitor carriers using BrokerSnapshot',
    url: '/carrier-verification',
    category: 'Management',
    icon: '🔍',
    keywords: [
      'carrier',
      'verification',
      'lookup',
      'brokersnapshot',
      'monitor',
      'mc',
      'dot',
      'driver',
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'System configuration and preferences',
    url: '/settings',
    category: 'Management',
    icon: '⚙️',
    keywords: ['config', 'preferences', 'setup', 'options'],
  },
  {
    id: 'training',
    title: 'Training',
    description: 'Training modules and resources',
    url: '/training',
    category: 'Management',
    icon: '🎓',
    keywords: ['training', 'education', 'learning', 'courses'],
  },

  // Resources
  {
    id: 'documents',
    title: 'Document Generation',
    description: 'Generate shipping and compliance documents',
    url: '/documents',
    category: 'Resources',
    icon: '📄',
    keywords: ['docs', 'documents', 'generate', 'paperwork'],
  },
  {
    id: 'resources',
    title: 'Resource Library',
    description: 'Access fleet management resources',
    url: '/resources',
    category: 'Resources',
    icon: '📚',
    keywords: ['library', 'resources', 'help', 'guides'],
  },
  {
    id: 'dot-compliance',
    title: 'DOT Compliance',
    description: 'DOT compliance management and reporting',
    url: '/dot-compliance',
    category: 'Resources',
    icon: '🛡️',
    keywords: ['dot', 'compliance', 'regulations', 'safety'],
  },
  {
    id: 'documentation',
    title: 'Documentation Hub',
    description: 'System documentation and guides',
    url: '/documentation',
    category: 'Resources',
    icon: '📚',
    keywords: ['docs', 'help', 'guides', 'manual'],
  },

  // Reports
  {
    id: 'reports',
    title: 'Reports',
    description: 'Generate fleet and performance reports',
    url: '/reports',
    category: 'Reports',
    icon: '📊',
    keywords: ['reports', 'analytics', 'data', 'metrics'],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Business intelligence and analytics',
    url: '/analytics',
    category: 'Reports',
    icon: '📈',
    keywords: ['analytics', 'insights', 'data', 'business intelligence'],
  },
  {
    id: 'performance',
    title: 'Performance',
    description: 'Fleet performance metrics',
    url: '/performance',
    category: 'Reports',
    icon: '⚡',
    keywords: ['performance', 'metrics', 'kpi', 'efficiency'],
  },

  // Features
  {
    id: 'create-load',
    title: 'Create Load',
    description: 'Create new freight loads',
    url: '/broker/dashboard',
    category: 'Features',
    icon: '➕',
    keywords: ['create', 'new load', 'add load', 'freight'],
  },
  {
    id: 'add-shipment',
    title: 'Add Shipment',
    description: 'Create new shipment with tracking',
    url: '/dispatch#add-shipment',
    category: 'Features',
    icon: '🚛',
    keywords: ['add', 'new shipment', 'create shipment', 'freight', 'tracking'],
  },
  {
    id: 'load-board',
    title: 'Load Board',
    description: 'Browse available freight loads',
    url: '/dispatch',
    category: 'Features',
    icon: '📋',
    keywords: ['loads', 'board', 'available', 'freight', 'dispatch'],
  },
  {
    id: 'carrier-board',
    title: 'Carrier Load Board',
    description: 'Load board for drivers and carriers',
    url: '/carriers',
    category: 'Features',
    icon: '🚚',
    keywords: ['carrier', 'driver', 'available loads', 'freight board'],
  },
  {
    id: 'assign-dispatcher',
    title: 'Assign Dispatcher',
    description: 'Assign dispatchers to loads',
    url: '/broker-management',
    category: 'Features',
    icon: '👤',
    keywords: ['assign', 'dispatcher', 'delegate'],
  },
  {
    id: 'track-shipment',
    title: 'Track Shipment',
    description: 'Real-time shipment tracking',
    url: '/dispatch#tracking',
    category: 'Features',
    icon: '📍',
    keywords: ['track', 'tracking', 'location', 'gps', 'real-time'],
  },
  {
    id: 'live-tracking',
    title: 'Live Tracking Dashboard',
    description: 'Real-time load tracking dashboard',
    url: '/dispatch#tracking',
    category: 'Features',
    icon: '🛰️',
    keywords: ['live', 'tracking', 'dashboard', 'real-time', 'monitoring'],
  },
  {
    id: 'generate-quote',
    title: 'Generate Quote',
    description: 'Create freight quotes',
    url: '/quoting',
    category: 'Features',
    icon: '💵',
    keywords: ['quote', 'estimate', 'price', 'rate'],
  },
];

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Search functionality
  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    const filteredResults = searchData
      .filter((item) => {
        const searchTermLower = searchTerm.toLowerCase();

        return (
          item.title.toLowerCase().includes(searchTermLower) ||
          item.description.toLowerCase().includes(searchTermLower) ||
          item.category.toLowerCase().includes(searchTermLower) ||
          (item.keywords &&
            item.keywords.some((keyword) =>
              keyword.toLowerCase().includes(searchTermLower)
            ))
        );
      })
      .slice(0, 8); // Limit to 8 results

    setResults(filteredResults);
    setSelectedIndex(-1);
  }, [searchTerm]);

  // Global keyboard shortcut (Cmd+K)
  useEffect(() => {
    const handleGlobalKeyboard = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyboard);
    return () => document.removeEventListener('keydown', handleGlobalKeyboard);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
        setResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
      setResults([]);
      inputRef.current?.blur();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleResultClick(results[selectedIndex]);
      } else if (results.length > 0) {
        handleResultClick(results[0]);
      }
    }
  };

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    setIsOpen(false);
    setSearchTerm('');
    setResults([]);
    inputRef.current?.blur();
  };

  const openSearch = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div ref={searchRef} style={{ position: 'relative', zIndex: 1000 }}>
      {/* Search Button/Input */}
      {!isOpen ? (
        <button
          onClick={openSearch}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            padding: '8px 16px',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: '200px',
            backdropFilter: 'blur(10px)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span>🔍</span>
          <span style={{ opacity: 0.8 }}>Search FleetFlow...</span>
          <span
            style={{
              marginLeft: 'auto',
              fontSize: '12px',
              opacity: 0.6,
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            ⌘K
          </span>
        </button>
      ) : (
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            minWidth: '400px',
            maxWidth: '500px',
          }}
        >
          {/* Search Input */}
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '18px', color: '#666' }}>🔍</span>
              <input
                ref={inputRef}
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Search pages, features, or content...'
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  color: '#333',
                  background: 'transparent',
                }}
              />
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSearchTerm('');
                  setResults([]);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#999',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
              >
                ESC
              </button>
            </div>
          </div>

          {/* Search Results */}
          {results.length > 0 && (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {results.map((result, index) => (
                <div
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderBottom:
                      index < results.length - 1 ? '1px solid #f0f0f0' : 'none',
                    background: selectedIndex === index ? '#f8f9fa' : 'white',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{result.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#333',
                          marginBottom: '2px',
                        }}
                      >
                        {result.title}
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: '#666',
                          lineHeight: '1.3',
                        }}
                      >
                        {result.description}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#999',
                        background: '#f0f0f0',
                        padding: '2px 8px',
                        borderRadius: '12px',
                      }}
                    >
                      {result.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {searchTerm.length >= 2 && results.length === 0 && (
            <div
              style={{
                padding: '20px',
                textAlign: 'center',
                color: '#999',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔍</div>
              <div>No results found for ""{searchTerm}""</div>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>
                Try searching for pages, features, or content
              </div>
            </div>
          )}

          {/* Quick Help */}
          {searchTerm.length < 2 && (
            <div
              style={{
                padding: '16px',
                color: '#666',
                fontSize: '14px',
              }}
            >
              <div style={{ marginBottom: '12px', fontWeight: '600' }}>
                Quick Access:
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                }}
              >
                <div>📦 Broker Box</div>
                <div>🚛 Dispatch Central</div>
                <div>📋 Load Board</div>
                <div>💰 Quoting</div>
                <div>🤖 AI Dashboard</div>
                <div>🛡️ DOT Compliance</div>
              </div>
              <div
                style={{ marginTop: '12px', fontSize: '12px', opacity: 0.7 }}
              >
                Use ↑↓ to navigate, Enter to select, ESC to close
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
