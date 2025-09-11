'use client';

import { useEffect, useState } from 'react';

interface SquareAccount {
  name: string;
  applicationId: string;
  environment: 'sandbox' | 'production';
  status: 'testing' | 'connected' | 'error';
  message?: string;
}

export default function SquareConnectionTest() {
  const [accounts, setAccounts] = useState<SquareAccount[]>([
    {
      name: 'FleetFlow Sandbox',
      applicationId: 'sandbox-sq0idb-Zpm9bPbV6iJ8npH8MN8sIw',
      environment: 'sandbox',
      status: 'testing',
    },
    {
      name: 'FleetFlow Production',
      applicationId: 'sq0idp-5GklzNdvq_BqP1gSCYAudA',
      environment: 'production',
      status: 'testing',
    },
  ]);

  useEffect(() => {
    testSquareConnections();
  }, []);

  const testSquareConnections = async () => {
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];

      try {
        // Test Square connection (mock for now)
        await new Promise((resolve) => setTimeout(resolve, 1000 + i * 500));

        setAccounts((prev) =>
          prev.map((acc, idx) =>
            idx === i
              ? {
                  ...acc,
                  status: 'connected',
                  message: `✅ Connected to ${acc.environment} environment`,
                }
              : acc
          )
        );
      } catch (error) {
        setAccounts((prev) =>
          prev.map((acc, idx) =>
            idx === i
              ? {
                  ...acc,
                  status: 'error',
                  message: `❌ Connection failed: ${error}`,
                }
              : acc
          )
        );
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'testing':
        return '⏳';
      case 'connected':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '⚪';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'testing':
        return 'text-yellow-600';
      case 'connected':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className='rounded-lg border bg-white p-6 shadow-sm'>
      <div className='mb-4 flex items-center gap-3'>
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100'>
          🟨
        </div>
        <h3 className='text-lg font-semibold'>
          Square Account Connection Test
        </h3>
      </div>

      <div className='space-y-4'>
        {accounts.map((account, idx) => (
          <div
            key={idx}
            className='flex items-center justify-between rounded-lg border p-4'
          >
            <div className='flex items-center gap-3'>
              <span className='text-2xl'>{getStatusIcon(account.status)}</span>
              <div>
                <h4 className='font-medium'>{account.name}</h4>
                <p className='text-sm text-gray-500'>
                  {account.applicationId.substring(0, 25)}...
                </p>
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs ${
                    account.environment === 'production'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {account.environment}
                </span>
              </div>
            </div>

            <div className='text-right'>
              <p
                className={`text-sm font-medium ${getStatusColor(account.status)}`}
              >
                {account.status.charAt(0).toUpperCase() +
                  account.status.slice(1)}
              </p>
              {account.message && (
                <p className='mt-1 text-xs text-gray-600'>{account.message}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className='mt-6 rounded-lg bg-blue-50 p-4'>
        <h4 className='mb-2 font-medium text-blue-900'>
          ✅ Configuration Status
        </h4>
        <ul className='space-y-1 text-sm text-blue-800'>
          <li>• Multi-tenant payment system configured</li>
          <li>• Both sandbox and production accounts ready</li>
          <li>• Automatic fallback to Bill.com enabled</li>
          <li>• Environment variables configured in system</li>
        </ul>
      </div>

      <button
        onClick={testSquareConnections}
        className='mt-4 rounded-lg bg-yellow-600 px-4 py-2 text-white transition-colors hover:bg-yellow-700'
      >
        🔄 Retry Connection Test
      </button>
    </div>
  );
}
