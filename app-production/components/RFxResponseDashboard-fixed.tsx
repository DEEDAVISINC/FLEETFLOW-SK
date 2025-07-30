'use client';

import React, { useState, useEffect } from 'react';
import { rfxResponseService, RFxRequest, MarketIntelligence, BidStrategy, RFxResponse } from '../services/RFxResponseService';

const RFxResponseDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'intelligence' | 'responses' | 'analytics'>('requests');
  const [rfxRequests, setRFxRequests] = useState<RFxRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RFxRequest | null>(null);
  const [marketIntelligence, setMarketIntelligence] = useState<MarketIntelligence | null>(null);
  const [bidStrategy, setBidStrategy] = useState<BidStrategy | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: 'OPEN',
    priority: '',
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

  const handleRequestSelect = async (request: RFxRequest) => {
    setSelectedRequest(request);
    setLoading(true);
    try {
      const intelligence = await rfxResponseService.getMarketIntelligence(request.id);
      const strategy = await rfxResponseService.generateBidStrategy(request.id);
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
      await rfxResponseService.submitResponse({
        ...response,
        requestId: selectedRequest.id,
        submittedAt: new Date(),
        status: 'SUBMITTED',
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

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6">
        {[
          { key: 'requests', label: 'RFx Requests', icon: '📥' },
          { key: 'intelligence', label: 'Market Intelligence', icon: '📊' },
          { key: 'responses', label: 'My Responses', icon: '📤' },
          { key: 'analytics', label: 'Performance', icon: '📈' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-blue-50'
            }`}
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
                          <p className="text-sm text-gray-600">{request.company} • {request.location}</p>
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
                        <span className="text-sm text-gray-500">Budget Range</span>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(request.budgetMin)} - {formatCurrency(request.budgetMax)}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Deadline</span>
                        <p className="font-semibold text-gray-900">
                          {new Date(request.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Lanes</span>
                        <p className="font-semibold text-gray-900">{request.lanes?.length || 0}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Distance</span>
                        <p className="font-semibold text-gray-900">{request.totalMiles || 'N/A'} mi</p>
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

                    {selectedRequest.lanes && selectedRequest.lanes.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-500">Lane Information</span>
                        <div className="mt-2 space-y-2">
                          {selectedRequest.lanes.map((lane, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">
                                  {lane.origin} → {lane.destination}
                                </span>
                                <span className="text-sm text-gray-600">{lane.distance} mi</span>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                Equipment: {lane.equipmentType} • Weight: {lane.weight} lbs
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                            {formatCurrency(marketIntelligence.averageRate)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Competition Level</span>
                          <p className="text-lg font-semibold text-orange-600 capitalize">
                            {marketIntelligence.competitionLevel}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-500">Demand Trends</span>
                        <div className="mt-2 space-y-1">
                          {marketIntelligence.demandTrends?.map((trend, index) => (
                            <div key={index} className="text-sm text-gray-700">• {trend}</div>
                          )) || <p className="text-sm text-gray-500">No trend data available</p>}
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
                        <span className="text-sm text-gray-500">Recommended Bid</span>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(bidStrategy.recommendedBid)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Win Probability: <span className="font-semibold">{bidStrategy.winProbability}%</span>
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-500">Strategy Notes</span>
                        <div className="mt-2 space-y-1">
                          {bidStrategy.strategies?.map((strategy, index) => (
                            <div key={index} className="text-sm text-gray-700">• {strategy}</div>
                          )) || <p className="text-sm text-gray-500">No strategy notes available</p>}
                        </div>
                      </div>

                      <button
                        onClick={() => handleSubmitResponse({
                          bidAmount: bidStrategy.recommendedBid,
                          notes: bidStrategy.strategies?.join('\n') || '',
                          attachments: [],
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
