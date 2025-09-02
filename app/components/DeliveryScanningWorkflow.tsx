'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamic import for pallet scanning component
const PalletScanningSystem = dynamic(() => import('./PalletScanningSystem'), {
  loading: () => (
    <div className='flex items-center justify-center p-8'>
      <div className='text-center'>
        <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500'></div>
        <p className='text-gray-600'>Loading delivery scanning system...</p>
      </div>
    </div>
  ),
});

interface DeliveryScanningWorkflowProps {
  loadId: string;
  driverId: string;
  deliveryLocation: string;
  expectedPallets: string[];
}

export default function DeliveryScanningWorkflow({
  loadId,
  driverId,
  deliveryLocation,
  expectedPallets,
}: DeliveryScanningWorkflowProps) {
  const [currentStep, setCurrentStep] = useState<
    'arrival' | 'scanning' | 'verification' | 'completion'
  >('arrival');
  const [locationVerified, setLocationVerified] = useState(false);
  const [damageReported, setDamageReported] = useState(false);
  const [reportedIssues, setReportedIssues] = useState<string[]>([]);

  const steps = [
    { id: 'arrival', label: 'Arrival & Location Verification', icon: '📍' },
    { id: 'scanning', label: 'Pallet Unloading & Scanning', icon: '📦' },
    { id: 'verification', label: 'Final Verification', icon: '✅' },
    { id: 'completion', label: 'Delivery Complete', icon: '🎉' },
  ];

  const verifyLocation = () => {
    // In production, this would use GPS to verify location
    setLocationVerified(true);
    setCurrentStep('scanning');
  };

  const reportIssue = (issue: string) => {
    setReportedIssues((prev) => [...prev, issue]);
    setDamageReported(true);
  };

  const completeDelivery = () => {
    setCurrentStep('completion');
    // Notify dispatch of delivery completion
    console.log('Delivery completed for load:', loadId);
  };

  return (
    <div className='space-y-6'>
      {/* Progress Indicator */}
      <div className='rounded-lg bg-white/10 p-6 backdrop-blur-lg'>
        <h3 className='mb-4 text-lg font-bold text-white'>
          Delivery Workflow Progress
        </h3>
        <div className='flex items-center justify-between'>
          {steps.map((step, index) => (
            <div key={step.id} className='flex items-center'>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                  currentStep === step.id
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : steps.findIndex((s) => s.id === currentStep) > index
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-400 text-gray-400'
                }`}
              >
                {steps.findIndex((s) => s.id === currentStep) > index
                  ? '✓'
                  : step.icon}
              </div>
              <div className='ml-2 text-sm'>
                <div
                  className={`font-medium ${
                    currentStep === step.id
                      ? 'text-blue-400'
                      : steps.findIndex((s) => s.id === currentStep) > index
                        ? 'text-green-400'
                        : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 w-8 ${
                    steps.findIndex((s) => s.id === currentStep) > index
                      ? 'bg-green-500'
                      : 'bg-gray-600'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 'arrival' && (
        <div className='space-y-6'>
          <div className='rounded-lg bg-white/10 p-6 backdrop-blur-lg'>
            <h3 className='mb-4 text-xl font-bold text-white'>
              📍 Arrival at Delivery Location
            </h3>
            <div className='space-y-4'>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-300'>
                  Delivery Location
                </label>
                <div className='rounded-lg bg-white/20 p-3 text-white'>
                  {deliveryLocation}
                </div>
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-gray-300'>
                  Expected Pallets to Deliver
                </label>
                <div className='rounded-lg bg-white/20 p-3'>
                  <div className='font-medium text-white'>
                    {expectedPallets.length} pallets
                  </div>
                  <div className='mt-1 text-sm text-gray-300'>
                    {expectedPallets.join(', ')}
                  </div>
                </div>
              </div>

              {!locationVerified && (
                <button
                  onClick={verifyLocation}
                  className='w-full rounded-lg bg-blue-500 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-600'
                >
                  ✅ Confirm Arrival at Delivery Location
                </button>
              )}

              {locationVerified && (
                <div className='rounded-lg border border-green-500/30 bg-green-500/20 p-4'>
                  <div className='flex items-center gap-2'>
                    <span className='text-green-400'>✅</span>
                    <span className='text-green-200'>
                      Location verified! Ready to begin unloading.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Issue Reporting */}
          <div className='rounded-lg bg-white/10 p-6 backdrop-blur-lg'>
            <h4 className='mb-4 text-lg font-semibold text-white'>
              🚨 Report Issues (if any)
            </h4>
            <div className='space-y-3'>
              <button
                onClick={() => reportIssue('Wrong delivery address')}
                className='w-full rounded-lg border border-red-500/30 bg-red-500/20 p-3 text-left text-red-200 transition-colors hover:bg-red-500/30'
              >
                📍 Wrong delivery address
              </button>
              <button
                onClick={() => reportIssue('Facility closed/not accessible')}
                className='w-full rounded-lg border border-orange-500/30 bg-orange-500/20 p-3 text-left text-orange-200 transition-colors hover:bg-orange-500/30'
              >
                🚫 Facility closed/not accessible
              </button>
              <button
                onClick={() => reportIssue('Security/access issues')}
                className='w-full rounded-lg border border-yellow-500/30 bg-yellow-500/20 p-3 text-left text-yellow-200 transition-colors hover:bg-yellow-500/30'
              >
                🔒 Security/access issues
              </button>
              <button
                onClick={() => reportIssue('Other issues')}
                className='w-full rounded-lg border border-gray-500/30 bg-gray-500/20 p-3 text-left text-gray-200 transition-colors hover:bg-gray-500/30'
              >
                ❓ Other issues
              </button>
            </div>

            {reportedIssues.length > 0 && (
              <div className='mt-4 rounded-lg border border-orange-500/30 bg-orange-500/20 p-3'>
                <h5 className='mb-2 font-medium text-orange-200'>
                  Reported Issues:
                </h5>
                <ul className='space-y-1 text-sm text-orange-300'>
                  {reportedIssues.map((issue, index) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {currentStep === 'scanning' && (
        <div className='space-y-6'>
          <PalletScanningSystem
            loadId={loadId}
            driverId={driverId}
            currentLocation='delivery'
            workflowMode='unloading'
            onScanComplete={(scan) => {
              console.log('Delivery scan completed:', scan);
            }}
            onWorkflowComplete={(summary) => {
              console.log('Delivery unloading workflow completed:', summary);
              if (summary.status === 'completed') {
                setCurrentStep('verification');
              }
            }}
          />
        </div>
      )}

      {currentStep === 'verification' && (
        <div className='space-y-6'>
          <div className='rounded-lg bg-white/10 p-6 backdrop-blur-lg'>
            <h3 className='mb-4 text-xl font-bold text-white'>
              ✅ Final Delivery Verification
            </h3>

            <div className='space-y-4'>
              <div className='rounded-lg border border-green-500/30 bg-green-500/20 p-4'>
                <h4 className='mb-2 font-medium text-green-200'>
                  Unloading Complete!
                </h4>
                <p className='text-sm text-green-300'>
                  All pallets have been scanned and unloaded at the delivery
                  location.
                </p>
              </div>

              <div className='space-y-3'>
                <label className='flex items-center gap-2 text-white'>
                  <input type='checkbox' className='rounded' />
                  <span>All pallets delivered to correct location</span>
                </label>
                <label className='flex items-center gap-2 text-white'>
                  <input type='checkbox' className='rounded' />
                  <span>Receiver signature obtained</span>
                </label>
                <label className='flex items-center gap-2 text-white'>
                  <input type='checkbox' className='rounded' />
                  <span>Delivery photos taken (if required)</span>
                </label>
                <label className='flex items-center gap-2 text-white'>
                  <input type='checkbox' className='rounded' />
                  <span>Bill of lading signed by receiver</span>
                </label>
              </div>

              <button
                onClick={completeDelivery}
                className='flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-medium text-white transition-colors hover:bg-green-700'
              >
                <span>🎉</span>
                Complete Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {currentStep === 'completion' && (
        <div className='space-y-6'>
          <div className='rounded-lg border border-green-500/30 bg-green-500/20 p-6 text-center'>
            <div className='mb-4 text-6xl'>🎉</div>
            <h3 className='mb-2 text-2xl font-bold text-green-200'>
              Delivery Completed Successfully!
            </h3>
            <p className='mb-4 text-green-300'>
              Thank you for your excellent service. Your delivery has been
              recorded and verified.
            </p>

            <div className='mb-4 rounded-lg bg-white/10 p-4'>
              <div className='text-sm text-gray-300'>
                <div>
                  <strong>Load ID:</strong> {loadId}
                </div>
                <div>
                  <strong>Delivery Location:</strong> {deliveryLocation}
                </div>
                <div>
                  <strong>Completion Time:</strong>{' '}
                  {new Date().toLocaleString()}
                </div>
              </div>
            </div>

            <div className='text-sm text-gray-400'>
              📊 Your delivery metrics have been updated in the driver
              dashboard.
            </div>
          </div>

          {/* Next Steps */}
          <div className='rounded-lg border border-blue-500/30 bg-blue-500/20 p-4'>
            <h4 className='mb-2 font-medium text-blue-200'>Next Steps:</h4>
            <ul className='space-y-1 text-sm text-blue-300'>
              <li>• Check for your next assigned load in the portal</li>
              <li>• Update your availability status if needed</li>
              <li>• Review delivery performance in your dashboard</li>
              <li>• Contact dispatch if you need assistance</li>
            </ul>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {currentStep !== 'completion' && (
        <div className='rounded-lg bg-white/10 p-4 backdrop-blur-lg'>
          <h4 className='mb-3 font-medium text-white'>Quick Actions</h4>
          <div className='grid grid-cols-2 gap-3'>
            <button className='rounded-lg border border-blue-500/30 bg-blue-500/20 p-3 text-blue-200 transition-colors hover:bg-blue-500/30'>
              📞 Call Receiver
            </button>
            <button className='rounded-lg border border-green-500/30 bg-green-500/20 p-3 text-green-200 transition-colors hover:bg-green-500/30'>
              📞 Call Dispatch
            </button>
            <button className='rounded-lg border border-orange-500/30 bg-orange-500/20 p-3 text-orange-200 transition-colors hover:bg-orange-500/30'>
              📸 Take Photo
            </button>
            <button className='rounded-lg border border-purple-500/30 bg-purple-500/20 p-3 text-purple-200 transition-colors hover:bg-purple-500/30'>
              📝 Add Notes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
