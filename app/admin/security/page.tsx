'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { checkPermission } from '../../config/access';
import { aiSecurityService } from '../../services/AISecurityService';

export default function SecurityOverview() {
  const [securityStats, setSecurityStats] = useState({
    totalPolicies: 0,
    activePolicies: 0,
    blockedOperations: 0,
    securityWarnings: 0,
    aiOperations: 0,
  });

  const hasAISecurityAccess = checkPermission('ai_security.view');

  useEffect(() => {
    // In a real implementation, this would be an API call
    // For now, we'll use the service directly

    // Get all policies from the service
    const brokerSnapshotPolicy = aiSecurityService.getPolicy(
      'policy_brokersnapshot_default'
    );
    const totalPolicies = brokerSnapshotPolicy ? 1 : 0;
    const activePolicies =
      brokerSnapshotPolicy && brokerSnapshotPolicy.enabled ? 1 : 0;

    // Get audit logs for stats
    const logs = aiSecurityService.getAuditLogs();
    const blockedOperations = logs.filter((log) => !log.allowed).length;
    const securityWarnings = logs.reduce(
      (count, log) => count + log.warnings.length,
      0
    );
    const aiOperations = logs.length;

    setSecurityStats({
      totalPolicies,
      activePolicies,
      blockedOperations,
      securityWarnings,
      aiOperations,
    });
  }, []);

  return (
    <div className='p-6'>
      <h1 className='mb-6 text-2xl font-bold'>Security Overview</h1>

      {/* Stats Cards */}
      <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-lg bg-white p-6 shadow'>
          <h2 className='text-sm font-medium tracking-wider text-gray-500 uppercase'>
            Security Status
          </h2>
          <p className='mt-2 text-3xl font-bold text-green-600'>Protected</p>
          <p className='mt-1 text-sm text-gray-500'>
            All security systems operational
          </p>
        </div>

        <div className='rounded-lg bg-white p-6 shadow'>
          <h2 className='text-sm font-medium tracking-wider text-gray-500 uppercase'>
            Active Policies
          </h2>
          <p className='mt-2 text-3xl font-bold text-blue-600'>
            {securityStats.activePolicies}/{securityStats.totalPolicies}
          </p>
          <p className='mt-1 text-sm text-gray-500'>
            Security policies enabled
          </p>
        </div>

        <div className='rounded-lg bg-white p-6 shadow'>
          <h2 className='text-sm font-medium tracking-wider text-gray-500 uppercase'>
            Blocked Operations
          </h2>
          <p className='mt-2 text-3xl font-bold text-red-600'>
            {securityStats.blockedOperations}
          </p>
          <p className='mt-1 text-sm text-gray-500'>
            Security violations prevented
          </p>
        </div>

        <div className='rounded-lg bg-white p-6 shadow'>
          <h2 className='text-sm font-medium tracking-wider text-gray-500 uppercase'>
            Security Warnings
          </h2>
          <p className='mt-2 text-3xl font-bold text-yellow-600'>
            {securityStats.securityWarnings}
          </p>
          <p className='mt-1 text-sm text-gray-500'>
            Potential issues identified
          </p>
        </div>
      </div>

      {/* Security Modules */}
      <h2 className='mb-4 text-xl font-semibold'>Security Modules</h2>
      <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <div className='overflow-hidden rounded-lg bg-white shadow'>
          <div className='p-6'>
            <h3 className='text-lg font-medium text-gray-900'>
              Access Control
            </h3>
            <p className='mt-1 text-sm text-gray-500'>
              Manage user roles, permissions, and access policies
            </p>
          </div>
          <div className='bg-gray-50 px-6 py-4'>
            <Link
              href='/admin/security/access-control'
              className='text-sm font-medium text-blue-600 hover:text-blue-500'
            >
              Manage Access Control →
            </Link>
          </div>
        </div>

        {hasAISecurityAccess && (
          <div className='overflow-hidden rounded-lg bg-white shadow'>
            <div className='p-6'>
              <h3 className='text-lg font-medium text-gray-900'>AI Security</h3>
              <p className='mt-1 text-sm text-gray-500'>
                Protect against prompt injection, data leakage, and AI misuse
              </p>
              <div className='mt-2'>
                <span className='inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800'>
                  {securityStats.aiOperations} operations protected
                </span>
              </div>
            </div>
            <div className='bg-gray-50 px-6 py-4'>
              <Link
                href='/admin/security/ai-security'
                className='text-sm font-medium text-blue-600 hover:text-blue-500'
              >
                Manage AI Security →
              </Link>
            </div>
          </div>
        )}

        <div className='overflow-hidden rounded-lg bg-white shadow'>
          <div className='p-6'>
            <h3 className='text-lg font-medium text-gray-900'>Audit Logs</h3>
            <p className='mt-1 text-sm text-gray-500'>
              Review security events, user actions, and system changes
            </p>
          </div>
          <div className='bg-gray-50 px-6 py-4'>
            <Link
              href='/admin/security/audit-logs'
              className='text-sm font-medium text-blue-600 hover:text-blue-500'
            >
              View Audit Logs →
            </Link>
          </div>
        </div>

        <div className='overflow-hidden rounded-lg bg-white shadow'>
          <div className='p-6'>
            <h3 className='text-lg font-medium text-gray-900'>Compliance</h3>
            <p className='mt-1 text-sm text-gray-500'>
              Ensure adherence to regulatory requirements and industry standards
            </p>
          </div>
          <div className='bg-gray-50 px-6 py-4'>
            <Link
              href='/admin/security/compliance'
              className='text-sm font-medium text-blue-600 hover:text-blue-500'
            >
              Manage Compliance →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Security Events */}
      <h2 className='mb-4 text-xl font-semibold'>Recent Security Events</h2>
      <div className='overflow-hidden rounded-lg bg-white shadow'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                Timestamp
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                Event
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                User
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                Status
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {/* Get the most recent 5 audit logs */}
            {aiSecurityService
              .getAuditLogs()
              .slice(0, 5)
              .map((log) => (
                <tr key={log.id}>
                  <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-500'>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-900'>
                    {log.operation}
                  </td>
                  <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-900'>
                    {log.userId}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        log.allowed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {log.allowed ? 'Allowed' : 'Blocked'}
                    </span>
                  </td>
                </tr>
              ))}
            {aiSecurityService.getAuditLogs().length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className='px-6 py-4 text-center text-sm text-gray-500'
                >
                  No security events found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className='bg-gray-50 px-6 py-4'>
          <Link
            href='/admin/security/audit-logs'
            className='text-sm font-medium text-blue-600 hover:text-blue-500'
          >
            View All Security Events →
          </Link>
        </div>
      </div>
    </div>
  );
}
