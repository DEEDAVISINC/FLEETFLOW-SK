'use client';

import React, { useState, useEffect } from 'react';
import { EnhancedCarrierService, CarrierData } from '../services/enhanced-carrier-service';

interface CarrierVerificationPanelProps {
  onCarrierVerified?: (carrier: CarrierData) => void;
  onClose?: () => void;
  initialMcNumber?: string;
}

export default function CarrierVerificationPanel({ 
  onCarrierVerified, 
  onClose, 
  initialMcNumber 
}: CarrierVerificationPanelProps) {
  const [mcNumber, setMcNumber] = useState(initialMcNumber || '');
  const [carrier, setCarrier] = useState<CarrierData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [verificationTab, setVerificationTab] = useState<'fmcsa' | 'brokersnapshot' | 'combined'>('combined');

  const carrierService = new EnhancedCarrierService();

  const handleVerifyCarrier = async () => {
    if (!mcNumber.trim()) {
      setError('Please enter an MC number');
      return;
    }

    setLoading(true);
    setError('');
    setCarrier(null);

    try {
      let carrierData: CarrierData | null = null;

      switch (verificationTab) {
        case 'fmcsa':
          carrierData = await carrierService.verifyCarrierFMCSA(mcNumber);
          break;
        case 'brokersnapshot':
          const bsData = await carrierService.getCarrierBrokerSnapshot(mcNumber);
          if (bsData) {
            carrierData = {
              mcNumber,
              dotNumber: '',
              companyName: 'BrokerSnapshot Data',
              physicalAddress: '',
              phone: '',
              safetyRating: 'NOT_RATED',
              insuranceStatus: 'ACTIVE',
              operatingStatus: 'ACTIVE',
              powerUnits: 0,
              drivers: 0,
              mileage: 0,
              lastUpdate: new Date().toISOString(),
              source: 'BROKERSNAPSHOT',
              ...bsData
            } as CarrierData;
          }
          break;
        case 'combined':
        default:
          carrierData = await carrierService.verifyCarrierComprehensive(mcNumber);
          break;
      }

      if (carrierData) {
        setCarrier(carrierData);
        setTrackingEnabled(carrierData.trackingEnabled || false);
        onCarrierVerified?.(carrierData);
      } else {
        setError('Carrier not found or verification failed');
      }
    } catch (err) {
      console.error('Carrier verification error:', err);
      setError('Failed to verify carrier. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnableTracking = async () => {
    if (!carrier) return;

    setLoading(true);
    try {
      const result = await carrierService.enableCarrierTracking(carrier.mcNumber);
      if (result.success) {
        setTrackingEnabled(true);
        setCarrier({ ...carrier, trackingEnabled: true });
        alert('✅ Real-time tracking enabled for this carrier!');
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Failed to enable tracking:', err);
      setError('Failed to enable tracking');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SATISFACTORY':
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'CONDITIONAL':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNSATISFACTORY':
      case 'OUT_OF_SERVICE':
      case 'INACTIVE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">🛡️ Carrier Verification & Tracking</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        )}
      </div>

      {/* Verification Tabs */}
      <div className="flex space-x-2 mb-6">
        {[
          { id: 'combined', label: 'Full Verification', icon: '🔍' },
          { id: 'fmcsa', label: 'FMCSA Only', icon: '🏛️' },
          { id: 'brokersnapshot', label: 'BrokerSnapshot', icon: '📊' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setVerificationTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 ${
              verificationTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* MC Number Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          MC Number
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={mcNumber}
            onChange={(e) => setMcNumber(e.target.value.toUpperCase())}
            placeholder="MC123456"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleVerifyCarrier}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Verifying...' : 'Verify'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-800 text-sm">{error}</div>
        </div>
      )}

      {/* Carrier Information */}
      {carrier && (
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Carrier Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Company Name</label>
                <div className="text-sm text-gray-900 font-medium">{carrier.companyName}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">MC Number</label>
                <div className="text-sm text-gray-900 font-mono">{carrier.mcNumber}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">DOT Number</label>
                <div className="text-sm text-gray-900 font-mono">{carrier.dotNumber}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Phone</label>
                <div className="text-sm text-gray-900">{carrier.phone}</div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500">Address</label>
                <div className="text-sm text-gray-900">{carrier.physicalAddress}</div>
              </div>
            </div>
          </div>

          {/* Safety & Compliance */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🛡️ Safety & Compliance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Safety Rating</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(carrier.safetyRating)}`}>
                  {carrier.safetyRating}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Insurance Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(carrier.insuranceStatus)}`}>
                  {carrier.insuranceStatus}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Operating Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(carrier.operatingStatus)}`}>
                  {carrier.operatingStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Fleet Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🚛 Fleet Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Power Units</label>
                <div className="text-sm text-gray-900 font-medium">{carrier.powerUnits}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Drivers</label>
                <div className="text-sm text-gray-900 font-medium">{carrier.drivers}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Total Mileage</label>
                <div className="text-sm text-gray-900 font-medium">{carrier.mileage.toLocaleString()} mi</div>
              </div>
            </div>
          </div>

          {/* BrokerSnapshot Data */}
          {carrier.source === 'BROKERSNAPSHOT' && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 BrokerSnapshot Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {carrier.creditScore && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Credit Score</label>
                    <div className="text-sm text-gray-900 font-medium">{carrier.creditScore}</div>
                  </div>
                )}
                {carrier.averagePaymentDays && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Avg Payment Days</label>
                    <div className="text-sm text-gray-900 font-medium">{carrier.averagePaymentDays} days</div>
                  </div>
                )}
                {carrier.paymentHistory && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500">Payment History</label>
                    <div className="text-sm text-gray-900">{carrier.paymentHistory}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Real-time Tracking */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📍 Real-time Tracking</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-700 mb-2">
                  {trackingEnabled ? 
                    '✅ Live tracking is enabled for this carrier' : 
                    '⚠️ Live tracking is not enabled'
                  }
                </div>
                {carrier.lastKnownLocation && (
                  <div className="text-xs text-gray-500">
                    Last known location: {carrier.lastKnownLocation.lat.toFixed(4)}, {carrier.lastKnownLocation.lng.toFixed(4)}
                    <br />
                    Updated: {new Date(carrier.lastKnownLocation.timestamp).toLocaleString()}
                  </div>
                )}
              </div>
              {!trackingEnabled && (
                <button
                  onClick={handleEnableTracking}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? '⏳ Enabling...' : '🔄 Enable Tracking'}
                </button>
              )}
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-xs text-gray-500 text-center">
            Data source: {carrier.source} | Last updated: {new Date(carrier.lastUpdate).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
