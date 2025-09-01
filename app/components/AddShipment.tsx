'use client';

import React, { useEffect, useState } from 'react';
import { getAvailableDispatchers, getCurrentUser } from '../config/access';
import { Load, ShipperInfo, createLoad, generateLoadId } from '../services/loadService';
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

export default function AddShipment({ onLoadCreated, onClose }: AddShipmentProps) {
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
    shipperId: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTrackingSetup, setShowTrackingSetup] = useState(false);
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [previewLoad, setPreviewLoad] = useState<Load | null>(null);
  const [shippers, setShippers] = useState<ShipperInfo[]>([]);
  const [selectedShipper, setSelectedShipper] = useState<ShipperInfo | null>(null);
  const [showNewShipperForm, setShowNewShipperForm] = useState(false);
  const [newShipperData, setNewShipperData] = useState<Partial<ShipperInfo>>({});

  const { user } = getCurrentUser();
  const dispatchers = getAvailableDispatchers();

  // Load shippers on component mount
  useEffect(() => {
    const shipperList = shipperService.getShippersByBroker(user.brokerId || 'default-broker');
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
    'Power Only'
  ];

  const handleInputChange = (field: keyof LoadFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
        status: 'Draft'
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
    if (!newShipperData.companyName || !newShipperData.contactName || !newShipperData.email) {
      alert('Please fill in required shipper information');
      return;
    }

    const newShipper = shipperService.addShipper(newShipperData as Omit<ShipperInfo, 'id'>);
    setShippers(prev => [...prev, newShipper]);
    setFormData(prev => ({ ...prev, shipperId: newShipper.id }));
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
    return <RealTimeTrackingSetup
      load={previewLoad}
      onComplete={completeLoadCreation}
      onBack={() => setShowTrackingSetup(false)}
    />;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">🚛 Add New Shipment</h2>
            <p className="text-blue-100 mt-1">Create and track a new freight shipment</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Route Information */}
        <div className="bg-gray-50 rounded-lg p-4">>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            📍 Route Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">>
                Origin *
              </label>
              <input
                type="text"
                required
                value={formData.origin}
                onChange={(e) => handleInputChange('origin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City, State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">>
                Destination *
              </label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City, State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">>
                Distance
              </label>
              <input
                type="text"
                value={formData.distance}
                onChange={(e) => handleInputChange('distance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="000 mi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">>
                Rate *
              </label>
              <input
                type="number"
                required
                value={formData.rate}
                onChange={(e) => handleInputChange('rate', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Load Details */}
        <div className="bg-gray-50 rounded-lg p-4">>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            📦 Load Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">>
                Weight
              </label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="45,000 lbs"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipment Type *
              </label>
              <select
                required
                value={formData.equipment}
                onChange={(e) => handleInputChange('equipment', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {equipmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"
            🗓️ Schedule
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Date *
              </label>
              <input
                type="date"
                required
                value={formData.pickupDate}
                onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Time
              </label>
              <input
                type="time"
                value={formData.pickupTime}
                onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Date *
              </label>
              <input
                type="date"
                required
                value={formData.deliveryDate}
                onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Time
              </label>
              <input
                type="time"
                value={formData.deliveryTime}
                onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Shipper Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"
            🏢 Shipper Information
          </h3>
          <div className="grid grid-cols-1 gap-4"
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Shipper *
              </label>
              <div className="flex gap-2"
                <select
                  required
                  value={formData.shipperId}
                  onChange={(e) => handleInputChange('shipperId', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value=">Select a shipper...</option>
                  {shippers.map(shipper => (
                    <option key={shipper.id} value={shipper.id}>
                      {shipper.companyName} - {shipper.city}, {shipper.state}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewShipperForm(!showNewShipperForm)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  + New
                </button>
              </div>
            </div>

            {/* Selected Shipper Details */}
            {selectedShipper && (
              <div className="bg-white rounded-lg p-4 border border-gray-200"
                <h4 className="font-semibold text-gray-900 mb-2"Shipper Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm"
                  <div>
                    <span className="font-medium text-gray-600"Company:</span>
                    <span className="ml-2 text-gray-900"{selectedShipper.companyName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600"Contact:</span>
                    <span className="ml-2 text-gray-900"{selectedShipper.contactName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600"Phone:</span>
                    <span className="ml-2 text-gray-900"{selectedShipper.phone}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600"Email:</span>
                    <span className="ml-2 text-gray-900"{selectedShipper.email}</span>
                  </div>
                  <div className="md:col-span-2"
                    <span className="font-medium text-gray-600"Address:</span>
                    <span className="ml-2 text-gray-900"
                      {selectedShipper.address}, {selectedShipper.city}, {selectedShipper.state} {selectedShipper.zipCode}
                    </span>
                  </div>
                  {selectedShipper.specialInstructions && (
                    <div className="md:col-span-2"
                      <span className="font-medium text-gray-600"Special Instructions:</span>
                      <span className="ml-2 text-gray-900"{selectedShipper.specialInstructions}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* New Shipper Form */}
            {showNewShipperForm && (
              <div className="bg-white rounded-lg p-4 border border-gray-200"
                <h4 className="font-semibold text-gray-900 mb-3"Add New Shipper</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                    <input
                      type="text"
                      value={newShipperData.companyName || ''}
                      onChange={(e) => setNewShipperData(prev => ({ ...prev, companyName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Company Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name *</label>
                    <input
                      type="text"
                      value={newShipperData.contactName || ''}
                      onChange={(e) => setNewShipperData(prev => ({ ...prev, contactName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Contact Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={newShipperData.email || ''}
                      onChange={(e) => setNewShipperData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="email@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={newShipperData.phone || ''}
                      onChange={(e) => setNewShipperData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={newShipperData.address || ''}
                      onChange={(e) => setNewShipperData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Street Address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={newShipperData.city || ''}
                      onChange={(e) => setNewShipperData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={newShipperData.state || ''}
                      onChange={(e) => setNewShipperData(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={newShipperData.zipCode || ''}
                      onChange={(e) => setNewShipperData(prev => ({ ...prev, zipCode: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="ZIP Code"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-3"
                  <button
                    type="button"
                    onClick={handleAddNewShipper}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Add Shipper
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewShipperForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Assignment & Tracking */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"
            👥 Assignment & Tracking
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign Dispatcher
              </label>
              <select
                value={formData.dispatcherId}
                onChange={(e) => handleInputChange('dispatcherId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value=">Select Dispatcher</option>
                {dispatchers.map(dispatcher => (
                  <option key={dispatcher.id} value={dispatcher.id}>
                    {dispatcher.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center"
              <label className="flex items-center space-x-2 cursor-pointer"
                <input
                  type="checkbox"
                  checked={trackingEnabled}
                  onChange={(e) => setTrackingEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700"
                  📍 Enable Real-time Tracking
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"
            📝 Special Instructions
          </h3>
          <textarea
            value={formData.specialInstructions}
            onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any special requirements, delivery instructions, or notes..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-200"
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                🚛 Create Shipment
                {trackingEnabled && <span className="text-xs">(+ Tracking)</span>}
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

function RealTimeTrackingSetup({ load, onComplete, onBack }: RealTimeTrackingSetupProps) {
  const [trackingData, setTrackingData] = useState({
    vehicleId: '',
    driverId: '',
    gpsEnabled: true,
    notificationsEnabled: true,
    updateInterval: 5,
    milestoneAlerts: true
  });

  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const handleSetupComplete = () => {
    setIsSetupComplete(true);
    // In production, this would configure the actual tracking system
    console.info('🚛 Real-time tracking configured for load:', load.id, trackingData);

    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  if (isSetupComplete) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center"
        <div className="mb-6"
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            <svg className="w-8 h-8 text-green-600"" fill=""none"" stroke=""currentColor"" viewBox=""0 0 24 24"
              <path strokeLinecap=""round"" strokeLinejoin=""round"" strokeWidth={2} d=""M5 13l4 4L19 7"" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2"🎉 Tracking Setup Complete!</h2>
          <p className="text-gray-600"
            Real-time tracking has been enabled for load <strong>{load.id}</strong>
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6"
          <div className="text-sm text-blue-800"
            <div className="font-medium mb-2"✅ Tracking Features Enabled:</div>
            <ul className="space-y-1 text-left"
              <li>• GPS location updates every {trackingData.updateInterval} minutes</li>
              <li>• Automated milestone notifications</li>
              <li>• Real-time status updates</li>
              <li>• ETA calculations</li>
            </ul>
          </div>
        </div>

        <div className="text-sm text-gray-500"
          Redirecting to Dispatch Central...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6"
        <h2 className="text-2xl font-bold flex items-center gap-2"
          📍 Real-time Tracking Setup
        </h2>
        <p className="text-green-100 mt-1"Configure tracking for load {load.id}</p>
      </div>

      <div className="p-6"
        {/* Load Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6"
          <h3 className="font-semibold text-gray-900 mb-2"Load Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm"
            <div><strong>Route:</strong> {load.origin} → {load.destination}</div>
            <div><strong>Equipment:</strong> {load.equipment}</div>
            <div><strong>Rate:</strong> ${load.rate.toLocaleString()}</div>
            <div><strong>Pickup:</strong> {new Date(load.pickupDate).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Tracking Configuration */}
        <div className="space-y-6"
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle ID
            </label>
            <input
              type="text"
              value={trackingData.vehicleId}
              onChange={(e) => setTrackingData(prev => ({ ...prev, vehicleId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter vehicle identifier"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Driver ID
            </label>
            <input
              type="text"
              value={trackingData.driverId}
              onChange={(e) => setTrackingData(prev => ({ ...prev, driverId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter driver identifier"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Update Interval (minutes)
            </label>
            <select
              value={trackingData.updateInterval}
              onChange={(e) => setTrackingData(prev => ({ ...prev, updateInterval: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1 minute</option>
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
            </select>
          </div>

          <div className="space-y-3"
            <label className="flex items-center space-x-2"
              <input
                type="checkbox"
                checked={trackingData.gpsEnabled}
                onChange={(e) => setTrackingData(prev => ({ ...prev, gpsEnabled: e.target.checked }))}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700"Enable GPS Tracking</span>
            </label>

            <label className="flex items-center space-x-2"
              <input
                type="checkbox"
                checked={trackingData.notificationsEnabled}
                onChange={(e) => setTrackingData(prev => ({ ...prev, notificationsEnabled: e.target.checked }))}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700"Enable Push Notifications</span>
            </label>

            <label className="flex items-center space-x-2"
              <input
                type="checkbox"
                checked={trackingData.milestoneAlerts}
                onChange={(e) => setTrackingData(prev => ({ ...prev, milestoneAlerts: e.target.checked }))}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700"Milestone Alerts</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-200 mt-6"
          <button
            onClick={onBack}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ← Back to Form
          </button>
          <button
            onClick={handleSetupComplete}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            🚀 Activate Tracking
          </button>
        </div>
      </div>
    </div>
  );
}
