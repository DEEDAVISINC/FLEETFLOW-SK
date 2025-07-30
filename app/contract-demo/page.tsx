'use client';

import { useState } from 'react';
import {
  contractGenerationService,
  LeadContractData,
} from '../services/ContractGenerationService';

export default function ContractDemoPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const demoContractData: LeadContractData = {
    leadId: `LEAD-${Date.now()}`,
    brokerId: 'BROKER-001',
    brokerName: 'John Smith',
    brokerCompany: 'Smith Logistics LLC',
    shipperId: 'SHIPPER-001',
    shipperName: 'Sarah Johnson',
    shipperCompany: 'Johnson Manufacturing Co.',
    source: 'fmcsa',
    potentialValue: 50000,
    conversionType: 'quote_accepted',
    tenantId: 'demo-tenant-001',
    contractTerms: {
      commissionRate: 5.0,
      paymentTerms: 'Net 15 days',
      contractDuration: '1 year with auto-renewal',
      exclusivity: false,
      territory: 'United States',
    },
  };

  const handleGenerateContract = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      console.log('Generating contract with data:', demoContractData);

      const contract =
        await contractGenerationService.generateLeadContract(demoContractData);

      setResult({
        success: true,
        contract,
        message: 'Contract generated successfully!',
      });

      console.log('Contract generated:', contract);
    } catch (error: any) {
      console.error('Contract generation failed:', error);
      setError(error.message || 'Failed to generate contract');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackRevenue = async () => {
    if (!result?.contract) {
      setError('No contract available. Generate a contract first.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const revenue = 15000;
      const transactionId = `TXN-${Date.now()}`;

      await contractGenerationService.trackRevenue(
        result.contract.contractId,
        revenue,
        transactionId
      );

      setResult((prev) => ({
        ...prev,
        revenueTracked: {
          revenue,
          commission: revenue * 0.05,
          transactionId,
        },
        message: 'Revenue tracked successfully!',
      }));
    } catch (error: any) {
      console.error('Revenue tracking failed:', error);
      setError(error.message || 'Failed to track revenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
        <div className='rounded-lg bg-white p-8 shadow-lg'>
          <div className='mb-8 text-center'>
            <h1 className='mb-4 text-3xl font-bold text-gray-900'>
              📄 Contract Generation Demo
            </h1>
            <p className='text-gray-600'>
              Test the automated contract generation system for FleetFlow lead
              conversions
            </p>
          </div>

          {/* Demo Controls */}
          <div className='space-y-6'>
            <div className='rounded-lg border border-blue-200 bg-blue-50 p-6'>
              <h3 className='mb-4 text-lg font-semibold text-blue-900'>
                🎯 Demo Contract Data
              </h3>
              <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-2'>
                <div>
                  <span className='font-medium text-blue-800'>Lead ID:</span>{' '}
                  {demoContractData.leadId}
                </div>
                <div>
                  <span className='font-medium text-blue-800'>Broker:</span>{' '}
                  {demoContractData.brokerName} (
                  {demoContractData.brokerCompany})
                </div>
                <div>
                  <span className='font-medium text-blue-800'>Shipper:</span>{' '}
                  {demoContractData.shipperName} (
                  {demoContractData.shipperCompany})
                </div>
                <div>
                  <span className='font-medium text-blue-800'>Source:</span>{' '}
                  {demoContractData.source}
                </div>
                <div>
                  <span className='font-medium text-blue-800'>
                    Potential Value:
                  </span>{' '}
                  ${demoContractData.potentialValue.toLocaleString()}
                </div>
                <div>
                  <span className='font-medium text-blue-800'>
                    Commission Rate:
                  </span>{' '}
                  {demoContractData.contractTerms?.commissionRate}%
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col gap-4 sm:flex-row'>
              <button
                onClick={handleGenerateContract}
                disabled={loading}
                className='flex-1 rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {loading ? 'Generating...' : '🚀 Generate Contract'}
              </button>

              {result?.contract && (
                <button
                  onClick={handleTrackRevenue}
                  disabled={loading}
                  className='flex-1 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {loading ? 'Tracking...' : '💰 Track Revenue ($15,000)'}
                </button>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
                <div className='flex'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-5 w-5 text-red-400'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <div className='ml-3'>
                    <h3 className='text-sm font-medium text-red-800'>Error</h3>
                    <div className='mt-2 text-sm text-red-700'>{error}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Success Display */}
            {result && (
              <div className='rounded-lg border border-green-200 bg-green-50 p-6'>
                <div className='flex'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-5 w-5 text-green-400'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <div className='ml-3'>
                    <h3 className='text-sm font-medium text-green-800'>
                      Success!
                    </h3>
                    <div className='mt-2 text-sm text-green-700'>
                      {result.message}
                    </div>
                  </div>
                </div>

                {/* Contract Details */}
                {result.contract && (
                  <div className='mt-6'>
                    <h4 className='mb-4 text-lg font-semibold text-green-900'>
                      Generated Contract Details
                    </h4>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <div>
                        <h5 className='mb-2 font-medium text-green-800'>
                          Contract Information
                        </h5>
                        <dl className='space-y-1 text-sm'>
                          <div>
                            <dt className='text-green-700'>Contract ID:</dt>
                            <dd className='font-mono text-green-900'>
                              {result.contract.contractId}
                            </dd>
                          </div>
                          <div>
                            <dt className='text-green-700'>Contract Number:</dt>
                            <dd className='text-green-900'>
                              {result.contract.contractNumber}
                            </dd>
                          </div>
                          <div>
                            <dt className='text-green-700'>Status:</dt>
                            <dd className='text-green-900'>
                              {result.contract.status}
                            </dd>
                          </div>
                          <div>
                            <dt className='text-green-700'>Commission Rate:</dt>
                            <dd className='text-green-900'>
                              {result.contract.terms.commissionRate}%
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <div>
                        <h5 className='mb-2 font-medium text-green-800'>
                          Revenue Tracking
                        </h5>
                        <dl className='space-y-1 text-sm'>
                          <div>
                            <dt className='text-green-700'>Total Revenue:</dt>
                            <dd className='text-green-900'>
                              $
                              {result.contract.revenueTracking.totalRevenue.toLocaleString()}
                            </dd>
                          </div>
                          <div>
                            <dt className='text-green-700'>
                              Commission Earned:
                            </dt>
                            <dd className='text-green-900'>
                              $
                              {result.contract.revenueTracking.commissionEarned.toLocaleString()}
                            </dd>
                          </div>
                          <div>
                            <dt className='text-green-700'>Next Payment:</dt>
                            <dd className='text-green-900'>
                              {new Date(
                                result.contract.revenueTracking.nextPaymentDate
                              ).toLocaleDateString()}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    {/* Revenue Tracking Result */}
                    {result.revenueTracked && (
                      <div className='mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4'>
                        <h5 className='mb-2 font-medium text-blue-800'>
                          Revenue Tracking Result
                        </h5>
                        <dl className='space-y-1 text-sm'>
                          <div>
                            <dt className='text-blue-700'>Revenue Tracked:</dt>
                            <dd className='text-blue-900'>
                              ${result.revenueTracked.revenue.toLocaleString()}
                            </dd>
                          </div>
                          <div>
                            <dt className='text-blue-700'>
                              Commission Calculated:
                            </dt>
                            <dd className='text-blue-900'>
                              $
                              {result.revenueTracked.commission.toLocaleString()}
                            </dd>
                          </div>
                          <div>
                            <dt className='text-blue-700'>Transaction ID:</dt>
                            <dd className='font-mono text-blue-900'>
                              {result.revenueTracked.transactionId}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Contract Terms Preview */}
            {result?.contract && (
              <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
                <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                  📋 Contract Terms Preview
                </h3>
                <div className='space-y-4'>
                  <div>
                    <h4 className='mb-2 font-medium text-gray-800'>
                      Penalty Clauses
                    </h4>
                    <ul className='space-y-1 text-sm text-gray-600'>
                      {result.contract.terms.penaltyClauses
                        .slice(0, 3)
                        .map((clause, index) => (
                          <li key={index} className='flex items-start'>
                            <span className='mr-2 text-red-500'>•</span>
                            <span>{clause.substring(0, 100)}...</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className='mb-2 font-medium text-gray-800'>
                      Termination Clauses
                    </h4>
                    <ul className='space-y-1 text-sm text-gray-600'>
                      {result.contract.terms.terminationClauses
                        .slice(0, 2)
                        .map((clause, index) => (
                          <li key={index} className='flex items-start'>
                            <span className='mr-2 text-orange-500'>•</span>
                            <span>{clause.substring(0, 100)}...</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className='mt-8 border-t border-gray-200 pt-6'>
            <div className='flex flex-col gap-4 sm:flex-row'>
              <a
                href='/contracts'
                className='rounded-lg bg-blue-600 px-6 py-3 text-center font-medium text-white hover:bg-blue-700'
              >
                📄 View All Contracts
              </a>
              <a
                href='/ai-flow'
                className='rounded-lg bg-purple-600 px-6 py-3 text-center font-medium text-white hover:bg-purple-700'
              >
                🤖 AI Flow Platform
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
