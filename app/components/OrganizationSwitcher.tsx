'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useOrganization } from '../contexts/OrganizationContext';

export default function OrganizationSwitcher() {
  const {
    currentOrganization,
    userOrganizations,
    switchOrganization,
    isLoading,
  } = useOrganization();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOrganizationChange = async (orgId: string) => {
    const success = await switchOrganization(orgId);
    if (success) {
      setIsOpen(false);
      // Refresh the page to update all components with new organization context
      window.location.reload();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'brokerage':
        return '🏢';
      case 'dispatch_agency':
        return '🚛';
      case 'carrier':
        return '📦';
      case 'shipper':
        return '🏭';
      default:
        return '🏢';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'brokerage':
        return 'Brokerage';
      case 'dispatch_agency':
        return 'Dispatch';
      case 'carrier':
        return 'Carrier';
      case 'shipper':
        return 'Shipper';
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-10 w-48 items-center justify-center rounded-lg bg-gray-100'>
        <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600' />
      </div>
    );
  }

  if (!currentOrganization) {
    return (
      <div className='flex items-center rounded-lg bg-gray-100 px-3 py-2'>
        <span className='text-sm text-gray-600'>No organization selected</span>
      </div>
    );
  }

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center space-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-left shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
      >
        <div className='flex items-center space-x-2'>
          <span className='text-lg'>
            {getTypeIcon(currentOrganization.type)}
          </span>
          <div className='flex flex-col'>
            <span className='max-w-32 truncate text-sm font-medium text-gray-900'>
              {currentOrganization.name}
            </span>
            <span className='text-xs text-gray-500'>
              {getTypeLabel(currentOrganization.type)}
            </span>
          </div>
        </div>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>

      {isOpen && (
        <div className='ring-opacity-5 absolute right-0 z-50 mt-1 w-64 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black'>
          <div className='py-1'>
            {/* Current Organization Header */}
            <div className='border-b border-gray-200 px-4 py-2'>
              <p className='text-xs font-medium tracking-wide text-gray-500 uppercase'>
                Current Organization
              </p>
            </div>

            {/* Current Organization */}
            <div className='px-4 py-2'>
              <div className='flex items-center space-x-2'>
                <span className='text-lg'>
                  {getTypeIcon(currentOrganization.type)}
                </span>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium text-gray-900'>
                    {currentOrganization.name}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {getTypeLabel(currentOrganization.type)} •{' '}
                    {currentOrganization.role}
                  </p>
                </div>
                <div className='flex items-center space-x-1'>
                  <div className='h-2 w-2 rounded-full bg-green-400' />
                  <span className='text-xs text-gray-500'>Active</span>
                </div>
              </div>
            </div>

            {/* Organization List */}
            {userOrganizations.length > 1 && (
              <>
                <div className='border-t border-gray-200 px-4 py-2'>
                  <p className='text-xs font-medium tracking-wide text-gray-500 uppercase'>
                    Switch Organization
                  </p>
                </div>

                <div className='max-h-48 overflow-y-auto'>
                  {userOrganizations
                    .filter((org) => org.id !== currentOrganization.id)
                    .map((org) => (
                      <button
                        key={org.id}
                        onClick={() => handleOrganizationChange(org.id)}
                        className='w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none'
                      >
                        <div className='flex items-center space-x-2'>
                          <span className='text-lg'>
                            {getTypeIcon(org.type)}
                          </span>
                          <div className='min-w-0 flex-1'>
                            <p className='truncate text-sm font-medium text-gray-900'>
                              {org.name}
                            </p>
                            <p className='text-xs text-gray-500'>
                              {getTypeLabel(org.type)} • {org.role}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </>
            )}

            {/* Actions */}
            <div className='border-t border-gray-200 px-4 py-2'>
              <Link
                href='/organizations'
                className='block w-full px-2 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                onClick={() => setIsOpen(false)}
              >
                Manage Organizations
              </Link>
              <Link
                href='/organizations/create'
                className='block w-full px-2 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                onClick={() => setIsOpen(false)}
              >
                Create New Organization
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




