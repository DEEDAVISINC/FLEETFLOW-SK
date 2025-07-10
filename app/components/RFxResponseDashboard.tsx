'use client';

import React, { useState, useEffect } from 'react';
import { RFxResponseService, RFxRequest, MarketIntelligence, BidStrategy, RFxResponse, rfxResponseService } from '../services/RFxResponseService';

interface RFxResponseDashboardProps {
  embedded?: boolean;
}

const RFxResponseDashboard: React.FC<RFxResponseDashboardProps> = ({ embedded = false }) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'search' | 'intelligence' | 'responses' | 'analytics'>('requests');
  const [rfxRequests, setRFxRequests] = useState<RFxRequest[]>([]);
  const [searchResults, setSearchResults] = useState<RFxRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RFxRequest | null>(null);
  const [marketIntelligence, setMarketIntelligence] = useState<MarketIntelligence | null>(null);
  const [bidStrategy, setBidStrategy] = useState<BidStrategy | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: 'OPEN',
    priority: '',
  });
  const [searchParams, setSearchParams] = useState({
    location: '',
    equipment: '',
    commodity: '',
    keywords: '',
    platforms: ['government', 'industry', 'loadboards', 'enterprise']
  });

  useEffect(() => {
    loadRFxRequests();
  }, [filters]);

  const loadRFxRequests = async () => {
    setLoading(true);
    try {
      const requests = await rfxResponseService.getRFxRequests(filters);
      setRFxRequests(requests);
    } catch (error) {
      console.error('Error loading RFx requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchOpportunities = async () => {
    setSearchLoading(true);
    try {
      const opportunities = await rfxResponseService.searchRFxOpportunities(searchParams);
      setSearchResults(opportunities);
    } catch (error) {
      console.error('Error searching opportunities:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleRequestSelect = async (request: RFxRequest) => {
    setSelectedRequest(request);
    setLoading(true);
    try {
      const intelligence = await rfxResponseService.getMarketIntelligence(request.origin, request.destination, request.equipment);
      const strategy = await rfxResponseService.generateBidStrategy(request);
      setMarketIntelligence(intelligence);
      setBidStrategy(strategy);
    } catch (error) {
      console.error('Error loading request details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async (response: Partial<RFxResponse>) => {
    if (!selectedRequest) return;
    
    setLoading(true);
    try {
      await rfxResponseService.submitRFxResponse({
        ...response,
        rfxId: selectedRequest.id,
        type: selectedRequest.type,
      } as RFxResponse);
      
      // Refresh requests
      await loadRFxRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      OPEN: 'text-green-600 bg-green-50',
      CLOSED: 'text-red-600 bg-red-50',
      AWARDED: 'text-blue-600 bg-blue-50',
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  const getRFxTypeIcon = (type: string) => {
    const icons = {
      RFQ: '💰',
      RFB: '🎯',
      RFP: '📋',
      RFI: '❓',
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      LOW: 'text-green-600 bg-green-50',
      MEDIUM: 'text-yellow-600 bg-yellow-50',
      HIGH: 'text-orange-600 bg-orange-50',
      CRITICAL: 'text-red-600 bg-red-50',
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div>
      {/* FreightFlow Header - Only show if not embedded */}
      {!embedded && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center' as const
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 16px 0',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            📋 FreightFlow RFx Response Center
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0
          }}>
            Intelligent bid generation for RFB, RFQ, RFP, and RFI requests with live market intelligence
          </p>
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
        {[
          { key: 'requests', label: 'RFx Requests', icon: '📥' },
          { key: 'search', label: 'Find Opportunities', icon: '🔍' },
          { key: 'intelligence', label: 'Market Intelligence', icon: '📊' },
          { key: 'responses', label: 'My Responses', icon: '📤' },
          { key: 'analytics', label: 'Performance', icon: '📈' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              background: activeTab === tab.key
                ? 'rgba(59, 130, 246, 0.9)'
                : 'rgba(255, 255, 255, 0.9)',
              color: activeTab === tab.key ? 'white' : '#374151',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === tab.key 
                ? '0 4px 12px rgba(59, 130, 246, 0.3)' 
                : '0 2px 4px rgba(0, 0, 0, 0.1)',
              transform: activeTab === tab.key ? 'translateY(-1px)' : 'none'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Filters and Requests List */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter RFx Requests</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  >
                    <option value="">All Types</option>
                    <option value="RFQ">RFQ - Request for Quote</option>
                    <option value="RFB">RFB - Request for Bid</option>
                    <option value="RFP">RFP - Request for Proposal</option>
                    <option value="RFI">RFI - Request for Information</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <option value="">All Statuses</option>
                    <option value="OPEN">Open</option>
                    <option value="CLOSED">Closed</option>
                    <option value="AWARDED">Awarded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.priority}
                    onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                  >
                    <option value="">All Priorities</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
              {loading ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading RFx requests...</p>
                </div>
              ) : rfxRequests.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <p className="text-gray-600">No RFx requests found matching your filters.</p>
                </div>
              ) : (
                rfxRequests.map((request) => (
                  <div
                    key={request.id}
                    onClick={() => handleRequestSelect(request)}
                    className={`bg-white rounded-xl shadow-sm p-6 cursor-pointer transition-all hover:shadow-md border-2 ${
                      selectedRequest?.id === request.id ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getRFxTypeIcon(request.type)}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                          <p className="text-sm text-gray-600">{request.shipperName} • {request.origin} → {request.destination}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                          {request.priority}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">Estimated Value</span>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(request.estimatedValue)}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Deadline</span>
                        <p className="font-semibold text-gray-900">
                          {new Date(request.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Equipment</span>
                        <p className="font-semibold text-gray-900">{request.equipment}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Distance</span>
                        <p className="font-semibold text-gray-900">{request.distance} mi</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700">{request.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Side - Selected Request Details */}
          <div className="space-y-6">
            {selectedRequest ? (
              <>
                {/* Request Details */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-500">Type & Priority</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xl">{getRFxTypeIcon(selectedRequest.type)}</span>
                        <span className="font-semibold">{selectedRequest.type}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedRequest.priority)}`}>
                          {selectedRequest.priority}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-500">Requirements</span>
                      <div className="mt-2 space-y-1">
                        {selectedRequest.requirements?.map((req, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-sm text-gray-700">{req}</span>
                          </div>
                        )) || <p className="text-sm text-gray-500">No specific requirements listed</p>}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-gray-500">Route Information</span>
                      <div className="mt-2 bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">
                            {selectedRequest.origin} → {selectedRequest.destination}
                          </span>
                          <span className="text-sm text-gray-600">{selectedRequest.distance} mi</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Equipment: {selectedRequest.equipment} • Weight: {selectedRequest.weight} lbs
                        </div>
                        <div className="text-sm text-gray-600">
                          Commodity: {selectedRequest.commodity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Market Intelligence */}
                {marketIntelligence && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Intelligence</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Market Rate</span>
                          <p className="text-lg font-semibold text-green-600">
                            {formatCurrency(marketIntelligence.marketAverage)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Demand Level</span>
                          <p className="text-lg font-semibold text-orange-600 capitalize">
                            {marketIntelligence.demandLevel}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-500">Market Insights</span>
                        <div className="mt-2 space-y-1">
                          <div className="text-sm text-gray-700">• Trend: {marketIntelligence.trendDirection}</div>
                          <div className="text-sm text-gray-700">• Capacity Tightness: {marketIntelligence.capacityTightness}%</div>
                          <div className="text-sm text-gray-700">• Rate Range: {formatCurrency(marketIntelligence.rateRange.low)} - {formatCurrency(marketIntelligence.rateRange.high)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bid Strategy */}
                {bidStrategy && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Bid Strategy</h3>
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm text-gray-500">Recommended Rate</span>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(bidStrategy.recommendedRate)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Win Probability: <span className="font-semibold">{bidStrategy.winProbability}%</span>
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-500">Strategy Notes</span>
                        <div className="mt-2 space-y-1">
                          <div className="text-sm text-gray-700">• Positioning: {bidStrategy.competitivePositioning}</div>
                          <div className="text-sm text-gray-700">• Risk Level: {bidStrategy.riskAssessment.level}</div>
                          {bidStrategy.differentiators?.map((diff, index) => (
                            <div key={index} className="text-sm text-gray-700">• {diff}</div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleSubmitResponse({
                          proposedRate: bidStrategy.recommendedRate,
                          serviceDescription: bidStrategy.differentiators?.join('\n') || '',
                        })}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        disabled={loading}
                      >
                        {loading ? 'Submitting...' : 'Submit Response'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an RFx Request</h3>
                <p className="text-gray-600">Choose a request from the list to view details and generate a bid strategy.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Tab - Find New Opportunities */}
      {activeTab === 'search' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Search Form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>🔍 Search for RFx Opportunities</h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Location/Route
                </label>
                <input
                  type="text"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                  placeholder="e.g., Los Angeles, CA to Dallas, TX"
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Equipment Type
                </label>
                <select
                  value={searchParams.equipment}
                  onChange={(e) => setSearchParams({ ...searchParams, equipment: e.target.value })}
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="">All Equipment Types</option>
                  <option value="Dry Van">Dry Van</option>
                  <option value="Reefer">Refrigerated</option>
                  <option value="Flatbed">Flatbed</option>
                  <option value="Step Van">Step Van</option>
                  <option value="Box Truck">Box Truck</option>
                  <option value="Tanker">Tanker</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Commodity
                </label>
                <input
                  type="text"
                  value={searchParams.commodity}
                  onChange={(e) => setSearchParams({ ...searchParams, commodity: e.target.value })}
                  placeholder="e.g., Electronics, Food, Auto Parts"
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Keywords
                </label>
                <input
                  type="text"
                  value={searchParams.keywords}
                  onChange={(e) => setSearchParams({ ...searchParams, keywords: e.target.value })}
                  placeholder="e.g., transportation, logistics, freight"
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
            
            {/* Platform Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Search Platforms
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {[
                  { key: 'government', label: '🏛️ Government Contracts (SAM.gov)', desc: 'Federal, state & local government RFPs' },
                  { key: 'industry', label: '🏢 Industry Portals', desc: 'Corporate shipper procurement platforms' },
                  { key: 'loadboards', label: '📋 Load Boards', desc: 'DAT, Truckstop.com, and other load boards' },
                  { key: 'enterprise', label: '🏭 Enterprise Shippers', desc: 'Large retail and manufacturing RFx portals' }
                ].map((platform) => (
                  <label key={platform.key} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    padding: '8px 12px',
                    background: searchParams.platforms.includes(platform.key) ? '#eff6ff' : '#f9fafb',
                    borderRadius: '8px',
                    border: searchParams.platforms.includes(platform.key) ? '1px solid #3b82f6' : '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                    <input
                      type="checkbox"
                      checked={searchParams.platforms.includes(platform.key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSearchParams({
                            ...searchParams,
                            platforms: [...searchParams.platforms, platform.key]
                          });
                        } else {
                          setSearchParams({
                            ...searchParams,
                            platforms: searchParams.platforms.filter(p => p !== platform.key)
                          });
                        }
                      }}
                      style={{ margin: 0 }}
                    />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                        {platform.label}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {platform.desc}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <button
              onClick={searchOpportunities}
              disabled={searchLoading}
              style={{
                background: searchLoading ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: searchLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
            >
              {searchLoading ? '🔍 Searching...' : '🔍 Search Opportunities'}
            </button>
          </div>
          
          {/* Search Results */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>📋 Search Results ({searchResults.length} opportunities found)</h3>
            
            {searchLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid #e5e7eb',
                  borderTop: '3px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 16px'
                }}></div>
                <p style={{ color: '#6b7280' }}>Searching multiple platforms for RFx opportunities...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <p style={{ color: '#6b7280', fontSize: '16px' }}>
                  No opportunities found. Try adjusting your search criteria or click "Search Opportunities" to start.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {searchResults.map((opportunity) => (
                  <div
                    key={opportunity.id}
                    onClick={() => handleRequestSelect(opportunity)}
                    style={{
                      background: selectedRequest?.id === opportunity.id ? '#eff6ff' : '#ffffff',
                      border: selectedRequest?.id === opportunity.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: selectedRequest?.id === opportunity.id ? '0 4px 12px rgba(59, 130, 246, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '24px' }}>{getRFxTypeIcon(opportunity.type)}</span>
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                            {opportunity.title}
                          </h4>
                          <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                            {opportunity.shipperName} • {opportunity.origin} → {opportunity.destination}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{
                          background: getStatusColor(opportunity.status),
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {opportunity.status}
                        </span>
                        <span style={{
                          background: getPriorityColor(opportunity.priority),
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {opportunity.priority}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>Estimated Value</span>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: '2px 0 0 0' }}>
                          {formatCurrency(opportunity.estimatedValue)}
                        </p>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>Deadline</span>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: '2px 0 0 0' }}>
                          {new Date(opportunity.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>Equipment</span>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: '2px 0 0 0' }}>
                          {opportunity.equipment}
                        </p>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>Distance</span>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: '2px 0 0 0' }}>
                          {opportunity.distance} mi
                        </p>
                      </div>
                    </div>
                    
                    <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: '1.4' }}>
                      {opportunity.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Intelligence Tab */}
      {activeTab === 'intelligence' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Intelligence Dashboard</h3>
          <p className="text-gray-600">Live market intelligence and analytics will be displayed here.</p>
        </div>
      )}

      {/* Responses Tab */}
      {activeTab === 'responses' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My RFx Responses</h3>
          <p className="text-gray-600">Your submitted responses and their status will be displayed here.</p>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Analytics</h3>
          <p className="text-gray-600">Win rates, revenue metrics, and performance analytics will be displayed here.</p>
        </div>
      )}
    </div>
  );
};

export default RFxResponseDashboard;
