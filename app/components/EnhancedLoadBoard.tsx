'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser } from '../config/access'
import { getLoadsForUser, getLoadStats, Load } from '../services/loadService'

export default function EnhancedLoadBoard() {
  const [loads, setLoads] = useState<Load[]>([])
  const [filteredLoads, setFilteredLoads] = useState<Load[]>([])
  const [selectedTab, setSelectedTab] = useState<'all' | 'available' | 'assigned'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    assigned: 0,
    inTransit: 0,
    delivered: 0,
    unassigned: 0
  })

  const { user, permissions } = getCurrentUser()

  // Load data from service
  useEffect(() => {
    const loadData = getLoadsForUser()
    const loadStats = getLoadStats()
    
    setLoads(loadData)
    setFilteredLoads(loadData)
    setStats(loadStats)
  }, [])

  useEffect(() => {
    let filtered = loads

    // Filter by tab
    if (selectedTab === 'available') {
      filtered = filtered.filter(load => load.status === 'Available')
    } else if (selectedTab === 'assigned') {
      filtered = filtered.filter(load => ['Assigned', 'In Transit'].includes(load.status))
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(load => 
        load.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        load.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        load.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        load.brokerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (load.dispatcherName && load.dispatcherName.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredLoads(filtered)
  }, [loads, selectedTab, searchTerm])

  const refreshLoads = () => {
    const loadData = getLoadsForUser()
    const loadStats = getLoadStats()
    
    setLoads(loadData)
    setStats(loadStats)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Assigned':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'In Transit':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Delivered':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <span className="mr-2">📋</span>
            Load Board
          </h2>
          <div className="text-sm text-gray-600 mt-1">
            {user.role === 'dispatcher' && (
              <span>🔍 Viewing all loads from all brokers</span>
            )}
            {user.role === 'broker' && (
              <span>🏢 Viewing your loads only</span>
            )}
            {['manager', 'admin'].includes(user.role) && (
              <span>👑 Viewing all loads (management view)</span>
            )}
          </div>
        </div>
        
        <div className="mt-4 md:mt-0">
          <input
            type="text"
            placeholder="Search loads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6">
        {[
          { id: 'all', label: 'All Loads', count: loads.length },
          { id: 'available', label: 'Available', count: loads.filter(l => l.status === 'Available').length },
          { id: 'assigned', label: 'Assigned/Transit', count: loads.filter(l => ['Assigned', 'In Transit'].includes(l.status)).length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Load List */}
      <div className="space-y-4">
        {filteredLoads.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {loads.length === 0 ? 'No loads available' : 'No loads match your search criteria'}
          </div>
        ) : (
          filteredLoads.map((load) => (
            <div key={load.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Load Info */}
                  <div>
                    <div className="font-semibold text-lg text-gray-900">{load.id}</div>
                    {permissions.canViewAllLoads && (
                      <div className="text-sm text-blue-600">📊 {load.brokerName}</div>
                    )}
                    <div className="text-sm text-gray-600">{load.equipment}</div>
                  </div>

                  {/* Route */}
                  <div>
                    <div className="font-medium text-gray-900">{load.origin}</div>
                    <div className="text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      {load.destination}
                    </div>
                    <div className="text-sm text-gray-500">{load.distance}</div>
                  </div>

                  {/* Details */}
                  <div>
                    <div className="font-semibold text-green-600 text-lg">${load.rate.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{load.weight}</div>
                    <div className="text-xs text-gray-500">
                      Pick: {new Date(load.pickupDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Status & Dispatcher */}
                  <div className="flex flex-col space-y-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(load.status)}`}>
                      {load.status}
                    </span>
                    {load.dispatcherName && (
                      <div className="text-xs text-gray-600">
                        📋 {load.dispatcherName}
                      </div>
                    )}
                    {!load.dispatcherName && load.status === 'Available' && (
                      <div className="text-xs text-orange-600">
                        ⚠️ Needs Dispatcher
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 lg:mt-0 lg:ml-4 flex space-x-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                    View Details
                  </button>
                  {user.role === 'broker' && load.brokerId === user.brokerId && (
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">
                      Edit Load
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <div className="text-green-600 font-semibold">Available</div>
          <div className="text-2xl font-bold text-green-800">
            {stats.available}
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <div className="text-blue-600 font-semibold">Assigned</div>
          <div className="text-2xl font-bold text-blue-800">
            {stats.assigned}
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
          <div className="text-yellow-600 font-semibold">In Transit</div>
          <div className="text-2xl font-bold text-yellow-800">
            {stats.inTransit}
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
          <div className="text-gray-600 font-semibold">Total</div>
          <div className="text-2xl font-bold text-gray-800">
            {stats.total}
          </div>
        </div>
      </div>
    </div>
  )
}
