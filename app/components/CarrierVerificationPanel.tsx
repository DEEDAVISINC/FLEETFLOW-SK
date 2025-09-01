'use client';

import { useState } from 'react';
import {
  CarrierData,
  EnhancedCarrierService,
} from '../services/enhanced-carrier-service';
import { FraudGuardService } from '../services/fraud-guard-service';

interface CarrierVerificationPanelProps {
  onCarrierVerified?: (carrier: CarrierData) => void;
  onClose?: () => void;
  initialMcNumber?: string;
}

export default function CarrierVerificationPanel({
  onCarrierVerified,
  onClose,
  initialMcNumber,
}: CarrierVerificationPanelProps) {
  const [mcNumber, setMcNumber] = useState(initialMcNumber || '');
  const [carrier, setCarrier] = useState<CarrierData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [verificationTab, setVerificationTab] = useState<
    'fmcsa' | 'brokersnapshot' | 'combined' | 'fleetguard'
  >('combined');
  const [fraudAnalysis, setFraudAnalysis] = useState<any>(null);
  const [fraudLoading, setFraudLoading] = useState(false);

  const carrierService = new EnhancedCarrierService();
  const fraudGuardService = new FraudGuardService();

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
          const bsData =
            await carrierService.getCarrierBrokerSnapshot(mcNumber);
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
              ...bsData,
            } as CarrierData;
          }
          break;
        case 'fleetguard':
          // Run FleetGuard AI fraud analysis
          await runFleetGuardAnalysis(mcNumber);
          return; // Don't proceed with standard verification
        case 'combined':
        default:
          carrierData =
            await carrierService.verifyCarrierComprehensive(mcNumber);
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
      const result = await carrierService.enableCarrierTracking(
        carrier.mcNumber
      );
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

  const runFleetGuardAnalysis = async (mcNum: string) => {
    setFraudLoading(true);
    setError('');
    setFraudAnalysis(null);

    try {
      // First get basic carrier data for analysis
      const carrierData = await carrierService.verifyCarrierFMCSA(mcNum);

      if (carrierData) {
        // Run comprehensive fraud analysis
        const analysis = await fraudGuardService.analyzeCarrier({
          mcNumber: carrierData.mcNumber,
          dotNumber: carrierData.dotNumber,
          companyName: carrierData.companyName,
          physicalAddress: carrierData.physicalAddress,
          mailingAddress:
            carrierData.mailingAddress || carrierData.physicalAddress,
          phone: carrierData.phone,
          safetyRating: carrierData.safetyRating,
          operatingStatus: carrierData.operatingStatus || 'ACTIVE',
        });

        setFraudAnalysis(analysis);
        setCarrier(carrierData); // Set carrier data for display
        console.info('🛡️ FleetGuard AI Analysis Complete:', analysis);
      } else {
        setError('Carrier not found - unable to run fraud analysis');
      }
    } catch (error) {
      console.error('FleetGuard AI analysis failed:', error);
      setError('FleetGuard AI analysis failed. Please try again.');
    } finally {
      setFraudLoading(false);
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
    <div className='rounded-lg bg-white p-6 shadow-lg'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-xl font-bold text-gray-900'>
          🛡️ Carrier Verification & Tracking
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className='text-2xl text-gray-400 hover:text-gray-600'
          >
            ×
          </button>
        )}
      </div>

      {/* Verification Tabs */}
      <div className='mb-6 flex space-x-2'>
        {[
          { id: 'combined', label: 'Full Verification', icon: '🔍' },
          { id: 'fmcsa', label: 'FMCSA Only', icon: '🏛️' },
          { id: 'brokersnapshot', label: 'BrokerSnapshot', icon: '📊' },
          { id: 'fleetguard', label: 'FleetGuard AI', icon: '🛡️' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setVerificationTab(tab.id as any)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors duration-200 ${
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
      <div className='mb-6'>
        <label className='mb-2 block text-sm font-medium text-gray-700'>
          MC Number
        </label>
        <div className='flex gap-2'>
          <input
            type='text'
            value={mcNumber}
            onChange={(e) => setMcNumber(e.target.value.toUpperCase())}
            placeholder='MC123456'
            className='flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500'
          />
          <button
            onClick={handleVerifyCarrier}
            disabled={loading}
            className='rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {loading ? '⏳ Verifying...' : 'Verify'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className='mb-6 rounded-lg border border-red-200 bg-red-50 p-4'>
          <div className='text-sm text-red-800'>{error}</div>
        </div>
      )}

      {/* Carrier Information */}
      {carrier && (
        <div className='space-y-6'>
          {/* Basic Information */}
          <div className='rounded-lg bg-gray-50 p-4'>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>
              📋 Carrier Information
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='block text-sm font-medium text-gray-500'>
                  Company Name
                </label>
                <div className='text-sm font-medium text-gray-900'>
                  {carrier.companyName}
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500'>
                  MC Number
                </label>
                <div className='font-mono text-sm text-gray-900'>
                  {carrier.mcNumber}
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500'>
                  DOT Number
                </label>
                <div className='font-mono text-sm text-gray-900'>
                  {carrier.dotNumber}
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500'>
                  Phone
                </label>
                <div className='text-sm text-gray-900'>{carrier.phone}</div>
              </div>
              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-500'>
                  Address
                </label>
                <div className='text-sm text-gray-900'>
                  {carrier.physicalAddress}
                </div>
              </div>
            </div>
          </div>

          {/* Safety & Compliance */}
          <div className='rounded-lg bg-gray-50 p-4'>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>
              🛡️ Safety & Compliance
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div>
                <label className='block text-sm font-medium text-gray-500'>
                  Safety Rating
                </label>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(carrier.safetyRating)}`}
                >
                  {carrier.safetyRating}
                </span>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500'>
                  Insurance Status
                </label>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(carrier.insuranceStatus)}`}
                >
                  {carrier.insuranceStatus}
                </span>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500'>
                  Operating Status
                </label>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(carrier.operatingStatus)}`}
                >
                  {carrier.operatingStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Fleet Information */}
          <div className='rounded-lg bg-gray-50 p-4'>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>
              🚛 Fleet Information
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div>
                <label className='block text-sm font-medium text-gray-500'>
                  Power Units
                </label>
                <div className='text-sm font-medium text-gray-900'>
                  {carrier.powerUnits}
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500'>
                  Drivers
                </label>
                <div className='text-sm font-medium text-gray-900'>
                  {carrier.drivers}
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-500'>
                  Total Mileage
                </label>
                <div className='text-sm font-medium text-gray-900'>
                  {carrier.mileage.toLocaleString()} mi
                </div>
              </div>
            </div>
          </div>

          {/* FleetGuard AI Analysis */}
          {(fraudLoading || fraudAnalysis) && (
            <div
              className={`rounded-lg p-4 ${
                fraudAnalysis?.riskLevel === 'low'
                  ? 'border border-green-200 bg-green-50'
                  : fraudAnalysis?.riskLevel === 'medium'
                    ? 'border border-yellow-200 bg-yellow-50'
                    : fraudAnalysis?.riskLevel === 'high' ||
                        fraudAnalysis?.riskLevel === 'critical'
                      ? 'border border-red-200 bg-red-50'
                      : 'border border-blue-200 bg-blue-50'
              }`}
            >
              <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900'>
                🛡️ FleetGuard AI Fraud Analysis
                {fraudLoading && (
                  <span className='text-sm text-blue-600'>(Analyzing...)</span>
                )}
              </h3>

              {fraudLoading && (
                <div className='flex items-center justify-center py-8'>
                  <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
                  <span className='ml-3 text-blue-600'>
                    Running comprehensive fraud detection...
                  </span>
                </div>
              )}

              {fraudAnalysis && (
                <div className='space-y-4'>
                  {/* Risk Level */}
                  <div className='flex items-center gap-3'>
                    <span className='text-2xl'>
                      {fraudAnalysis.riskLevel === 'low'
                        ? '✅'
                        : fraudAnalysis.riskLevel === 'medium'
                          ? '⚠️'
                          : fraudAnalysis.riskLevel === 'high'
                            ? '🚨'
                            : '🔴'}
                    </span>
                    <div>
                      <div className='text-lg font-bold text-gray-900 uppercase'>
                        {fraudAnalysis.riskLevel} Risk Level
                      </div>
                      <div className='text-sm text-gray-600'>
                        Confidence: {Math.round(fraudAnalysis.confidence * 100)}
                        %
                      </div>
                    </div>
                  </div>

                  {/* Risk Indicators */}
                  {fraudAnalysis.flags && fraudAnalysis.flags.length > 0 && (
                    <div>
                      <h4 className='mb-2 font-medium text-gray-900'>
                        🚩 Risk Indicators:
                      </h4>
                      <ul className='list-inside list-disc space-y-1 text-sm text-gray-700'>
                        {fraudAnalysis.flags.map(
                          (flag: string, index: number) => (
                            <li key={index}>{flag}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {fraudAnalysis.recommendations &&
                    fraudAnalysis.recommendations.length > 0 && (
                      <div>
                        <h4 className='mb-2 font-medium text-gray-900'>
                          💡 Recommendations:
                        </h4>
                        <ul className='list-inside list-disc space-y-1 text-sm text-gray-700'>
                          {fraudAnalysis.recommendations.map(
                            (rec: string, index: number) => (
                              <li key={index}>{rec}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Analysis Details */}
                  {fraudAnalysis.details && (
                    <div className='grid grid-cols-2 gap-4 border-t border-gray-200 pt-4 md:grid-cols-4'>
                      <div className='text-center'>
                        <div className='text-lg font-bold text-gray-900'>
                          {fraudAnalysis.details.addressRisk || 'N/A'}
                        </div>
                        <div className='text-xs text-gray-600'>
                          Address Risk
                        </div>
                      </div>
                      <div className='text-center'>
                        <div className='text-lg font-bold text-gray-900'>
                          {fraudAnalysis.details.documentRisk || 'N/A'}
                        </div>
                        <div className='text-xs text-gray-600'>
                          Document Risk
                        </div>
                      </div>
                      <div className='text-center'>
                        <div className='text-lg font-bold text-gray-900'>
                          {fraudAnalysis.details.behaviorRisk || 'N/A'}
                        </div>
                        <div className='text-xs text-gray-600'>
                          Behavior Risk
                        </div>
                      </div>
                      <div className='text-center'>
                        <div className='text-lg font-bold text-gray-900'>
                          {fraudAnalysis.details.complianceRisk || 'N/A'}
                        </div>
                        <div className='text-xs text-gray-600'>
                          Compliance Risk
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* BrokerSnapshot Data */}
          {carrier.source === 'BROKERSNAPSHOT' && (
            <div className='rounded-lg bg-blue-50 p-4'>
              <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                📊 BrokerSnapshot Insights
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {carrier.creditScore && (
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>
                      Credit Score
                    </label>
                    <div className='text-sm font-medium text-gray-900'>
                      {carrier.creditScore}
                    </div>
                  </div>
                )}
                {carrier.averagePaymentDays && (
                  <div>
                    <label className='block text-sm font-medium text-gray-500'>
                      Avg Payment Days
                    </label>
                    <div className='text-sm font-medium text-gray-900'>
                      {carrier.averagePaymentDays} days
                    </div>
                  </div>
                )}
                {carrier.paymentHistory && (
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-500'>
                      Payment History
                    </label>
                    <div className='text-sm text-gray-900'>
                      {carrier.paymentHistory}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Real-time Tracking */}
          <div className='rounded-lg bg-green-50 p-4'>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>
              📍 Real-time Tracking
            </h3>
            <div className='flex items-center justify-between'>
              <div>
                <div className='mb-2 text-sm text-gray-700'>
                  {trackingEnabled
                    ? '✅ Live tracking is enabled for this carrier'
                    : '⚠️ Live tracking is not enabled'}
                </div>
                {carrier.lastKnownLocation && (
                  <div className='text-xs text-gray-500'>
                    Last known location:{' '}
                    {carrier.lastKnownLocation.lat.toFixed(4)},{' '}
                    {carrier.lastKnownLocation.lng.toFixed(4)}
                    <br />
                    Updated:{' '}
                    {new Date(
                      carrier.lastKnownLocation.timestamp
                    ).toLocaleString()}
                  </div>
                )}
              </div>
              {!trackingEnabled && (
                <button
                  onClick={handleEnableTracking}
                  disabled={loading}
                  className='rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50'
                >
                  {loading ? '⏳ Enabling...' : '🔄 Enable Tracking'}
                </button>
              )}
            </div>
          </div>

          {/* Last Updated */}
          <div className='text-center text-xs text-gray-500'>
            Data source: {carrier.source} | Last updated:{' '}
            {new Date(carrier.lastUpdate).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
