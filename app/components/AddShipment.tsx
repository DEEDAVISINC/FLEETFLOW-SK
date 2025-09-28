'use client';

import React, { useEffect, useState } from 'react';
import { getAvailableDispatchers, getCurrentUser } from '../config/access';
import {
  Load,
  ShipperInfo,
  createLoad,
  generateLoadId,
} from '../services/loadService';
import { shipperService } from '../services/shipperService';

interface LoadFormData {
  origin: string;
  destination: string;
  rate: number;
  distance: string;
  weight: string;
  equipment: string;
  pickupDate: string;
  deliveryDate: string;
  pickupTime?: string;
  deliveryTime?: string;
  specialInstructions?: string;
  dispatcherId?: string;
  shipperId?: string;
}

interface AddShipmentProps {
  onLoadCreated?: (load: Load) => void;
  onClose?: () => void;
}

export default function AddShipment({
  onLoadCreated,
  onClose,
}: AddShipmentProps) {
  const [formData, setFormData] = useState<LoadFormData>({
    origin: '',
    destination: '',
    rate: 0,
    distance: '',
    weight: '',
    equipment: 'Dry Van',
    pickupDate: '',
    deliveryDate: '',
    pickupTime: '',
    deliveryTime: '',
    specialInstructions: '',
    dispatcherId: '',
    shipperId: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTrackingSetup, setShowTrackingSetup] = useState(false);
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [previewLoad, setPreviewLoad] = useState<Load | null>(null);
  const [shippers, setShippers] = useState<ShipperInfo[]>([]);
  const [selectedShipper, setSelectedShipper] = useState<ShipperInfo | null>(
    null
  );
  const [showNewShipperForm, setShowNewShipperForm] = useState(false);
  const [newShipperData, setNewShipperData] = useState<Partial<ShipperInfo>>(
    {}
  );

  const { user } = getCurrentUser();
  const dispatchers = getAvailableDispatchers();

  // Load shippers on component mount
  useEffect(() => {
    const shipperList = shipperService.getShippersByBroker(
      user.brokerId || 'default-broker'
    );
    setShippers(shipperList);
  }, [user.brokerId]);

  // Update selected shipper when shipper ID changes
  useEffect(() => {
    if (formData.shipperId) {
      const shipper = shipperService.getShipperById(formData.shipperId);
      setSelectedShipper(shipper);
    } else {
      setSelectedShipper(null);
    }
  }, [formData.shipperId]);

  // Equipment options
  const equipmentTypes = [
    'Dry Van',
    'Reefer',
    'Flatbed',
    'Step Deck',
    'Lowboy',
    'Container',
    'Tanker',
    'Box Truck',
    'Power Only',
  ];

  const handleInputChange = (
    field: keyof LoadFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create the load with shipper information
      const loadId = generateLoadId();
      const newLoad = createLoad({
        brokerId: user.brokerId || 'default-broker',
        ...formData,
        shipperInfo: selectedShipper || undefined,
        status: 'Draft',
      });

      setPreviewLoad(newLoad);

      // If tracking is enabled, show tracking setup
      if (trackingEnabled) {
        setShowTrackingSetup(true);
      } else {
        // Complete the creation
        onLoadCreated?.(newLoad);
      }
    } catch (error) {
      console.error('Error creating load:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNewShipper = () => {
    if (
      !newShipperData.companyName ||
      !newShipperData.contactName ||
      !newShipperData.email
    ) {
      alert('Please fill in required shipper information');
      return;
    }

    const newShipper = shipperService.addShipper(
      newShipperData as Omit<ShipperInfo, 'id'>
    );
    setShippers((prev) => [...prev, newShipper]);
    setFormData((prev) => ({ ...prev, shipperId: newShipper.id }));
    setShowNewShipperForm(false);
    setNewShipperData({});
  };

  const completeLoadCreation = () => {
    if (previewLoad) {
      onLoadCreated?.(previewLoad);
      onClose?.();
    }
  };

  if (showTrackingSetup && previewLoad) {
    return (
      <RealTimeTrackingSetup
        load={previewLoad}
        onComplete={completeLoadCreation}
        onBack={() => setShowTrackingSetup(false)}
      />
    );
  }

  return (
    <div className='mx-auto max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg'>
      {/* Header */}
      <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold'>🚛 Add New Shipment</h2>
            <p className='mt-1 text-blue-100'>
              Create and track a new freight shipment
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className='text-white transition-colors hover:text-gray-200'
            >
              <svg
                className='h-6 w-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6 p-6'>
        {/* Route Information */}
        <div className='rounded-lg bg-gray-50 p-4'>
          <h3 className='mb-4 flex items-center text-lg font-semibold text-gray-900'>
            📍 Route Information
          </h3>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Origin *
              </label>
              <input
                type='text'
                required
                value={formData.origin}
                onChange={(e) => handleInputChange('origin', e.target.value)}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
                placeholder='City, State'
              />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Destination *
              </label>
              <input
                type='text'
                required
                value={formData.destination}
                onChange={(e) =>
                  handleInputChange('destination', e.target.value)
                }
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
                placeholder='City, State'
              />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Distance
              </label>
              <input
                type='text'
                value={formData.distance}
                onChange={(e) => handleInputChange('distance', e.target.value)}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
                placeholder='000 mi'
              />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Rate *
              </label>
              <input
                type='number'
                required
                value={formData.rate}
                onChange={(e) =>
                  handleInputChange('rate', parseFloat(e.target.value) || 0)
                }
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
                placeholder='0.00'
              />
            </div>
          </div>
        </div>

        {/* Load Details */}
        <div className='rounded-lg bg-gray-50 p-4'>
          <h3 className='mb-4 flex items-center text-lg font-semibold text-gray-900'>
            📦 Load Details
          </h3>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Weight
              </label>
              <input
                type='text'
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
                placeholder='45,000 lbs'
              />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Equipment Type *
              </label>
              <select
                required
                value={formData.equipment}
                onChange={(e) => handleInputChange('equipment', e.target.value)}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
              >
                {equipmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className='rounded-lg bg-gray-50 p-4'>
          <h3 className='mb-4 flex items-center text-lg font-semibold text-gray-900'>
            🗓️ Schedule
          </h3>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Pickup Date *
              </label>
              <input
                type='date'
                required
                value={formData.pickupDate}
                onChange={(e) =>
                  handleInputChange('pickupDate', e.target.value)
                }
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Pickup Time
              </label>
              <input
                type='time'
                value={formData.pickupTime}
                onChange={(e) =>
                  handleInputChange('pickupTime', e.target.value)
                }
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Delivery Date *
              </label>
              <input
                type='date'
                required
                value={formData.deliveryDate}
                onChange={(e) =>
                  handleInputChange('deliveryDate', e.target.value)
                }
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Delivery Time
              </label>
              <input
                type='time'
                value={formData.deliveryTime}
                onChange={(e) =>
                  handleInputChange('deliveryTime', e.target.value)
                }
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>
        </div>

        {/* Shipper Information */}
        <div className='rounded-lg bg-gray-50 p-4'>
          <h3 className='mb-4 flex items-center text-lg font-semibold text-gray-900'>
            🏢 Shipper Information
          </h3>
          <div className='grid grid-cols-1 gap-4'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Select Shipper *
              </label>
              <div className='flex gap-2'>
                <select
                  required
                  value={formData.shipperId}
                  onChange={(e) =>
                    handleInputChange('shipperId', e.target.value)
                  }
                  className='flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Select a shipper...</option>
                  {shippers.map((shipper) => (
                    <option key={shipper.id} value={shipper.id}>
                      {shipper.companyName} - {shipper.city}, {shipper.state}
                    </option>
                  ))}
                </select>
                <button
                  type='button'
                  onClick={() => setShowNewShipperForm(!showNewShipperForm)}
                  className='rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700'
                >
                  + New
                </button>
              </div>
            </div>

            {/* Selected Shipper Details */}
            {selectedShipper && (
              <div className='rounded-lg border border-gray-200 bg-white p-4'>
                <h4 className='mb-2 font-semibold text-gray-900'>
                  Shipper Details
                </h4>
                <div className='grid grid-cols-1 gap-3 text-sm md:grid-cols-2'>
                  <div>
                    <span className='font-medium text-gray-600'>Company:</span>
                    <span className='ml-2 text-gray-900'>
                      {selectedShipper.companyName}
                    </span>
                  </div>
                  <div>
                    <span className='font-medium text-gray-600'>Contact:</span>
                    <span className='ml-2 text-gray-900'>
                      {selectedShipper.contactName}
                    </span>
                  </div>
                  <div>
                    <span className='font-medium text-gray-600'>Phone:</span>
                    <span className='ml-2 text-gray-900'>
                      {selectedShipper.phone}
                    </span>
                  </div>
                  <div>
                    <span className='font-medium text-gray-600'>Email:</span>
                    <span className='ml-2 text-gray-900'>
                      {selectedShipper.email}
                    </span>
                  </div>
                  <div className='md:col-span-2'>
                    <span className='font-medium text-gray-600'>Address:</span>
                    <span className='ml-2 text-gray-900'>
                      {selectedShipper.address}, {selectedShipper.city},{' '}
                      {selectedShipper.state} {selectedShipper.zipCode}
                    </span>
                  </div>
                  {selectedShipper.specialInstructions && (
                    <div className='md:col-span-2'>
                      <span className='font-medium text-gray-600'>
                        Special Instructions:
                      </span>
                      <span className='ml-2 text-gray-900'>
                        {selectedShipper.specialInstructions}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* New Shipper Form */}
            {showNewShipperForm && (
              <div className='rounded-lg border border-gray-200 bg-white p-4'>
                <h4 className='mb-3 font-semibold text-gray-900'>
                  Add New Shipper
                </h4>
                <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Company Name *
                    </label>
                    <input
                      type='text'
                      value={newShipperData.companyName || ''}
                      onChange={(e) =>
                        setNewShipperData((prev) => ({
                          ...prev,
                          companyName: e.target.value,
                        }))
                      }
                      className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500'
                      placeholder='Company Name'
                    />
                  </div>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Contact Name *
                    </label>
                    <input
                      type='text'
                      value={newShipperData.contactName || ''}
                      onChange={(e) =>
                        setNewShipperData((prev) => ({
                          ...prev,
                          contactName: e.target.value,
                        }))
                      }
                      className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500'
                      placeholder='Contact Name'
                    />
                  </div>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Email *
                    </label>
                    <input
                      type='email'
                      value={newShipperData.email || ''}
                      onChange={(e) =>
                        setNewShipperData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500'
                      placeholder='email@company.com'
                    />
                  </div>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Phone
                    </label>
                    <input
                      type='tel'
                      value={newShipperData.phone || ''}
                      onChange={(e) =>
                        setNewShipperData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500'
                      placeholder='(555) 123-4567'
                    />
                  </div>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Address
                    </label>
                    <input
                      type='text'
                      value={newShipperData.address || ''}
                      onChange={(e) =>
                        setNewShipperData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500'
                      placeholder='Street Address'
                    />
                  </div>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      City
                    </label>
                    <input
                      type='text'
                      value={newShipperData.city || ''}
                      onChange={(e) =>
                        setNewShipperData((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500'
                      placeholder='City'
                    />
                  </div>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      State
                    </label>
                    <input
                      type='text'
                      value={newShipperData.state || ''}
                      onChange={(e) =>
                        setNewShipperData((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500'
                      placeholder='State'
                    />
                  </div>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      ZIP Code
                    </label>
                    <input
                      type='text'
                      value={newShipperData.zipCode || ''}
                      onChange={(e) =>
                        setNewShipperData((prev) => ({
                          ...prev,
                          zipCode: e.target.value,
                        }))
                      }
                      className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500'
                      placeholder='ZIP Code'
                    />
                  </div>
                </div>
                <div className='mt-3 flex gap-2'>
                  <button
                    type='button'
                    onClick={handleAddNewShipper}
                    className='rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700'
                  >
                    Add Shipper
                  </button>
                  <button
                    type='button'
                    onClick={() => setShowNewShipperForm(false)}
                    className='rounded-md bg-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-400'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Assignment & Tracking */}
        <div className='rounded-lg bg-gray-50 p-4'>
          <h3 className='mb-4 flex items-center text-lg font-semibold text-gray-900'>
            👥 Assignment & Tracking
          </h3>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Assign Dispatcher
              </label>
              <select
                value={formData.dispatcherId}
                onChange={(e) =>
                  handleInputChange('dispatcherId', e.target.value)
                }
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>Select Dispatcher</option>
                {dispatchers.map((dispatcher) => (
                  <option key={dispatcher.id} value={dispatcher.id}>
                    {dispatcher.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex items-center'>
              <label className='flex cursor-pointer items-center space-x-2'>
                <input
                  type='checkbox'
                  checked={trackingEnabled}
                  onChange={(e) => setTrackingEnabled(e.target.checked)}
                  className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500'
                />
                <span className='text-sm font-medium text-gray-700'>
                  📍 Enable Real-time Tracking
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        <div className='rounded-lg bg-gray-50 p-4'>
          <h3 className='mb-4 flex items-center text-lg font-semibold text-gray-900'>
            📝 Special Instructions
          </h3>
          <textarea
            value={formData.specialInstructions}
            onChange={(e) =>
              handleInputChange('specialInstructions', e.target.value)
            }
            rows={3}
            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
            placeholder='Any special requirements, delivery instructions, or notes...'
          />
        </div>

        {/* Action Buttons */}
        <div className='flex gap-4 border-t border-gray-200 pt-6'>
          {onClose && (
            <button
              type='button'
              onClick={onClose}
              className='flex-1 rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50'
            >
              Cancel
            </button>
          )}
          <button
            type='submit'
            disabled={isSubmitting}
            className='flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isSubmitting ? (
              <>
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                Creating...
              </>
            ) : (
              <>
                🚛 Create Shipment
                {trackingEnabled && (
                  <span className='text-xs'>(+ Tracking)</span>
                )}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// Real-time Tracking Setup Component
interface RealTimeTrackingSetupProps {
  load: Load;
  onComplete: () => void;
  onBack: () => void;
}

function RealTimeTrackingSetup({
  load,
  onComplete,
  onBack,
}: RealTimeTrackingSetupProps) {
  const [trackingData, setTrackingData] = useState({
    vehicleId: '',
    driverId: '',
    gpsEnabled: true,
    notificationsEnabled: true,
    updateInterval: 5,
    milestoneAlerts: true,
  });

  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const handleSetupComplete = () => {
    setIsSetupComplete(true);
    // In production, this would configure the actual tracking system
    console.info(
      '🚛 Real-time tracking configured for load:',
      load.id,
      trackingData
    );

    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  if (isSetupComplete) {
    return (
      <div className='mx-auto max-w-2xl rounded-lg bg-white p-8 text-center shadow-lg'>
        <div className='mb-6'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
            <svg
              className='h-8 w-8 text-green-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
          <h2 className='mb-2 text-2xl font-bold text-gray-900'>
            🎉 Tracking Setup Complete!
          </h2>
          <p className='text-gray-600'>
            Real-time tracking has been enabled for load{' '}
            <strong>{load.id}</strong>
          </p>
        </div>

        <div className='mb-6 rounded-lg bg-blue-50 p-4'>
          <div className='text-sm text-blue-800'>
            <div className='mb-2 font-medium'>
              ✅ Tracking Features Enabled:
            </div>
            <ul className='space-y-1 text-left'>
              <li>
                • GPS location updates every {trackingData.updateInterval}{' '}
                minutes
              </li>
              <li>• Automated milestone notifications</li>
              <li>• Real-time status updates</li>
              <li>• ETA calculations</li>
            </ul>
          </div>
        </div>

        <div className='text-sm text-gray-500'>
          Redirecting to Dispatch Central...
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-3xl overflow-hidden rounded-lg bg-white shadow-lg'>
      {/* Header */}
      <div className='bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white'>
        <h2 className='flex items-center gap-2 text-2xl font-bold'>
          📍 Real-time Tracking Setup
        </h2>
        <p className='mt-1 text-green-100'>
          Configure tracking for load {load.id}
        </p>
      </div>

      <div className='p-6'>
        {/* Load Summary */}
        <div className='mb-6 rounded-lg bg-gray-50 p-4'>
          <h3 className='mb-2 font-semibold text-gray-900'>Load Summary</h3>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <strong>Route:</strong> {load.origin} → {load.destination}
            </div>
            <div>
              <strong>Equipment:</strong> {load.equipment}
            </div>
            <div>
              <strong>Rate:</strong> ${load.rate.toLocaleString()}
            </div>
            <div>
              <strong>Pickup:</strong>{' '}
              {new Date(load.pickupDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Tracking Configuration */}
        <div className='space-y-6'>
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Vehicle ID
            </label>
            <input
              type='text'
              value={trackingData.vehicleId}
              onChange={(e) =>
                setTrackingData((prev) => ({
                  ...prev,
                  vehicleId: e.target.value,
                }))
              }
              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
              placeholder='Enter vehicle identifier'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Driver ID
            </label>
            <input
              type='text'
              value={trackingData.driverId}
              onChange={(e) =>
                setTrackingData((prev) => ({
                  ...prev,
                  driverId: e.target.value,
                }))
              }
              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
              placeholder='Enter driver identifier'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Update Interval (minutes)
            </label>
            <select
              value={trackingData.updateInterval}
              onChange={(e) =>
                setTrackingData((prev) => ({
                  ...prev,
                  updateInterval: parseInt(e.target.value),
                }))
              }
              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
            >
              <option value={1}>1 minute</option>
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
            </select>
          </div>

          <div className='space-y-3'>
            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={trackingData.gpsEnabled}
                onChange={(e) =>
                  setTrackingData((prev) => ({
                    ...prev,
                    gpsEnabled: e.target.checked,
                  }))
                }
                className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600'
              />
              <span className='text-sm font-medium text-gray-700'>
                Enable GPS Tracking
              </span>
            </label>

            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={trackingData.notificationsEnabled}
                onChange={(e) =>
                  setTrackingData((prev) => ({
                    ...prev,
                    notificationsEnabled: e.target.checked,
                  }))
                }
                className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600'
              />
              <span className='text-sm font-medium text-gray-700'>
                Enable Push Notifications
              </span>
            </label>

            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={trackingData.milestoneAlerts}
                onChange={(e) =>
                  setTrackingData((prev) => ({
                    ...prev,
                    milestoneAlerts: e.target.checked,
                  }))
                }
                className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600'
              />
              <span className='text-sm font-medium text-gray-700'>
                Milestone Alerts
              </span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='mt-6 flex gap-4 border-t border-gray-200 pt-6'>
          <button
            onClick={onBack}
            className='flex-1 rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50'
          >
            ← Back to Form
          </button>
          <button
            onClick={handleSetupComplete}
            className='flex-1 rounded-lg bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700'
          >
            🚀 Activate Tracking
          </button>
        </div>
      </div>
    </div>
  );
}
