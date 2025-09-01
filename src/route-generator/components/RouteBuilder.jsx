'use client';

import React, { useEffect, useState } from 'react';
import { safeGenerateRoute } from '../templates/route-generators.js';
import { LOCATION_TYPES } from '../templates/template-constants.js';
import { validateAddress } from '../templates/utils/maps-integration.js';

const RouteBuilder = ({ onRouteGenerated, initialData = {} }) => {
  const [routeData, setRouteData] = useState({
    companyName: 'FleetFlow Logistics',
    mcNumber: 'MC-000000',
    contactPhone: '(555) 123-4567',
    routeNumber: '1',
    routeName: 'Standard Delivery Route',
    totalMiles: '',
    totalAmount: '',
    pickupLocationName: '',
    pickupAddress: '',
    pickupTime: '',
    pickupContact: '',
    pickupManager: '',
    pickupPhone: '',
    locationType: 'Distribution Center',
    confirmationNumber: '',
    safetyRequirements: '',
    accessRequirements: '',
    timingRestrictions: '',
    documentationRequirements: '',
    loadingArea: '',
    pickupNotes: '',
    driverName: '',
    vehicleNumber: '',
    stops: [],
    ...initialData,
  });

  const [currentStop, setCurrentStop] = useState({
    name: '',
    address: '',
    deliveryTime: '',
    items: '',
    contact: '',
    instructions: '',
  });

  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewDocument, setPreviewDocument] = useState('');

  // Auto-apply location defaults when location type changes
  useEffect(() => {
    const locationDefaults = LOCATION_TYPES[routeData.locationType];
    if (locationDefaults) {
      setRouteData((prev) => ({
        ...prev,
        safetyRequirements:
          prev.safetyRequirements || locationDefaults.defaultSafetyRequirements,
        accessRequirements:
          prev.accessRequirements || locationDefaults.defaultAccessRequirements,
        timingRestrictions:
          prev.timingRestrictions || locationDefaults.defaultTimingRestrictions,
        documentationRequirements:
          prev.documentationRequirements ||
          locationDefaults.defaultDocumentationRequirements,
        loadingArea: prev.loadingArea || locationDefaults.defaultLoadingArea,
      }));
    }
  }, [routeData.locationType]);

  // Auto-calculate rate per mile
  useEffect(() => {
    if (routeData.totalAmount && routeData.totalMiles) {
      const ratePerMile = (
        parseFloat(routeData.totalAmount) / parseFloat(routeData.totalMiles)
      ).toFixed(2);
      setRouteData((prev) => ({ ...prev, ratePerMile }));
    }
  }, [routeData.totalAmount, routeData.totalMiles]);

  const handleInputChange = (field, value) => {
    setRouteData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleStopChange = (field, value) => {
    setCurrentStop((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addStop = () => {
    if (!currentStop.name || !currentStop.address) {
      setErrors((prev) => ({
        ...prev,
        stopError: 'Stop name and address are required',
      }));
      return;
    }

    // Validate address
    const addressValidation = validateAddress(currentStop.address);
    if (!addressValidation.isValid) {
      setErrors((prev) => ({
        ...prev,
        stopError: addressValidation.suggestions.join(', '),
      }));
      return;
    }

    setRouteData((prev) => ({
      ...prev,
      stops: [...prev.stops, { ...currentStop }],
    }));

    setCurrentStop({
      name: '',
      address: '',
      deliveryTime: '',
      items: '',
      contact: '',
      instructions: '',
    });

    setErrors((prev) => ({
      ...prev,
      stopError: null,
    }));
  };

  const removeStop = (index) => {
    setRouteData((prev) => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index),
    }));
  };

  const generatePreview = () => {
    const result = safeGenerateRoute(routeData);
    if (result.success) {
      setPreviewDocument(result.document);
      setErrors({});
    } else {
      setErrors({ general: result.error });
      setPreviewDocument('');
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const result = safeGenerateRoute(routeData);

      if (result.success) {
        setPreviewDocument(result.document);
        setErrors({});

        if (onRouteGenerated) {
          onRouteGenerated(result.document, routeData);
        }
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'Failed to generate route document' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className='route-builder mx-auto max-w-6xl rounded-lg bg-white p-6 shadow-lg'>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        {/* Form Section */}
        <div className='space-y-6'>
          <div className='rounded-lg bg-blue-50 p-4'>
            <h2 className='mb-2 text-2xl font-bold text-blue-900'>
              🚛 Route Builder
            </h2>
            <p className='text-blue-700'>
              Create professional route documents for any pickup location type
            </p>
          </div>

          {/* Company Information */}
          <div className='rounded-lg bg-gray-50 p-4'>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>
              🏢 Company Information
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Company Name *
                </label>
                <input
                  type='text'
                  value={routeData.companyName}
                  onChange={(e) =>
                    handleInputChange('companyName', e.target.value)
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  MC Number *
                </label>
                <input
                  type='text'
                  value={routeData.mcNumber}
                  onChange={(e) =>
                    handleInputChange('mcNumber', e.target.value)
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Contact Phone *
                </label>
                <input
                  type='tel'
                  value={routeData.contactPhone}
                  onChange={(e) =>
                    handleInputChange('contactPhone', e.target.value)
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>
          </div>

          {/* Route Information */}
          <div className='rounded-lg bg-gray-50 p-4'>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>
              📍 Route Information
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Route Number *
                </label>
                <input
                  type='text'
                  value={routeData.routeNumber}
                  onChange={(e) =>
                    handleInputChange('routeNumber', e.target.value)
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Total Miles
                </label>
                <input
                  type='number'
                  value={routeData.totalMiles}
                  onChange={(e) =>
                    handleInputChange('totalMiles', e.target.value)
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Total Rate ($)
                </label>
                <input
                  type='number'
                  step='0.01'
                  value={routeData.totalAmount}
                  onChange={(e) =>
                    handleInputChange('totalAmount', e.target.value)
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>
            <div className='mt-4'>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Route Name
              </label>
              <input
                type='text'
                value={routeData.routeName}
                onChange={(e) => handleInputChange('routeName', e.target.value)}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
                placeholder="e.g., I-75 Deliveries, Sam's Club Route, Manufacturing Run"
              />
            </div>
          </div>

          {/* Pickup Location */}
          <div className='rounded-lg bg-gray-50 p-4'>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>
              📦 Pickup Location
            </h3>
            <div className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Location Type *
                  </label>
                  <select
                    value={routeData.locationType}
                    onChange={(e) =>
                      handleInputChange('locationType', e.target.value)
                    }
                    className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
                  >
                    {Object.entries(LOCATION_TYPES).map(([type, config]) => (
                      <option key={type} value={type}>
                        {config.icon} {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Pickup Time
                  </label>
                  <input
                    type='text'
                    value={routeData.pickupTime}
                    onChange={(e) =>
                      handleInputChange('pickupTime', e.target.value)
                    }
                    className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
                    placeholder='8:00 AM - 9:00 AM'
                  />
                </div>
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Location Name *
                </label>
                <input
                  type='text'
                  value={routeData.pickupLocationName}
                  onChange={(e) =>
                    handleInputChange('pickupLocationName', e.target.value)
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
                  placeholder="e.g., Sam's Club #1234, Detroit Manufacturing Plant"
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Pickup Address *
                </label>
                <input
                  type='text'
                  value={routeData.pickupAddress}
                  onChange={(e) =>
                    handleInputChange('pickupAddress', e.target.value)
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
                  placeholder='123 Main St, City, State 12345'
                />
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Manager/Contact
                  </label>
                  <input
                    type='text'
                    value={routeData.pickupManager}
                    onChange={(e) =>
                      handleInputChange('pickupManager', e.target.value)
                    }
                    className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Contact Phone
                  </label>
                  <input
                    type='tel'
                    value={routeData.pickupPhone}
                    onChange={(e) =>
                      handleInputChange('pickupPhone', e.target.value)
                    }
                    className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Requirements (Auto-filled based on location type) */}
          <div className='rounded-lg bg-gray-50 p-4'>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>
              ⚠️ Requirements
            </h3>
            <div className='space-y-4'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Safety Requirements
                </label>
                <textarea
                  value={routeData.safetyRequirements}
                  onChange={(e) =>
                    handleInputChange('safetyRequirements', e.target.value)
                  }
                  rows={2}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Access Requirements
                </label>
                <textarea
                  value={routeData.accessRequirements}
                  onChange={(e) =>
                    handleInputChange('accessRequirements', e.target.value)
                  }
                  rows={2}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>
          </div>

          {/* Delivery Stops */}
          <div className='rounded-lg bg-gray-50 p-4'>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>
              🚚 Delivery Stops
            </h3>

            {/* Add Stop Form */}
            <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <input
                  type='text'
                  placeholder='Stop name'
                  value={currentStop.name}
                  onChange={(e) => handleStopChange('name', e.target.value)}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <input
                  type='text'
                  placeholder='Address'
                  value={currentStop.address}
                  onChange={(e) => handleStopChange('address', e.target.value)}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <input
                  type='text'
                  placeholder='Delivery time'
                  value={currentStop.deliveryTime}
                  onChange={(e) =>
                    handleStopChange('deliveryTime', e.target.value)
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <input
                  type='text'
                  placeholder='Items/cargo'
                  value={currentStop.items}
                  onChange={(e) => handleStopChange('items', e.target.value)}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>

            <button
              onClick={addStop}
              className='mb-4 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
            >
              ➕ Add Stop
            </button>

            {errors.stopError && (
              <div className='mb-4 text-sm text-red-600'>
                {errors.stopError}
              </div>
            )}

            {/* Existing Stops */}
            {routeData.stops.length > 0 && (
              <div className='space-y-2'>
                <h4 className='font-medium text-gray-900'>Current Stops:</h4>
                {routeData.stops.map((stop, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between rounded border bg-white p-3'
                  >
                    <div>
                      <div className='font-medium'>{stop.name}</div>
                      <div className='text-sm text-gray-600'>
                        {stop.address}
                      </div>
                    </div>
                    <button
                      onClick={() => removeStop(index)}
                      className='text-red-600 hover:text-red-800'
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Driver Information */}
          <div className='rounded-lg bg-gray-50 p-4'>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>
              👤 Driver Information
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Driver Name
                </label>
                <input
                  type='text'
                  value={routeData.driverName}
                  onChange={(e) =>
                    handleInputChange('driverName', e.target.value)
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Vehicle Number
                </label>
                <input
                  type='text'
                  value={routeData.vehicleNumber}
                  onChange={(e) =>
                    handleInputChange('vehicleNumber', e.target.value)
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-4'>
            <button
              onClick={generatePreview}
              className='flex-1 rounded-lg bg-gray-600 px-6 py-3 text-white transition-colors hover:bg-gray-700'
            >
              👁️ Preview
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className='flex-1 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:opacity-50'
            >
              {isGenerating ? '⏳ Generating...' : '🚛 Generate Route'}
            </button>
          </div>

          {errors.general && (
            <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
              <div className='text-red-800'>{errors.general}</div>
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className='rounded-lg bg-gray-50 p-4'>
          <h3 className='mb-4 text-lg font-semibold text-gray-900'>
            📄 Document Preview
          </h3>
          {previewDocument ? (
            <div className='h-96 overflow-y-auto rounded border bg-white p-4'>
              <pre className='text-sm whitespace-pre-wrap'>
                {previewDocument}
              </pre>
            </div>
          ) : (
            <div className='flex h-96 items-center justify-center rounded border bg-white p-4 text-gray-500'>
              Click &quot;Preview&quot; or &quot;Generate Route&quot; to see the
              document
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteBuilder;
