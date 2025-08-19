'use client';

import { useState } from 'react';

export default function USPSFreightDemo() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    originZip: '33012',
    destinationZip: '90210',
    weight: 2500,
    length: 48,
    width: 48,
    height: 48,
    packageType: 'PALLET',
    serviceType: 'STANDARD',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === 'weight' ||
        name === 'length' ||
        name === 'width' ||
        name === 'height'
          ? parseFloat(value)
          : value,
    });
  };

  const getRates = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/usps-freight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get rates');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const trackShipment = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    const trackingNumber = prompt('Enter tracking number:');

    if (!trackingNumber) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/usps-freight?trackingNumber=${trackingNumber}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to track shipment');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const schedulePickup = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    const pickupData = {
      pickupDate: new Date().toISOString().split('T')[0],
      pickupTimeWindow: '09:00-17:00',
      contactName: 'John Smith',
      contactPhone: '305-555-1234',
      contactEmail: 'john@example.com',
      address: {
        street1: '123 Main St',
        street2: 'Suite 100',
        city: 'Miami',
        state: 'FL',
        zip: formData.originZip,
      },
      packageCount: 1,
      totalWeight: formData.weight,
      specialInstructions: 'Call upon arrival',
    };

    try {
      const response = await fetch('/api/usps-freight/pickup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pickupData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to schedule pickup');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-8'>
      <h1 className='mb-6 text-3xl font-bold'>USPS Freight API Demo</h1>

      <div className='mb-8 rounded-lg bg-white p-6 shadow-lg'>
        <h2 className='mb-4 text-xl font-semibold'>
          USPS Freight Rate Calculator
        </h2>

        <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Origin ZIP
            </label>
            <input
              type='text'
              name='originZip'
              value={formData.originZip}
              onChange={handleChange}
              className='w-full rounded-md border border-gray-300 px-3 py-2'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Destination ZIP
            </label>
            <input
              type='text'
              name='destinationZip'
              value={formData.destinationZip}
              onChange={handleChange}
              className='w-full rounded-md border border-gray-300 px-3 py-2'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Weight (lbs)
            </label>
            <input
              type='number'
              name='weight'
              value={formData.weight}
              onChange={handleChange}
              className='w-full rounded-md border border-gray-300 px-3 py-2'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Dimensions (inches)
            </label>
            <div className='flex space-x-2'>
              <input
                type='number'
                name='length'
                placeholder='Length'
                value={formData.length}
                onChange={handleChange}
                className='w-full rounded-md border border-gray-300 px-3 py-2'
              />
              <input
                type='number'
                name='width'
                placeholder='Width'
                value={formData.width}
                onChange={handleChange}
                className='w-full rounded-md border border-gray-300 px-3 py-2'
              />
              <input
                type='number'
                name='height'
                placeholder='Height'
                value={formData.height}
                onChange={handleChange}
                className='w-full rounded-md border border-gray-300 px-3 py-2'
              />
            </div>
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Package Type
            </label>
            <input
              type='text'
              name='packageType'
              value={formData.packageType}
              onChange={handleChange}
              className='w-full rounded-md border border-gray-300 px-3 py-2'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Service Type
            </label>
            <input
              type='text'
              name='serviceType'
              value={formData.serviceType}
              onChange={handleChange}
              className='w-full rounded-md border border-gray-300 px-3 py-2'
            />
          </div>
        </div>

        <div className='flex space-x-4'>
          <button
            onClick={getRates}
            disabled={loading}
            className='rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700'
          >
            {loading ? 'Loading...' : 'Get Rates'}
          </button>

          <button
            onClick={trackShipment}
            disabled={loading}
            className='rounded bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700'
          >
            Track Shipment
          </button>

          <button
            onClick={schedulePickup}
            disabled={loading}
            className='rounded bg-purple-600 px-4 py-2 font-bold text-white hover:bg-purple-700'
          >
            Schedule Pickup
          </button>
        </div>
      </div>

      {error && (
        <div className='mb-8 rounded-md border border-red-200 bg-red-50 p-4 text-red-800'>
          <p className='font-medium'>Error:</p>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className='rounded-md border border-blue-200 bg-blue-50 p-6'>
          <h3 className='mb-3 text-lg font-medium text-blue-800'>
            API Response:
          </h3>
          <pre className='max-h-96 overflow-auto rounded border bg-white p-4'>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className='mt-8 rounded-lg border bg-gray-50 p-6'>
        <h2 className='mb-4 text-xl font-semibold'>
          Setting Up USPS Freight API
        </h2>
        <p className='mb-2'>To use the USPS Freight API in production:</p>
        <ol className='mb-4 list-decimal space-y-1 pl-6'>
          <li>
            Register for a USPS Web Tools account at{' '}
            <a
              href='https://www.usps.com/business/web-tools-apis/'
              className='text-blue-600 hover:underline'
            >
              USPS Web Tools
            </a>
          </li>
          <li>Request access to the USPS Freight APIs</li>
          <li>Complete the necessary paperwork and sign the API agreements</li>
          <li>
            Configure your USPS account number and API credentials in your .env
            file
          </li>
          <li>
            Test thoroughly in the production environment before going live
          </li>
        </ol>
        <p className='text-sm text-gray-600'>
          Note: Currently using simulated responses. Replace with real API
          credentials in production.
        </p>
      </div>
    </div>
  );
}
