'use client'

import { useState } from 'react'
import { getCurrentUser, getAvailableDispatchers, getBrokersWithoutDispatcher, getBrokersByDispatcher, assignDispatcherToBroker, User } from '../config/access'

export default function DispatcherAssignment() {
  const [selectedBroker, setSelectedBroker] = useState<string>('')
  const [selectedDispatcher, setSelectedDispatcher] = useState<string>('')
  const [assignmentStatus, setAssignmentStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const { user, permissions } = getCurrentUser()
  const availableDispatchers = getAvailableDispatchers()
  const brokersWithoutDispatcher = getBrokersWithoutDispatcher()

  const handleAssignment = () => {
    if (!selectedBroker || !selectedDispatcher) {
      setAssignmentStatus('error')
      setStatusMessage('Please select both a broker and dispatcher')
      return
    }

    const success = assignDispatcherToBroker(selectedBroker, selectedDispatcher)
    
    if (success) {
      setAssignmentStatus('success')
      setStatusMessage('Dispatcher assigned successfully!')
      setSelectedBroker('')
      setSelectedDispatcher('')
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setAssignmentStatus('idle')
        setStatusMessage('')
      }, 3000)
    } else {
      setAssignmentStatus('error')
      setStatusMessage('Failed to assign dispatcher')
    }
  }

  if (!permissions.canAssignDispatcher) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800 font-semibold">Access Restricted</div>
        <div className="text-red-600">You don't have permission to assign dispatchers.</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <span className="mr-2">👥</span>
        Dispatcher Assignment
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assignment Form */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Assign New Dispatcher</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Broker
            </label>
            <select
              value={selectedBroker}
              onChange={(e) => setSelectedBroker(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a broker...</option>
              {brokersWithoutDispatcher.map((broker) => (
                <option key={broker.id} value={broker.id}>
                  {broker.name} ({broker.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Dispatcher
            </label>
            <select
              value={selectedDispatcher}
              onChange={(e) => setSelectedDispatcher(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a dispatcher...</option>
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
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Assign Dispatcher
          </button>

          {assignmentStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="text-green-800 font-semibold">✓ Success</div>
              <div className="text-green-700">{statusMessage}</div>
            </div>
          )}

          {assignmentStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="text-red-800 font-semibold">✗ Error</div>
              <div className="text-red-700">{statusMessage}</div>
            </div>
          )}
        </div>

        {/* Current Assignments */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Current Assignments</h3>
          
          <div className="space-y-3">
            {availableDispatchers.map((dispatcher) => {
              const assignedBrokers = getBrokersByDispatcher(dispatcher.id)
              return (
                <div key={dispatcher.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="font-semibold text-gray-900 flex items-center">
                    <span className="mr-2">📋</span>
                    {dispatcher.name}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{dispatcher.email}</div>
                  
                  {assignedBrokers.length > 0 ? (
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-700">Assigned Brokers:</div>
                      {assignedBrokers.map((broker) => (
                        <div key={broker.id} className="text-sm text-blue-600 flex items-center">
                          <span className="mr-1">🏢</span>
                          {broker.name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">No brokers assigned</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Unassigned Brokers Alert */}
      {brokersWithoutDispatcher.length > 0 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-yellow-800 font-semibold mb-2">
            ⚠️ Brokers Without Dispatchers ({brokersWithoutDispatcher.length})
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {brokersWithoutDispatcher.map((broker) => (
              <div key={broker.id} className="text-sm text-yellow-700">
                • {broker.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
