'use client';

import {
  AlertCircle,
  Building,
  CheckCircle,
  CreditCard,
  DollarSign,
  X,
} from 'lucide-react';
import React, { useState } from 'react';

interface DispatchFeeCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string; // Link to existing invoice
  loadData: {
    id: string;
    carrierId: string;
    driverId: string;
    amount: number;
    origin: string;
    destination: string;
    commodity: string;
  };
  companyId: string;
}

interface PaymentMethod {
  id: string;
  type: 'stripe' | 'ach' | 'check' | 'wire';
  label: string;
  icon: React.ReactNode;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'stripe',
    type: 'stripe',
    label: 'Credit Card',
    icon: <CreditCard className='h-5 w-5' />,
    description: 'Secure online payment',
  },
  {
    id: 'ach',
    type: 'ach',
    label: 'Bank Transfer',
    icon: <Building className='h-5 w-5' />,
    description: 'Direct bank transfer',
  },
  {
    id: 'check',
    type: 'check',
    label: 'Check',
    icon: <DollarSign className='h-5 w-5' />,
    description: 'Manual check processing',
  },
  {
    id: 'wire',
    type: 'wire',
    label: 'Wire Transfer',
    icon: <Building className='h-5 w-5' />,
    description: 'Wire transfer',
  },
];

export default function DispatchFeeCollectionModal({
  isOpen,
  onClose,
  invoiceId,
  loadData,
  companyId,
}: DispatchFeeCollectionModalProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('stripe');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<
    'pending' | 'processing' | 'completed' | 'failed'
  >('pending');
  const [error, setError] = useState<string>('');

  // Calculate fees based on load amount (10% default dispatch fee)
  const dispatchFee = (loadData.amount * 10) / 100;
  const processingFee = (dispatchFee * 2.9) / 100; // 2.9% processing fee
  const totalAmount = dispatchFee + processingFee;

  const handlePaymentMethodChange = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/dispatch-fee-collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_payment_from_invoice',
          data: {
            invoiceId: invoiceId,
            paymentData: {
              paymentMethod: selectedPaymentMethod,
              companyId: companyId,
              notes: `Dispatch fee payment for load ${loadData.id}`,
            },
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPaymentStatus('completed');
        // Process payment immediately
        await processPayment(result.data.id);
      } else {
        setError(result.error || 'Payment creation failed');
        setPaymentStatus('failed');
      }
    } catch (error) {
      setError('Network error occurred');
      setPaymentStatus('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const processPayment = async (paymentId: string) => {
    try {
      const response = await fetch('/api/dispatch-fee-collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'process_payment',
          data: {
            paymentId: paymentId,
            invoiceId: invoiceId,
            loadId: loadData.id,
            carrierId: loadData.carrierId,
            driverId: loadData.driverId,
            companyId: companyId,
            amount: totalAmount,
            feePercentage: 10.0,
            loadAmount: loadData.amount,
            paymentMethod: selectedPaymentMethod,
          },
        }),
      });

      const result = await response.json();

      if (result.success && result.data.success) {
        setPaymentStatus('completed');
      } else {
        setError(result.data?.error || 'Payment processing failed');
        setPaymentStatus('failed');
      }
    } catch (error) {
      setError('Payment processing failed');
      setPaymentStatus('failed');
    }
  };

  const handleClose = () => {
    if (paymentStatus === 'completed') {
      onClose();
    } else if (paymentStatus === 'failed') {
      setPaymentStatus('pending');
      setError('');
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black'>
      <div className='mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl'>
        {/* Header */}
        <div className='flex items-center justify-between border-b border-gray-200 p-6'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Dispatch Fee Collection
          </h2>
          <button
            onClick={handleClose}
            className='text-gray-400 transition-colors hover:text-gray-600'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6'>
          {paymentStatus === 'completed' ? (
            <div className='py-8 text-center'>
              <CheckCircle className='mx-auto mb-4 h-16 w-16 text-green-500' />
              <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                Payment Successful!
              </h3>
              <p className='mb-6 text-gray-600'>
                Dispatch fee of ${totalAmount.toFixed(2)} has been processed
                successfully.
              </p>
              <button
                onClick={handleClose}
                className='rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700'
              >
                Close
              </button>
            </div>
          ) : paymentStatus === 'failed' ? (
            <div className='py-8 text-center'>
              <AlertCircle className='mx-auto mb-4 h-16 w-16 text-red-500' />
              <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                Payment Failed
              </h3>
              <p className='mb-4 text-gray-600'>{error}</p>
              <button
                onClick={() => setPaymentStatus('pending')}
                className='rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700'
              >
                Try Again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Invoice Information */}
              <div className='mb-6'>
                <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                  Invoice Information
                </h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Invoice ID
                    </label>
                    <p className='text-gray-900'>{invoiceId}</p>
                  </div>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Load ID
                    </label>
                    <p className='text-gray-900'>{loadData.id}</p>
                  </div>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Load Amount
                    </label>
                    <p className='text-gray-900'>
                      ${loadData.amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Dispatch Fee (10%)
                    </label>
                    <p className='text-gray-900'>${dispatchFee.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Load Information */}
              <div className='mb-6'>
                <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                  Load Information
                </h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Origin
                    </label>
                    <p className='text-gray-900'>{loadData.origin}</p>
                  </div>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Destination
                    </label>
                    <p className='text-gray-900'>{loadData.destination}</p>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className='mb-6'>
                <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                  Payment Method
                </h3>
                <div className='grid grid-cols-2 gap-4'>
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                        selectedPaymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handlePaymentMethodChange(method.id)}
                    >
                      <div className='mb-2 flex items-center'>
                        {method.icon}
                        <span className='ml-2 font-medium text-gray-900'>
                          {method.label}
                        </span>
                      </div>
                      <p className='text-sm text-gray-600'>
                        {method.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className='mb-6'>
                <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                  Payment Summary
                </h3>
                <div className='rounded-lg bg-gray-50 p-4'>
                  <div className='mb-2 flex items-center justify-between'>
                    <span className='text-gray-600'>Dispatch Fee (10%)</span>
                    <span className='text-gray-900'>
                      ${dispatchFee.toFixed(2)}
                    </span>
                  </div>
                  <div className='mb-2 flex items-center justify-between'>
                    <span className='text-gray-600'>Processing Fee (2.9%)</span>
                    <span className='text-gray-900'>
                      ${processingFee.toFixed(2)}
                    </span>
                  </div>
                  <div className='border-t border-gray-200 pt-2'>
                    <div className='flex items-center justify-between'>
                      <span className='font-semibold text-gray-900'>
                        Total Amount
                      </span>
                      <span className='font-semibold text-gray-900'>
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className='flex justify-end space-x-4'>
                <button
                  type='button'
                  onClick={onClose}
                  className='rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isProcessing}
                  className='rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {isProcessing ? 'Processing...' : 'Process Payment'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
