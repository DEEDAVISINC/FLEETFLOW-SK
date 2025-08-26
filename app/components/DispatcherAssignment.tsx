'use client';

import { useState } from 'react';
import {
  User,
  getAvailableDispatchers,
  getCurrentUser,
} from '../config/access';

// Mock functions for dispatcher assignment (due to import issue)
const getBrokersWithoutDispatcher = (): User[] => {
  return [
    {
      id: 'BRK-001',
      name: 'Michael Brown',
      role: 'broker',
      email: 'michael.brown@fleetflow.com',
      specialization: 'Food Grade Transportation',
    },
    {
      id: 'BRK-002',
      name: 'Sarah Wilson',
      role: 'broker',
      email: 'sarah.wilson@fleetflow.com',
      specialization: 'Automotive Parts',
    },
  ];
};

const getBrokersByDispatcher = (dispatcherId: string): User[] => {
  const mockAssignments: { [key: string]: User[] } = {
    'DSP-001': [
      {
        id: 'BRK-003',
        name: 'John Martinez',
        role: 'broker',
        email: 'john.martinez@fleetflow.com',
        specialization: 'Heavy Equipment',
      },
    ],
  };
  return mockAssignments[dispatcherId] || [];
};

const assignDispatcherToBroker = (
  brokerId: string,
  dispatcherId: string
): boolean => {
  console.log(`Assigning dispatcher ${dispatcherId} to broker ${brokerId}`);
  return true;
};

export default function DispatcherAssignment() {
  const [selectedBroker, setSelectedBroker] = useState<string>('');
  const [selectedDispatcher, setSelectedDispatcher] = useState<string>('');
  const [assignmentStatus, setAssignmentStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const { user, permissions } = getCurrentUser();
  const availableDispatchers = getAvailableDispatchers();
  const brokersWithoutDispatcher = getBrokersWithoutDispatcher();

  const handleAssignment = () => {
    if (!selectedBroker || !selectedDispatcher) {
      setAssignmentStatus('error');
      setStatusMessage('Please select both a broker and dispatcher');
      return;
    }

    const success = assignDispatcherToBroker(
      selectedBroker,
      selectedDispatcher
    );

    if (success) {
      setAssignmentStatus('success');
      setStatusMessage('Dispatcher assigned successfully!');
      setSelectedBroker('');
      setSelectedDispatcher('');

      // Reset status after 3 seconds
      setTimeout(() => {
        setAssignmentStatus('idle');
        setStatusMessage('');
      }, 3000);
    } else {
      setAssignmentStatus('error');
      setStatusMessage('Failed to assign dispatcher');
    }
  };

  if (!permissions.canAssignDispatcher) {
    return (
      <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
        <div className='font-semibold text-red-800'>Access Restricted</div>
        <div className='text-red-600'>
          You don't have permission to assign dispatchers.
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-lg bg-white p-6 shadow-lg'>
      <h2 className='mb-6 flex items-center text-xl font-bold text-gray-900'>
        <span className='mr-2'>👥</span>
        Dispatcher Assignment
      </h2>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Assignment Form */}
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold text-gray-800'>
            Assign New Dispatcher
          </h3>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Select Broker
            </label>
            <select
              value={selectedBroker}
              onChange={(e) => setSelectedBroker(e.target.value)}
              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            >
              <option value=''>Choose a broker...</option>
              {brokersWithoutDispatcher.map((broker) => (
                <option key={broker.id} value={broker.id}>
                  {broker.name} ({broker.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Select Dispatcher
            </label>
            <select
              value={selectedDispatcher}
              onChange={(e) => setSelectedDispatcher(e.target.value)}
              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            >
              <option value=''>Choose a dispatcher...</option>
              {availableDispatchers.map((dispatcher) => (
                <option key={dispatcher.id} value={dispatcher.id}>
                  {dispatcher.name} ({dispatcher.email})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAssignment}
            disabled={!selectedBroker || !selectedDispatcher}
            className='w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400'
          >
            Assign Dispatcher
          </button>

          {assignmentStatus === 'success' && (
            <div className='rounded-md border border-green-200 bg-green-50 p-3'>
              <div className='font-semibold text-green-800'>✓ Success</div>
              <div className='text-green-700'>{statusMessage}</div>
            </div>
          )}

          {assignmentStatus === 'error' && (
            <div className='rounded-md border border-red-200 bg-red-50 p-3'>
              <div className='font-semibold text-red-800'>✗ Error</div>
              <div className='text-red-700'>{statusMessage}</div>
            </div>
          )}
        </div>

        {/* Current Assignments */}
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold text-gray-800'>
            Current Assignments
          </h3>

          <div className='space-y-3'>
            {availableDispatchers.map((dispatcher) => {
              const assignedBrokers = getBrokersByDispatcher(dispatcher.id);
              return (
                <div
                  key={dispatcher.id}
                  className='rounded-lg border border-gray-200 p-4'
                >
                  <div className='flex items-center font-semibold text-gray-900'>
                    <span className='mr-2'>📋</span>
                    {dispatcher.name}
                  </div>
                  <div className='mb-2 text-sm text-gray-600'>
                    {dispatcher.email}
                  </div>

                  {assignedBrokers.length > 0 ? (
                    <div className='space-y-1'>
                      <div className='text-sm font-medium text-gray-700'>
                        Assigned Brokers:
                      </div>
                      {assignedBrokers.map((broker) => (
                        <div
                          key={broker.id}
                          className='flex items-center text-sm text-blue-600'
                        >
                          <span className='mr-1'>🏢</span>
                          {broker.name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='text-sm text-gray-500 italic'>
                      No brokers assigned
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Unassigned Brokers Alert */}
      {brokersWithoutDispatcher.length > 0 && (
        <div className='mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
          <div className='mb-2 font-semibold text-yellow-800'>
            ⚠️ Brokers Without Dispatchers ({brokersWithoutDispatcher.length})
          </div>
          <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
            {brokersWithoutDispatcher.map((broker) => (
              <div key={broker.id} className='text-sm text-yellow-700'>
                • {broker.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
