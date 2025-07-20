'use client';

import React, { useState, useEffect } from 'react';
import { StripeService, FLEETFLOW_PRICING_PLANS, type SubscriptionPlan } from '../services/stripe/StripeService';

interface BillingData {
  currentPlan: {
    name: string;
    price: number;
    nextBilling: string;
    status: 'active' | 'past_due' | 'canceled';
  };
  usage: {
    drivers: { current: number; limit: number | 'unlimited' };
    apiCalls: { current: number; limit: number };
    dataExports: { current: number; limit: number };
    smsMessages: { current: number; limit: number };
  };
  invoices: Array<{
    id: string;
    amount: number;
    date: string;
    status: 'paid' | 'pending' | 'failed';
    downloadUrl?: string;
  }>;
}

const BillingDashboard: React.FC = () => {
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [stripeService, setStripeService] = useState<StripeService | null>(null);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      setLoading(true);
      
      // Initialize StripeService only when needed and handle errors gracefully
      if (!stripeService) {
        try {
          const service = new StripeService();
          setStripeService(service);
        } catch (error) {
          console.warn('StripeService not available:', error);
          // Continue with mock data if Stripe is not configured
        }
      }
      
      // TODO: Replace with actual API call to get user's billing data
      const mockData: BillingData = {
        currentPlan: {
          name: 'TMS Professional + Data Consortium Pro',
          price: 798,
          nextBilling: 'August 9, 2025',
          status: 'active',
        },
        usage: {
          drivers: { current: 47, limit: 50 },
          apiCalls: { current: 2847, limit: 10000 },
          dataExports: { current: 12, limit: 50 },
          smsMessages: { current: 156, limit: 500 },
        },
        invoices: [
          {
            id: 'INV-2025-007',
            amount: 798,
            date: '2025-07-09',
            status: 'pending',
          },
          {
            id: 'INV-2025-006',
            amount: 798,
            date: '2025-06-09',
            status: 'paid',
            downloadUrl: '/api/invoices/INV-2025-006/download',
          },
          {
            id: 'INV-2025-005',
            amount: 798,
            date: '2025-05-09',
            status: 'paid',
            downloadUrl: '/api/invoices/INV-2025-005/download',
          },
        ],
      };
      setBillingData(mockData);
    } catch (error) {
      console.error('Error loading billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = async (planId: string) => {
    try {
      setLoading(true);
      // TODO: Implement plan change logic
      console.log('Changing to plan:', planId);
      // await stripeService.updateSubscription(subscriptionId, newPlanItems);
      await loadBillingData();
    } catch (error) {
      console.error('Error changing plan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !billingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscriptions</h1>
        <p className="text-gray-600">Manage your FleetFlow subscription, billing, and usage</p>
      </div>

      {/* Current Plan Overview */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg text-white p-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">{billingData.currentPlan.name}</h2>
            <p className="text-xl opacity-90">${billingData.currentPlan.price}/month</p>
            <p className="opacity-75 mt-2">Next billing: {billingData.currentPlan.nextBilling}</p>
          </div>
          <div className="text-right">
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              billingData.currentPlan.status === 'active' ? 'bg-green-500' :
              billingData.currentPlan.status === 'past_due' ? 'bg-yellow-500' : 'bg-red-500'
            }`}>
              {billingData.currentPlan.status.replace('_', ' ').toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Usage Meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <UsageMeter
          title="Drivers"
          current={billingData.usage.drivers.current}
          limit={billingData.usage.drivers.limit}
          unit="drivers"
        />
        <UsageMeter
          title="API Calls"
          current={billingData.usage.apiCalls.current}
          limit={billingData.usage.apiCalls.limit}
          unit="calls"
        />
        <UsageMeter
          title="Data Exports"
          current={billingData.usage.dataExports.current}
          limit={billingData.usage.dataExports.limit}
          unit="exports"
        />
        <UsageMeter
          title="SMS Messages"
          current={billingData.usage.smsMessages.current}
          limit={billingData.usage.smsMessages.limit}
          unit="messages"
        />
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Plans</h2>
        
        {/* TMS Plans */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">TMS Platform</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(FLEETFLOW_PRICING_PLANS)
              .filter(plan => plan.category === 'TMS')
              .map(plan => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onSelect={() => handlePlanChange(plan.id)}
                  isSelected={selectedPlan === plan.id}
                />
              ))}
          </div>
        </div>

        {/* Data Consortium Plans */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🌐 Data Consortium <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full ml-2">REVOLUTIONARY</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(FLEETFLOW_PRICING_PLANS)
              .filter(plan => plan.category === 'CONSORTIUM')
              .map(plan => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onSelect={() => handlePlanChange(plan.id)}
                  isSelected={selectedPlan === plan.id}
                  highlight={plan.id === 'consortium_professional'}
                />
              ))}
          </div>
        </div>

        {/* Compliance Plans */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">DOT Compliance Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(FLEETFLOW_PRICING_PLANS)
              .filter(plan => plan.category === 'COMPLIANCE')
              .map(plan => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onSelect={() => handlePlanChange(plan.id)}
                  isSelected={selectedPlan === plan.id}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {billingData.invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.downloadUrl && (
                      <a
                        href={invoice.downloadUrl}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Download
                      </a>
                    )}
                    {invoice.status === 'pending' && (
                      <button className="text-green-600 hover:text-green-900 font-medium ml-4">
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Methods</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                VISA
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Expires 12/2027</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Edit
              </button>
              <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                Remove
              </button>
            </div>
          </div>
          <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors">
            + Add Payment Method
          </button>
        </div>
      </div>
    </div>
  );
};

interface UsageMeterProps {
  title: string;
  current: number;
  limit: number | 'unlimited';
  unit: string;
}

const UsageMeter: React.FC<UsageMeterProps> = ({ title, current, limit, unit }) => {
  const percentage = limit === 'unlimited' ? 0 : (current / (limit as number)) * 100;
  const isOverLimit = limit !== 'unlimited' && current > (limit as number);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {current.toLocaleString()} {unit}
          </span>
          <span className="text-gray-600">
            {limit === 'unlimited' ? 'Unlimited' : `${(limit as number).toLocaleString()} limit`}
          </span>
        </div>
        {limit !== 'unlimited' && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isOverLimit ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        )}
        {isOverLimit && (
          <p className="text-red-600 text-xs">Over limit - additional charges may apply</p>
        )}
      </div>
    </div>
  );
};

interface PlanCardProps {
  plan: SubscriptionPlan;
  onSelect: () => void;
  isSelected: boolean;
  highlight?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect, isSelected, highlight = false }) => {
  return (
    <div className={`border rounded-lg p-6 transition-all duration-200 cursor-pointer ${
      highlight ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
    } ${isSelected ? 'ring-2 ring-blue-500' : ''}`} onClick={onSelect}>
      {highlight && (
        <div className="text-center mb-4">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            MOST POPULAR
          </span>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <div className="text-3xl font-bold text-gray-900">
          ${plan.price}
          <span className="text-lg font-normal text-gray-600">/{plan.interval}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
        highlight
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-900 text-white hover:bg-gray-800'
      }`}>
        {isSelected ? 'Current Plan' : 'Select Plan'}
      </button>
    </div>
  );
};

export default BillingDashboard;
