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
  keywords?: string[];
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
    icon: '🏢',
    keywords: ['broker', 'login', 'agent', 'portal'],
  },
  {
    id: 'quoting',
    title: 'Freight Quoting',
    description: 'Calculate freight quotes and rates',
    url: '/quoting',
    category: 'Navigation',
    icon: '💵',
    keywords: ['quote', 'rate', 'price', 'calculate'],
  },
  {
    id: 'carriers',
    title: 'Carrier Portal',
    description: 'Driver & carrier load board',
    url: '/carriers',
    category: 'Navigation',
    icon: '🚚',
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

  // Business Management
  {
    id: 'financials',
    title: 'Financials',
    description: 'Financial reporting and accounting',
    url: '/financials',
    category: 'Management',
    icon: '💰',
    keywords: ['money', 'finance', 'accounting', 'reports'],
  },
  {
    id: 'ai',
    title: 'AI Dashboard',
    description: 'AI-powered insights and automation',
    url: '/ai',
    category: 'Management',
    icon: '🤖',
    keywords: ['artificial intelligence', 'automation', 'insights'],
  },
  {
    id: 'broker-management',
    title: 'Broker Management',
    description: 'Manage broker relationships and commissions',
    url: '/broker-management',
    category: 'Management',
    icon: '🏢',
    keywords: ['brokers', 'commissions', 'partnerships'],
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'System configuration and preferences',
    url: '/settings',
    category: 'Management',
    icon: '⚙️',
    keywords: ['config', 'preferences', 'admin'],
  },
  {
    id: 'training',
    title: 'Training',
    description: 'Training programs and certifications',
    url: '/training',
    category: 'Management',
    icon: '🎓',
    keywords: ['education', 'certification', 'learning'],
  },
  {
    id: 'documentation',
    title: 'Documentation Hub',
    description: 'Comprehensive system documentation',
    url: '/documentation',
    category: 'Management',
    icon: '📚',
    keywords: ['docs', 'help', 'manual', 'guide'],
  },

  // Resources
  {
    id: 'documents',
    title: 'Document Generation',
    description: 'Generate contracts, invoices, and reports',
    url: '/documents',
    category: 'Resources',
    icon: '📄',
    keywords: ['contracts', 'invoices', 'reports', 'templates'],
  },
  {
    id: 'resources',
    title: 'Resource Library',
    description: 'Access forms, templates, and guides',
    url: '/resources',
    category: 'Resources',
    icon: '📚',
    keywords: ['forms', 'templates', 'library'],
  },
  {
    id: 'dot-compliance',
    title: 'DOT Compliance',
    description: 'DOT compliance tools and monitoring',
    url: '/dot-compliance',
    category: 'Resources',
    icon: '✅',
    keywords: ['dot', 'compliance', 'regulations', 'safety'],
  },

  // Reports
  {
    id: 'performance',
    title: 'Performance Reports',
    description: 'Driver and fleet performance analytics',
    url: '/performance',
    category: 'Reports',
    icon: '📊',
    keywords: ['analytics', 'performance', 'metrics', 'kpi'],
  },
  {
    id: 'analytics',
    title: 'Analytics Dashboard',
    description: 'Business intelligence and data insights',
    url: '/analytics',
    category: 'Reports',
    icon: '📈',
    keywords: ['business intelligence', 'data', 'insights', 'charts'],
  },
  {
    id: 'reports',
    title: 'Reports Center',
    description: 'Generate and view all system reports',
    url: '/reports',
    category: 'Reports',
    icon: '📋',
    keywords: ['reporting', 'data', 'export'],
  },
];

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  placeholder = 'Search FleetFlow...',
  className = '',
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = searchData.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower) ||
          (item.keywords &&
            item.keywords.some((keyword) =>
              keyword.toLowerCase().includes(searchLower)
            ))
        );
      });
      setResults(filtered.slice(0, 8));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
    setSelectedIndex(-1);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    setSearchTerm('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Navigation':
        return 'bg-blue-100 text-blue-800';
      case 'Fleet':
        return 'bg-green-100 text-green-800';
      case 'Management':
        return 'bg-purple-100 text-purple-800';
      case 'Resources':
        return 'bg-orange-100 text-orange-800';
      case 'Reports':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className='relative'>
        <input
          ref={inputRef}
          type='text'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className='w-64 rounded-lg border border-gray-300 bg-white px-4 py-2 pr-4 pl-10 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none'
        />
        <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
          <svg
            className='h-5 w-5 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div className='absolute z-50 mt-1 max-h-96 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg'>
          {results.map((result, index) => (
            <div
              key={result.id}
              onClick={() => handleResultClick(result)}
              className={`cursor-pointer border-b border-gray-100 px-4 py-3 last:border-b-0 hover:bg-gray-50 ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <span className='text-xl'>{result.icon}</span>
                  <div>
                    <div className='font-semibold text-gray-900'>
                      {result.title}
                    </div>
                    <div className='text-sm text-gray-600'>
                      {result.description}
                    </div>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${getCategoryColor(result.category)}`}
                >
                  {result.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && searchTerm && results.length === 0 && (
        <div className='absolute z-50 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg'>
          <div className='px-4 py-3 text-center text-gray-500'>
            No results found for "{searchTerm}"
          </div>
        </div>
      )}
    </div>
  );
}
