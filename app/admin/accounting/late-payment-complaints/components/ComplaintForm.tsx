'use client';

import { useState } from 'react';
import { getCurrentUser } from '../../../../config/access';
import { STANDARD_PAYMENT_TERMS } from '../../../../services/LatePaymentComplaintService';

interface ComplaintFormProps {
  onSubmit: (complaintData: any) => void;
  onCancel: () => void;
}

export default function ComplaintForm({
  onSubmit,
  onCancel,
}: ComplaintFormProps) {
  const { user } = getCurrentUser();
  const [formData, setFormData] = useState({
    entityType: 'carrier' as 'driver' | 'carrier' | 'shipper' | 'vendor',
    entityName: '',
    entityId: '',
    mcNumber: '', // MC Number for carriers/drivers
    invoiceNumber: '',
    invoiceDate: '',
    invoiceAmount: 0,
    dueDate: '',
    daysOverdue: 0,
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    contactAttempts: '',
    // Legal backing fields
    contractReference: '',
    paymentTerms: 'Net 30',
    lateFeePercentage: 1.5,
    legalNotes: '',
  });

  // Show/hide legal details section
  const [showLegalDetails, setShowLegalDetails] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleEntityTypeChange = (
    type: 'driver' | 'carrier' | 'shipper' | 'vendor'
  ) => {
    setFormData({ ...formData, entityType: type });
    // Here you would fetch entities of the selected type in a real implementation
  };

  const calculateDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleDueDateChange = (date: string) => {
    const daysOverdue = calculateDaysOverdue(date);
    setFormData({ ...formData, dueDate: date, daysOverdue });
  };

  const handlePaymentTermsChange = (terms: string) => {
    // Update payment terms and set the corresponding late fee percentage
    if (terms in STANDARD_PAYMENT_TERMS) {
      const termDetails =
        STANDARD_PAYMENT_TERMS[terms as keyof typeof STANDARD_PAYMENT_TERMS];
      setFormData({
        ...formData,
        paymentTerms: terms,
        lateFeePercentage: termDetails.lateFeePercentage,
      });
    } else {
      setFormData({
        ...formData,
        paymentTerms: terms,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Calculate initial late fees
      let accruedLateFees = 0;
      if (formData.daysOverdue > 0 && formData.lateFeePercentage) {
        const monthsOverdue = Math.ceil(formData.daysOverdue / 30);
        accruedLateFees =
          formData.invoiceAmount *
          (formData.lateFeePercentage / 100) *
          monthsOverdue;
      }

      // Here you would submit the complaint to your API
      if (onSubmit) {
        onSubmit({
          ...formData,
          submittedBy: user.id,
          submittedAt: new Date().toISOString(),
          status: 'new',
          accruedLateFees,
        });
      }
    } catch (error) {
      console.error('Failed to submit complaint:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800'>
      <h2 className='mb-4 text-xl font-bold text-gray-900 dark:text-white'>
        File Late Payment Complaint
      </h2>

      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Entity Type Selection */}
        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Entity Type
          </label>
          <div className='flex space-x-4'>
            {['driver', 'carrier', 'shipper', 'vendor'].map((type) => (
              <label key={type} className='inline-flex items-center'>
                <input
                  type='radio'
                  className='form-radio'
                  name='entityType'
                  value={type}
                  checked={formData.entityType === type}
                  onChange={() => handleEntityTypeChange(type as any)}
                />
                <span className='ml-2 text-gray-700 capitalize dark:text-gray-300'>
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Entity Selection */}
        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            {formData.entityType.charAt(0).toUpperCase() +
              formData.entityType.slice(1)}{' '}
            Name
          </label>
          <input
            type='text'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            value={formData.entityName}
            onChange={(e) =>
              setFormData({ ...formData, entityName: e.target.value })
            }
            required
          />
        </div>

        {/* MC Number field for carriers/drivers */}
        {(formData.entityType === 'carrier' ||
          formData.entityType === 'driver') && (
          <div>
            <label className='mb-1 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300'>
              MC Number
              <span className='ml-1 text-xs text-red-600 dark:text-red-400'>
                (Required for BROKERSNAPSHOT integration)
              </span>
            </label>
            <input
              type='text'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              value={formData.mcNumber}
              onChange={(e) =>
                setFormData({ ...formData, mcNumber: e.target.value })
              }
              placeholder='e.g. MC123456'
              required={
                formData.entityType === 'carrier' ||
                formData.entityType === 'driver'
              }
            />
            {(formData.entityType === 'carrier' ||
              formData.entityType === 'driver') && (
              <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                <span className='font-medium text-yellow-700 dark:text-yellow-400'>
                  IMPORTANT:
                </span>{' '}
                Carriers/drivers with 60+ days overdue payments will
                automatically have negative reviews posted to their MC on
                BROKERSNAPSHOT.
              </p>
            )}
          </div>
        )}

        {/* Invoice Information */}
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Invoice Number
            </label>
            <input
              type='text'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              value={formData.invoiceNumber}
              onChange={(e) =>
                setFormData({ ...formData, invoiceNumber: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Invoice Amount
            </label>
            <input
              type='number'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              value={formData.invoiceAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  invoiceAmount: Number(e.target.value),
                })
              }
              required
            />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Invoice Date
            </label>
            <input
              type='date'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              value={formData.invoiceDate}
              onChange={(e) =>
                setFormData({ ...formData, invoiceDate: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Due Date
            </label>
            <input
              type='date'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              value={formData.dueDate}
              onChange={(e) => handleDueDateChange(e.target.value)}
              required
            />
          </div>
        </div>

        {formData.daysOverdue > 0 && (
          <div className='rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-900/30 dark:bg-red-900/20'>
            <p className='text-red-700 dark:text-red-400'>
              <strong>Days Overdue: {formData.daysOverdue}</strong>
            </p>
          </div>
        )}

        {/* Priority */}
        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Priority
          </label>
          <select
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value as any })
            }
            required
          >
            <option value='low'>Low (1-30 days late)</option>
            <option value='medium'>Medium (31-60 days late)</option>
            <option value='high'>High (60+ days late)</option>
          </select>
        </div>

        {/* Previous Contact Attempts */}
        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Previous Contact Attempts
          </label>
          <textarea
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            value={formData.contactAttempts}
            onChange={(e) =>
              setFormData({ ...formData, contactAttempts: e.target.value })
            }
            rows={3}
            placeholder='Describe any previous attempts to collect this payment...'
          />
        </div>

        {/* Legal Details Toggle */}
        <div>
          <button
            type='button'
            onClick={() => setShowLegalDetails(!showLegalDetails)}
            className='inline-flex items-center text-blue-600 dark:text-blue-400'
          >
            <span className='mr-2'>{showLegalDetails ? '▼' : '►'}</span>
            <span>Legal & Contract Details</span>
            <span className='ml-2 text-xs text-gray-500'>
              (Required for legal enforcement)
            </span>
          </button>
        </div>

        {/* Legal Details Section */}
        {showLegalDetails && (
          <div className='rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/20'>
            <h3 className='mb-3 text-lg font-medium text-blue-800 dark:text-blue-300'>
              Legal Backing
            </h3>

            <div className='space-y-3'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Contract Reference
                </label>
                <input
                  type='text'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  value={formData.contractReference}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contractReference: e.target.value,
                    })
                  }
                  placeholder='e.g. MSA-2023-001 or Contract dated MM/DD/YYYY'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Payment Terms
                </label>
                <select
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  value={formData.paymentTerms}
                  onChange={(e) => handlePaymentTermsChange(e.target.value)}
                >
                  {Object.keys(STANDARD_PAYMENT_TERMS).map((term) => (
                    <option key={term} value={term}>
                      {term} -{' '}
                      {
                        STANDARD_PAYMENT_TERMS[
                          term as keyof typeof STANDARD_PAYMENT_TERMS
                        ].description
                      }
                    </option>
                  ))}
                  <option value='custom'>Custom Terms</option>
                </select>
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Late Fee Percentage (monthly)
                </label>
                <div className='flex items-center'>
                  <input
                    type='number'
                    step='0.01'
                    min='0'
                    max='10'
                    className='mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    value={formData.lateFeePercentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lateFeePercentage: parseFloat(e.target.value),
                      })
                    }
                  />
                  <span className='ml-2'>% per month</span>

                  {formData.daysOverdue > 0 &&
                    formData.lateFeePercentage > 0 && (
                      <div className='ml-4 text-red-600 dark:text-red-400'>
                        Estimated accrued late fees: $
                        {(
                          formData.invoiceAmount *
                          (formData.lateFeePercentage / 100) *
                          Math.ceil(formData.daysOverdue / 30)
                        ).toFixed(2)}
                      </div>
                    )}
                </div>
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Legal Notes
                </label>
                <textarea
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  value={formData.legalNotes}
                  onChange={(e) =>
                    setFormData({ ...formData, legalNotes: e.target.value })
                  }
                  rows={2}
                  placeholder='Add any legal notes or references to contract clauses regarding late payments...'
                />
              </div>

              <div className='rounded-md bg-yellow-50 p-3 text-sm dark:bg-yellow-900/20'>
                <p className='font-medium text-yellow-800 dark:text-yellow-300'>
                  Important Legal Notice
                </p>
                <p className='text-yellow-700 dark:text-yellow-400'>
                  Adding these legal details ensures that any collection efforts
                  are properly documented and legally enforceable. Make sure all
                  information provided is accurate and verifiable.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Additional Notes
          </label>
          <textarea
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            placeholder='Provide any additional context about this late payment...'
          />
        </div>

        {/* Form Actions */}
        <div className='flex justify-end space-x-4'>
          <button
            type='button'
            onClick={onCancel}
            className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>
      </form>
    </div>
  );
}
