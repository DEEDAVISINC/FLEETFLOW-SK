'use client';

import { useEffect, useState } from 'react';
import { checkPermission, getCurrentUser } from '../../../config/access';
import {
  AISecurityAuditLog,
  AISecurityPolicy,
  aiSecurityService,
} from '../../../services/AISecurityService';

export default function AISecurityDashboard() {
  const { user } = getCurrentUser();
  const hasSecurityAccess = checkPermission('ai_security.admin');

  const [policies, setPolicies] = useState<AISecurityPolicy[]>([]);
  const [auditLogs, setAuditLogs] = useState<AISecurityAuditLog[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<AISecurityPolicy | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<'policies' | 'audit' | 'settings'>(
    'policies'
  );
  const [filterOptions, setFilterOptions] = useState({
    operation: '',
    startDate: '',
    endDate: '',
    allowed: undefined as boolean | undefined,
  });

  // Load policies and audit logs
  useEffect(() => {
    if (!hasSecurityAccess) return;

    // In a real implementation, these would be API calls
    // For now, we're using the service directly
    const allPolicies: AISecurityPolicy[] = [];

    // Get all policies from the service
    const brokerSnapshotPolicy = aiSecurityService.getPolicy(
      'policy_brokersnapshot_default'
    );
    if (brokerSnapshotPolicy) {
      allPolicies.push(brokerSnapshotPolicy);
    }

    setPolicies(allPolicies);

    // Get recent audit logs
    const logs = aiSecurityService.getAuditLogs({
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
    });
    setAuditLogs(logs);
  }, [hasSecurityAccess]);

  // Handle policy selection
  const handlePolicySelect = (policyId: string) => {
    const policy = aiSecurityService.getPolicy(policyId);
    if (policy) {
      setSelectedPolicy(policy);
    }
  };

  // Handle policy toggle (enable/disable)
  const handleTogglePolicy = (policyId: string, enabled: boolean) => {
    const success = aiSecurityService.updatePolicy(policyId, { enabled });
    if (success) {
      // Update the policies list
      const updatedPolicies = policies.map((policy) =>
        policy.id === policyId ? { ...policy, enabled } : policy
      );
      setPolicies(updatedPolicies);

      // Update selected policy if it's the one being toggled
      if (selectedPolicy && selectedPolicy.id === policyId) {
        setSelectedPolicy({ ...selectedPolicy, enabled });
      }
    }
  };

  // Filter audit logs
  const handleFilterAuditLogs = () => {
    const logs = aiSecurityService.getAuditLogs({
      operation: filterOptions.operation || undefined,
      startDate: filterOptions.startDate || undefined,
      endDate: filterOptions.endDate || undefined,
      allowed: filterOptions.allowed,
    });
    setAuditLogs(logs);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilterOptions({
      operation: '',
      startDate: '',
      endDate: '',
      allowed: undefined,
    });

    const logs = aiSecurityService.getAuditLogs({
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
    });
    setAuditLogs(logs);
  };

  if (!hasSecurityAccess) {
    return (
      <div className='p-8 text-center'>
        <h1 className='mb-4 text-2xl font-bold text-red-600'>Access Denied</h1>
        <p className='text-gray-700'>
          You do not have permission to access the AI Security Dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <h1 className='mb-6 text-2xl font-bold'>AI Security Dashboard</h1>

      {/* Tab Navigation */}
      <div className='mb-6 border-b border-gray-200'>
        <nav className='-mb-px flex'>
          <button
            onClick={() => setActiveTab('policies')}
            className={`mr-8 px-1 py-4 ${
              activeTab === 'policies'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Security Policies
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`mr-8 px-1 py-4 ${
              activeTab === 'audit'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Audit Logs
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-1 py-4 ${
              activeTab === 'settings'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Policies Tab */}
      {activeTab === 'policies' && (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          {/* Policies List */}
          <div className='rounded-lg bg-white p-4 shadow'>
            <h2 className='mb-4 text-lg font-semibold'>Security Policies</h2>
            <ul className='space-y-2'>
              {policies.map((policy) => (
                <li
                  key={policy.id}
                  className={`cursor-pointer rounded-md p-3 ${
                    selectedPolicy?.id === policy.id
                      ? 'bg-blue-100'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handlePolicySelect(policy.id)}
                >
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-medium'>{policy.name}</p>
                      <p className='text-sm text-gray-500'>{policy.id}</p>
                    </div>
                    <div className='flex items-center'>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          policy.enabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {policy.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy Details */}
          <div className='col-span-2 rounded-lg bg-white p-4 shadow'>
            {selectedPolicy ? (
              <div>
                <div className='mb-4 flex items-center justify-between'>
                  <h2 className='text-lg font-semibold'>
                    {selectedPolicy.name}
                  </h2>
                  <div className='flex items-center'>
                    <span className='mr-2 text-sm'>Status:</span>
                    <button
                      onClick={() =>
                        handleTogglePolicy(
                          selectedPolicy.id,
                          !selectedPolicy.enabled
                        )
                      }
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        selectedPolicy.enabled ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          selectedPolicy.enabled
                            ? 'translate-x-5'
                            : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <p className='mb-4 text-gray-600'>
                  {selectedPolicy.description}
                </p>

                <div className='mb-4'>
                  <h3 className='mb-2 font-medium'>Allowed Roles</h3>
                  <div className='flex flex-wrap gap-2'>
                    {selectedPolicy.allowedRoles.map((role) => (
                      <span
                        key={role}
                        className='rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800'
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div className='mb-4'>
                  <h3 className='mb-2 font-medium'>Allowed Operations</h3>
                  <div className='flex flex-wrap gap-2'>
                    {selectedPolicy.allowedOperations.map((operation) => (
                      <span
                        key={operation}
                        className='rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800'
                      >
                        {operation}
                      </span>
                    ))}
                  </div>
                </div>

                <div className='mb-4'>
                  <h3 className='mb-2 font-medium'>Data Access Restrictions</h3>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                          Data Type
                        </th>
                        <th className='px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                          Access Level
                        </th>
                        <th className='px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                          Masked Fields
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 bg-white'>
                      {selectedPolicy.dataAccessRestrictions.map(
                        (restriction, index) => (
                          <tr key={index}>
                            <td className='px-4 py-2 text-sm whitespace-nowrap'>
                              {restriction.dataType}
                            </td>
                            <td className='px-4 py-2 text-sm whitespace-nowrap'>
                              <span
                                className={`rounded-full px-2 py-1 text-xs ${
                                  restriction.accessLevel === 'full'
                                    ? 'bg-green-100 text-green-800'
                                    : restriction.accessLevel === 'none'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {restriction.accessLevel}
                              </span>
                            </td>
                            <td className='px-4 py-2 text-sm'>
                              {restriction.maskedFields?.join(', ') || 'None'}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                <div className='mb-4'>
                  <h3 className='mb-2 font-medium'>Prompt Validation Rules</h3>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                          Type
                        </th>
                        <th className='px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                          Description
                        </th>
                        <th className='px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                          Severity
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 bg-white'>
                      {selectedPolicy.promptValidationRules.map(
                        (rule, index) => (
                          <tr key={index}>
                            <td className='px-4 py-2 text-sm whitespace-nowrap'>
                              {rule.type}
                            </td>
                            <td className='px-4 py-2 text-sm'>
                              {rule.description}
                            </td>
                            <td className='px-4 py-2 text-sm whitespace-nowrap'>
                              <span
                                className={`rounded-full px-2 py-1 text-xs ${
                                  rule.severity === 'block'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {rule.severity}
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                <div className='mt-6 border-t pt-4'>
                  <div className='flex justify-between text-sm text-gray-500'>
                    <div>
                      Created:{' '}
                      {new Date(selectedPolicy.createdAt).toLocaleString()}
                    </div>
                    <div>
                      Last Updated:{' '}
                      {new Date(selectedPolicy.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='py-12 text-center text-gray-500'>
                <p>Select a policy to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'audit' && (
        <div>
          {/* Filter Controls */}
          <div className='mb-6 rounded-lg bg-white p-4 shadow'>
            <h2 className='mb-4 text-lg font-semibold'>Filter Audit Logs</h2>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Operation
                </label>
                <input
                  type='text'
                  className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  value={filterOptions.operation}
                  onChange={(e) =>
                    setFilterOptions({
                      ...filterOptions,
                      operation: e.target.value,
                    })
                  }
                  placeholder='e.g. brokersnapshot.review.post'
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Start Date
                </label>
                <input
                  type='date'
                  className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  value={filterOptions.startDate}
                  onChange={(e) =>
                    setFilterOptions({
                      ...filterOptions,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  End Date
                </label>
                <input
                  type='date'
                  className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  value={filterOptions.endDate}
                  onChange={(e) =>
                    setFilterOptions({
                      ...filterOptions,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Status
                </label>
                <select
                  className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  value={
                    filterOptions.allowed === undefined
                      ? ''
                      : filterOptions.allowed
                        ? 'allowed'
                        : 'blocked'
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilterOptions({
                      ...filterOptions,
                      allowed: value === '' ? undefined : value === 'allowed',
                    });
                  }}
                >
                  <option value=''>All</option>
                  <option value='allowed'>Allowed</option>
                  <option value='blocked'>Blocked</option>
                </select>
              </div>
            </div>
            <div className='mt-4 flex justify-end space-x-2'>
              <button
                onClick={handleResetFilters}
                className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50'
              >
                Reset
              </button>
              <button
                onClick={handleFilterAuditLogs}
                className='rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700'
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className='overflow-hidden rounded-lg bg-white shadow'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Timestamp
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    User
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Operation
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Data Types
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                    Issues
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white'>
                {auditLogs.map((log) => (
                  <tr key={log.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-500'>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-900'>
                      {log.userId}
                    </td>
                    <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-900'>
                      {log.operation}
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
                    <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-500'>
                      {log.dataTypesAccessed.join(', ')}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500'>
                      {log.warnings.length > 0 && (
                        <div className='text-yellow-600'>
                          <span className='font-medium'>Warnings:</span>{' '}
                          {log.warnings.join(', ')}
                        </div>
                      )}
                      {log.blockReasons.length > 0 && (
                        <div className='text-red-600'>
                          <span className='font-medium'>Blocked:</span>{' '}
                          {log.blockReasons.join(', ')}
                        </div>
                      )}
                      {log.warnings.length === 0 &&
                        log.blockReasons.length === 0 && (
                          <span className='text-green-600'>None</span>
                        )}
                    </td>
                  </tr>
                ))}
                {auditLogs.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className='px-6 py-4 text-center text-sm text-gray-500'
                    >
                      No audit logs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className='rounded-lg bg-white p-6 shadow'>
          <h2 className='mb-4 text-lg font-semibold'>AI Security Settings</h2>

          <div className='mb-6'>
            <h3 className='mb-2 font-medium'>Global Security Controls</h3>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Prompt Injection Protection</p>
                  <p className='text-sm text-gray-500'>
                    Detect and block attempts to manipulate AI systems through
                    prompt engineering
                  </p>
                </div>
                <div className='flex items-center'>
                  <button className='relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-green-500 transition-colors duration-200 ease-in-out focus:outline-none'>
                    <span className='inline-block h-5 w-5 translate-x-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out' />
                  </button>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Data Leakage Prevention</p>
                  <p className='text-sm text-gray-500'>
                    Automatically detect and redact sensitive information in
                    prompts and responses
                  </p>
                </div>
                <div className='flex items-center'>
                  <button className='relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-green-500 transition-colors duration-200 ease-in-out focus:outline-none'>
                    <span className='inline-block h-5 w-5 translate-x-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out' />
                  </button>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Comprehensive Audit Logging</p>
                  <p className='text-sm text-gray-500'>
                    Record all AI operations for compliance and security
                    monitoring
                  </p>
                </div>
                <div className='flex items-center'>
                  <button className='relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-green-500 transition-colors duration-200 ease-in-out focus:outline-none'>
                    <span className='inline-block h-5 w-5 translate-x-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out' />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='mb-6'>
            <h3 className='mb-2 font-medium'>Security Notification Settings</h3>
            <div className='space-y-4'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Security Alert Recipients
                </label>
                <input
                  type='text'
                  className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  defaultValue='security@fleetflowapp.com, admin@fleetflowapp.com'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Alert Severity Threshold
                </label>
                <select
                  className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  defaultValue='warning'
                >
                  <option value='info'>Info (All events)</option>
                  <option value='warning'>
                    Warning (Suspicious activities)
                  </option>
                  <option value='critical'>
                    Critical (Security violations only)
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div className='flex justify-end border-t pt-4'>
            <button className='rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700'>
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
