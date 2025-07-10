'use client';

import React, { useState, useEffect } from 'react';
import { checkPermission, ACCESS_MESSAGES } from '../config/access';

// Access Control Component
const AccessRestricted = () => (
  <div style={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  }}>
    <div style={{
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '40px 32px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      maxWidth: '400px',
      width: '100%'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔒</div>
      <h1 style={{ 
        fontSize: '1.8rem', 
        fontWeight: 'bold', 
        color: 'white', 
        marginBottom: '16px' 
      }}>Access Restricted</h1>
      <p style={{ 
        color: 'rgba(255, 255, 255, 0.9)', 
        marginBottom: '16px',
        lineHeight: '1.6'
      }}>
        You need appropriate permissions to access the accounting section.
      </p>
      <p style={{ 
        fontSize: '0.9rem', 
        color: 'rgba(255, 255, 255, 0.7)', 
        marginBottom: '24px' 
      }}>
        Contact your administrator for access to financial data.
      </p>
      <button 
        onClick={() => window.history.back()}
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
        onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'translateY(-2px)'}
        onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'translateY(0)'}
      >
        Go Back
      </button>
    </div>
  </div>
);

// Data Interfaces
interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  outstandingReceivables: number;
  cashFlow: number;
  avgPaymentDays: number;
  collectionRate: number;
}

interface Settlement {
  id: string;
  type: 'driver' | 'carrier' | 'broker';
  entityName: string;
  amount: number;
  period: string;
  status: 'pending' | 'approved' | 'paid';
  dueDate: string;
}

interface ProfitabilityData {
  loadId: string;
  route: string;
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
  carrier: string;
  broker?: string;
}

