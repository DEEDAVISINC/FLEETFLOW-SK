'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface OrganizationFormData {
  name: string;
  type: 'brokerage' | 'dispatch_agency' | 'carrier' | 'shipper';
  billing: {
    contactName: string;
    contactEmail: string;
  };
  mcNumber?: string;
  dispatchFeePercentage?: number;
}

const organizationTypes = [
  {
    id: 'brokerage',
    name: 'Brokerage',
    description: 'Manage freight brokerage operations and loads',
    icon: '🏢',
  },
  {
    id: 'dispatch_agency',
    name: 'Dispatch Agency',
    description: 'Coordinate drivers and manage dispatch operations',
    icon: '🚛',
  },
  {
    id: 'carrier',
    name: 'Carrier',
    description: 'Manage carrier operations and equipment',
    icon: '📦',
  },
  {
    id: 'shipper',
    name: 'Shipper',
    description: 'Manage shipping operations and logistics',
    icon: '🏭',
  },
];

export default function CreateOrganizationPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: '',
    type: 'brokerage',
    billing: {
      contactName: session?.user?.name || '',
      contactEmail: session?.user?.email || '',
    },
    mcNumber: '',
    dispatchFeePercentage: undefined,
  });

  const handleInputChange = (field: string, value: string | number) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof OrganizationFormData],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/organizations/${data.organization.id}`);
      } else {
        setError(data.error || 'Failed to create organization');
      }
    } catch (error) {
      console.error('Error creating organization:', error);
      setError('Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  const selectedType = organizationTypes.find(
    (type) => type.id === formData.type
  );

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='mb-4 flex items-center'>
            <Link
              href='/organizations'
              className='mr-4 text-gray-500 hover:text-gray-700'
            >
              ← Back to Organizations
            </Link>
          </div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Create Organization
          </h1>
          <p className='mt-2 text-gray-600'>
            Set up a new organization to manage your team's operations
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Error Message */}
          {error && (
            <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
              <div className='flex'>
                <div className='flex-shrink-0'>
                  <svg
                    className='h-5 w-5 text-red-400'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='ml-3'>
                  <p className='text-sm text-red-800'>{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Organization Name */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <label
              htmlFor='name'
              className='mb-2 block text-sm font-medium text-gray-700'
            >
              Organization Name *
            </label>
            <input
              type='text'
              id='name'
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
              placeholder='Enter organization name'
              required
            />
          </div>

          {/* Organization Type */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <label className='mb-4 block text-sm font-medium text-gray-700'>
              Organization Type *
            </label>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {organizationTypes.map((type) => (
                <div
                  key={type.id}
                  className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                    formData.type === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('type', type.id)}
                >
                  <div className='flex items-center'>
                    <div className='mr-3 text-2xl'>{type.icon}</div>
                    <div>
                      <h3 className='font-medium text-gray-900'>{type.name}</h3>
                      <p className='text-sm text-gray-500'>
                        {type.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Type Details */}
          {selectedType && (
            <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
              <div className='flex items-center'>
                <div className='mr-3 text-xl'>{selectedType.icon}</div>
                <div>
                  <h3 className='font-medium text-blue-900'>
                    {selectedType.name}
                  </h3>
                  <p className='text-sm text-blue-700'>
                    {selectedType.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Billing Contact */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <h3 className='mb-4 text-lg font-medium text-gray-900'>
              Billing Contact
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label
                  htmlFor='billing.contactName'
                  className='mb-2 block text-sm font-medium text-gray-700'
                >
                  Contact Name *
                </label>
                <input
                  type='text'
                  id='billing.contactName'
                  value={formData.billing.contactName}
                  onChange={(e) =>
                    handleInputChange('billing.contactName', e.target.value)
                  }
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='billing.contactEmail'
                  className='mb-2 block text-sm font-medium text-gray-700'
                >
                  Contact Email *
                </label>
                <input
                  type='email'
                  id='billing.contactEmail'
                  value={formData.billing.contactEmail}
                  onChange={(e) =>
                    handleInputChange('billing.contactEmail', e.target.value)
                  }
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
            </div>
          </div>

          {/* Type-specific fields */}
          {formData.type === 'brokerage' && (
            <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
              <h3 className='mb-4 text-lg font-medium text-gray-900'>
                Brokerage Details
              </h3>
              <div>
                <label
                  htmlFor='mcNumber'
                  className='mb-2 block text-sm font-medium text-gray-700'
                >
                  MC Number (Optional)
                </label>
                <input
                  type='text'
                  id='mcNumber'
                  value={formData.mcNumber || ''}
                  onChange={(e) =>
                    handleInputChange('mcNumber', e.target.value)
                  }
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter MC number'
                />
              </div>
            </div>
          )}

          {formData.type === 'dispatch_agency' && (
            <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
              <h3 className='mb-4 text-lg font-medium text-gray-900'>
                Dispatch Agency Details
              </h3>
              <div>
                <label
                  htmlFor='dispatchFeePercentage'
                  className='mb-2 block text-sm font-medium text-gray-700'
                >
                  Dispatch Fee Percentage (Optional)
                </label>
                <input
                  type='number'
                  id='dispatchFeePercentage'
                  value={formData.dispatchFeePercentage || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'dispatchFeePercentage',
                      parseFloat(e.target.value) || undefined
                    )
                  }
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter fee percentage'
                  min='0'
                  max='100'
                  step='0.1'
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className='flex justify-end space-x-4'>
            <Link
              href='/organizations'
              className='rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50'
            >
              Cancel
            </Link>
            <button
              type='submit'
              disabled={loading}
              className='rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {loading ? 'Creating...' : 'Create Organization'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


