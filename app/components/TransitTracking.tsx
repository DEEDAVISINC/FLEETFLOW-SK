'use client';

import React, { useState } from 'react';

interface TransitTrackingProps {
  load: any;
  stepData: any;
  setStepData: (data: any) => void;
}

export const TransitTracking: React.FC<TransitTrackingProps> = ({
  load,
  stepData,
  setStepData,
}) => {
  const [currentLocation, setCurrentLocation] = useState(
    stepData?.currentLocation || ''
  );
  const [estimatedArrival, setEstimatedArrival] = useState(
    stepData?.estimatedArrival || ''
  );
  const [trafficConditions, setTrafficConditions] = useState(
    stepData?.trafficConditions || 'Normal'
  );
  const [notes, setNotes] = useState(stepData?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData = {
      ...stepData,
      currentLocation,
      estimatedArrival,
      trafficConditions,
      notes,
      lastUpdated: new Date().toISOString(),
    };

    setStepData(updatedData);
  };

  return (
    <div className='rounded-lg bg-white p-6 shadow-md'>
      <h2 className='mb-4 text-xl font-semibold'>Transit Tracking</h2>
      <p className='mb-6 text-gray-600'>
        Update your current location and estimated arrival time
      </p>

      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='mb-1 block text-sm font-medium text-gray-700'>
            Current Location
          </label>
          <input
            type='text'
            value={currentLocation}
            onChange={(e) => setCurrentLocation(e.target.value)}
            className='w-full rounded border border-gray-300 p-2'
            placeholder='City, State'
            required
          />
        </div>

        <div className='mb-4'>
          <label className='mb-1 block text-sm font-medium text-gray-700'>
            Estimated Arrival
          </label>
          <input
            type='datetime-local'
            value={estimatedArrival}
            onChange={(e) => setEstimatedArrival(e.target.value)}
            className='w-full rounded border border-gray-300 p-2'
            required
          />
        </div>

        <div className='mb-4'>
          <label className='mb-1 block text-sm font-medium text-gray-700'>
            Traffic Conditions
          </label>
          <select
            value={trafficConditions}
            onChange={(e) => setTrafficConditions(e.target.value)}
            className='w-full rounded border border-gray-300 p-2'
          >
            <option value='Light'>Light</option>
            <option value='Normal'>Normal</option>
            <option value='Heavy'>Heavy</option>
            <option value='Severe'>Severe</option>
          </select>
        </div>

        <div className='mb-6'>
          <label className='mb-1 block text-sm font-medium text-gray-700'>
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className='w-full rounded border border-gray-300 p-2'
            rows={3}
            placeholder='Any additional information about your transit'
          />
        </div>

        <div className='flex justify-end'>
          <button
            type='submit'
            className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
          >
            Update Transit Information
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransitTracking;