// Role-based dashboard components
const BrokerFinancialView = ({ metrics, settlements }: { metrics: FinancialMetrics; settlements: Settlement[] }) => {
  const brokerSettlements = settlements.filter(s => s.type === 'broker');
  const totalCommissions = brokerSettlements.reduce((sum, s) => sum + s.amount, 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Total Commissions</p>
              <p className="text-2xl font-bold text-green-900">${totalCommissions.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">+12% from last month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Customer Payments</p>
              <p className="text-2xl font-bold text-blue-900">${metrics.outstandingReceivables.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <span className="text-2xl">💳</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-blue-600">Outstanding receivables</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Collection Rate</p>
              <p className="text-2xl font-bold text-purple-900">{metrics.collectionRate}%</p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-purple-600">Payment success rate</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Avg Payment Days</p>
              <p className="text-2xl font-bold text-orange-900">{metrics.avgPaymentDays}</p>
            </div>
            <div className="p-3 bg-orange-200 rounded-lg">
              <span className="text-2xl">⏱️</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-orange-600">Days to payment</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Commission Settlements</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {brokerSettlements.map((settlement) => (
                <tr key={settlement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{settlement.period}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ${settlement.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      settlement.status === 'paid' ? 'bg-green-100 text-green-800' :
                      settlement.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {settlement.status.charAt(0).toUpperCase() + settlement.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{settlement.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const DispatcherFinancialView = ({ metrics, profitability }: { metrics: FinancialMetrics; profitability: ProfitabilityData[] }) => {
  const avgLoadProfit = profitability.reduce((sum, load) => sum + load.profit, 0) / profitability.length || 0;
  const avgMargin = profitability.reduce((sum, load) => sum + load.margin, 0) / profitability.length || 0;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">Avg Load Profit</p>
              <p className="text-2xl font-bold text-emerald-900">${avgLoadProfit.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-emerald-200 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-emerald-600">Per load average</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-700">Profit Margin</p>
              <p className="text-2xl font-bold text-cyan-900">{avgMargin.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-cyan-200 rounded-lg">
              <span className="text-2xl">📈</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-cyan-600">Average margin</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-teal-700">Total Loads</p>
              <p className="text-2xl font-bold text-teal-900">{profitability.length}</p>
            </div>
            <div className="p-3 bg-teal-200 rounded-lg">
              <span className="text-2xl">🚛</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-teal-600">This period</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-700">Operating Ratio</p>
              <p className="text-2xl font-bold text-indigo-900">{((metrics.totalExpenses / metrics.totalRevenue) * 100).toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-indigo-200 rounded-lg">
              <span className="text-2xl">⚖️</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-indigo-600">Expenses/Revenue</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Load Profitability Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Load ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {profitability.slice(0, 10).map((load) => (
                <tr key={load.loadId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{load.loadId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{load.route}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${load.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${load.costs.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ${load.profit.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      load.margin > 15 ? 'bg-green-100 text-green-800' :
                      load.margin > 10 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {load.margin.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const DriverFinancialView = ({ settlements }: { settlements: Settlement[] }) => {
  const driverSettlements = settlements.filter(s => s.type === 'driver');
  const totalEarnings = driverSettlements.reduce((sum, s) => sum + s.amount, 0);
  const pendingPay = driverSettlements.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.amount, 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Total Earnings</p>
              <p className="text-2xl font-bold text-green-900">${totalEarnings.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <span className="text-2xl">💵</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">This month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Pending Pay</p>
              <p className="text-2xl font-bold text-yellow-900">${pendingPay.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-yellow-200 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-yellow-600">Awaiting settlement</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Average Per Load</p>
              <p className="text-2xl font-bold text-blue-900">${(totalEarnings / Math.max(driverSettlements.length, 1)).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-blue-600">Per load earnings</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Settlement History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {driverSettlements.map((settlement) => (
                <tr key={settlement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{settlement.period}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ${settlement.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      settlement.status === 'paid' ? 'bg-green-100 text-green-800' :
                      settlement.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {settlement.status.charAt(0).toUpperCase() + settlement.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{settlement.dueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg text-sm transition-colors">
                      📄 View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CarrierFinancialView = ({ metrics, settlements }: { metrics: FinancialMetrics; settlements: Settlement[] }) => {
  const carrierSettlements = settlements.filter(s => s.type === 'carrier');
  const totalReceivables = carrierSettlements.reduce((sum, s) => sum + s.amount, 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Total Receivables</p>
              <p className="text-2xl font-bold text-purple-900">${totalReceivables.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-purple-600">Outstanding payments</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-rose-700">Fleet Revenue</p>
              <p className="text-2xl font-bold text-rose-900">${metrics.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-rose-200 rounded-lg">
              <span className="text-2xl">🚛</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-rose-600">This month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-700">Operating Costs</p>
              <p className="text-2xl font-bold text-amber-900">${metrics.totalExpenses.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-amber-200 rounded-lg">
              <span className="text-2xl">💸</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-amber-600">Total expenses</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">Net Profit</p>
              <p className="text-2xl font-bold text-emerald-900">${metrics.netProfit.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-emerald-200 rounded-lg">
              <span className="text-2xl">📈</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-emerald-600">{metrics.profitMargin.toFixed(1)}% margin</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Status</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {carrierSettlements.map((settlement) => (
                <tr key={settlement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{settlement.period}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ${settlement.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      settlement.status === 'paid' ? 'bg-green-100 text-green-800' :
                      settlement.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {settlement.status.charAt(0).toUpperCase() + settlement.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{settlement.dueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg text-sm transition-colors">
                        📄 Invoice
                      </button>
                      <button className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-lg text-sm transition-colors">
                        💳 Pay
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default function AccountingPage() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'settlements' | 'reports'>('overview');
  const [userRole, setUserRole] = useState<'broker' | 'dispatcher' | 'driver' | 'carrier'>('dispatcher');

  // Check access permission
  if (!checkPermission('hasFinancialsAccess')) {
    return <AccessRestricted />;
  }

  // Mock data
  const mockMetrics: FinancialMetrics = {
    totalRevenue: 125800,
    totalExpenses: 89650,
    netProfit: 36150,
    profitMargin: 28.7,
    outstandingReceivables: 27350,
    cashFlow: 18500,
    avgPaymentDays: 18.5,
    collectionRate: 94.2
  };

  const mockSettlements: Settlement[] = [
    { id: '1', type: 'broker', entityName: 'John Smith', amount: 3200, period: 'Dec 2024', status: 'pending', dueDate: '2024-12-31' },
    { id: '2', type: 'driver', entityName: 'Mike Johnson', amount: 2800, period: 'Dec 2024', status: 'approved', dueDate: '2024-12-30' },
    { id: '3', type: 'carrier', entityName: 'ABC Transport', amount: 15000, period: 'Dec 2024', status: 'paid', dueDate: '2024-12-28' },
    { id: '4', type: 'broker', entityName: 'Sarah Wilson', amount: 2900, period: 'Dec 2024', status: 'paid', dueDate: '2024-12-25' },
    { id: '5', type: 'driver', entityName: 'Tom Davis', amount: 3100, period: 'Dec 2024', status: 'pending', dueDate: '2025-01-02' },
  ];

  const mockProfitability: ProfitabilityData[] = [
    { loadId: 'LD-001', route: 'Atlanta → Miami', revenue: 2450, costs: 1850, profit: 600, margin: 24.5, carrier: 'ABC Transport' },
    { loadId: 'LD-002', route: 'Chicago → Houston', revenue: 3200, costs: 2400, profit: 800, margin: 25.0, carrier: 'XYZ Logistics' },
    { loadId: 'LD-003', route: 'LA → Phoenix', revenue: 1850, costs: 1600, profit: 250, margin: 13.5, carrier: 'Quick Freight' },
    { loadId: 'LD-004', route: 'Dallas → Denver', revenue: 2800, costs: 2100, profit: 700, margin: 25.0, carrier: 'Reliable Haul' },
    { loadId: 'LD-005', route: 'Seattle → Portland', revenue: 1650, costs: 1200, profit: 450, margin: 27.3, carrier: 'Pacific Lines' },
  ];

  const renderRoleSpecificView = () => {
    switch (userRole) {
      case 'broker':
        return <BrokerFinancialView metrics={mockMetrics} settlements={mockSettlements} />;
      case 'dispatcher':
        return <DispatcherFinancialView metrics={mockMetrics} profitability={mockProfitability} />;
      case 'driver':
        return <DriverFinancialView settlements={mockSettlements} />;
      case 'carrier':
        return <CarrierFinancialView metrics={mockMetrics} settlements={mockSettlements} />;
      default:
        return <DispatcherFinancialView metrics={mockMetrics} profitability={mockProfitability} />;
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '80px 20px 20px 20px'
    }}>
      
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '40px 32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '16px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}>💰 FleetFlow Accounting</h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '24px',
            lineHeight: '1.6'
          }}>
            Comprehensive financial management and settlement tracking
          </p>
          
          {/* Role Selector */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {(['broker', 'dispatcher', 'driver', 'carrier'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setUserRole(role)}
                style={{
                  background: userRole === role 
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
                    : 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontWeight: userRole === role ? 'bold' : 'normal',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textTransform: 'capitalize'
                }}
                onMouseOver={(e) => {
                  if (userRole !== role) {
                    (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.3)';
                  }
                }}
                onMouseOut={(e) => {
                  if (userRole !== role) {
                    (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.2)';
                  }
                }}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center'
          }}>
            {[
              { key: 'overview', label: '📊 Financial Metrics', emoji: '📊' },
              { key: 'settlements', label: '💰 Settlements', emoji: '💰' },
              { key: 'reports', label: '📋 Reports', emoji: '📋' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                style={{
                  background: selectedTab === tab.key 
                    ? 'linear-gradient(135deg, #059669, #047857)'
                    : 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontWeight: selectedTab === tab.key ? 'bold' : 'normal',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '1rem'
                }}
                onMouseOver={(e) => {
                  if (selectedTab !== tab.key) {
                    (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.3)';
                    (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedTab !== tab.key) {
                    (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.2)';
                    (e.target as HTMLElement).style.transform = 'translateY(0)';
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          minHeight: '400px'
        }}>
          {selectedTab === 'overview' && renderRoleSpecificView()}
          {selectedTab === 'settlements' && <SettlementsView settlements={mockSettlements} />}
          {selectedTab === 'reports' && <ReportsView />}
        </div>
      </main>
    </div>
  );
}
        
        {/* Role Selector */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">View As:</label>
          <select 
            value={userRole} 
            onChange={(e) => setUserRole(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="broker">Broker</option>
            <option value="dispatcher">Dispatcher</option>
            <option value="driver">Driver</option>
            <option value="carrier">Carrier</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
        <nav className="-mb-px flex space-x-2 px-4">
          {[
            { id: 'overview', label: 'Financial Overview', icon: '📊', color: 'blue' },
            { id: 'settlements', label: 'Settlements', icon: '💳', color: 'green' },
            { id: 'reports', label: 'Reports', icon: '📋', color: 'purple' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`py-3 px-4 rounded-t-lg font-medium text-sm transition-all duration-200 border-b-2 ${
                selectedTab === tab.id
                  ? tab.color === 'blue' ? 'bg-blue-500 text-white border-blue-500 shadow-lg' :
                    tab.color === 'green' ? 'bg-green-500 text-white border-green-500 shadow-lg' :
                    'bg-purple-500 text-white border-purple-500 shadow-lg'
                  : `border-transparent text-gray-600 hover:text-gray-800 ${
                    tab.color === 'blue' ? 'hover:bg-blue-100 hover:border-blue-300' :
                    tab.color === 'green' ? 'hover:bg-green-100 hover:border-green-300' :
                    'hover:bg-purple-100 hover:border-purple-300'
                  }`
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && renderRoleSpecificView()}

      {selectedTab === 'settlements' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Settlement Management</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              ➕ Create Settlement
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockSettlements.map((settlement) => (
                  <tr key={settlement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        settlement.type === 'broker' ? 'bg-blue-100 text-blue-800' :
                        settlement.type === 'driver' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {settlement.type.charAt(0).toUpperCase() + settlement.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {settlement.entityName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{settlement.period}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${settlement.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        settlement.status === 'paid' ? 'bg-green-100 text-green-800' :
                        settlement.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {settlement.status.charAt(0).toUpperCase() + settlement.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg text-sm transition-colors">
                          📄 View
                        </button>
                        {settlement.status === 'pending' && (
                          <button className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-lg text-sm transition-colors">
                            ✅ Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedTab === 'reports' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Financial Reports</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">P&L Statement</h4>
                  <p className="text-sm text-gray-600">Profit and loss analysis</p>
                </div>
              </div>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                Generate Report
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Cash Flow</h4>
                  <p className="text-sm text-gray-600">Cash flow analysis</p>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Generate Report
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💳</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Settlement Summary</h4>
                  <p className="text-sm text-gray-600">Settlement analysis</p>
                </div>
              </div>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                Generate Report
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Tax Summary</h4>
                  <p className="text-sm text-gray-600">Tax preparation</p>
                </div>
              </div>
              <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors">
                Generate Report
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Profitability</h4>
                  <p className="text-sm text-gray-600">Load profitability</p>
                </div>
              </div>
              <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                Generate Report
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Customer Analysis</h4>
                  <p className="text-sm text-gray-600">Customer profitability</p>
                </div>
              </div>
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
